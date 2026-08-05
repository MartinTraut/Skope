import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/ui/page-header";
import { PhoneButton } from "@/components/ui/phone-button";
import { Container, Section } from "@/components/ui/section";
import { JsonLd, breadcrumb, pageGraph } from "@/lib/schema";
import { CONTACT_TOPICS } from "@/lib/data/topics";
import { pageMeta } from "@/lib/seo";
import { fullAddress, nearbyPlaces, serviceArea, site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Kontakt & Anfahrt — Werkstatt Neuenstadt",
  description:
    "E-Scooter Fachwerkstatt Im Kampfrad 3 in Neuenstadt am Kocher. Telefon, E-Mail, Anfahrt aus Heilbronn und Neckarsulm sowie Formular für Ihre Anfrage.",
  path: "/kontakt",
});

export default function ContactPage() {

  return (
    <>
      <PageHeader
        crumb="Kontakt"
        eyebrow="Kontakt & Anfahrt"
        title={
          <>
            Kurzer Weg
            <br />
            zur Werkstatt.
          </>
        }
        lead="Am schnellsten geht ein Anruf — bei den meisten Problemen lässt sich schon am Telefon einschätzen, worum es geht. Schriftlich erreichen Sie uns über das Formular oder direkt per E-Mail."
        aside={
          <PhoneButton />
        }
      />

      <Section tone="ink-800">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            {/* Kontaktdaten */}
            <div className="lg:col-span-5">
              <Reveal>
                <h2 className="font-display text-xs font-semibold tracking-[0.18em] text-paper/60 uppercase">
                  Direkt erreichbar
                </h2>
                <address className="mt-7 flex flex-col gap-6 not-italic">
                  <a
                    href={site.phone.href}
                    className="group flex items-start gap-4"
                  >
                    <Phone
                      aria-hidden="true"
                      className="mt-1.5 size-5 shrink-0 text-current/40"
                    />
                    <span>
                      <span className="block text-sm text-paper/50">
                        Telefon
                      </span>
                      <span className="tabular font-display text-xl font-bold tracking-tight transition-colors group-hover:text-flame">
                        {site.phone.display}
                      </span>
                    </span>
                  </a>

                  <a
                    href={`mailto:${site.email}`}
                    className="group flex items-start gap-4"
                  >
                    <Mail
                      aria-hidden="true"
                      className="mt-1.5 size-5 shrink-0 text-current/40"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm text-paper/50">
                        E-Mail
                      </span>
                      <span className="block font-display text-lg font-bold tracking-tight break-all transition-colors group-hover:text-flame">
                        {site.email}
                      </span>
                    </span>
                  </a>

                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4"
                  >
                    <MapPin
                      aria-hidden="true"
                      className="mt-1.5 size-5 shrink-0 text-current/40"
                    />
                    <span>
                      <span className="block text-sm text-paper/50">
                        Werkstatt
                      </span>
                      <span className="font-display text-xl font-bold tracking-tight transition-colors group-hover:text-flame">
                        {fullAddress}
                      </span>
                      <span className="mt-1 block text-sm text-paper/50">
                        Route in Google Maps öffnen
                      </span>
                    </span>
                  </a>
                </address>

                {/* TODO Betreiber: verbindliche Öffnungszeiten in lib/site.ts */}
                <div className="mt-9 rounded-sm border border-white/12 p-6">
                  <h3 className="font-display text-sm font-semibold tracking-tight">
                    Erreichbarkeit
                  </h3>
                  <p className="mt-2 text-paper/60">{site.openingHours}</p>
                </div>

                <div className="mt-9">
                  <h3 className="font-display text-xs font-semibold tracking-[0.18em] text-paper/60 uppercase">
                    Anfahrt aus der Region
                  </h3>
                  <ul className="mt-5 grid grid-cols-2 gap-x-6">
                    {serviceArea.map((place) => (
                      <li
                        key={place.name}
                        className="flex items-baseline justify-between gap-2 border-b border-white/10 py-2.5 text-sm"
                      >
                        <span className="text-paper/70">{place.name}</span>
                        <span className="tabular text-xs text-paper/60">
                          {place.distance}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm text-paper/60">
                    Ebenso: {nearbyPlaces.join(", ")}.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Formular */}
            <div className="lg:col-span-7">
              <Reveal delay={80}>
                <h2 className="text-[length:var(--text-title)]">
                  Anfrage schreiben
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-paper/65">
                  Je konkreter Sie das Problem beschreiben, desto genauer die
                  erste Einschätzung. Bei Reparaturen melden wir uns mit einem
                  Kostenvoranschlag zurück.
                </p>
                <InquiryForm
                  className="mt-10"
                  topics={CONTACT_TOPICS}
                  topicFromQuery
                  />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/*
        Anfahrt-Band statt Karten-Embed: kein Drittanbieter-Request beim
        Seitenaufruf, keine Einwilligung nötig — und der Weg zur Navigation
        ist genauso kurz.
      */}
      <section aria-label="Anfahrt" className="bg-petrol-900 py-16 md:py-20">
        <Container>
          <Reveal className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow text-current/55">Anfahrt</p>
              <p className="mt-4 font-display text-[clamp(1.5rem,2vw+1rem,2.4rem)] font-bold tracking-tight">
                {fullAddress}
              </p>
              <p className="mt-3 max-w-xl leading-relaxed text-paper/70">
                Zentral zwischen Heilbronn, Öhringen und Mosbach — aus Bad
                Friedrichshall sind es acht Kilometer, aus Heilbronn fünfzehn.
              </p>
            </div>
            <div className="lg:col-span-5 lg:justify-self-end">
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[3.25rem] items-center justify-center gap-2.5 rounded-sm border border-white/45 px-7 font-display font-semibold tracking-tight transition-colors duration-200 hover:border-white"
              >
                <MapPin className="size-4" aria-hidden="true" />
                Route in Google Maps öffnen
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      <JsonLd nodes={pageGraph([breadcrumb([{ name: "Kontakt", path: "/kontakt" }])])} />
    </>
  );
}
