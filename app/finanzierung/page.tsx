import type { Metadata } from "next";
import { Check, Clock } from "lucide-react";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Related } from "@/components/sections/related";
import { ButtonLink } from "@/components/ui/button";
import { FaqSection } from "@/components/ui/faq";
import { Mark } from "@/components/ui/mark";
import { PageHeader } from "@/components/ui/page-header";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { faqFinancing } from "@/lib/data/faq";
import { financingModels, financingTerms } from "@/lib/data/financing";
import { JsonLd, breadcrumb, faqPage, pageGraph, service } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter finanzieren: Mietkauf-Abo und Ratenkauf",
  description:
    "E-Scooter, E-Chopper und E-Trike in Raten zahlen: Mietkauf-Abo über 24 oder 36 Monate mit Versicherung und Service in der Rate, oder Ratenkauf mit Anzahlung und SEPA-Lastschrift. Beratung in Neuenstadt am Kocher.",
  path: "/finanzierung",
});

/* Keine Beispielrate, nirgends auf dieser Seite – die Begründung steht in
   `lib/data/financing.ts`. Wer hier später eine Zahl einträgt, trägt damit
   auch den effektiven Jahreszins und die übrigen Pflichtangaben nach § 16
   PAngV ein. */
export default function FinancingPage() {
  const available = financingModels.filter((model) => model.available);
  const planned = financingModels.filter((model) => !model.available);

  return (
    <>
      <PageHeader
        crumb="Finanzierung"
        eyebrow="Zahlung & Finanzierung"
        title={
          <>
            Den Kaufpreis <Mark>verteilen</Mark>, statt ihn aufzuschieben.
          </>
        }
        lead="Nicht jeder will oder kann ein Fahrzeug auf einmal bezahlen. Dafür gibt es zwei Wege: das Mietkauf-Abo mit fester Monatsrate, in der Versicherung und Service enthalten sind, und den Ratenkauf mit Anzahlung. Beide gelten für E-Scooter, E-Chopper und E-Trike."
      />

      {/* Die beiden verfügbaren Modelle nebeneinander, nicht untereinander:
          Es ist eine Entscheidung zwischen zweien, und die trifft man im
          Vergleich. Derselbe Aufbau wie bei den Tarifkarten des
          Wartungsvertrags – Name, Kernsatz, Eckdaten als Band, Leistungen,
          Einschränkung, Aktion. */}
      <Section tone="silver">
        <Container>
          <SectionHead
            eyebrow="Zwei Wege"
            title={
              <>
                Planbare Rate oder <Mark>sofortiges</Mark> Eigentum.
              </>
            }
            lead="Der Unterschied liegt nicht im Preis, sondern darin, wann das Fahrzeug Ihnen gehört und was in der monatlichen Rate schon enthalten ist."
          />

          <ul className="mt-14 grid auto-rows-fr gap-6 lg:grid-cols-2">
            {available.map((model, i) => (
              <Reveal key={model.id} delay={i * 80} as="li" className="flex">
                <div className="lift-lg flex w-full flex-col rounded-xl bg-ink p-7 text-silver on-dark md:p-9">
                  <h2 className="font-display text-[length:var(--text-subtitle)] leading-tight font-bold tracking-tight">
                    {model.name}
                  </h2>
                  <p className="mt-3 font-display text-[length:var(--text-lead)] leading-snug font-semibold tracking-tight text-accent">
                    {model.claim}
                  </p>
                  <p className="mt-5 leading-relaxed text-silver/75">
                    {model.description}
                  </p>

                  {/* Die Eckdaten als Band mit Haarlinien, wie im Bestand:
                      Es sind die drei Angaben, die zwischen den Modellen
                      tatsächlich verglichen werden. Am Telefon untereinander
                      als Zeilen mit zwei Enden – drei Spalten wären dort je
                      rund 90 px breit, und „monatlich per SEPA-Lastschrift"
                      stünde über vier Zeilen. */}
                  <dl className="mt-7 grid border-y border-silver/12 sm:grid-cols-3 sm:divide-x sm:divide-silver/12">
                    {model.facts.map((fact) => (
                      <div
                        key={fact.label}
                        className="flex min-w-0 items-baseline justify-between gap-3 border-b border-silver/12 py-3 last:border-b-0 sm:block sm:border-b-0 sm:px-4 sm:py-4 sm:first:pl-0 sm:last:pr-0"
                      >
                        <dt className="eyebrow-plain shrink-0 text-silver/55">
                          {fact.label}
                        </dt>
                        <dd className="min-w-0 text-right font-display leading-snug font-semibold tracking-tight text-balance sm:mt-2 sm:text-left">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="mt-7 grid gap-3">
                    {model.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-neon"
                        >
                          <Check className="size-3 text-ink" strokeWidth={3.5} />
                        </span>
                        <span className="text-silver/85">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Was nicht enthalten ist, steht in derselben Liste und
                      nicht im Kleingedruckten – nur mit `×` statt Häkchen und
                      eine Stufe blasser. Dieselbe Lösung wie bei den
                      Ausschlüssen des Wartungsvertrags.

                      Ohne diese Zeilen stehen zwei Karten nebeneinander, von
                      denen die eine vier Häkchen hat und die andere vier: Der
                      Unterschied zwischen den Modellen ist aber gar nicht die
                      Anzahl der Leistungen, sondern wer ab der Übergabe
                      Anmeldung, Versicherung und Wartung trägt. */}
                  {model.excludes ? (
                    <ul className="mt-3 grid gap-3">
                      {model.excludes.map((entry) => (
                        <li key={entry} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-silver/25 text-[0.6875rem] leading-none font-bold text-silver/60"
                          >
                            ×
                          </span>
                          <span className="text-silver/60">
                            <span className="sr-only">Nicht enthalten: </span>
                            {entry}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {model.note ? (
                    <p className="mt-6 text-sm leading-relaxed text-silver/60">
                      {model.note}
                    </p>
                  ) : null}

                  {/* `mt-auto`, damit beide Knöpfe auf einer Linie stehen,
                      auch wenn der eine Block eine Zeile länger ist. */}
                  <div className="mt-auto pt-8">
                    <ButtonLink
                      href={`/finanzierung?anliegen=finanzierung-${model.id}#anfrage`}
                      size="lg"
                      variant={model.id === "mietkauf" ? "neon" : "outline"}
                      className="w-full"
                    >
                      {model.name} anfragen
                    </ButtonLink>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          {/* Was für beide Modelle gilt – und der Satz, der sagt, warum auf
              dieser Seite keine einzige Beispielrate steht. */}
          <Reveal delay={160}>
            <div className="mt-12 grid gap-8 border-t border-current/12 pt-10 lg:grid-cols-12 lg:gap-16">
              <h2 className="text-[length:var(--text-title)] lg:col-span-4">
                Für beide Modelle gilt
              </h2>
              <div className="lg:col-span-8">
                <p className="text-[length:var(--text-lead)] leading-relaxed">
                  {financingTerms.intro}
                </p>
                <ul className="mt-5">
                  {financingTerms.items.map((entry) => (
                    <li
                      key={entry}
                      className="flex items-start gap-3 border-b border-current/12 py-3 leading-relaxed first:border-t"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-current/40"
                      />
                      {entry}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Das geplante Modell steht sichtbar, aber ohne Anfrage: Ein Knopf an
          einem Angebot, das es noch nicht gibt, ist eine Zusage. Deshalb auch
          eine andere Fläche und ein anderes Zeichen als bei den beiden
          darüber – man soll den Unterschied sehen, bevor man liest. */}
      {planned.map((model) => (
        <Section key={model.id} tone="silver-200" space="tight">
          <Container>
            <Reveal className="flex max-w-3xl items-start gap-5 border-t border-current/12 pt-10">
              <span
                aria-hidden="true"
                className="mt-1 grid size-10 shrink-0 place-items-center rounded-full border border-current/20"
              >
                <Clock className="size-4" />
              </span>
              <div>
                <p className="eyebrow text-current/90">{model.claim}</p>
                <h2 className="mt-3 text-[length:var(--text-title)]">
                  {model.name}
                </h2>
                <p className="mt-4 leading-relaxed text-current/70">
                  {model.description}
                </p>
              </div>
            </Reveal>
          </Container>
        </Section>
      ))}

      <Section tone="ink">
        <FaqSection
          eyebrow="Häufige Fragen zur Finanzierung"
          title={
            <>
              Was feststeht und was im <Mark>Angebot</Mark> steht.
            </>
          }
          lead="Laufzeiten, Übernahme, Bonität und der Unterschied zwischen Abo und Ratenkauf."
          items={faqFinancing}
          mobileMax={4}
          more={
            <>Die übrigen Fragen beantworten wir in der Beratung.</>
          }
        />
      </Section>

      <Section tone="silver">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow text-current/90">Finanzierung anfragen</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  Sagen Sie uns, welches <Mark>Fahrzeug</Mark> es sein soll.
                </h2>
                <p className="mt-6 leading-relaxed text-current/65">
                  Mit dem Fahrzeug und der gewünschten Laufzeit rechnen wir
                  Ihnen die Rate aus und schicken Ihnen das Angebot
                  schriftlich. Erst danach entscheiden Sie.
                </p>
              </Reveal>
            </div>
            <div id="anfrage" className="scroll-mt-32 lg:col-span-7">
              <Reveal delay={80}>
                {/* `topicFromQuery`: Die Wahl auf den beiden Karten steht in
                    der Adresse und wird hier gelesen – dieselbe Mechanik wie
                    beim Wartungsvertrag. Ohne Wahl bleibt das Feld leer und
                    ist Pflicht. */}
                <InquiryForm topicFromQuery />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Related
        tone="silver-200"
        items={[
          {
            href: "/e-scooter",
            label: "Geprüfte E-Scooter",
            text: "Welche Geräte gerade da sind, mit Fotos, Messwerten und Preis.",
          },
          {
            href: "/versicherung",
            label: "Versicherungskennzeichen",
            text: "Wer kauft statt least, braucht das Kennzeichen separat – wir vermitteln es über die ERGO.",
          },
        ]}
      />

      <CtaBand
        formHref="#anfrage"
        eyebrow="Nächster Schritt"
        title={
          <>
            Welches Modell passt, klären wir <Mark>vorher</Mark>.
          </>
        }
        text="Sagen Sie uns, welches Fahrzeug Sie im Auge haben und über welchen Zeitraum Sie zahlen wollen. Rate, Laufzeit und Gesamtbetrag stehen dann vollständig in Ihrem Angebot."
      />

      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "Finanzierung", path: "/finanzierung" }]),
          /* Kein `offers`: Ein Offer ohne Preis ist kein Angebot, und einen
             Preis gibt es hier nicht – er hängt am Fahrzeug. Der Service
             beschreibt deshalb nur, was es gibt. */
          service({
            name: "Finanzierung und Mietkauf für E-Scooter",
            description:
              "Mietkauf-Abo über 24 oder 36 Monate mit Anmeldung, Haftpflicht- und Vollkaskoversicherung sowie Service in der Monatsrate, Übernahme zu 20 % des Neupreises. Alternativ Ratenkauf mit Anzahlung und monatlichen Raten per SEPA-Lastschrift, Eigentumsübergang mit der letzten Rate.",
            path: "/finanzierung",
            serviceType: "Finanzierung",
          }),
          faqPage(faqFinancing, "/finanzierung"),
        ])}
      />
    </>
  );
}
