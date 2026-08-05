import Image from "next/image";
import { ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { tariffs } from "@/lib/data/insurance";

/**
 * Zieht den Zahlenwert aus einer Tarifangabe wie „ab 42 €".
 * Kommastellen und Tausenderpunkte werden korrekt behandelt — ein blankes
 * `replace(/\D/g, "")` würde aus „ab 42,50 €" die Zahl 4250 machen und die
 * Sortierung kippen, sobald der Betreiber die Tarife pflegt.
 */
function liabilityValue(tariff: { liability: string }) {
  const match = tariff.liability.replace(/\./g, "").match(/\d+(?:,\d+)?/);
  return match ? Number(match[0].replace(",", ".")) : Number.POSITIVE_INFINITY;
}

export function InsuranceTeaser() {
  // reduce ohne Startwert wirft bei leerer Liste und würde die Startseite
  // beim nächsten Build mitreißen, sobald jemand die Tarife auskommentiert.
  const cheapestLiability = tariffs.length
    ? tariffs.reduce(
        (min, t) => (liabilityValue(t) < liabilityValue(min) ? t : min),
        tariffs[0],
      )
    : null;

  return (
    <Section id="versicherung" tone="ink-800">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="order-2 lg:order-1 lg:col-span-6">
            <p className="eyebrow text-current/55">Pflichtversicherung · ERGO</p>
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
                <dt className="text-sm text-paper/50">Haftpflicht</dt>
                <dd className="tabular mt-1 font-display text-3xl font-extrabold tracking-tight text-flame">
                  {cheapestLiability?.liability ?? "auf Anfrage"}
                </dd>
                <dd className="mt-1 text-xs text-paper/60">
                  je Saison, kein Abo
                </dd>
              </div>
              <div>
                <dt className="text-sm text-paper/50">Kennzeichen per Post</dt>
                <dd className="tabular mt-1 font-display text-3xl font-extrabold tracking-tight">
                  5 – 10
                </dd>
                <dd className="mt-1 text-xs text-paper/60">Werktage</dd>
              </div>
            </dl>

            <p className="mt-6 flex items-start gap-3 text-sm text-paper/50">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-petrol-400"
              />
              Deutschlandweit vermittelbar — Sie müssen dafür nicht in der
              Region Heilbronn wohnen.
            </p>

            <div className="mt-9">
              <ButtonLink href="/versicherung" size="lg">
                Tarife 2026/2027 ansehen
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={90} className="order-1 lg:order-2 lg:col-span-6">
            <figure className="relative overflow-hidden rounded-lg border border-white/12 bg-ink-800">
              <Image
                src="/img/ergo-tarife.jpg"
                alt="Preisaushang der ERGO E-Scooter Tarife für die Saison 2026/2027"
                width={1024}
                height={1536}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-auto w-full object-cover"
              />
            </figure>
            <figcaption className="mt-4 text-sm text-paper/60">
              Preisaushang in der Werkstatt. Alle Tarife auch online — die
              genauen Werte finden Sie auf der Versicherungsseite.
            </figcaption>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
