import type { Metadata } from "next";
import Image from "next/image";
import { FileText } from "lucide-react";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Related } from "@/components/sections/related";
import { FaqSection } from "@/components/ui/faq";
import { PageHeader } from "@/components/ui/page-header";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { faqInsurance } from "@/lib/data/faq";
import {
  insuranceDocs,
  insuranceSteps,
  tariffDisclaimer,
  tariffs,
} from "@/lib/data/insurance";
import { JsonLd, breadcrumb, faqPage, pageGraph, service } from "@/lib/schema";
import { INSURANCE_TOPICS } from "@/lib/data/topics";
import { pageMeta } from "@/lib/seo";
import { Mark } from "@/components/ui/mark";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter Versicherung ERGO: Tarife 2026/2027",
  description:
    "E-Scooter Haftpflicht ab 42 € und Teilkasko ab 49 € über unseren Partner ERGO. Plakette in Neuenstadt am Kocher direkt mitnehmen, online deutschlandweit in 5 bis 10 Werktagen per Post.",
  path: "/versicherung",
  image: "/img/ergo-tarife.jpg",
  imageAlt:
    "Beratung zu den Versicherungsunterlagen am Tresen der Werkstatt in Neuenstadt am Kocher",
});

export default function InsurancePage() {
  return (
    <>
      <PageHeader
        crumb="Versicherung"
        eyebrow="ERGO Partner · deutschlandweit"
        title={
          <>
            E-Scooter <Mark>Versicherung</Mark> mit Plakette zum Mitnehmen.
          </>
        }
        lead="Für jeden E-Scooter mit mehr als 6 km/h Höchstgeschwindigkeit schreibt die Elektrokleinstfahrzeuge-Verordnung eine Haftpflichtversicherung vor. Wir vermitteln sie als ERGO-Partner: In der Werkstatt bekommen Sie das Kennzeichen sofort mit, online schickt es die ERGO deutschlandweit per Post."
      />

      {/* Tarife */}
      <Section id="tarife" tone="silver">
        <Container>
          <SectionHead
            eyebrow="Saisontarife 2026/2027"
            title={
              <>
                Was die Versicherung <Mark>kostet</Mark>.
              </>
            }
            lead="Der Beitrag hängt vom Versicherungszeitraum ab: Wer mitten in der Saison einsteigt, zahlt für weniger Monate. Die Werte sind Startpreise der günstigsten Risikoklasse."
          />

          {/* Die Tabelle passt jetzt auch auf ein 320-px-Telefon.
              Vorher stand hier `min-w-[36rem]`, also 576 px erzwungene Breite in
              einer 272 px breiten Spalte: Zwei Drittel der Preise lagen
              ausserhalb des Bildes, und man musste in einer Tabelle waagerecht
              wischen, um die zweite Zahl zu sehen. Gemessen braucht die Tabelle
              ohne Mindestbreite 235 px – die Zeitspanne bricht auf zwei Zeilen,
              und beide Preisspalten stehen daneben.

              `.scroll-x` bleibt als Netz für die Zwischenbreiten und für
              größere Schriftgrade; die Klasse hält zusätzlich das Weiterziehen
              in der Tabelle davon ab, die Seite zurückzublättern. `tabIndex`
              bleibt ebenfalls: Solange die Fläche überhaupt rollen kann, muss
              sie per Tastatur erreichbar sein (WCAG 2.1.1). */}
          <Reveal
            delay={60}
            className="scroll-x mt-14"
            role="region"
            aria-label="ERGO Tarife für die Saison 2026/2027"
            tabIndex={0}
          >
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                ERGO Tarife für E-Scooter, Saison 2026/2027, nach
                Versicherungszeitraum
              </caption>
              <thead>
                <tr className="border-b border-current/20">
                  <th
                    scope="col"
                    className="py-4 pr-4 font-display text-xs font-semibold tracking-[0.08em] text-current/70 uppercase [hyphens:auto] sm:tracking-[0.14em] sm:pr-6"
                  >
                    Zeitraum
                  </th>
                  <th
                    scope="col"
                    className="py-4 pr-4 font-display text-xs font-semibold tracking-[0.08em] text-current/70 uppercase [hyphens:auto] sm:tracking-[0.14em] sm:pr-6"
                  >
                    Haftpflicht
                  </th>
                  <th
                    scope="col"
                    className="py-4 font-display text-xs font-semibold tracking-[0.08em] text-current/70 uppercase [hyphens:auto] sm:tracking-[0.14em]"
                  >
                    Teilkasko inkl. Diebstahl
                  </th>
                </tr>
              </thead>
              <tbody>
                {tariffs.map((row) => (
                  <tr key={row.period} className="border-b border-current/10">
                    <th
                      scope="row"
                      className="tabular py-5 pr-4 font-sans text-sm font-normal text-current/75 sm:pr-6 sm:text-base"
                    >
                      {row.period}
                    </th>
                    <td className="tabular py-5 pr-4 font-display text-base font-bold tracking-tight text-ink sm:pr-6 sm:text-lg">
                      {row.liability}
                    </td>
                    <td className="tabular py-5 font-display text-base font-bold tracking-tight sm:text-lg">
                      {row.comprehensive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          {/* Der Aushang aus der Werkstatt – als Beleg, nicht als Inhalt.
              Die Preise stehen darüber als Tabelle, weil ein Bild mit Text
              darin weder durchsuchbar noch vorlesbar noch auf einem Telefon
              lesbar ist. Das Foto daneben leistet etwas anderes: Es zeigt,
              dass die Zahlen von einem echten Aushang stammen und nicht aus
              einer Marketingtabelle. Deshalb steht es hier unter der Tabelle
              und nicht an ihrer Stelle – und in einer Größe, in der man es
              ansehen kann. */}
          <Reveal
            delay={80}
            className="mt-16 grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
          >
            {/* Vier Spalten, nicht fünf, und mittig statt oben ausgerichtet:
                Das Hochformat wird bei fünf Spalten 770 px hoch, der Text
                daneben ist 250 px – gemessen blieb eine halbe Bildschirmhöhe
                leere Fläche rechts. */}
            <figure className="lg:col-span-4">
              <div className="lift-lg overflow-hidden rounded-lg bg-ink">
                <Image
                  src="/img/ergo-aushang.jpg"
                  alt="Preisaushang der Saison 2026/2027: Tabelle mit Haftpflicht- und Teilkaskopreisen je Versicherungszeitraum, Hinweis auf sofortige Mitnahme der Plakette und Zahlung bar oder mit EC-Karte"
                  width={860}
                  height={1190}
                  sizes="(min-width: 1024px) 24vw, 100vw"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-4 text-sm text-current/65">
                Der Preisaushang zur Saison 2026/2027, wie er in der Werkstatt
                hängt. Maßgeblich sind die Werte in der Tabelle oben.
              </figcaption>
            </figure>

            <div className="lg:col-span-7 lg:col-start-6">
              <h3 className="text-[length:var(--text-subtitle)]">
                Abschluss direkt vor Ort
              </h3>
              <p className="mt-4 leading-relaxed text-current/70">
                Wir haben die Versicherungskennzeichen in der Werkstatt
                vorrätig. Antrag ausfüllen, Beitrag bar oder mit EC-Karte
                zahlen, Plakette ans Heck. Wer mit dem Scooter oder der
                Rahmennummer vorbeikommt, fährt versichert wieder weg. Der
                Postweg der ERGO betrifft nur die Online-Anfrage.
              </p>
              <p className="mt-8 text-xs leading-relaxed text-current/60">
                {tariffDisclaimer}
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Ablauf */}
      <Section tone="silver-200">
        <Container>
          <SectionHead
            eyebrow="Vom Antrag zum Kennzeichen"
            title={
              <>
                <Mark>Vier</Mark> Schritte bis zur Plakette.
              </>
            }
            lead="Wer den Antrag bei uns in der Werkstatt stellt, fährt am selben Tag mit Kennzeichen weg. Online dauert es eine bis zwei Wochen; der längste Teil davon ist der Postweg der ERGO."
          />

          {/* Der Ablauf als Kette mit sichtbaren Gliedern.
              Vorher: eine 1 px dünne Linie am linken Rand, daran vier graue
              Punkte, die neben der Schrittnummer standen statt auf ihr, und
              vier Textblöcke ohne Unterschied. Die Zahl 01 war 13 px groß und
              damit kleiner als der Fließtext darunter – ein Ablauf, dessen
              Reihenfolge man suchen muss, ist keiner.

              Jetzt trägt die Nummer selbst den Punkt: Neon als Fläche mit
              dunkler Ziffer, das ist auf Silber die einzige zulässige Form
              (Neon als Schrift läge bei 1,18:1). Die Linie läuft zwischen den
              Scheiben und endet mit dem letzten Schritt, statt ins Leere zu
              zeigen. */}
          <ol className="mt-14 max-w-3xl">
            {insuranceSteps.map((step, i) => (
              <Reveal
                key={step.step}
                delay={i * 70}
                as="li"
                className="relative grid grid-cols-[3rem_1fr] gap-x-5 pb-12 last:pb-0 sm:grid-cols-[3.5rem_1fr] sm:gap-x-8"
              >
                {i < insuranceSteps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-14 bottom-0 left-6 w-px bg-ink/15 sm:top-16 sm:left-7"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="tabular grid size-12 place-items-center rounded-full bg-neon font-display text-lg font-bold tracking-tight text-ink sm:size-14 sm:text-xl"
                >
                  {step.step}
                </span>

                <div className="min-w-0 pt-1.5 sm:pt-2.5">
                  <h3 className="text-[length:var(--text-subtitle)]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 leading-relaxed text-current/65">
                    {step.text}
                  </p>

                  {/* Die Weiche als zwei Flächen, nicht als ein Absatz.
                      Beide Wege in einem Fließtext zu nennen zwingt jeden
                      Leser, den für ihn falschen mitzulesen und die eigene
                      Frist herauszusuchen. Nebeneinander beantwortet die
                      Zeile „sofort" gegen „5 bis 10 Werktage" die Frage im
                      Vorbeigehen – und die Antwort, die uns Kunden in den
                      Laden bringt, ist die farbige. */}
                  {step.branches && (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {step.branches.map((branch) => (
                        <div
                          key={branch.label}
                          className="rounded-md bg-silver p-5"
                        >
                          <p className="text-sm text-current/65">
                            {branch.label}
                          </p>
                          <p
                            className={
                              branch.instant
                                ? "mt-2 inline-block rounded-full bg-neon px-3 py-1 font-display text-lg font-bold tracking-tight text-ink"
                                : "tabular mt-2 font-display text-lg font-bold tracking-tight"
                            }
                          >
                            {branch.value}
                          </p>
                          <p className="mt-3 text-sm leading-relaxed text-current/65">
                            {branch.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={100}>
            <div className="mt-16 rounded-lg border border-silver/15 lift-lg bg-ink p-8 md:p-10 text-silver on-dark">
              <FileText
                aria-hidden="true"
                className="size-7 text-current/45"
                strokeWidth={1.5}
              />
              <h3 className="mt-5 text-[length:var(--text-subtitle)]">
                Diese Angaben brauchen wir für den Antrag
              </h3>
              <ul className="mt-6 grid gap-x-10 md:grid-cols-3">
                {insuranceDocs.map((doc) => (
                  <li
                    key={doc}
                    className="border-t border-silver/12 py-4 text-current/75"
                  >
                    {doc}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-current/65">
                Die Rahmennummer finden Sie meist am Trittbrett oder an der
                Lenkstange. Wenn Sie sie nicht finden, suchen wir sie bei einem
                Termin in der Werkstatt gemeinsam.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Anfrage */}
      <Section id="anfrage" tone="ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow text-current/90">Versicherung anfragen</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  <Mark>Antrag</Mark> anstoßen.
                </h2>
                <p className="mt-6 leading-relaxed text-current/65">
                  Schreiben Sie uns Marke, Modell und den gewünschten
                  Versicherungszeitraum. Wir melden uns mit dem konkreten
                  Beitrag und den nächsten Schritten. Sensible Daten wie IBAN
                  und Rahmennummer nehmen wir anschließend auf sicherem Weg auf,
                  nicht über dieses Formular.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={80}>
                <InquiryForm topics={INSURANCE_TOPICS} />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="silver">
        <FaqSection
          eyebrow="Häufige Fragen zur Versicherung"
          title={
            <>
              <Mark>Pflicht</Mark>, Preis, Kennzeichen.
            </>
          }
          lead="Die Fragen, die vor jedem Saisonstart kommen, inklusive der wichtigsten: Was passiert, wenn ich ohne Plakette fahre?"
          items={faqInsurance}
        />
      </Section>

      <Related
        items={[
          {
            href: "/e-scooter",
            label: "Geprüfte E-Scooter",
            text: "Vor dem Kennzeichen kommt das Gerät: generalüberholt, mit einem Jahr Gewährleistung.",
          },
          {
            href: "/reparatur",
            label: "Reparatur",
            text: "Rahmennummer nicht auffindbar? Bei einem Werkstatttermin suchen wir sie gemeinsam.",
          },
        ]}
      />

      <CtaBand
        eyebrow="Versicherung"
        title={
          <>
            Kennzeichen <Mark>rechtzeitig</Mark> bestellen.
          </>
        }
        text="In der Werkstatt gibt es die Plakette sofort. Wer online anfragt, sollte fünf bis zehn Werktage Postweg einplanen. Zum Saisonstart wird es sonst knapp."
      />

      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "Versicherung", path: "/versicherung" }]),
          service({
            name: "E-Scooter Versicherung über ERGO",
            description:
              "Vermittlung von Haftpflicht- und Teilkaskoversicherungen für Elektrokleinstfahrzeuge über den Partner ERGO, inklusive Versicherungskennzeichen. Deutschlandweit verfügbar.",
            path: "/versicherung",
            serviceType: "E-Scooter Versicherung",
            // Anders als Reparatur und Verkauf ist die Vermittlung nicht an den
            // Standort gebunden – genau das steht auch sichtbar im FAQ.
            areaServed: [{ "@type": "Country", name: "Deutschland" }],
            offers: [
              {
                name: "Haftpflichtversicherung E-Scooter (ERGO)",
                price: "42.00",
                unit: "ANN",
                from: true,
                description:
                  "Gesetzlich vorgeschriebene Haftpflicht inklusive Versicherungskennzeichen. Startpreis der günstigsten Risikoklasse für ein volles Versicherungsjahr.",
              },
              {
                name: "Teilkasko inklusive Diebstahlschutz (ERGO)",
                price: "49.00",
                unit: "ANN",
                from: true,
                description:
                  "Haftpflicht zuzüglich Teilkasko mit Diebstahlschutz. Startpreis der günstigsten Risikoklasse.",
              },
            ],
          }),
          faqPage(faqInsurance, "/versicherung"),
        ])}
      />
    </>
  );
}
