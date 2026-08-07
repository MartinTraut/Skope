import { cn } from "@/lib/utils";

/**
 * Der Roller als reine SVG-Gruppe im 48×48-Koordinatenraum.
 *
 * Als `<g>` statt als eigenes `<svg>`, damit die Glyphe in fremde Zeichnungen
 * eingesetzt werden kann — im Siegel etwa sitzt sie ohne den Messring mitten in
 * der Umschrift. Farben kommen über Utility-Klassen, nicht über
 * Präsentationsattribute: `var()` wird in Attributen nicht aufgelöst.
 */
export function ScooterGlyph() {
  return (
    <>
      <g
        className="stroke-current"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <circle cx="13" cy="34" r="6" />
        <circle cx="35" cy="34" r="6" />
        {/* Lenkrohr nach hinten geneigt wie am echten Gerät, plus Lenkstange */}
        <path d="M34.6 28.1 29.4 12.6" />
        <path d="M25 11.8h8.8" />
      </g>

      {/* Trittbrett auf Achshöhe: verbindet beide Räder, ohne sie zu schneiden.
          Als einziger Vollton trägt es die Marke auch im Ein-Farb-Druck. */}
      <path
        d="M19.6 34h9.8"
        className="stroke-flame"
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Messpunkt in der Vorderradnabe: der geprüfte Punkt */}
      <circle cx="35" cy="34" r="1.9" className="fill-flame" />
    </>
  );
}

/**
 * Bildmarke: Roller im Messring.
 *
 * Der Name SKOPE trägt das griechische „skopein" — betrachten, prüfen. Genau
 * darauf liegt das Versprechen der Werkstatt („erst messen, dann tauschen"),
 * deshalb sitzt der Roller in einem offenen Messring mit Skalenstrichen statt
 * in einem beliebigen Kreis. Der Ring öffnet sich nach vorn rechts, damit die
 * Fahrtrichtung frei bleibt und die Marke nicht statisch wirkt.
 */
export function ScooterMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn("h-7 w-auto", className)}
    >
      {/* Messring — bei 28 px verschmelzen die Skalenstriche optisch zu einem
          ruhigen Ring, erst bei großer Darstellung werden sie einzeln lesbar. */}
      <g
        className="stroke-current"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.45"
      >
        <path d="M40.5 13.2A22 22 0 1 0 43.6 28" />
        <path d="M24 2v3.4" />
        <path d="M46 24h-3.4" />
        <path d="M24 46v-3.4" />
        <path d="M2 24h3.4" />
      </g>

      {/* Etwas verkleinert, damit Lenkstange und Räder den Ring nicht berühren */}
      <g transform="translate(24 25) scale(0.82) translate(-24 -25)">
        <ScooterGlyph />
      </g>
    </svg>
  );
}

/**
 * Wortmarke mit Bildmarke — Hauptlogo in Header und Footer.
 *
 * `showSub` blendet die Zeile „Gebrauchtwarenhandel" aus, wo der Platz eng ist.
 * Die Haarlinie zwischen Marke und Schrift gibt beiden Teilen eine eigene Zone,
 * statt sie zu einer diffusen Gruppe verlaufen zu lassen.
 */
export function Logo({
  className,
  showSub = true,
}: {
  className?: string;
  showSub?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <ScooterMark className="h-8 w-auto" />
      <span
        aria-hidden="true"
        className="h-6 w-px shrink-0 bg-current opacity-20"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.3rem] leading-none font-extrabold tracking-[-0.045em]">
          SKOPE
        </span>
        {showSub ? (
          <span className="font-display mt-1 text-[0.5rem] leading-none font-semibold tracking-[0.24em] uppercase opacity-55">
            Gebrauchtwarenhandel
          </span>
        ) : null}
      </span>
    </span>
  );
}
