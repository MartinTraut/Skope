import { cn } from "@/lib/utils";

/**
 * Endlos laufendes Band.
 *
 * Der Inhalt wird mehrfach nebeneinander gelegt und die Spur um genau eine
 * Kopienbreite verschoben – am Ende des Durchlaufs steht damit wieder exakt
 * das Ausgangsbild, und die Schleife hat keine sichtbare Naht.
 *
 * Zwei Dinge, die an Umsetzungen dieser Art regelmäßig fehlen:
 *
 * 1. Die Wiederholungen sind `aria-hidden`. Ohne das liest ein Screenreader
 *    dieselbe Liste viermal vor – die Kopien sind ein Zeichenmittel, kein
 *    Inhalt.
 * 2. Bei `prefers-reduced-motion` steht das Band still und wird stattdessen
 *    von Hand scrollbar. Ein Laufband, das sich nicht anhalten lässt, ist für
 *    Menschen mit vestibulären Beschwerden nicht nur unangenehm, sondern
 *    macht den Inhalt unlesbar.
 * 3. `pauseOnHover` hält auch beim Antippen an (`group-active`). Ein Zeiger
 *    existiert auf dem Telefon nicht – ohne diesen zweiten Auslöser wäre das
 *    Anhalten eine Funktion, die es nur am Schreibtisch gibt. Das zählt
 *    besonders, wenn im Band ganze Sätze laufen und nicht nur Ortsnamen.
 *
 * Reine CSS-Animation auf `transform`: kein Zustand, kein Effect, kein
 * `requestAnimationFrame`. Die Komponente bleibt damit eine Server Component.
 */
export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  repeat = 3,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  /** Beim Überfahren anhalten – gibt Zeit zum Lesen. */
  pauseOnHover?: boolean;
  /** Wie oft der Inhalt nebeneinander liegt. Muss die breiteste erwartete
   *  Ansicht mindestens zweimal füllen, sonst reißt die Schleife auf. */
  repeat?: number;
}) {
  return (
    <div
      className={cn(
        "group flex w-full overflow-x-auto [--gap:2.5rem] [gap:var(--gap)] motion-safe:overflow-hidden",
        className,
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 || undefined}
          className={cn(
            /* Die Laufrichtung steht im Kurzschreibweise-Wert selbst und nicht
               als eigenes `animation-direction`. Das ist kein Geschmack: Die
               Kurzschreibweise `animation` setzt alle Teileigenschaften
               zurück, also auch die Richtung – je nach Reihenfolge im
               erzeugten Stylesheet gewinnt sie und das Band lief weiter nach
               links, obwohl `reverse` gesetzt war. Gemessen. */
            reverse
              ? "flex shrink-0 items-stretch [gap:var(--gap)] motion-safe:animate-[marquee_var(--duration,46s)_linear_infinite_reverse]"
              : "flex shrink-0 items-stretch [gap:var(--gap)] motion-safe:animate-[marquee_var(--duration,46s)_linear_infinite]",
            pauseOnHover &&
              "group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
