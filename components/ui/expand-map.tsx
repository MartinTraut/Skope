import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";

/**
 * Lagekarte der Werkstatt.
 *
 * Hier stand vorher eine schematische Skizze: ein aufklappbares Straßenraster
 * mit erfundenen Baublöcken. Sie war ehrlich beschriftet, hat aber die eine
 * Frage nicht beantwortet, die jemand an dieser Stelle hat – wo ist das, und
 * wie komme ich hin. Jetzt liegt hier ein echter Kartenausschnitt.
 *
 * Das Bild ist eine Datei im Projekt, kein eingebetteter Kartendienst. Der
 * Unterschied ist nicht Geschmack:
 *
 * - Ein Google-Maps-Embed lädt beim Seitenaufruf, überträgt die IP-Adresse
 *   jedes Besuchers an einen Drittanbieter und braucht damit eine
 *   Einwilligung, also ein Banner vor der Karte. Ein Bild aus dem eigenen
 *   Verzeichnis braucht nichts davon.
 * - Es kostet 116 kB einmalig statt mehrerer hundert kB Skript und Kacheln
 *   bei jedem Aufruf, und es kann nicht ausfallen.
 *
 * Der Ausschnitt ist eingefärbt, nicht im Originalton: Tinte als Grund,
 * Straßen in Grün. Eine bunte Standardkarte ist auf dieser Seite ein
 * Fremdkörper – sie bringt Beige, Rosa und Blau mit, und die Seite kennt
 * genau zwei Flächen und eine Akzentfarbe. Die Einfärbung läuft über die
 * Helligkeit der Originalkachel: fast weiß ist Straße, mittel ist Fläche,
 * dunkel ist Schrift. Als PNG gespeichert, weil das Bild nach der
 * Einfärbung aus wenigen Farbwerten besteht und JPEG auf den großen ruhigen
 * Flächen sichtbar streifen würde.
 *
 * Der Ausschnitt stammt von OpenStreetMap und steht unter der Open Database
 * License. Die Namensnennung darunter ist deshalb Pflicht, nicht Höflichkeit
 * – wer das Bild austauscht, muss sie stehen lassen.
 *
 * Wer wirklich losfahren will, tippt auf die Karte: Der ganze Block ist ein
 * Verweis auf die Route in Google Maps, dort steht die Navigation.
 */
export function LocationMap({
  location,
  coordinates,
  href,
  className,
}: {
  location: string;
  coordinates: string;
  href?: string;
  className?: string;
}) {
  const map = (
    <>
      <Image
        src="/img/karte-neuenstadt.png"
        alt={`Kartenausschnitt mit der Lage der Werkstatt ${location}`}
        fill
        sizes="(max-width: 1024px) 100vw, 45vw"
        className="object-cover transition-transform duration-[600ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
      />

      {/* Die Nadel sitzt in der Bildmitte, weil der Ausschnitt beim Erzeugen
          genau auf die Adresse zentriert wurde. Wer das Bild austauscht, muss
          diese Annahme prüfen. */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      >
        <span className="absolute inset-0 rounded-full bg-neon/25" />
        <span className="relative grid size-7 place-items-center rounded-full bg-neon text-ink">
          <MapPin className="size-4" strokeWidth={2.5} />
        </span>
      </span>

      {/* Adresse auf einem Verlauf, nicht auf der blanken Karte: Über
          Straßennamen und Hausnummern ist keine Schriftfarbe lesbar. */}
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/85 to-transparent p-5 pt-12 text-silver on-dark">
        <span className="flex items-end justify-between gap-4">
          <span className="block">
            <span className="block font-display text-sm leading-snug font-bold">
              {location}
            </span>
            <span className="tabular mt-1 block text-xs text-current/65">
              {coordinates}
            </span>
          </span>
          {href ? (
            <ArrowUpRight
              aria-hidden="true"
              className="size-5 shrink-0 text-current/50 transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
            />
          ) : null}
        </span>
      </span>
    </>
  );

  const frame =
    "group lift relative block aspect-[16/9] w-full overflow-hidden rounded-lg bg-ink-700";

  return (
    <div className={className}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Route nach ${location} in Google Maps öffnen`}
          className={frame}
        >
          {map}
        </a>
      ) : (
        <div className={frame}>{map}</div>
      )}

      <p className="mt-3 text-xs text-current/55">
        Kartendaten ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors hover:text-current"
        >
          OpenStreetMap
        </a>
        -Mitwirkende. Antippen öffnet die Route in Google Maps.
      </p>
    </div>
  );
}
