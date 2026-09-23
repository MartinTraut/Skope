/**
 * Aktueller Bestand.
 *
 * **Quelle: die Kleinanzeigen-Händlerseite des Betriebs**
 * (kleinanzeigen.de/pro/skopegebrauchtwarenhandel), abgerufen am 20.09.2026.
 * Modelle, Preise, technische Daten und Bilder stammen von dort. Bis zu
 * diesem Tag stand hier eine Platzhalterliste aus dem alten Shop, deren
 * Preise und Stückzahlen der Betreiber ausdrücklich als fiktiv bezeichnet
 * hatte – die ist vollständig ersetzt.
 *
 * Neun Modelle, dreizehn Geräte: sieben E-Scooter, ein E-Chopper und ein
 * E-Dreirad. Art und Zustand stehen als Felder an jedem Eintrag, damit
 * Kategorieseiten, Plaketten und Filter aus den Daten kommen und nicht aus
 * dem Text.
 *
 * **Was hier bewusst NICHT steht:** Reichweiten in Kilometern bei Chopper
 * und Dreirad. Die Anzeigen nennen dort nur die Akkukapazität (30 Ah, 20 Ah),
 * und aus Amperestunden eine Reichweite zu rechnen hieße, eine Zahl zu
 * erfinden, an der ein Käufer sein Kaufmotiv festmacht. Dasselbe beim NAVEE
 * UT5 Max: Die Anzeige beschreibt Akku und Motor in Worten, nicht in Werten.
 *
 * TODO Betreiber 1: Verfügbarkeit und Preis vor jedem Deploy prüfen. Die
 * Liste hängt an keinem Warenwirtschaftssystem. Ist ein Gerät weg, gehört
 * sein Eintrag hier raus – eine Liste, die verkaufte Geräte zeigt, kostet
 * mehr Vertrauen, als sie an Reichweite bringt.
 *
 * TODO Betreiber 2: Jede Kleinanzeige nennt „Differenzbesteuerung nach
 * § 25a UStG". Impressum und Schema dieser Website führen den Betrieb als
 * Kleinunternehmer nach § 19 UStG. Beides zusammen geht nicht: Wer § 19
 * anwendet, weist ohnehin keine Umsatzsteuer aus und wendet § 25a nicht an.
 * Eine der beiden Angaben ist falsch, und sie steht öffentlich. Klären,
 * bevor die Seite live geht.
 *
 * TODO Betreiber 3: Chopper und Dreirad fahren 45 km/h und sind damit
 * Kleinkrafträder, keine Elektrokleinstfahrzeuge. Der ERGO-Aushang auf
 * `/versicherung` führt Tarife für Elektrokleinstfahrzeuge. Ob die
 * Vermittlung auch das Kennzeichen für Kleinkrafträder abdeckt und zu
 * welchem Beitrag, ist ungeklärt – deshalb steht auf den beiden Geräten nur,
 * dass es ein anderer Tarif ist, und keine Zahl.
 *
 * Sortiert nach Preis. Ein Gerät hat ausdrücklich KEINE deutsche
 * Betriebserlaubnis (Ninebot F2 E, internationale 25-km/h-Fassung). Das
 * steht bei ihm in den Daten und noch einmal im Hinweis darunter, nicht im
 * Kleingedruckten: Wer so ein Gerät im Glauben an eine Zulassung kauft,
 * fährt es unversichert.
 *
 * Die Angaben sind bewusst als offene Liste modelliert und nicht als feste
 * Felder: Bei einem Einzelstück weiß man vorher nicht, welche Werte
 * vorliegen. Der NAVEE hat keine belegte Reichweite, der Chopper keine
 * Steigfähigkeit, der Audi dafür eine Laufleistung. Ein Pflichtfeld
 * „Reichweite" hätte an diesen Stellen nur eine Zahl erfunden.
 */
import type { Availability } from "@/lib/commerce";
import type { VehicleCategory } from "@/lib/data/vehicles";

export type InventoryImage = {
  src: string;
  /** Beschreibt, was zu sehen ist – nicht, was verkauft werden soll. */
  alt: string;
};

export type InventoryItem = {
  id: string;
  /**
   * Fahrzeugart. Sie entscheidet, auf welcher Kategorieseite das Gerät
   * auftaucht – `/e-scooter`, `/e-chopper`, `/e-roller` oder `/e-trike`.
   *
   * Sieben Einträge stehen auf `"scooter"`, einer auf `"chopper"`, einer auf
   * `"trike"`. Das Feld ist Pflicht und hat keinen Vorgabewert: Ein
   * E-Chopper, der beim Eintragen die Art vergisst, landete sonst
   * stillschweigend in der Scooter-Auslage.
   */
  category: VehicleCategory;
  /**
   * Neu oder generalüberholt.
   *
   * Auskunft des Betreibers vom 20.09.2026, bestätigt durch die Anzeigen:
   * Chopper, Dreirad und der Xiaomi 6 Ultra sind Neuware in
   * Originalverpackung, die übrigen sechs Modelle sind geprüfte
   * Gebrauchtgeräte. Bis zu diesem Tag ging die ganze Seite von Gebrauchtware
   * aus – „Neu & geprüft gebraucht" war im Review vom 14.09. ausdrücklich
   * *nicht* gebaut worden, weil es das Feld nicht gab.
   *
   * Der Zustand ist ein Feld am Gerät und keine eigene Kategorieseite: Sonst
   * konkurrieren „E-Chopper kaufen" und „E-Chopper neu kaufen" um dieselbe
   * Suche, und jedes Gerät wird an zwei Stellen gepflegt. Als Feld trägt es
   * die Plakette auf der Karte und den Filter im Bestand.
   *
   */
  condition: "neu" | "generalueberholt";
  /**
   * Wie viele Geräte dieses Modells dastehen.
   *
   * Der Bestand führt Neuware in Stückzahlen: dreimal derselbe Mangosteen
   * M1-P, dreimal derselbe Xiaomi 6 Ultra – in den Kleinanzeigen als je drei
   * eigene Anzeigen, hier als **ein** Eintrag mit `quantity`. Drei
   * gleichnamige Karten mit demselben Bild und demselben Preis liest niemand
   * als Vorrat, sondern als Fehler in der Liste.
   *
   * Die gebrauchten Geräte sind Einzelstücke und stehen auf 1. Das Feld ist
   * Pflicht und hat keinen Vorgabewert: Eine fehlende Stückzahl wäre sonst
   * stillschweigend eine 1, und die Zählung im Kopfbereich wäre zu niedrig.
   */
  quantity: number;
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
  /**
   * Zustand des Einzelstücks.
   *
   * Optional und ohne Wert in allen Einträgen – das ist keine
   * Nachlässigkeit, sondern die Pflegeregel dieser Datei: Was hier steht, ist
   * da; ein verkauftes Gerät wird gelöscht. `availabilityOf()` liefert
   * deshalb „available", solange nichts anderes eingetragen ist.
   *
   * Das Feld existiert trotzdem, weil die Oberfläche die anderen beiden
   * Zustände darstellen können muss, bevor Shopify sie liefert: Sonst wäre
   * der Anschluss nicht das Füllen eines Feldes, sondern ein zweiter Umbau
   * von Karte, Geräteseite, Aktionsleiste und Schema.
   */
  availability?: Availability;
};

export const inventory: InventoryItem[] = [
  {
    id: "ninebot-f2-e",
    category: "scooter",
    condition: "generalueberholt",
    quantity: 1,
    model: "Segway-Ninebot KickScooter F2 E",
    summary:
      "Internationale 25-km/h-Fassung, generalüberholt. Ohne deutsche Straßenzulassung – für Privatgelände, Betriebshöfe, Campingplätze und das Ausland.",
    price: "249,00 €",
    priceValue: "249.00",
    streetLegal: false,
    specs: [
      { label: "Zustand", value: "Generalüberholt, minimale Gebrauchsspuren" },
      {
        label: "Zulassung",
        value:
          "Keine deutsche Betriebserlaubnis – internationale Fassung mit 25 km/h",
      },
      { label: "Höchstgeschwindigkeit", value: "25 km/h ab Werk" },
      { label: "Reichweite", value: "bis 40 km je nach Fahrweise und Gelände" },
      { label: "Motor", value: "Heckantrieb, 400 W Nenn- / 800 W Spitzenleistung" },
      { label: "Steigfähigkeit", value: "bis 18 %" },
      {
        label: "Bremsen",
        value: "Scheibenbremse vorn, elektronische Bremse hinten",
      },
      {
        label: "Reifen",
        value: "10 Zoll, schlauchlos und selbstabdichtend",
      },
      {
        label: "Ausstattung",
        value:
          "Blinker vorn und hinten, LED-Frontlicht, Bremslicht, Traktionskontrolle",
      },
      {
        label: "Smartes",
        value: "Apple „Wo ist?“, Bluetooth-App, Wegfahrsperre",
      },
      { label: "Zuladung", value: "bis 120 kg" },
      { label: "Lieferumfang", value: "Original-Ladegerät, Rechnung" },
    ],
    note: "Dieses Gerät hat keine deutsche Betriebserlaubnis. Auf öffentlichen Straßen darf es damit nicht gefahren werden – auch nicht mit Versicherungskennzeichen. Gedacht ist es für Privatgelände, Betriebshöfe und Campingplätze oder für Länder, in denen 25 km/h zulässig sind.",
    images: [
      {
        src: "/img/bestand/ninebot-f2-e-1.jpg",
        alt: "Segway-Ninebot F2 E von der Seite, aufgeklappt vor der Containerwand stehend",
      },
      {
        src: "/img/bestand/ninebot-f2-e-2.jpg",
        alt: "Segway-Ninebot F2 E schräg von vorn, Lenkstange und Trittbrett im Sonnenlicht",
      },
      {
        src: "/img/bestand/ninebot-f2-e-3.jpg",
        alt: "Segway-Ninebot F2 E frontal, Lenker mit Display und Trittbrett von oben",
      },
      {
        src: "/img/bestand/ninebot-f2-e-4.jpg",
        alt: "Segway-Ninebot F2 E frontal auf der Gummimatte, ganze Länge sichtbar",
      },
      {
        src: "/img/bestand/ninebot-f2-e-5.jpg",
        alt: "Lenker des Segway-Ninebot F2 E mit Display und Bremshebel aus der Nähe",
      },
      {
        src: "/img/bestand/ninebot-f2-e-6.jpg",
        alt: "Cockpit des Segway-Ninebot F2 E mit angehängtem Datenblatt der Werkstatt",
      },
    ],
  },
  {
    id: "ninebot-f2-pro",
    category: "scooter",
    condition: "generalueberholt",
    quantity: 1,
    model: "Segway Ninebot KickScooter F2 Pro",
    summary:
      "In der Werkstatt zerlegt, geprüft und wieder aufgebaut: Vorderradfederung, Blinker und deutsche Betriebserlaubnis.",
    price: "269,00 €",
    priceValue: "269.00",
    streetLegal: true,
    specs: [
      {
        label: "Zustand",
        value:
          "Generalüberholt – Bremsen, Akkuzellen, Elektronik und Klappmechanismus geprüft",
      },
      {
        label: "Zulassung",
        value: "Deutsche Betriebserlaubnis nach eKFV, Datenbestätigung liegt bei",
      },
      { label: "Höchstgeschwindigkeit", value: "20 km/h" },
      { label: "Reichweite", value: "bis 55 km je nach Fahrmodus" },
      { label: "Motor", value: "bis 900 W Spitzenleistung" },
      { label: "Steigfähigkeit", value: "bis 22 %" },
      { label: "Federung", value: "Vorderradfederung" },
      { label: "Bremsen", value: "Scheibenbremse vorn" },
      {
        label: "Reifen",
        value: "10 Zoll, schlauchlos mit Gelschicht gegen Pannen",
      },
      {
        label: "Ausstattung",
        value: "Blinker vorn und hinten, Traktionskontrolle",
      },
      { label: "Smartes", value: "Apple „Wo ist?“-Ortung" },
      {
        label: "Lieferumfang",
        value: "Original-Ladegerät, Datenbestätigung für die Versicherung",
      },
    ],
    images: [
      {
        src: "/img/bestand/ninebot-f2-pro-1.jpg",
        alt: "Segway Ninebot F2 Pro von der Seite, aufgeklappt vor der Containerwand",
      },
      {
        src: "/img/bestand/ninebot-f2-pro-2.jpg",
        alt: "Segway Ninebot F2 Pro schräg von vorn mit orangefarbenem Bremszug an der Lenkstange",
      },
      {
        src: "/img/bestand/ninebot-f2-pro-3.jpg",
        alt: "Segway Ninebot F2 Pro frontal, Lenker und Trittbrett von oben",
      },
      {
        src: "/img/bestand/ninebot-f2-pro-4.jpg",
        alt: "Segway Ninebot F2 Pro frontal auf der Gummimatte stehend",
      },
      {
        src: "/img/bestand/ninebot-f2-pro-5.jpg",
        alt: "Lenker des Segway Ninebot F2 Pro mit Scheinwerfer und Bremsleitung aus der Nähe",
      },
      {
        src: "/img/bestand/ninebot-f2-pro-6.jpg",
        alt: "Display und Lenkerklemmung des Segway Ninebot F2 Pro mit Nummernaufkleber der Werkstatt",
      },
    ],
  },
  {
    id: "ninebot-max-g2",
    category: "scooter",
    condition: "generalueberholt",
    quantity: 1,
    model: "Segway Ninebot KickScooter MAX G2 D",
    summary:
      "Der Langstreckenroller der Reihe: hydraulische Federung vorn, einstellbare Doppelfederung hinten, bis 70 km Reichweite.",
    price: "449,00 €",
    priceValue: "449.00",
    streetLegal: true,
    specs: [
      { label: "Zustand", value: "Gepflegter Top-Zustand, werkstattgeprüft" },
      {
        label: "Zulassung",
        value: "StVZO-konform mit Betriebserlaubnis, Datenbestätigung liegt bei",
      },
      { label: "Höchstgeschwindigkeit", value: "20 km/h" },
      { label: "Reichweite", value: "bis 70 km" },
      {
        label: "Motor",
        value: "Heckantrieb, 450 W Nenn- / 900 W Spitzenleistung",
      },
      { label: "Steigfähigkeit", value: "bis 22 %" },
      { label: "Akku", value: "551 Wh mit Batteriemanagement" },
      {
        label: "Federung",
        value: "hydraulisch vorn, einstellbare Doppelfederung hinten",
      },
      {
        label: "Bremsen",
        value: "Trommelbremse vorn, Rekuperationsbremse hinten",
      },
      {
        label: "Reifen",
        value: "10 Zoll, schlauchlos und selbstabdichtend",
      },
      {
        label: "Ausstattung",
        value: "Blinker im Lenker, Traktionskontrolle, elektronische Hupe",
      },
      { label: "Smartes", value: "Apple „Wo ist?“-Ortung, Segway-App" },
      { label: "Zuladung", value: "bis 120 kg" },
      { label: "Gewicht", value: "rund 24,3 kg" },
      {
        label: "Lieferumfang",
        value:
          "Netzkabel für das eingebaute Ladegerät, Datenbestätigung für die Versicherung",
      },
    ],
    images: [
      {
        src: "/img/bestand/ninebot-max-g2-1.jpg",
        alt: "Segway Ninebot MAX G2 von der Seite, aufgeklappt vor der Containerwand",
      },
      {
        src: "/img/bestand/ninebot-max-g2-2.jpg",
        alt: "Segway Ninebot MAX G2 schräg von vorn, Lenkstange und Federung sichtbar",
      },
      {
        src: "/img/bestand/ninebot-max-g2-3.jpg",
        alt: "Segway Ninebot MAX G2 frontal, Lenker und breites Trittbrett von oben",
      },
      {
        src: "/img/bestand/ninebot-max-g2-4.jpg",
        alt: "Segway Ninebot MAX G2 frontal auf der Gummimatte, ganze Länge sichtbar",
      },
      {
        src: "/img/bestand/ninebot-max-g2-5.jpg",
        alt: "Lenker des Segway Ninebot MAX G2 mit Scheinwerfer und Blinker aus der Nähe",
      },
      {
        src: "/img/bestand/ninebot-max-g2-6.jpg",
        alt: "Cockpit des Segway Ninebot MAX G2 mit Display und Bremshebeln",
      },
    ],
  },
  {
    id: "audi-egret-pro",
    category: "scooter",
    condition: "generalueberholt",
    quantity: 1,
    model: "Audi Electric Kick Scooter powered by Egret Pro",
    summary:
      "Rund 400 km gelaufen, Bremsanlage frisch gewartet, Akku ausgelesen. 705 Wh, 27 Nm, vollhydraulische Bremsen.",
    price: "549,00 €",
    priceValue: "549.00",
    streetLegal: true,
    specs: [
      {
        label: "Zustand",
        value: "Gepflegt, rund 400 km Laufleistung, Akkukapazität ausgelesen",
      },
      {
        label: "Zulassung",
        value: "StVZO-konform mit Betriebserlaubnis, Datenbestätigung liegt bei",
      },
      { label: "Höchstgeschwindigkeit", value: "20 km/h" },
      { label: "Reichweite", value: "bis 80 km" },
      {
        label: "Motor",
        value: "Heckantrieb, 500 W Nenn- / 950 W Spitzenleistung, 27 Nm",
      },
      { label: "Akku", value: "705 Wh" },
      { label: "Bremsen", value: "vollhydraulische Scheibenbremsen vorn und hinten" },
      { label: "Reifen", value: "10 Zoll Luftreifen" },
      {
        label: "Licht",
        value: "LED-Scheinwerfer mit 40 Lux, Rücklicht mit Bremslichtfunktion",
      },
      { label: "Diebstahlschutz", value: "eingebautes Rahmenschloss, zwei Schlüssel" },
      { label: "Zuladung", value: "bis 120 kg" },
      { label: "Gewicht", value: "22,5 kg, Aluminiumrahmen" },
      {
        label: "Lieferumfang",
        value:
          "Schnellladegerät, zwei Schlüssel, Datenbestätigung, Originalverpackung",
      },
    ],
    note: "Gebaut wird der Roller von Egret (Walberg Urban Electrics); Audi ist Lizenzgeber und steuert Design und Markendetails bei.",
    images: [
      {
        src: "/img/bestand/audi-egret-pro-1.jpg",
        alt: "Audi Electric Kick Scooter powered by Egret Pro von der Seite, Audi-Ringe auf dem Trittbrett",
      },
      {
        src: "/img/bestand/audi-egret-pro-2.jpg",
        alt: "Audi Egret Pro schräg von vorn, schwarze Lenkstange mit rotem Streifen",
      },
      {
        src: "/img/bestand/audi-egret-pro-3.jpg",
        alt: "Audi Egret Pro frontal, Lenker und Trittbrett von oben",
      },
      {
        src: "/img/bestand/audi-egret-pro-4.jpg",
        alt: "Audi Egret Pro frontal auf der Gummimatte vor der Containerwand",
      },
      {
        src: "/img/bestand/audi-egret-pro-5.jpg",
        alt: "Lenker des Audi Egret Pro mit LED-Scheinwerfer und hydraulischer Bremsleitung",
      },
      {
        src: "/img/bestand/audi-egret-pro-6.jpg",
        alt: "Cockpit des Audi Egret Pro mit Scheinwerfer und Lenkerklemmung aus der Nähe",
      },
    ],
  },
  {
    id: "xiaomi-6-max",
    category: "scooter",
    condition: "generalueberholt",
    quantity: 1,
    model: "Xiaomi Electric Scooter 6 Max",
    summary:
      "Komfortroller der 6er-Reihe: 12-Zoll-Reifen, Federgabel vorn, zwei Stoßdämpfer hinten, bis 70 km Reichweite.",
    price: "679,00 €",
    priceValue: "679.00",
    streetLegal: true,
    specs: [
      { label: "Zustand", value: "Technisch und optisch wie neu" },
      {
        label: "Zulassung",
        value: "Deutsche Betriebserlaubnis nach eKFV, Datenbestätigung liegt bei",
      },
      { label: "Höchstgeschwindigkeit", value: "20 km/h" },
      { label: "Reichweite", value: "bis 70 km" },
      {
        label: "Motor",
        value: "Hinterradantrieb, 450 W Nenn- / 1.100 W Spitzenleistung",
      },
      { label: "Steigfähigkeit", value: "bis 24 %" },
      { label: "Akku", value: "468 Wh / 10 Ah" },
      {
        label: "Federung",
        value: "45-mm-Federgabel vorn, zwei Stoßdämpfer hinten",
      },
      {
        label: "Bremsen",
        value: "Scheibenbremsen vorn und hinten mit E-ABS",
      },
      { label: "Reifen", value: "12 Zoll, schlauchlos" },
      {
        label: "Ausstattung",
        value:
          "Blinker, Traktionskontrolle, 3-Zoll-Farbdisplay, Trittbrett 600 × 190 mm mit Kicktail, IPX6",
      },
      { label: "Smartes", value: "Apple „Wo ist?“-Ortung" },
      { label: "Zuladung", value: "bis 130 kg" },
      {
        label: "Lieferumfang",
        value: "Original-Ladegerät, Unterlagen, Datenbestätigung",
      },
    ],
    images: [
      {
        src: "/img/bestand/xiaomi-6-max-1.jpg",
        alt: "Xiaomi Electric Scooter 6 Max von der Seite, graues Trittbrett mit orangefarbenen Akzenten",
      },
      {
        src: "/img/bestand/xiaomi-6-max-2.jpg",
        alt: "Xiaomi 6 Max schräg von vorn vor der Containerwand, 12-Zoll-Reifen sichtbar",
      },
      {
        src: "/img/bestand/xiaomi-6-max-3.jpg",
        alt: "Xiaomi 6 Max frontal, Lenker und breites Trittbrett von oben",
      },
      {
        src: "/img/bestand/xiaomi-6-max-4.jpg",
        alt: "Xiaomi 6 Max frontal auf der Gummimatte, ganze Länge sichtbar",
      },
      {
        src: "/img/bestand/xiaomi-6-max-5.jpg",
        alt: "Lenker des Xiaomi 6 Max mit Farbdisplay und Bremshebeln",
      },
      {
        src: "/img/bestand/xiaomi-6-max-6.jpg",
        alt: "Cockpit des Xiaomi 6 Max mit angehängtem Datenblatt der Werkstatt",
      },
    ],
  },
  {
    id: "xiaomi-6-ultra",
    category: "scooter",
    condition: "neu",
    quantity: 3,
    model: "Xiaomi Electric Scooter 6 Ultra",
    summary:
      "Neu und unbenutzt in Lightning Yellow: 1.200 W Spitzenleistung, 12-Zoll-Reifen, Federung vorn und hinten.",
    price: "709,00 €",
    priceValue: "709.00",
    streetLegal: true,
    specs: [
      {
        label: "Zustand",
        value: "Neu und unbenutzt, Originalverpackung vorhanden",
      },
      {
        label: "Zulassung",
        value: "Deutsche Betriebserlaubnis nach eKFV, Datenbestätigung liegt bei",
      },
      { label: "Höchstgeschwindigkeit", value: "20 km/h" },
      { label: "Reichweite", value: "bis 75 km im Sparmodus" },
      { label: "Motor", value: "500 W Nenn- / 1.200 W Spitzenleistung" },
      { label: "Steigfähigkeit", value: "bis 25 %" },
      { label: "Akku", value: "46,8 V / 12,5 Ah" },
      { label: "Federung", value: "Doppel-Schwingarmfederung vorn und hinten" },
      {
        label: "Bremsen",
        value: "Scheibenbremsen vorn und hinten mit E-ABS",
      },
      { label: "Reifen", value: "12 Zoll All-Terrain, schlauchlos" },
      {
        label: "Ausstattung",
        value:
          "Blinker, Traktionskontrolle, 3-Zoll-Farbdisplay, Trittbrett 195 mm breit mit Kicktail, IPX6",
      },
      { label: "Smartes", value: "Apple „Wo ist?“-Ortung, Xiaomi-Home-App" },
      { label: "Zuladung", value: "bis 140 kg" },
      { label: "Farbe", value: "Lightning Yellow" },
      {
        label: "Lieferumfang",
        value: "Original-Ladegerät, Unterlagen, Datenbestätigung",
      },
    ],
    images: [
      {
        src: "/img/bestand/xiaomi-6-ultra-1.jpg",
        alt: "Xiaomi Electric Scooter 6 Ultra in Gelb von der Seite, breites Trittbrett und 12-Zoll-Reifen",
      },
      {
        src: "/img/bestand/xiaomi-6-ultra-2.jpg",
        alt: "Xiaomi 6 Ultra schräg von vorn vor der Containerwand, gelbe Lenkergriffe",
      },
      {
        src: "/img/bestand/xiaomi-6-ultra-3.jpg",
        alt: "Xiaomi 6 Ultra frontal, Lenker und Trittbrett von oben",
      },
      {
        src: "/img/bestand/xiaomi-6-ultra-4.jpg",
        alt: "Xiaomi 6 Ultra frontal auf der Gummimatte, ganze Länge sichtbar",
      },
      {
        src: "/img/bestand/xiaomi-6-ultra-5.jpg",
        alt: "Lenker des Xiaomi 6 Ultra mit Farbdisplay und gelben Griffen",
      },
      {
        src: "/img/bestand/xiaomi-6-ultra-6.jpg",
        alt: "Cockpit des Xiaomi 6 Ultra mit angehängtem Datenblatt der Werkstatt",
      },
    ],
  },
  {
    id: "navee-ut5-max",
    category: "scooter",
    condition: "generalueberholt",
    quantity: 1,
    model: "NAVEE UT5 Max",
    summary:
      "Aus dem Werkstatt-Check: Akku und Elektronik geprüft, Bremsen, Lenkung und Klappmechanismus eingestellt.",
    price: "859,00 €",
    priceValue: "859.00",
    streetLegal: true,
    specs: [
      {
        label: "Zustand",
        value:
          "Werkstattgeprüft – Akku und Elektronik geprüft, Bremsen, Lenkung und Klappmechanismus eingestellt",
      },
      {
        label: "Zulassung",
        value: "Deutsche Betriebserlaubnis nach eKFV, Datenbestätigung liegt bei",
      },
      { label: "Höchstgeschwindigkeit", value: "20 km/h" },
      { label: "Federung", value: "Dämpfungssystem vorn und hinten" },
      {
        label: "Ausstattung",
        value: "Blinker, LED-Beleuchtung, App-Anbindung",
      },
      {
        label: "Lieferumfang",
        value: "Original-Ladegerät, Datenbestätigung für die Versicherung",
      },
    ],
    note: "Reichweite und Motorleistung nennt der Hersteller für dieses Modell nicht in einer Zahl, die wir hier belegen könnten. Wir messen den Akku vor der Übergabe aus und sagen Ihnen, was das Gerät tatsächlich fährt.",
    images: [
      {
        src: "/img/bestand/navee-ut5-max-1.jpg",
        alt: "NAVEE UT5 Max von der Seite, silberner Rahmen mit rotem Trittbrett",
      },
      {
        src: "/img/bestand/navee-ut5-max-2.jpg",
        alt: "NAVEE UT5 Max schräg von vorn an der Containerwand, Lenkstange mit Anhänger",
      },
      {
        src: "/img/bestand/navee-ut5-max-3.jpg",
        alt: "NAVEE UT5 Max frontal, Lenker und Trittbrett von oben",
      },
      {
        src: "/img/bestand/navee-ut5-max-4.jpg",
        alt: "NAVEE UT5 Max frontal auf der Gummimatte, ganze Länge sichtbar",
      },
      {
        src: "/img/bestand/navee-ut5-max-5.jpg",
        alt: "Lenker des NAVEE UT5 Max mit Display und Bremshebeln",
      },
      {
        src: "/img/bestand/navee-ut5-max-6.jpg",
        alt: "Cockpit des NAVEE UT5 Max mit angehängtem Datenblatt der Werkstatt",
      },
    ],
  },
  {
    id: "citycoco-cp3",
    category: "trike",
    condition: "neu",
    quantity: 1,
    model: "Citycoco COCO CP-3",
    summary:
      "Neues Elektro-Dreirad mit Sitzbank und 45 km/h. Zwei Räder hinten, also kein Balancieren im Stand.",
    price: "1.699,00 €",
    priceValue: "1699.00",
    streetLegal: true,
    specs: [
      { label: "Zustand", value: "Neu und unbenutzt, Originalverpackung" },
      {
        label: "Zulassung",
        value:
          "Straßenzulassung mit COC-Papieren, Anmeldung über Versicherungskennzeichen",
      },
      { label: "Höchstgeschwindigkeit", value: "45 km/h" },
      {
        label: "Führerschein",
        value: "Klasse AM oder Klasse B (Autoführerschein)",
      },
      { label: "Akku", value: "20 Ah Lithium-Ionen" },
      { label: "Bauart", value: "Dreirad, zwei Räder hinten" },
      {
        label: "Bremsen",
        value: "hydraulische Scheibenbremsen vorn und hinten",
      },
      {
        label: "Ausstattung",
        value: "Sitzbank, Beleuchtungsanlage mit Blinker, Rückspiegel",
      },
      { label: "Farbe", value: "Schwarz" },
      { label: "Lieferumfang", value: "Original-Ladegerät, COC-Papiere" },
    ],
    note: "45 km/h heißt Kleinkraftrad, nicht Elektrokleinstfahrzeug: Sie brauchen einen Führerschein der Klasse AM oder B und ein Versicherungskennzeichen für Kleinkrafträder. Das ist ein anderer Tarif als beim E-Scooter – wir klären ihn vor dem Kauf mit Ihnen ab.",
    images: [
      {
        src: "/img/bestand/citycoco-cp3-1.jpg",
        alt: "Citycoco COCO CP-3 Elektro-Dreirad schräg von vorn, verchromte Gabel und breiter Vorderreifen",
      },
      {
        src: "/img/bestand/citycoco-cp3-2.jpg",
        alt: "Citycoco COCO CP-3 von der linken Seite, Sitzbank mit Rückenlehne und zwei Hinterräder",
      },
      {
        src: "/img/bestand/citycoco-cp3-3.jpg",
        alt: "Citycoco COCO CP-3 schräg von hinten, beide Hinterräder und Kotflügel sichtbar",
      },
      {
        src: "/img/bestand/citycoco-cp3-4.jpg",
        alt: "Citycoco COCO CP-3 seitlich auf dem Hof, ganze Länge vor Wiese und Zaun",
      },
      {
        src: "/img/bestand/citycoco-cp3-5.jpg",
        alt: "Citycoco COCO CP-3 von hinten rechts, Rückspiegel und Scheinwerfer im Gegenlicht",
      },
      {
        src: "/img/bestand/citycoco-cp3-6.jpg",
        alt: "Citycoco COCO CP-3 frontal, Scheinwerfer, Lenker und Rückspiegel",
      },
    ],
  },
  {
    id: "mangosteen-m1p",
    category: "chopper",
    condition: "neu",
    quantity: 3,
    model: "Mangosteen M1-P E-Chopper",
    summary:
      "Neuer E-Chopper in Schwarz matt: 45 km/h, 30-Ah-Akku, hydraulische Scheibenbremsen, breite Bereifung.",
    price: "1.779,00 €",
    priceValue: "1779.00",
    streetLegal: true,
    specs: [
      { label: "Zustand", value: "Neu und unbenutzt, Originalverpackung" },
      {
        label: "Zulassung",
        value:
          "Straßenzulassung mit COC-Papieren, Anmeldung über Versicherungskennzeichen",
      },
      { label: "Höchstgeschwindigkeit", value: "45 km/h" },
      {
        label: "Führerschein",
        value: "Klasse AM oder Klasse B (Autoführerschein)",
      },
      { label: "Akku", value: "30 Ah Lithium-Ionen" },
      { label: "Motor", value: "Radnabenmotor" },
      {
        label: "Bremsen",
        value: "hydraulische Scheibenbremsen vorn und hinten",
      },
      { label: "Federung", value: "Telegabel vorn" },
      {
        label: "Ausstattung",
        value:
          "LED-Scheinwerfer, Blinker, digitaler Tacho, Rückspiegel, Sitzbank",
      },
      { label: "Farbe", value: "Schwarz matt" },
      {
        label: "Lieferumfang",
        value: "Original-Schnellladegerät, COC-Papiere",
      },
    ],
    note: "45 km/h heißt Kleinkraftrad, nicht Elektrokleinstfahrzeug: Sie brauchen einen Führerschein der Klasse AM oder B und ein Versicherungskennzeichen für Kleinkrafträder. Das ist ein anderer Tarif als beim E-Scooter – wir klären ihn vor dem Kauf mit Ihnen ab.",
    images: [
      {
        src: "/img/bestand/mangosteen-m1p-1.jpg",
        alt: "Mangosteen M1-P E-Chopper schräg von vorn, mattschwarzer Rahmen mit Speichenfelgen und roten Bremssätteln",
      },
      {
        src: "/img/bestand/mangosteen-m1p-2.jpg",
        alt: "Mangosteen M1-P von der linken Seite, lange Sitzbank und breite Bereifung",
      },
      {
        src: "/img/bestand/mangosteen-m1p-3.jpg",
        alt: "Mangosteen M1-P von der rechten Seite im Sonnenlicht, Telegabel und Scheinwerfer",
      },
      {
        src: "/img/bestand/mangosteen-m1p-4.jpg",
        alt: "Mangosteen M1-P seitlich auf dem Hof, ganze Länge vor Wiese und Zaun",
      },
      {
        src: "/img/bestand/mangosteen-m1p-5.jpg",
        alt: "Mangosteen M1-P schräg von hinten, Kotflügel und Rücklicht sichtbar",
      },
      {
        src: "/img/bestand/mangosteen-m1p-6.jpg",
        alt: "Mangosteen M1-P frontal, Scheinwerfer zwischen den Gabelholmen",
      },
    ],
  },
];

/**
 * Ein Gerät über seinen Bezeichner.
 *
 * Der Bezeichner ist zugleich das Adressteil der Geräteseite
 * (`/e-scooter/<id>`). Deshalb hier eine Funktion und keine Map: Die Liste hat
 * neun Einträge, und eine zweite Datenstruktur, die mit der ersten
 * synchron gehalten werden muss, wäre bei dieser Größe nur eine weitere
 * Stelle, an der etwas auseinanderläuft.
 */
/**
 * Reichweite als Zahl, für Filter und Sortierung.
 *
 * Sie steht in den Daten als Satz („bis 25 km", „bis 20 km je nach
 * Fahrprofil") und nicht als Feld – bei einem Einzelstück wird notiert, was
 * gemessen oder vom Hersteller angegeben ist, nicht ein Pflichtfeld gefüllt.
 * Hier wird genau dieses Muster gelesen und sonst `null` zurückgegeben:
 * Ein Gerät ohne lesbare Angabe fällt aus einem Reichweitenfilter heraus,
 * statt mit einer geschätzten Zahl darin zu stehen.
 */
export function rangeKm(item: InventoryItem): number | null {
  const raw = item.specs.find((s) => s.label === "Reichweite")?.value;
  const hit = raw?.match(/(\d+)\s*km/);
  return hit ? Number(hit[1]) : null;
}

/** Verfügbarkeit mit der Pflegeregel dieser Datei als Voreinstellung. */
export function availabilityOf(item: InventoryItem): Availability {
  return item.availability ?? "available";
}

/** Der Zustand, wenn er in den Daten steht – sonst `null`. */
export function condition(item: InventoryItem): string | null {
  return item.specs.find((s) => s.label === "Zustand")?.value ?? null;
}

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
  [/^Mangosteen/i, "Mangosteen"],
  [/^Citycoco/i, "Citycoco"],
  [/^NAVEE/i, "NAVEE"],
  [/Egret/i, "Egret"],
];

/**
 * Die harten Angaben über den Bestand: Stückzahl, Preisspanne, Marken.
 *
 * Nimmt eine Liste entgegen und rechnet nicht fest über `inventory`: Seit im
 * Bestand drei Fahrzeugarten stehen, braucht jede Kategorieseite ihre eigenen
 * Zahlen. „13 Geräte, ab 249 €" über einer Auslage, die sieben E-Scooter
 * zeigt, ist eine falsche Angabe über genau das, was darunter steht. Ohne
 * Argument gilt weiter der ganze Bestand – das ist die Sicht der Startseite.
 *
 * Berechnet und nicht von Hand geschrieben. Vorher standen Stückzahl,
 * Spanne und Markenliste als Fließtext in der Sektion – bei einem Bestand,
 * der laut eigener Ansage laufend wechselt, wäre das der erste Satz, der
 * unbemerkt falsch wird. Wer ein Gerät aus `inventory` löscht, korrigiert
 * damit auch diese Zeile.
 */
export function inventoryFacts(items: InventoryItem[] = inventory) {
  /* Nur endliche Zahlen: Ein leerer Bestand ergäbe `Math.min()` = Infinity
     („∞ €" im Kopfbereich), ein nicht-numerischer Wert aus der späteren
     Shopify-Anbindung „NaN €". Ohne Preise gibt es keine Preisspanne, und
     die Aufrufer müssen das entscheiden statt es zu drucken. */
  const values = items
    .map((item) => Number(item.priceValue))
    .filter((value) => Number.isFinite(value));
  const format = (value: number) =>
    value.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    });

  const brands: string[] = [];
  for (const item of items) {
    const match = BRAND_PATTERNS.find(([pattern]) => pattern.test(item.model));
    if (match && !brands.includes(match[1])) brands.push(match[1]);
  }

  return {
    /* Geräte, nicht Einträge: Neun Modelle, aber dreimal derselbe Chopper
       und dreimal derselbe Xiaomi 6 Ultra. „13 Geräte" ist die Zahl, die im
       Lager steht; „9 Geräte" wäre zu niedrig und „13 Modelle" falsch. */
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    models: items.length,
    priceFrom: values.length ? format(Math.min(...values)) : null,
    priceTo: values.length ? format(Math.max(...values)) : null,
    brands,
  };
}

/**
 * Eine Auswahl für die Startseite.
 *
 * Nicht die drei ersten, sondern über die Preisspanne verteilt: Die Liste ist
 * nach Preis sortiert, drei aufeinanderfolgende Geräte zeigen deshalb dreimal
 * dasselbe Preissegment – und der Bestand sieht schmaler aus, als er ist.
 * Gleichmäßig verteilt steht auf der Startseite das billigste, ein mittleres
 * und ein oberes Gerät.
 *
 * Nur Geräte mit deutscher Betriebserlaubnis. Die beiden Ausnahmen tragen
 * eine Warnung, die auf der Karte nie eingeklappt wird; als Aushängeschild
 * auf der Startseite wären sie das falsche erste Beispiel für ein Angebot,
 * dessen Argument gerade die Straßentauglichkeit ist. Auf der Bestandsseite
 * stehen sie vollständig und mit Hinweis.
 */
export function inventoryHighlights(count = 3): InventoryItem[] {
  const legal = inventory.filter((item) => item.streetLegal);
  if (legal.length <= count) return legal;

  const step = (legal.length - 1) / (count - 1);
  return Array.from({ length: count }, (_, i) => legal[Math.round(i * step)]);
}
