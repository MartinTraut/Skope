import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

/**
 * Einheitliche Seitenbreite – ein Container, keine Sonderfälle.
 *
 * 96rem statt 82rem, und ab `lg` ein größerer Innenrand: Auf einem
 * 1512-px-Display standen vorher 1232 px Satzspiegel zwischen 140 px breiten
 * Rändern – gemessen. Das kostete die Überschrift im Kopfbereich eine ganze
 * Zeile: „E-Scooter reparieren" braucht bei 76 px Schriftgrad 723 px, die
 * sieben Spalten gaben aber nur 702. Jetzt sind es 1400 px Satzspiegel und
 * 800 px in derselben Spalte, also zwei Zeilen statt drei.
 *
 * Lesestrecken werden davon nicht breiter: Fließtext ist überall über
 * `max-w-[…ch]` oder eine eigene Spalte begrenzt. Die zusätzliche Breite geht
 * an Raster, Bilder und Displaygrößen – genau dort fehlte sie.
 *
 * Zweite Runde, dieselbe Richtung: 104rem statt 96rem und ab `lg` 48 statt
 * 56 px Innenrand. Auf 1512 px sind das 1416 px Satzspiegel statt 1400 – die
 * Breite ist dort vom Fenster gedeckelt, nicht von dieser Zahl. Der Gewinn
 * liegt auf den Schirmen darüber: bei 1728 px waren es 1536, jetzt 1664 px.
 * Weniger als 48 px Rand ist die Untergrenze; darunter klebt der Satzspiegel
 * am Fensterrand und die Seite wirkt nicht weit, sondern billig.
 *
 * Der Rand liegt seit dem Querformat-Durchgang in `.gutter` (globals.css) statt
 * in `px-6 md:px-10 lg:px-12`. Dieselben drei Werte, aber gegen die Aussparung
 * der Frontkamera abgesichert – die Begründung steht an der Klasse.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("gutter mx-auto w-full max-w-[104rem]", className)}>
      {children}
    </div>
  );
}

/**
 * Sektionsrahmen. `tone` steuert die Grundfläche.
 *
 * Vier Töne, aber nur zwei Räume – und der Sprung zwischen den Räumen ist
 * der eigentliche Rhythmus der Seite:
 *
 * - `ink`        satt Schwarz, der Normalfall
 * - `ink-800`    eine Stufe heller im dunklen Raum
 * - `silver`     helles Metall, trägt die dichten Lesestrecken
 * - `silver-200` eine Stufe tiefer, für die abwechselnde helle Sektion
 *
 * Die Zwischenstufen sind bewusst keine eigenen Sektionsflächen. Eine frühere
 * Fassung hatte vier Abstufungen, die alle im Dunkeln lagen und sich um
 * wenige Prozent Helligkeit unterschieden. Auf einem normalen Display war
 * davon nichts zu sehen: Die Startseite las sich über 10.653 px als eine
 * einzige Fläche. Der Sprung von Schwarz auf Silber ist dagegen nicht zu
 * übersehen — deshalb darf es ihn nur selten geben, sonst flackert die Seite.
 *
 * `text-*` und die Flächenklasse (`on-light` / `on-dark`) werden hier
 * mitgesetzt, damit Kindelemente ihre Abstufungen über `text-current/70` und
 * `text-accent` aus der Fläche ableiten können, statt eine feste Farbe zu
 * verdrahten. Genau daran wäre der Wechsel sonst gescheitert.
 */
export function Section({
  id,
  tone = "ink",
  space = "default",
  className,
  children,
}: {
  id?: string;
  tone?: "silver" | "silver-200" | "ink" | "ink-800";
  /**
   * `tight` halbiert den Abstand nach oben – erlaubt **nur**, wenn die
   * Sektion darüber denselben Ton hat. Begründung an `spaces`.
   */
  space?: "default" | "tight";
  className?: string;
  children: React.ReactNode;
}) {
  const tones = {
    silver: "bg-silver text-ink on-light",
    "silver-200": "bg-silver-200 text-ink on-light",
    ink: "bg-ink text-silver on-dark",
    "ink-800": "bg-ink-800 text-silver on-dark",
  } as const;

  /* Zwei Stufen, nicht eine.
     
     Bis hierher stand zwischen *jedem* Sektionspaar derselbe Abstand:
     gemessen 128 px am Telefon und 208 px auf 1512 – egal, ob dazwischen die
     Fläche von Tinte auf Silber springt oder ob zwei Blöcke in derselben
     Farbe stehen und inhaltlich ein Kapitel sind. Im ersten Fall trägt die
     Farbkante die Zäsur und der Abstand gibt ihr Luft; im zweiten trägt gar
     nichts eine Zäsur, und dieselben 208 px sind kein Absatz, sondern ein
     Loch.
     
     Deshalb: Wo eine Kante ist, bleibt die volle Stufe. Wo keine ist, fällt
     der obere Rand weg und der untere Rand der Sektion davor trägt den
     Abstand allein – exakt die halbe Stufe, 64 statt 128 und 104 statt 208.
     
     `tight` setzt damit voraus, dass beide Sektionen denselben Ton haben.
     Bei einem Farbwechsel würde die neue Fläche unmittelbar an der letzten
     Textzeile beginnen. */
  const spaces = {
    default: "py-16 md:py-22 lg:py-26",
    tight: "pb-16 md:pb-22 lg:pb-26",
  } as const;

  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24",
        spaces[space],
        tones[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * Sektionskopf: Eyebrow, H2 und optionaler Lead.
 * `align="split"` setzt die Headline links und den Lead rechts –
 * das bricht die Mittelachse auf und wirkt weniger schematisch.
 */
export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "split",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "split" | "left" | "center";
  className?: string;
}) {
  /* Nur die Headline bekommt den Masken-Reveal, Eyebrow und Lead das ruhige
     Einblenden mit Versatz. Liefe alles maskiert, wäre der Effekt kein Akzent
     mehr, sondern die Grundeinstellung. */
  if (align === "split") {
    return (
      /* Die Einordnung steht unter der Überschrift, nicht neben ihr.
         Dieselbe Korrektur wie im Seitenkopf der Unterseiten – dort war sie
         schon gemacht, hier nicht, und genau diese Hälfte ist aufgefallen.
         Ein Bauteil, das an einer Stelle etwas kann und an der anderen
         nicht, ist kein zweiter Entwurf, sondern ein halber.

         Vorher lag der Absatz in fünf von zwölf Spalten rechts, auf die
         Unterkante der Überschrift gesetzt: rund sieben Wörter pro Zeile,
         70 % Deckkraft, und optisch ohne Bezug zu dem Satz, zu dem er
         gehört. Man las die Überschrift und übersah ihn – genau die
         Reihenfolge, die er umdrehen soll.

         Jetzt beginnt er an derselben Kante wie die Überschrift, mit einer
         Zeile Abstand und bei 80 % Deckkraft. `max-w-2xl` hält ihn bei 60
         bis 70 Zeichen; die Überschrift darf mit `max-w-4xl` breiter laufen,
         damit der Größenunterschied die Hierarchie trägt und nicht die
         Spaltenteilung.

         Kein Trennstrich unter dem Kopf. Die Haarlinie war der Versuch, den
         Abschnitt zu klammern, und hat das Gegenteil bewirkt: Auf jeder
         Sektion lag dieselbe blasse Linie quer über die volle Breite und hat
         den Kopf vom Inhalt abgeschnitten, zu dem er gehört. Was die Zäsur
         wirklich trägt, ist der Weißraum darunter und der Größensprung von
         der Überschrift zum Fließtext. */
      <div className={cn("pb-4", className)}>
        {eyebrow ? (
          <Reveal>
            <p className="eyebrow mb-5 text-current/90">{eyebrow}</p>
          </Reveal>
        ) : null}
        {/* Deckel 68 rem, nicht `max-w-4xl` (56 rem).

            Gemessen bei 1990 px Fensterbreite braucht die längste
            Abschnittsüberschrift der Seite – „Kaufen, reparieren, absichern:
            alles bei derselben Werkstatt." – einzeilig 1852 px. Bei 896 px
            Deckel ergab das drei Zeilen, von denen die letzte halb leer war,
            während rechts daneben 768 px Fläche frei blieben. 1088 px teilen
            denselben Satz in zwei; `text-wrap: balance` (siehe `globals.css`)
            macht daraus zwei etwa gleich lange Zeilen.

            Der Deckel bindet erst ab rund 1170 px Fensterbreite – darunter
            gibt der Satzspiegel ohnehin das schmalere Maß vor, am Telefon
            ändert sich nichts. Und er ist kein Lesemaß im Sinne der 58ch für
            Fließtext: 1088 px sind im Displaygrad rund 40 Zeichen je Zeile. */}
        <Reveal mask delay={60}>
          <h2 className="max-w-[68rem] text-[length:var(--text-display)]">
            {title}
          </h2>
        </Reveal>
        {lead ? (
          <Reveal delay={140}>
            <p className="mt-7 max-w-2xl text-[length:var(--text-lead)] leading-relaxed opacity-80">
              {lead}
            </p>
          </Reveal>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <p
            className={cn(
              "eyebrow mb-5 text-current/90",
              align === "center" && "justify-center",
            )}
          >
            {eyebrow}
          </p>
        </Reveal>
      ) : null}
      <Reveal mask delay={60}>
        <h2 className="text-[length:var(--text-display)]">{title}</h2>
      </Reveal>
      {lead ? (
        <Reveal delay={140}>
          <p className="mt-6 text-[length:var(--text-lead)] leading-relaxed opacity-70">
            {lead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
