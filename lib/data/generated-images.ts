/**
 * Verzeichnis der mit KI erzeugten Bilder.
 *
 * **Warum das eine Liste ist und keine Notiz.** Bis zum 02.09.2026 stand in
 * `CLAUDE.md`, es seien vier Bilder – `werkstatt-service`, `akku-diagnose`,
 * `scooter-studio` und `ergo-tarife`. Es sind acht. Die drei `scooter-*` vom
 * 06.08.2026 tragen die Herkunft bis heute in ihren eigenen Metadaten
 * (`photoshop:Credit="Made with Google AI"`), und `hero-werkstatt` – die
 * Aufnahme, die auf der Startseite über der Überschrift liegt – ist an den
 * Werkzeugen an der Lochwand und den unlesbaren Plaketten am Lenker als
 * erzeugt zu erkennen. Eine Liste im Fließtext wird nicht mitgepflegt, ein
 * Modul schon: Wer ein Bild einbindet, das hier steht, bekommt die
 * Kennzeichnung vom Bauteil, ohne daran zu denken.
 *
 * **Wozu die Kennzeichnung dient.** Zwei Pflichten, die verschiedene Dinge
 * verlangen:
 *
 * - **Art. 50 Abs. 4 EU-KI-VO** (seit 02.08.2026 anwendbar) verlangt die
 *   Offenlegung erzeugter Bildinhalte „spätestens zum Zeitpunkt der ersten
 *   Interaktion oder Exposition" und „in klarer und erkennbarer Weise". Ein
 *   Satz in AGB oder Datenschutz erfüllt das nicht – der Hinweis muss dort
 *   stehen, wo das Bild wahrgenommen wird. Deshalb die Marke *im* Bild.
 * - **§ 5 UWG** ist der schärfere Punkt: Die Motive zeigen eine Werkstatt, die
 *   so nicht existiert, und Personen, die es nicht gibt – mit der echten Marke
 *   an der Wand. Solange eine Bildunterschrift den Ort behauptet („Werkstatt Im
 *   Kampfrad 3"), ist das eine Tatsachenbehauptung über den eigenen Betrieb.
 *   Deshalb tragen die Bildunterschriften an diesen Stellen keinen Ort mehr,
 *   und die Alt-Texte keine reale Person.
 *
 * **Was hier ausdrücklich nicht drinsteht:** `karte-neuenstadt.png` ist ein
 * Kartenausschnitt aus OpenStreetMap, `siegel-skope.png` das Siegel. Beides
 * ist gestaltet, aber nicht erzeugt, und eine falsche Kennzeichnung ist
 * genauso irreführend wie eine fehlende.
 *
 * **Der ERGO-Aushang stand bis zum 26.09.2026 in genau dieser Reihe** – als
 * „eigene Preistafel des Betriebs". Für den Druck vom 14.08. stimmte das. Der
 * Aushang der Saison 2026/2027 ist mit ChatGPT gestaltet, Auskunft des
 * Betreibers, und zeigt einen fotorealistischen Roller vor einer Stadtkulisse.
 * Er ist deshalb aufgenommen – mit eigenem Wortlaut, siehe
 * `generatedPosterNotice`.
 *
 * **Die Motive bleiben.** Entscheidung des Betreibers vom 02.09.2026: Der
 * Austausch gegen echte Aufnahmen aus Im Kampfrad 3 – bis dahin als der
 * bessere Weg geführt – ist damit vom Tisch, die Kennzeichnung trägt die
 * Offenlegung allein. Was das nicht abdeckt, steht oben unter § 5 UWG: Auf den
 * Motiven steht die eigene Marke an einer Wand, die es so nicht gibt. Der Chip
 * sagt „nicht fotografiert", nicht „diese Werkstatt gibt es so nicht" – ein
 * Restrisiko gegenüber einem Wettbewerber, das bewusst getragen wird. Deshalb
 * ist hier auch nichts kürzbar: Fällt die Kennzeichnung, fällt die einzige
 * Absicherung.
 */
export const generatedImages = new Set([
  /* Kopfbereich der Startseite seit dem 23.09.2026. Erzeugt mit ChatGPT
     (Bild des Betreibers), Herkunft zusätzlich in den Dateimetadaten
     (`photoshop:Credit`, `Iptc4xmpExt:DigitalSourceType`). Es zeigt kein
     Gerät aus dem Bestand und keine Werkstatt – ein Studiomotiv mit drei
     Fahrzeugarten. Es ist damit näher am Symbolbild als `hero-werkstatt`
     und behauptet nichts über den Betrieb; die Kennzeichnung braucht es
     trotzdem, weil es als Foto gelesen wird. */
  "/img/hero-fahrzeuge.jpg",
  /* Dasselbe Motiv als Hochformat, am Telefon seit dem 23.09.2026.

     Es ist eine eigene Aufnahme und kein Zuschnitt des Querformats: Der
     Betreiber hat sie mit ChatGPT als 941 × 1672 erzeugt, das C2PA-Manifest
     der Quelldatei weist sie aus. Ausgeliefert wird sie auf 1400 px
     hochgerechnet (`lanczos3` plus Unschärfemaske) – die Quelle reicht für
     ein Telefon mit dreifacher Pixeldichte sonst nicht.

     Warum überhaupt zwei Dateien: Am Telefon ist die Bühne hochkant, das
     Querformat musste dort in ein 220-px-Band gezwängt werden, in dem die
     Fahrzeuge 108 px hoch standen. Ein Zuschnitt löst das nicht – die drei
     Fahrzeuge stehen im Querformat nebeneinander und brauchen 60 % der
     Bildbreite. Zwei Fassungen desselben Motivs sind hier der Unterschied
     zwischen einem Kopfbereich und einer Fußleiste. */
  "/img/hero-fahrzeuge-hoch.jpg",
  /* Der ERGO-Aushang der Saison 2026/2027, beide Seiten, auf `/versicherung`
     seit dem 26.09.2026. Mit ChatGPT gestaltet (Auskunft des Betreibers):
     Roller, Hintergrund und Layout sind erzeugt, die Beiträge kommen von der
     ERGO.

     Genau deshalb trägt er nicht den Standardsatz „Symbolbild, mit KI
     erzeugt", sondern `generatedPosterNotice` – dieselbe Unterscheidung wie
     beim Erklärfilm. „Symbolbild" über einer Preistafel hieße, auch die
     Zahlen seien beispielhaft, und das wäre die Irreführung, die die
     Kennzeichnung gerade verhindern soll. */
  "/img/ergo-plakat-2026-2027.jpg",
  "/img/ergo-aushang-2026-2027.jpg",
  /* Porträt auf `/ueber-uns`, eingesetzt am 23.09.2026.

     **Es ist erzeugt, und das steht nicht zur Auslegung.** Die Datei kam als
     `ChatGPT Image 23. Sept. 2026, 19_24_41.png` und trägt einen
     C2PA-Manifest: `c2pa.created`, `softwareAgent: ChatGPT / gpt-image`,
     `digitalSourceType: trainedAlgorithmicMedia`, dazu
     `c2pa.watermarked.unbound`. Es ist also kein bearbeitetes Foto, sondern
     ein erzeugtes Bild – mit unsichtbarer Wasserzeichnung.

     Deshalb steht hier **kein Name**: Weder im Dateinamen noch im Alt-Text
     noch in einer Bildunterschrift darf dieses Gesicht Thomas Zielke
     zugeordnet werden. Es ist die Stelle, an der genau dieser Fehler schon
     einmal stand (siehe § 5 UWG oben). Kommt ein echtes Foto, fliegt der
     Pfad aus dieser Liste und der Name darf zurück. */
  "/img/person-poloshirt.jpg",
  /* Steht weiter im Film auf `/ueber-uns` hinter den Schrifttafeln. */
  "/img/hero-werkstatt.jpg",
  "/img/werkstatt-service.jpg",
  "/img/akku-diagnose.jpg",
  "/img/scooter-studio.jpg",
  "/img/ergo-tarife.jpg",
  "/img/scooter-stadt.jpg",
  "/img/scooter-allee.jpg",
  "/img/scooter-strasse.jpg",
]);

/** Steht die Aufnahme im Verzeichnis der erzeugten Bilder? */
export function isGeneratedImage(src: string): boolean {
  return generatedImages.has(src);
}

/**
 * Der Wortlaut, einmal für die ganze Seite.
 *
 * „Symbolbild" allein reicht nicht – es sagt, dass das Motiv nicht der
 * konkrete Gegenstand ist, aber nicht, dass es überhaupt keine Aufnahme ist.
 * „KI-generiert" allein sagt nicht, dass es den gezeigten Ort so nicht gibt.
 * Beides zusammen sagt beides.
 */
export const generatedImageNotice = "Symbolbild, mit KI erzeugt";

/** Kurzform für die Marke im Bild, wo für den vollen Satz kein Platz ist. */
export const generatedImageBadge = "KI-Bild";

/**
 * Der Wortlaut für ein gestaltetes Blatt, dessen Angaben echt sind.
 *
 * Erzeugt ist beim ERGO-Aushang die Gestaltung – Motiv, Hintergrund, Layout.
 * Die Beiträge stammen von der ERGO und stehen so auch in `lib/data/
 * insurance.ts`. „Symbolbild, mit KI erzeugt" würde über einer Preistafel
 * genau das Gegenteil dessen sagen, was stimmt: dass auch die Zahlen
 * beispielhaft seien. Dieselbe Unterscheidung wie beim Erklärfilm.
 */
export const generatedPosterNotice =
  "Gestaltung mit KI erzeugt, Beiträge von der ERGO";

/**
 * Der Wortlaut für den Erklärfilm.
 *
 * Er ist ein anderer, weil die Sache eine andere ist: Der Film selbst ist
 * Motion Design und nicht erzeugt – seine Schrifttafeln, Übergänge und Zahlen
 * sind gebaut. Erzeugt ist, was hinter den Tafeln liegt: dieselbe
 * Werkstattaufnahme wie im Kopfbereich der Startseite, und damit auch das
 * Standbild, das vor dem ersten Tippen zu sehen ist. „Symbolbild, mit KI
 * erzeugt" wäre hier falsch – es würde den ganzen Film als erzeugt ausgeben.
 *
 * Art. 50 Abs. 4 EU-KI-VO nennt Bild-, Ton- *und* Videoinhalte in einem Satz;
 * ein Film mit erzeugtem Bildmaterial fällt darunter wie ein Standbild. Die
 * Zeile steht deshalb sichtbar unter dem Film und nicht in einem Attribut.
 */
export const generatedVideoNotice = "Enthält mit KI erzeugte Bildinhalte";
