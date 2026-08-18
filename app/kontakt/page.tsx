import type { Metadata } from "next";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { LocationMap } from "@/components/ui/expand-map";
import { PageHeader } from "@/components/ui/page-header";
import { PhoneButton } from "@/components/ui/phone-button";
import { Container, Section } from "@/components/ui/section";
import { JsonLd, breadcrumb, pageGraph } from "@/lib/schema";
import { CONTACT_TOPICS } from "@/lib/data/topics";
import { pageMeta } from "@/lib/seo";
import { fullAddress, nearbyPlaceNames, serviceArea, site } from "@/lib/site";
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
                {/* Die Karte steht oben in dieser Spalte, nicht in einem
                    eigenen Band am Seitenende. Wer Kontakt aufnimmt, will
                    Ort, Erreichbarkeit und Formular in einem Blick haben –
                    vorher lag zwischen Adresse und Karte die ganze
                    Anfahrtsliste plus das Formular. */}
                <LocationMap
                  location={fullAddress}
                  coordinates={`${site.geo.lat.toFixed(4).replace(".", ",")}° N · ${site.geo.lng.toFixed(4).replace(".", ",")}° O`}
                  href={site.mapsUrl}
                />
                {/* Der Satz stand im gestrichenen Anfahrtsband am Seitenende.
                    Er nennt die Nachbarorte im Fliesstext und gehört damit
                    zur Karte, nicht in eine eigene Sektion. */}
                <p className="mt-4 leading-relaxed text-current/70">
                  Zentral zwischen Heilbronn, Öhringen und Mosbach. Aus Bad
                  Friedrichshall sind es acht Kilometer, aus Heilbronn fünfzehn.
                </p>

                <h2 className="eyebrow-plain mt-10 text-current/90">
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
                      {/* `block leading-tight`: Die Zeile stand als
                          Inline-Element im Fliesstext und erbte dessen
                          Zeilenabstand. Bei Displaygrösse riss das die
                          zweizeilige Adresse rund 20 px auseinander – sie las
                          sich als zwei Angaben statt als eine. */}
                      <span className="block font-display text-[length:var(--text-subtitle)] leading-tight font-bold tracking-tight transition-colors group-hover:text-accent">
                        {fullAddress}
                      </span>
                      {/* Unterstrichen und mit Pfeil: Vorher stand hier grauer
                          Text in derselben Grösse wie die Beschriftung
                          darüber – niemand sieht darin eine Handlung. */}
                      <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-current/70 underline underline-offset-4 transition-colors group-hover:text-current">
                        Route in Google Maps öffnen
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                      </span>
                    </span>
                  </a>

                  {/* Vierter Eintrag statt eigener Kasten.
                      Die Erreichbarkeit stand vorher in einer umrandeten
                      Box darunter – gleiche Art Angabe, andere Bauform, und
                      der Rahmen machte aus einer Zeile Text ein leer
                      wirkendes Feld. Jetzt trägt sie dieselbe Zeilenform wie
                      Telefon, E-Mail und Werkstatt, nur ohne Verweis.
                      TODO Betreiber: verbindliche Öffnungszeiten in lib/site.ts */}
                  <div className="flex items-start gap-4">
                    <Clock
                      aria-hidden="true"
                      className="mt-1.5 size-5 shrink-0 text-current/40"
                    />
                    <span>
                      <span className="block text-sm text-current/70">
                        Erreichbarkeit
                      </span>
                      <span className="block font-display text-lg leading-snug font-bold tracking-tight">
                        {site.openingHours}
                      </span>
                    </span>
                  </div>
                </address>

                <div className="mt-9">
                  <h3 className="eyebrow-plain text-current/90">
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
                    Ebenso: {nearbyPlaceNames.join(", ")}.
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
                  <Mark>Anfrage</Mark> schreiben
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

      <JsonLd
        nodes={pageGraph([breadcrumb([{ name: "Kontakt", path: "/kontakt" }])])}
      />
    </>
  );
}
