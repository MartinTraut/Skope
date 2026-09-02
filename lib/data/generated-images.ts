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
 * **Was hier ausdrücklich nicht drinsteht:** `ergo-aushang.jpg` ist die eigene
 * Preistafel des Betriebs, `karte-neuenstadt.png` ein Kartenausschnitt aus
 * OpenStreetMap, `siegel-skope.png` das Siegel. Alles drei ist gestaltet, aber
 * nichts davon ist erzeugt, und eine falsche Kennzeichnung ist genauso
 * irreführend wie eine fehlende.
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
