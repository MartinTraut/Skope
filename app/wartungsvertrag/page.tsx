import type { Metadata } from "next";

import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Plans } from "@/components/sections/plans";
import { Faq } from "@/components/ui/faq";
import { PageHeader } from "@/components/ui/page-header";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { faqPlans } from "@/lib/data/faq";
import { planExclusions, plans } from "@/lib/data/plans";
import { JsonLd, breadcrumb, faqPage, pageGraph, service } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

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
            Wartung, bevor
            <br />
            etwas kaputtgeht.
          </>
        }
        lead="Wer täglich pendelt, merkt einen Defekt meistens genau dann, wenn er losfahren will. Ein Wartungsvertrag verschiebt diesen Moment nach vorn — in die Werkstatt, zu einem geplanten Termin."
      />

      {/* Rechenbeispiel — die härteste Kaufentscheidungs-Hilfe zuerst */}
      <Section tone="paper" className="py-14 md:py-16">
        <Container>
          {/* Einspaltig: eine 5/7-Teilung mit zwei Zeilen links erzeugt nur Leerraum */}
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-current/55">Rechenbeispiel</p>
            <h2 className="mt-4 text-[length:var(--text-title)]">
              Wann sich Premium rechnet
            </h2>
            <div className="mt-5">
              <p className="text-[length:var(--text-lead)] leading-relaxed text-ink/70">
                Ein einzelner Sicherheits-Checkup kostet{" "}
                <strong className="font-semibold text-ink">59,99 €</strong>. Im
                Premium-Vertrag für 17,99 € im Monat ist er enthalten — zusammen
                mit Akku-Deep-Check, 20 % Ersatzteil-Rabatt und Express-Reparatur
                innerhalb von 24 Stunden. Ab dem zweiten Checkup oder der ersten
                Abholung im 15-km-Umkreis liegen Sie günstiger.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Plans />

      {/* Ausschlüsse — Ehrlichkeit ist hier das Verkaufsargument */}
      <Section tone="ink-800" className="py-16 md:py-20">
        <Container>
          <Reveal className="grid gap-8 border-t border-white/12 pt-10 lg:grid-cols-12 lg:gap-16">
            <h2 className="font-display text-xs font-semibold tracking-[0.18em] text-paper/60 uppercase lg:col-span-4">
              Was nicht abgedeckt ist
            </h2>
            <p className="leading-relaxed text-paper/65 lg:col-span-8">
              {planExclusions}
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section tone="ink">
        <Container>
          <SectionHead
            eyebrow="Häufige Fragen zum Wartungsvertrag"
            title="Was im Vertrag steht — und was nicht."
            lead="Umfang, Ersatzteile, Ort der Wartung und die Frage, welcher der beiden Verträge zu welchem Fahrprofil passt."
          />
          <Faq items={faqPlans} className="mt-14" />
        </Container>
      </Section>

      <CtaBand
        eyebrow="Vertrag abschließen"
        title="Kurz durchsprechen, dann steht es."
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
            // sichtbaren Karten — sonst laufen Anzeige und Schema auseinander,
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
