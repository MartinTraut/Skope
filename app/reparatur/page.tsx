import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  BatteryCharging,
  CircuitBoard,
  Cog,
  Timer,
  Wrench,
} from "lucide-react";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Region } from "@/components/sections/region";
import { Related } from "@/components/sections/related";
import { FaqSection } from "@/components/ui/faq";
import { PageHeader } from "@/components/ui/page-header";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { faqRepair } from "@/lib/data/faq";
import {
  brands,
  priceAnchors,
  repairAreas,
  turnaround,
} from "@/lib/data/services";
import { JsonLd, breadcrumb, faqPage, pageGraph, service } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { priceNote } from "@/lib/site";
import { Mark } from "@/components/ui/mark";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter Reparatur Heilbronn & Neuenstadt",
  description:
    "E-Scooter Reparatur für Heilbronn und Neckarsulm: Akku, Elektronik, Bremsen, Motor. Alle Marken, Kostenvoranschlag vorab, Bremsen oft am selben Tag. Jetzt anfragen.",
  path: "/reparatur",
  image: "/img/akku-diagnose.jpg",
  imageAlt:
    "Kapazitätsmessung an einem geöffneten E-Scooter-Akku auf der Werkbank",
});

/**
 * Ein Zeichen je Kompetenzfeld.
 *
 * Steht hier und nicht in `lib/data/services.ts`: Die Datendatei trägt
 * Fakten der Werkstatt, ein Icon ist Darstellung. Wer ein Feld ergänzt,
 * bekommt über den Rückfall auf `Wrench` trotzdem eine vollständige Karte
 * statt einer Lücke.
 */
const areaIcons: Record<string, LucideIcon> = {
  elektronik: CircuitBoard,
  akku: BatteryCharging,
  mechanik: Wrench,
  motor: Cog,
};

const steps = [
  {
    n: "01",
    title: "Sie beschreiben das Symptom",
    text: "Am Telefon oder über das Formular. Fehlermeldung, Geräusch, Reichweite, seit wann: je konkreter, desto schneller die Einschätzung.",
  },
  {
    n: "02",
    title: "Wir messen, statt zu raten",
    text: "Fehlerspeicher auslesen, Restkapazität des Akkus messen, Bauteile einzeln prüfen. Erst danach steht fest, was tatsächlich defekt ist.",
  },
  {
    n: "03",
    title: "Kostenvoranschlag vor der Arbeit",
    text: "Sie bekommen den Preis, bevor etwas geöffnet oder getauscht wird. Was Sie nicht freigeben, passiert nicht.",
  },
  {
    n: "04",
    title: "Reparatur und Sicherheitsfreigabe",
    text: "Nach der Reparatur läuft die vollständige Funktionsprüfung. Der Scooter geht nur fahrbereit und sicher wieder raus.",
  },
];

export default function RepairPage() {
  return (
    <>
      <PageHeader
        crumb="Reparatur"
        eyebrow="Werkstatt für Elektrokleinstfahrzeuge"
        title={
          <>
            E-Scooter <Mark>Reparatur</Mark> in Neuenstadt am Kocher.
          </>
        }
        lead="Ein defekter E-Scooter ist selten ein Totalschaden. In den meisten Fällen sind es Bremsen, Reifen, ein einzelner Sensor oder eine schwache Zelle im Akku. Alles reparierbar, zu einem Bruchteil des Neupreises."
        aside={
          <dl className="grid grid-cols-2 gap-x-10 gap-y-6">
            <div>
              <dt className="eyebrow-plain text-current/60">
                Reparierte Scooter
              </dt>
              <dd className="tabular mt-2 font-display text-4xl font-bold tracking-tight">
                500+
              </dd>
            </div>
            <div>
              <dt className="eyebrow-plain text-current/60">
                Diagnose im Checkup
              </dt>
              {/* Neon nur auf dem Geldbetrag – siehe Akzentregel in globals.css */}
              <dd className="tabular mt-2 font-display text-4xl font-bold tracking-tight text-accent">
                59,99&nbsp;€
              </dd>
            </div>
          </dl>
        }
      />

      {/* Kompetenzfelder */}
      <Section tone="silver">
        <Container>
          <SectionHead
            eyebrow="Was wir reparieren"
            title={
              <>
                <Mark>Vier</Mark> Bereiche, in denen fast jeder Defekt liegt.
              </>
            }
            lead="Vom ausgelesenen Fehlercode bis zum überholten Nabenmotor: Wir arbeiten am Bauteil, nicht am Austauschgerät."
          />

          {/* Vier Felder auf einer eigenen Fläche statt vier Haarlinien.

              Vorher trug jedes Feld nur eine blasse Oberkante. Untereinander
              gestellt ergab das acht Striche quer durch eine helle Sektion –
              ein Liniengitter, in dem der Blick keine Kante mehr findet, und
              die Zwischenüberschrift „01" verschwand als graue Kleinzahl
              darüber. Jetzt hebt eine leichte Fläche jedes Feld heraus, und
              die Nummer steht als grosser Schattenwert in der Ecke: sichtbar
              als Ordnung, ohne mit der Überschrift um Aufmerksamkeit zu
              streiten. */}
          <div className="mt-14 grid gap-5 md:grid-cols-2 md:gap-6">
            {repairAreas.map((area, i) => {
              const Icon = areaIcons[area.slug] ?? Wrench;
              return (
                <Reveal key={area.slug} delay={(i % 2) * 80} as="article">
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-silver p-7 lift transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 md:p-9">
                    <span
                      aria-hidden="true"
                      className="tint-neon pointer-events-none absolute inset-0"
                    />

                    {/* Zeichen und Ziffer in einer Zeile.
                        Die Ziffer stand vorher als 60 px großer Schattenwert
                        bei 10 % Deckkraft in der Ecke – sie war weder Ordnung
                        noch Gestaltung, sondern ein grauer Fleck hinter der
                        Überschrift. Als Neonfläche mit dunkler Ziffer ist sie
                        zugleich das einzige Farbsignal der Karte und die
                        Zählung, die der Abschnitt behauptet. */}
                    <div className="relative flex items-center justify-between gap-4">
                      <span
                        aria-hidden="true"
                        className="grid size-12 shrink-0 place-items-center rounded-lg bg-ink text-silver"
                      >
                        <Icon className="size-5.5" strokeWidth={1.5} />
                      </span>
                      <span
                        aria-hidden="true"
                        className="tabular rounded-md bg-neon px-2.5 py-1 font-display text-sm font-bold tracking-tight text-ink"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="relative mt-6 text-[length:var(--text-title)]">
                      {area.title}
                    </h3>
                    <p className="relative mt-4 leading-relaxed text-current/65">
                      {area.description}
                    </p>

                    {/* Eine Liste mit Kanten statt einer Wolke aus Kapseln.
                        
                        Als `flex-wrap` mit unterschiedlich breiten Kapseln
                        brach die Aufzählung nach Zufall um: Bei fünf
                        Einträgen standen zwei in der ersten Zeile und je
                        einer in den drei folgenden, mit einer Lücke rechts,
                        die von Karte zu Karte anders groß war. Das sah nach
                        Umbruchfehler aus, nicht nach Aufzählung – und die
                        Karten daneben trugen vier Einträge und brachen an
                        anderer Stelle.

                        Untereinander mit Haarlinie hat jede Zeile dieselbe
                        Kante links und rechts, jede Karte denselben Rhythmus,
                        und die Liste ist von oben nach unten lesbar statt im
                        Zickzack. Der Neonpunkt bleibt: Er ist der Hinweis,
                        dass hier Leistungen stehen und kein Fließtext. */}
                    <ul className="relative mt-7">
                      {area.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-3 border-b border-current/10 py-2.5 text-sm text-current/80 first:border-t"
                        >
                          <span
                            aria-hidden="true"
                            className="size-1.5 shrink-0 rounded-full bg-neon"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Ablauf + Preisanker */}
      <Section tone="silver-200">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow text-current/90">So läuft es ab</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  <Mark>Vier</Mark> Schritte, keine Überraschungen.
                </h2>
              </Reveal>

              {/* Dieselbe Kette wie auf der Versicherungsseite.
                  Vorher stand die Nummer als graue Ziffer bei 25 % Deckkraft
                  neben dem Text – auf `silver-200` war sie damit blasser als
                  der Fliesstext, den sie ordnen soll, und zwischen den vier
                  Schritten gab es kein Band, das sie als Ablauf ausweist.
                  Jetzt trägt eine Neonscheibe die dunkle Ziffer, und eine
                  Linie verbindet die Scheiben; sie endet mit dem letzten
                  Schritt statt ins Leere zu zeigen. Zwei Abläufe auf einer
                  Website müssen gleich aussehen, sonst sind es zwei
                  Bausteine. */}
              <ol className="mt-12">
                {steps.map((step, i) => (
                  <Reveal
                    key={step.n}
                    delay={i * 70}
                    as="li"
                    className="relative grid grid-cols-[3rem_1fr] gap-x-5 pb-10 last:pb-0 sm:grid-cols-[3.5rem_1fr] sm:gap-x-8"
                  >
                    {i < steps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute top-14 bottom-0 left-6 w-px bg-ink/15 sm:top-16 sm:left-7"
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className="tabular grid size-12 place-items-center rounded-full bg-neon font-display text-lg font-bold tracking-tight text-ink sm:size-14 sm:text-xl"
                    >
                      {step.n}
                    </span>
                    <div className="min-w-0 pt-1.5 sm:pt-2.5">
                      <h3 className="text-[length:var(--text-subtitle)]">
                        {step.title}
                      </h3>
                      <p className="mt-2.5 max-w-xl leading-relaxed text-current/65">
                        {step.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={90}>
                <div className="rounded-lg border border-silver/15 lift-lg bg-ink p-8 text-silver on-dark">
                  <h3 className="text-[length:var(--text-subtitle)]">
                    Preisanker
                  </h3>
                  <p className="mt-2 text-sm text-current/65">
                    Richtwerte aus dem Werkstattalltag. Verbindlich wird immer
                    erst der Kostenvoranschlag.
                  </p>
                  <dl className="mt-7">
                    {priceAnchors.map((row) => (
                      <div
                        key={row.label}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-silver/12 py-3.5"
                      >
                        <dt className="text-current/75">{row.label}</dt>
                        <dd
                          className={
                            row.lead
                              ? "tabular font-display text-lg font-bold tracking-tight text-accent"
                              : "tabular font-display font-semibold tracking-tight"
                          }
                        >
                          {row.price}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-6 border-t border-silver/12 pt-5 text-xs leading-relaxed text-current/65">
                    {priceNote}
                  </p>
                </div>

                {/* Die Bearbeitungszeit hatte als einzige Karte der Seite nur
                    einen Rahmen: `border-silver/15` auf `silver-200` ist Weiss
                    auf Hellgrau und verschwindet, und die drei Zeilen standen
                    dahinter als graue Beschriftung neben grauem Wert. Jetzt
                    dieselbe erhabene Fläche wie der Preisanker darüber – und
                    die schnellste Zeile trägt Neon, weil genau sie im
                    Kopfbereich der Startseite als Zusage steht. */}
                <div className="mt-8 rounded-lg bg-silver p-8 lift">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-lg bg-ink text-silver"
                    >
                      <Timer className="size-5" strokeWidth={1.5} />
                    </span>
                    <h3 className="text-[length:var(--text-subtitle)]">
                      Bearbeitungszeit
                    </h3>
                  </div>
                  <dl className="mt-7">
                    {turnaround.map((row, i) => (
                      <div
                        key={row.label}
                        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-ink/10 py-4"
                      >
                        <dt className="text-current/70">{row.label}</dt>
                        <dd
                          className={
                            i === 0
                              ? "rounded-full bg-neon px-3 py-1 font-display text-sm font-bold tracking-tight text-ink"
                              : "font-display font-semibold tracking-tight"
                          }
                        >
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Marken */}
      <Section tone="ink">
        <Container>
          {/* Die Markenliste war vorher eine graue Zeile neben einer noch
              graueren Beschriftung – acht Namen bei 75 % Deckkraft, in
              Fliesstextgrösse, ohne eigene Fläche. Sie beantwortet aber die
              erste Frage jedes Anrufers: „Macht ihr meine Marke überhaupt?"
              Deshalb steht sie jetzt als eigener Block, die Namen in
              Überschriftengrösse und voller Deckkraft. */}
          <Reveal className="flex flex-col gap-8">
            {/* Dieselbe Korrektur wie in `related.tsx`: Die Zeile war ein
                `<h2>` im Grad der Auszeichnungszeile (13 px) und damit
                kleiner als jedes H3 daneben. */}
            <div>
              <p className="eyebrow text-current/90">Markenabdeckung</p>
              <h2 className="mt-4 text-[length:var(--text-title)]">
                Diese Marken kommen hier durch die Werkstatt.
              </h2>
            </div>
            {/* Dieselbe Liste steht auf /e-scooter als Zeile mit
                Trennpunkten, hier stand sie als Kapselwolke – ein Baustein
                mit zwei Erscheinungsformen ist kein zweiter Entwurf, sondern
                ein halber. Dazu brachen die acht verschieden breiten Kapseln
                am Telefon als zwei plus vier plus zwei um, jede Reihe mit
                anderer rechter Kante.

                Der Grad bleibt: Die Namen sind hier der Inhalt des Blocks,
                nicht eine Randnotiz wie auf der Bestandsseite. */}
            <p className="font-display text-lg leading-relaxed font-bold tracking-tight md:text-xl">
              {brands.join(" · ")}
            </p>
            <p className="text-current/65">
              … und weitere, auch exotische Modelle. Wenn Ihre Marke nicht dabei
              ist: anrufen, in den meisten Fällen passt es trotzdem.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Anfrage */}
      <Section tone="silver">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow text-current/90">Reparatur anfragen</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  <Mark>Beschreiben</Mark> Sie, was der Scooter macht.
                </h2>
                <p className="mt-6 leading-relaxed text-current/65">
                  Wir melden uns schnellstmöglich mit einer ersten Einschätzung
                  und einem Kostenvoranschlag. Wenn es schnell gehen muss:
                  einfach anrufen.
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
                <InquiryForm defaultTopic="Reparatur" />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="ink">
        <FaqSection
          eyebrow="Häufige Fragen zur Reparatur"
          title={
            <>
              Was Kunden vor dem Werkstatttermin <Mark>fragen</Mark>.
            </>
          }
          lead="Marken, Kosten, Dauer und die Frage, die am häufigsten kommt: Lohnt sich das überhaupt noch?"
          items={faqRepair}
        />
      </Section>

      <Related
        tone="silver"
        items={[
          {
            href: "/wartungsvertrag",
            label: "Wartungsvertrag",
            text: "Express-Reparatur innerhalb von 24 Stunden und Vorrang bei der Terminvergabe.",
          },
          {
            href: "/recycling",
            label: "Kostenlose Verwertung",
            text: "Wenn sich eine Reparatur nicht mehr rechnet, nehmen wir das Altgerät kostenlos zurück.",
          },
        ]}
      />

      <Region />
      <CtaBand
        eyebrow="Werkstatttermin"
        title={
          <>
            Bringen Sie den Scooter <Mark>vorbei</Mark>.
          </>
        }
        text="Im Kampfrad 3 in Neuenstadt am Kocher. Aus Heilbronn sind es 15 Kilometer, aus Bad Friedrichshall acht. Ein Anruf vorher spart Wartezeit."
      />

      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "Reparatur", path: "/reparatur" }]),
          service({
            name: "E-Scooter Reparatur und Werkstattservice",
            description:
              "Elektronik-Diagnose, Akku-Service mit Kapazitätsmessung, mechanische Instandsetzung und Motor-Reparatur für alle gängigen E-Scooter Marken.",
            path: "/reparatur",
            serviceType: "E-Scooter Reparatur",
            offers: [
              {
                name: "Sicherheits-Checkup",
                price: "59.99",
                description:
                  "Bremsen einstellen, Reifendruck und Profil prüfen, Schrauben nachziehen, Akku-Diagnose, Elektronik-Prüfung, Verschleißteil-Kontrolle mit Protokoll.",
              },
              // `from`, weil sichtbar „ab 15 €" steht – siehe Kommentar bei service().
              { name: "Bremsbeläge ersetzen", price: "15.00", from: true },
              { name: "Reifenwechsel", price: "25.00", from: true },
              { name: "Elektronik-Reparatur", price: "40.00", from: true },
            ],
          }),
          faqPage(faqRepair, "/reparatur"),
        ])}
      />
    </>
  );
}
