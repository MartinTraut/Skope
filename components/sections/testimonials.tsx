import { Reveal } from "@/components/motion/reveal";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { testimonials } from "@/lib/data/testimonials";
import { Mark } from "@/components/ui/mark";

/**
 * Kundenstimmen aus der Altseite, unverändert.
 * Kein Sterne-Rating und kein AggregateRating-Schema – es liegt keine
 * belegbare Gesamtbewertung vor, und erfundene Werte wären ein Verstoß.
 */
export function Testimonials() {
  return (
    <Section tone="silver-200">
      <Container>
        <SectionHead
          eyebrow="Kundenstimmen"
          title={
            <>
              Was <Mark>Kunden</Mark> nach dem Werkstattbesuch sagen.
            </>
          }
          lead="Drei Rückmeldungen aus dem Alltag, unverändert übernommen. Bewusst ohne Sternebewertung: eine belegbare Gesamtnote liegt nicht vor."
        />

        {/* `gap-px` erzeugte ohne Zellenhintergrund keine Trennlinie, sondern
            nur einen toten Pixel – auf Mobile klebte die Bildunterschrift des
            einen Zitats an der Oberkante des nächsten. */}
        <div className="mt-14 grid gap-y-12 lg:grid-cols-3 lg:gap-y-0">
          {testimonials.map((item, i) => (
            /* blockquote und figcaption müssen direkte Kinder der figure sein,
               sonst geht die Zuordnung Zitat → Quelle für Hilfstechnik verloren.
               Deshalb trägt die figure selbst das Spaltenlayout. */
            <Reveal
              key={item.author}
              delay={i * 90}
              as="figure"
              /* Auf Mobile trägt der SectionHead darüber bereits eine
                 Unterlinie – mit der eigenen Oberlinie des ersten Zitats
                 standen zwei Haarlinien 56 px auseinander und lasen sich als
                 leerer Kasten. */
              className="flex h-full flex-col justify-between border-t border-current/12 pt-8 max-lg:first:border-t-0 max-lg:first:pt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
            >
              {/* Die Anführungszeichen laufen in der Textfarbe mit, statt als
                  abgeschwächtes Ornament daneben zu stehen. Bei 55 % Deckkraft
                  lagen sie mobil bei 3,75:1 – unter der Schwelle, weil die
                  Schrift dort unter 24 px fällt. Sie gehören ohnehin zum Satz,
                  nicht zur Dekoration. `aria-hidden`, damit Screenreader nicht
                  „Anführungszeichen" vorlesen. */}
              <blockquote className="font-display text-[length:var(--text-subtitle)] leading-[1.35] font-semibold tracking-tight text-balance">
                <span aria-hidden="true">&bdquo;</span>
                {item.quote}
                <span aria-hidden="true">&ldquo;</span>
              </blockquote>
              <figcaption className="mt-8 border-t border-current/8 pt-5">
                <span className="block font-display font-semibold tracking-tight">
                  {item.author}
                </span>
                <span className="block text-sm text-current/70">
                  {item.context}
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
