import type { Metadata } from "next";
import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Region } from "@/components/sections/region";
import { Testimonials } from "@/components/sections/testimonials";
import { PageHeader } from "@/components/ui/page-header";
import { Container, Section } from "@/components/ui/section";
import { brands } from "@/lib/data/services";
import { JsonLd, breadcrumb, pageGraph, reviews } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { fullAddress, site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter Werkstatt Neuenstadt — über uns",
  description:
    "Thomas Zielke betreibt in Neuenstadt am Kocher eine Fachwerkstatt für Elektrokleinstfahrzeuge. Über 500 reparierte E-Scooter, Verkauf und Service in einer Hand.",
  path: "/ueber-uns",
  image: "/img/werkstatt-service.jpg",
  imageAlt: "Arbeit an einem E-Scooter in der Fachwerkstatt",
});

const principles = [
  {
    title: "Erst messen, dann tauschen",
    text: "Ein Bauteil wird ersetzt, wenn die Messung es hergibt — nicht, weil es der schnellste Weg zur Rechnung wäre.",
  },
  {
    title: "Preis vor der Arbeit",
    text: "Kostenvoranschlag, bevor etwas geöffnet wird. Was nicht freigegeben ist, passiert nicht.",
  },
  {
    title: "Verkauf und Service in einer Hand",
    text: "Wer hier einen Scooter kauft, bekommt ihn auch Jahre später in derselben Werkstatt gewartet.",
  },
  {
    title: "Nichts wird erfunden",
    text: "Wenn sich eine Reparatur nicht mehr rechnet, sagen wir das — und verwerten das Altgerät kostenlos.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumb="Über uns"
        eyebrow="Die Werkstatt"
        title={
          <>
            Über 500 Scooter.
            <br />
            Ein Ansprechpartner.
          </>
        }
        lead={`${site.owner} betreibt in Neuenstadt am Kocher eine Fachwerkstatt für Elektrokleinstfahrzeuge. Verkauf, Reparatur, Wartung und Versicherung laufen über dieselbe Person — Sie erklären Ihr Problem einmal, nicht dreimal.`}
      />

      <Section tone="ink-800">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-white/12 bg-ink">
                <Image
                  src="/img/werkstatt-service.jpg"
                  alt="Arbeit an einem eingespannten E-Scooter über einer Werkbank mit sortiertem Werkzeug"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="parallax object-cover"
                />
              </div>
              {/* TODO Betreiber: durch ein echtes Foto von Thomas Zielke und der
                  Werkstatt ersetzen — nichts baut mehr Vertrauen auf als das. */}
              <p className="mt-4 text-sm text-paper/60">
                Werkstatt {fullAddress}.
              </p>

              {/* Füllt die kurze linke Spalte mit echtem Nutzen statt Leerraum */}
              <dl className="mt-8 rounded-lg border border-white/12 p-7">
                <div className="border-b border-white/10 pb-4">
                  <dt className="text-sm text-paper/60">Betrieb</dt>
                  <dd className="mt-1 font-display text-lg font-bold tracking-tight">
                    Einzelunternehmen, Inhaber {site.owner}
                  </dd>
                </div>
                <div className="border-b border-white/10 py-4">
                  <dt className="text-sm text-paper/60">Reparierte E-Scooter</dt>
                  <dd className="tabular mt-1 font-display text-lg font-bold tracking-tight">
                    über 500
                  </dd>
                </div>
                <div className="pt-4">
                  <dt className="text-sm text-paper/60">Erreichbarkeit</dt>
                  <dd className="mt-1 leading-relaxed text-paper/80">
                    {site.openingHours}
                  </dd>
                </div>
              </dl>
            </Reveal>

            <div className="lg:col-span-7">
              <Reveal delay={70}>
                <p className="eyebrow text-current/65">Wie hier gearbeitet wird</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  Vier Grundsätze,
                  <br />
                  an denen sich alles misst.
                </h2>
              </Reveal>

              <dl className="mt-12">
                {principles.map((item, i) => (
                  <Reveal key={item.title} delay={i * 70}>
                    <div className="border-t border-white/12 py-6">
                      <dt className="font-display text-[length:var(--text-subtitle)] font-bold tracking-tight">
                        {item.title}
                      </dt>
                      <dd className="mt-2.5 max-w-xl leading-relaxed text-paper/65">
                        {item.text}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>

              <Reveal delay={120}>
                <div className="mt-12 border-t border-white/12 pt-8">
                  <h3 className="eyebrow-plain text-paper/70">
                    Marken im Werkstattalltag
                  </h3>
                  <p className="mt-4 leading-relaxed text-paper/65">
                    {brands.join(" · ")} — und weitere. Auch exotische Modelle
                    und Importgeräte sehen wir uns an; bei über 500 reparierten
                    Scootern ist kaum eine Bauform neu.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Testimonials />
      <Region />

      <CtaBand
        eyebrow="Kennenlernen"
        title="Am besten persönlich."
        text={`Kommen Sie in der Werkstatt vorbei — ${fullAddress}. Ein kurzer Anruf vorher stellt sicher, dass jemand da ist.`}
      />

      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "Über uns", path: "/ueber-uns" }]),
          ...reviews("/ueber-uns"),
        ])}
      />
    </>
  );
}
