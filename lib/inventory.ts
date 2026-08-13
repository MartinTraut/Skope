/**
 * Aktueller Bestand an generalüberholten E-Scootern.
 *
 * TODO Betreiber: Verfügbarkeit und Preis vor jedem Deploy prüfen. Die Daten
 * unten stammen aus der Produktseite des alten Shops (Stand 13.08.2026) und
 * sind nicht mit einem Warenwirtschaftssystem verbunden. Ist ein Gerät weg,
 * gehört sein Eintrag hier raus – eine Liste, die verkaufte Geräte zeigt,
 * kostet mehr Vertrauen, als sie an Reichweite bringt.
 *
 * Die Angaben sind bewusst als offene Liste modelliert und nicht als feste
 * Felder: Bei einem Einzelstück weiß man vorher nicht, welche Werte gemessen
 * vorliegen. Beim Zamelux gibt es zum Beispiel keine Akkukapazität in
 * Prozent, dafür Zulassung und Traglast. Ein Pflichtfeld „batteryHealth"
 * hätte an dieser Stelle nur eine Zahl erfunden.
 */

export type InventoryImage = {
  src: string;
  /** Beschreibt, was zu sehen ist – nicht, was verkauft werden soll. */
  alt: string;
};

export type InventoryItem = {
  id: string;
  model: string;
  /** Kurze Einordnung unter dem Modellnamen, ein Satz. */
  summary: string;
  price: string;
  /** Bruttopreis als Zahl, ohne Währung – nur für das Product-Schema. */
  priceValue: string;
  specs: { label: string; value: string }[];
  /** Rechtlicher oder werkstattseitiger Hinweis unter den Daten. */
  note?: string;
  images: InventoryImage[];
};

export const inventory: InventoryItem[] = [
  {
    id: "zamelux-green-e9",
    model: "Zamelux Green S.L. E9",
    summary:
      "Kompakter Klapproller für kurze Wege und den Weg zum Bahnhof, in neuwertigem Zustand und mit deutscher Straßenzulassung.",
    price: "169,99 €",
    priceValue: "169.99",
    specs: [
      { label: "Zustand", value: "Neuwertig, werkstattgeprüft" },
      { label: "Zulassung", value: "StVZO-konform, mit Betriebserlaubnis" },
      { label: "Höchstgeschwindigkeit", value: "20 km/h" },
      { label: "Reichweite", value: "bis 20 km je nach Fahrprofil" },
      { label: "Bremsen", value: "Scheibenbremse hinten und Motorbremse" },
      {
        label: "Cockpit",
        value: "LED-Display, LED-Scheinwerfer und Rücklicht",
      },
      { label: "Zuladung", value: "bis 100 kg" },
      { label: "Lieferumfang", value: "Ladegerät und Datenbestätigung" },
    ],
    note: "Differenzbesteuerung nach § 25a UStG: Die enthaltene Umsatzsteuer wird in der Rechnung nicht gesondert ausgewiesen.",
    images: [
      {
        src: "/img/bestand/zamelux-e9-seite-rechts.jpg",
        alt: "Zamelux Green E9 von der rechten Seite, aufgeklappt und stehend",
      },
      {
        src: "/img/bestand/zamelux-e9-seite-links.jpg",
        alt: "Zamelux Green E9 von der linken Seite mit Trittbrett und Hinterrad",
      },
      {
        src: "/img/bestand/zamelux-e9-lenker.jpg",
        alt: "Blick von oben auf Lenker und Bremshebel des Zamelux Green E9",
      },
      {
        src: "/img/bestand/zamelux-e9-front.jpg",
        alt: "Zamelux Green E9 von vorn, Lenkstange und Trittbrett in ganzer Länge",
      },
      {
        src: "/img/bestand/zamelux-e9-display.jpg",
        alt: "LED-Display und Daumengas am Lenker des Zamelux Green E9 aus der Nähe",
      },
      {
        src: "/img/bestand/zamelux-e9-scheinwerfer.jpg",
        alt: "LED-Frontscheinwerfer und Faltmechanismus des Zamelux Green E9 aus der Nähe",
      },
    ],
  },
];
