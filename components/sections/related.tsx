import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container, Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

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
  /* Die Kachel liegt eine Stufe neben der Sektionsfläche, nicht auf ihr.
     Vorher stand hier `bg-current/5`: auf Silber sind das 5 % Tinte auf einer
     fast weißen Fläche – ein Kasten, den man erst sieht, wenn man ihn sucht,
     und der eher wie ein abgeschalteter Bereich aussieht als wie zwei Wege,
     die weiterführen. Beide Ziele lagen damit am Ende jeder Leistungsseite
     praktisch unsichtbar.

     Deshalb eine echte Fläche aus dem eigenen Farbsatz plus `lift`. Auf
     Silber trägt der Schatten die Kante, auf Tinte der Innenring der Regel –
     die Begründung dazu steht an `.lift` in globals.css. Welche Stufe die
     richtige ist, hängt an der Sektion: eine Kachel in derselben Farbe wie
     ihr Untergrund ist wieder keine.

     Im dunklen Raum ist es `ink-700` (#191d23) und nicht die nächste Stufe
     `ink-800` (#101216): Gegen die Sektionsfläche #08090b sind das acht
     Helligkeitsstufen gegenüber zwei – und zwei sieht man auf einem normalen
     Display nicht, das ist derselbe Befund, an dem schon die vierstufige
     Sektionsfolge gescheitert ist. */
  const surface = {
    silver: "bg-silver-200 hover:bg-silver-300/60",
    "silver-200": "bg-silver hover:bg-silver/60",
    ink: "bg-ink-700 hover:bg-ink-600",
    "ink-800": "bg-ink-700 hover:bg-ink-600",
  } as const;

  return (
    <Section tone={tone} className="py-14 md:py-16">
      <Container>
        {/* Auszeichnungszeile *und* Überschrift, nicht die Überschrift im
            Grad der Auszeichnungszeile.

            Hier stand ein `<h2 className="eyebrow">`, gemessen 13 px – kleiner
            als jedes H3 der Seite (20,8 bis 24 px). Optisch hatte der Block
            damit gar keine Überschrift, sondern nur eine Beschriftung über
            zwei Karten, und in der Gliederung stand eine Ebene, die man nicht
            sehen konnte. */}
        <Reveal>
          <p className="eyebrow text-current/90">Passt dazu</p>
          <h2 className="mt-4 text-[length:var(--text-title)]">
            Das brauchen Sie als Nächstes.
          </h2>
          <ul className="mt-7 grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "press lift group flex items-start justify-between gap-6 rounded-xl p-6 transition-[background-color,transform] duration-200 [--press-scale:0.985] md:p-7",
                    surface[tone],
                  )}
                >
                  <span>
                    <span className="block font-display text-[length:var(--text-subtitle)] font-bold tracking-tight">
                      {item.label}
                    </span>
                    <span className="mt-1.5 block leading-relaxed text-current/70">
                      {item.text}
                    </span>
                  </span>

                  {/* Der Pfeil sitzt in einem Ring und füllt sich beim
                      Zeigen mit Neon – dieselbe Bewegung wie das Pluszeichen
                      der FAQ, und dieselbe Regel: Neon ist auf Silber Fläche
                      mit Tinte darauf, nie Schrift. Vorher war der Pfeil ein
                      Strich bei 40 % Deckkraft, also genau so blass wie die
                      Fläche, auf der er lag. Ohne Zeigegerät bleibt der Ring
                      sichtbar; er ist die Richtungsangabe, nicht der
                      Hover-Effekt. */}
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full border border-current/25 transition-[background-color,border-color,color] duration-200 group-hover:border-neon group-hover:bg-neon group-hover:text-ink"
                  >
                    <ArrowUpRight className="size-5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
