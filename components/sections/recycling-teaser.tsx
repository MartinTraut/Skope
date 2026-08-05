import { Recycle } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";

const parts = [
  { part: "Nabenmotoren", use: "geprüft und als Ersatzteil wiederverwendet" },
  { part: "Akkuzellen", use: "vermessen, sortiert und fachgerecht entsorgt" },
  { part: "Aluminium-Rahmen", use: "sortenrein in den Materialkreislauf" },
];

export function RecyclingTeaser() {
  return (
    <Section id="recycling" tone="paper">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow text-current/55">Kreislauf statt Sperrmüll</p>
            <h2 className="mt-5 text-[length:var(--text-display)]">
              Ihr alter Scooter
              <br />
              ist unser Ersatzteillager.
            </h2>
            <p className="mt-6 leading-relaxed text-ink/65">
              Haben Sie ein Altgerät, das nur noch Platz wegnimmt? Wir übernehmen
              die Verwertung und das fachgerechte Recycling kostenlos — auch
              dann, wenn Sie den Scooter nicht bei uns gekauft haben.
            </p>
            <div className="mt-8">
              <ButtonLink href="/recycling" variant="outline" size="lg" className="text-ink">
                So läuft die Abgabe
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={80} className="lg:col-span-7">
            <div className="rounded-lg border border-ink/12 bg-paper-200/60 p-8 md:p-10">
              <Recycle
                aria-hidden="true"
                className="size-8 text-current/45"
                strokeWidth={1.5}
              />
              <h3 className="mt-6 font-display text-xl font-bold tracking-tight">
                Was aus einem ausgedienten E-Scooter wird
              </h3>
              <dl className="mt-7">
                {parts.map((row) => (
                  <div
                    key={row.part}
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-ink/12 py-4"
                  >
                    <dt className="font-display font-semibold tracking-tight text-ink">
                      {row.part}
                    </dt>
                    <dd className="text-ink/60">{row.use}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 border-t border-ink/12 pt-5 text-sm text-ink/65">
                Genau daraus entstehen die geprüften Ersatzteile, mit denen wir
                andere Scooter wieder fahrbereit machen. Reparieren ist hier kein
                Argument aus der Werbung, sondern das Geschäftsmodell.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
