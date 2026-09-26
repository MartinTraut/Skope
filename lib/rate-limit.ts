import "server-only";

import { headers } from "next/headers";

import { redisPipeline, redisMode } from "@/lib/redis";

/**
 * Drosselung für alle unauthentifizierten Endpunkte.
 *
 * Bis zum 26.09.2026 lag sie als `Map` im Modulzustand von `app/actions.ts`.
 * Das war auf einem einzelnen Server richtig und auf Vercel wirkungslos: Jede
 * Lambda-Instanz hält ihre eigene Map, ein kalter Start räumt sie, und bei
 * genug gleichzeitigen Aufrufen bekommt praktisch jede Anfrage einen frischen
 * Eimer. Ein Skript hätte das Postfach des Betreibers füllen können, ohne je
 * an ein Limit zu stoßen.
 *
 * Jetzt zählt Redis (`INCR` plus `EXPIRE` beim ersten Treffer, also atomar
 * und über alle Instanzen hinweg). **Ohne Speicher bleibt der alte Notbehelf
 * im Prozess** – lieber ein Limit, das nur je Instanz greift, als gar keins.
 * Welcher Weg gilt, sagt `limiterMode()`; die Kennzahlenseite zeigt es an.
 *
 * Der Schlüssel ist **nicht** die rohe IP: Gespeichert wird ein gekürzter
 * HMAC daraus. Ein Eimer muss wiedererkennen, nicht identifizieren, und eine
 * Klartext-IP in einem Speicher mit Tagesfrist wäre ein personenbezogenes
 * Datum mehr, als die Aufgabe braucht.
 */
const memory = new Map<string, number[]>();

export type LimitResult = { ok: boolean; remaining: number };

export function limiterMode(): "shared" | "instance" {
  return redisMode() === "on" ? "shared" : "instance";
}

/**
 * Schlüssel des Aufrufers.
 *
 * `x-forwarded-for` ist vom Client frei setzbar: Wer den Header selbst mit
 * einer Zufalls-IP füllt, bekommt bei jedem Aufruf einen neuen Eimer. Zu
 * trauen ist nur dem Eintrag, den der eigene Proxy anhängt – das ist der
 * LETZTE, nicht der erste. Auf Vercel steht die geprüfte Adresse zusätzlich
 * in `x-vercel-forwarded-for`; die hat Vorrang. `x-real-ip` steht bewusst
 * nicht in der Reihe: Ohne Proxy ist er frei setzbar.
 *
 * Fehlt jeder vertrauenswürdige Header, teilen sich alle Aufrufer einen
 * Eimer – lieber zu streng als gar nicht.
 */
export async function clientKey(): Promise<string> {
  const h = await headers();
  const raw =
    h.get("x-vercel-forwarded-for") ??
    h.get("x-forwarded-for")?.split(",").at(-1)?.trim() ??
    "unknown";
  return hash(raw);
}

function hash(value: string) {
  /* Ein Streuwert, kein Geheimnis: Der Eimer muss nur wiedererkennen. Mit
     `LIMIT_SALT` in der Umgebung lässt sich aus dem Eintrag im Speicher auch
     mit der Liste aller IPv4-Adressen nicht zurückrechnen, welche es war. */
  const salt = process.env.LIMIT_SALT ?? "skope";
  let h1 = 0x811c9dc5;
  for (const ch of salt + "|" + value) {
    h1 ^= ch.charCodeAt(0);
    h1 = Math.imul(h1, 0x01000193) >>> 0;
  }
  return h1.toString(36);
}

/**
 * Einen Treffer zählen und sagen, ob er noch durchgeht.
 *
 * `bucket` trennt die Zwecke (Formular, Ereigniszähler), `key` den Aufrufer.
 * Der Fenster­schlüssel enthält die laufende Fensternummer, damit kein
 * Zurücksetzen nötig ist: Läuft das Fenster ab, zeigt der nächste Aufruf auf
 * einen anderen Schlüssel, und der alte verfällt von allein.
 */
export async function limit(
  bucket: string,
  key: string,
  max: number,
  windowSeconds: number,
): Promise<LimitResult> {
  const now = Date.now();
  const slot = Math.floor(now / (windowSeconds * 1000));
  const redisKey = `skope:limit:${bucket}:${slot}:${key}`;

  const res = await redisPipeline(
    [
      ["INCR", redisKey],
      ["EXPIRE", redisKey, String(windowSeconds * 2)],
    ],
    "drosselung",
  );

  if (res) {
    const count = Number(res[0] ?? 0);
    return { ok: count <= max, remaining: Math.max(0, max - count) };
  }

  /* Kein Speicher: derselbe Zähler im Prozess. Er überlebt keinen kalten
     Start und gilt nur für diese Instanz – als einziger Schutz zu wenig, als
     Rückfall besser als nichts. */
  const id = `${bucket}:${key}`;
  const windowMs = windowSeconds * 1000;
  const recent = (memory.get(id) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  memory.set(id, recent);
  if (memory.size > 5000) {
    for (const [k, v] of memory) {
      if (v.every((t) => now - t >= windowMs)) memory.delete(k);
    }
  }
  return { ok: recent.length <= max, remaining: Math.max(0, max - recent.length) };
}
