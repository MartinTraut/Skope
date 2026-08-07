import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container, Section, SectionHead } from "@/components/ui/section";

const pillars = [
  {
    href: "/e-scooter",
    image: "/img/scooter-stadt.jpg",
    kicker: "Kaufen",
    title: "Geprüfte E-Scooter statt Glücksspiel",
    text: "Jedes Gerät läuft vor dem Verkauf durch unsere Werkstatt: Bremsen, Akkukapazität, Elektronik, Verschleißteile. Erst dann bekommt es das Skope-Qualitätssiegel — plus ein Jahr Gewährleistung.",
    meta: "1 Jahr Gewährleistung",
  },
  {
    href: "/reparatur",
    image: "/img/akku-diagnose.jpg",
    kicker: "Reparieren",
    title: "Erst messen, dann tauschen",
    text: "Fehlercode auslesen, Restkapazität messen, Ursache finden. Wir ersetzen kein Bauteil, das noch funktioniert — und legen vor jeder Arbeit einen transparenten Kostenvoranschlag vor.",
    meta: "Checkup 59,99 €",
  },
  {
    href: "/versicherung",
    image: "/img/scooter-allee.jpg",
    kicker: "Absichern",
    title: "Kennzeichen, ohne Papierkrieg",
    text: "Die Haftpflicht ist für jeden E-Scooter über 6 km/h Pflicht. Wir vermitteln sie als ERGO-Partner deutschlandweit — Kennzeichen in 5 bis 10 Werktagen per Post nach Hause.",
    meta: "ERGO Partner",
  },
];

export function Pillars() {
  return (
    <Section id="leistungen" tone="ink-800">
      <Container>
        <SectionHead
          eyebrow="Drei Wege, ein Ansprechpartner"
          title="Kaufen, reparieren, absichern — alles bei derselben Werkstatt."
          lead="Der Unterschied zum Kleinanzeigen-Kauf: Wer Ihnen den Scooter verkauft, kann ihn auch Jahre später noch warten. Verkauf und Service liegen hier in einer Hand."
        />

        <div className="mt-16 grid gap-px lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.href} delay={i * 90}>
              <Link
                href={pillar.href}
                className="group flex h-full flex-col border-t border-white/10 pt-8 transition-colors duration-300 hover:border-flame lg:border-t-0 lg:border-l lg:pt-0 lg:pr-8 lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-ink">
                  <Image
                    src={pillar.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-4 left-4 rounded-xs bg-ink/80 px-3 py-1.5 font-display text-[0.6875rem] font-semibold tracking-[0.14em] uppercase backdrop-blur-sm">
                    {pillar.kicker}
                  </span>
                </div>

                <h3 className="mt-7 flex items-start justify-between gap-4 text-[length:var(--text-title)]">
                  <span className="max-w-[16ch]">{pillar.title}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-1.5 size-6 shrink-0 text-paper/30 transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-flame"
                  />
                </h3>

                <p className="mt-4 leading-relaxed text-paper/60">
                  {pillar.text}
                </p>

                <p className="mt-6 border-t border-white/8 pt-4 font-display text-sm font-semibold tracking-tight text-paper/85">
                  {pillar.meta}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
