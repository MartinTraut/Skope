import { fieldSlug, type DayCounts } from "@/lib/metrics";
import type { ContactTopic } from "@/lib/data/topics";

/**
 * Beispielzahlen für die Kennzahlenseite, solange kein Speicher eingerichtet
 * ist.
 *
 * Sie sind **erfunden** und werden auf der Seite auch so ausgewiesen – in
 * Neon über der ersten Zahl, nicht in einer Fußnote. Der Grund ist derselbe
 * wie bei `lib/commerce.ts` und beim Formularversand: Es darf keinen Zustand
 * geben, in dem eine Zahl wie eine Messung aussieht, ohne eine zu sein. Eine
 * Abrechnungsgrundlage ist dafür der denkbar schlechteste Ort.
 *
 * Deterministisch erzeugt, nicht zufällig: Ein `Math.random()` gäbe bei jedem
 * Aufruf andere Werte, und dann wäre unklar, ob sich die Seite bewegt oder die
 * Daten. Die Größenordnung ist an einen Betrieb dieser Größe angelehnt –
 * rund 40 bis 60 Besuche am Tag, ein bis zwei Kontakte.
 */

/* Echte Anliegen aus `lib/data/topics.ts`, damit die Vorschau dieselben
   Bezeichnungen zeigt wie später die Messung – mit erfundenen Zahlen, aber
   nicht mit erfundenen Kategorien. */
const TOPICS: ContactTopic[] = [
  "Suchauftrag generalüberholter E-Scooter",
  "Frage zu einem Gerät",
  "Reparatur",
  "Sicherheits-Checkup (59,99 €)",
  "Wartungsvertrag Basis",
  "Versicherung: Haftpflicht",
  "Finanzierung: Mietkauf-Abo",
  "Altgerät abgeben / Recycling",
];

const QUELLEN = ["google", "direkt", "maps", "instagram", "kleinanzeigen"];

/** Wiederholbarer Pseudozufall – gleiche Eingabe, gleiche Zahl. */
function noise(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function demoDays(days: number, today: string): DayCounts[] {
  const end = new Date(`${today}T12:00:00Z`).getTime();
  const out: DayCounts[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(end - i * 86_400_000);
    const day = date.toISOString().slice(0, 10);
    const weekday = date.getUTCDay();
    const seed = i + 1;

    /* Samstag halb, Sonntag fast nichts – ohne dieses Gefälle liest sich eine
       Verlaufskurve wie ein Zufallsgenerator und nicht wie ein Betrieb. */
    const factor = weekday === 0 ? 0.25 : weekday === 6 ? 0.55 : 1;

    const seiten = Math.round((34 + noise(seed) * 26) * factor);
    const telefon = Math.round((1.1 + noise(seed * 3) * 1.9) * factor);
    const anfragen = Math.round((0.6 + noise(seed * 7) * 1.5) * factor);

    const counts: Record<string, number> = { seite: seiten };
    if (telefon > 0) {
      counts.telefon = telefon;
      counts[`telefon-quelle:${QUELLEN[Math.floor(noise(seed * 11) * 3)]}`] =
        telefon;
    }
    if (anfragen > 0) {
      counts.anfrage = anfragen;
      counts[`anfrage:${fieldSlug(TOPICS[Math.floor(noise(seed * 13) * TOPICS.length)])}`] =
        anfragen;
      counts[`quelle:${QUELLEN[Math.floor(noise(seed * 17) * QUELLEN.length)]}`] =
        anfragen;
    }
    out.push({ day, counts });
  }
  return out;
}
