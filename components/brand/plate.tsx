import { cn } from "@/lib/utils";

/**
 * Die Saisonplakette als Zeichnung.
 *
 * Der Satz, um den sich diese Seite dreht, ist „Plakette zum Mitnehmen" – und
 * bis hierher stand er nur geschrieben da. Ein Gegenstand, den man mitnimmt,
 * darf man auch sehen.
 *
 * Bewusst kein Nachbau eines echten Versicherungskennzeichens: Das trägt eine
 * behördlich vergebene Kennung, und eine erfundene Kennung auf einer Seite,
 * die Versicherungen vermittelt, wäre eine Urkundenoptik ohne Urkunde. Hier
 * steht deshalb nur, was tatsächlich die Aussage ist – die Saison. Die Form
 * (Hochformat, Rahmen, aufgesetzte Ecken) reicht, damit jeder erkennt, was
 * gemeint ist.
 *
 * Farbe: dunkle Fläche mit Neon darauf. Auf der silbernen Sektion ist das der
 * einzige Weg, Neon als Schrift zu zeigen – auf Tinte steht es bei 14,8:1,
 * auf Silber läge es bei 1,18:1 (siehe Farbregel in `globals.css`).
 *
 * Die Bewegung ist `seal-stamp` aus dem Stylesheet, dieselbe wie beim
 * Qualitätssiegel: Die Plakette wird aufgebracht, sie liegt nicht einfach da.
 * Sie hängt an `animation-timeline: view()`, läuft also ohne Scroll-Listener
 * und fällt bei `prefers-reduced-motion` auf das Standbild zurück.
 */
export function Plate({
  season = "26 / 27",
  className,
}: {
  /** Saisonjahre, wie sie auf der Plakette stehen. */
  season?: string;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={`Versicherungsplakette der Saison ${season.replace(" / ", "/")}`}
      className={cn("seal-stamp block w-28 sm:w-32", className)}
    >
      <svg viewBox="0 0 112 148" className="h-auto w-full">
        <rect width="112" height="148" rx="10" fill="#08090b" />
        <rect
          x="5.5"
          y="5.5"
          width="101"
          height="137"
          rx="6"
          fill="none"
          stroke="#9ef605"
          strokeWidth="2"
        />

        {/* Die beiden Nieten oben – das Detail, an dem eine Plakette als
            Plakette gelesen wird, auch wenn sonst nichts darauf steht. */}
        <circle cx="34" cy="20" r="3" fill="#9ef605" opacity="0.55" />
        <circle cx="78" cy="20" r="3" fill="#9ef605" opacity="0.55" />

        <text
          x="56"
          y="41"
          textAnchor="middle"
          fill="#eef1f4"
          fillOpacity="0.6"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="1.6"
          fontFamily="var(--font-display), system-ui, sans-serif"
        >
          SAISON
        </text>

        <text
          x="56"
          y="83"
          textAnchor="middle"
          fill="#9ef605"
          fontSize="34"
          fontWeight="700"
          letterSpacing="-1"
          fontFamily="var(--font-display), system-ui, sans-serif"
        >
          {season.split(" / ")[0]}
        </text>
        <text
          x="56"
          y="119"
          textAnchor="middle"
          fill="#9ef605"
          fontSize="34"
          fontWeight="700"
          letterSpacing="-1"
          fontFamily="var(--font-display), system-ui, sans-serif"
        >
          {season.split(" / ")[1] ?? ""}
        </text>

        <rect
          x="34"
          y="130"
          width="44"
          height="3"
          rx="1.5"
          fill="#eef1f4"
          opacity="0.25"
        />
      </svg>
    </span>
  );
}
