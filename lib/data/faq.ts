/**
 * FAQ – interview-artig aufgebaut:
 * Frage so, wie sie tatsächlich gestellt wird (Long-Tail),
 * Antwort beginnt mit der direkten Antwort, danach die Details.
 *
 * Gekürzt am 26.09.2026. Die Antworten waren 60 bis 100 Wörter lang und
 * wiederholten in der zweiten Hälfte, was auf derselben Seite ohnehin steht.
 * Jetzt: eine Frage, ein Thema, danach nur die Angaben, die den Unterschied
 * machen. Zwei Regeln, die dabei gelernt wurden und nicht wieder aufgeweicht
 * werden dürfen:
 *
 * - **Keine Aussage über den aktuellen Bestand.** „Zwei Geräte ausdrücklich
 *   nicht" war beim Schreiben richtig und ist beim nächsten Verkauf falsch.
 *   Was gerade gilt, steht an der Karte und auf der Geräteseite – und nur
 *   dort, weil es dort aus den Daten kommt.
 * - **Keine zwei Fragen zum selben Thema.** Wartungsvertrag („lohnt sich das"
 *   und „Basis oder Premium") und Finanzierung (Unterschied, Rauslösesumme,
 *   Versicherung im Abo) beantworteten sich gegenseitig.
 *
 * Alle Zahlen stammen aus `lib/data/*` bzw. der Auskunft des Betreibers.
 */

export type FaqItem = { q: string; a: string };

export const faqRepair: FaqItem[] = [
  {
    q: "Welche E-Scooter Marken repariert ihr in eurer Werkstatt in Neuenstadt?",
    a: "Alle gängigen Marken: Xiaomi, Segway-Ninebot, Tier, Lime, Bird, Moover, SoFlow und Trekstor, dazu Importgeräte und exotische Modelle. Ist ein Ersatzteil nicht lieferbar, sagen wir Ihnen das vorab.",
  },
  {
    q: "Was kostet eine E-Scooter Reparatur bei euch ungefähr?",
    a: "Bremsbeläge ab 15 €, Reifenwechsel ab 25 €, Elektronik ab 40 €. Der Sicherheits-Checkup mit allen sechs Prüfpositionen kostet 59,99 €. Vor jeder Arbeit bekommen Sie einen Kostenvoranschlag; getauscht wird nur, was Sie freigegeben haben. Es sind Endpreise, nach § 19 UStG ohne Umsatzsteuer.",
  },
  {
    q: "Wie lange dauert es, bis ich meinen E-Scooter wieder abholen kann?",
    a: "Bremsen und Reifen meist am selben Tag, Elektronik ein bis drei Werktage – Fehlersuche und Bauteilbeschaffung kosten Zeit. Mit Premium-Wartungsvertrag werden Sie bevorzugt innerhalb von 24 Stunden bearbeitet.",
  },
  {
    q: "Mein Akku hält kaum noch. Muss ich gleich einen neuen kaufen?",
    a: "Meistens nicht. Wir messen zuerst die Restkapazität und lesen die Ladezyklen aus. Häufig liegt es am Batterie-Management-System oder an einzelnen schwachen Zellen, und beides lässt sich gezielt instand setzen. Ein kompletter Akkuwechsel ist die letzte Option.",
  },
  {
    q: "Lohnt sich eine Reparatur überhaupt, oder soll ich lieber einen neuen Scooter kaufen?",
    a: "Meistens lohnt sie sich: Reifen, Bremsen und Elektronikfehler kosten einen Bruchteil des Neupreises, und der Scooter ist danach wieder verkehrssicher. Rechnet sich eine Reparatur im Einzelfall nicht, sagen wir das und nehmen das Altgerät kostenlos zurück.",
  },
];

/**
 * Wartungsverträge.
 *
 * Bis zum 26.09.2026 standen hier vier Fragen, davon zwei („Lohnt sich ein
 * Wartungsvertrag" und „Basis oder Premium") mit derselben Antwort in anderer
 * Reihenfolge. Der Vergleich beantwortet beide.
 */
export const faqPlans: FaqItem[] = [
  {
    q: "Welcher Wartungsvertrag passt zu mir, Basis oder Premium?",
    a: "Basis für Gelegenheitsfahrer, Premium für Pendler. Basis kostet 130 € im Jahr und enthält den jährlichen Sicherheitscheck und 10 % Rabatt auf Ersatzteile. Premium kostet 17,99 € im Monat (215,88 € im Jahr, 12 Monate Mindestlaufzeit) und bringt zusätzlich den Akku-Deep-Check, 20 % Rabatt, Vorrang bei der Terminvergabe, Express-Bearbeitung bevorzugt innerhalb von 24 Stunden und den Hol- und Bringservice.",
  },
  {
    q: "Wo findet die Wartung statt, und holt ihr den Scooter auch ab?",
    a: "In unserer Werkstatt Im Kampfrad 3 in Neuenstadt am Kocher. Premium-Kunden nutzen den Hol- und Bringservice im Umkreis von 15 km; das deckt Heilbronn, Neckarsulm und Bad Friedrichshall ab.",
  },
  {
    q: "Sind Ersatzteile im Wartungsvertrag enthalten?",
    a: "Nein, die Verträge decken die Arbeitszeit ab. Ersatzteile wie Reifen oder Bremsbeläge berechnen wir separat und weisen sie einzeln auf der Rechnung aus – mit 10 % Rabatt im Basis- und 20 % im Premium-Vertrag. Nicht abgedeckt sind Schäden durch Tuning, Sprünge, Hochdruckreiniger oder Unfälle.",
  },
];

/**
 * Winterlagerung. Alle Zahlen stammen aus der Auskunft des Betreibers vom
 * 25.09.2026 – was dort nicht steht, steht auch hier nicht: kein Wort über
 * Haftung, Versicherung, Transport oder die Zahl der Stellplätze. Die offenen
 * Punkte sind in `lib/data/storage.ts` festgehalten.
 */
export const faqStorage: FaqItem[] = [
  {
    q: "Was kostet es, meinen E-Scooter bei euch über den Winter einzulagern?",
    a: "29,99 € im Monat als Endpreis, nach § 19 UStG ohne Umsatzsteuer, bei zwei Monaten Mindestlaufzeit. Enthalten sind der temperierte Stellplatz, das Batterie-Monitoring, die Standentlastung von Reifen und Fahrwerk und der Sicherheitscheck vor der Abholung.",
  },
  {
    q: "Was passiert mit dem Akku, solange der Scooter eingelagert ist?",
    a: "Er wird auf Lagerspannung gehalten, also zwischen 50 und 70 Prozent, und regelmäßig kontrolliert. Ein Lithium-Akku, der über Monate voll geladen oder tief entladen in der Kälte steht, verliert Kapazität – und dieser Verlust kommt im Frühjahr nicht zurück.",
  },
  {
    q: "Wie lange muss ich den Scooter mindestens einlagern, und wann bekomme ich ihn zurück?",
    a: "Mindestens zwei Monate, nach oben ist die Laufzeit offen. Im Anfrageformular wählen Sie den voraussichtlichen Abholmonat – Februar, März oder April. Steht er noch nicht fest, klären wir den Termin bei der Übergabe.",
  },
  {
    q: "Was ist im VIP Detailing für 49 € enthalten?",
    a: "Eine Tiefenreinigung und eine Kunststoff-Versiegelung, beides direkt vor der Abholung. Die Leistung kreuzen Sie im Anfrageformular an und zahlen sie einmalig, nicht monatlich.",
  },
];

/**
 * Versicherung.
 *
 * Die Frage „Kann ich die Plakette im Laden mitnehmen" ist am 26.09.2026
 * weggefallen: Ihre Antwort war seit dem 03.09. die der Frage davor, und der
 * letzte Satz („Die sofortige Mitnahme gibt es nur bei uns in der Werkstatt")
 * war der stehengebliebene Rest der falschen Aushang-Auskunft.
 *
 * Der Januar-Beitrag von 49 € steht ebenfalls nicht mehr hier: Er ist der
 * Teilkasko-Wert eines Ein-Monats-Zeitraums, die Haftpflicht liegt dort bei
 * 75 €. Neben dem Jahresbeitrag gelesen las sich das als Rabatt. Die
 * Zeiträume stehen vollständig in der Tarifübersicht.
 */
export const faqInsurance: FaqItem[] = [
  {
    q: "Ist eine Haftpflichtversicherung für meinen E-Scooter wirklich Pflicht?",
    a: "Ja. Nach der Elektrokleinstfahrzeuge-Verordnung (eKFV) und § 1 Pflichtversicherungsgesetz braucht jedes Fahrzeug mit mehr als 6 km/h Höchstgeschwindigkeit eine Haftpflichtversicherung. Ohne gültiges Versicherungskennzeichen droht ein Bußgeld, und im Schadensfall haften Sie persönlich.",
  },
  {
    q: "Was kostet eine E-Scooter Versicherung über euch als ERGO-Partner?",
    a: "Haftpflicht ab 42 € für ein volles Versicherungsjahr, Teilkasko mit Diebstahlschutz ab 69 €. Für kürzere Zeiträume gelten eigene Beiträge; sie stehen vollständig in der Tarifübersicht auf dieser Seite. Der genaue Betrag hängt von Alter, Standort und Risikoart ab und wird von der ERGO ermittelt. Es ist kein Abo – Sie zahlen einmal für den gewählten Zeitraum.",
  },
  {
    q: "Wie lange dauert es, bis ich mein Versicherungskennzeichen bekomme?",
    a: "Fünf bis zehn Werktage, per Post von der ERGO – auch dann, wenn Sie den Antrag bei uns in der Werkstatt stellen. Vorrätige Kennzeichen zum Mitnehmen gibt es nicht. Wer zum Saisonstart am 1. März fahren will, fragt am besten zwei Wochen vorher an.",
  },
  {
    q: "Welche Unterlagen brauche ich für den Versicherungsantrag?",
    a: "Persönliche Daten, die Fahrzeugdaten mit Rahmennummer (FIN) und Baujahr sowie Ihre IBAN. Die Rahmennummer steht meist am Trittbrett oder an der Lenkstange; finden Sie sie nicht, suchen wir sie bei einem Termin gemeinsam.",
  },
  {
    q: "Kann ich die Versicherung auch abschließen, wenn ich nicht in der Region Heilbronn wohne?",
    a: "Ja, die Vermittlung läuft deutschlandweit. Reparatur, Wartung und Verkauf sind an Neuenstadt am Kocher gebunden, der Abschluss über die ERGO ist es nicht: Sie stellen den Antrag online, das Kennzeichen kommt per Post zu Ihnen nach Hause.",
  },
];

export const faqBuy: FaqItem[] = [
  {
    q: "Was bedeutet das Skope-Qualitätssiegel bei einem gebrauchten E-Scooter genau?",
    a: "Dass der Scooter vor dem Verkauf durch unsere Werkstatt gegangen ist: Bremsen eingestellt, Reifen und Profil kontrolliert, Akkukapazität gemessen, Elektronik ausgelesen, Verschleißteile bewertet und getauscht. Ohne diese Prüfung verlässt kein Gerät den Laden.",
  },
  {
    q: "Bekomme ich auf einen gebrauchten E-Scooter überhaupt Gewährleistung?",
    a: "Ja, ein Jahr ab Übergabe – die für Gebrauchtwaren gesetzlich zulässige verkürzte Frist. Bestellen Sie per Telefon oder E-Mail, kommt das 14-tägige Widerrufsrecht dazu; beim Kauf vor Ort nach einer Probefahrt gilt es nicht.",
  },
  {
    q: "Welche gebrauchten E-Scooter habt ihr gerade da, und was kosten sie?",
    a: "Was gerade da ist, steht mit Fotos, Daten und Preis auf der Bestandsseite. Jedes Gerät ist ein Einzelstück, und der Bestand wechselt laufend. Ist nichts Passendes dabei, hinterlegen Sie einen Suchauftrag – wir melden uns, sobald ein solches Gerät geprüft ist.",
  },
  {
    q: "Sind eure gebrauchten E-Scooter für die Straße in Deutschland zugelassen?",
    a: "Das steht an jedem einzelnen Gerät. Der Großteil des Bestands hat eine Allgemeine Betriebserlaubnis nach eKFV und darf mit Versicherungskennzeichen auf öffentliche Straßen. Internationale Versionen ohne deutsche Betriebserlaubnis sind auf der Karte und auf der Geräteseite ausdrücklich gekennzeichnet; sie sind für Privatgelände, Export oder die Nutzung im Ausland gedacht.",
  },
  {
    q: "Kann ich als Firma bei euch einen E-Scooter kaufen und die Vorsteuer ziehen?",
    a: "Kaufen ja, Vorsteuer nein. Als Kleinunternehmer nach § 19 UStG weisen wir keine Umsatzsteuer aus; der genannte Preis ist der Endpreis. Eine Rechnung auf Ihre Firma stellen wir aus, ein Vorsteuerabzug ist daraus nicht möglich.",
  },
  {
    q: "Was passiert, wenn nach dem Kauf etwas am Scooter nicht stimmt?",
    a: "Dann kommen Sie zurück in die Werkstatt, die den Scooter aufbereitet hat. Genau das ist der Unterschied zum Privatkauf über ein Kleinanzeigenportal: Verkauf und Service liegen in einer Hand, wir kennen das Gerät und können es auch Jahre später warten.",
  },
];

/**
 * Kurz-FAQ für die Startseite.
 *
 * Bis zum 20.08.2026 standen hier zwei Reparaturfragen zuerst und der Kauf an
 * dritter Stelle. Das war die Reihenfolge einer Werkstatt; verkauft werden in
 * erster Linie generalüberholte Geräte. Jetzt führen die drei Fragen, die vor
 * einem Gebrauchtkauf tatsächlich gestellt werden – was steht da, was ist
 * geprüft, was gilt wenn etwas ist –, danach der Preis einer Reparatur.
 *
 * Fünf statt vier: Die Frage nach Bestand und Preisen ist die häufigste
 * Einstiegsfrage überhaupt und ersetzt keine der bisherigen.
 */
export const faqHome: FaqItem[] = [
  faqBuy[2],
  faqBuy[0],
  faqBuy[1],
  faqBuy[5],
  faqRepair[1],
];

/**
 * Finanzierung und Abo.
 *
 * Bewusst ohne jede Beispielrate: Sobald eine Zahl fällt, greift § 16 PAngV
 * mit dem effektiven Jahreszins und der ganzen Pflichtangabenkette. Die
 * Fragen beantworten deshalb, was feststeht (Laufzeit, Rauslösesumme,
 * Eigentumsübergang, Umfang), und sagen für den Rest, wann man die Zahl
 * bekommt – im Angebot, vor der Unterschrift.
 *
 * Am 26.09.2026 von sieben auf fünf gekürzt: Rauslösesumme und „Ist die
 * Versicherung im Abo enthalten" waren zwei eigene Fragen für zwei Sätze, die
 * im Vergleich der beiden Modelle ohnehin stehen müssen.
 */
export const faqFinancing: FaqItem[] = [
  {
    q: "Kann ich einen E-Scooter bei euch in Raten zahlen oder muss ich den Kaufpreis auf einmal aufbringen?",
    a: "Sie können in Raten zahlen, auf zwei Wegen: Ratenkauf mit einer Anzahlung bei der Übergabe und monatlichen Raten per SEPA-Lastschrift, oder das Mietkauf-Abo über wahlweise 24 oder 36 Monate. Beides gilt für E-Scooter, E-Chopper und E-Trike. Rate, Laufzeit und Gesamtbetrag stehen vollständig in Ihrem Angebot, bevor Sie unterschreiben.",
  },
  {
    q: "Was ist der Unterschied zwischen dem Mietkauf-Abo und dem Ratenkauf mit Anzahlung?",
    a: "Der Zeitpunkt, zu dem das Fahrzeug Ihnen gehört, und was in der Rate steckt. Beim Ratenkauf kaufen Sie sofort und tragen ab der Übergabe Anmeldung, Versicherung, Wartung und Reparaturen selbst; mit der letzten Rate gehört das Fahrzeug uneingeschränkt Ihnen. Im Abo sind genau diese Posten enthalten – Anmeldung, Haftpflicht- und Vollkaskoversicherung sowie der regelmäßige Service –, und nach Ablauf können Sie das Fahrzeug für 20 % des Neupreises übernehmen.",
  },
  {
    q: "Kostet mich die Ratenzahlung mehr, als wenn ich den E-Scooter sofort bezahle?",
    a: "Ja. Im ausgewiesenen Gesamtkaufpreis des Ratenkaufs sind die Aufschläge für die Finanzierung bereits enthalten, er liegt über dem Barpreis desselben Fahrzeugs. Gesamtkaufpreis, Anzahlung, Restbetrag, Laufzeit und Rate stehen vor der Unterschrift im Angebot. Eine Beispielrechnung nennen wir hier nicht, weil jede Zahl vom Fahrzeug und von der Laufzeit abhängt.",
  },
  {
    q: "Wird meine Bonität geprüft, wenn ich in Raten zahlen möchte?",
    a: "Ja, bei beiden Modellen: Ratenkauf und Mietkauf-Abo stehen unter der Bedingung einer positiven Bonitätsprüfung. Welche Unterlagen wir dafür brauchen, sagen wir im Beratungsgespräch, bevor Sie etwas einreichen.",
  },
  {
    q: "Bietet ihr auch eine klassische Finanzierung über eine Bank an?",
    a: "Noch nicht. Eine Zusammenarbeit mit Partnerbanken, unter anderem mit Consors Finanz, ist in Vorbereitung; solange sie nicht steht, bieten wir sie nicht an. Verfügbar sind das Mietkauf-Abo und der Ratenkauf mit Anzahlung.",
  },
];
