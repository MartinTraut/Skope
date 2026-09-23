"use client";

import * as React from "react";

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
 * Die Bewegung selbst ist reines CSS auf `transform` – kein
 * `requestAnimationFrame`, keine Rechnung im Skript.
 *
 * **Sie steht still, solange das Band nicht im Bild ist (23.09.2026.)** Das
 * ist der Grund, warum das hier seit diesem Tag ein Client-Bauteil ist, und
 * er ist gemessen: Eine laufende Keyframe-Animation lässt den Browser über
 * die *ganze* Seitenlänge rund zwanzigmal je Sekunde den Stil neu berechnen –
 * auch auf der Startseite, wo das Band acht Bildschirmhöhen unter der Falz
 * liegt und in den ersten Sekunden niemand hinsieht. Auf dem Telefon ist das
 * genau die Last, die beim Scrollen als Haken ankommt.
 *
 * Die Kinder bleiben davon unberührt: Sie kommen als `children` fertig vom
 * Server: Der Aufrufer ist eine Server Component, das Bauteil serialisiert
 * nur noch, was er gerendert hat – dieselbe Regel wie beim Bestandsfilter
 * und der unteren Aktionsleiste.
 *
 * Der Anfangszustand ist „läuft". Ohne JavaScript und vor dem Hydrieren
 * bewegt sich das Band also wie zuvor; der Beobachter kann es nur anhalten,
 * nie in Gang setzen.
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
  const ref = React.useRef<HTMLDivElement>(null);
  const [offscreen, setOffscreen] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* Der Vorlauf von 300 px ist Absicht: Das Band läuft schon, bevor seine
       Kante ins Bild kommt. Genau an der Sichtgrenze anzuhalten hieße, dass
       die erste Kachel bei jedem Herankommen einen Moment steht – man sähe
       das Anhalten, statt es nicht zu merken. */
    const io = new IntersectionObserver(
      ([entry]) => setOffscreen(!entry.isIntersecting),
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      /* Der Zustand hängt am Container und wird über eine `group-data-`
         Variante gelesen – nicht als schlichte Klasse an der Spur.

         Grund ist derselbe Fallstrick, der zwei Absätze tiefer schon bei der
         Laufrichtung steht: `animation` ist eine Kurzschreibweise und setzt
         `animation-play-state` auf `running` zurück. Eine Klasse
         `[animation-play-state:paused]` hat dieselbe Spezifität wie
         `animate-[marquee…]`, und gemessen steht sie im gebauten Bündel
         *davor* – die Kurzschreibweise gewinnt, das Band lief weiter. Eine
         `group-data-`-Variante bringt wie `group-hover` einen zweiten
         Klassenselektor mit und damit die höhere Spezifität, ohne
         `!important`. */
      data-offscreen={offscreen ? "true" : undefined}
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
            "group-data-[offscreen=true]:[animation-play-state:paused]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
