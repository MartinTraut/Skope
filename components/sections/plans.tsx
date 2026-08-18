import { Check, Medal } from "lucide-react";

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
            "grid gap-x-6 gap-y-10 lg:grid-cols-2 lg:gap-8",
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
                     satte Fläche, und das sieht man vor jeder Beschriftung.

                     Die helle Karte trägt dafür eine eigene Kante und einen
                     Schatten. Silber-200 auf einer Silber-Sektion sind
                     16 Helligkeitsstufen Unterschied – mit einer Kante bei
                     12 % stand die Karte nicht auf der Fläche, sondern lag
                     als etwas hellerer Fleck darin. */
                  plan.popular
                    ? "lift-lg border-transparent bg-ink text-silver on-dark"
                    : "lift border-ink/15 bg-silver-200",
                )}
              >
                {/* Die Empfehlung als Plakette mittig auf der Oberkante.
                    Neben dem Namen war sie zu leise: eine graue Kapsel in
                    12 px, die in der Zeile mit dem Vertragsnamen unterging.
                    Eine Empfehlung ist eine Auszeichnung – sie gehört an die
                    Kante der Karte, die sie auszeichnet, und sie darf man
                    sehen.

                    Genau auf der Linie, nicht darüber: `top-0` mit
                    `-translate-y-1/2` legt die Mitte der Plakette auf die
                    Kante, halb auf der Karte, halb auf der Sektionsfläche.
                    Deshalb Neon als Fläche – es ist die einzige Farbe, die
                    gegen beide Untergründe steht, gegen die Tinte der Karte
                    wie gegen das Silber dahinter. Auf Neon steht die Schrift
                    in Tinte (Farbregel in globals.css).

                    Auf dem Telefon stehen die Karten übereinander; der
                    senkrechte Rasterabstand ist deshalb auf 2,5 rem gesetzt,
                    sonst sitzt die Plakette auf der Unterkante der Karte
                    darüber. */}
                {plan.popular ? (
                  <p className="absolute top-0 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-neon py-2 pr-5 pl-4 font-display text-sm font-bold tracking-tight whitespace-nowrap text-ink shadow-[0_10px_30px_-12px_rgb(0_0_0/0.6)] md:text-[0.9375rem]">
                    <Medal
                      aria-hidden="true"
                      className="size-4.5 shrink-0"
                      strokeWidth={2.25}
                    />
                    Empfohlen für Vielfahrer
                  </p>
                ) : null}

                {/* Die Zahlungsweise als Kopfzeile beider Karten – dadurch
                    beginnen Basis und Premium auf derselben Linie. */}
                <p className="eyebrow text-current/70">
                  {plan.paymentType}
                </p>

                <h3 className="mt-6 font-display text-2xl font-bold tracking-tight">
                  {plan.name}
                </h3>

                <p className="mt-3 text-[length:var(--text-lead)] text-current/70">
                  {plan.claim}
                </p>

                {/* Der Preis über `Mark` statt über `text-accent`.
                    `text-accent` kippt auf der hellen Karte auf Tinte – aus
                    gutem Grund, Neon als Schrift liegt dort bei 1,18:1. Das
                    Ergebnis war aber, dass die harte Zahl auf der einen Karte
                    farbig war und auf der anderen grau: dieselbe Rolle, zwei
                    Erscheinungen. `.mark-accent` löst genau das – auf Tinte
                    Neon als Schrift, auf Silber Neon als Fläche mit Tinte
                    darauf. Beide Karten zeigen ihre Zahl jetzt in derselben
                    Farbe, nur in der Rolle, die die Fläche zulässt. */}
                <div className="mt-8 flex items-end gap-3 border-b border-current/10 pb-8">
                  <span className="tabular font-display text-[length:var(--text-stat)] leading-[0.9] font-bold tracking-tight">
                    <Mark>{plan.price}</Mark>
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

                {/* Das Häkchen sitzt in einer Neonscheibe, auf beiden Karten
                    gleich. Vorher war es auf der dunklen Karte neon und auf
                    der hellen grau bei 75 % – die eingeschlossene Leistung sah
                    auf der Basiskarte aus wie eine Fußnote. Die Scheibe
                    funktioniert auf beiden Flächen, weil Neon dort Fläche ist
                    und das Häkchen in Tinte darauf steht. */}
                <ul className="mt-8 flex flex-col gap-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3.5">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-neon text-ink"
                      >
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
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
