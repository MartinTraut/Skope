import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";

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
  /** Maße der ausgelieferten Datei. Geben der Kachel ihre Breite. */
  w: number;
  h: number;
  /**
   * Vorschaufarbe der Kachel, 16 px breit als WebP in der Adresse.
   *
   * Sie steht da, bis die Aufnahme geladen ist. Grund ist die Bahn: Nur die
   * ein bis zwei sichtbaren Kacheln werden geladen, die übrigen liegen
   * rechts außerhalb des Fensters, und die Faulladung zählt nur senkrecht.
   * Wer wischt, sieht die nächste Aufnahme also erst anfordern – gemessen
   * am Telefon bei DPR 3 rund 140 kB je Kachel. Ohne Platzhalter war das
   * ein graues Loch, mit ist es das Bild in unscharf.
   *
   * Der Wert wird beim Bauen aus der Datei gerechnet, nicht von Hand
   * eingetragen: Ein hart notierter Platzhalter zeigt nach dem ersten
   * Motivtausch die Farbe des alten Bildes.
   */
  blur: string;
};

const PHOTOS: Omit<WorkshopPhoto, "blur">[] = [
  {
    file: "standort-container.jpg",
    alt: "Zwei dunkelgraue Container auf einem gepflasterten Platz unter Bäumen, davor ein mit Ketten abgesperrtes Kiesfeld und Parkplätze",
    w: 1600,
    h: 1205,
  },
  {
    file: "buero-eingang.jpg",
    alt: "Offene Tür des Bürocontainers unter dem Schild „Skopegebrauchtwarehandel – E-Scooter Service und Verkauf“, innen ein Regal mit verpackten Helmen und ein Aktenschrank",
    w: 1205,
    h: 1600,
  },
  {
    file: "lager-regal.jpg",
    alt: "Blick in den geöffneten Lagercontainer: E-Scooter in zwei Reihen unter einem Schwerlastregal, am vordersten Gerät hängt ein bedrucktes Datenblatt am Lenker",
    w: 1200,
    h: 1600,
  },
  {
    file: "lager-gang.jpg",
    alt: "Langer Gang im Lagercontainer mit Wänden aus Grobspanplatten, rechts ein Feuerlöscher, links eine Reihe aufgereihter E-Scooter",
    w: 1200,
    h: 1600,
  },
  {
    file: "werkbank-scooter.jpg",
    alt: "Aufgeschraubter Segway-Ninebot auf der Werkbank, Trittbrett geöffnet, Akku, Steuerung und Kabelbaum liegen frei, darüber eine Wand mit Schraubendrehern",
    w: 1600,
    h: 1205,
  },
  {
    file: "reparatur-stecker.jpg",
    alt: "Hand hält einen durchgeschmorten Steckverbinder mit verkohltem Schrumpfschlauch über dem geöffneten Trittbrett eines E-Scooters",
    w: 1205,
    h: 1600,
  },
  {
    file: "reparatur-trittbrett.jpg",
    alt: "Geöffnetes Trittbrett eines E-Scooters von oben, eine Hand hebt die Abdeckung über Kabelbaum und Akkuanschluss an",
    w: 1205,
    h: 1600,
  },
];

/**
 * Nur die Motive, deren Datei wirklich liegt. Wird zur Bauzeit ausgewertet –
 * alle Seiten sind statisch vorgebaut.
 */
export async function workshopPhotos(): Promise<WorkshopPhoto[]> {
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
  /* Sieben Miniaturen von 16 px Breite – beim Bauen einmal gerechnet, weil
     `/ueber-uns` statisch vorgebaut wird. Schlägt es fehl, steht die Kachel
     wie bisher auf ihrer Flächenfarbe; ein fehlender Platzhalter ist kein
     Grund, die Sektion ausfallen zu lassen. */
  return Promise.all(
    found.map(async (photo) => ({
      ...photo,
      blur: await blurOf(path.join(dir, photo.file)),
    })),
  );
}

async function blurOf(file: string): Promise<string> {
  try {
    const buf = await sharp(file)
      .resize(16, null, { fit: "inside" })
      .webp({ quality: 40 })
      .toBuffer();
    return `data:image/webp;base64,${buf.toString("base64")}`;
  } catch {
    return "";
  }
}
