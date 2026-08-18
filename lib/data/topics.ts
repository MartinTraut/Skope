/**
 * Erlaubte Anliegen der Formulare.
 * Serverseitig als Whitelist geprüft: `topic` landet im Mail-Betreff, und
 * FormData ist frei manipulierbar – ohne Prüfung wäre das ein Einfallstor
 * für Header-Injection.
 */

export const CONTACT_TOPICS = [
  "Reparatur",
  "Sicherheits-Checkup (59,99 €)",
  "Akku-Diagnose",
  "Kostenvoranschlag",
  "Wartungsvertrag Basis",
  "Wartungsvertrag Premium",
  "Versicherung: Haftpflicht",
  "Versicherung: Teilkasko inkl. Diebstahl",
  "Beratung zur Versicherung",
  "Suchauftrag refurbished E-Scooter",
  "Frage zu einem Gerät",
  "Beratung vor dem Kauf",
  "Altgerät abgeben / Recycling",
  "Sonstiges",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export const FALLBACK_TOPIC: ContactTopic = "Sonstiges";

export function isKnownTopic(value: string): value is ContactTopic {
  return (CONTACT_TOPICS as readonly string[]).includes(value);
}

/** Vorauswahl je Leistungsseite – Teilmengen der Whitelist. */
export const REPAIR_TOPICS = [
  "Reparatur",
  "Sicherheits-Checkup (59,99 €)",
  "Akku-Diagnose",
  "Kostenvoranschlag",
] as const satisfies readonly ContactTopic[];

export const INSURANCE_TOPICS = [
  "Versicherung: Haftpflicht",
  "Versicherung: Teilkasko inkl. Diebstahl",
  "Beratung zur Versicherung",
] as const satisfies readonly ContactTopic[];

export const PLAN_TOPICS = [
  "Wartungsvertrag Basis",
  "Wartungsvertrag Premium",
  "Sicherheits-Checkup (59,99 €)",
] as const satisfies readonly ContactTopic[];

export const RECYCLING_TOPICS = [
  "Altgerät abgeben / Recycling",
  "Kostenvoranschlag",
  "Reparatur",
] as const satisfies readonly ContactTopic[];

export const BUY_TOPICS = [
  "Suchauftrag refurbished E-Scooter",
  "Frage zu einem Gerät",
  "Beratung vor dem Kauf",
] as const satisfies readonly ContactTopic[];

/** Deeplink-Kürzel aus CTAs → Vorauswahl im Formular. */
export const TOPIC_BY_SLUG: Record<string, ContactTopic> = {
  "wartungsvertrag-basis": "Wartungsvertrag Basis",
  "wartungsvertrag-premium": "Wartungsvertrag Premium",
  reparatur: "Reparatur",
  checkup: "Sicherheits-Checkup (59,99 €)",
  versicherung: "Versicherung: Haftpflicht",
  kauf: "Suchauftrag refurbished E-Scooter",
  geraet: "Frage zu einem Gerät",
  recycling: "Altgerät abgeben / Recycling",
};
