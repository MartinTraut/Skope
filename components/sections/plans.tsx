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
                     Fläche widersprach der Empfehlung. Und nur auf Schwarz
                     kann das Kennzeichen „Für Pendler" in vollem Neon stehen;
                     auf der Silberkarte läge es bei 1,2:1. */
                  plan.popular
                    ? "lift-lg border-transparent bg-ink text-silver on-dark"
                    : "border-current/12 bg-silver-200",
                )}
              >
                {plan.popular ? (
                  <span className="absolute -top-3 left-8 rounded-md bg-accent px-3 py-1 font-display text-[0.6875rem] font-bold tracking-[0.12em] uppercase">
                    Für Pendler
                  </span>
                ) : null}

                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl font-bold tracking-tight">
                    {plan.name}
                  </h3>
                  <span className="text-xs tracking-wide text-current/70 uppercase">
                    {plan.paymentType}
                  </span>
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

                <div className="mt-10 pt-2 lg:mt-auto">
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
