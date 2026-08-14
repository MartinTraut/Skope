import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { checkupIncludes, turnaround } from "@/lib/data/services";

/**
 * Die Vertrauens-Sektion: konkrete Prüfschritte und echte Bearbeitungszeiten
 * statt Adjektiven. Heller Grund als Ruhepunkt zwischen zwei dunklen Zonen.
 */
export function Workshop() {
  return (
    <Section tone="ink">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Bild – hochformatig, bricht das Raster der übrigen Sektionen */}
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-ink-700">
              <Image
                src="/img/werkstatt-service.jpg"
                alt="Mechaniker zieht die Lenkerklemmung eines eingespannten E-Scooters mit dem Drehmomentschlüssel nach"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="parallax object-cover"
              />
            </div>
            <p className="mt-4 text-sm text-current/65">
              Werkstatt Im Kampfrad 3, Neuenstadt am Kocher.
            </p>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-current/90">Der Sicherheits-Checkup</p>
              <h2 className="mt-5 text-[length:var(--text-display)]">
                {/* Der Preis trägt die Aussage der Zeile, also bekommt er den
                    Akzent – die harte Zahl ist einer der drei Fälle, für die
                    Neon reserviert ist. Die Sektion ist dunkel, dort ist Neon
                    Schrift (14,8:1 auf Tinte). */}
                Was für <span className="text-accent">59,99 €</span> tatsächlich
                passiert.
              </h2>
              <p className="mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-current/65">
                Der Checkup ist kein Blick über den Lenker. Er ist eine
                vollständige Aufnahme des Zustands: dieselbe Prüfung, die jeder
                Scooter durchläuft, bevor er unser Qualitätssiegel bekommt.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <ul className="mt-10 grid gap-x-10 gap-y-0 sm:grid-cols-2">
                {checkupIncludes.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-4 border-b border-silver/12 py-4"
                  >
                    <span className="tabular font-display text-xs font-semibold text-current/65">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-current/80">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-12">
                <h3 className="eyebrow-plain text-current/90">
                  Wie lange es dauert
                </h3>
                <dl className="mt-5 flex flex-col gap-3">
                  {turnaround.map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-silver/12 pb-3"
                    >
                      <dt className="text-current/70">{row.label}</dt>
                      <dd className="font-display font-semibold tracking-tight text-silver">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Eine Hauptaktion, ein Textlink daneben: Dasselbe Button-Paar
                  stand auf der Startseite vorher viermal. Der zweite Weg bleibt
                  erhalten, tritt aber nicht mehr als gleichwertig auf. */}
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <ButtonLink href="/reparatur#anfrage" size="lg">
                  Reparatur anfragen
                </ButtonLink>
                <ButtonLink
                  href="/wartungsvertrag"
                  variant="quiet"
                  size="lg"
                  className="text-silver"
                >
                  Checkup im Vertrag ab 17,99 €
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
