import "server-only";

import { redisMode, redisPipeline } from "@/lib/redis";

/**
 * Kennzahlen der Website – Anfragen, Telefontipps, Herkunft.
 *
 * Zweck ist die Abrechnung: Der Betrieb soll nachlesen können, wie viele
 * Kontakte über die Website entstehen. Dafür braucht es keine Personen und
 * keine Sitzungen, sondern **Summen pro Tag**. Genau das steht hier und nichts
 * darüber hinaus.
 *
 * ## Was gespeichert wird
 *
 * Je Tag ein Hash mit Zählern, zum Beispiel:
 *
 *     skope:tag:2026-09-16  { anfrage: 4, anfrage:kauf-geraet: 2,
 *                             telefon: 11, quelle:google: 9, seite:/: 6 }
 *
 * **Keine IP, kein Cookie, keine Kennung, kein Zeitstempel unter Tagesgenau.**
 * Ein Zähler lässt sich nicht auf eine Person zurückführen, und es gibt nichts
 * zu löschen, was einer einzelnen Person gehörte – deshalb ist das hier kein
 * Tracking im Sinne des § 25 TDDDG und braucht keine Einwilligung. Wer diese
 * Datei erweitert, prüft zuerst, ob die neue Angabe diese Eigenschaft behält:
 * Eine Besucher-ID, eine Verweildauer je Sitzung oder ein Zeitstempel auf die
 * Minute genau brechen sie, und damit fällt ein Einwilligungsbanner an.
 *
 * ## Wo es liegt
 *
 * In einem Redis über die REST-Schnittstelle von Upstash – auf Vercel eine
 * Integration, sonst zwei Umgebungsvariablen. Absichtlich keine Datei und kein
 * Prozessspeicher: Beide überleben auf Vercel den nächsten Aufruf nicht.
 *
 *     UPSTASH_REDIS_REST_URL=…
 *     UPSTASH_REDIS_REST_TOKEN=…
 *
 * Fehlt eines von beiden, zählt die Seite nichts und **behauptet auch nicht,
 * etwas zu zählen**: `metricsMode()` liefert dann `off`, die Kennzahlenseite
 * sagt es und zeigt Beispielwerte, die als solche gekennzeichnet sind.
 * Dieselbe Regel wie bei `lib/commerce.ts` – es gibt keinen Zustand, in dem
 * eine Zahl aussieht wie eine Messung, ohne eine zu sein.
 */

export const METRIC_EVENTS = ["anfrage", "telefon", "route"] as const;
export type MetricEvent = (typeof METRIC_EVENTS)[number];

/** Aufbewahrung. 400 Tage, damit ein Jahresvergleich möglich bleibt. */
const TTL_SECONDS = 400 * 24 * 60 * 60;

const KEY = "skope:tag:";

/* Erlaubte Zeichen in einem Zählerfeld. Die Werte kommen teils aus der
   Adresszeile (`utm_source`), also aus fremder Hand: Ohne Filter ließen sich
   beliebig viele Felder mit beliebigen Namen in den Hash schreiben. */
const FIELD = /^[a-z0-9:._/-]{1,64}$/;

/**
 * Zählt die Seite überhaupt?
 *
 * Es ist dieselbe Frage wie „steht der Speicher", nur unter dem Namen, unter
 * dem die Kennzahlenseite sie stellt. Ohne Speicher wird nichts gezählt, und
 * die Seite sagt das, statt Beispielzahlen wie Messwerte aussehen zu lassen.
 */
export function metricsMode(): "on" | "off" {
  return redisMode();
}

/** Tagesschlüssel in Ortszeit – ein Betrieb rechnet nicht in UTC ab. */
export function dayKey(date = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Berlin",
  }).format(date);
}

const pipeline = (commands: string[][]) =>
  redisPipeline(commands, "kennzahlen");

/**
 * Ein Ereignis zählen.
 *
 * Wirft nie. Ein Kennzahlenspeicher, der eine Anfrage scheitern lässt, wäre
 * teurer als jede Zahl, die er liefert – der Aufrufer prüft das Ergebnis
 * deshalb auch nicht.
 */
export async function recordEvent(fields: string[]): Promise<void> {
  const clean = fields.filter((f) => FIELD.test(f));
  if (clean.length === 0) return;
  const key = KEY + dayKey();
  await pipeline([
    ...clean.map((field) => ["HINCRBY", key, field, "1"]),
    ["EXPIRE", key, String(TTL_SECONDS)],
  ]);
}

/**
 * Aus einem Anzeigetext ein Zählerfeld machen.
 *
 * Die Anliegen heißen „Sicherheits-Checkup (59,99 €)" oder „Versicherung:
 * Haftpflicht" – mit Leerzeichen, Klammern und Umlauten. So kämen sie nicht
 * durch `FIELD` und der erste Versuch zählte deshalb stillschweigend nur die
 * Summe, nie die Aufteilung. Die Rückübersetzung in den Klartext passiert in
 * `lib/metrics-view.ts` über dieselbe Funktion.
 */
export function fieldSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export type DayCounts = { day: string; counts: Record<string, number> };

/** Die letzten `days` Tage, ältester zuerst. */
export async function readDays(days: number): Promise<DayCounts[] | null> {
  const keys: string[] = [];
  const now = Date.now();
  for (let i = days - 1; i >= 0; i--) {
    keys.push(dayKey(new Date(now - i * 86_400_000)));
  }
  const res = await pipeline(keys.map((d) => ["HGETALL", KEY + d]));
  if (!res) return null;
  return keys.map((day, i) => {
    const raw = res[i];
    const counts: Record<string, number> = {};
    /* Upstash liefert HGETALL je nach Version als flaches Array oder als
       Objekt. Beides annehmen ist billiger als eine Version festzunageln. */
    if (Array.isArray(raw)) {
      for (let j = 0; j < raw.length; j += 2) {
        counts[String(raw[j])] = Number(raw[j + 1]) || 0;
      }
    } else if (raw && typeof raw === "object") {
      for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
        counts[k] = Number(v) || 0;
      }
    }
    return { day, counts };
  });
}
