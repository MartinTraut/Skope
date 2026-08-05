import type { Metadata } from "next";
import { FileText } from "lucide-react";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/ui/faq";
import { PageHeader } from "@/components/ui/page-header";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { faqInsurance } from "@/lib/data/faq";
import {
  insuranceDocs,
  insuranceSteps,
  tariffDisclaimer,
  tariffs,
} from "@/lib/data/insurance";
import { JsonLd, breadcrumb, faqPage, pageGraph, service } from "@/lib/schema";
import { INSURANCE_TOPICS } from "@/lib/data/topics";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter Versicherung ERGO — Tarife 2026/2027",
  description:
    "E-Scooter Haftpflicht ab 42 € und Teilkasko ab 49 € über unseren Partner ERGO, deutschlandweit. Versicherungskennzeichen in 5 bis 10 Werktagen per Post.",
  path: "/versicherung",
  image: "/img/ergo-tarife.jpg",
  imageAlt: "Preisaushang der ERGO E-Scooter Tarife für die Saison 2026/2027",
});

export default function InsurancePage() {
  return (
    <>
      <PageHeader
        crumb="Versicherung"
        eyebrow="ERGO Partner · deutschlandweit"
        title={
          <>
            E-Scooter Versicherung
            <br />
            ohne Papierkrieg.
          </>
        }
        lead="Für jeden E-Scooter mit mehr als 6 km/h Höchstgeschwindigkeit schreibt die Elektrokleinstfahrzeuge-Verordnung eine Haftpflichtversicherung vor. Wir vermitteln sie als ERGO-Partner — Sie müssen dafür nicht in der Region Heilbronn wohnen."
      />

      {/* Tarife */}
      <Section id="tarife" tone="ink-800">
        <Container>
          <SectionHead
            eyebrow="Saisontarife 2026/2027"
            title="Was die Versicherung kostet."
            lead="Der Beitrag hängt vom Versicherungszeitraum ab: Wer mitten in der Saison einsteigt, zahlt für weniger Monate. Die Werte sind Startpreise der günstigsten Risikoklasse."
          />

          <Reveal delay={60} className="mt-14 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <caption className="sr-only">
                ERGO Tarife für E-Scooter, Saison 2026/2027, nach
                Versicherungszeitraum
              </caption>
              <thead>
                <tr className="border-b border-white/20">
                  <th
                    scope="col"
                    className="py-4 pr-6 font-display text-xs font-semibold tracking-[0.14em] text-paper/50 uppercase"
                  >
                    Zeitraum
                  </th>
                  <th
                    scope="col"
                    className="py-4 pr-6 font-display text-xs font-semibold tracking-[0.14em] text-paper/50 uppercase"
                  >
                    Haftpflicht
                  </th>
                  <th
                    scope="col"
                    className="py-4 font-display text-xs font-semibold tracking-[0.14em] text-paper/50 uppercase"
                  >
                    Teilkasko inkl. Diebstahl
                  </th>
                </tr>
              </thead>
              <tbody>
                {tariffs.map((row) => (
                  <tr key={row.period} className="border-b border-white/10">
                    <th
                      scope="row"
                      className="tabular py-5 pr-6 font-sans font-normal text-paper/75"
                    >
                      {row.period}
                    </th>
                    <td className="tabular py-5 pr-6 font-display text-lg font-bold tracking-tight text-paper">
                      {row.liability}
                    </td>
                    <td className="tabular py-5 font-display text-lg font-bold tracking-tight">
                      {row.comprehensive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-8 max-w-3xl text-xs leading-relaxed text-paper/60">
              {tariffDisclaimer}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Ablauf */}
      <Section tone="paper">
        <Container>
          <SectionHead
            eyebrow="Vom Antrag zum Kennzeichen"
            title="Vier Schritte bis zur Plakette."
            lead="Der gesamte Ablauf dauert in der Regel eine bis zwei Wochen — der längste Teil davon ist der Postweg der ERGO."
          />

          {/* Vertikale Timeline statt Vierer-Raster: Der Ablauf ist eine Kette
              mit Wartezeit dazwischen, kein Nebeneinander gleichrangiger Punkte. */}
          <ol className="mt-14 max-w-3xl border-l border-ink/20 pl-8 md:pl-12">
            {insuranceSteps.map((step, i) => (
              <Reveal key={step.step} delay={i * 70} as="li">
                <div className="relative pb-10 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 -left-[2.3rem] size-2.5 rounded-full bg-ink/25 md:-left-[3.3rem]"
                  />
                  <span className="tabular font-display text-sm font-bold text-ink/45">
                    {step.step}
                  </span>
                  <h3 className="mt-1.5 font-display text-[clamp(1.25rem,1vw+1rem,1.6rem)] font-bold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 leading-relaxed text-ink/65">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={100}>
            <div className="mt-16 rounded-lg border border-ink/15 bg-paper-200/60 p-8 md:p-10">
              <FileText
                aria-hidden="true"
                className="size-7 text-current/45"
                strokeWidth={1.5}
              />
              <h3 className="mt-5 font-display text-xl font-bold tracking-tight">
                Diese Angaben brauchen wir für den Antrag
              </h3>
              <ul className="mt-6 grid gap-x-10 md:grid-cols-3">
                {insuranceDocs.map((doc) => (
                  <li
                    key={doc}
                    className="border-t border-ink/12 py-4 text-ink/75"
                  >
                    {doc}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-ink/65">
                Die Rahmennummer finden Sie meist am Trittbrett oder an der
                Lenkstange. Wenn Sie sie nicht finden, suchen wir sie bei einem
                Termin in der Werkstatt gemeinsam.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Anfrage */}
      <Section id="anfrage" tone="ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow text-current/55">Versicherung anfragen</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  Antrag anstoßen.
                </h2>
                <p className="mt-6 leading-relaxed text-paper/65">
                  Schreiben Sie uns Marke, Modell und den gewünschten
                  Versicherungszeitraum. Wir melden uns mit dem konkreten Beitrag
                  und den nächsten Schritten — sensible Daten wie IBAN und
                  Rahmennummer nehmen wir anschließend auf sicherem Weg auf,
                  nicht über dieses Formular.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={80}>
                <InquiryForm
                  topics={INSURANCE_TOPICS}
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="ink-800">
        <Container>
          <SectionHead
            eyebrow="Häufige Fragen zur Versicherung"
            title="Pflicht, Preis, Kennzeichen."
            lead="Die Fragen, die vor jedem Saisonstart kommen — inklusive der wichtigsten: Was passiert, wenn ich ohne Plakette fahre?"
          />
          <Faq items={faqInsurance} className="mt-14" />
        </Container>
      </Section>

      <CtaBand
        eyebrow="Versicherung"
        title="Kennzeichen rechtzeitig bestellen."
        text="Zwischen Antrag und Plakette liegen fünf bis zehn Werktage Postweg. Wer zum Saisonstart fahren will, sollte das einplanen."
      />

      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "Versicherung", path: "/versicherung" }]),
          service({
            name: "E-Scooter Versicherung über ERGO",
            description:
              "Vermittlung von Haftpflicht- und Teilkaskoversicherungen für Elektrokleinstfahrzeuge über den Partner ERGO, inklusive Versicherungskennzeichen. Deutschlandweit verfügbar.",
            path: "/versicherung",
            serviceType: "E-Scooter Versicherung",
            // Anders als Reparatur und Verkauf ist die Vermittlung nicht an den
            // Standort gebunden — genau das steht auch sichtbar im FAQ.
            areaServed: [{ "@type": "Country", name: "Deutschland" }],
            offers: [
              {
                name: "Haftpflichtversicherung E-Scooter (ERGO)",
                price: "42.00",
                unit: "ANN",
                description:
                  "Gesetzlich vorgeschriebene Haftpflicht inklusive Versicherungskennzeichen. Startpreis der günstigsten Risikoklasse für ein volles Versicherungsjahr.",
              },
              {
                name: "Teilkasko inklusive Diebstahlschutz (ERGO)",
                price: "49.00",
                unit: "ANN",
                description:
                  "Haftpflicht zuzüglich Teilkasko mit Diebstahlschutz. Startpreis der günstigsten Risikoklasse.",
              },
            ],
          }),
          faqPage(faqInsurance, "/versicherung"),
        ])}
      />
    </>
  );
}
