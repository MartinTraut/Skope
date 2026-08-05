import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader } from "@/components/ui/page-header";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { JsonLd, breadcrumb, pageGraph, service } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { fullAddress } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter kostenlos entsorgen in Neuenstadt",
  description:
    "Kostenlose Verwertung und fachgerechtes Recycling ausgedienter E-Scooter. Motoren, Akkus und Aluminium-Rahmen gehen zurück in den Materialkreislauf.",
  path: "/recycling",
  image: "/img/scooter-strasse.jpg",
  imageAlt: "Abgestellte E-Scooter am Straßenrand",
});

const steps = [
  {
    n: "01",
    title: "Vorbeibringen oder anrufen",
    text: `Bringen Sie das Altgerät direkt zu uns nach ${fullAddress}. Wenn der Transport schwierig ist, rufen Sie kurz an — wir finden eine Lösung.`,
  },
  {
    n: "02",
    title: "Wir sichten das Gerät",
    text: "Zuerst prüfen wir, ob sich eine Reparatur doch noch lohnt. Manches, was aussortiert wird, ist mit einem Bauteil wieder fahrbereit.",
  },
  {
    n: "03",
    title: "Zerlegen und trennen",
    text: "Was nicht mehr zu retten ist, wird zerlegt: brauchbare Komponenten werden geprüft und eingelagert, der Rest sortenrein getrennt.",
  },
  {
    n: "04",
    title: "Fachgerechte Verwertung",
    text: "Akkus gehen den vorgeschriebenen Weg, Aluminium in den Materialkreislauf. Für Sie ist der gesamte Vorgang kostenlos.",
  },
];

export default function RecyclingPage() {
  return (
    <>
      <PageHeader
        crumb="Recycling"
        eyebrow="Kreislaufwirtschaft"
        title={
          <>
            Ausgedienter Scooter?
            <br />
            Bringen Sie ihn vorbei.
          </>
        }
        lead="Ein defekter E-Scooter ist kein Sperrmüll. Motoren, Akkus und Rahmen sind Rohstoffe und Ersatzteile. Wir übernehmen die Verwertung und das fachgerechte Recycling kostenlos — auch für Geräte, die nicht bei uns gekauft wurden."
      />

      <Section tone="ink-800">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <SectionHead
                align="left"
                eyebrow="So läuft die Abgabe"
                title="Vier Schritte, kein Aufwand für Sie."
              />
              <ol className="mt-12">
                {steps.map((step, i) => (
                  <Reveal key={step.n} delay={i * 70} as="li">
                    <div className="flex gap-6 border-t border-white/12 py-7 md:gap-10">
                      <span className="tabular font-display text-lg font-bold text-current/40">
                        {step.n}
                      </span>
                      <div>
                        <h3 className="font-display text-xl font-bold tracking-tight">
                          {step.title}
                        </h3>
                        <p className="mt-2.5 max-w-xl leading-relaxed text-paper/65">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>

            <Reveal delay={90} className="lg:col-span-5">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-white/12 bg-ink">
                <Image
                  src="/img/scooter-strasse.jpg"
                  alt="Abgestellte E-Scooter am Straßenrand — Altgeräte, die verwertet werden können"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-8 rounded-lg border border-white/12 p-7">
                <h3 className="font-display text-lg font-bold tracking-tight">
                  Warum wir das machen
                </h3>
                <p className="mt-3 leading-relaxed text-paper/65">
                  Aus den verwerteten Geräten entstehen die geprüften
                  Ersatzteile, mit denen wir andere Scooter wieder fahrbereit
                  machen. Reparieren statt ersetzen ist hier keine Haltung aus
                  der Werbung, sondern die Grundlage des Betriebs.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow="Altgerät abgeben"
        title="Kostenlos, ohne Bedingungen."
        text={`Vorbeibringen nach ${fullAddress} oder kurz anrufen, wenn der Transport ein Problem ist. Wir sagen Ihnen vorher ehrlich, ob sich eine Reparatur nicht doch noch lohnt.`}
      />

      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "Recycling", path: "/recycling" }]),
          service({
            name: "Kostenlose Verwertung und Recycling von E-Scootern",
            description:
              "Kostenlose Rücknahme, fachgerechte Verwertung und Recycling ausgedienter E-Scooter. Motoren, Akkus und Aluminium-Rahmen werden getrennt und in den Kreislauf zurückgeführt.",
            path: "/recycling",
            serviceType: "E-Scooter Recycling",
            offers: [
              {
                name: "Verwertung eines ausgedienten E-Scooters",
                price: "0",
                description:
                  "Rücknahme und fachgerechtes Recycling — für Kundinnen und Kunden kostenlos.",
              },
            ],
          }),
        ])}
      />
    </>
  );
}
