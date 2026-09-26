/**
 * ERGO-Tarife für E-Scooter.
 *
 * **Stand 26.09.2026: neuer Aushang des Betreibers, Saison 2026/2027.** Er
 * ersetzt den Aushang vom 14.08.2026 vollständig und räumt dabei zwei Punkte
 * ab, die hier als offen standen:
 *
 * - **Die zweite Preisspalte gibt es nicht mehr.** Der alte Aushang führte in
 *   fünf Zeilen einen unerklärten zweiten Haftpflichtwert (122, 186, 180, 115,
 *   130 €). Der neue nennt je Zeitraum genau einen Haftpflicht- und einen
 *   Gesamtbeitrag. Der TODO dazu ist damit erledigt, nicht vergessen.
 * - **Alle Zeiträume enden am 28.02.2027**, dem Ende des Verkehrsjahres. Der
 *   alte Aushang ließ die volle Saison bis zum 31.03.2027 laufen und hatte
 *   Zeiträume, deren Beitrag im Winter *stieg* – die Reihe ist jetzt
 *   monoton fallend, weil sie genau das ist, was draufsteht: der anteilige
 *   Rest bis zum Saisonende.
 *
 * **Warum weiterhin „ab" vor jedem Betrag steht**, obwohl der Aushang die
 * Zahlen ohne diesen Zusatz druckt: Der Beitrag der ERGO hängt an Alter,
 * Standort und Risikoart, und genau das sagt `tariffDisclaimer` seit jeher.
 * Ein Festpreis wäre eine Zusage, die wir nicht halten können; „ab" ist im
 * ungünstigen Fall zu vorsichtig, nie zu billig.
 * TODO Betreiber: Sind die Beträge des Aushangs Festpreise für jede
 * Risikoklasse? Dann fällt das „ab" – und der Nachsatz im Disclaimer mit ihm.
 *
 * TODO Betreiber: jährlich mit dem aktuellen ERGO-Aushang abgleichen.
 */

export type Tariff = {
  /** Beginn des Versicherungsschutzes, wie er in der Anfrage genannt wird. */
  start: string;
  /** Vollständiger Zeitraum. Geht so in Schema, Anfrage und Vorlesesoftware. */
  period: string;
  liability: string;
  comprehensive: string;
  /**
   * Der Tarif über die volle Saison. Nur diese Zeile darf als Jahresbeitrag
   * zitiert werden – jeder andere Wert der Tabelle gehört zu einem
   * Restzeitraum und wäre als Saisonpreis eine Falschangabe.
   */
  full?: boolean;
};

/** Ende der Saison. Jeder Zeitraum läuft bis hierher. */
export const seasonEnd = "28.02.2027";

export const tariffs: Tariff[] = [
  {
    start: "01.03.2026",
    period: "01.03.2026 bis 28.02.2027",
    liability: "ab 42 €",
    comprehensive: "ab 69 €",
    full: true,
  },
  {
    start: "01.04.2026",
    period: "01.04.2026 bis 28.02.2027",
    liability: "ab 38 €",
    comprehensive: "ab 63 €",
  },
  {
    start: "01.05.2026",
    period: "01.05.2026 bis 28.02.2027",
    liability: "ab 35 €",
    comprehensive: "ab 58 €",
  },
  {
    start: "01.06.2026",
    period: "01.06.2026 bis 28.02.2027",
    liability: "ab 31 €",
    comprehensive: "ab 52 €",
  },
  {
    start: "01.07.2026",
    period: "01.07.2026 bis 28.02.2027",
    liability: "ab 27 €",
    comprehensive: "ab 46 €",
  },
  {
    start: "01.08.2026",
    period: "01.08.2026 bis 28.02.2027",
    liability: "ab 24 €",
    comprehensive: "ab 40 €",
  },
  {
    start: "01.09.2026",
    period: "01.09.2026 bis 28.02.2027",
    liability: "ab 20 €",
    comprehensive: "ab 35 €",
  },
  {
    start: "01.10.2026",
    period: "01.10.2026 bis 28.02.2027",
    liability: "ab 17 €",
    comprehensive: "ab 29 €",
  },
  {
    start: "01.11.2026",
    period: "01.11.2026 bis 28.02.2027",
    liability: "ab 13 €",
    comprehensive: "ab 23 €",
  },
  {
    start: "01.12.2026",
    period: "01.12.2026 bis 28.02.2027",
    liability: "ab 10 €",
    comprehensive: "ab 18 €",
  },
  {
    start: "01.01.2027",
    period: "01.01.2027 bis 28.02.2027",
    liability: "ab 7 €",
    comprehensive: "ab 12 €",
  },
  {
    start: "01.02.2027",
    period: "01.02.2027 bis 28.02.2027",
    liability: "ab 3 €",
    comprehensive: "ab 6 €",
  },
];

export const tariffDisclaimer =
  "Die dargestellten Tarife sind unverbindliche Preisbeispiele und beziehen sich auf die günstigste Risikoklasse bei optimalen Voraussetzungen. Der tatsächliche Beitrag hängt von individuellen Faktoren ab (z. B. Alter, Standort, Risikoart). Ein rechtlich bindendes Angebot erfolgt erst nach Prüfung Ihres Antrags durch die ERGO.";

/**
 * Was die Teilkasko abdeckt, und was sie im Schadensfall kostet.
 *
 * Steht seit dem 26.09.2026 auf der Seite, weil beides zum selben Preis
 * gehört: Wer „Teilkasko ab 69 €" liest, muss wissen, wofür sie einspringt
 * **und** was er selbst trägt. Ein Kaskobeitrag ohne Selbstbeteiligung ist
 * eine halbe Preisangabe.
 *
 * Wortlaut aus dem Aushang der Saison 2026/2027.
 */
export const comprehensiveScope = [
  "Diebstahl",
  "Brand und Explosion",
  "Glasbruch",
  "Kurzschluss",
  "Sturm und Hagel",
  "Überschwemmung",
  "Tierkollision",
  "Tierbiss",
];

export const comprehensiveDeductible = [
  { label: "Je Schaden", value: "150 €" },
  { label: "Bei Totalentwendung", value: "300 €" },
];

/**
 * Ablauf vom Antrag bis zum Kennzeichen.
 *
 * Das Kennzeichen kommt **per Post von der ERGO**, auch wenn der Antrag in
 * der Werkstatt gestellt wird – Auskunft des Betreibers vom 03.09.2026, am
 * 26.09.2026 erneut bestätigt. Der Aushang vom 14.08. behauptete „Sofort
 * Mitnahme" und war damit falsch; **der Aushang der Saison 2026/2027 sagt
 * jetzt selbst „Plakette per Post"** – der Widerspruch zwischen Seite und
 * Werkstattwand ist damit aufgelöst und darf nicht wieder eingebaut werden.
 */
export const insuranceSteps = [
  {
    step: "01",
    title: "Antrag stellen",
    text: "In der Werkstatt alles auf einmal: persönliche Daten, Fahrzeugdaten, IBAN – der Antrag ist in wenigen Minuten ausgefüllt. Online zuerst Marke, Modell und Zeitraum über das Formular; Rahmennummer und IBAN fragen wir anschließend telefonisch ab, nicht über das Formular.",
  },
  {
    step: "02",
    title: "Wir bearbeiten sofort",
    text: "Sobald die Angaben vollständig sind, prüfen wir sie und geben den Antrag noch am selben Werktag an die ERGO.",
  },
  {
    step: "03",
    title: "Kennzeichen per Post",
    text: "Die ERGO prüft den Antrag und versendet das Versicherungskennzeichen innerhalb von fünf bis zehn Werktagen direkt an Ihre Adresse, deutschlandweit – auch wenn Sie den Antrag in der Werkstatt gestellt haben.",
  },
  {
    step: "04",
    title: "Plakette kleben, losfahren",
    text: "Kennzeichen ans Heck, fertig. Ab diesem Moment sind Sie im Straßenverkehr rechtlich abgesichert.",
  },
];

/** Unterlagen, die für den Antrag gebraucht werden. */
export const insuranceDocs = [
  "Persönliche Daten: Name, Adresse, Geburtsdatum",
  "Fahrzeugdaten: Marke/Modell, Rahmennummer (FIN), Baujahr",
  "IBAN für die Beitragszahlung",
];
