import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container, Section } from "@/components/ui/section";

/**
 * Querverweise am Ende einer Leistungsseite.
 *
 * Die fünf Leistungen hängen im Alltag zusammen – wer einen Scooter kauft,
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
  tone?: "silver" | "silver-200" | "ink" | "ink-800";
}) {
  return (
    <Section tone={tone} className="py-14 md:py-16">
      <Container>
        <Reveal>
          <h2 className="eyebrow text-current/90">Passt dazu</h2>
          {/* Zwei Flächen statt zweier Haarlinien: Die Oberkante lag bei 12 %
              Deckkraft über einem Ziel, das man anklicken soll – sie hat den
              Verweis eher abgeschnitten als markiert. Die Fläche zeigt
              dagegen, wie weit der Klickbereich reicht. */}
          <ul className="mt-7 grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="press group flex items-start justify-between gap-6 rounded-xl bg-current/5 p-6 transition-[background-color,transform] duration-200 [--press-scale:0.985] hover:bg-current/10 md:p-7"
                >
                  <span>
                    <span className="block font-display text-[length:var(--text-subtitle)] font-bold tracking-tight transition-colors duration-200 group-hover:text-accent">
                      {item.label}
                    </span>
                    <span className="mt-1.5 block leading-relaxed text-current/65">
                      {item.text}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-1.5 size-5 shrink-0 text-current/40 transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
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
