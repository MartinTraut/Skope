import type { Metadata } from "next";
import { Check, X } from "lucide-react";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Plans } from "@/components/sections/plans";
import { Related } from "@/components/sections/related";
import { FaqSection } from "@/components/ui/faq";
import { PageHeader } from "@/components/ui/page-header";
import { Container, Section } from "@/components/ui/section";
import { faqPlans } from "@/lib/data/faq";
import { planExclusions, plans } from "@/lib/data/plans";
import { JsonLd, breadcrumb, faqPage, pageGraph, service } from "@/lib/schema";
import { PLAN_TOPICS } from "@/lib/data/topics";
import { pageMeta } from "@/lib/seo";
import { Mark } from "@/components/ui/mark";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter Wartungsvertrag ab 17,99 € im Monat",
  description:
    "Wartungsvertrag für E-Scooter: Basis 130 € im Jahr, Premium 17,99 € im Monat mit Akku-Deep-Check, Express-Reparatur und Hol- und Bringservice bis 15 km.",
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
          amortisiert sich rechnerisch nicht, es kauft Reaktionszeit.

          Das stand hier als ein Absatz über neun Zeilen, und darin lagen vier
          Preise, vier Zusatzleistungen und zwei Empfehlungen. Wer die Seite
          überfliegt – und das tut hier jeder, die Tarifkarten kommen direkt
          darunter –, liest davon den ersten Halbsatz. Jetzt trägt jede der
          drei Aussagen ihre eigene Form: der Kernsatz als Lead, die vier
          Zusatzleistungen als Liste, die Empfehlung als abgesetzter Block.
          Kein Wort und keine Zahl ist dabei weggefallen. */}
      <Section tone="silver-200" className="py-14 md:py-16">
        <Container>
          <Reveal className="max-w-4xl">
            <p className="eyebrow text-current/90">Entscheidungshilfe</p>
            <h2 className="mt-4 text-[length:var(--text-title)]">
              Wofür Sie bei <Mark>Premium</Mark> bezahlen
            </h2>

            <p className="mt-5 max-w-2xl text-[length:var(--text-lead)] leading-relaxed">
              Nicht für die Stückzahl, sondern für die Ausfallzeit.
            </p>

            <p className="mt-4 max-w-2xl leading-relaxed text-current/70">
              Der jährliche Sicherheits-Checkup kostet einzeln 59,99&nbsp;€ und
              ist in beiden Verträgen enthalten. Premium für 17,99&nbsp;€ im
              Monat ergänzt vier Dinge:
            </p>

            <ul className="mt-6 grid max-w-3xl gap-x-10 gap-y-4 sm:grid-cols-2">
              {[
                "Akku-Deep-Check",
                "20\u00a0% Rabatt auf Ersatzteile",
                "Express-Reparatur innerhalb von 24 Stunden",
                "Hol- und Bringservice im Umkreis von 15\u00a0km",
              ].map((entry) => (
                <li key={entry} className="flex items-start gap-3">
                  <Check
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-ink"
                    strokeWidth={2.5}
                  />
                  <span className="leading-relaxed">{entry}</span>
                </li>
              ))}
            </ul>

            {/* Die Empfehlung steht auf eigener Fläche, weil sie die einzige
                Stelle ist, an der wir von einem der beiden Verträge abraten.
                Im Fließtext war das der letzte Nebensatz. */}
            <div className="lift mt-8 max-w-3xl rounded-xl bg-silver p-6 md:p-7">
              <dl className="grid gap-6 sm:grid-cols-2 sm:gap-10">
                <div>
                  <dt className="eyebrow-plain text-current/60">
                    Täglich zur Arbeit
                  </dt>
                  <dd className="mt-2 leading-relaxed">
                    <strong className="font-display font-bold tracking-tight">
                      Premium, 17,99&nbsp;€ im Monat.
                    </strong>{" "}
                    Sie zahlen für Planbarkeit, nicht für die Stückzahl der
                    Termine.
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow-plain text-current/60">
                    Gelegentlich unterwegs
                  </dt>
                  <dd className="mt-2 leading-relaxed">
                    <strong className="font-display font-bold tracking-tight">
                      Basis, 130&nbsp;€ im Jahr.
                    </strong>{" "}
                    Günstiger, und der Sicherheits-Checkup ist auch hier drin.
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Plans />

      {/* Ausschlüsse – Ehrlichkeit ist hier das Verkaufsargument */}
      <Section tone="silver" className="py-16 md:py-20">
        <Container>
          {/* Vorher: eine Etikettenzeile in vier Spalten links, ein blasser
              Absatz in acht Spalten rechts – dazwischen eine halbe
              Bildschirmbreite Leere, und die vier Ausschlüsse als Komma-Kette
              mitten im Satz. Das ist der Block, auf den wir uns im Streitfall
              berufen; er darf nicht der unauffälligste der Seite sein.

              Jetzt eine echte Überschrift, die Ausschlüsse als Reihe mit
              eigenem Zeichen und der Ersatzteil-Hinweis abgesetzt darunter.
              Der Wortlaut ist unverändert, nur zerlegt (`planExclusions` in
              `lib/data/plans.ts`). */}
          <Reveal className="grid gap-8 border-t border-current/12 pt-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="eyebrow text-current/90">Grenzen</p>
              <h2 className="mt-4 text-[length:var(--text-title)]">
                Was nicht abgedeckt ist
              </h2>
            </div>

            <div className="lg:col-span-8">
              <p className="text-[length:var(--text-lead)] leading-relaxed">
                {planExclusions.scope}
              </p>
              <p className="mt-5 leading-relaxed text-current/70">
                {planExclusions.intro}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {planExclusions.items.map((entry) => (
                  <li
                    key={entry}
                    className="flex items-center gap-2 rounded-full bg-current/6 px-4 py-2 text-sm font-semibold"
                  >
                    <X
                      aria-hidden="true"
                      className="size-3.5 shrink-0"
                      strokeWidth={3}
                    />
                    {entry}
                  </li>
                ))}
              </ul>
              <p className="mt-6 leading-relaxed text-current/70">
                {planExclusions.note}
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="ink">
        <FaqSection
          eyebrow="Häufige Fragen zum Wartungsvertrag"
          title={
            <>
              Was im Vertrag steht und was <Mark>nicht</Mark>.
            </>
          }
          lead="Umfang, Ersatzteile, Ort der Wartung und die Frage, welcher der beiden Verträge zu welchem Fahrprofil passt."
          items={faqPlans}
        />
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
                  Welcher passt, klären wir <Mark>vorher</Mark>.
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
