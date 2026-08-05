import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, PhoneCall } from "lucide-react";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/ui/faq";
import { PageHeader } from "@/components/ui/page-header";
import { PhoneButton } from "@/components/ui/phone-button";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { faqBuy } from "@/lib/data/faq";
import { checkupIncludes } from "@/lib/data/services";
import { inventory } from "@/lib/inventory";
import { JsonLd, breadcrumb, faqPage, pageGraph, refurbishedService, reviews } from "@/lib/schema";
import { BUY_TOPICS } from "@/lib/data/topics";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Refurbished E-Scooter kaufen — geprüft",
  description:
    "Generalüberholte E-Scooter mit Skope-Qualitätssiegel aus der eigenen Werkstatt in Neuenstadt am Kocher. Vollständig geprüft, ein Jahr Gewährleistung.",
  path: "/e-scooter",
  image: "/img/skope-siegel.jpg",
  imageAlt: "Das Skope-Qualitätssiegel für geprüfte generalüberholte E-Scooter",
});

export default function ScooterPage() {
  return (
    <>
      <PageHeader
        crumb="E-Scooter kaufen"
        eyebrow="Refurbished · Skope-Qualitätssiegel"
        title={
          <>
            Gebraucht kaufen,
            <br />
            ohne Restrisiko.
          </>
        }
        lead="Ein gebrauchter E-Scooter aus einem Kleinanzeigenportal ist eine Wette auf den Akku. Bei uns ist er ein Gerät, das eine vollständige Werkstattprüfung hinter sich hat — dokumentiert, mit Siegel und mit einem Jahr Gewährleistung."
      />

      {/* Qualitätssiegel erklären, bevor über Geräte gesprochen wird */}
      <Section tone="ink-800">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-lg border border-white/12 bg-ink">
                <Image
                  src="/img/skope-siegel.jpg"
                  alt="Das Skope-Qualitätssiegel für geprüfte generalüberholte E-Scooter"
                  fill
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <div className="lg:col-span-7">
              <Reveal delay={70}>
                <p className="eyebrow text-current/55">Das Siegel</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  Kein Gerät ohne
                  <br />
                  vollständige Prüfung.
                </h2>
                <p className="mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-paper/70">
                  Das Skope-Qualitätssiegel ist kein Aufkleber, sondern das
                  Protokoll unseres Sicherheits-Checkups. Jeder Scooter durchläuft
                  vor dem Verkauf denselben Prüfumfang, den auch Kundengeräte im
                  Checkup bekommen.
                </p>

                <ul className="mt-9 grid gap-x-10 sm:grid-cols-2">
                  {checkupIncludes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 border-b border-white/10 py-3.5"
                    >
                      <BadgeCheck
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-current/40"
                      />
                      <span className="text-paper/80">{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-7 text-paper/60">
                  Erst wenn alles passt, bekommt das Gerät das Siegel — und Sie
                  ein Jahr Gewährleistung ab Übergabe sowie das gesetzliche
                  14-tägige Widerrufsrecht.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Bestand */}
      <Section id="bestand" tone="paper">
        <Container>
          <SectionHead
            eyebrow="Aktueller Bestand"
            title="Welche Geräte gerade da sind."
            lead="Der Bestand wechselt laufend — jedes Gerät ist ein Einzelstück. Sagen Sie uns, was Sie suchen: Reichweite, Budget, Einsatzzweck. Wir melden uns, sobald ein passender Scooter durch die Werkstatt gegangen ist."
          />

          {inventory.length > 0 ? (
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {inventory.map((item, i) => (
                <Reveal key={item.id} delay={(i % 3) * 80} as="article">
                  <div className="flex h-full flex-col rounded-lg border border-ink/15 bg-paper-200/50 p-6">
                    {item.image ? (
                      <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-sm bg-paper-300">
                        <Image
                          src={item.image}
                          alt={`Generalüberholter ${item.model}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 32vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <h3 className="font-display text-xl font-bold tracking-tight">
                      {item.model}
                    </h3>
                    <dl className="mt-4 flex flex-col gap-2 text-sm">
                      <div className="flex justify-between gap-4 border-t border-ink/12 pt-2">
                        <dt className="text-ink/65">Akku</dt>
                        <dd className="font-medium">{item.batteryHealth}</dd>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-ink/12 pt-2">
                        <dt className="text-ink/65">Reichweite</dt>
                        <dd className="font-medium">{item.range}</dd>
                      </div>
                    </dl>
                    {item.note ? (
                      <p className="mt-4 text-sm text-ink/60">{item.note}</p>
                    ) : null}
                    <p className="tabular mt-6 font-display text-2xl font-extrabold tracking-tight text-flame-600">
                      {item.price}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            /* Leerer Bestand: ehrlicher Anfrage-Weg statt Platzhalter-Produkten */
            <Reveal delay={60}>
              <div className="mt-14 rounded-lg border border-ink/15 bg-paper-200/60 p-8 md:p-12">
                <PhoneCall
                  aria-hidden="true"
                  className="size-8 text-current/45"
                  strokeWidth={1.5}
                />
                <h3 className="mt-6 font-display text-[clamp(1.5rem,1.6vw+1rem,2.25rem)] font-bold tracking-tight">
                  Der Bestand steht nicht online — er steht in der Werkstatt.
                </h3>
                <p className="mt-5 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-ink/70">
                  Weil jedes Gerät ein Einzelstück ist und oft schon verkauft ist,
                  bevor eine Online-Liste aktualisiert wäre, läuft der Verkauf
                  über ein kurzes Gespräch. Rufen Sie an oder schreiben Sie uns,
                  was Sie suchen — wir sagen Ihnen ehrlich, ob wir gerade etwas
                  Passendes haben oder wann wieder etwas hereinkommt.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <PhoneButton />
                  <a
                    href="#suchauftrag"
                    className="inline-flex h-[3.25rem] items-center justify-center rounded-sm border border-ink/25 px-7 font-display font-semibold tracking-tight text-ink transition-colors duration-200 hover:border-ink/60"
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
                <p className="eyebrow text-current/55">Suchauftrag</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  Sagen Sie uns,
                  <br />
                  was Sie suchen.
                </h2>
                <p className="mt-6 leading-relaxed text-paper/65">
                  Budget, gewünschte Reichweite, Einsatzzweck — Arbeitsweg,
                  Freizeit, Zweitgerät. Wir melden uns, sobald ein passender
                  Scooter geprüft und freigegeben ist.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={80}>
                <InquiryForm
                  topics={BUY_TOPICS}
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Testimonials />

      <Section tone="paper">
        <Container>
          <SectionHead
            eyebrow="Häufige Fragen zum Kauf"
            title="Siegel, Gewährleistung, Service danach."
            lead="Was ein geprüfter Gebrauchtkauf konkret bedeutet — und was passiert, wenn nach dem Kauf doch etwas ist."
          />
          <Faq items={faqBuy} className="mt-14" />
        </Container>
      </Section>

      <CtaBand
        eyebrow="Kauf"
        title="Probefahren geht am besten vor Ort."
        text="Im Kampfrad 3 in Neuenstadt am Kocher. Kurz anrufen, dann steht der passende Scooter bereit, wenn Sie kommen."
      />

      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "E-Scooter kaufen", path: "/e-scooter" }]),
          refurbishedService(),
          faqPage(faqBuy, "/e-scooter"),
          ...reviews(),
        ])}
      />
    </>
  );
}
