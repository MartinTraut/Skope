import { Plus } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container, SectionHead } from "@/components/ui/section";
import type { FaqItem } from "@/lib/data/faq";
import { cn } from "@/lib/utils";

/**
 * Kopf und Fragen nebeneinander, nicht untereinander.
 *
 * Gestapelt blieb die rechte Hälfte der Sektion leer und die Fragenzeilen
 * liefen über die volle Breite: gemessen 1400 px Zeile für eine Überschrift
 * von höchstens 42 Zeichen, das Pluszeichen 500 px vom letzten Wort entfernt.
 * Zwei Löcher aus einem Fehler – zu viel Breite für die Zeile, zu wenig
 * Inhalt für die Fläche.
 *
 * Fünf Spalten für den Kopf, sieben für die Fragen. Der Kopf bleibt beim
 * Scrollen stehen, solange die Liste läuft; die Fragenzeile ist damit rund
 * 780 px breit, also so lang wie ihr längster Satz.
 *
 * Alle fünf FAQ-Blöcke der Seite hatten dieselbe zehn Zeilen Markup. Deshalb
 * steht hier der ganze Abschnitt und nicht nur die Liste: Ein Bauteil, das
 * fünfmal kopiert wird, wird beim sechsten Mal an einer Stelle anders.
 */
export function FaqSection({
  eyebrow,
  title,
  lead,
  items,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead: string;
  items: FaqItem[];
}) {
  return (
    <Container>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHead
            eyebrow={eyebrow}
            title={title}
            lead={lead}
            className="pb-0 lg:sticky lg:top-28"
          />
        </div>
        <div className="lg:col-span-7">
          <Faq items={items} />
        </div>
      </div>
    </Container>
  );
}

/**
 * FAQ auf Basis von <details>/<summary>.
 * Nativ zugänglich, tastaturbedienbar und funktionsfähig, bevor JavaScript
 * geladen ist – für eine FAQ, die auch von Crawlern gelesen wird, das
 * robustere Fundament als ein State-getriebenes Accordion.
 */
export function Faq({
  items,
  className,
}: {
  items: FaqItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "divide-y divide-current/12 border-y border-current/12",
        className,
      )}
    >
      {items.map((item, i) => (
        <Reveal key={item.q} delay={Math.min(i * 55, 220)}>
          <details className="group">
            <summary className="press flex cursor-pointer list-none items-start justify-between gap-6 py-6 [--press-scale:0.99] [&::-webkit-details-marker]:hidden">
              {/* Keine eigene Breitengrenze mehr. Sie stammt aus der Zeit, in
                  der die Liste über die volle Sektionsbreite lief: 42 Zeichen
                  hielten die Zeile lesbar, ließen aber 500 px Luft bis zum
                  Pluszeichen. In der siebenspaltigen Spalte ist die Spalte
                  selbst das Maß – rund 48 Zeichen, und die Frage endet dort,
                  wo ihr Schalter beginnt. */}
              <h3 className="text-[length:var(--text-subtitle)] transition-colors duration-200 group-hover:text-accent">
                {item.q}
              </h3>
              <span
                aria-hidden="true"
                className="mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-current/25 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-open:rotate-45 group-open:border-accent group-open:text-accent"
              >
                <Plus className="size-4" />
              </span>
            </summary>
            {/* Die Spalte ist das Maß, nicht die 68ch-Grundregel aus dem
                Stylesheet. Gemessen bei 1512 px: Die Antwort lief auf 622 px
                aus, die Frage darüber auf 799 – also endete jede Antwort
                177 px vor dem Pluszeichen, das zu ihr gehört. Zwei
                verschiedene Satzkanten in einem Block lesen sich als Fehler,
                und der Text wirkt in die linke Hälfte gedrängt. Die
                Sieben-Spalten-Spalte hält die Zeile ohnehin bei rund 86
                Zeichen; darüber hinaus wächst sie nicht, weil die Spalte
                selbst nicht wächst. */}
            <p className="max-w-none pb-7 leading-relaxed opacity-70">
              {item.a}
            </p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
