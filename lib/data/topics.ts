/**
 * Erlaubte Anliegen der Formulare.
 * Serverseitig als Whitelist geprüft: `topic` landet im Mail-Betreff, und
 * FormData ist frei manipulierbar – ohne Prüfung wäre das ein Einfallstor
 * für Header-Injection.
 */

export const CONTACT_TOPICS = [
  "Suchauftrag generalüberholter E-Scooter",
  "Frage zu einem Gerät",
  "Beratung vor dem Kauf",
  "Reparatur",
  "Sicherheits-Checkup (59,99 €)",
  "Akku-Diagnose",
  "Kostenvoranschlag",
  "Wartungsvertrag Basis",
  "Wartungsvertrag Premium",
  "Versicherung: Haftpflicht",
  "Versicherung: Teilkasko inkl. Diebstahl",
  "Beratung zur Versicherung",
  "Altgerät abgeben / Recycling",
  "Sonstiges",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export const FALLBACK_TOPIC: ContactTopic = "Sonstiges";

export function isKnownTopic(value: string): value is ContactTopic {
  return (CONTACT_TOPICS as readonly string[]).includes(value);
}

/**
 * Dieselben vierzehn Anliegen, in Gruppen.
 *
 * Jede Leistungsseite zeigt jetzt das vollständige Formular – vorher sah man
 * unter der Reparaturseite nur vier Anliegen und unter dem Recycling nur
 * drei. Wer beim Lesen der einen Seite eine Frage zur anderen bekam, musste
 * dafür die Seite wechseln, und die Anfrage kam unter dem falschen Betreff an
 * oder gar nicht.
 *
 * Vierzehn Einträge in einer Reihe sind aber eine Liste zum Durchscrollen.
 * `<optgroup>` ist dafür der native Weg: Auf dem Telefon setzt iOS die
 * Gruppentitel als Zwischenüberschriften ins Rad, Android in die Liste – ohne
 * eigenes Menü, das erst Tastaturbedienung und Screenreader nachbauen müsste.
 *
 * Die Gruppen decken die Whitelist vollständig ab – geprüft wird das eine
 * Zeile weiter unten vom Typechecker, damit ein neues Anliegen nicht still
 * aus dem Formular fällt.
 */
export const TOPIC_GROUPS = [
  {
    label: "Kauf",
    topics: [
      "Suchauftrag generalüberholter E-Scooter",
      "Frage zu einem Gerät",
      "Beratung vor dem Kauf",
    ],
  },
  {
    label: "Reparatur & Wartung",
    topics: [
      "Reparatur",
      "Sicherheits-Checkup (59,99 €)",
      "Akku-Diagnose",
      "Kostenvoranschlag",
    ],
  },
  {
    label: "Wartungsverträge",
    topics: ["Wartungsvertrag Basis", "Wartungsvertrag Premium"],
  },
  {
    label: "Versicherung",
    topics: [
      "Versicherung: Haftpflicht",
      "Versicherung: Teilkasko inkl. Diebstahl",
      "Beratung zur Versicherung",
    ],
  },
  {
    label: "Recycling",
    topics: ["Altgerät abgeben / Recycling"],
  },
  {
    label: "Anderes",
    topics: ["Sonstiges"],
  },
] as const satisfies readonly {
  label: string;
  topics: readonly ContactTopic[];
}[];

/**
 * Kein Anliegen ohne Gruppe: Fehlt eines in `TOPIC_GROUPS`, wird dieser Typ
 * `never` und `npx tsc --noEmit` bricht mit der Zeile ab, an der es fehlt.
 */
export type GroupedTopic = (typeof TOPIC_GROUPS)[number]["topics"][number];
type AllTopicsGrouped = ContactTopic extends GroupedTopic ? true : never;
export const allTopicsGrouped: AllTopicsGrouped = true;

/** Deeplink-Kürzel aus CTAs → Vorauswahl im Formular. */
export const TOPIC_BY_SLUG: Record<string, ContactTopic> = {
  "wartungsvertrag-basis": "Wartungsvertrag Basis",
  "wartungsvertrag-premium": "Wartungsvertrag Premium",
  reparatur: "Reparatur",
  checkup: "Sicherheits-Checkup (59,99 €)",
  versicherung: "Versicherung: Haftpflicht",
  kauf: "Suchauftrag generalüberholter E-Scooter",
  geraet: "Frage zu einem Gerät",
  recycling: "Altgerät abgeben / Recycling",
};
