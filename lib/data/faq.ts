/**
 * FAQ – interview-artig aufgebaut:
 * Frage so, wie sie tatsächlich gestellt wird (Long-Tail),
 * Antwort beginnt mit der direkten Antwort, danach die Details.
 * Alle Fakten stammen aus der Altseite.
 */

export type FaqItem = { q: string; a: string };

export const faqRepair: FaqItem[] = [
  {
    q: "Welche E-Scooter Marken repariert ihr in eurer Werkstatt in Neuenstadt?",
    a: "Alle gängigen Marken. Dazu gehören Xiaomi, Segway-Ninebot, Tier, Lime, Bird, Moover, SoFlow und Trekstor. Auch exotische Modelle und Importgeräte sehen wir uns an. Bei über 500 reparierten Scootern ist uns kaum eine Bauform neu. Wenn ein Ersatzteil nicht lieferbar ist, sagen wir Ihnen das vorab, statt Sie warten zu lassen.",
  },
  {
    q: "Was kostet eine E-Scooter Reparatur bei euch ungefähr?",
    a: "Bremsbeläge ab 15 €, Reifenwechsel ab 25 €, Elektronik-Reparaturen ab 40 €, je nach Defekt. Die vollständige Diagnose aller sechs Prüfpositionen ist im Sicherheits-Checkup für 59,99 € enthalten. Vor jeder Arbeit bekommen Sie einen Kostenvoranschlag. Es wird nichts getauscht, was Sie nicht freigegeben haben. Alle Preise sind Endpreise, gemäß § 19 UStG berechnen wir keine Umsatzsteuer.",
  },
  {
    q: "Wie lange dauert es, bis ich meinen E-Scooter wieder abholen kann?",
    a: "Standard-Reparaturen an Bremsen und Reifen erledigen wir meist noch am selben Tag. Elektronik-Reparaturen brauchen in der Regel ein bis drei Werktage, weil Fehlerdiagnose und Bauteilbeschaffung Zeit kosten. Kunden mit Premium-Wartungsvertrag erhalten Express-Service und werden bevorzugt innerhalb von 24 Stunden bearbeitet.",
  },
  {
    q: "Mein Akku hält kaum noch. Muss ich gleich einen neuen kaufen?",
    a: "Meistens nicht. Wir messen zuerst die tatsächliche Restkapazität und lesen die Ladezyklen aus, bevor über einen Austausch gesprochen wird. Häufig steckt das Problem im BMS, dem Batterie-Management-System, oder in einzelnen schwachen Zellen. Beides lässt sich reparieren beziehungsweise gezielt tauschen. Ein kompletter Akkuwechsel ist die letzte Option, nicht die erste.",
  },
  {
    q: "Lohnt sich eine Reparatur überhaupt, oder soll ich lieber einen neuen Scooter kaufen?",
    a: "In den allermeisten Fällen lohnt sich die Reparatur. Ein Fachbetrieb behebt kaputte Reifen, defekte Bremsen oder Elektronikfehler zu einem Bruchteil des Neupreises, und der Scooter ist danach wieder sicher und voll funktionsfähig. Dazu kommt: Sie verbrauchen keine neuen Ressourcen. Sollte sich eine Reparatur im Einzelfall wirtschaftlich wirklich nicht rechnen, sagen wir Ihnen das offen und verwerten das Altgerät kostenlos.",
  },
];

export const faqPlans: FaqItem[] = [
  {
    q: "Lohnt sich ein E-Scooter Wartungsvertrag für mich wirklich?",
    a: "Wenn Sie täglich fahren: ja. Ein einzelner Sicherheits-Checkup kostet 59,99 €. Im Premium-Paket für 17,99 € im Monat sind der jährliche Sicherheits-Check, der Akku-Deep-Check, Vorrang bei der Terminvergabe und 20 % Rabatt auf alle Ersatzteile enthalten. Der Preisvorteil liegt beim Ersatzteil-Rabatt und beim Hol- und Bringservice, der eigentliche Nutzen bei der Express-Reparatur, die bevorzugt innerhalb von 24 Stunden erledigt wird. Fahren Sie nur gelegentlich, ist der Basis-Vertrag für 130 € im Jahr die passendere Wahl.",
  },
  {
    q: "Welcher Wartungsvertrag passt zu mir, Basis oder Premium?",
    a: "Basis für Gelegenheitsfahrer, Premium für Pendler. Der Basis-Vertrag (130 € pro Jahr) bringt einmal jährlich den großen Sicherheitscheck mit kompletter Funktionsprüfung und 10 % Ersatzteil-Rabatt. Premium (17,99 € pro Monat, 215,88 € im Jahr, Mindestlaufzeit 12 Monate) ist auf Leute zugeschnitten, die den Scooter aus Heilbronn oder Neckarsulm täglich zur Arbeit nutzen: Akku-Deep-Check, 20 % Rabatt, Express-Reparatur (bevorzugt innerhalb von 24 Stunden) und Hol- und Bringservice im Umkreis von 15 km.",
  },
  {
    q: "Wo findet die Wartung statt, und holt ihr den Scooter auch ab?",
    a: "Die Wartung läuft in unserer Fachwerkstatt Im Kampfrad 3 in Neuenstadt am Kocher. Premium-Kunden nutzen den Hol- und Bringservice im Umkreis von 15 km. Das deckt Heilbronn, Neckarsulm und Bad Friedrichshall vollständig ab. Durch die zentrale Lage sind wir aus dem gesamten Umkreis bis 25 km schnell erreichbar, aus Mosbach genauso wie aus Öhringen.",
  },
  {
    q: "Sind Ersatzteile im Wartungsvertrag enthalten?",
    a: "Nein, die Verträge decken die Arbeitszeit für die Wartung ab. Benötigte Ersatzteile wie Reifen oder Bremsbeläge berechnen wir separat und weisen sie einzeln auf der Rechnung aus, mit 10 % Rabatt im Basis- und 20 % im Premium-Vertrag, und ohne Umsatzsteuer gemäß § 19 UStG. Ebenfalls nicht abgedeckt sind Schäden durch unsachgemäßen Umgang, etwa Tuning, Sprünge, Wasserschäden durch Hochdruckreiniger oder Unfälle.",
  },
];

export const faqInsurance: FaqItem[] = [
  {
    q: "Ist eine Haftpflichtversicherung für meinen E-Scooter wirklich Pflicht?",
    a: "Ja. Nach der Elektrokleinstfahrzeuge-Verordnung (eKFV) und § 1 Pflichtversicherungsgesetz ist eine Haftpflichtversicherung für jeden E-Scooter mit einer Höchstgeschwindigkeit über 6 km/h gesetzlich vorgeschrieben. Ohne gültiges Versicherungskennzeichen dürfen Sie nicht am Straßenverkehr teilnehmen. Es drohen Bußgelder und volle persönliche Haftung im Schadensfall.",
  },
  {
    q: "Was kostet eine E-Scooter Versicherung über euch als ERGO-Partner?",
    a: "Die Haftpflicht startet je nach Saison und Risikoklasse ab 42 € für ein volles Versicherungsjahr, Teilkasko mit Diebstahlschutz ab 69 €. Wer mitten in der Saison einsteigt, zahlt nur die verbleibenden Monate, im Januar zum Beispiel ab 49 €. Der genaue Beitrag hängt von Alter, Standort und Risikoart ab und wird von der ERGO auf Basis Ihrer Angaben ermittelt. Es ist kein Abo: Sie zahlen einmal und fahren die ganze Saison abgesichert.",
  },
  {
    q: "Wie lange dauert es, bis ich mein Versicherungskennzeichen bekomme?",
    a: "Fünf bis zehn Werktage nach dem Antrag, per Post. Ob Sie den Antrag in unserer Werkstatt in Neuenstadt am Kocher oder online stellen: Wir geben ihn am selben Werktag an die ERGO, und die versendet das Versicherungskennzeichen direkt an Ihre Adresse. Wer zum Saisonstart am 1. März fahren will, fragt am besten zwei Wochen vorher an.",
  },
  {
    q: "Kann ich die Plakette bei euch im Laden direkt mitnehmen, oder muss ich auf die Post warten?",
    a: "Nein, das Kennzeichen kommt per Post von der ERGO. Wir haben keine Versicherungskennzeichen in der Werkstatt vorrätig: Der Antrag wird bei uns oder online gestellt, die ERGO prüft ihn und versendet die Plakette innerhalb von fünf bis zehn Werktagen an Ihre Adresse. In der Werkstatt füllen wir den Antrag gemeinsam aus, der Beitrag ist bar oder mit EC-Karte zahlbar.",
  },
  {
    q: "Welche Unterlagen brauche ich für den Versicherungsantrag?",
    a: "Drei Dinge: Ihre persönlichen Daten (Name, Adresse, Geburtsdatum), die Fahrzeugdaten (Marke und Modell, Rahmennummer beziehungsweise FIN, Baujahr) und Ihre IBAN für die Beitragszahlung. Die Rahmennummer finden Sie meist am Trittbrett oder an der Lenkstange. Wenn Sie sie nicht finden, suchen wir sie bei einem Termin in der Werkstatt gemeinsam.",
  },
  {
    q: "Kann ich die Versicherung auch abschließen, wenn ich nicht in der Region Heilbronn wohne?",
    a: "Ja, die Versicherung vermitteln wir deutschlandweit. Reparatur, Wartung und Verkauf sind an unseren Standort in Neuenstadt am Kocher gebunden, der Versicherungsabschluss über die ERGO ist es nicht. Sie stellen den Antrag online, das Kennzeichen kommt in fünf bis zehn Werktagen per Post zu Ihnen nach Hause, egal wo in Deutschland Sie wohnen. Die sofortige Mitnahme der Plakette gibt es nur bei uns in der Werkstatt.",
  },
];

export const faqBuy: FaqItem[] = [
  {
    q: "Was bedeutet das Skope-Qualitätssiegel bei einem gebrauchten E-Scooter genau?",
    a: "Es bedeutet, dass der Scooter durch unsere Werkstatt gegangen ist, bevor er verkauft wird. Jedes Gerät wird komplett geprüft: Bremsen eingestellt, Reifen und Profil kontrolliert, Akkukapazität gemessen, Elektronik ausgelesen, Verschleißteile bewertet und getauscht. Erst wenn alles passt, bekommt der Scooter das Siegel. Ein Gerät ohne Siegel verlässt unseren Laden nicht.",
  },
  {
    q: "Bekomme ich auf einen gebrauchten E-Scooter überhaupt Gewährleistung?",
    a: "Ja, ein Jahr ab Übergabe. Für Gebrauchtwaren gilt bei uns die gesetzlich zulässige verkürzte Gewährleistungsfrist von einem Jahr. Die Haftung für Schäden aus der Verletzung von Leben, Körper oder Gesundheit sowie für grob fahrlässige oder vorsätzliche Pflichtverletzungen bleibt davon unberührt. Bestellen Sie per Telefon oder E-Mail, gilt zusätzlich das gesetzliche 14-tägige Widerrufsrecht; beim Kauf vor Ort nach einer Probefahrt gilt es nicht.",
  },
  {
    q: "Welche gebrauchten E-Scooter habt ihr gerade da, und was kosten sie?",
    a: "Was gerade da ist, steht mit Fotos, Messwerten und Preis auf der Bestandsseite. Jedes Gerät ist ein Einzelstück, aufbereitet in der Werkstatt in Neuenstadt am Kocher, mit einem Jahr Gewährleistung, und der Bestand wechselt laufend. Wenn nichts Passendes dabei ist, hinterlegen Sie einen Suchauftrag, und wir melden uns, sobald ein solches Gerät geprüft ist.",
  },
  {
    q: "Sind eure gebrauchten E-Scooter für die Straße in Deutschland zugelassen?",
    a: "Die meisten ja, zwei ausdrücklich nicht. Der Großteil des Bestands hat eine Allgemeine Betriebserlaubnis nach eKFV und darf mit Versicherungskennzeichen auf öffentlichen Straßen gefahren werden. Zwei Geräte sind internationale 25-km/h-Versionen ohne deutsche Betriebserlaubnis, der Segway-Ninebot F2 E und der Xiaomi Electric Scooter 5 Max. Beide sind auf der Übersichtsseite als solche gekennzeichnet und ausschließlich für Privatgelände, Export oder die Nutzung im Ausland gedacht. Wer ein solches Gerät im Straßenverkehr bewegt, fährt ohne Versicherungsschutz.",
  },
  {
    q: "Kann ich als Firma bei euch einen E-Scooter kaufen und die Vorsteuer ziehen?",
    a: "Kaufen ja, Vorsteuer nein. Als Kleinunternehmer nach § 19 UStG weisen wir keine Umsatzsteuer aus; der genannte Preis ist der Endpreis, für Privat- wie für Geschäftskunden. Eine Rechnung auf Ihre Firma stellen wir aus, ein Vorsteuerabzug ist daraus aber nicht möglich.",
  },
  {
    q: "Was passiert, wenn nach dem Kauf etwas am Scooter nicht stimmt?",
    a: "Dann kommen Sie zurück in die Werkstatt, in der der Scooter aufbereitet wurde. Genau das ist der Unterschied zum Privatkauf über ein Kleinanzeigenportal: Verkauf und Service liegen bei uns in einer Hand. Wir kennen das Gerät, haben es selbst geprüft und können es auch Jahre später noch warten.",
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
