/**
 * ERGO-Tarife für E-Scooter.
 * Werte aus dem Preisaushang „Saison 2026/2027" der Altseite; mit dem
 * Werkstattaushang vom 14.08.2026 abgeglichen, die sechs Zeiträume und die
 * Startpreise sind identisch.
 * TODO Betreiber: jährlich mit dem aktuellen ERGO-Aushang abgleichen.
 *
 * TODO Betreiber: Der Aushang führt in fünf Zeilen einen zweiten
 * Haftpflichtwert (ab 122 €, 186 €, 180 €, 115 €, 130 €). Wofür er gilt –
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
    liability: "ab 42 €",
    comprehensive: "ab 69 €",
    full: true,
  },
  {
    period: "01.05.2026 bis 31.05.2026",
    liability: "ab 35 €",
    comprehensive: "ab 69 €",
  },
  {
    period: "01.07.2026 bis 30.09.2026",
    liability: "ab 57 €",
    comprehensive: "ab 70 €",
  },
  {
    period: "01.10.2026 bis 31.12.2026",
    liability: "ab 57 €",
    comprehensive: "ab 59 €",
  },
  {
    period: "01.01.2027 bis 31.01.2027",
    liability: "ab 75 €",
    comprehensive: "ab 49 €",
  },
  {
    period: "01.02.2027 bis 28.02.2027",
    liability: "ab 36 €",
    comprehensive: "ab 69 €",
  },
];

export const tariffDisclaimer =
  "Die dargestellten Tarife sind unverbindliche Preisbeispiele und beziehen sich auf die günstigste Risikoklasse bei optimalen Voraussetzungen. Der tatsächliche Beitrag hängt von individuellen Faktoren ab (z. B. Alter, Standort, Risikoart). Ein rechtlich bindendes Angebot erfolgt erst nach Prüfung Ihres Antrags durch die ERGO.";

/**
 * Ablauf vom Antrag bis zum Kennzeichen.
 *
 * Das Kennzeichen kommt **per Post von der ERGO**, auch wenn der Antrag in
 * der Werkstatt gestellt wird – Auskunft des Betreibers vom 03.09.2026. Die
 * Altseite sagte dasselbe („Abholung vor Ort leider nicht möglich"); der
 * Werkstattaushang behauptet „Sofort Mitnahme" und ist damit falsch. Bis zum
 * 03.09. stand hier eine Weiche „Werkstatt: sofort / online: 5–10 Werktage",
 * die aus dem Aushang stammte. Wer den Aushang neu druckt, streicht die
 * Mitnahme.
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
