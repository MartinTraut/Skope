import { ScooterGlyph } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

/**
 * Das Skope-Qualitätssiegel als Vektor.
 *
 * Bewusst kein Rasterbild: Das Siegel erscheint einmal als 56-px-Plakette neben
 * dem Hero-Bild und einmal fast spaltenfüllend auf der Verkaufsseite. Eine
 * einzelne JPEG-Datei kann beides nicht gleich gut bedienen — und Umlaute in
 * generierten Grafiken sind ein Risiko, das eine deutsche Marke nicht eingehen
 * muss. Als SVG wiegt das Siegel rund ein Prozent der vorherigen Bilddatei.
 *
 * `decorative` für Einsätze, deren Aussage der umgebende Text bereits trägt —
 * sonst liest der Screenreader dieselbe Information zweimal vor.
 *
 * `compact` lässt Umschrift und Fußzeile weg. Unter etwa 90 px fallen die
 * 8-Punkt-Zeilen ohnehin zu einem grauen Schleier zusammen; dann ist weniger
 * Zeichnung das schärfere Bild.
 */
export function Seal({
  className,
  decorative = false,
  compact = false,
}: {
  className?: string;
  decorative?: boolean;
  compact?: boolean;
}) {
  const titleId = "skope-seal-title";

  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("h-auto w-full", className)}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? "true" : undefined}
      aria-labelledby={decorative ? titleId : undefined}
    >
      {decorative ? null : (
        <title id={titleId}>
          Skope-Qualitätssiegel: geprüft in eigener Werkstatt in Neuenstadt am
          Kocher, ein Jahr Gewährleistung
        </title>
      )}

      {/* Laufpfade der Umschrift, beide auf dem Kreis um 100/100 mit Radius 78.
          Entscheidend ist die Laufrichtung: Sie legt fest, wo bei den Buchstaben
          „oben" liegt. Der obere Bogen läuft von 9 nach 3 Uhr über den Scheitel,
          der untere von 8 nach 4 Uhr durch den Fußpunkt — beide also im Bild von
          links nach rechts, sonst stünde die untere Zeile auf dem Kopf. */}
      <defs>
        <path
          id="skope-seal-arc-top"
          fill="none"
          d="M22 100A78 78 0 0 1 178 100"
        />
        <path
          id="skope-seal-arc-bottom"
          fill="none"
          d="M26.7 126.7A78 78 0 0 0 173.3 126.7"
        />
      </defs>

      <circle cx="100" cy="100" r="99" className="fill-ink" />
      <circle
        cx="100"
        cy="100"
        r="93"
        fill="none"
        className="stroke-flame"
        strokeWidth="2.5"
      />
      <circle
        cx="100"
        cy="100"
        r="86"
        fill="none"
        className="stroke-petrol-400"
        strokeWidth="0.9"
        opacity="0.8"
      />

      {compact ? null : (
        <>
          <g className="fill-paper font-display" fontWeight="600" fontSize="9">
            <text letterSpacing="2.4">
              <textPath
                href="#skope-seal-arc-top"
                startOffset="50%"
                textAnchor="middle"
              >
                GEPRÜFT IN EIGENER WERKSTATT
              </textPath>
            </text>
            <text letterSpacing="2.2" opacity="0.55">
              <textPath
                href="#skope-seal-arc-bottom"
                startOffset="50%"
                textAnchor="middle"
              >
                NEUENSTADT AM KOCHER
              </textPath>
            </text>
          </g>

          {/* Punkte auf der Waagerechten schließen die beiden Schriftbögen ab */}
          <g className="fill-flame">
            <circle cx="11.5" cy="100" r="2" />
            <circle cx="188.5" cy="100" r="2" />
          </g>
        </>
      )}

      {/* Glyphe aus dem 48er-Raum über die Wortmarke gesetzt */}
      <g className="text-paper" transform="translate(72.4 31) scale(1.15)">
        <ScooterGlyph />
      </g>

      <text
        x="100"
        y="115"
        textAnchor="middle"
        className="fill-paper font-display"
        fontWeight="800"
        fontSize="29"
        letterSpacing="-1"
      >
        SKOPE
      </text>
      {/* In der Vollfassung trägt der obere Bogen bereits „geprüft"; hier steht
          deshalb die Gewährleistung. In der kompakten Fassung fehlen die Bögen,
          dann muss dieses Wort die Aussage des Siegels allein tragen. */}
      {compact ? (
        <text
          x="100"
          y="134"
          textAnchor="middle"
          className="fill-flame font-display"
          fontWeight="700"
          fontSize="9.5"
          letterSpacing="4.2"
        >
          GEPRÜFT
        </text>
      ) : (
        <text
          x="100"
          y="133"
          textAnchor="middle"
          className="fill-flame font-display"
          fontWeight="700"
          fontSize="6.5"
          letterSpacing="1.8"
        >
          1 JAHR GEWÄHRLEISTUNG
        </text>
      )}
    </svg>
  );
}
