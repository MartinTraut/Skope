import { Plus } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import type { FaqItem } from "@/lib/data/faq";
import { cn } from "@/lib/utils";

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
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
              {/* Breite in Zeichen statt in rem: `max-w-3xl` ergab bei diesem
                  Schriftgrad rund 90 Zeichen pro Zeile, deutlich über der
                  angenehmen Lesebreite. */}
              <h3 className="max-w-[42ch] text-[length:var(--text-subtitle)] transition-colors duration-200 group-hover:text-accent">
                {item.q}
              </h3>
              <span
                aria-hidden="true"
                className="mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-current/25 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-open:rotate-45 group-open:border-accent group-open:text-accent"
              >
                <Plus className="size-4" />
              </span>
            </summary>
            {/* Keine eigene Breite mehr: Die Lesebreite steht als Grundregel im
                  Stylesheet. 68ch wirken wie 82 Zeichen – `1ch` ist die Breite
                  der Null und liegt rund 20 % über der mittleren
                  Kleinbuchstabenbreite. */}
            <p className="pb-7 leading-relaxed opacity-70">{item.a}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
