import { Check } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { plans } from "@/lib/data/plans";
import { priceNote } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/ui/mark";

export function Plans({ withHead = true }: { withHead?: boolean }) {
  return (
    <Section id="wartungsvertrag" tone="silver">
      <Container>
        {withHead ? (
          <SectionHead
            eyebrow="Wartungsverträge"
            title={
              <>
                Zwei Verträge. <Mark>Einer</Mark> davon passt.
              </>
            }
            lead="Verschleiß an Bremsen, Lagern und Klappmechanik kündigt sich an, bevor er zum Ausfall führt, wenn jemand danach sucht. Der Unterschied zwischen den beiden Verträgen ist nicht der Prüfumfang, sondern wie schnell Sie drankommen."
          />
        ) : null}

        <div
          className={cn(
            "grid gap-6 lg:grid-cols-2 lg:gap-8",
            withHead && "mt-16",
          )}
        >
          {plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 90} className="h-full">
              <article
                className={cn(
                  "relative flex h-full flex-col rounded-xl border p-8 md:p-10",
                  /* Der empfohlene Vertrag ist die dunkle Karte, nicht die
                     helle. Vorher war es umgekehrt: der Standardvertrag stand
                     schwarz und massiv, der empfohlene blass daneben – die
                     Fläche widersprach der Empfehlung. Sie ist zugleich das
                     eigentliche Kennzeichen: Von zwei Karten trägt eine die
                     satte Fläche, und das sieht man vor jeder Beschriftung. */
                  plan.popular
                    ? "lift-lg border-transparent bg-ink text-silver on-dark"
                    : "border-current/12 bg-silver-200",
                )}
              >
                {/* Die Zahlungsweise als Kopfzeile beider Karten – dadurch
                    beginnen Basis und Premium auf derselben Linie. */}
                <p className="eyebrow text-[0.6875rem] text-current/70">
                  {plan.paymentType}
                </p>

                {/* Die Empfehlung gehört an den Namen, nicht an den Rand.
                    Sie hing zweimal falsch: erst als neongrünes Schildchen
                    halb über der oberen Kante, dann als Zeile schräg
                    gegenüber der Zahlungsweise – beide Male ohne Bezug zu
                    dem, was sie empfiehlt. „Empfohlen" ist eine Aussage über
                    genau diesen Vertrag, also steht sie neben seinem Namen.

                    Fläche statt Vollneon: Neon markiert auf dieser Seite die
                    Handlung und die harte Zahl, hier stehen Knopf und Preis
                    schon darin. Der Punkt reicht als Signal, es ist derselbe
                    wie im Kopfbereich der Startseite. */}
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
                  <h3 className="font-display text-2xl font-bold tracking-tight">
                    {plan.name}
                  </h3>
                  {plan.popular ? (
                    <p className="inline-flex items-center gap-2 rounded-full bg-current/10 py-1.5 pr-4 pl-3 font-display text-xs font-semibold tracking-tight">
                      <span
                        aria-hidden="true"
                        className="size-2 shrink-0 rounded-full bg-neon"
                      />
                      Empfohlen für Vielfahrer
                    </p>
                  ) : null}
                </div>

                <p className="mt-3 text-[length:var(--text-lead)] text-current/70">
                  {plan.claim}
                </p>

                <div className="mt-8 flex items-end gap-3 border-b border-current/10 pb-8">
                  <span className="tabular font-display text-[length:var(--text-stat)] leading-[0.9] font-bold tracking-tight text-accent">
                    {plan.price}
                  </span>
                  <span className="pb-1.5 font-display text-lg font-semibold text-current/75">
                    € {plan.period}
                  </span>
                </div>

                {plan.yearlyTotal || plan.minDuration ? (
                  <p className="mt-4 text-sm text-current/70">
                    {[plan.yearlyTotal, plan.minDuration]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                ) : null}

                <p className="mt-4 leading-relaxed text-current/70">
                  {plan.description}
                </p>

                <ul className="mt-8 flex flex-col gap-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3.5">
                      <Check
                        aria-hidden="true"
                        className={cn(
                          "mt-1 size-4 shrink-0",
                          plan.popular ? "text-accent" : "text-current/75",
                        )}
                      />
                      <span className="text-current/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* `mt-auto` allein reichte nicht: Auf der höheren Karte
                    bleibt nichts zu verteilen, dort stand der Knopf direkt
                    unter dem letzten Häkchen und las sich als sechster
                    Listenpunkt. `pt-12` ist der Mindestabstand, den
                    `mt-auto` nicht wegkürzen kann. */}
                <div className="mt-12 pt-2 lg:mt-auto lg:pt-12">
                  <ButtonLink
                    // Anker mit: Ohne ihn landet der Nutzer oben auf der
                    // Kontaktseite und sieht von seiner Vorauswahl nichts.
                    href={`/kontakt?anliegen=wartungsvertrag-${plan.id}#anfrage`}
                    size="lg"
                    variant={plan.popular ? "neon" : "outline"}
                    className="w-full"
                  >
                    {plan.name} anfragen
                  </ButtonLink>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={60}>
          <p className="mt-8 text-sm text-current/70">{priceNote}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
