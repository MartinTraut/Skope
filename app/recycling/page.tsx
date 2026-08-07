import type { Metadata } from "next";
import Image from "next/image";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Related } from "@/components/sections/related";
import { PageHeader } from "@/components/ui/page-header";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { JsonLd, breadcrumb, pageGraph, service } from "@/lib/schema";
import { RECYCLING_TOPICS } from "@/lib/data/topics";
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
                      <span className="tabular font-display text-lg font-bold text-current/65">
                        {step.n}
                      </span>
                      <div>
                        <h3 className="text-[length:var(--text-subtitle)]">
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
                  className="parallax object-cover"
                />
              </div>
              <div className="mt-8 rounded-lg border border-white/12 p-7">
                <h3 className="font-display text-lg font-bold tracking-tight">
                  Warum wir das machen
                </h3>
                <p className="mt-3 leading-relaxed text-paper/65">
                  Brauchbare Nabenmotoren, Bremsen und Elektronikbauteile werden
                  geprüft, eingelagert und in anderen Reparaturen wieder verbaut.
                  Das hält die Ersatzteilkosten für unsere Kunden niedrig und
                  spart Neuteile.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Anfrage — dieselbe Behandlung wie auf den übrigen Leistungsseiten:
          Wer hier ankommt, soll nicht erst auf die Kontaktseite wechseln. */}
      <Section id="anfrage" tone="paper">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow text-current/65">Altgerät anmelden</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  Sagen Sie kurz,
                  <br />
                  worum es geht.
                </h2>
                <p className="mt-6 leading-relaxed text-ink/70">
                  Marke, Modell und was defekt ist. Wir sagen Ihnen vorab, ob
                  sich eine Reparatur noch lohnt — und wenn nicht, übernehmen wir
                  die Verwertung kostenlos.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={80}>
                <InquiryForm topics={RECYCLING_TOPICS} />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Related
        items={[
          {
            href: "/reparatur",
            label: "Reparatur",
            text: "Bevor ein Gerät verwertet wird, prüfen wir, ob ein einzelnes Bauteil es wieder fahrbereit macht.",
          },
          {
            href: "/e-scooter",
            label: "Geprüfte E-Scooter",
            text: "Aus verwerteten Geräten kommen die Ersatzteile für die Scooter, die wir mit Siegel verkaufen.",
          },
        ]}
      />

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
