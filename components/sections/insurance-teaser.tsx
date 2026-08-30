import { ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { Mark } from "@/components/ui/mark";
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
  // Tabelle gehört zu einem Ein-Monats-Zeitraum – als „je Saison" ausgegeben
  // wäre das ein zu niedriger Preis an der prominentesten Stelle der Seite.
  const fullYear = tariffs.find((t) => t.full);

  return (
    <Section id="versicherung" tone="ink">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Text zuerst, Tafel danach – auch im DOM.

              `order-2` drehte nur das Bild: Am Telefon stand die
              Tariftabelle mit vier Datums- und Preiszeilen *vor* ihrer
              eigenen Überschrift, und ein Screenreader las die Preise, bevor
              gesagt war, wofür sie gelten. Eine Preistabelle ohne
              vorangehende Überschrift lässt sich auf 390 px nicht einordnen
              (WCAG 1.3.2). Ab `lg` dreht `lg:order-*` die Spalten wie zuvor;
              am Schreibtisch ändert sich nichts. */}
          <Reveal className="lg:order-1 lg:col-span-6">
            <p className="eyebrow text-current/90">
              Pflichtversicherung · ERGO
            </p>
            <h2 className="mt-5 text-[length:var(--text-display)]">
              Ohne <Mark>Kennzeichen</Mark> kein Straßenverkehr.
            </h2>
            <p className="mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-current/70">
              Für jeden E-Scooter mit mehr als 6 km/h Höchstgeschwindigkeit ist
              die Haftpflicht gesetzlich vorgeschrieben (eKFV, § 1 PflVG). Ohne
              gültige Plakette drohen Bußgeld und volle persönliche Haftung.
            </p>

            <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-current/12 py-8">
              <div>
                <dt className="text-sm text-current/65">Haftpflicht</dt>
                <dd className="tabular mt-1 font-display text-3xl font-bold tracking-tight text-accent">
                  {fullYear?.liability ?? "auf Anfrage"}
                </dd>
                <dd className="mt-1 text-xs text-current/65">
                  volles Versicherungsjahr, kein Abo
                </dd>
              </div>
              {/* „Sofort" statt „5 bis 10 Werktage". Die Frist gilt für den
                  Postweg der ERGO und damit für die Online-Anfrage; wer in die
                  Werkstatt kommt, nimmt die Plakette mit. Von beiden Angaben
                  ist die kürzere das Argument, und sie steht hier neben dem
                  Preis, weil genau diese zwei Zahlen die Entscheidung
                  tragen. Die Frist steht darunter im Fließtext. */}
              <div>
                <dt className="text-sm text-current/65">Plakette vor Ort</dt>
                <dd className="tabular mt-1 font-display text-3xl font-bold tracking-tight">
                  sofort
                </dd>
                <dd className="mt-1 text-xs text-current/65">
                  zum Mitnehmen, bar oder EC
                </dd>
              </div>
            </dl>

            <p className="mt-6 flex items-start gap-3 text-sm text-current/65">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-current/75"
              />
              Deutschlandweit vermittelbar. Sie müssen dafür nicht in der Region
              Heilbronn wohnen.
            </p>

            <div className="mt-9">
              <ButtonLink href="/versicherung#tarife" size="lg">
                Alle Tarife 2026/2027 ansehen
              </ButtonLink>
            </div>
          </Reveal>

          {/* Tariftafel – dieselben Werte wie auf der Versicherungsseite,
              gekürzt auf die vier Zeiträume, nach denen tatsächlich gefragt wird. */}
          <Reveal delay={90} className="lg:order-2 lg:col-span-6">
            <div className="rounded-lg border border-current/12 bg-steel-900/60 p-7 md:p-9">
              <p className="eyebrow-plain text-current/90">Saison 2026/2027</p>
              <dl className="mt-7">
                {tariffs.slice(0, 4).map((row) => (
                  <div
                    key={row.period}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-current/12 py-4"
                  >
                    <dt className="tabular text-sm text-current/75">
                      {row.period}
                    </dt>
                    <dd className="tabular font-display text-lg font-bold tracking-tight">
                      {row.liability}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 border-t border-current/12 pt-5 text-xs leading-relaxed text-current/65">
                Haftpflicht, Startpreise der günstigsten Risikoklasse. Teilkasko
                mit Diebstahlschutz und die übrigen Zeiträume stehen auf der
                Versicherungsseite.
              </p>
            </div>

            {/* Nur der Rechtshinweis, ohne Bild.
                Hier stand ein 72 × 96 px großes Foto neben dem Kleingedruckten
                – zu klein, um irgendetwas zu zeigen, und an der einzigen
                Stelle des Abschnitts, an der niemand ein Bild sucht. Ein
                Briefmarkenbild neben einer Haftungsklausel wertet weder das
                Bild noch die Klausel auf. Der Aushang steht jetzt in voller
                Größe auf der Versicherungsseite, dort, wo die Tabelle ihn
                belegt. */}
            <p className="mt-6 text-xs leading-relaxed text-current/60">
              {tariffDisclaimer}
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
