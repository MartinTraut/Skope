import fs from "node:fs";
import path from "node:path";

/**
 * Echte Aufnahmen aus dem Betrieb – Im Kampfrad 3, Neuenstadt am Kocher.
 *
 * Sie sind der Gegenentwurf zu den acht erzeugten Motiven, die die Seite
 * bisher trägt (`lib/data/generated-images.ts`). Für diese hier gilt die
 * KI-Kennzeichnung ausdrücklich **nicht**: Sie sind fotografiert, sie zeigen
 * den Betrieb, wie er ist – Standort, Büro, Lager, Werkbank, Reparatur.
 *
 * **Die Dateien sind ohne Metadaten abgelegt.** Die Rohbilder kamen als
 * Telefonaufnahmen mit EXIF, und darin steht der Aufnahmeort auf ein paar
 * Meter genau, dazu Gerät und Zeitstempel. `sharp` schreibt ohne
 * `withMetadata()` keine EXIF-Daten in die Ausgabe – wer die Bilder neu
 * erzeugt, lässt das so. Die Adresse des Betriebs steht ohnehin auf der
 * Seite; die Koordinaten der Wohnung, in der ein Bild nachbearbeitet wurde,
 * nicht.
 *
 * **Die Liste prüft, ob die Datei existiert.** Fehlt eine, fällt sie beim
 * Bauen aus der Galerie, statt als kaputtes Bild zu erscheinen. Das ist kein
 * Notbehelf, sondern die Pflegeregel: Wer ein Motiv austauscht, legt die
 * Datei ab – eine Liste, die auf Dateien zeigt, die es nicht gibt, ist
 * schlimmer als eine kurze Liste.
 *
 * **Breite und Höhe stehen an jedem Eintrag**, weil die Bahn die Kacheln auf
 * eine gemeinsame Höhe stellt und die Breite daraus rechnet. Fünf der sieben
 * Aufnahmen sind hochkant, zwei quer; ein gemeinsames Seitenverhältnis hätte
 * entweder den Containern ihren Zusammenhang genommen oder den Hochformaten
 * oben und unten je ein Fünftel. Die Werte sind die der Dateien in
 * `public/img/werkstatt/`, nicht die der Rohbilder.
 *
 * TODO Betreiber: Auf `lager-regal.jpg` hängt ein Datenblatt am Lenker, auf
 * dem in der vollen Auflösung Modell und Preis zu lesen sind (Aufnahme vom
 * 22.04.2026). Das Gerät steht heute nicht mehr so im Lager. Die Aufnahme
 * zeigt den Betrieb und macht kein Preisangebot – wer hier trotzdem
 * sichergehen will, tauscht das Motiv gegen eine neuere Aufnahme aus.
 */
export type WorkshopPhoto = {
  /** Dateiname in `public/img/werkstatt/`. */
  file: string;
  /** Was zu sehen ist – nicht, was verkauft werden soll. */
  alt: string;
  /** Eine Zeile unter dem Bild. Nüchtern, kein Werbesatz. */
  caption: string;
  /** Maße der ausgelieferten Datei. Geben der Kachel ihre Breite. */
  w: number;
  h: number;
};

const PHOTOS: WorkshopPhoto[] = [
  {
    file: "standort-container.jpg",
    alt: "Zwei dunkelgraue Container auf einem gepflasterten Platz unter Bäumen, davor ein mit Ketten abgesperrtes Kiesfeld und Parkplätze",
    caption:
      "Der Standort: Lagercontainer und Büro, mit Parkplätzen direkt davor.",
    w: 1600,
    h: 1205,
  },
  {
    file: "buero-eingang.jpg",
    alt: "Offene Tür des Bürocontainers unter dem Schild „Skopegebrauchtwarehandel – E-Scooter Service und Verkauf“, innen ein Regal mit verpackten Helmen und ein Aktenschrank",
    caption: "Das Büro: Annahme, Beratung und Zubehör.",
    w: 1205,
    h: 1600,
  },
  {
    file: "lager-regal.jpg",
    alt: "Blick in den geöffneten Lagercontainer: E-Scooter in zwei Reihen unter einem Schwerlastregal, am vordersten Gerät hängt ein bedrucktes Datenblatt am Lenker",
    caption: "Im Lager steht Gerät an Gerät, vorn eines mit seinem Datenblatt.",
    w: 1200,
    h: 1600,
  },
  {
    file: "lager-gang.jpg",
    alt: "Langer Gang im Lagercontainer mit Wänden aus Grobspanplatten, rechts ein Feuerlöscher, links eine Reihe aufgereihter E-Scooter",
    caption: "Der Bestand steht trocken, mit Löscher an der Wand.",
    w: 1200,
    h: 1600,
  },
  {
    file: "werkbank-scooter.jpg",
    alt: "Aufgeschraubter Segway-Ninebot auf der Werkbank, Trittbrett geöffnet, Akku, Steuerung und Kabelbaum liegen frei, darüber eine Wand mit Schraubendrehern",
    caption: "Diagnose am offenen Gerät: Akku, Steuerung, Verkabelung.",
    w: 1600,
    h: 1205,
  },
  {
    file: "reparatur-stecker.jpg",
    alt: "Hand hält einen durchgeschmorten Steckverbinder mit verkohltem Schrumpfschlauch über dem geöffneten Trittbrett eines E-Scooters",
    caption: "Ein durchgeschmorter Steckverbinder – und der Grund dafür.",
    w: 1205,
    h: 1600,
  },
  {
    file: "reparatur-trittbrett.jpg",
    alt: "Geöffnetes Trittbrett eines E-Scooters von oben, eine Hand hebt die Abdeckung über Kabelbaum und Akkuanschluss an",
    caption: "Unter der Abdeckung: Kabelbaum, Akkuanschluss, Steuerung.",
    w: 1205,
    h: 1600,
  },
];

/**
 * Nur die Motive, deren Datei wirklich liegt. Wird zur Bauzeit ausgewertet –
 * alle Seiten sind statisch vorgebaut.
 */
export function workshopPhotos(): WorkshopPhoto[] {
  const dir = path.join(process.cwd(), "public", "img", "werkstatt");
  const found = PHOTOS.filter((photo) => {
    try {
      return fs.existsSync(path.join(dir, photo.file));
    } catch {
      return false;
    }
  });
  /* Laut sagen, wenn nichts gefunden wurde. Die Sektion verschwindet sonst
     spurlos: Gemessen lag ein Build vor den Bilddateien, `/ueber-uns` kam
     ohne die Galerie heraus, und im Protokoll stand nichts. Ein stiller
     Rückfall ist hier schlimmer als ein kaputtes Bild – niemand sucht nach
     etwas, das aussieht, als hätte es nie existiert. */
  if (found.length === 0) {
    console.warn(
      "[workshop-photos] Keine Datei in public/img/werkstatt gefunden - die Galerie faellt aus.",
    );
  }
  return found;
}
