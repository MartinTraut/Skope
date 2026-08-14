import type { Metadata } from "next";
import { FileText } from "lucide-react";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Related } from "@/components/sections/related";
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
import { Mark } from "@/components/ui/mark";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter Versicherung ERGO: Tarife 2026/2027",
  description:
    "E-Scooter Haftpflicht ab 42 € und Teilkasko ab 49 € über unseren Partner ERGO, deutschlandweit. Versicherungskennzeichen in 5 bis 10 Werktagen per Post. Antrag online starten.",
  path: "/versicherung",
  image: "/img/ergo-tarife.jpg",
  imageAlt:
    "Beratung zu den Versicherungsunterlagen am Tresen der Werkstatt in Neuenstadt am Kocher",
});

export default function InsurancePage() {
  return (
    <>
      <PageHeader
        crumb="Versicherung"
        eyebrow="ERGO Partner · deutschlandweit"
        title={
          <>
            E-Scooter <Mark>Versicherung</Mark> mit Kennzeichen per Post.
          </>
        }
        lead="Für jeden E-Scooter mit mehr als 6 km/h Höchstgeschwindigkeit schreibt die Elektrokleinstfahrzeuge-Verordnung eine Haftpflichtversicherung vor. Wir vermitteln sie als ERGO-Partner. Sie müssen dafür nicht in der Region Heilbronn wohnen."
      />

      {/* Tarife */}
      <Section id="tarife" tone="silver">
        <Container>
          <SectionHead
            eyebrow="Saisontarife 2026/2027"
            title={
              <>
                Was die Versicherung <Mark>kostet</Mark>.
              </>
            }
            lead="Der Beitrag hängt vom Versicherungszeitraum ab: Wer mitten in der Saison einsteigt, zahlt für weniger Monate. Die Werte sind Startpreise der günstigsten Risikoklasse."
          />

          {/* Fokussierbare Scroll-Region: Die Tabelle ist auf schmalen Screens
              breiter als der Viewport, und ohne tabIndex kommt man per Tastatur
              nicht an die rechten Spalten (WCAG 2.1.1). */}
          <Reveal
            delay={60}
            className="mt-14 overflow-x-auto"
            role="region"
            aria-label="ERGO Tarife für die Saison 2026/2027"
            tabIndex={0}
          >
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <caption className="sr-only">
                ERGO Tarife für E-Scooter, Saison 2026/2027, nach
                Versicherungszeitraum
              </caption>
              <thead>
                <tr className="border-b border-current/20">
                  <th
                    scope="col"
                    className="py-4 pr-6 font-display text-xs font-semibold tracking-[0.14em] text-current/70 uppercase"
                  >
                    Zeitraum
                  </th>
                  <th
                    scope="col"
                    className="py-4 pr-6 font-display text-xs font-semibold tracking-[0.14em] text-current/70 uppercase"
                  >
                    Haftpflicht
                  </th>
                  <th
                    scope="col"
                    className="py-4 font-display text-xs font-semibold tracking-[0.14em] text-current/70 uppercase"
                  >
                    Teilkasko inkl. Diebstahl
                  </th>
                </tr>
              </thead>
              <tbody>
                {tariffs.map((row) => (
                  <tr key={row.period} className="border-b border-current/10">
                    <th
                      scope="row"
                      className="tabular py-5 pr-6 font-sans font-normal text-current/75"
                    >
                      {row.period}
                    </th>
                    <td className="tabular py-5 pr-6 font-display text-lg font-bold tracking-tight text-ink">
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
            <p className="mt-8 text-xs leading-relaxed text-current/60">
              {tariffDisclaimer}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Ablauf */}
      <Section tone="silver-200">
        <Container>
          <SectionHead
            eyebrow="Vom Antrag zum Kennzeichen"
            title={
              <>
                <Mark>Vier</Mark> Schritte bis zur Plakette.
              </>
            }
            lead="Der gesamte Ablauf dauert in der Regel eine bis zwei Wochen. Der längste Teil davon ist der Postweg der ERGO."
          />

          {/* Vertikale Timeline statt Vierer-Raster: Der Ablauf ist eine Kette
              mit Wartezeit dazwischen, kein Nebeneinander gleichrangiger Punkte. */}
          <ol className="mt-14 max-w-3xl border-l border-silver/20 pl-8 md:pl-12">
            {insuranceSteps.map((step, i) => (
              <Reveal key={step.step} delay={i * 70} as="li">
                <div className="relative pb-10 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 -left-[2.3rem] size-2.5 rounded-full bg-ink/25 md:-left-[3.3rem] text-silver on-dark"
                  />
                  <span className="tabular font-display text-sm font-bold text-current/65">
                    {step.step}
                  </span>
                  <h3 className="mt-1.5 text-[length:var(--text-subtitle)]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 leading-relaxed text-current/65">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={100}>
            <div className="mt-16 rounded-lg border border-silver/15 lift-lg bg-ink p-8 md:p-10 text-silver on-dark">
              <FileText
                aria-hidden="true"
                className="size-7 text-current/45"
                strokeWidth={1.5}
              />
              <h3 className="mt-5 text-[length:var(--text-subtitle)]">
                Diese Angaben brauchen wir für den Antrag
              </h3>
              <ul className="mt-6 grid gap-x-10 md:grid-cols-3">
                {insuranceDocs.map((doc) => (
                  <li
                    key={doc}
                    className="border-t border-silver/12 py-4 text-current/75"
                  >
                    {doc}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-current/65">
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
                <p className="eyebrow text-current/90">Versicherung anfragen</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  Antrag anstoßen.
                </h2>
                <p className="mt-6 leading-relaxed text-current/65">
                  Schreiben Sie uns Marke, Modell und den gewünschten
                  Versicherungszeitraum. Wir melden uns mit dem konkreten
                  Beitrag und den nächsten Schritten. Sensible Daten wie IBAN
                  und Rahmennummer nehmen wir anschließend auf sicherem Weg auf,
                  nicht über dieses Formular.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={80}>
                <InquiryForm topics={INSURANCE_TOPICS} />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="silver">
        <Container>
          <SectionHead
            eyebrow="Häufige Fragen zur Versicherung"
            title={
              <>
                <Mark>Pflicht</Mark>, Preis, Kennzeichen.
              </>
            }
            lead="Die Fragen, die vor jedem Saisonstart kommen, inklusive der wichtigsten: Was passiert, wenn ich ohne Plakette fahre?"
          />
          <Faq items={faqInsurance} className="mt-14" />
        </Container>
      </Section>

      <Related
        items={[
          {
            href: "/e-scooter",
            label: "Geprüfte E-Scooter",
            text: "Vor dem Kennzeichen kommt das Gerät: generalüberholt, mit einem Jahr Gewährleistung.",
          },
          {
            href: "/reparatur",
            label: "Reparatur",
            text: "Rahmennummer nicht auffindbar? Bei einem Werkstatttermin suchen wir sie gemeinsam.",
          },
        ]}
      />

      <CtaBand
        eyebrow="Versicherung"
        title={
          <>
            Kennzeichen <Mark>rechtzeitig</Mark> bestellen.
          </>
        }
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
            // Standort gebunden – genau das steht auch sichtbar im FAQ.
            areaServed: [{ "@type": "Country", name: "Deutschland" }],
            offers: [
              {
                name: "Haftpflichtversicherung E-Scooter (ERGO)",
                price: "42.00",
                unit: "ANN",
                from: true,
                description:
                  "Gesetzlich vorgeschriebene Haftpflicht inklusive Versicherungskennzeichen. Startpreis der günstigsten Risikoklasse für ein volles Versicherungsjahr.",
              },
              {
                name: "Teilkasko inklusive Diebstahlschutz (ERGO)",
                price: "49.00",
                unit: "ANN",
                from: true,
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
