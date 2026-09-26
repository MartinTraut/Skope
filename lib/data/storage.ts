/**
 * Winterlagerung – das Saison-Abo.
 *
 * Quelle ist ausschließlich die Auskunft des Betreibers vom 25.09.2026:
 * 29,99 € im Monat, Mindestlaufzeit zwei Monate, vier enthaltene Leistungen
 * und das VIP Detailing als einmalige Zusatzleistung für 49 €. **Nichts
 * darüber hinaus steht auf der Seite** – keine Temperaturangabe, keine
 * Stellplatzzahl, keine Aussage über Transport, Haftung oder Versicherung.
 * Was unten als TODO steht, fehlt wirklich und darf nicht durch eine
 * plausible Formulierung ersetzt werden.
 *
 * Die Seite ist bewusst eine **Anfrage**, keine Buchung. Ein online
 * abschließbares Dauerschuldverhältnis zöge Widerrufsbelehrung und den
 * Kündigungsknopf nach § 312k BGB nach sich; beides gibt es nicht und
 * beides braucht es nicht, solange der Vertrag vor Ort geschlossen wird.
 * Wer hier später einen echten Buchungsweg baut, baut beides mit.
 *
 * TODO Betreiber – vor dem Livegang zu klären:
 *
 *  1. **Die „15 Punkte" des Sicherheitschecks sind nirgends belegt.** Die
 *     Website führt an vier Stellen den Sicherheits-Checkup mit *sechs*
 *     Positionen (`lib/data/services.ts`), und der „27-Punkte-Sicherheits-
 *     check" der Altseite wurde beim Faktenaudit vom 20.08.2026 genau
 *     deshalb nicht übernommen: eine Punktzahl ist eine überprüfbare
 *     Tatsachenbehauptung (§ 5 UWG). Entweder kommen die fünfzehn Punkte als
 *     Liste – dann stehen sie hier –, oder die Zahl fällt weg und es heißt
 *     „Sicherheitscheck vor der Abholung". Bis dahin steht sie so da, wie
 *     der Betreiber sie angegeben hat, und widerspricht der eigenen Seite.
 *  2. **Haftung und Versicherung während der Lagerung.** Eine entgeltliche
 *     Verwahrung ist ein Verwahrungsvertrag (§§ 688 ff. BGB) – wer haftet
 *     bei Diebstahl, Brand oder Wasserschaden, gibt es eine Versicherung,
 *     ist eine Wertgrenze vereinbart? Die Seite behauptet dazu nichts.
 *  3. **Wie viele Stellplätze gibt es?** Bei begrenzter Zahl gehört das auf
 *     die Seite, sonst ist jede Anfrage ein Vielleicht.
 *  4. **Bringen und Abholen.** Bringt der Kunde das Gerät selbst? Der Hol-
 *     und Bringservice bis 15 km steht bisher nur im Premium-Wartungsvertrag.
 *  5. **Abrechnung.** Beginnt sie am Tag der Übergabe, wird der erste Monat
 *     anteilig berechnet, läuft der Einzug wie bei den Finanzierungsverträgen
 *     per SEPA-Lastschrift? Und was gilt, wenn später abgeholt wird als
 *     angegeben?
 *  6. **Nach den zwei Monaten:** monatlich kündbar oder automatische
 *     Verlängerung?
 *  7. **Akku und Zubehör.** Bleibt der Akku im Gerät, wird er getrennt
 *     gelagert, und werden Schlüssel oder Ladegerät mit übergeben?
 *  8. **Saisonfenster.** Ab wann bis wann wird eingelagert? Die Seite nennt
 *     kein Datum, weil keines vorliegt – die Abholmonate unten sind die
 *     einzige Zeitangabe.
 *  9. **Ort der Lagerung.** Im Kampfrad 3 oder anderswo? Steht deshalb
 *     nirgends auf der Seite.
 */

export const storagePlan = {
  name: "Winter-Abo",
  price: "29,99",
  /** Maschinenlesbar für das Schema – Punkt statt Komma. */
  priceValue: "29.99",
  period: "pro Monat",
  minDuration: "Mindestlaufzeit 2 Monate",
  /* Derselbe Wert ohne das Etikett davor. Die Kachel setzt ihn als Zeile mit
     zwei Enden („Mindestlaufzeit" links, der Wert rechts); mit dem Wort im
     String stünde es doppelt. `minDuration` bleibt für Schema und Fließtext. */
  minTerm: "2 Monate",
  claim: "Ein Platz für den Winter, eine Rate im Monat.",
} as const;

/**
 * Was im Abo enthalten ist.
 *
 * `title` ist die Leistung, `text` sagt, was sie im Alltag bedeutet. Ohne
 * den zweiten Teil sind es vier Schlagworte – und „Standentlastung" erklärt
 * sich niemandem von selbst.
 */
export const storageIncludes = [
  {
    title: "Temperierter Stellplatz",
    text: "Ein fester, temperierter Platz für die gesamte Dauer der Einlagerung. Der Scooter steht nicht in einer unbeheizten Garage und nicht im Weg.",
  },
  {
    title: "Aktives Batterie-Monitoring",
    text: "Der Akku wird während der Lagerung auf einer Ladung zwischen 50 und 70 Prozent gehalten und regelmäßig kontrolliert. Voll geladen oder tief entladen über Monate stehen zu bleiben, kostet einen Lithium-Akku Kapazität.",
  },
  {
    title: "Standentlastung für Fahrwerk und Reifen",
    text: "Das Gerät steht nicht monatelang mit dem vollen Gewicht auf denselben Stellen von Reifen und Federung.",
  },
  {
    title: "15-Punkte-Sicherheitscheck vor der Abholung",
    text: "Vor der Rückgabe läuft der Scooter durch einen Sicherheitscheck. Was dabei auffällt, erfahren Sie, bevor Sie losfahren – und was zu tun ist, besprechen wir vorher.",
  },
] as const;

/**
 * Die eine Zusatzleistung.
 *
 * Sie steht getrennt vom Abo und nicht als zweiter Tarif: Es gibt einen
 * Preis für die Einlagerung, und dazu kann man eine Sache bestellen. Zwei
 * gleich schwere Karten nebeneinander machten daraus eine Wahl zwischen zwei
 * Abos, die es nicht gibt.
 *
 * Der Werbesatz aus der Vorlage („Der Scooter glänzt wie am ersten Tag") ist
 * nicht übernommen – dieselbe Regel wie überall sonst auf dieser Seite.
 */
export const storageOption = {
  id: "detailing",
  name: "VIP Detailing",
  price: "49",
  priceValue: "49.00",
  /** Für Fließtext und Formular: einmalig, nicht monatlich. */
  billing: "einmalig",
  text: "Intensive Tiefenreinigung und Kunststoff-Versiegelung, direkt vor der Abholung. Im Anfrageformular ankreuzbar.",
} as const;

/**
 * Auswahl im Formular: bis wann soll das Gerät stehen bleiben?
 *
 * Die drei Monate sind die Vorgabe des Betreibers. Der Wert wird
 * serverseitig gegen genau diese Liste geprüft – aus einer manipulierten
 * Eingabe darf kein erfundener Zeitraum in eine Anfrage wandern, dieselbe
 * Regel wie beim `?zeitraum=` der Versicherungstabelle.
 */
export const storagePickupMonths = ["Februar", "März", "April"] as const;

export type StoragePickupMonth = (typeof storagePickupMonths)[number];

export function isStoragePickupMonth(
  value: string,
): value is StoragePickupMonth {
  return (storagePickupMonths as readonly string[]).includes(value);
}

/**
 * Der Ablauf. Vier Schritte, und keiner behauptet etwas, das nicht feststeht –
 * insbesondere nicht, wer das Gerät bringt (siehe TODO 4).
 */
export const storageSteps = [
  {
    n: "01",
    title: "Anfrage mit Abholmonat",
    text: "Sie sagen uns, um welches Gerät es geht und bis wann es stehen soll. Wenn das VIP Detailing dazu soll, kreuzen Sie es gleich mit an.",
  },
  {
    n: "02",
    title: "Termin und Übergabe",
    text: "Wir bestätigen den Platz und vereinbaren einen Termin. Bei der Übergabe sehen wir uns den Zustand gemeinsam an.",
  },
  {
    n: "03",
    title: "Über den Winter",
    text: "Das Gerät steht temperiert und entlastet, der Akku wird auf Lagerspannung gehalten und regelmäßig kontrolliert.",
  },
  {
    n: "04",
    title: "Check und Abholung",
    text: "Vor der Rückgabe läuft der Sicherheitscheck. Auffälligkeiten besprechen wir, bevor Sie das Gerät mitnehmen.",
  },
] as const;
