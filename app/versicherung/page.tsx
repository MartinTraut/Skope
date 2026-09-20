import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, Mail } from "lucide-react";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Related } from "@/components/sections/related";
import { FaqSection } from "@/components/ui/faq";
import { PageHeader } from "@/components/ui/page-header";
import { StatBand } from "@/components/ui/stat-band";
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
import { Steps } from "@/components/ui/steps";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter Versicherung ERGO: Tarife 2026/2027",
  description:
    "E-Scooter Haftpflicht ab 42 €, Teilkasko ab 69 € im Jahr über ERGO. Antrag in Neuenstadt am Kocher oder online, Kennzeichen in 5 bis 10 Werktagen per Post.",
  path: "/versicherung",
});

export default function InsurancePage() {
  /* Die erste Zeile der Tabelle ist die volle Saison – der Preis, der im
     Kopf steht. */
  const season = tariffs[0];

  return (
    <>
      <PageHeader
        crumb="Versicherung"
        eyebrow="ERGO Partner · deutschlandweit"
        title={
          <>
            E-Scooter <Mark>versichern</Mark>, über ERGO.
          </>
        }
        lead="Ab 6 km/h ist die Haftpflicht für jeden E-Scooter Pflicht. Wir vermitteln sie als ERGO-Partner – das Kennzeichen kommt in fünf bis zehn Werktagen per Post."
        asideClassName="lg:col-span-12 xl:col-span-7 xl:col-start-6 xl:justify-self-end xl:self-end"
        aside={
          <StatBand
            items={[
              { label: "Haftpflicht, Saison", value: season.liability },
              {
                label: "Teilkasko inkl. Diebstahl",
                value: season.comprehensive,
              },
              /* „Werktage bis zum Kennzeichen" misst im Fließtextgrad
                 250 px und lief als einzige Angabe des Bandes zweizeilig –
                 die Zelle ist bei 1512 px 240 px breit. Gekürzt, nicht
                 verkleinert: Der Satz sagt dasselbe. */
              { label: "Werktage zum Kennzeichen", value: "5\u201310" },
            ]}
          />
        }
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
          {/* Zwei Spalten ab `lg`: links die Tabelle, rechts der Abschluss
              vor Ort samt Aushang. Vorher stand die Tabelle mit Deckel
              allein in der linken Hälfte, rechts davon 700 px leere Fläche,
              und der Aushang hing als eigener Block darunter. Jetzt liest
              man Preis und Weg zum Kennzeichen nebeneinander – das ist die
              Frage, die beide zusammen beantworten. */}
          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-14">
            <Reveal
              delay={60}
              className="scroll-x lg:col-span-7"
              role="region"
              aria-label="ERGO Tarife für die Saison 2026/2027"
              tabIndex={0}
            >
              {/* Rechtsbündige Werte: Linksbündig standen die Preise mitten
                in der Spalte, rechts davon Luft statt einer Kolonne. */}
              {/* Unter 768 px Karten statt Tabelle.

                  Gemessen bei 320 px: Die Kopfzellen standen 111 px hoch
                  („HAFT-PFLICHT" getrennt über vier Zeilen), jede Datenzeile
                  113 px, weil „01.04.2026 bis 31.03.2027" dreimal umbricht –
                  sechs Zeiträume auf 678 px, in drei Spalten von 118, 84 und
                  70 px. Abgeschnitten war nichts, lesbar war es trotzdem
                  nicht: Eine Tabelle, deren Kopf höher ist als ihre Zeilen,
                  ist keine Tabelle mehr.

                  Dieselben Daten, eine andere Form: je Zeitraum eine Karte
                  mit beiden Preisen nebeneinander und dem Weg ins Formular.
                  Die Position der Zeile reist in der Adresse mit
                  (`?zeitraum=`), das Formular schreibt daraus den Zeitraum
                  in die Nachricht – Wortlaut aus der Tabelle, nicht aus der
                  Adresse. */}
              <ul className="flex flex-col gap-3 md:hidden">
                {tariffs.map((row, i) => (
                  <li
                    key={row.period}
                    className="rounded-lg border border-current/15 bg-current/4 p-4"
                  >
                    <p className="tabular font-display font-semibold tracking-tight">
                      {row.period}
                      {row.full ? (
                        <span className="ml-2 rounded bg-current/10 px-1.5 py-0.5 align-middle font-sans text-[0.6875rem] font-medium tracking-[0.06em] text-current/70 uppercase">
                          volles Jahr
                        </span>
                      ) : null}
                    </p>
                    <dl className="mt-3 grid grid-cols-2 gap-3">
                      <div className="min-w-0">
                        {/* Zwei Zeilen Platz in beiden Zellen: „Teilkasko
                            inkl. Diebstahl" bricht um, „Haftpflicht" nicht –
                            ohne festen Kasten stünden die beiden Preise 18 px
                            versetzt zueinander. */}
                        <dt className="min-h-[2lh] text-[0.6875rem] font-medium tracking-[0.08em] text-current/55 uppercase">
                          Haftpflicht
                        </dt>
                        <dd className="tabular mt-1 font-display text-lg font-bold tracking-tight">
                          {row.liability}
                        </dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="min-h-[2lh] text-[0.6875rem] font-medium tracking-[0.08em] text-current/55 uppercase">
                          Teilkasko inkl. Diebstahl
                        </dt>
                        <dd className="tabular mt-1 font-display text-lg font-bold tracking-tight">
                          {row.comprehensive}
                        </dd>
                      </div>
                    </dl>
                    <Link
                      href={`/versicherung?anliegen=versicherung&zeitraum=${i}#anfrage`}
                      className="press mt-4 inline-flex min-h-11 items-center gap-2 font-display text-sm font-semibold tracking-tight underline decoration-current/40 underline-offset-4"
                    >
                      Diesen Zeitraum anfragen
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </li>
                ))}
              </ul>

              <table className="hidden w-full border-collapse text-left md:table">
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
                      className="py-4 pr-4 text-right font-display text-xs font-semibold tracking-[0.08em] text-current/70 uppercase [hyphens:auto] sm:tracking-[0.14em] sm:pr-6"
                    >
                      Haftpflicht
                    </th>
                    <th
                      scope="col"
                      className="py-4 text-right font-display text-xs font-semibold tracking-[0.08em] text-current/70 uppercase [hyphens:auto] sm:tracking-[0.14em]"
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
                      className="border-b border-current/10 transition-colors duration-200 hover:bg-current/5"
                    >
                      <th
                        scope="row"
                        className="tabular py-5 pr-4 font-sans text-sm font-normal text-current/75 sm:pr-6 sm:text-base"
                      >
                        {row.period}
                      </th>
                      <td className="tabular py-5 pr-4 text-right font-display text-base font-bold tracking-tight text-ink sm:pr-6 sm:text-lg">
                        {row.liability}
                      </td>
                      <td className="tabular py-5 text-right font-display text-base font-bold tracking-tight sm:text-lg">
                        {row.comprehensive}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>

            {/* Der Aushang aus der Werkstatt – als Beleg, nicht als Inhalt.
                Die Preise stehen links als Tabelle, weil ein Bild mit Text
                darin weder durchsuchbar noch vorlesbar noch auf einem
                Telefon lesbar ist. Das Foto zeigt, dass die Zahlen von einem
                echten Aushang stammen – und dafür muss man es lesen können.
                Eine 9-rem-Miniatur neben der Unterschrift war das nicht;
                deshalb volle Spaltenbreite. */}
            <Reveal
              delay={120}
              as="figure"
              className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1"
            >
              <div className="lift-lg overflow-hidden rounded-lg bg-ink">
                <Image
                  src="/img/ergo-aushang.jpg"
                  alt="Preisaushang der Saison 2026/2027: Tabelle mit Haftpflicht- und Teilkaskopreisen je Versicherungszeitraum, Hinweis auf sofortige Mitnahme der Plakette und Zahlung bar oder mit EC-Karte"
                  width={860}
                  height={1190}
                  sizes="(min-width: 1024px) 34vw, (min-width: 768px) calc(100vw - 5rem), calc(100vw - 3rem)"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-4 text-sm leading-relaxed text-current/65">
                Der Preisaushang zur Saison 2026/2027, wie er in der Werkstatt
                hängt. Maßgeblich sind die Werte in der Tabelle; das Kennzeichen
                versendet die ERGO per Post.
              </figcaption>
            </Reveal>
            {/* Die Karte ist das Gegenstück zur Tabelle: links, was es
                kostet, rechts, wie man es bekommt. Sie steht unter der Tabelle,
                der Aushang rechts über beide Reihen – so bleibt links kein
                Loch unter sechs Zeilen. Die Plakette steht über dem Absatz, der sie
                beschreibt – das Ergebnis zuerst, die Erklärung darunter.
                Begründung zur Zeichnung selbst in `components/brand/plate.tsx`. */}
            <Reveal delay={80} className="lg:col-span-7">
              {/* Plakette links, Text rechts, die zwei Wege nebeneinander,
                  der Tarifhinweis über die volle Breite: Als Stapel blieb die
                  rechte Hälfte der Karte leer. */}
              <div className="lift-lg rounded-lg bg-ink p-8 text-silver on-dark md:p-9">
                <div className="grid items-start gap-8 md:grid-cols-[auto_1fr] md:gap-10">
                  <Plate />
                  <div>
                    <h3 className="text-[length:var(--text-subtitle)]">
                      Antrag in der Werkstatt oder online
                    </h3>
                    {/* Zwei Kacheln statt zwei Textspalten ohne Kante, der
                        Versand als eigene Zeile mit Symbol – so liest man
                        drei Aussagen statt einen Block. */}
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-md border border-silver/12 bg-silver/5 p-5">
                        <p className="eyebrow-plain text-current/60">
                          In der Werkstatt
                        </p>
                        <p className="mt-2 leading-relaxed text-current/80">
                          Antrag gemeinsam ausfüllen, Beitrag bar oder mit
                          EC-Karte zahlen.
                        </p>
                      </div>
                      <div className="rounded-md border border-silver/12 bg-silver/5 p-5">
                        <p className="eyebrow-plain text-current/60">Online</p>
                        <p className="mt-2 leading-relaxed text-current/80">
                          Marke, Modell und Zeitraum über das Formular.
                          Rahmennummer und IBAN fragen wir telefonisch ab.
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 flex items-start gap-3 rounded-md bg-silver/5 p-4 leading-relaxed text-current/80">
                      <Mail
                        aria-hidden="true"
                        className="mt-0.5 size-5 shrink-0 text-accent"
                        strokeWidth={1.75}
                      />
                      <span>
                        In beiden Fällen versendet die ERGO das Kennzeichen per
                        Post an Ihre Adresse,{" "}
                        <strong className="font-display font-semibold text-current">
                          innerhalb von fünf bis zehn Werktagen
                        </strong>
                        .
                      </span>
                    </p>
                  </div>
                </div>
                <p className="mt-7 max-w-none border-t border-silver/12 pt-5 text-xs leading-relaxed text-current/55">
                  {tariffDisclaimer}
                </p>
              </div>
            </Reveal>
          </div>
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
            lead="Antrag in der Werkstatt oder online, Weitergabe an die ERGO am selben Werktag, Kennzeichen nach fünf bis zehn Werktagen im Briefkasten. Der längste Teil davon ist der Postweg."
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
          {/* Dieselbe Teilung wie bei den Tarifen: Der Ablauf links, rechts
              die Liste dessen, was man für den Antrag mitbringt – die Frage,
              die beim Lesen von Schritt 01 entsteht. Vorher lief der Ablauf
              als 768 px schmale Spalte an der linken Kante, rechts davon
              nichts, und die Angaben standen als eigener Block darunter. */}
          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-14">
            <Steps
              items={insuranceSteps.map((step) => ({
                n: step.step,
                title: step.title,
                text: step.text,
              }))}
              className="lg:col-span-7"
            />

            <Reveal
              delay={100}
              className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start"
            >
              <div className="lift-lg rounded-lg border border-silver/15 bg-ink p-8 text-silver on-dark md:p-9">
                <FileText
                  aria-hidden="true"
                  className="size-7 text-current/45"
                  strokeWidth={1.5}
                />
                <h3 className="mt-5 text-[length:var(--text-subtitle)]">
                  Diese Angaben brauchen wir für den Antrag
                </h3>
                <ul className="mt-6">
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
                  Lenkstange. Wenn Sie sie nicht finden, suchen wir sie bei
                  einem Termin in der Werkstatt gemeinsam.
                </p>
              </div>
            </Reveal>
          </div>
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
                <InquiryForm
                  defaultTopic="Versicherung: Haftpflicht"
                  topicFromQuery
                  periods={tariffs.map((row) => row.period)}
                />
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
        formHref="#anfrage"
        eyebrow="Versicherung"
        title={
          <>
            Kennzeichen <Mark>rechtzeitig</Mark> bestellen.
          </>
        }
        text="Die ERGO braucht fünf bis zehn Werktage für den Postweg. Wer zum Saisonstart fahren will, stellt den Antrag zwei Wochen vorher."
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
                price: "69.00",
                unit: "ANN",
                from: true,
                description:
                  "Haftpflicht zuzüglich Teilkasko mit Diebstahlschutz. Startpreis der günstigsten Risikoklasse für ein volles Versicherungsjahr; einzelne Monate sind günstiger.",
              },
            ],
          }),
          faqPage(faqInsurance, "/versicherung"),
        ])}
      />
    </>
  );
}
