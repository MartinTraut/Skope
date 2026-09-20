import { Reveal } from "@/components/motion/reveal";

export type Step = { n: string; title: string; text: string };

/**
 * Ein nummerierter Ablauf als Kette mit sichtbaren Gliedern.
 *
 * Es gab diesen Baustein zweimal – auf `/reparatur` und auf `/versicherung` –
 * und die beiden Fassungen waren auseinandergelaufen: Spalte `3rem` gegen
 * `2.75rem`, Scheibe `size-12` gegen `size-11`, Linie `left-6`/`top-14` gegen
 * `left-[1.375rem]`/`top-12`, die Zeichenanimation nur auf einer der beiden.
 * Zwei Abläufe auf einer Website müssen gleich aussehen, sonst sind es zwei
 * Bausteine.
 *
 * **Die Verbindungslinie gibt es erst ab `sm`.** Unter 640 px steht der
 * Fließtext über *beide* Spalten (`col-span-2`), beginnt also am linken Rand
 * der Liste – und die Linie liegt absolut positioniert bei 22 px, malte damit
 * quer durch den Satz. Genau das war am Telefon als „Nummernstrahl
 * überschneidet sich selbst" zu sehen. Die Linie hat erst dann eine Aufgabe,
 * wenn der Text ab `sm` in die zweite Spalte einrückt und links von ihm eine
 * freie Rinne bleibt.
 *
 * **Am Telefon steht die Nummer neben der Überschrift, der Fließtext
 * darunter über die volle Breite.** Als durchgehende zweite Spalte war der
 * Satz bei 390 px nur 274 px breit, in verschachtelten Kästen 234 px –
 * gemessen 23 bis 25 Zeichen je Zeile, wo der Satzspiegel 342 px hergibt.
 *
 * Die Ziffer steht als dunkle Schrift auf einer Neonscheibe: Auf Silber ist
 * Neon Fläche und nie Schrift (1,18:1). Die Linie endet mit dem letzten
 * Schritt, statt ins Leere zu zeigen.
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
          className="relative grid grid-cols-[2.75rem_1fr] items-center gap-x-4 gap-y-3 pb-12 last:pb-0 sm:grid-cols-[3.5rem_1fr] sm:items-start sm:gap-x-8 sm:gap-y-0"
        >
          {i < items.length - 1 && (
            <span
              aria-hidden="true"
              className="chain-draw absolute bottom-0 hidden w-px bg-ink/20 sm:top-16 sm:left-7 sm:block"
            />
          )}
          <span
            aria-hidden="true"
            className="tabular grid size-11 place-items-center self-start rounded-full bg-neon font-display text-base font-bold tracking-tight text-ink sm:row-span-2 sm:size-14 sm:text-xl"
          >
            {step.n}
          </span>
          <h3 className="text-[length:var(--text-subtitle)]">{step.title}</h3>
          <div className="col-span-2 min-w-0 sm:col-span-1 sm:col-start-2 sm:pt-2.5">
            <p className="max-w-xl leading-relaxed text-current/65 sm:mt-2.5">
              {step.text}
            </p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
