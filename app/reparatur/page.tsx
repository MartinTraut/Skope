import type { Metadata } from "next";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Region } from "@/components/sections/region";
import { Faq } from "@/components/ui/faq";
import { PageHeader } from "@/components/ui/page-header";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { faqRepair } from "@/lib/data/faq";
import {
  brands,
  priceAnchors,
  repairAreas,
  turnaround,
} from "@/lib/data/services";
import { JsonLd, breadcrumb, faqPage, pageGraph, service } from "@/lib/schema";
import { REPAIR_TOPICS } from "@/lib/data/topics";
import { pageMeta } from "@/lib/seo";
import { priceNote } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter Reparatur Heilbronn & Neuenstadt",
  description:
    "E-Scooter Reparatur für Heilbronn und Neckarsulm: Akku, Elektronik, Bremsen, Motor. Alle Marken, Kostenvoranschlag vorab, Bremsen oft am selben Tag.",
  path: "/reparatur",
  image: "/img/akku-diagnose.jpg",
  imageAlt:
    "Kapazitätsmessung an einem geöffneten E-Scooter-Akku auf der Werkbank",
});

const steps = [
  {
    n: "01",
    title: "Sie beschreiben das Symptom",
    text: "Am Telefon oder über das Formular. Fehlermeldung, Geräusch, Reichweite, seit wann — je konkreter, desto schneller die Einschätzung.",
  },
  {
    n: "02",
    title: "Wir messen, statt zu raten",
    text: "Fehlerspeicher auslesen, Restkapazität des Akkus messen, Bauteile einzeln prüfen. Erst danach steht fest, was tatsächlich defekt ist.",
  },
  {
    n: "03",
    title: "Kostenvoranschlag vor der Arbeit",
    text: "Sie bekommen den Preis, bevor etwas geöffnet oder getauscht wird. Was Sie nicht freigeben, passiert nicht.",
  },
  {
    n: "04",
    title: "Reparatur und Sicherheitsfreigabe",
    text: "Nach der Reparatur läuft die vollständige Funktionsprüfung. Der Scooter geht nur fahrbereit und sicher wieder raus.",
  },
];

export default function RepairPage() {
  return (
    <>
      <PageHeader
        crumb="Reparatur"
        eyebrow="Werkstatt für Elektrokleinstfahrzeuge"
        title={
          <>
            E-Scooter Reparatur
            <br />
            in Neuenstadt am Kocher.
          </>
        }
        lead="Ein defekter E-Scooter ist selten ein Totalschaden. In den meisten Fällen sind es Bremsen, Reifen, ein einzelner Sensor oder eine schwache Zelle im Akku — alles reparierbar, zu einem Bruchteil des Neupreises."
        aside={
          <dl className="grid grid-cols-2 gap-6 border-t border-white/12 pt-6">
            <div>
              <dt className="text-sm text-paper/50">Reparierte Scooter</dt>
              <dd className="tabular font-display text-3xl font-extrabold tracking-tight text-flame">
                500+
              </dd>
            </div>
            <div>
              <dt className="text-sm text-paper/50">Diagnose im Checkup</dt>
              <dd className="tabular font-display text-3xl font-extrabold tracking-tight">
                59,99 €
              </dd>
            </div>
          </dl>
        }
      />

      {/* Kompetenzfelder */}
      <Section tone="ink-800">
        <Container>
          <SectionHead
            eyebrow="Was wir reparieren"
            title="Vier Bereiche, in denen fast jeder Defekt liegt."
            lead="Vom ausgelesenen Fehlercode bis zum überholten Nabenmotor: Wir arbeiten am Bauteil, nicht am Austauschgerät."
          />

          <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
            {repairAreas.map((area, i) => (
              <Reveal key={area.slug} delay={(i % 2) * 80} as="article">
                <div className="flex h-full flex-col border-t border-white/12 pt-7">
                  <p className="tabular font-display text-sm font-semibold text-current/40">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-[length:var(--text-title)]">
                    {area.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-paper/60">
                    {area.description}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {area.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-xs border border-white/15 px-3 py-1.5 text-sm text-paper/70"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Ablauf + Preisanker */}
      <Section tone="paper">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow text-current/55">So läuft es ab</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  Vier Schritte,
                  <br />
                  keine Überraschungen.
                </h2>
              </Reveal>

              <ol className="mt-12">
                {steps.map((step, i) => (
                  <Reveal key={step.n} delay={i * 70} as="li">
                    <div className="flex gap-6 border-t border-ink/12 py-7 md:gap-10">
                      <span className="tabular font-display text-lg font-bold text-current/40">
                        {step.n}
                      </span>
                      <div>
                        <h3 className="font-display text-xl font-bold tracking-tight">
                          {step.title}
                        </h3>
                        <p className="mt-2.5 max-w-xl leading-relaxed text-ink/65">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={90}>
                <div className="rounded-lg border border-ink/15 bg-paper-200/70 p-8">
                  <h3 className="font-display text-xl font-bold tracking-tight">
                    Preisanker
                  </h3>
                  <p className="mt-2 text-sm text-ink/65">
                    Richtwerte aus dem Werkstattalltag — verbindlich wird immer
                    erst der Kostenvoranschlag.
                  </p>
                  <dl className="mt-7">
                    {priceAnchors.map((row) => (
                      <div
                        key={row.label}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-ink/12 py-3.5"
                      >
                        <dt className="text-ink/75">{row.label}</dt>
                        <dd
                          className={
                            row.lead
                              ? "tabular font-display text-lg font-extrabold tracking-tight text-flame-600"
                              : "tabular font-display font-semibold tracking-tight"
                          }
                        >
                          {row.price}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-6 border-t border-ink/12 pt-5 text-xs leading-relaxed text-ink/65">
                    {priceNote}
                  </p>
                </div>

                <div className="mt-8 rounded-lg border border-ink/15 p-8">
                  <h3 className="font-display text-xl font-bold tracking-tight">
                    Bearbeitungszeit
                  </h3>
                  <dl className="mt-6">
                    {turnaround.map((row) => (
                      <div
                        key={row.label}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-ink/12 py-3.5"
                      >
                        <dt className="text-ink/75">{row.label}</dt>
                        <dd className="font-display font-semibold tracking-tight">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Marken */}
      <Section tone="ink" className="py-16 md:py-20">
        <Container>
          <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
            <h2 className="shrink-0 font-display text-xs font-semibold tracking-[0.18em] text-paper/60 uppercase">
              Marken, die wir betreuen
            </h2>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {brands.map((brand) => (
                <li
                  key={brand}
                  className="font-display text-lg font-semibold tracking-tight text-paper/55"
                >
                  {brand}
                </li>
              ))}
              <li className="text-sm text-paper/60">
                … und weitere, auch exotische Modelle
              </li>
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* Anfrage */}
      <Section id="anfrage" tone="ink-800">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow text-current/55">Reparatur anfragen</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  Beschreiben Sie,
                  <br />
                  was der Scooter macht.
                </h2>
                <p className="mt-6 leading-relaxed text-paper/65">
                  Wir melden uns schnellstmöglich mit einer ersten Einschätzung
                  und einem Kostenvoranschlag. Wenn es schnell gehen muss:
                  einfach anrufen.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={80}>
                <InquiryForm
                  topics={REPAIR_TOPICS}
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="ink">
        <Container>
          <SectionHead
            eyebrow="Häufige Fragen zur Reparatur"
            title="Was Kunden vor dem Werkstatttermin fragen."
            lead="Marken, Kosten, Dauer und die Frage, die am häufigsten kommt: Lohnt sich das überhaupt noch?"
          />
          <Faq items={faqRepair} className="mt-14" />
        </Container>
      </Section>

      <Region />
      <CtaBand
        eyebrow="Werkstatttermin"
        title="Bringen Sie den Scooter vorbei."
        text="Im Kampfrad 3 in Neuenstadt am Kocher. Aus Heilbronn sind es 15 Kilometer, aus Bad Friedrichshall acht. Ein Anruf vorher spart Wartezeit."
      />

      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "Reparatur", path: "/reparatur" }]),
          service({
            name: "E-Scooter Reparatur und Werkstattservice",
            description:
              "Elektronik-Diagnose, Akku-Service mit Kapazitätsmessung, mechanische Instandsetzung und Motor-Reparatur für alle gängigen E-Scooter Marken.",
            path: "/reparatur",
            serviceType: "E-Scooter Reparatur",
            offers: [
              {
                name: "Sicherheits-Checkup",
                price: "59.99",
                description:
                  "Bremsen einstellen, Reifendruck und Profil prüfen, Schrauben nachziehen, Akku-Diagnose, Elektronik-Prüfung, Verschleißteil-Kontrolle mit Protokoll.",
              },
              { name: "Bremsbeläge ersetzen", price: "15.00" },
              { name: "Reifenwechsel", price: "25.00" },
              { name: "Elektronik-Reparatur", price: "40.00" },
            ],
          }),
          faqPage(faqRepair, "/reparatur"),
        ])}
      />
    </>
  );
}
