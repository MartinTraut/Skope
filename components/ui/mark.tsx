import { cn } from "@/lib/utils";

/**
 * Das eine farbige Wort einer Überschrift.
 *
 * Eine eigene Komponente statt eines nackten `<span className="text-accent">`,
 * weil die Regel dahinter sonst nirgends steht und beim nächsten Mal ein
 * zweites Wort dazukommt. Die Regel ist in globals.css festgehalten: pro
 * Überschrift genau EIN Wort, nie im Fließtext. Grepbar bleibt sie nur, wenn
 * die Auszeichnung einen Namen hat.
 *
 * Es gibt genau ein Grün auf der Seite, #9ef605. Auf Schwarz steht es als
 * Schrift, auf Silber als Fläche mit schwarzer Schrift darauf – dieselbe
 * Farbe, andere Rolle. Beides steckt in `.mark-accent` (globals.css), damit
 * die Überschrift nicht wissen muss, worauf sie liegt.
 *
 * Ein zweiter, dunklerer Grünton für helle Flächen stand hier schon einmal.
 * Er ist weg: Zwei Grüntöne lesen sich nicht als eine Marke.
 *
 * `<em>` statt `<span>`: Die Hervorhebung ist inhaltlich gemeint, nicht
 * dekorativ – sie gehört also auch für Screenreader ins Markup. Die Kursive,
 * die der Browser dafür vorsieht, ist hier nicht erwünscht; die Auszeichnung
 * läuft über Farbe beziehungsweise Fläche.
 */
export function Mark({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <em className={cn("mark-accent", className)}>{children}</em>;
}
