import type { Metadata } from "next";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Plans } from "@/components/sections/plans";
import { Related } from "@/components/sections/related";
import { Faq } from "@/components/ui/faq";
import { PageHeader } from "@/components/ui/page-header";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { faqPlans } from "@/lib/data/faq";
import { planExclusions, plans } from "@/lib/data/plans";
import { JsonLd, breadcrumb, faqPage, pageGraph, service } from "@/lib/schema";
import { PLAN_TOPICS } from "@/lib/data/topics";
import { pageMeta } from "@/lib/seo";
import { Mark } from "@/components/ui/mark";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter Wartungsvertrag ab 17,99 € im Monat",
  description:
    "Wartungsvertrag für E-Scooter: Basis 130 € im Jahr, Premium 17,99 € im Monat mit Akku-Deep-Check, Express-Reparatur und Hol- und Bringservice bis 15 km.",
  path: "/wartungsvertrag",
  image: "/img/werkstatt-service.jpg",
  imageAlt: "Wartung an einem E-Scooter in der Werkstatt Neuenstadt am Kocher",
});

export default function PlansPage() {
  return (
    <>
      <PageHeader
        crumb="Wartungsvertrag"
        eyebrow="Service-Verträge"
        title={
          <>
            Wartung, <Mark>bevor</Mark> etwas kaputtgeht.
          </>
        }
        lead="Wer täglich pendelt, merkt einen Defekt meistens genau dann, wenn er losfahren will. Ein Wartungsvertrag verschiebt diesen Moment nach vorn, in die Werkstatt, zu einem geplanten Termin."
      />

      {/* Die Entscheidungshilfe zuerst – und zwar die ehrliche: Premium
          amortisiert sich rechnerisch nicht, es kauft Reaktionszeit. */}
      <Section tone="silver-200" className="py-14 md:py-16">
        <Container>
          {/* Einspaltig: eine 5/7-Teilung mit zwei Zeilen links erzeugt nur Leerraum */}
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-current/90">Entscheidungshilfe</p>
            <h2 className="mt-4 text-[length:var(--text-title)]">
              Wofür Sie bei Premium bezahlen
            </h2>
            <div className="mt-5">
              <p className="text-[length:var(--text-lead)] leading-relaxed text-current/70">
                Nicht für die Stückzahl, sondern für die Ausfallzeit. Der
                jährliche Sicherheits-Checkup kostet einzeln{" "}
                <strong className="font-semibold text-ink">59,99 €</strong> und
                ist in beiden Verträgen enthalten. Premium für{" "}
                <strong className="font-semibold text-ink">
                  17,99 € im Monat
                </strong>{" "}
                ergänzt Akku-Deep-Check, 20 % Ersatzteil-Rabatt, Vorrang bei der
                Terminvergabe mit Express-Reparatur innerhalb von 24 Stunden und
                den Hol- und Bringservice im Umkreis von 15 km. Wer den Scooter
                täglich für den Arbeitsweg braucht, zahlt damit für Planbarkeit.
                Wer gelegentlich fährt, fährt mit Basis für 130 € im Jahr
                günstiger.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Plans />

      {/* Ausschlüsse – Ehrlichkeit ist hier das Verkaufsargument */}
      <Section tone="silver" className="py-16 md:py-20">
        <Container>
          <Reveal className="grid gap-8 border-t border-current/12 pt-10 lg:grid-cols-12 lg:gap-16">
            <h2 className="eyebrow-plain text-current/90 lg:col-span-4">
              Was nicht abgedeckt ist
            </h2>
            <p className="leading-relaxed text-current/65 lg:col-span-8">
              {planExclusions}
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section tone="ink">
        <Container>
          <SectionHead
            eyebrow="Häufige Fragen zum Wartungsvertrag"
            title={
              <>
                Was im Vertrag steht und was <Mark>nicht</Mark>.
              </>
            }
            lead="Umfang, Ersatzteile, Ort der Wartung und die Frage, welcher der beiden Verträge zu welchem Fahrprofil passt."
          />
          <Faq items={faqPlans} className="mt-14" />
        </Container>
      </Section>

      {/* Anfrage – bisher zwang diese Seite als einzige Vertragsseite zum
          Seitenwechsel, obwohl die Vorauswahl längst existiert. */}
      <Section id="anfrage" tone="silver">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow text-current/90">Vertrag anfragen</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  Welcher passt, klären wir vorher.
                </h2>
                <p className="mt-6 leading-relaxed text-current/65">
                  Schreiben Sie uns, wie oft Sie fahren und welches Gerät Sie
                  nutzen. Wir sagen Ihnen, welcher der beiden Verträge dazu
                  passt, auch wenn das der günstigere ist.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={80}>
                <InquiryForm topics={PLAN_TOPICS} />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Related
        items={[
          {
            href: "/reparatur",
            label: "Reparatur",
            text: "Was außerhalb der Wartung anfällt, mit Kostenvoranschlag vor jeder Arbeit.",
          },
          {
            href: "/e-scooter",
            label: "Geprüfte E-Scooter",
            text: "Wer hier kauft, bekommt das Gerät Jahre später in derselben Werkstatt gewartet.",
          },
        ]}
      />

      <CtaBand
        eyebrow="Vertrag abschließen"
        title={
          <>
            <Mark>Kurz</Mark> durchsprechen, dann steht es.
          </>
        }
        text="Welcher Vertrag passt, hängt vor allem davon ab, wie oft Sie fahren. Ein Anruf reicht, um das in zwei Minuten zu klären."
      />

      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "Wartungsvertrag", path: "/wartungsvertrag" }]),
          service({
            name: "E-Scooter Wartungsvertrag",
            description:
              "Wartungsverträge für E-Scooter mit jährlichem Sicherheits-Check, Akku-Deep-Check, Ersatzteil-Rabatt und Express-Reparatur. Hol- und Bringservice im Umkreis von 15 km um Neuenstadt am Kocher.",
            path: "/wartungsvertrag",
            serviceType: "E-Scooter Wartung",
            // Preise und Leistungen kommen aus derselben Quelle wie die
            // sichtbaren Karten – sonst laufen Anzeige und Schema auseinander,
            // sobald jemand einen Preis ändert.
            offers: plans.map((plan) => ({
              name: `${plan.name}-Wartungsvertrag`,
              price: plan.priceValue,
              unit: plan.period === "pro Jahr" ? "JAHR" : "MON",
              description: [plan.features.join(", "), plan.minDuration]
                .filter(Boolean)
                .join(". "),
            })),
          }),
          faqPage(faqPlans, "/wartungsvertrag"),
        ])}
      />
    </>
  );
}
