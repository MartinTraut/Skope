import { NextResponse } from "next/server";

import { recordEvent } from "@/lib/metrics";
import { clientKey, limit } from "@/lib/rate-limit";

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
 * Drosselung über `lib/rate-limit.ts`, also geteilt über alle Instanzen,
 * sobald der Redis-Speicher steht.
 *
 * Hier hängt mehr daran als beim Formular: Die Zahlen dieses Endpunkts sind
 * die Grundlage der Abrechnung. Eine Drosselung im Prozessspeicher ließ sich
 * auf Vercel mit genug gleichzeitigen Aufrufen aushebeln – der Schaden wäre
 * kein Datenabfluss, sondern eine zu hohe Zahl in einer Rechnung. Ohne
 * Speicher bleibt der alte Notbehelf pro Instanz, siehe `limiterMode()`.
 *
 * 40 Ereignisse je Minute: Ein Mensch kommt im Normalfall auf eine Handvoll
 * Seitenaufrufe, und eine schnelle Klickstrecke über zehn Routen bleibt weit
 * darunter.
 */
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

  const { ok } = await limit("ereignis", await clientKey(), 40, 60);
  if (!ok) return done;

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
