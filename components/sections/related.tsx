import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container, Section } from "@/components/ui/section";

/**
 * Querverweise am Ende einer Leistungsseite.
 *
 * Die fünf Leistungen hängen im Alltag zusammen — wer einen Scooter kauft,
 * braucht das Kennzeichen; wer ein Altgerät abgibt, will oft erst wissen, ob
 * sich die Reparatur nicht doch lohnt. Ohne diese Verweise endet jede Seite in
 * sich selbst, und der Nutzer muss zurück in die Hauptnavigation.
 *
 * Bewusst schmal gehalten: eine Textzeile pro Ziel, kein weiteres Kartenraster
 * direkt vor dem CTA-Band.
 */
export function Related({
  items,
  tone = "ink",
}: {
  items: { href: string; label: string; text: string }[];
  /** Muss sich vom Ton der vorhergehenden Sektion unterscheiden. */
  tone?: "ink" | "ink-800";
}) {
  return (
    <Section tone={tone} className="py-14 md:py-16">
      <Container>
        <Reveal>
          <h2 className="eyebrow-plain text-paper/70">
            Passt dazu
          </h2>
          <ul className="mt-7 grid gap-x-16 md:grid-cols-2">
            {items.map((item) => (
              <li key={item.href} className="border-t border-white/12">
                <Link
                  href={item.href}
                  className="group flex items-start justify-between gap-6 py-5"
                >
                  <span>
                    <span className="block font-display text-[length:var(--text-subtitle)] font-bold tracking-tight transition-colors duration-200 group-hover:text-flame">
                      {item.label}
                    </span>
                    <span className="mt-1.5 block leading-relaxed text-paper/65">
                      {item.text}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-1.5 size-5 shrink-0 text-paper/40 transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-flame"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
