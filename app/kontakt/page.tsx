import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { LocationMap } from "@/components/ui/expand-map";
import { PageHeader } from "@/components/ui/page-header";
import { PhoneButton } from "@/components/ui/phone-button";
import { Container, Section } from "@/components/ui/section";
import { JsonLd, breadcrumb, pageGraph } from "@/lib/schema";
import { CONTACT_TOPICS } from "@/lib/data/topics";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { fullAddress, nearbyPlaces, serviceArea, site } from "@/lib/site";
import { Mark } from "@/components/ui/mark";

export const metadata: Metadata = pageMeta({
  title: "Kontakt & Anfahrt zur Werkstatt Neuenstadt",
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
            <Mark>Kurzer</Mark> Weg zur Werkstatt.
          </>
        }
        lead="Am schnellsten geht ein Anruf. Bei den meisten Problemen lässt sich schon am Telefon einschätzen, worum es geht. Schriftlich erreichen Sie uns über das Formular oder direkt per E-Mail."
        aside={<PhoneButton />}
      />

      <Section tone="silver">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            {/* Kontaktdaten – auf Mobile bewusst NACH dem Formular: Wer über
                einen „Anfrage senden"-CTA hier landet, will schreiben, nicht
                erst an Adresse und Anfahrtsliste vorbeiscrollen. */}
            <div className="order-2 lg:order-1 lg:col-span-5">
              <Reveal>
                <h2 className="eyebrow-plain text-current/70">
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
                      <span className="block text-sm text-current/70">
                        Telefon
                      </span>
                      <span className="tabular font-display text-[length:var(--text-subtitle)] font-bold tracking-tight transition-colors group-hover:text-accent">
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
                      <span className="block text-sm text-current/70">
                        E-Mail
                      </span>
                      <span className="block font-display text-lg font-bold tracking-tight break-all transition-colors group-hover:text-accent">
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
                      <span className="block text-sm text-current/70">
                        Werkstatt
                      </span>
                      <span className="font-display text-[length:var(--text-subtitle)] font-bold tracking-tight transition-colors group-hover:text-accent">
                        {fullAddress}
                      </span>
                      <span className="mt-1 block text-sm text-current/70">
                        Route in Google Maps öffnen
                      </span>
                    </span>
                  </a>
                </address>

                {/* TODO Betreiber: verbindliche Öffnungszeiten in lib/site.ts */}
                <div className="mt-9 rounded-md border border-current/12 p-6">
                  <h3 className="font-display text-sm font-semibold tracking-tight">
                    Erreichbarkeit
                  </h3>
                  <p className="mt-2 text-current/60">{site.openingHours}</p>
                </div>

                <div className="mt-9">
                  <h3 className="eyebrow-plain text-current/70">
                    Anfahrt aus der Region
                  </h3>
                  <ul className="mt-5 grid grid-cols-2 gap-x-6">
                    {serviceArea.map((place) => (
                      <li
                        key={place.name}
                        className="flex items-baseline justify-between gap-2 border-b border-current/10 py-2.5 text-sm"
                      >
                        <span className="text-current/70">{place.name}</span>
                        <span className="tabular text-xs text-current/60">
                          {place.distance}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm text-current/60">
                    Ebenso: {nearbyPlaces.join(", ")}.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Formular */}
            <div
              id="anfrage"
              className="order-1 scroll-mt-28 lg:order-2 lg:col-span-7"
            >
              <Reveal delay={80}>
                <h2 className="text-[length:var(--text-title)]">
                  Anfrage schreiben
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-current/65">
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
        Seitenaufruf, keine Einwilligung nötig – und der Weg zur Navigation
        ist genauso kurz.
      */}
      {/* `text-ink on-light` gehört zwingend dazu und ist nicht optional:
          Die Grundfläche der Seite ist Schwarz, die Schriftfarbe kommt vom
          <body>. Eine Sektion, die nur ihre Fläche auf Silber stellt, erbt
          weiterhin silberne Schrift – hier stand die komplette Anfahrt in
          #eef1f4 auf #dee2e8, also bei 1,15:1. Wer eine Fläche umdreht, muss
          die Schrift mitdrehen; genau dafür nimmt `Section` einem das sonst
          ab. */}
      <section
        aria-label="Anfahrt"
        className="bg-silver-200 py-16 text-ink on-light md:py-20"
      >
        <Container>
          <Reveal className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <p className="eyebrow text-current/65">Anfahrt</p>
              <p className="mt-4 font-display text-[length:var(--text-title)] font-bold tracking-tight">
                {fullAddress}
              </p>
              <p className="mt-3 max-w-xl leading-relaxed text-current/70">
                Zentral zwischen Heilbronn, Öhringen und Mosbach. Aus Bad
                Friedrichshall sind es acht Kilometer, aus Heilbronn fünfzehn.
              </p>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "mt-7",
                )}
              >
                <MapPin className="size-4" aria-hidden="true" />
                Route in Google Maps öffnen
              </a>
            </div>

            {/* Die Kachel ist der einzige dunkle Block auf der Silberfläche
                und trägt deshalb den Blick. Der pulsierende Rand ist ein
                Shader und liegt in derselben schwarzen Fläche wie die Skizze,
                nicht als zweiter Kasten darum herum. */}
            <div className="lg:col-span-6">
              <LocationMap
                frame
                location={fullAddress}
                coordinates={`${site.geo.lat.toFixed(4).replace(".", ",")}° N · ${site.geo.lng.toFixed(4).replace(".", ",")}° O`}
                href={site.mapsUrl}
              />
            </div>
          </Reveal>
        </Container>
      </section>

      <JsonLd
        nodes={pageGraph([breadcrumb([{ name: "Kontakt", path: "/kontakt" }])])}
      />
    </>
  );
}
