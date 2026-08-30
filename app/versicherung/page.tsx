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
import { pageMeta } from "@/lib/seo";
import { Mark } from "@/components/ui/mark";
import { Plate } from "@/components/brand/plate";

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
                  /* Die Zeile hebt sich beim Zeigen an: In einer Tabelle mit
                     sechs Zeitspannen und zwei Preisspalten verrutscht sonst
                     genau die Zeile, die man vergleicht. */
                  <tr
                    key={row.period}
                    className="border-b border-current/10 transition-colors duration-150 hover:bg-current/5"
                  >
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
                  sizes="(min-width: 1024px) 24vw, (min-width: 768px) calc(100vw - 5rem), calc(100vw - 3rem)"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-4 text-sm text-current/65">
                Der Preisaushang zur Saison 2026/2027, wie er in der Werkstatt
                hängt. Maßgeblich sind die Werte in der Tabelle oben.
              </figcaption>
            </figure>

            <div className="lg:col-span-7 lg:col-start-6">
              {/* Die Plakette steht über dem Absatz, der sie beschreibt –
                  das Ergebnis zuerst, die Erklärung darunter. Begründung
                  zur Zeichnung selbst in `components/brand/plate.tsx`. */}
              <Plate className="mb-7" />
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
                className="relative grid grid-cols-[2.75rem_1fr] items-center gap-x-4 gap-y-3 pb-12 last:pb-0 sm:grid-cols-[3.5rem_1fr] sm:items-start sm:gap-x-8 sm:gap-y-0"
              >
                {i < insuranceSteps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="chain-draw absolute top-12 bottom-0 left-[1.375rem] w-px bg-ink/25 sm:top-16 sm:left-7"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="tabular grid size-11 place-items-center self-start rounded-full bg-neon font-display text-base font-bold tracking-tight text-ink sm:size-14 sm:row-span-2 sm:text-xl"
                >
                  {step.step}
                </span>

                {/* Am Telefon steht die Nummer neben der Überschrift, der
                    Fließtext darunter über die volle Breite.

                    Als durchgehende zweite Spalte war der Satz bei 390 px
                    nur 274 px breit, in den verschachtelten Kästen 234 px –
                    gemessen 23 bis 25 Zeichen je Zeile, wo der Satzspiegel
                    342 px hergibt. Ein Ablauf, dessen Erklärung in einer
                    Rinne steht, liest sich mühsamer als er ist. Ab `sm` ist
                    genug Platz, dort bleibt die Nummer über beide Zeilen
                    stehen und der Text rückt wieder ein. */}
                <h3 className="text-[length:var(--text-subtitle)]">
                  {step.title}
                </h3>

                <div className="col-span-2 min-w-0 sm:col-span-1 sm:col-start-2 sm:pt-2.5">
                  <p className="leading-relaxed text-current/65 sm:mt-2.5">
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
      <Section tone="ink">
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
            {/* Der Anker sitzt an der Formularspalte, nicht an der Sektion.

                An der Sektion landete jeder Knopf, der „Anfrage" heißt, auf
                der Überschrift: Gemessen bei 390 px stand die Sektionsoberkante
                bei 184 px und das erste Feld bei 646 px, während zwischen
                Kopfzeile und Aktionsleiste nur 696 px nutzbar sind – ein Feld
                von sechs im Bild, für den Rest noch ein Wisch. Der
                Abstandshalter lässt die Überschrift oben angeschnitten stehen,
                damit klar bleibt, wozu das Formular gehört. */}
            <div id="anfrage" className="scroll-mt-32 lg:col-span-7">
              <Reveal delay={80}>
                <InquiryForm defaultTopic="Versicherung: Haftpflicht" />
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

      {/* Der Flächenwechsel ist der einzige Rhythmusgeber der Seite, und an
          den Nahtstellen zum Abschluss fiel er aus: `Related` stand auf allen
          Seiten außer der Reparaturseite auf Tinte und ging damit ohne Kante
          in das ebenfalls dunkle `CtaBand` über – gemessen auf /e-scooter
          1220 px ununterbrochene Tinte. Der Ton ist deshalb je Seite gesetzt:
          verschieden vom Block davor und verschieden vom Abschluss. */}
      <Related
        tone="silver-200"
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
