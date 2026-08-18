import { MapPin } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { Container, Section } from "@/components/ui/section";
import { Mark } from "@/components/ui/mark";
import {
  fullAddress,
  nearbyPlaceNames,
  nearbyPlaces,
  serviceArea,
  site,
} from "@/lib/site";

/**
 * Für das Laufband: die weiter entfernten Orte zuerst, danach die nahen.
 * Beide Listen führen jetzt eine Entfernung – vorher lief die zweite Hälfte
 * des Bandes ohne Kilometerangabe durch, also ohne den Wert, wegen dem die
 * Zeile überhaupt gelesen wird.
 */
const allPlaces: { name: string; distance: string }[] = [
  ...serviceArea,
  ...nearbyPlaces,
];

/**
 * GEO-Sektion: echte Entfernungen statt Ortsnamen-Stapelung.
 * Die Distanz ist die Information, die der Nutzer wirklich sucht.
 *
 * Bewusst NICHT im 5/7-Split wie die übrigen Sektionen: Diese Teilung kommt auf
 * jeder Seite mehrfach vor. Hier trägt stattdessen eine breite Headline oben
 * und darunter die Entfernungsliste über die volle Containerbreite – dieselbe
 * Information, aber eine andere Figur im Seitenrhythmus.
 *
 * `pb-0` an der Sektion: Das Laufband am Ende schließt sie bündig ab. Mit der
 * normalen Bodenluft stand unter dem schwarzen Band noch ein 170 px hoher
 * Silberstreifen, und das Band las sich als versehentlich stehengebliebener
 * Balken statt als Übergang in die nächste dunkle Sektion.
 */
export function Region() {
  return (
    <Section id="region" tone="silver-200" className="pb-0">
      <Container>
        {/* Beide Spalten beginnen an derselben Oberkante.

            Vorher stand hier `items-end`: Die Blöcke waren unten bündig, und
            weil der rechte höher ist, rutschte die Überschrift auf halbe Höhe
            des Absatzes daneben. Man las oben rechts Fliesstext, während die
            Überschrift, die zuerst kommen soll, tiefer und links stand – zwei
            Anfänge auf zwei Höhen. Oben bündig hat die Sektion genau einen
            Einstiegspunkt. */}
        <Reveal className="flex flex-col gap-10 pb-2 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div>
            <p className="eyebrow text-current/90">Einzugsgebiet</p>
            <h2 className="mt-5 max-w-[16ch] text-[length:var(--text-display)]">
              Aus Heilbronn sind es <Mark>15&nbsp;Kilometer</Mark>.
            </h2>
          </div>

          <div className="lg:max-w-md lg:shrink-0">
            <p className="leading-relaxed text-current/75">
              Die Werkstatt liegt in Neuenstadt am Kocher, zentral zwischen
              Heilbronn, Öhringen und Mosbach. Premium-Wartungskunden holen wir
              im Umkreis von 15 km ab und bringen den Scooter wieder zurück.
            </p>
            <address className="mt-6 flex items-start gap-3 not-italic">
              <MapPin
                aria-hidden="true"
                className="mt-1 size-5 shrink-0 text-current/50"
              />
              <span className="font-display text-lg font-semibold tracking-tight">
                {fullAddress}
              </span>
            </address>
            {/* Nur ein Ziel: Diese Sektion beantwortet „wo ist das und wie komme
                ich hin". Der Weg zur Anfrage steht direkt darunter im CTA-Band –
                zwei Buttons mit demselben Ziel hintereinander entwerten beide. */}
            <div className="mt-7">
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "solid", size: "lg" })}
              >
                <MapPin className="size-4" aria-hidden="true" />
                Route planen
              </a>
            </div>
          </div>
        </Reveal>

        {/* Entfernungsliste über die volle Breite, dreispaltig – als Fläche
            gelesen, nicht als Kartenraster. */}
        <Reveal delay={80}>
          <ul className="mt-12 grid gap-x-16 sm:grid-cols-2 lg:grid-cols-3">
            {serviceArea.map((place) => (
              <li
                key={place.name}
                className="flex items-baseline justify-between gap-6 border-b border-current/15 py-5"
              >
                <span className="font-display text-[length:var(--text-title)] font-bold tracking-tight">
                  {place.name}
                </span>
                <span className="tabular font-display text-lg font-semibold text-accent">
                  {place.distance}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-8 leading-relaxed text-current/75">
            Ebenfalls im Einzugsgebiet: {nearbyPlaceNames.join(", ")}. Für
            Reparatur, Wartung und den Kauf geprüfter Gebrauchtgeräte sind wir
            aus dem gesamten Umkreis bis 25 km schnell erreichbar.
          </p>
        </Reveal>
      </Container>

      {/* Laufband über die volle Fensterbreite, außerhalb des Satzspiegels.
          Es wiederholt keine Information, sondern gibt der Ortsliste eine
          zweite Form: Die Tabelle darüber liest man, das Band sieht man. Für
          eine Werkstatt, deren wichtigste Frage „wie weit ist das weg" lautet,
          ist die schiere Länge der Liste selbst das Argument.

          Zugleich der Übergang in die nächste dunkle Sektion – der harte
          Wechsel von Silber auf Schwarz bekommt hier eine Stufe. */}
      <div className="mt-16 overflow-hidden border-y border-current/15 bg-ink py-5 text-silver on-dark">
        <Marquee className="[--duration:52s] [--gap:0px]" repeat={4}>
          {allPlaces.map((place) => (
            <span
              key={place.name}
              className="flex shrink-0 items-center gap-3 px-7 font-display text-sm font-semibold tracking-[0.08em] uppercase"
            >
              {place.name}
              {place.distance ? (
                <span className="tabular font-sans text-xs font-medium tracking-normal text-accent">
                  {place.distance}
                </span>
              ) : null}
              <span aria-hidden="true" className="text-current/25">
                /
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </Section>
  );
}
