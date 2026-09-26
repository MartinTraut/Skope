import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

export type Step = { n: string; title: string; text: string };

/**
 * Ein nummerierter Ablauf als Register mit waagerechten Kanten.
 *
 * Es gibt diesen Baustein dreimal – auf `/reparatur`, `/versicherung` und
 * `/einlagerung`. Zwei Abläufe auf einer Website müssen gleich aussehen,
 * sonst sind es zwei Bausteine; genau deshalb steht er hier und nicht je
 * Seite.
 *
 * **Bis zum 26.09.2026 war es eine Kette aus vier Neonscheiben mit einer
 * senkrechten Haarlinie dazwischen.** Zwei Gründe, warum das weg ist:
 *
 * - **Die Farbregel erlaubt es nicht.** Neon markiert drei Dinge – die
 *   Hauptaktion, die harte Zahl, ein Wort je Überschrift. Eine Schrittnummer
 *   ist keine harte Zahl, sondern eine Ordnungszahl. Auf `/einlagerung`
 *   standen dadurch fünf Neonflächen in einem Bild: das ausgezeichnete Wort
 *   der Überschrift und vier Scheiben, die lauter waren als es. Der Eintrag,
 *   der die Scheiben eingeführt hat, argumentierte nur über den Kontrast
 *   („Neon als Schrift läge auf Silber bei 1,18:1") – das ist richtig und
 *   beantwortet die falsche Frage.
 * - **Der eigentliche Befund von damals war die Größe,** nicht die Farbe: Die
 *   Ziffer stand bei 13 px und 25 % Deckkraft und war damit blasser und
 *   kleiner als der Fließtext, den sie ordnen soll. Das löst der Grad. Die
 *   Nummer steht jetzt im Titelgrad (24 px am Telefon, 34 px am
 *   Schreibtisch), in voller Tinte und tabellarisch – größer als die
 *   Überschrift daneben und damit das erste, was man in der Zeile liest.
 *
 * **Die Struktur tragen jetzt Kanten, nicht ein Faden.** Jede Zeile hat eine
 * Haarlinie oben, die letzte zusätzlich eine unten; die Folge ist damit ein
 * geschlossener Block statt vier freier Absätze, die in einer 1-px-Linie
 * hängen. Die Linien laufen beim Scrollen von links ein (`.rule-draw`,
 * dieselbe Mechanik wie an den Eckdaten auf `/ueber-uns`) – die Bewegung
 * gehört der Zeile, die ankommt, und nicht einer Verzierung daneben.
 *
 * **`max-w-none` an `<li>` ist Pflicht und kein Aufräumen.** `globals.css`
 * gibt jedem `li` in `main` ein Lesemaß von 58ch. Hier ist das `li` keine
 * Lesezeile, sondern die ganze Zeile aus Nummer, Überschrift und Absatz:
 * Gemessen war die Spalte auf `/einlagerung` bei 1512 px 799 px breit und das
 * `li` darin 622 – 177 px der Spalte lagen brach, die Kanten hätten mitten im
 * Satzspiegel geendet. Das Lesemaß gehört an den Absatz, und dort steht es.
 *
 * **Am Telefon steht die Nummer neben der Überschrift, der Fließtext
 * darunter über die volle Breite.** Als durchgehende zweite Spalte war der
 * Satz bei 390 px nur 274 px breit, in verschachtelten Kästen 234 px –
 * gemessen 23 bis 25 Zeichen je Zeile, wo der Satzspiegel 342 px hergibt.
 */
export function Steps({
  items,
  className,
}: {
  items: Step[];
  className?: string;
}) {
  return (
    <ol className={className}>
      {items.map((step, i) => (
        <Reveal
          key={step.n}
          delay={i * 70}
          as="li"
          className="relative grid max-w-none grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-2 py-6 sm:grid-cols-[4rem_1fr] sm:gap-x-7 sm:py-8"
        >
          <Rule />
          {i === items.length - 1 && <Rule bottom />}
          <span
            aria-hidden="true"
            className="tabular font-display text-[length:var(--text-title)] leading-none font-bold tracking-tight"
          >
            {step.n}
          </span>
          <h3 className="text-[length:var(--text-subtitle)]">{step.title}</h3>
          <p className="col-span-2 min-w-0 leading-relaxed text-current/65 sm:col-span-1 sm:col-start-2">
            {step.text}
          </p>
        </Reveal>
      ))}
    </ol>
  );
}

/**
 * Die Kante einer Zeile. Eigenes Element statt `border-t`, weil `.rule-draw`
 * die Linie über `transform: scaleX()` zeichnet – einen Rahmen kann man nicht
 * skalieren, ohne das Element mitzunehmen.
 */
function Rule({ bottom = false }: { bottom?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "rule-draw absolute inset-x-0 h-px bg-current/15",
        bottom ? "bottom-0" : "top-0",
      )}
    />
  );
}
