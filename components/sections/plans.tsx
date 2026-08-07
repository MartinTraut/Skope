import { Check } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { plans } from "@/lib/data/plans";
import { priceNote } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Plans({ withHead = true }: { withHead?: boolean }) {
  return (
    <Section id="wartungsvertrag" tone="ink">
      <Container>
        {withHead ? (
          <SectionHead
            eyebrow="Wartungsverträge"
            title={
              <>
                Zwei Verträge.
                <br />
                Einer davon passt.
              </>
            }
            lead="Verschleiß an Bremsen, Lagern und Klappmechanik kündigt sich an, bevor er zum Ausfall führt — wenn jemand danach sucht. Der Unterschied zwischen den beiden Verträgen ist nicht der Prüfumfang, sondern wie schnell Sie drankommen."
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
                  "relative flex h-full flex-col rounded-lg border p-8 md:p-10",
                  plan.popular
                    ? "border-flame/45 bg-[linear-gradient(160deg,rgba(240,132,43,0.09),transparent_55%)]"
                    : "border-white/12 bg-ink-800",
                )}
              >
                {plan.popular ? (
                  <span className="absolute -top-3 left-8 rounded-xs bg-flame px-3 py-1 font-display text-[0.6875rem] font-bold tracking-[0.12em] text-ink uppercase">
                    Für Pendler
                  </span>
                ) : null}

                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl font-bold tracking-tight">
                    {plan.name}
                  </h3>
                  <span className="text-xs tracking-wide text-paper/60 uppercase">
                    {plan.paymentType}
                  </span>
                </div>

                <p className="mt-3 text-[length:var(--text-lead)] text-paper/70">
                  {plan.claim}
                </p>

                <div className="mt-8 flex items-end gap-3 border-b border-white/10 pb-8">
                  <span className="tabular font-display text-[length:var(--text-stat)] leading-[0.9] font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="pb-1.5 font-display text-lg font-semibold text-paper/75">
                    € {plan.period}
                  </span>
                </div>

                {plan.yearlyTotal || plan.minDuration ? (
                  <p className="mt-4 text-sm text-paper/60">
                    {[plan.yearlyTotal, plan.minDuration]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                ) : null}

                <p className="mt-4 leading-relaxed text-paper/60">
                  {plan.description}
                </p>

                <ul className="mt-8 flex flex-col gap-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3.5">
                      <Check
                        aria-hidden="true"
                        className={cn(
                          "mt-1 size-4 shrink-0",
                          plan.popular ? "text-flame" : "text-petrol-400",
                        )}
                      />
                      <span className="text-paper/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 pt-2 lg:mt-auto">
                  <ButtonLink
                    // Anker mit: Ohne ihn landet der Nutzer oben auf der
                    // Kontaktseite und sieht von seiner Vorauswahl nichts.
                    href={`/kontakt?anliegen=wartungsvertrag-${plan.id}#anfrage`}
                    size="lg"
                    variant={plan.popular ? "flame" : "outline"}
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
          <p className="mt-8 text-sm text-paper/60">{priceNote}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
