import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

import { fieldSlug, readDays, type DayCounts } from "@/lib/metrics";
import { CONTACT_TOPICS } from "@/lib/data/topics";

/* Zählerfeld → Anzeigetext. Aus derselben Liste erzeugt, die das Formular
   anbietet: Käme die Karte von Hand, fehlte beim vierzehnten Anliegen ein
   Eintrag und die Auswertung zeigte einen Slug. */
const TOPIC_BY_FIELD = new Map(
  CONTACT_TOPICS.map((topic) => [fieldSlug(topic), topic]),
);

/**
 * Aufbereitung der Tageszähler für die Kennzahlenseite.
 *
 * Getrennt von `lib/metrics.ts`, weil das Schreiben in jeder Server Action
 * hängt und das Lesen nur an einer einzigen Seite: Was hier an Auswertung
 * dazukommt, soll nicht im Pfad jeder Formularanfrage liegen.
 */

export type Summary = {
  days: DayCounts[];
  /** Gesamtsummen über den Zeitraum. */
  total: {
    anfragen: number;
    telefon: number;
    kontakte: number;
    seiten: number;
  };
  /** Anfragen je Anliegen, absteigend. */
  themen: { label: string; value: number }[];
  /** Kontakte je Herkunft, absteigend. */
  quellen: { label: string; value: number }[];
  /** Kontakte je Tag für die Balken. */
  verlauf: { day: string; anfragen: number; telefon: number }[];
};

function sum(days: DayCounts[], field: string) {
  return days.reduce((n, d) => n + (d.counts[field] ?? 0), 0);
}

function byPrefix(days: DayCounts[], prefix: string) {
  const acc = new Map<string, number>();
  for (const day of days) {
    for (const [key, value] of Object.entries(day.counts)) {
      if (key.startsWith(prefix)) {
        const name = key.slice(prefix.length);
        acc.set(name, (acc.get(name) ?? 0) + value);
      }
    }
  }
  return [...acc.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

const QUELLE_LABEL: Record<string, string> = {
  google: "Google-Suche",
  maps: "Google Maps",
  direkt: "Direkt eingegeben",
  instagram: "Instagram",
  facebook: "Facebook",
  kleinanzeigen: "Kleinanzeigen",
  ebay: "eBay",
  bing: "Bing",
  unbekannt: "Ohne Angabe",
  sonstige: "Sonstige",
};

export function summarize(days: DayCounts[]): Summary {
  const anfragen = sum(days, "anfrage");
  const telefon = sum(days, "telefon");

  /* Herkunft aus zwei Töpfen: `quelle:` kommt vom abgeschickten Formular,
     `telefon-quelle:` vom angetippten Telefonverweis. Beides sind Kontakte
     und gehören in dieselbe Aufstellung – getrennt geführt wäre es zweimal
     dieselbe Frage mit zwei Antworten. */
  const quellenMap = new Map<string, number>();
  for (const entry of [
    ...byPrefix(days, "quelle:"),
    ...byPrefix(days, "telefon-quelle:"),
  ]) {
    quellenMap.set(entry.label, (quellenMap.get(entry.label) ?? 0) + entry.value);
  }

  return {
    days,
    total: {
      anfragen,
      telefon,
      kontakte: anfragen + telefon,
      seiten: sum(days, "seite"),
    },
    themen: byPrefix(days, "anfrage:").map((t) => ({
      label: TOPIC_BY_FIELD.get(t.label) ?? t.label,
      value: t.value,
    })),
    quellen: [...quellenMap.entries()]
      .map(([label, value]) => ({
        label: QUELLE_LABEL[label] ?? label,
        value,
      }))
      .sort((a, b) => b.value - a.value),
    verlauf: days.map((d) => ({
      day: d.day,
      anfragen: d.counts.anfrage ?? 0,
      telefon: d.counts.telefon ?? 0,
    })),
  };
}

export async function loadSummary(days: number) {
  const raw = await readDays(days);
  return raw ? summarize(raw) : null;
}

/* ------------------------------------------------------------------ *
 * Zugang
 * ------------------------------------------------------------------ */

export const METRICS_COOKIE = "skope_kennzahlen";

/**
 * Der Cookie trägt nicht das Passwort, sondern seinen Hash. Wer ihn abliest,
 * kommt damit auf diese Seite – aber nicht an das Passwort selbst, und das ist
 * der Wert, der anderswo wiederverwendet sein könnte.
 */
export function accessToken(password: string) {
  return createHash("sha256")
    .update(`skope-kennzahlen:${password}`)
    .digest("hex");
}

export function metricsPassword() {
  const value = process.env.METRICS_PASSWORD?.trim();
  return value && value.length >= 8 ? value : null;
}

/** Zeitkonstanter Vergleich – ein `===` auf Zeichenketten verrät über die
 *  Laufzeit, wie viele Zeichen am Anfang stimmen. */
export function sameSecret(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
