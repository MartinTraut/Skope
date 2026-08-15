/**
 * ERGO-Tarife für E-Scooter.
 * Werte aus dem Preisaushang „Saison 2026/2027" der Altseite; mit dem
 * Werkstattaushang vom 14.08.2026 abgeglichen, die sechs Zeiträume und die
 * Startpreise sind identisch.
 * TODO Betreiber: jährlich mit dem aktuellen ERGO-Aushang abgleichen.
 *
 * TODO Betreiber: Der Aushang führt in fünf Zeilen einen zweiten
 * Haftpflichtwert (ab 122 €, 186 €, 180 €, 115 €, 130 €). Wofür er gilt –
 * andere Fahrzeugklasse, höhere Risikoklasse – ist ungeklärt und steht
 * deshalb nicht auf der Seite. Ein Preis, dessen Bedeutung wir nicht
 * benennen können, ist keine Preisangabe, sondern eine Falle.
 */

export type Tariff = {
  period: string;
  liability: string;
  comprehensive: string;
  /**
   * Der Tarif über ein volles Versicherungsjahr. Nur diese Zeile darf als
   * Jahresbeitrag zitiert werden – der günstigste Wert der Tabelle gehört zu
   * einem Ein-Monats-Zeitraum und wäre als Saisonpreis eine Falschangabe.
   */
  full?: boolean;
};

export const tariffs: Tariff[] = [
  {
    period: "01.04.2026 bis 31.03.2027",
    liability: "ab 42 €",
    comprehensive: "ab 69 €",
    full: true,
  },
  {
    period: "01.05.2026 bis 31.05.2026",
    liability: "ab 35 €",
    comprehensive: "ab 69 €",
  },
  {
    period: "01.07.2026 bis 30.09.2026",
    liability: "ab 57 €",
    comprehensive: "ab 70 €",
  },
  {
    period: "01.10.2026 bis 31.12.2026",
    liability: "ab 57 €",
    comprehensive: "ab 59 €",
  },
  {
    period: "01.01.2027 bis 31.01.2027",
    liability: "ab 75 €",
    comprehensive: "ab 49 €",
  },
  {
    period: "01.02.2027 bis 28.02.2027",
    liability: "ab 36 €",
    comprehensive: "ab 69 €",
  },
];

export const tariffDisclaimer =
  "Die dargestellten Tarife sind unverbindliche Preisbeispiele und beziehen sich auf die günstigste Risikoklasse bei optimalen Voraussetzungen. Der tatsächliche Beitrag hängt von individuellen Faktoren ab (z. B. Alter, Standort, Risikoart). Ein rechtlich bindendes Angebot erfolgt erst nach Prüfung Ihres Antrags durch die ERGO.";

/**
 * Ablauf vom Antrag bis zum Kennzeichen.
 *
 * Schritt 03 ist die Weiche, und sie ist der Grund, warum dieser Ablauf
 * überarbeitet wurde: Die Altseite kannte nur den Postweg und schrieb
 * ausdrücklich, eine Abholung sei „aus versicherungstechnischen Gründen
 * leider nicht möglich". Der Werkstattaushang sagt das Gegenteil – wer
 * vorbeikommt, nimmt die Plakette mit. Beides steht jetzt nebeneinander,
 * getrennt nach dem Weg, den der Kunde wählt.
 */
export const insuranceSteps = [
  {
    step: "01",
    title: "Antrag stellen",
    text: "Persönliche Daten, Fahrzeugdaten (Marke, Modell, Rahmennummer, Baujahr) und IBAN. Online über das Formular oder direkt bei uns in der Werkstatt.",
  },
  {
    step: "02",
    title: "Wir bearbeiten sofort",
    text: "Ihre Daten gehen verschlüsselt an die ERGO. Wir prüfen die Angaben und stoßen den Antrag noch am selben Tag an.",
  },
  {
    step: "03",
    title: "Kennzeichen bekommen",
    text: "Hier trennen sich die beiden Wege. Wo Sie den Antrag stellen, entscheidet, wann Sie fahren dürfen.",
    branches: [
      {
        label: "In der Werkstatt",
        value: "sofort",
        text: "Wir haben die Versicherungskennzeichen vorrätig. Beitrag bar oder mit EC-Karte zahlen, Plakette ans Heck, fertig.",
        instant: true,
      },
      {
        label: "Online angefragt",
        value: "5 bis 10 Werktage",
        text: "Die ERGO versendet das Kennzeichen direkt zu Ihnen nach Hause, deutschlandweit.",
      },
    ],
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
