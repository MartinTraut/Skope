import { MapPin } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { fullAddress, nearbyPlaces, serviceArea, site } from "@/lib/site";

/**
 * GEO-Sektion: echte Entfernungen statt Ortsnamen-Stapelung.
 * Die Distanz ist die Information, die der Nutzer wirklich sucht.
 *
 * Bewusst NICHT im 5/7-Split wie die übrigen Sektionen: Diese Teilung kommt auf
 * jeder Seite mehrfach vor. Hier trägt stattdessen eine breite Headline oben
 * und darunter die Entfernungsliste über die volle Containerbreite — dieselbe
 * Information, aber eine andere Figur im Seitenrhythmus.
 */
export function Region() {
  return (
    <Section id="region" tone="petrol">
      <Container>
        <Reveal className="flex flex-col gap-10 border-b border-white/15 pb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <p className="eyebrow text-current/65">Einzugsgebiet</p>
            <h2 className="mt-5 max-w-[16ch] text-[length:var(--text-display)]">
              Aus Heilbronn sind es 15&nbsp;Kilometer.
            </h2>
          </div>

          <div className="lg:max-w-md lg:shrink-0">
            <p className="leading-relaxed text-paper/75">
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
                ich hin". Der Weg zur Anfrage steht direkt darunter im CTA-Band —
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

        {/* Entfernungsliste über die volle Breite, dreispaltig — als Fläche
            gelesen, nicht als Kartenraster. */}
        <Reveal delay={80}>
          <ul className="mt-12 grid gap-x-16 sm:grid-cols-2 lg:grid-cols-3">
            {serviceArea.map((place) => (
              <li
                key={place.name}
                className="flex items-baseline justify-between gap-6 border-b border-white/15 py-5"
              >
                <span className="font-display text-[length:var(--text-title)] font-bold tracking-tight">
                  {place.name}
                </span>
                <span className="tabular font-display text-lg font-semibold text-paper">
                  {place.distance}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[68ch] leading-relaxed text-paper/75">
            Ebenfalls im Einzugsgebiet: {nearbyPlaces.join(", ")}. Für Reparatur,
            Wartung und den Kauf geprüfter Gebrauchtgeräte sind wir aus dem
            gesamten Umkreis bis 25 km schnell erreichbar.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
