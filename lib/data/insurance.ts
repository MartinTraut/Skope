/**
 * ERGO-Tarife für E-Scooter.
 * Werte aus dem Preisaushang „Saison 2026/2027" der Altseite.
 * TODO Betreiber: jährlich mit dem aktuellen ERGO-Aushang abgleichen.
 */

export type Tariff = {
  period: string;
  liability: string;
  comprehensive: string;
  /**
   * Der Tarif über ein volles Versicherungsjahr. Nur diese Zeile darf als
   * Jahresbeitrag zitiert werden — der günstigste Wert der Tabelle gehört zu
   * einem Ein-Monats-Zeitraum und wäre als Saisonpreis eine Falschangabe.
   */
  full?: boolean;
};

export const tariffs: Tariff[] = [
  { period: "01.04.2026 – 31.03.2027", liability: "ab 42 €", comprehensive: "ab 69 €", full: true },
  { period: "01.05.2026 – 31.05.2026", liability: "ab 35 €", comprehensive: "ab 69 €" },
  { period: "01.07.2026 – 30.09.2026", liability: "ab 57 €", comprehensive: "ab 70 €" },
  { period: "01.10.2026 – 31.12.2026", liability: "ab 57 €", comprehensive: "ab 59 €" },
  { period: "01.01.2027 – 31.01.2027", liability: "ab 75 €", comprehensive: "ab 49 €" },
  { period: "01.02.2027 – 28.02.2027", liability: "ab 36 €", comprehensive: "ab 69 €" },
];

export const tariffDisclaimer =
  "Die dargestellten Tarife sind unverbindliche Preisbeispiele und beziehen sich auf die günstigste Risikoklasse bei optimalen Voraussetzungen. Der tatsächliche Beitrag hängt von individuellen Faktoren ab (z. B. Alter, Standort, Risikoart). Ein rechtlich bindendes Angebot erfolgt erst nach Prüfung Ihres Antrags durch die ERGO.";

/** Ablauf vom Antrag bis zum Kennzeichen — Fristen von der Altseite. */
export const insuranceSteps = [
  {
    step: "01",
    title: "Anfrage stellen",
    text: "Persönliche Daten, Fahrzeugdaten (Marke, Modell, Rahmennummer, Baujahr) und IBAN — online oder direkt bei uns in der Werkstatt.",
  },
  {
    step: "02",
    title: "Wir bearbeiten sofort",
    text: "Ihre Daten gehen verschlüsselt an die ERGO. Wir prüfen die Angaben und stoßen den Antrag noch am selben Tag an.",
  },
  {
    step: "03",
    title: "Kennzeichen kommt per Post",
    text: "Die ERGO versendet Ihr Versicherungskennzeichen innerhalb von 5 bis 10 Werktagen direkt zu Ihnen nach Hause.",
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
