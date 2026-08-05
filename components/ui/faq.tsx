import { Plus } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import type { FaqItem } from "@/lib/data/faq";
import { cn } from "@/lib/utils";

/**
 * FAQ auf Basis von <details>/<summary>.
 * Nativ zugänglich, tastaturbedienbar und funktionsfähig, bevor JavaScript
 * geladen ist — für eine FAQ, die auch von Crawlern gelesen wird, das
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
    <div className={cn("divide-y divide-current/12 border-y border-current/12", className)}>
      {items.map((item, i) => (
        <Reveal key={item.q} delay={Math.min(i * 55, 220)}>
          <details className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
              <h3 className="max-w-3xl font-display text-lg leading-snug font-semibold tracking-tight transition-colors duration-200 group-hover:text-flame md:text-xl">
                {item.q}
              </h3>
              <span
                aria-hidden="true"
                className="mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-current/25 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-open:rotate-45 group-open:border-flame group-open:text-flame"
              >
                <Plus className="size-4" />
              </span>
            </summary>
            <p className="max-w-3xl pb-7 leading-relaxed opacity-70">{item.a}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
