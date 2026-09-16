/**
 * Zahlungs- und Finanzierungsmodelle.
 *
 * Quellen: die Auskunft des Betreibers vom 16.09.2026 **und** die beiden
 * Vertragsmuster, die er am selben Tag nachgereicht hat
 * („Mietkauf- & Abo-Vertrag" und „Ratenkaufvertrag", beide mit
 * SEPA-Basislastschriftmandat). Was in keinem der drei Dokumente steht,
 * steht auch hier nicht – insbesondere **keine Raten, kein Zins, kein
 * Gesamtbetrag**. Das ist nicht Vorsicht, sondern § 16 PAngV: Wer eine
 * Finanzierung mit Zahlen bewirbt, muss den effektiven Jahreszins nennen.
 * Eine erfundene Beispielrate wäre also nicht nur falsch, sie zöge die ganze
 * Pflichtangabenkette nach sich.
 *
 * Aus den Verträgen sind vier Angaben hier eingezogen, die die erste Fassung
 * dieser Datei anders oder gar nicht hatte:
 *
 *   - **Die Laufzeit ist 24 *oder* 36 Monate**, nicht „zwischen 24 und 36".
 *     Der Vertrag führt zwei Stufen zur Auswahl, keine freie Spanne.
 *   - **Die Bonitätsprüfung ist bei beiden Modellen aufschiebende
 *     Bedingung**, nicht nur beim Ratenkauf (§ 2.1 bzw. § 3). Sie steht
 *     deshalb unter „Für beide Modelle gilt" und nicht mehr an einer Karte.
 *   - **Der Ratenkaufpreis enthält bereits sämtliche Aufschläge für die
 *     Finanzierung** (§ 2). Die Finanzierung ist also nicht kostenlos, und
 *     das gehört auf die Seite: Wer „Kaufpreis verteilt" liest, nimmt sonst
 *     an, es käme nichts dazu.
 *   - **Beim Ratenkauf trägt der Käufer ab der Übergabe Anmeldung,
 *     Versicherung, Wartung und Reparaturen selbst** (§ 5). Das ist der
 *     eigentliche Unterschied zum Abo und stand bisher nirgends.
 *
 * TODO Betreiber – vor dem Livegang zu klären. Die Punkte 2 und 6 betreffen
 * die Verträge selbst, nicht diese Seite, halten die Schaltung der Route
 * aber trotzdem auf:
 *   1. Gilt die Finanzierung auch für die generalüberholten Einzelstücke aus
 *      dem Bestand? Die Rauslösesumme ist im Vertrag mit „20 % des regulären
 *      Fahrzeug-Neupreises" angegeben – bei einem Gebrauchtgerät ist der
 *      Neupreis keine Größe, die im Kaufvorgang vorkommt. Bis zur Klärung
 *      nennt die Bestandsseite keine Finanzierung je Gerät, sondern verweist
 *      nur auf diese Seite.
 *   2. **Beiden Verträgen fehlt die Widerrufsbelehrung.** Mietkauf und
 *      Ratenkauf an Verbraucher sind entgeltliche Finanzierungshilfen
 *      (§ 506 BGB) mit Widerrufsrecht nach § 495 BGB; ohne ordnungsgemäße
 *      Belehrung beginnt die Frist nicht zu laufen. Ebenso fehlen die
 *      Pflichtangaben nach Art. 247 EGBGB – effektiver Jahreszins,
 *      Sollzinssatz, Nettobetrag, Gesamtbetrag, Anzahl und Fälligkeit der
 *      Raten, Verzugszinssatz. Beim Ratenkauf ist der Zins vorhanden (§ 2
 *      nennt die Aufschläge), nur nicht beziffert.
 *   3. Die geplante Vermittlung von Bankkrediten braucht eine Erlaubnis nach
 *      § 34c Abs. 1 Nr. 2 GewO. Deshalb steht das Modell hier als „in
 *      Vorbereitung" und ohne Anfragemöglichkeit.
 *   4. Die im Abo enthaltene Haftpflicht- und Vollkaskoversicherung (§ 3)
 *      fällt unter dieselbe offene Frage wie die ERGO-Vermittlung (§ 34d
 *      GewO, siehe Faktenaudit in CLAUDE.md) – jetzt schriftlich belegt.
 *   5. E-Chopper und E-Trike sind in der Auskunft ausdrücklich genannt,
 *      kommen im Bestand aber nicht vor. Werden sie verkauft oder nur
 *      finanziert?
 *   6. Die Verzugsklauseln gehen über § 498 BGB hinaus (dort: Verzug mit
 *      zwei aufeinanderfolgenden Raten **und** einem Mindestanteil am
 *      Nennbetrag, dazu zweiwöchige Nachfrist mit Kündigungsandrohung).
 *      Außerdem kommt die einjährige Gewährleistung, die die Seite zusagt,
 *      in keinem der beiden Verträge vor, und die Bonitätsprüfung samt
 *      Personalausweisnummer gehört in die Datenschutzerklärung
 *      (Art. 13 DSGVO). Anwaltlich prüfen lassen.
 */

export type FinancingModel = {
  id: "mietkauf" | "ratenkauf" | "bank";
  /** „Verfügbar" trägt eine Anfrage, „geplant" bewusst keine. */
  available: boolean;
  name: string;
  claim: string;
  description: string;
  /** Die harten Eckdaten, die in Auskunft oder Vertrag belegt sind. */
  facts: { label: string; value: string }[];
  features: string[];
  /**
   * Was das Modell ausdrücklich **nicht** trägt.
   *
   * Beim Ratenkauf ist das der Kern der Entscheidung: Anmeldung,
   * Versicherung und Wartung liegen ab der Übergabe beim Käufer, während sie
   * im Abo in der Rate stecken. Ohne diese Liste stehen zwei Karten
   * nebeneinander, von denen die eine mehr Häkchen hat – und der Leser hält
   * das für einen Mangel an Leistung statt für einen anderen Zuschnitt.
   */
  excludes?: string[];
  note?: string;
};

export const financingModels: FinancingModel[] = [
  {
    id: "mietkauf",
    available: true,
    name: "Mietkauf-Abo",
    claim: "Eine Rate, in der alles enthalten ist.",
    description:
      "Für alle, die monatlich mit einem festen Betrag rechnen wollen. Anmeldung, Versicherung und die Wartung in unserer Werkstatt sind in der Rate enthalten, es kommt also während der Laufzeit nichts dazu. Nach Ablauf können Sie das Fahrzeug übernehmen.",
    facts: [
      { label: "Laufzeit", value: "24 oder 36 Monate" },
      { label: "Übernahme", value: "20 % des Neupreises" },
      { label: "Enthalten", value: "Versicherung und Service" },
    ],
    features: [
      "Anmeldung des Fahrzeugs",
      "Haftpflicht- und Vollkaskoversicherung",
      "Regelmäßiger Service und Inspektionen",
      "Übernahme zur vertraglich festgelegten Rauslösesumme",
    ],
    excludes: [
      "Verschleiß und Schäden durch unsachgemäße Nutzung",
    ],
    note: "Die Rauslösesumme steht als fester Betrag im Vertrag und ändert sich während der Laufzeit nicht. Bis sie gezahlt ist, bleibt das Fahrzeug unser Eigentum. Die Übernahme ist Ihr Recht, keine Pflicht.",
  },
  {
    id: "ratenkauf",
    available: true,
    name: "Ratenkauf mit Anzahlung",
    claim: "Das Fahrzeug gehört Ihnen mit der letzten Rate.",
    description:
      "Für alle, die das Fahrzeug selbst halten und den Kaufpreis trotzdem verteilen wollen. Sie leisten bei der Übergabe eine Anzahlung, der Restbetrag läuft über eine vereinbarte Laufzeit per SEPA-Lastschrift.",
    facts: [
      { label: "Anzahlung", value: "individuell, bei Übergabe" },
      { label: "Raten", value: "monatlich per SEPA-Lastschrift" },
      { label: "Eigentum", value: "mit der letzten Rate" },
    ],
    features: [
      "Individuelle Anzahlung bei der Übergabe",
      "Restbetrag in monatlichen Raten",
      "Eigentumsübergang ohne weitere Zahlung",
      "Gesamtkaufpreis steht vor der Unterschrift fest",
    ],
    excludes: [
      "Anmeldung und Versicherung ab der Übergabe",
      "Wartung und Reparaturen ab der Übergabe",
    ],
    note: "Im ausgewiesenen Gesamtkaufpreis sind die Aufschläge für die Finanzierung bereits enthalten – er liegt also über dem Barpreis. Bis zur vollständigen Zahlung bleibt das Fahrzeug unser Eigentum.",
  },
  {
    id: "bank",
    available: false,
    name: "Bankfinanzierung",
    claim: "In Vorbereitung.",
    description:
      "Für klassische Ratenkredite direkt vor Ort bereiten wir eine Zusammenarbeit mit Partnerbanken vor, unter anderem mit Consors Finanz. Das Angebot steht noch nicht; bis dahin gelten die beiden Modelle darüber.",
    facts: [],
    features: [],
  },
];

/**
 * Was zu jeder Finanzierung gehört und was nicht auf dieser Seite steht.
 *
 * Der erste Eintrag ist keine Floskel: Rate, Laufzeit und Gesamtbetrag hängen
 * am Fahrzeug und am gewählten Modell, und genau deshalb steht auf dieser
 * Seite keine einzige Beispielzahl.
 *
 * Bonität und Einzugstermin stehen hier und nicht an einer der beiden Karten,
 * weil beide Verträge sie gleichlautend führen. An einer Karte gelesen wären
 * sie ein Unterschied zwischen den Modellen, und das sind sie nicht.
 */
export const financingTerms = {
  intro:
    "Welcher Betrag monatlich anfällt, hängt vom Fahrzeug, vom gewählten Modell und von der Laufzeit ab.",
  items: [
    "Rate, Laufzeit und Gesamtbetrag stehen vollständig in Ihrem Angebot, bevor Sie unterschreiben.",
    "Beide Verträge setzen eine positive Bonitätsprüfung voraus. Welche Unterlagen wir dafür brauchen, sagen wir Ihnen vor der Anfrage.",
    "Die Rate wird zum 1. eines Monats per SEPA-Lastschrift eingezogen; fällt der auf ein Wochenende oder einen Feiertag, am nächsten Werktag.",
    "Beratung vor Ort in Neuenstadt am Kocher oder telefonisch und per E-Mail.",
    "Die Modelle gelten für E-Scooter, E-Chopper und E-Trike.",
  ],
} as const;
