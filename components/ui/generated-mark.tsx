import {
  generatedImageBadge,
  generatedImageNotice,
  isGeneratedImage,
} from "@/lib/data/generated-images";
import { cn } from "@/lib/utils";

/**
 * Die Kennzeichnung erzeugter Bilder – zwei Formen, ein Verzeichnis.
 *
 * `GeneratedMark` liegt *im* Bild und ist die Form, die Art. 50 Abs. 4
 * EU-KI-VO verlangt: sichtbar, sobald das Bild sichtbar ist, ohne Scrollen,
 * ohne Aufklappen. `GeneratedNote` steht unter dem Bild und trägt den vollen
 * Wortlaut – überall dort, wo ohnehin eine Bildunterschrift steht.
 *
 * Beide nehmen den Pfad und entscheiden selbst, ob sie etwas rendern. Das ist
 * der Grund für den Umweg über `isGeneratedImage()` statt eines `boolean`: Wer
 * eine Kachel um ein anderes Motiv erweitert, bekommt die Kennzeichnung oder
 * lässt sie weg, je nachdem was stimmt – und nicht, je nachdem woran er
 * gedacht hat. Steht das Bild nicht im Verzeichnis, kommt `null` zurück.
 *
 * Zur Gestaltung: kein Neon. Die Akzentfarbe markiert auf dieser Seite genau
 * drei Dinge – Hauptaktion, harte Zahl, ein Wort je Überschrift –, und ein
 * Hinweis auf die Herkunft eines Bildes ist keines davon. Die Marke ist
 * bewusst zurückhaltend: Sie muss lesbar sein, nicht laut. Deckende Tinte
 * statt Transparenz, weil ein durchscheinender Chip über einem hellen
 * Bildbereich verschwindet und die Kennzeichnung damit genau dann fehlt, wenn
 * das Motiv freundlich aussieht.
 */
export function GeneratedMark({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  if (!isGeneratedImage(src)) return null;

  return (
    /* `title` und `sr-only` tragen den vollen Satz: In der Ecke steht die
       Kurzform, weil „Symbolbild, mit KI erzeugt" bei 320 px über die halbe
       Bildbreite läuft. Für Screenreader und beim Überfahren steht der
       vollständige Wortlaut da – deshalb kein `pointer-events-none`: Damit
       erschiene der `title` nie. Der Chip liegt in Kacheln, die selbst
       Verweise sind; ein Klick auf ihn läuft an den Verweis weiter. */
    <span
      title={generatedImageNotice}
      className={cn(
        "absolute right-3 bottom-3 z-10 rounded-sm bg-ink/85 px-2 py-1 font-display text-[0.6875rem] leading-none font-semibold tracking-[0.08em] text-silver/85 uppercase backdrop-blur-sm",
        className,
      )}
    >
      <span aria-hidden="true">{generatedImageBadge}</span>
      <span className="sr-only">{generatedImageNotice}</span>
    </span>
  );
}

/**
 * Der volle Wortlaut unter dem Bild.
 *
 * `separator` steht davor, wenn schon eine Bildunterschrift vorhanden ist –
 * dann hängt der Hinweis an derselben Zeile statt eine zweite aufzumachen.
 */
export function GeneratedNote({
  src,
  className,
  separator = false,
}: {
  src: string;
  className?: string;
  separator?: boolean;
}) {
  if (!isGeneratedImage(src)) return null;

  return (
    <span className={cn("text-current/50", className)}>
      {separator ? " · " : null}
      {generatedImageNotice}
    </span>
  );
}
