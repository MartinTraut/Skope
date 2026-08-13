import type { Metadata } from "next";
import { BadgeCheck, PhoneCall } from "lucide-react";

import { Seal } from "@/components/brand/seal";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Related } from "@/components/sections/related";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/ui/faq";
import { Gallery } from "@/components/ui/gallery";
import { PageHeader } from "@/components/ui/page-header";
import { buttonVariants } from "@/components/ui/button";
import { PhoneButton } from "@/components/ui/phone-button";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { faqBuy } from "@/lib/data/faq";
import { checkupIncludes } from "@/lib/data/services";
import { inventory } from "@/lib/inventory";
import {
  JsonLd,
  breadcrumb,
  faqPage,
  inventoryProducts,
  pageGraph,
  refurbishedService,
  reviews,
} from "@/lib/schema";
import { BUY_TOPICS } from "@/lib/data/topics";
import { pageMeta } from "@/lib/seo";
import { Mark } from "@/components/ui/mark";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter gebraucht kaufen in Heilbronn",
  description:
    "Generalüberholte E-Scooter mit Skope-Qualitätssiegel aus der eigenen Werkstatt in Neuenstadt am Kocher. Vollständig geprüft, ein Jahr Gewährleistung. Suchauftrag hinterlegen.",
  path: "/e-scooter",
  image: "/img/scooter-studio.jpg",
  imageAlt:
    "Generalüberholter E-Scooter in Studioaufnahme, geprüft mit Skope-Qualitätssiegel",
});

export default function ScooterPage() {
  return (
    <>
      <PageHeader
        crumb="E-Scooter kaufen"
        eyebrow="Refurbished · Skope-Qualitätssiegel"
        title={
          <>
            Gebraucht kaufen, ohne <Mark>Restrisiko</Mark>.
          </>
        }
        lead="Ein gebrauchter E-Scooter aus einem Kleinanzeigenportal ist eine Wette auf den Akku. Bei uns ist er ein Gerät, das eine vollständige Werkstattprüfung hinter sich hat: dokumentiert, mit Siegel und mit einem Jahr Gewährleistung."
      />

      {/* Qualitätssiegel erklären, bevor über Geräte gesprochen wird */}
      <Section tone="silver">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            {/* Das Siegel füllt seine Spalte nur zur Hälfte; darunter stand
                bisher tote Fläche. Die Gewährleistung, vorher als Nachsatz am
                Ende der rechten Spalte versteckt, steht jetzt hier – direkt
                neben dem Zeichen, für das sie bürgt. */}
            <Reveal className="lg:col-span-5">
              <Seal className="seal-stamp w-full max-w-md" />
              <dl className="mt-10 max-w-md border-t border-current/12">
                <div className="flex items-baseline justify-between gap-6 border-b border-current/12 py-4">
                  <dt className="text-current/70">Gewährleistung</dt>
                  <dd className="font-display font-semibold tracking-tight">
                    1 Jahr ab Übergabe
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 border-b border-current/12 py-4">
                  <dt className="text-current/70">Widerrufsrecht</dt>
                  <dd className="font-display font-semibold tracking-tight">
                    14 Tage
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 border-b border-current/12 py-4">
                  <dt className="text-current/70">Prüfpositionen</dt>
                  <dd className="tabular font-display font-semibold tracking-tight">
                    {checkupIncludes.length}
                  </dd>
                </div>
              </dl>
            </Reveal>

            <div className="lg:col-span-7">
              <Reveal delay={70}>
                <p className="eyebrow text-current/65">Das Siegel</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  Kein Gerät ohne vollständige Prüfung.
                </h2>
                <p className="mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-current/70">
                  Das Skope-Qualitätssiegel steht für das Prüfprotokoll unseres
                  Sicherheits-Checkups. Jeder Scooter durchläuft vor dem Verkauf
                  denselben Prüfumfang wie ein Kundengerät im Checkup: dieselben
                  sechs Positionen, dieselbe Dokumentation.
                </p>

                <ul className="mt-9 grid gap-x-10 sm:grid-cols-2">
                  {checkupIncludes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 border-b border-current/10 py-3.5"
                    >
                      <BadgeCheck
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-current/40"
                      />
                      <span className="text-current/80">{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-7 text-current/70">
                  Erst wenn alle sechs Positionen passen, bekommt das Gerät das
                  Siegel. Ein Scooter ohne Siegel verlässt den Laden nicht.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Bestand */}
      <Section id="bestand" tone="silver-200">
        <Container>
          <SectionHead
            eyebrow="Aktueller Bestand"
            title={
              <>
                Welche <Mark>Geräte</Mark> gerade da sind.
              </>
            }
            lead="Der Bestand wechselt laufend, jedes Gerät ist ein Einzelstück. Sagen Sie uns, was Sie suchen: Reichweite, Budget, Einsatzzweck. Wir melden uns, sobald ein passender Scooter durch die Werkstatt gegangen ist."
          />

          {inventory.length > 0 ? (
            /* Ein Gerät, eine Karte über die volle Breite – kein dreispaltiges
               Raster. Bei Einzelstücken gibt es nichts zu vergleichen, und ein
               einzelner Kachelrest neben zwei leeren Spalten sieht aus wie ein
               Bestand, der gerade leergekauft wurde. Die Karte hat stattdessen
               Platz für das, was beim Gebrauchtkauf zählt: sechs Aufnahmen und
               die vollständigen Daten nebeneinander. */
            <div className="mt-14 flex flex-col gap-10">
              {inventory.map((item, i) => (
                <Reveal key={item.id} delay={i * 80} as="article">
                  <div className="grid gap-10 rounded-lg border border-silver/15 lift-lg bg-ink p-6 text-silver md:p-10 lg:grid-cols-12 lg:gap-14 on-dark">
                    <Gallery
                      images={item.images}
                      className="lg:col-span-5 xl:col-span-4"
                    />

                    <div className="lg:col-span-7 xl:col-span-8">
                      <h3 className="text-[length:var(--text-title)]">
                        {item.model}
                      </h3>
                      <p className="mt-4 max-w-xl leading-relaxed text-current/70">
                        {item.summary}
                      </p>

                      <p className="tabular mt-7 font-display text-[length:var(--text-stat)] leading-none font-bold text-accent">
                        {item.price}
                      </p>

                      <dl className="mt-8 grid gap-x-10 sm:grid-cols-2">
                        {item.specs.map((spec) => (
                          <div
                            key={spec.label}
                            className="flex items-baseline justify-between gap-6 border-b border-silver/12 py-3 text-sm"
                          >
                            <dt className="shrink-0 text-current/65">
                              {spec.label}
                            </dt>
                            <dd className="text-right font-medium">
                              {spec.value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      {item.note ? (
                        <p className="mt-6 text-sm text-current/55">
                          {item.note}
                        </p>
                      ) : null}

                      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <PhoneButton />
                        <a
                          href="#suchauftrag"
                          className={buttonVariants({
                            variant: "outline",
                            size: "lg",
                          })}
                        >
                          Gerät anfragen
                        </a>
                      </div>
                      <p className="mt-5 text-sm text-current/60">
                        Probefahrt vor Ort in Neuenstadt am Kocher, nach kurzer
                        Absprache am Telefon
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            /* Leerer Bestand: ehrlicher Anfrage-Weg statt Platzhalter-Produkten */
            <Reveal delay={60}>
              <div className="mt-14 rounded-lg border border-silver/15 lift-lg bg-ink p-8 md:p-12 text-silver on-dark">
                <PhoneCall
                  aria-hidden="true"
                  className="size-8 text-current/45"
                  strokeWidth={1.5}
                />
                <h3 className="mt-6 text-[length:var(--text-title)]">
                  Der Bestand steht nicht online, sondern in der Werkstatt.
                </h3>
                <p className="mt-5 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-current/70">
                  Weil jedes Gerät ein Einzelstück ist und oft schon verkauft
                  ist, bevor eine Online-Liste aktualisiert wäre, läuft der
                  Verkauf über ein kurzes Gespräch. Rufen Sie an oder schreiben
                  Sie uns, was Sie suchen. Wir sagen Ihnen ehrlich, ob wir
                  gerade etwas Passendes haben oder wann wieder etwas
                  hereinkommt.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <PhoneButton />
                  <a
                    href="#suchauftrag"
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })}
                  >
                    Suchauftrag hinterlegen
                  </a>
                </div>
              </div>
            </Reveal>
          )}
        </Container>
      </Section>

      {/* Suchauftrag */}
      <Section id="suchauftrag" tone="ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow text-current/65">Suchauftrag</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  Sagen Sie uns, was Sie suchen.
                </h2>
                <p className="mt-6 leading-relaxed text-current/65">
                  Budget, gewünschte Reichweite, Einsatzzweck: Arbeitsweg,
                  Freizeit, Zweitgerät. Wir melden uns, sobald ein passender
                  Scooter geprüft und freigegeben ist.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={80}>
                <InquiryForm topics={BUY_TOPICS} />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Testimonials />

      <Section tone="silver-200">
        <Container>
          <SectionHead
            eyebrow="Häufige Fragen zum Kauf"
            title={
              <>
                Siegel, <Mark>Gewährleistung</Mark>, Service danach.
              </>
            }
            lead="Was ein geprüfter Gebrauchtkauf konkret bedeutet, und was passiert, wenn nach dem Kauf doch etwas ist."
          />
          <Faq items={faqBuy} className="mt-14" />
        </Container>
      </Section>

      <Related
        items={[
          {
            href: "/versicherung",
            label: "Versicherungskennzeichen",
            text: "Ohne Haftpflicht darf kein E-Scooter über 6 km/h auf die Straße. Wir vermitteln sie über ERGO.",
          },
          {
            href: "/wartungsvertrag",
            label: "Wartungsvertrag",
            text: "Damit das gekaufte Gerät jährlich durch dieselbe Werkstatt geht, die es freigegeben hat.",
          },
        ]}
      />

      <CtaBand
        eyebrow="Kauf"
        title={
          <>
            <Mark>Probefahren</Mark> geht am besten vor Ort.
          </>
        }
        text="Im Kampfrad 3 in Neuenstadt am Kocher. Kurz anrufen, dann steht der passende Scooter bereit, wenn Sie kommen."
      />

      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "E-Scooter kaufen", path: "/e-scooter" }]),
          refurbishedService(),
          ...inventoryProducts(),
          faqPage(faqBuy, "/e-scooter"),
          ...reviews("/e-scooter"),
        ])}
      />
    </>
  );
}
