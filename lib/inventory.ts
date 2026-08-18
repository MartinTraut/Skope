/**
 * Aktueller Bestand an generalüberholten E-Scootern.
 *
 * TODO Betreiber: Verfügbarkeit und Preis vor jedem Deploy prüfen. Die Daten
 * stammen aus den Produktseiten des alten Shops (Stand 13.08.2026) und sind
 * nicht mit einem Warenwirtschaftssystem verbunden. Ist ein Gerät weg, gehört
 * sein Eintrag hier raus – eine Liste, die verkaufte Geräte zeigt, kostet mehr
 * Vertrauen, als sie an Reichweite bringt.
 *
 * Sortiert nach Preis. Zwei Geräte haben ausdrücklich KEINE deutsche
 * Betriebserlaubnis (Ninebot F2 E und Xiaomi 5 Max). Das steht bei ihnen in
 * den Daten und noch einmal im Hinweis darunter, nicht im Kleingedruckten:
 * Wer so ein Gerät im Glauben an eine Zulassung kauft, fährt es unversichert.
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
  /**
   * Deutsche Betriebserlaubnis vorhanden.
   *
   * Eigenes Feld und nicht aus dem Text der Zulassungszeile gelesen: Die
   * Warnung auf der Karte hängt daran, und eine Warnung, die an einer
   * Formulierung hängt, verschwindet beim nächsten Umschreiben still.
   */
  streetLegal: boolean;
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
    price: "169,99 €",
    priceValue: "169.99",
    streetLegal: true,
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
  {
    id: "zamelux-e9-b",
    model: "Zamelux E9",
    summary:
      "Kompakter Klapproller mit Vollgummireifen, neuwertig und mit ABE.",
    price: "179,99 €",
    priceValue: "179.99",
    streetLegal: true,
    specs: [
      { label: "Zustand", value: "Neuwertig, geprüft und gewartet" },
      { label: "Zulassung", value: "ABE / eKFV vorhanden" },
      { label: "Höchstgeschwindigkeit", value: "20 km/h" },
      { label: "Bereifung", value: "8,5 Zoll Honeycomb-Vollgummi" },
      { label: "Bremsen", value: "Elektrische Bremse und Scheibenbremse" },
      { label: "Lieferumfang", value: "Ladegerät und Datenbestätigung" },
    ],
    note: "Differenzbesteuerung nach § 25a UStG: Die enthaltene Umsatzsteuer wird in der Rechnung nicht gesondert ausgewiesen.",
    images: [
      {
        src: "/img/bestand/zamelux-e9-b-1.jpg",
        alt: "Zamelux E9, Aufnahme 1 von 6",
      },
      {
        src: "/img/bestand/zamelux-e9-b-2.jpg",
        alt: "Zamelux E9, Aufnahme 2 von 6",
      },
      {
        src: "/img/bestand/zamelux-e9-b-3.jpg",
        alt: "Zamelux E9, Aufnahme 3 von 6",
      },
      {
        src: "/img/bestand/zamelux-e9-b-4.jpg",
        alt: "Zamelux E9, Aufnahme 4 von 6",
      },
      {
        src: "/img/bestand/zamelux-e9-b-5.jpg",
        alt: "Zamelux E9, Aufnahme 5 von 6",
      },
      {
        src: "/img/bestand/zamelux-e9-b-6.jpg",
        alt: "Zamelux E9, Aufnahme 6 von 6",
      },
    ],
  },
  {
    id: "sharp-em-ks1de",
    model: "Sharp EM-KS1DE",
    summary:
      "Generalüberholter Pendlerroller in Weiß, mit pannensicheren Vollgummireifen und USB-Anschluss am Lenker.",
    price: "199,99 €",
    priceValue: "199.99",
    streetLegal: true,
    specs: [
      { label: "Zustand", value: "Generalüberholt, geprüft und gereinigt" },
      { label: "Zulassung", value: "StVZO-konform, mit Straßenzulassung" },
      { label: "Höchstgeschwindigkeit", value: "20 km/h" },
      { label: "Reichweite", value: "bis 25 km" },
      { label: "Motor", value: "350 W Nenndauerleistung" },
      { label: "Bereifung", value: "8,5 Zoll Vollgummi, pannensicher" },
      {
        label: "Bremsen",
        value: "Elektrische Bremse und Scheibenbremse hinten",
      },
      { label: "Besonderheit", value: "USB-Anschluss am Lenker" },
    ],
    note: "Differenzbesteuerung nach § 25a UStG: Die enthaltene Umsatzsteuer wird in der Rechnung nicht gesondert ausgewiesen.",
    images: [
      {
        src: "/img/bestand/sharp-em-ks1de-1.jpg",
        alt: "Sharp EM-KS1DE, Aufnahme 1 von 6",
      },
      {
        src: "/img/bestand/sharp-em-ks1de-2.jpg",
        alt: "Sharp EM-KS1DE, Aufnahme 2 von 6",
      },
      {
        src: "/img/bestand/sharp-em-ks1de-3.jpg",
        alt: "Sharp EM-KS1DE, Aufnahme 3 von 6",
      },
      {
        src: "/img/bestand/sharp-em-ks1de-4.jpg",
        alt: "Sharp EM-KS1DE, Aufnahme 4 von 6",
      },
      {
        src: "/img/bestand/sharp-em-ks1de-5.jpg",
        alt: "Sharp EM-KS1DE, Aufnahme 5 von 6",
      },
      {
        src: "/img/bestand/sharp-em-ks1de-6.jpg",
        alt: "Sharp EM-KS1DE, Aufnahme 6 von 6",
      },
    ],
  },
  {
    id: "niu-kqi1-pro",
    model: "NIU KQi1 Pro",
    summary:
      "Fabrikneu und original verpackt, mit deutscher Zulassung. Leicht, wendig und mit breitem Trittbrett.",
    price: "199,99 €",
    priceValue: "199.99",
    streetLegal: true,
    specs: [
      { label: "Zustand", value: "Neuware, originalverpackt" },
      { label: "Zulassung", value: "ABE / eKFV vorhanden, deutsche Version" },
      { label: "Höchstgeschwindigkeit", value: "20 km/h" },
      { label: "Reichweite", value: "bis 25 km" },
      { label: "Lieferumfang", value: "Scooter, Ladegerät, Rechnung" },
    ],
    note: "Neugerät mit ausgewiesener Umsatzsteuer und Rechnung auf Ihren Namen.",
    images: [
      {
        src: "/img/bestand/niu-kqi1-pro-1.jpg",
        alt: "NIU KQi1 Pro, Aufnahme 1 von 6",
      },
      {
        src: "/img/bestand/niu-kqi1-pro-2.jpg",
        alt: "NIU KQi1 Pro, Aufnahme 2 von 6",
      },
      {
        src: "/img/bestand/niu-kqi1-pro-3.jpg",
        alt: "NIU KQi1 Pro, Aufnahme 3 von 6",
      },
      {
        src: "/img/bestand/niu-kqi1-pro-4.jpg",
        alt: "NIU KQi1 Pro, Aufnahme 4 von 6",
      },
      {
        src: "/img/bestand/niu-kqi1-pro-5.jpg",
        alt: "NIU KQi1 Pro, Aufnahme 5 von 6",
      },
      {
        src: "/img/bestand/niu-kqi1-pro-6.jpg",
        alt: "NIU KQi1 Pro, Aufnahme 6 von 6",
      },
    ],
  },
  {
    id: "niu-kqi-100f",
    model: "NIU KQi 100F",
    summary:
      "Neuwertiger Roller der F-Serie mit klappbarem Lenker und Federung vorn.",
    price: "199,99 €",
    priceValue: "199.99",
    streetLegal: true,
    specs: [
      { label: "Zustand", value: "Neuwertig, geprüft und gewartet" },
      { label: "Zulassung", value: "ABE / eKFV vorhanden" },
      { label: "Höchstgeschwindigkeit", value: "20 km/h" },
      { label: "Reichweite", value: "bis 29 km" },
      { label: "Federung", value: "Vorderrad-Gabelfederung" },
      { label: "Besonderheit", value: "Klappbarer Lenker" },
      { label: "Lieferumfang", value: "Scooter, Ladegerät, Datenbestätigung" },
    ],
    note: "Differenzbesteuerung nach § 25a UStG: Die enthaltene Umsatzsteuer wird in der Rechnung nicht gesondert ausgewiesen.",
    images: [
      {
        src: "/img/bestand/niu-kqi-100f-1.jpg",
        alt: "NIU KQi 100F, Aufnahme 1 von 6",
      },
      {
        src: "/img/bestand/niu-kqi-100f-2.jpg",
        alt: "NIU KQi 100F, Aufnahme 2 von 6",
      },
      {
        src: "/img/bestand/niu-kqi-100f-3.jpg",
        alt: "NIU KQi 100F, Aufnahme 3 von 6",
      },
      {
        src: "/img/bestand/niu-kqi-100f-4.jpg",
        alt: "NIU KQi 100F, Aufnahme 4 von 6",
      },
      {
        src: "/img/bestand/niu-kqi-100f-5.jpg",
        alt: "NIU KQi 100F, Aufnahme 5 von 6",
      },
      {
        src: "/img/bestand/niu-kqi-100f-6.jpg",
        alt: "NIU KQi 100F, Aufnahme 6 von 6",
      },
    ],
  },
  {
    id: "xiaomi-4-lite",
    model: "Xiaomi Electric Scooter 4 Lite",
    summary:
      "Der schlanke Einstieg von Xiaomi, vollständig geprüft und gewartet, mit Straßenzulassung.",
    price: "199,99 €",
    priceValue: "199.99",
    streetLegal: true,
    specs: [
      {
        label: "Zustand",
        value: "Gebraucht, vollständig geprüft und gewartet",
      },
      { label: "Zulassung", value: "ABE / eKFV vorhanden" },
      { label: "Höchstgeschwindigkeit", value: "20 km/h" },
      { label: "Motor", value: "300 W Nennleistung, 600 W Spitze" },
      { label: "Reichweite", value: "bis 20 km" },
      { label: "Bereifung", value: "10 Zoll Luftreifen" },
      { label: "Bremsen", value: "E-ABS vorn, Trommelbremse hinten" },
      { label: "Lieferumfang", value: "Scooter, Ladegerät, Datenbestätigung" },
    ],
    note: "Differenzbesteuerung nach § 25a UStG: Die enthaltene Umsatzsteuer wird in der Rechnung nicht gesondert ausgewiesen.",
    images: [
      {
        src: "/img/bestand/xiaomi-4-lite-1.jpg",
        alt: "Xiaomi Electric Scooter 4 Lite, Aufnahme 1 von 6",
      },
      {
        src: "/img/bestand/xiaomi-4-lite-2.jpg",
        alt: "Xiaomi Electric Scooter 4 Lite, Aufnahme 2 von 6",
      },
      {
        src: "/img/bestand/xiaomi-4-lite-3.jpg",
        alt: "Xiaomi Electric Scooter 4 Lite, Aufnahme 3 von 6",
      },
      {
        src: "/img/bestand/xiaomi-4-lite-4.jpg",
        alt: "Xiaomi Electric Scooter 4 Lite, Aufnahme 4 von 6",
      },
      {
        src: "/img/bestand/xiaomi-4-lite-5.jpg",
        alt: "Xiaomi Electric Scooter 4 Lite, Aufnahme 5 von 6",
      },
      {
        src: "/img/bestand/xiaomi-4-lite-6.jpg",
        alt: "Xiaomi Electric Scooter 4 Lite, Aufnahme 6 von 6",
      },
    ],
  },
  {
    id: "odys-pax",
    model: "Odys Pax (2023)",
    summary:
      "Generalüberholtes Modelljahr 2023 mit ausgelesenem Akkutest und justiertem Doppelbremssystem.",
    price: "209,99 €",
    priceValue: "209.99",
    streetLegal: true,
    specs: [
      { label: "Zustand", value: "Generalüberholt, Akku ausgelesen" },
      { label: "Modelljahr", value: "2023" },
      { label: "Bremsen", value: "Duales Bremssystem, neu justiert" },
      { label: "Prüfung", value: "Akkutest, Bremsencheck, Elektroniktest" },
    ],
    note: "Differenzbesteuerung nach § 25a UStG: Die enthaltene Umsatzsteuer wird in der Rechnung nicht gesondert ausgewiesen.",
    images: [
      {
        src: "/img/bestand/odys-pax-1.jpg",
        alt: "Odys Pax (2023), Aufnahme 1 von 6",
      },
      {
        src: "/img/bestand/odys-pax-2.jpg",
        alt: "Odys Pax (2023), Aufnahme 2 von 6",
      },
      {
        src: "/img/bestand/odys-pax-3.jpg",
        alt: "Odys Pax (2023), Aufnahme 3 von 6",
      },
      {
        src: "/img/bestand/odys-pax-4.jpg",
        alt: "Odys Pax (2023), Aufnahme 4 von 6",
      },
      {
        src: "/img/bestand/odys-pax-5.jpg",
        alt: "Odys Pax (2023), Aufnahme 5 von 6",
      },
      {
        src: "/img/bestand/odys-pax-6.jpg",
        alt: "Odys Pax (2023), Aufnahme 6 von 6",
      },
    ],
  },
  {
    id: "xiaomi-4",
    model: "Xiaomi Electric Scooter 4",
    summary:
      "Geprüfte Gebrauchtware im Top-Zustand, mit Straßenzulassung und 35 km Reichweite.",
    price: "249,99 €",
    priceValue: "249.99",
    streetLegal: true,
    specs: [
      { label: "Zustand", value: "Gebraucht, Top-Zustand, voll geprüft" },
      { label: "Zulassung", value: "ABE / eKFV vorhanden" },
      { label: "Höchstgeschwindigkeit", value: "20 km/h" },
      { label: "Motor", value: "300 W Nennleistung, 600 W Spitze" },
      { label: "Reichweite", value: "bis 35 km" },
      { label: "Bereifung", value: "10 Zoll schlauchlose Luftreifen" },
      { label: "Bremsen", value: "E-ABS vorn, Scheibenbremse hinten" },
      { label: "Lieferumfang", value: "Scooter, Ladegerät, Datenbestätigung" },
    ],
    note: "Differenzbesteuerung nach § 25a UStG: Die enthaltene Umsatzsteuer wird in der Rechnung nicht gesondert ausgewiesen.",
    images: [
      {
        src: "/img/bestand/xiaomi-4-1.jpg",
        alt: "Xiaomi Electric Scooter 4, Aufnahme 1 von 6",
      },
      {
        src: "/img/bestand/xiaomi-4-2.jpg",
        alt: "Xiaomi Electric Scooter 4, Aufnahme 2 von 6",
      },
      {
        src: "/img/bestand/xiaomi-4-3.jpg",
        alt: "Xiaomi Electric Scooter 4, Aufnahme 3 von 6",
      },
      {
        src: "/img/bestand/xiaomi-4-4.jpg",
        alt: "Xiaomi Electric Scooter 4, Aufnahme 4 von 6",
      },
      {
        src: "/img/bestand/xiaomi-4-5.jpg",
        alt: "Xiaomi Electric Scooter 4, Aufnahme 5 von 6",
      },
      {
        src: "/img/bestand/xiaomi-4-6.jpg",
        alt: "Xiaomi Electric Scooter 4, Aufnahme 6 von 6",
      },
    ],
  },
  {
    id: "ninebot-f2-e",
    model: "Segway-Ninebot F2 E",
    summary:
      "Internationale 25-km/h-Version mit Heckantrieb und Traktionskontrolle. Generalüberholt, minimale Gebrauchsspuren.",
    price: "289,99 €",
    priceValue: "289.99",
    streetLegal: false,
    specs: [
      {
        label: "Zustand",
        value: "Generalüberholt, minimale optische Gebrauchsspuren",
      },
      {
        label: "Zulassung",
        value: "Keine deutsche Straßenzulassung (internationale Version)",
      },
      { label: "Höchstgeschwindigkeit", value: "25 km/h" },
      { label: "Motor", value: "800 W Spitzenleistung, Heckantrieb" },
      { label: "Besonderheit", value: "Traktionskontrolle (TCS)" },
    ],
    note: "Ohne deutsche Betriebserlaubnis darf dieses Gerät nicht am öffentlichen Straßenverkehr teilnehmen. Es ist für Privatgelände, Export oder die Nutzung im Ausland gedacht.",
    images: [
      {
        src: "/img/bestand/ninebot-f2-e-1.jpg",
        alt: "Segway-Ninebot F2 E, Aufnahme 1 von 6",
      },
      {
        src: "/img/bestand/ninebot-f2-e-2.jpg",
        alt: "Segway-Ninebot F2 E, Aufnahme 2 von 6",
      },
      {
        src: "/img/bestand/ninebot-f2-e-3.jpg",
        alt: "Segway-Ninebot F2 E, Aufnahme 3 von 6",
      },
      {
        src: "/img/bestand/ninebot-f2-e-4.jpg",
        alt: "Segway-Ninebot F2 E, Aufnahme 4 von 6",
      },
      {
        src: "/img/bestand/ninebot-f2-e-5.jpg",
        alt: "Segway-Ninebot F2 E, Aufnahme 5 von 6",
      },
      {
        src: "/img/bestand/ninebot-f2-e-6.jpg",
        alt: "Segway-Ninebot F2 E, Aufnahme 6 von 6",
      },
    ],
  },
  {
    id: "ninebot-f2-pro",
    model: "Segway Ninebot F2 Pro",
    summary:
      "Generalüberholt und meistergeprüft, mit Blinkern, Traktionskontrolle und 55 km Reichweite.",
    price: "299,99 €",
    priceValue: "299.99",
    streetLegal: true,
    specs: [
      { label: "Zustand", value: "Generalüberholt und meistergeprüft" },
      { label: "Zulassung", value: "ABE / eKFV vorhanden" },
      { label: "Höchstgeschwindigkeit", value: "20 km/h" },
      { label: "Motor", value: "450 W Nennleistung, 900 W Spitze" },
      { label: "Reichweite", value: "bis 55 km" },
      { label: "Fahrwerk", value: "Vorderrad-Gabelfederung" },
      { label: "Bereifung", value: "10 Zoll schlauchlos mit Gelschicht" },
      {
        label: "Besonderheiten",
        value: "Blinker, Traktionskontrolle, Apple Find My",
      },
    ],
    note: "Differenzbesteuerung nach § 25a UStG: Die enthaltene Umsatzsteuer wird in der Rechnung nicht gesondert ausgewiesen.",
    images: [
      {
        src: "/img/bestand/ninebot-f2-pro-1.jpg",
        alt: "Segway Ninebot F2 Pro, Aufnahme 1 von 6",
      },
      {
        src: "/img/bestand/ninebot-f2-pro-2.jpg",
        alt: "Segway Ninebot F2 Pro, Aufnahme 2 von 6",
      },
      {
        src: "/img/bestand/ninebot-f2-pro-3.jpg",
        alt: "Segway Ninebot F2 Pro, Aufnahme 3 von 6",
      },
      {
        src: "/img/bestand/ninebot-f2-pro-4.jpg",
        alt: "Segway Ninebot F2 Pro, Aufnahme 4 von 6",
      },
      {
        src: "/img/bestand/ninebot-f2-pro-5.jpg",
        alt: "Segway Ninebot F2 Pro, Aufnahme 5 von 6",
      },
      {
        src: "/img/bestand/ninebot-f2-pro-6.jpg",
        alt: "Segway Ninebot F2 Pro, Aufnahme 6 von 6",
      },
    ],
  },
  {
    id: "ninebot-e3-pro",
    model: "Segway Ninebot E3 Pro",
    summary:
      "Geprüfte Gebrauchtware mit doppelter Elastomerfederung, Blinkern und 55 km Reichweite.",
    price: "309,99 €",
    priceValue: "309.99",
    streetLegal: true,
    specs: [
      {
        label: "Zustand",
        value: "Gebraucht, vollständig geprüft und gewartet",
      },
      { label: "Zulassung", value: "ABE / eKFV vorhanden" },
      { label: "Höchstgeschwindigkeit", value: "20 km/h" },
      { label: "Motor", value: "bis 800 W Spitzenleistung" },
      { label: "Reichweite", value: "bis 55 km" },
      { label: "Fahrwerk", value: "Elastomerfederung vorn und hinten" },
      { label: "Bereifung", value: "10 Zoll schlauchlos" },
      { label: "Besonderheiten", value: "Blinker, Apple Find My" },
    ],
    note: "Differenzbesteuerung nach § 25a UStG: Die enthaltene Umsatzsteuer wird in der Rechnung nicht gesondert ausgewiesen.",
    images: [
      {
        src: "/img/bestand/ninebot-e3-pro-1.jpg",
        alt: "Segway Ninebot E3 Pro, Aufnahme 1 von 6",
      },
      {
        src: "/img/bestand/ninebot-e3-pro-2.jpg",
        alt: "Segway Ninebot E3 Pro, Aufnahme 2 von 6",
      },
      {
        src: "/img/bestand/ninebot-e3-pro-3.jpg",
        alt: "Segway Ninebot E3 Pro, Aufnahme 3 von 6",
      },
      {
        src: "/img/bestand/ninebot-e3-pro-4.jpg",
        alt: "Segway Ninebot E3 Pro, Aufnahme 4 von 6",
      },
      {
        src: "/img/bestand/ninebot-e3-pro-5.jpg",
        alt: "Segway Ninebot E3 Pro, Aufnahme 5 von 6",
      },
      {
        src: "/img/bestand/ninebot-e3-pro-6.jpg",
        alt: "Segway Ninebot E3 Pro, Aufnahme 6 von 6",
      },
    ],
  },
  {
    id: "xiaomi-5-max",
    model: "Xiaomi Electric Scooter 5 Max",
    summary:
      "Internationale EU-Variante mit 25 km/h. Ohne deutsche Zulassung, also für Privatgelände, Export oder die Nutzung im Ausland.",
    price: "359,99 €",
    priceValue: "359.99",
    streetLegal: false,
    specs: [
      { label: "Zustand", value: "Gebraucht, geprüft und gewartet" },
      {
        label: "Zulassung",
        value: "Keine deutsche Straßenzulassung (ohne eKFV)",
      },
      { label: "Höchstgeschwindigkeit", value: "ca. 25 km/h" },
      { label: "Einsatz", value: "Privatgelände, Export, Ausland" },
      { label: "Lieferumfang", value: "Scooter, Ladekabel" },
    ],
    note: "Ohne deutsche Betriebserlaubnis darf dieses Gerät nicht am öffentlichen Straßenverkehr teilnehmen. Es ist für Privatgelände, Export oder die Nutzung im Ausland gedacht.",
    images: [
      {
        src: "/img/bestand/xiaomi-5-max-1.jpg",
        alt: "Xiaomi Electric Scooter 5 Max, Aufnahme 1 von 6",
      },
      {
        src: "/img/bestand/xiaomi-5-max-2.jpg",
        alt: "Xiaomi Electric Scooter 5 Max, Aufnahme 2 von 6",
      },
      {
        src: "/img/bestand/xiaomi-5-max-3.jpg",
        alt: "Xiaomi Electric Scooter 5 Max, Aufnahme 3 von 6",
      },
      {
        src: "/img/bestand/xiaomi-5-max-4.jpg",
        alt: "Xiaomi Electric Scooter 5 Max, Aufnahme 4 von 6",
      },
      {
        src: "/img/bestand/xiaomi-5-max-5.jpg",
        alt: "Xiaomi Electric Scooter 5 Max, Aufnahme 5 von 6",
      },
      {
        src: "/img/bestand/xiaomi-5-max-6.jpg",
        alt: "Xiaomi Electric Scooter 5 Max, Aufnahme 6 von 6",
      },
    ],
  },
  {
    id: "audi-egret-pro",
    model: "Audi Electric Kick Scooter powered by Egret Pro",
    summary:
      "Das stärkste Gerät im Bestand: 705-Wh-Akku mit Samsung-Zellen, hydraulische Scheibenbremsen vorn und hinten, rund 400 km gelaufen.",
    price: "599,99 €",
    priceValue: "599.99",
    streetLegal: true,
    specs: [
      {
        label: "Zustand",
        value: "Top-Zustand, ca. 400 km gelaufen, werkstattgeprüft",
      },
      { label: "Zulassung", value: "StVZO-konform, mit Straßenzulassung" },
      { label: "Höchstgeschwindigkeit", value: "20 km/h" },
      { label: "Motor", value: "500 W Nennleistung, 950 W Spitze, 27 Nm" },
      { label: "Akku", value: "705 Wh mit Samsung-Zellen" },
      { label: "Reichweite", value: "bis 80 km" },
      {
        label: "Bremsen",
        value: "Hydraulische Scheibenbremsen vorn und hinten, 120 mm",
      },
      { label: "Bereifung", value: "10 Zoll Luftreifen" },
      { label: "Beleuchtung", value: "Zertifiziertes LED-System, 40 Lux vorn" },
    ],
    note: "Differenzbesteuerung nach § 25a UStG: Die enthaltene Umsatzsteuer wird in der Rechnung nicht gesondert ausgewiesen.",
    images: [
      {
        src: "/img/bestand/audi-egret-pro-1.jpg",
        alt: "Audi Electric Kick Scooter powered by Egret Pro, Aufnahme 1 von 6",
      },
      {
        src: "/img/bestand/audi-egret-pro-2.jpg",
        alt: "Audi Electric Kick Scooter powered by Egret Pro, Aufnahme 2 von 6",
      },
      {
        src: "/img/bestand/audi-egret-pro-3.jpg",
        alt: "Audi Electric Kick Scooter powered by Egret Pro, Aufnahme 3 von 6",
      },
      {
        src: "/img/bestand/audi-egret-pro-4.jpg",
        alt: "Audi Electric Kick Scooter powered by Egret Pro, Aufnahme 4 von 6",
      },
      {
        src: "/img/bestand/audi-egret-pro-5.jpg",
        alt: "Audi Electric Kick Scooter powered by Egret Pro, Aufnahme 5 von 6",
      },
      {
        src: "/img/bestand/audi-egret-pro-6.jpg",
        alt: "Audi Electric Kick Scooter powered by Egret Pro, Aufnahme 6 von 6",
      },
    ],
  },
];

/**
 * Ein Gerät über seinen Bezeichner.
 *
 * Der Bezeichner ist zugleich das Adressteil der Geräteseite
 * (`/e-scooter/<id>`). Deshalb hier eine Funktion und keine Map: Die Liste hat
 * dreizehn Einträge, und eine zweite Datenstruktur, die mit der ersten
 * synchron gehalten werden muss, wäre bei dieser Größe nur eine weitere
 * Stelle, an der etwas auseinanderläuft.
 */
export function inventoryItem(id: string): InventoryItem | undefined {
  return inventory.find((item) => item.id === id);
}

/**
 * Zwei weitere Geräte in der Nähe des Preises.
 *
 * Nicht zufällig und nicht „die nächsten beiden in der Liste": Die Liste ist
 * nach Preis sortiert, also sind die direkten Nachbarn die Geräte, zwischen
 * denen tatsächlich abgewogen wird. Am Rand der Liste rückt das Fenster nach
 * innen, sonst stünde beim günstigsten Gerät nur eine einzige Empfehlung.
 */
export function relatedInventory(id: string, count = 3): InventoryItem[] {
  const index = inventory.findIndex((item) => item.id === id);
  if (index < 0) return inventory.slice(0, count);

  const others = inventory.filter((_, i) => i !== index);
  const start = Math.min(
    Math.max(0, index - Math.floor(count / 2)),
    Math.max(0, others.length - count),
  );
  return others.slice(start, start + count);
}

/**
 * Marke je Modell, über Muster statt über ein Datenfeld.
 *
 * Ein Feld `brand` wäre die sauberere Modellierung – und die dreizehnte
 * Stelle, an der beim Eintragen eines Geräts etwas vergessen werden kann.
 * Die Modellnamen stehen so auf den Typenschildern, und aus ihnen ist die
 * Marke eindeutig ablesbar; nur die Schreibweisen schwanken („Segway-Ninebot"
 * und „Segway Ninebot" stehen beide in der Liste) und der Audi läuft unter
 * „Audi Electric Kick Scooter powered by Egret Pro". Genau diese beiden Fälle
 * fängt die Tabelle ab. Fällt ein Modell durch alle Muster, taucht seine
 * Marke schlicht nicht auf – das ist eine Lücke in der Aufzählung, kein
 * falscher Name.
 */
const BRAND_PATTERNS: readonly [RegExp, string][] = [
  [/^Xiaomi/i, "Xiaomi"],
  [/^Segway[- ]Ninebot/i, "Segway-Ninebot"],
  [/^NIU/i, "NIU"],
  [/^Sharp/i, "Sharp"],
  [/^Odys/i, "Odys"],
  [/^Zamelux/i, "Zamelux"],
  [/Egret/i, "Audi Egret"],
];

/**
 * Die harten Angaben über den Bestand: Stückzahl, Preisspanne, Marken.
 *
 * Berechnet und nicht von Hand geschrieben. Vorher standen Stückzahl,
 * Spanne und Markenliste als Fließtext in der Sektion – bei einem Bestand,
 * der laut eigener Ansage laufend wechselt, wäre das der erste Satz, der
 * unbemerkt falsch wird. Wer ein Gerät aus `inventory` löscht, korrigiert
 * damit auch diese Zeile.
 */
export function inventoryFacts() {
  const values = inventory.map((item) => Number(item.priceValue));
  const format = (value: number) =>
    value.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    });

  const brands: string[] = [];
  for (const item of inventory) {
    const match = BRAND_PATTERNS.find(([pattern]) => pattern.test(item.model));
    if (match && !brands.includes(match[1])) brands.push(match[1]);
  }

  return {
    count: inventory.length,
    priceFrom: format(Math.min(...values)),
    priceTo: format(Math.max(...values)),
    brands,
  };
}
