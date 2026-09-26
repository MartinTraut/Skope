import type { LucideIcon } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { financingComparison, type FinancingCell } from "@/lib/data/financing";
import { cn } from "@/lib/utils";

/**
 * Die beiden Finanzierungsmodelle in denselben Kategorien, nebeneinander.
 *
 * Der Grund für dieses Bauteil: Auf der Seite stand alles Nötige, aber
 * nirgends der Vergleich. Jede Karte trug drei Eckdaten mit *eigenen*
 * Beschriftungen („Laufzeit / Übernahme / Enthalten" gegen „Anzahlung /
 * Raten / Eigentum"). Um zu erkennen, dass beim Abo Versicherung und Wartung
 * in der Rate stecken und beim Ratenkauf nicht, musste man zwei Listen lesen
 * und im Kopf gegeneinanderstellen.
 *
 * **Die Tabelle erklärt, sie bewertet nicht.** Die erste Fassung hatte
 * Häkchen in Neon in der Spalte des Abos und Kreuze in der des Ratenkaufs,
 * dazu eine Spalte in Tinte und eine in Silber. Gelesen wurde daraus eine
 * Empfehlung – „das eine ist besser, das andere schlechter" –, und das ist
 * falsch: Es sind zwei Zuschnitte für zwei Bedürfnisse, und wer sein
 * Fahrzeug selbst halten will, ist beim Ratenkauf nicht schlechter dran.
 * Deshalb hier:
 *
 * - **keine Zeichen in den Zellen.** Jede sagt in Worten, wer was trägt. Die
 *   Häkchen stehen in den Karten darunter, wo sie die Leistungen *eines*
 *   Modells auflisten und nichts gegeneinanderstellen.
 * - **dieselbe Fläche, dasselbe Zeichen, dasselbe Gewicht für beide
 *   Spalten.** Auch das Sinnbild im Kopf trägt jede Spalte – eines ohne das
 *   andere wäre eine Auszeichnung. Der Farbunterschied der Karten darunter
 *   ist etwas anderes: Dort trennt er zwei Angebote voneinander, hier hätte
 *   er eines davon hervorgehoben.
 * - **die Zeile „Verschleiß und Schäden" steht bewusst darin,** obwohl sie
 *   in beiden Spalten dasselbe sagt: Sie zeigt, dass nicht jede Kategorie
 *   ein Unterschied ist.
 *
 * **Die Beschriftungsspalte ist gedeckelt (12 rem), nicht `auto`.** Gemessen
 * war sie mit `auto` 278 px breit – so breit wie die längste Beschriftung
 * („Verschleiß und Schäden"). „Eigentum" misst darin 84 px, und in jeder
 * Zeile standen bis zu 194 px leere Fläche zwischen Beschriftung und erster
 * Angabe. Genau das ließ die Tabelle trocken aussehen: Die drei Teile einer
 * Zeile gehörten optisch nicht mehr zusammen. Lieber bricht eine
 * Beschriftung zweizeilig um – die Zeilenhöhe bestimmt ohnehin die längere
 * Angabe daneben.
 *
 * **Am Telefon bleiben die Spalten Spalten.** Untereinander gestapelt wären
 * es einundzwanzig Blöcke, und der Vergleich – der einzige Zweck – fiele
 * genau dort weg, wo er am meisten hilft. Stattdessen steht die Kategorie
 * als Zeile über den beiden Zellen, und die Zellen tragen die Kurzfassung
 * aus den Daten (`short`). Gemessen bei 390 px: je Zelle 170 px Satz.
 */
function Cell({ cell }: { cell: FinancingCell }) {
  return (
    <>
      <span className="lg:hidden">{cell.short}</span>
      <span className="hidden lg:inline">{cell.text}</span>
    </>
  );
}

type Model = { name: string; short: string; icon: LucideIcon };

function Head({ model }: { model: Model }) {
  const Icon = model.icon;
  return (
    <>
      {/* Das Sinnbild ist dasselbe wie auf der Karte darunter – Tabelle und
          Karte sind derselbe Block, und das Zeichen ist der kürzeste Weg von
          der Spalte zur Karte. Im Ring in Silber, nicht in Neon: Die
          Akzentfarbe markiert Hauptaktion, harte Zahl und ein Wort je
          Überschrift, nicht die Herkunft eines Angebots. */}
      <span
        aria-hidden="true"
        className="hidden size-9 shrink-0 place-items-center rounded-full bg-silver/10 ring-1 ring-silver/20 lg:grid"
      >
        <Icon className="size-4.5 text-silver" />
      </span>
      <span className="lg:hidden">{model.short}</span>
      <span className="hidden lg:inline">{model.name}</span>
    </>
  );
}

export function FinancingCompare({
  models,
}: {
  /** Nur Name, Kurzform und Sinnbild für die Spaltenköpfe – die Zeilen
      kommen aus den Daten. `short` steht am Telefon: „Ratenkauf mit
      Anzahlung" braucht in einer 170 px breiten Spalte drei Zeilen. */
  models: { mietkauf: Model; ratenkauf: Model };
}) {
  /* Die Kopfzeile ist ein Band über alle Spalten, nicht eine dunkle Spalte
     neben einer hellen: Sie ist die Überschrift der ganzen Tabelle, und
     damit bleiben die beiden Modelle gleich behandelt. Die Neonlinie an
     ihrer Unterkante läuft über die volle Breite – ein Akzent, der zu keiner
     der beiden Spalten gehört.

     Ohne dieses Band war die Tabelle sieben graue Zeilen auf einer grauen
     Fläche, und genau so sah sie aus. Farbe darf hier sein, sie darf nur
     nichts auszeichnen. */
  /* Am Telefon steht alles auf der Mitte seiner eigenen Spalte, ab `lg`
     wieder linksbündig.

     Der Grund ist die Zeilenform: Unter `lg` trägt jede Zelle die Kurzfassung
     („Mit der letzten Rate", „Trägt der Käufer") in rund 170 px Satz, und
     linksbündig hingen beide Spalten samt Kategorie an ihrer jeweils linken
     Kante – drei Achsen in einer 342 px breiten Tabelle, und die mittlere
     lag direkt neben dem Trennstrich. Die Kategorie steht deshalb mittig
     *über* dem Strich: Sie gilt beiden Zellen, und dort sieht man das.

     Ab `lg` gilt das Gegenteil: Dort steht der volle Satz, die
     Beschriftungsspalte ist eine eigene Spalte mit Punkt davor, und
     zentrierter Flattersatz über zwei bis vier Zeilen ist keine Komposition,
     sondern schlecht lesbar. */
  const head =
    "flex items-center justify-center gap-3 border-b-2 border-neon bg-ink px-3.5 pt-5 pb-4 text-center font-display text-[length:var(--text-subtitle)] leading-tight font-bold tracking-tight text-silver lg:justify-start lg:px-5 lg:pt-5 lg:pb-4 lg:text-left";
  const cell =
    "px-3.5 py-3.5 text-center leading-snug text-ink/85 transition-colors duration-200 lg:px-5 lg:py-5 lg:text-left";

  /**
   * Die Zeile, über der die Maus steht.
   *
   * Bis zum 24.09.2026 wechselte sie von `silver` bzw. `silver-200/70` auf
   * `silver-200` – also Grau auf Grau, bei der ungeraden Zeile ein
   * Unterschied von unter drei Prozent Helligkeit. Gemessen war das keine
   * Rückmeldung, sondern ein Rechenvorgang; auf Ansage („sonst ist das grau
   * und man erkennt es nicht").
   *
   * Jetzt ein Neonschleier von 14 Prozent. Das ist kein Verstoß gegen die
   * Farbregel: Neon ist auf hellen Flächen **Fläche** und nie Schrift, und
   * genau das ist es hier. Die Regel „drei Aufgaben" gilt der dauerhaften
   * Auszeichnung – ein Zustand, der nur existiert, solange ein Zeiger
   * daraufsteht, zeichnet nichts aus, sondern zeigt, wo der Zeiger steht.
   *
   * 14 Prozent sind gerechnet: #9ef605 auf #eef1f4 ergibt rund #e5f3d8 und
   * damit einen klaren Grünstich, während der Text darauf bei 13:1 bleibt.
   * Bei 25 Prozent stand die Zeile als Auswahl da und die Tabelle sah aus,
   * als sei eine Zeile angeklickt.
   *
   * Der Übergang lief bisher gar nicht: `transition-colors` stand nur an
   * `cell`, nicht an der Beschriftungsspalte, und die sprang.
   */
  const hoverRow =
    "transition-colors duration-200 ease-out-quart lg:group-hover/row:bg-neon/[0.14]";

  return (
    <Reveal delay={60}>
      {/* Derselbe Deckel wie das Kartenpaar darunter (76 rem) und dieselbe
          Mitte: Tabelle und Karten müssen als ein Block stehen, sonst liest
          sich die Tabelle als eigener Abschnitt über fremden Karten.

          `dl` und nicht `table`: Es sind Paare aus Kategorie und Angabe, und
          eine echte Tabelle bräuchte am Telefon eine Mindestbreite. Genau
          daran ist die Tarif-Tabelle der Versicherungsseite unter 768 px
          gescheitert – dort stehen deshalb Karten aus denselben Daten. Hier
          reicht es, die Kategorie über die beiden Zellen zu legen.

          Der Umschaltpunkt ist `lg` und nicht `md`: Bei 768 px sind die
          beiden Spalten 230 px breit, und die volle Formulierung
          („Haftpflicht und Vollkasko in der Rate enthalten") lief dort über
          vier Zeilen – gemessen 158 px Zellhöhe gegen 88 px in der
          Nachbarzelle. Mit dem Kurztext und der Kategorie über den Zellen
          bleiben es auf dem Tablet 343 px Satz je Zelle. */}
      <dl className="mx-auto mt-10 grid max-w-[76rem] grid-cols-2 overflow-hidden rounded-xl bg-silver shadow-[0_20px_60px_-30px_rgb(8_9_11/0.35)] lg:mt-14 lg:grid-cols-[minmax(0,12rem)_1fr_1fr]">
        {/* Die Ecke über der Beschriftungsspalte gibt es nur ab `lg`. Leer war
            sie eine 85 px hohe schwarze Fläche ohne Aufgabe; jetzt trägt sie
            die Überschrift der Spalte darunter. Am Telefon nehmen die beiden
            Namen die ganze erste Zeile ein. */}
        <p
          className={cn(
            head,
            "hidden font-sans text-[0.6875rem] font-bold tracking-[0.12em] text-silver/45 uppercase lg:flex",
          )}
        >
          Im Vergleich
        </p>
        <p className={cn(head, "border-r-silver/12 lg:border-r")}>
          <Head model={models.mietkauf} />
        </p>
        <p className={head}>
          <Head model={models.ratenkauf} />
        </p>

        {/* Zeilenstreifen statt Haarlinien zwischen allen Zellen: Sieben
            gleiche Linien über drei Spalten sind ein Raster, in dem jede
            Zeile so wichtig aussieht wie die nächste, und die Tabelle wird
            zum Formular. Der Wechsel zwischen den beiden Silbertönen führt
            das Auge waagerecht – und er trifft beide Spalten gleich.

            Die Beschriftungsspalte trägt ab `lg` stattdessen einen
            durchgehenden Ton: Sie ist die Achse, an der die Zeilen hängen,
            und ein gestreifter Streifen neben gestreiften Zellen ist nur ein
            drittes Muster. Am Telefon steht die Beschriftung *in* der Zeile
            und trägt deshalb denselben Streifen wie die Zellen. */}
        {financingComparison.map((row, i) => {
          const stripe = i % 2 === 0 ? "bg-silver" : "bg-silver-200/70";
          return (
            <div key={row.label} className="group/row contents">
              <dt
                className={cn(
                  stripe,
                  "col-span-2 flex items-center justify-center gap-2 px-3.5 pt-3.5 pb-2 font-display text-[0.6875rem] font-bold tracking-[0.12em] text-ink/60 uppercase",
                  "lg:col-span-1 lg:items-start lg:justify-start lg:border-r lg:border-ink/8 lg:bg-ink/[0.045] lg:px-5 lg:py-5 lg:text-sm lg:tracking-normal lg:normal-case",
                  hoverRow,
                  /* Die Kante steht als innerer Schatten, nicht als Rahmen:
                     Ein Rahmen ändert die Box und schöbe beim Überfahren die
                     ganze Zeile um zwei Pixel nach rechts. */
                  "lg:group-hover/row:text-ink lg:group-hover/row:shadow-[inset_3px_0_0_var(--color-neon)]",
                )}
              >
                {/* Zwei der sieben Beschriftungen laufen ab `lg` zweizeilig
                    („Verschleiß und Schäden", „Wartung und Service"). Mittig
                    gesetzt stand der Punkt dort zwischen den Zeilen und sah
                    verrutscht aus; er hängt deshalb an der ersten Zeile
                    (halbe Zeilenhöhe minus halber Punkt). */}
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full bg-neon lg:mt-[calc(0.5lh-0.1875rem)]"
                />
                {row.label}
              </dt>
              {/* Die Markierung gilt der ganzen Zeile und beiden Spalten
                  gleich – sie hebt die Zeile, die man gerade liest, nicht ein
                  Modell. Tailwinds `group-hover` bringt die Abfrage
                  `(hover: hover)` seit v4 selbst mit, am Telefon bleibt also
                  kein Zustand stehen. */}
              <dd
                className={cn(
                  cell,
                  stripe,
                  hoverRow,
                  "border-r border-ink/8",
                )}
              >
                <Cell cell={row.mietkauf} />
              </dd>
              <dd className={cn(cell, stripe, hoverRow)}>
                <Cell cell={row.ratenkauf} />
              </dd>
            </div>
          );
        })}
      </dl>
    </Reveal>
  );
}
