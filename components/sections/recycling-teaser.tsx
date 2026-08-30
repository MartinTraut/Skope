import Image from "next/image";
import { Recycle } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { Mark } from "@/components/ui/mark";

const parts = [
  { part: "Nabenmotoren", use: "geprüft und als Ersatzteil wiederverwendet" },
  { part: "Akkuzellen", use: "vermessen, sortiert und fachgerecht entsorgt" },
  { part: "Aluminium-Rahmen", use: "sortenrein in den Materialkreislauf" },
];

/**
 * Recycling-Teaser als geschichtete Komposition.
 *
 * Bewusst weder 5/7-Split noch Kartenraster: Beides steht auf der Seite
 * mehrfach. Hier trägt eine breite Headline über die volle Containerbreite,
 * darunter überlappt die Materialtafel die rechte Bildkante. Die Tiefenstaffelung
 * ist die einzige Stelle dieser Art auf der Startseite – genau deshalb wirkt sie.
 */
export function RecyclingTeaser() {
  return (
    <Section id="recycling" tone="ink">
      <Container>
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <p className="eyebrow text-current/90">Kreislauf statt Sperrmüll</p>
            <h2 className="mt-5 max-w-[18ch] text-[length:var(--text-display)]">
              Ihr alter Scooter ist unser <Mark>Ersatzteillager</Mark>.
            </h2>
          </div>
          <div className="lg:max-w-sm lg:shrink-0">
            <p className="leading-relaxed text-current/70">
              Haben Sie ein Altgerät, das nur noch Platz wegnimmt? Wir
              übernehmen die Verwertung und das fachgerechte Recycling
              kostenlos, auch dann, wenn Sie den Scooter nicht bei uns gekauft
              haben.
            </p>
            <div className="mt-7">
              <ButtonLink href="/recycling#anfrage" variant="outline" size="lg">
                So läuft die Abgabe
              </ButtonLink>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-0">
          <Reveal className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-ink-700">
              <Image
                src="/img/scooter-strasse.jpg"
                alt="Ausgediente E-Scooter an einer Betonwand, bereit zur Verwertung"
                fill
                sizes="(min-width: 1024px) 55vw, (min-width: 768px) calc(100vw - 5rem), calc(100vw - 3rem)"
                className="parallax object-cover"
              />
            </div>
          </Reveal>

          {/* Ab lg über die Bildkante gezogen – auf schmalen Screens steht die
              Tafel schlicht darunter, ohne das Bild zu verdecken. */}
          <Reveal
            delay={90}
            className="lg:z-10 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:-ml-10"
          >
            <div className="lift-lg rounded-lg border border-current/12 bg-ink-700 p-8 md:p-10">
              <Recycle
                aria-hidden="true"
                className="size-8 text-accent"
                strokeWidth={1.5}
              />
              <h3 className="mt-6 text-[length:var(--text-subtitle)]">
                Was aus einem ausgedienten E-Scooter wird
              </h3>
              <dl className="mt-7">
                {parts.map((row) => (
                  <div
                    key={row.part}
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-silver/12 py-4"
                  >
                    <dt className="font-display font-semibold tracking-tight text-silver">
                      {row.part}
                    </dt>
                    <dd className="text-current/70">{row.use}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 border-t border-silver/12 pt-5 text-sm text-current/70">
                Aus den verwerteten Geräten kommen die geprüften Ersatzteile,
                mit denen wir andere Scooter wieder fahrbereit machen. Deshalb
                ist die Rücknahme kostenlos: Das Altgerät hat für uns einen
                Materialwert.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
