import { Reveal } from "@/components/motion/reveal";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { testimonials } from "@/lib/data/testimonials";

/**
 * Kundenstimmen aus der Altseite, unverändert.
 * Kein Sterne-Rating und kein AggregateRating-Schema — es liegt keine
 * belegbare Gesamtbewertung vor, und erfundene Werte wären ein Verstoß.
 */
export function Testimonials() {
  return (
    <Section tone="ink-800">
      <Container>
        <SectionHead
          eyebrow="Kundenstimmen"
          title="Was Kunden nach dem Werkstattbesuch sagen."
          lead="Drei Rückmeldungen aus dem Alltag — unverändert übernommen. Bewusst ohne Sternebewertung: eine belegbare Gesamtnote liegt nicht vor."
        />

        <div className="mt-14 grid gap-px lg:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.author} delay={i * 90} as="figure">
              <div className="flex h-full flex-col justify-between border-t border-white/12 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 lg:first:border-l-0 lg:first:pl-0">
                <blockquote className="font-display text-[clamp(1.25rem,1.1vw+1rem,1.6rem)] leading-[1.35] font-semibold tracking-tight text-balance">
                  <span aria-hidden="true" className="text-current/25">
                    &bdquo;
                  </span>
                  {item.quote}
                  <span aria-hidden="true" className="text-current/25">
                    &ldquo;
                  </span>
                </blockquote>
                <figcaption className="mt-8 border-t border-white/8 pt-5">
                  <span className="block font-display font-semibold tracking-tight">
                    {item.author}
                  </span>
                  <span className="block text-sm text-paper/60">
                    {item.context}
                  </span>
                </figcaption>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
