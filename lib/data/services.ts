/** Leistungsdaten – Fakten und Preise 1:1 aus der Altseite. */

export type RepairArea = {
  slug: string;
  title: string;
  description: string;
  items: string[];
};

/** Die vier Werkstatt-Kompetenzfelder. */
export const repairAreas: RepairArea[] = [
  {
    slug: "elektronik",
    title: "Elektronik-Diagnose",
    description:
      "Wenn der Scooter Fehlercodes wirft, nicht anläuft oder sporadisch aussetzt, liegt die Ursache selten dort, wo sie sich zeigt. Wir lesen aus, statt zu tauschen.",
    items: [
      "Fehlercode-Auslesen",
      "Controller-Prüfung",
      "Display-Reparatur",
      "Kabelbaum-Instandsetzung",
    ],
  },
  {
    slug: "akku",
    title: "Akku-Service",
    description:
      "Der Akku ist das teuerste Bauteil und fast nie komplett defekt. Wir messen die tatsächliche Restkapazität, bevor über einen Austausch gesprochen wird.",
    items: [
      "Kapazitätsmessung",
      "Zellentausch",
      "BMS-Reparatur",
      "Ladezyklen-Auswertung",
    ],
  },
  {
    slug: "mechanik",
    title: "Mechanische Instandsetzung",
    description:
      "Bremsen, Lager und Klappmechanik sind die sicherheitsrelevanten Verschleißteile. Hier wird eingestellt und ersetzt, nicht improvisiert.",
    items: [
      "Bremsen-Einstellung",
      "Lager-Austausch",
      "Lenker-Reparatur",
      "Reifen- und Felgenwechsel",
      "Klapp-Mechanismus",
    ],
  },
  {
    slug: "motor",
    title: "Motor-Reparatur",
    description:
      "Ruckelnder Antrieb, Aussetzer, Leistungsverlust: Der Nabenmotor lässt sich in den meisten Fällen überholen statt ersetzen.",
    items: [
      "Nabenmotor-Diagnose",
      "Hallsensor-Austausch",
      "Motorlager-Wechsel",
      "Antriebsstrang-Überholung",
    ],
  },
];

/** Preisanker aus der Altseite – Richtwerte, kein verbindliches Angebot. */
export const priceAnchors = [
  { label: "Sicherheits-Checkup (komplett)", price: "59,99 €", lead: true },
  { label: "Bremsbeläge", price: "ab 15 €" },
  { label: "Reifenwechsel", price: "ab 25 €" },
  { label: "Elektronik-Reparatur", price: "ab 40 €" },
];

/** Bearbeitungszeiten aus der Altseite. */
export const turnaround = [
  {
    label: "Bremsen & Reifen",
    value: "meist am selben Tag",
  },
  {
    label: "Elektronik-Reparaturen",
    value: "1 bis 3 Werktage",
  },
  {
    label: "Premium-Wartungskunden",
    value: "Express innerhalb 24 h",
  },
];

/** Marken, die laut Altseite betreut werden. */
export const brands = [
  "Xiaomi",
  "Segway-Ninebot",
  "Tier",
  "Lime",
  "Bird",
  "Moover",
  "SoFlow",
  "Trekstor",
];

/** Was im 59,99-€-Checkup enthalten ist (Altseite, Wartungs-FAQ). */
export const checkupIncludes = [
  "Bremsen prüfen und einstellen",
  "Reifendruck und Profil kontrollieren",
  "Alle Schrauben nachziehen",
  "Akku-Diagnose mit Kapazitätsmessung",
  "Elektronik-Prüfung und Fehlerspeicher",
  "Verschleißteil-Kontrolle mit Protokoll",
];
