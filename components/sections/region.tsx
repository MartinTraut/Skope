import { MapPin } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { fullAddress, nearbyPlaces, serviceArea, site } from "@/lib/site";

/**
 * GEO-Sektion: echte Entfernungen statt Ortsnamen-Stapelung.
 * Die Distanz ist die Information, die der Nutzer wirklich sucht.
 */
export function Region() {
  return (
    <Section id="region" tone="petrol">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-current/55">Einzugsgebiet</p>
              <h2 className="mt-5 text-[length:var(--text-display)]">
                Aus Heilbronn sind es
                <br />
                15&nbsp;Kilometer.
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-paper/70">
                Die Werkstatt liegt in Neuenstadt am Kocher, zentral zwischen
                Heilbronn, Öhringen und Mosbach. Premium-Wartungskunden holen
                wir im Umkreis von 15 km ab und bringen den Scooter wieder
                zurück.
              </p>
              <address className="mt-8 flex items-start gap-3 text-lg not-italic">
                <MapPin
                  aria-hidden="true"
                  className="mt-1.5 size-5 shrink-0 text-current/40"
                />
                <span>{fullAddress}</span>
              </address>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/kontakt" size="lg">
                  Termin vereinbaren
                </ButtonLink>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[3.25rem] items-center justify-center rounded-sm border border-white/25 px-7 font-display font-semibold tracking-tight transition-colors duration-200 hover:border-white/60"
                >
                  Route planen
                </a>
              </div>
            </Reveal>
          </div>

          {/* Entfernungsliste als typografische Fläche, nicht als Kartenraster */}
          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <ul>
                {serviceArea.map((place) => (
                  <li
                    key={place.name}
                    className="flex items-baseline justify-between gap-6 border-b border-white/12 py-5"
                  >
                    <span className="font-display text-[clamp(1.4rem,1.6vw+0.9rem,2.1rem)] font-bold tracking-tight">
                      {place.name}
                    </span>
                    <span className="tabular font-display text-lg font-semibold text-paper">
                      {place.distance}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-7 leading-relaxed text-paper/55">
                Ebenfalls im Einzugsgebiet: {nearbyPlaces.join(", ")}. Für
                Reparatur, Wartung und den Kauf geprüfter Gebrauchtgeräte sind
                wir aus dem gesamten Umkreis bis 30 km schnell erreichbar.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
