import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Seal } from "@/components/brand/seal";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { PhoneButton } from "@/components/ui/phone-button";
import { Container } from "@/components/ui/section";
import { proof } from "@/lib/site";

const stats = [
  { value: "500+", label: "reparierte E-Scooter" },
  { value: "59,99 €", label: "kompletter Sicherheits-Checkup" },
  { value: "1 Jahr", label: "Gewährleistung auf Gebrauchtgeräte" },
  { value: "8 – 25 km", label: "Einzugsgebiet um Neuenstadt" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink pt-32 pb-0 md:pt-40">
      {/* Tiefenstaffelung: Petrol-Licht hinter der Bildseite, dezentes Raster */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-veil opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-18%] right-[-12%] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,var(--color-petrol)_0%,transparent_62%)] opacity-30 blur-2xl"
      />

      <Container className="relative">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          {/* Textseite */}
          <div className="lg:col-span-7 xl:col-span-6">
            <Reveal immediate>
              <p className="eyebrow text-current/55">
                Fachwerkstatt · Neuenstadt am Kocher
              </p>
            </Reveal>

            <Reveal immediate>
              <h1 className="mt-7">
                <span className="block text-[length:var(--text-hero)]">
                  Wegwerfen ist
                  <br />
                  keine&nbsp;
                  <span className="text-flame">Diagnose</span>.
                </span>
                <span className="mt-7 block max-w-xl font-sans text-[length:var(--text-lead)] leading-relaxed font-normal tracking-normal text-paper/70">
                  E-Scooter Reparatur, Wartung und geprüfte
                  Gebrauchtgeräte&nbsp;— aus einer Werkstatt in Neuenstadt am
                  Kocher, für Heilbronn, Neckarsulm und die ganze Region.
                </span>
              </h1>
            </Reveal>

            <Reveal immediate>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <PhoneButton />
                <ButtonLink href="/reparatur" variant="outline" size="lg">
                  Reparatur anfragen
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </ButtonLink>
              </div>
              <p className="mt-5 text-sm text-paper/60">
                Kostenvoranschlag vor jeder Arbeit. Bremsen und Reifen meist am
                selben Tag.
              </p>
            </Reveal>
          </div>

          {/* Bildseite — bewusst nach unten versetzt, bricht die Mittelachse */}
          <Reveal
            immediate
            className="relative lg:col-span-5 lg:translate-y-8 xl:col-span-6"
          >
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-lg border border-white/10 bg-ink-800 lg:aspect-[4/5]">
              <Image
                src="/img/scooter-studio.jpg"
                alt="Generalüberholter E-Scooter mit Skope-Qualitätssiegel in Studioaufnahme"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
              />
            </div>

            {/* Siegel: ab lg als überlappendes Objekt an der Bildkante, darunter
                im Fluss — sonst verdeckt es auf dem Telefon ein Drittel des Bilds. */}
            <div className="mt-4 flex items-center gap-4 rounded-sm border border-white/12 bg-ink-800/95 py-3.5 pr-6 pl-3.5 backdrop-blur-sm lg:absolute lg:-bottom-7 lg:-left-8 lg:mt-0">
              <Seal decorative compact className="size-14 shrink-0" />
              <div>
                <p className="font-display text-sm font-bold tracking-tight">
                  {proof.sealName}
                </p>
                <p className="text-xs text-paper/55">
                  Jedes Gerät geprüft, bevor es verkauft wird
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Beweisband — schließt den Hero ab und leitet in die Seite über */}
        <Reveal
          delay={80}
          className="mt-24 grid grid-cols-1 gap-px overflow-hidden border-t border-white/10 sm:grid-cols-2 lg:mt-32 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="min-w-0 border-b border-white/8 py-7 pr-6 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0"
            >
              <p className="tabular font-display text-[length:var(--text-stat)] leading-none font-extrabold tracking-tight">
                {stat.value}
              </p>
              <p className="mt-3 text-sm leading-snug text-paper/50">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
