import Image from "next/image";
import { ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { tariffDisclaimer, tariffs } from "@/lib/data/insurance";

/**
 * Teaser für die Pflichtversicherung.
 *
 * Rechts steht bewusst keine Fotografie: Der einzige verfügbare Beleg ist der
 * Preisaushang aus der Werkstatt, und als halbseitiges Hauptbild wirkt das
 * Abfotografieren eines Ausdrucks wie ein Schnappschuss. Als gesetzte Tafel
 * sind dieselben Zahlen lesbar, durchsuchbar und skalieren sauber; das Foto
 * bleibt daneben als Beleg in Daumennagelgröße.
 */
export function InsuranceTeaser() {
  // Nur die Jahreszeile darf als Jahresbeitrag zitiert werden. Das Minimum der
  // Tabelle gehört zu einem Ein-Monats-Zeitraum — als „je Saison" ausgegeben
  // wäre das ein zu niedriger Preis an der prominentesten Stelle der Seite.
  const fullYear = tariffs.find((t) => t.full);

  return (
    <Section id="versicherung" tone="ink-800">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="order-2 lg:order-1 lg:col-span-6">
            <p className="eyebrow text-current/65">Pflichtversicherung · ERGO</p>
            <h2 className="mt-5 text-[length:var(--text-display)]">
              Ohne Kennzeichen
              <br />
              kein Straßenverkehr.
            </h2>
            <p className="mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-paper/70">
              Für jeden E-Scooter mit mehr als 6 km/h Höchstgeschwindigkeit ist
              die Haftpflicht gesetzlich vorgeschrieben (eKFV, § 1 PflVG). Ohne
              gültige Plakette drohen Bußgeld und volle persönliche Haftung.
            </p>

            <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-white/12 py-8">
              <div>
                <dt className="text-sm text-paper/65">Haftpflicht</dt>
                <dd className="tabular mt-1 font-display text-3xl font-extrabold tracking-tight text-flame">
                  {fullYear?.liability ?? "auf Anfrage"}
                </dd>
                <dd className="mt-1 text-xs text-paper/65">
                  volles Versicherungsjahr, kein Abo
                </dd>
              </div>
              <div>
                <dt className="text-sm text-paper/65">Kennzeichen per Post</dt>
                <dd className="tabular mt-1 font-display text-3xl font-extrabold tracking-tight">
                  5 – 10
                </dd>
                <dd className="mt-1 text-xs text-paper/65">Werktage</dd>
              </div>
            </dl>

            <p className="mt-6 flex items-start gap-3 text-sm text-paper/65">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-petrol-400"
              />
              Deutschlandweit vermittelbar — Sie müssen dafür nicht in der
              Region Heilbronn wohnen.
            </p>

            <div className="mt-9">
              <ButtonLink href="/versicherung#tarife" size="lg">
                Alle Tarife 2026/2027 ansehen
              </ButtonLink>
            </div>
          </Reveal>

          {/* Tariftafel — dieselben Werte wie auf der Versicherungsseite,
              gekürzt auf die vier Zeiträume, nach denen tatsächlich gefragt wird. */}
          <Reveal delay={90} className="order-1 lg:order-2 lg:col-span-6">
            <div className="rounded-lg border border-white/12 bg-petrol-900/60 p-7 md:p-9">
              <p className="eyebrow-plain text-paper/70">
                Saison 2026/2027
              </p>
              <dl className="mt-7">
                {tariffs.slice(0, 4).map((row) => (
                  <div
                    key={row.period}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-white/12 py-4"
                  >
                    <dt className="tabular text-sm text-paper/75">
                      {row.period}
                    </dt>
                    <dd className="tabular font-display text-lg font-bold tracking-tight">
                      {row.liability}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 border-t border-white/12 pt-5 text-xs leading-relaxed text-paper/65">
                Haftpflicht, Startpreise der günstigsten Risikoklasse. Teilkasko
                mit Diebstahlschutz und die übrigen Zeiträume stehen auf der
                Versicherungsseite.
              </p>
            </div>

            <figure className="mt-6 flex items-center gap-4">
              <Image
                src="/img/ergo-tarife.jpg"
                alt="Preisaushang der ERGO E-Scooter Tarife in der Werkstatt"
                width={1024}
                height={1536}
                sizes="72px"
                className="h-24 w-18 shrink-0 rounded-xs border border-white/12 object-cover"
              />
              <figcaption className="text-xs leading-relaxed text-paper/65">
                Der Aushang hängt in der Werkstatt. {tariffDisclaimer}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
