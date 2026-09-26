import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, FileText, Mail } from "lucide-react";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Related } from "@/components/sections/related";
import { FaqSection } from "@/components/ui/faq";
import { PageHeader } from "@/components/ui/page-header";
import { StatBand } from "@/components/ui/stat-band";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { GeneratedMark } from "@/components/ui/generated-mark";
import { generatedPosterNotice } from "@/lib/data/generated-images";
import { faqInsurance } from "@/lib/data/faq";
import {
  comprehensiveDeductible,
  comprehensiveScope,
  insuranceDocs,
  insuranceSteps,
  seasonEnd,
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

/* Der Aushang steht an drei Stellen im Bauteil – Bild, Kennzeichnung und
   Verzeichnisabfrage. Ein Pfad, der zweimal getippt wird, läuft beim nächsten
   Austausch auseinander, und dann fehlt die Kennzeichnung. */
const AUSHANG = [
  {
    src: "/img/ergo-plakat-2026-2027.jpg",
    alt: "Plakat der Saison 2026/2027: E-Scooter vor einer Stadtkulisse, Saisonzeitraum 01.03.2026 bis 28.02.2027, drei Hinweise – gesetzlich vorgeschrieben, Haftpflicht oder optional mit Teilkasko, Plakette per Post – und die ERGO als Vertriebspartner",
  },
  {
    src: "/img/ergo-aushang-2026-2027.jpg",
    alt: "Tarifblatt der Saison 2026/2027: Tabelle mit zwölf Versicherungszeiträumen, je Zeile der Haftpflicht- und der Gesamtbeitrag mit Teilkasko, darunter der Umfang der Teilkasko, die Selbstbeteiligung und der Ablauf vom Kauf bis zum Kennzeichen per Post",
  },
];

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
            lead="Jeder Zeitraum läuft bis zum Saisonende am 28.02.2027. Wer später einsteigt, zahlt anteilig nur den Rest – die Werte sind Startpreise der günstigsten Risikoklasse."
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
              className="scroll-x lg:col-span-7 lg:row-span-2 lg:row-start-1"
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
              {/* Unter `md` dieselben Daten als Zeilen, nicht als Karten.

                  Mit dem Aushang der Saison 2026/2027 sind es zwölf
                  Zeiträume statt sechs. Als Karte mit Kopfzeile, zwei
                  Preiszellen und eigenem Verweis maß eine Zeile 168 px –
                  zwölf davon wären gut 2000 px, eine Tariftabelle über zwei
                  Bildschirmhöhen. Möglich wird die Zeile durch die Daten
                  selbst: Alle Zeiträume enden am selben Tag, es steht also
                  nur noch der Beginn in der Zelle. Gemessen bei 320 px
                  passen „ab 01.04.2026" und beide Beträge in eine Zeile.

                  Die ganze Zeile ist der Verweis – die Position reist wie
                  bisher als `?zeitraum=` mit, das Formular schreibt daraus
                  den Wortlaut aus der Tabelle in die Nachricht. */}
              <ul className="flex flex-col md:hidden">
                {tariffs.map((row, i) => (
                  <li key={row.period} className="border-t border-current/15">
                    <Link
                      href={`/versicherung?anliegen=versicherung&zeitraum=${i}#anfrage`}
                      className="press flex min-h-14 items-center justify-between gap-3 py-3"
                    >
                      <span className="tabular flex min-w-0 items-baseline gap-2 text-sm text-current/75">
                        ab {row.start}
                        {row.full ? (
                          <span className="rounded bg-current/10 px-1.5 py-0.5 text-[0.625rem] font-medium tracking-[0.06em] text-current/70 uppercase">
                            Saison
                          </span>
                        ) : null}
                      </span>
                      {/* Feste Spaltenbreite: „ab 7 €" ist zwei Ziffern
                          schmaler als „ab 42 €", und ohne Kasten wandert die
                          Teilkaskospalte über die zwölf Zeilen hin und her. */}
                      <span className="tabular flex shrink-0 items-baseline font-display font-bold tracking-tight">
                        <span className="w-[4.25rem] text-right">
                          {row.liability}
                        </span>
                        <span className="w-[4.25rem] text-right text-current/55">
                          {row.comprehensive}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {/* Die Beschriftung der beiden Zahlenspalten steht unter der
                  Liste, nicht über jeder Zeile: In der Zeile wäre sie
                  zwölfmal dasselbe Wortpaar. */}
              <p className="mt-3 flex justify-end border-t border-current/15 pt-3 text-[0.6875rem] font-medium tracking-[0.08em] text-current/55 uppercase md:hidden">
                <span className="w-[4.25rem] text-right">Haftpfl.</span>
                <span className="w-[4.25rem] text-right">Teilkasko</span>
              </p>

              <table className="hidden w-full border-collapse text-left md:table">
                <caption className="sr-only">
                  ERGO Tarife für E-Scooter, Saison 2026/2027. Jeder
                  Versicherungszeitraum endet am 28.02.2027; der Beitrag gilt
                  anteilig für den Rest der Saison.
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
                     zwölf Zeitspannen und zwei Preisspalten verrutscht sonst
                     genau die Zeile, die man vergleicht. */
                    <tr
                      key={row.period}
                      className="border-b border-current/10 transition-colors duration-200 hover:bg-current/5"
                    >
                      <th
                        scope="row"
                        className="tabular py-4 pr-4 font-sans text-sm font-normal text-current/75 sm:pr-6 sm:text-base"
                      >
                        {row.period}
                      </th>
                      <td className="tabular py-4 pr-4 text-right font-display text-base font-bold tracking-tight text-ink sm:pr-6 sm:text-lg">
                        {row.liability}
                      </td>
                      <td className="tabular py-4 text-right font-display text-base font-bold tracking-tight sm:text-lg">
                        {row.comprehensive}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Die Regel hinter der Reihe, einmal ausgeschrieben. Ohne sie
                  liest sich die fallende Spalte wie ein Rabatt für späte
                  Kunden statt wie das, was sie ist: weniger Monate. */}
              <p className="mt-5 border-t border-current/15 pt-5 text-sm leading-relaxed text-current/65">
                Alle Zeiträume enden am {seasonEnd}, dem Ende der Saison. Wer
                später einsteigt, zahlt anteilig nur den Rest – der Schutz
                endet trotzdem am selben Tag.
              </p>
            </Reveal>

            {/* Die Karte ist das Gegenstück zur Tabelle: links, was es
                kostet, rechts, wie man es bekommt. Sie steht unter der Tabelle,
                der Aushang rechts über beide Reihen – so bleibt links kein
                Loch unter sechs Zeilen. Die Plakette steht über dem Absatz, der sie
                beschreibt – das Ergebnis zuerst, die Erklärung darunter.
                Begründung zur Zeichnung selbst in `components/brand/plate.tsx`. */}
            <Reveal
              delay={80}
              className="lg:col-span-5 lg:col-start-8 lg:row-start-1"
            >
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
                    {/* Zwei Spalten nur, solange die Karte über die volle
                        Breite läuft. Ab `lg` steht sie in einer 5-Spalten-
                        Spalte neben der Tabelle; zwei Kacheln darin sind je
                        220 px breit, und „Rahmennummer" stand bei 1024 px an
                        der Kante. Dort also untereinander – die Höhe wird
                        neben zwölf Tarifzeilen ohnehin gebraucht. */}
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
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

            {/* Was die zweite Preisspalte abdeckt.

                Die Tabelle nennt einen Teilkaskobeitrag, und bis zum
                26.09.2026 stand nirgends, wofür er einspringt und was im
                Schadensfall selbst zu tragen ist. Ein Kaskopreis ohne
                Selbstbeteiligung ist eine halbe Preisangabe – beides steht
                im Aushang der Saison und gehört deshalb auf die Seite.

                Zwei Spalten ab `sm`: Acht Einträge untereinander wären am
                Telefon eine Liste über den halben Bildschirm, und sie sind
                kurz genug für zwei Spalten. */}
            <Reveal
              delay={100}
              className="lg:col-span-5 lg:col-start-8 lg:row-start-2"
            >
              <div className="rounded-lg border border-current/15 bg-current/4 p-7 md:p-8">
                <h3 className="text-[length:var(--text-subtitle)]">
                  Was die Teilkasko abdeckt
                </h3>
                <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
                  {comprehensiveScope.map((item) => (
                    <li
                      key={item}
                      className="flex max-w-none items-center gap-3 border-t border-current/12 py-3 text-current/80"
                    >
                      <Check
                        aria-hidden="true"
                        className="size-4 shrink-0 text-current/45"
                        strokeWidth={2.25}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 border-t border-current/15 pt-5">
                  {comprehensiveDeductible.map((row) => (
                    <div key={row.label} className="flex items-baseline gap-3">
                      <dt className="text-sm text-current/65">
                        Selbstbeteiligung, {row.label.toLowerCase()}
                      </dt>
                      <dd className="tabular font-display font-bold tracking-tight">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>

          {/* Beide Seiten des Aushangs, als Beleg unter dem, was sie belegen.

              Sie standen bis zum 26.09.2026 als eine schmale Spalte neben der
              Tabelle – dort passte genau ein Blatt hinein, und das zweite
              hätte die Spalte auf 2300 px getrieben, während links nach
              785 px Tabelle nichts mehr kommt. Als eigene Reihe stehen beide
              nebeneinander und dürfen jeweils so breit werden, wie die Datei
              es hergibt.

              Nebeneinander erst ab 1280 px, nicht ab `sm`: Bei 640 px blieben
              je Spalte 280 px, bei 768 px 328 – die Tariftabelle auf dem
              zweiten Blatt stünde dort in rund 5 px Schrift. Darunter also
              untereinander, jedes Blatt in voller Breite bis zum Deckel.

              Der Deckel von 38 rem ist die echte Breite der Dateien
              (609 px). Ohne ihn liefe jedes Blatt bei 1512 px auf 716 px
              Anzeigebreite hinaus, bei doppelter Pixeldichte also 1432
              Gerätepixel aus einer 609-px-Quelle. Ein Blatt aus Schrift
              verträgt das nicht, und hochrechnen hilft nicht, wo die
              Kantenzeichnung fehlt.
              TODO Betreiber: höher aufgelöster Export, dann fällt der Deckel. */}
          <div className="mt-14 grid gap-8 min-[1280px]:grid-cols-2 min-[1280px]:gap-8">
            {AUSHANG.map((sheet, i) => (
              <Reveal key={sheet.src} delay={i * 80}>
                <div className="lift-lg relative mx-auto max-w-[38rem] overflow-hidden rounded-lg bg-ink">
                  <Image
                    src={sheet.src}
                    alt={sheet.alt}
                    width={609}
                    height={1158}
                    /* Reine Stufen, kein `min()`: Chromium löst es in `sizes`
                       nicht auf und fällt still auf `100vw` zurück. */
                    sizes="(min-width: 640px) 38rem, calc(100vw - 3rem)"
                    className="h-auto w-full"
                  />
                  <GeneratedMark
                    src={sheet.src}
                    notice={generatedPosterNotice}
                  />
                </div>
              </Reveal>
            ))}
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
          eyebrow="Häufige Fragen"
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
                  "Haftpflicht zuzüglich Teilkasko mit Diebstahlschutz, Selbstbeteiligung 150 € je Schaden und 300 € bei Totalentwendung. Startpreis der günstigsten Risikoklasse für die volle Saison; wer später einsteigt, zahlt anteilig weniger.",
              },
            ],
          }),
          faqPage(faqInsurance, "/versicherung"),
        ])}
      />
    </>
  );
}
