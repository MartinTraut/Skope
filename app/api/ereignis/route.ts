import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { recordEvent } from "@/lib/metrics";

/**
 * Endpunkt für die zwei Ereignisse, die der Browser melden kann:
 * ein angetippter Telefonverweis und ein Seitenaufruf.
 *
 * Absichtlich winzig. Er nimmt zwei Wörter entgegen, prüft sie gegen eine
 * feste Liste und erhöht Zähler – keine Kennung, keine IP, kein Zeitstempel
 * unter Tagesgenau (siehe `lib/metrics.ts`). Die Antwort ist immer 204, auch
 * bei Unsinn im Body: Ein Beacon wertet die Antwort ohnehin nicht aus, und
 * eine sprechende Fehlermeldung wäre nur eine Einladung, den Endpunkt
 * auszuprobieren.
 */

export const runtime = "nodejs";
/* Der Endpunkt schreibt – er darf nicht als statische Antwort erstarren. */
export const dynamic = "force-dynamic";

const EVENTS = new Set(["telefon", "seite"]);
const SOURCE = /^[a-z0-9.-]{1,24}$/;
/* Nur Pfade der eigenen Seite, ohne Abfrage und Raute. */
const PATH = /^\/[a-z0-9/-]{0,60}$/;

/**
 * Drosselung wie beim Formular: Modul-Zustand, also pro Instanz. Auf Vercel
 * hebelt das ein Angreifer mit genug Aufrufen aus; der Schaden ist eine zu
 * hohe Zahl in einer Abrechnungsübersicht, nicht ein Datenabfluss. Wenn die
 * Zahlen wirklich Geld bewegen, gehört hier dieselbe Upstash-Drosselung hin,
 * die schon als TODO in `app/actions.ts` steht – der Speicher ist dann
 * ohnehin eingerichtet.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 40;
const hits = new Map<string, number[]>();

function limited(key: string, now: number) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

export async function POST(request: Request) {
  const done = new NextResponse(null, { status: 204 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return done;
  }
  if (!body || typeof body !== "object") return done;

  const { event, source, path } = body as Record<string, unknown>;
  if (typeof event !== "string" || !EVENTS.has(event)) return done;

  const h = await headers();
  const key =
    h.get("x-vercel-forwarded-for") ??
    h.get("x-forwarded-for")?.split(",").at(-1)?.trim() ??
    "unknown";
  if (limited(key, Date.now())) return done;

  const fields = [event];
  if (event === "telefon" && typeof source === "string" && SOURCE.test(source)) {
    fields.push(`telefon-quelle:${source}`);
  }
  if (event === "seite" && typeof path === "string" && PATH.test(path)) {
    fields.push(`seite:${path === "/" ? "start" : path.slice(1)}`);
  }

  await recordEvent(fields);
  return done;
}
