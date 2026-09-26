import type { Metadata } from "next";
import { Check, Plus } from "lucide-react";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Related } from "@/components/sections/related";
import { ButtonLink } from "@/components/ui/button";
import { FaqSection } from "@/components/ui/faq";
import { Mark } from "@/components/ui/mark";
import { PageHeader } from "@/components/ui/page-header";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { StatBand } from "@/components/ui/stat-band";
import { Steps } from "@/components/ui/steps";
import { faqStorage } from "@/lib/data/faq";
import {
  storageIncludes,
  storageOption,
  storagePickupMonths,
  storagePlan,
  storageSteps,
} from "@/lib/data/storage";
import { JsonLd, breadcrumb, faqPage, pageGraph, service } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { priceNote } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter Winterlagerung ab 29,99 € im Monat",
  description:
    "Winterlagerung für E-Scooter in Neuenstadt am Kocher: temperierter Stellplatz, Batterie-Monitoring auf Lagerspannung und Sicherheitscheck vor der Abholung. 29,99 € im Monat.",
  path: "/einlagerung",
});

export default function StoragePage() {
  return (
    <>
      <PageHeader
        crumb="Winterlagerung"
        eyebrow="Saison-Service"
        title={
          <>
            E-Scooter über den Winter <Mark>einlagern</Mark>.
          </>
        }
        lead="Ein Lithium-Akku, der über Monate voll geladen in der Kälte steht, verliert Kapazität – und zwar dauerhaft. Bei uns steht das Gerät temperiert, entlastet und mit dem Akku auf Lagerspannung."
        /* Zwei Werte, also eine schmalere Spalte als auf /versicherung (drei).
           Der Deckel liegt bei fünf von zwölf Spalten: „Mindestlaufzeit"
           misst im Fließtextgrad rund 130 px, „29,99 €" im Kennzahlengrad
           bei 1512 px rund 150 – zwei Zellen zu je 170 px plus Abstand
           passen darin einzeilig. */
        asideClassName="lg:col-span-12 xl:col-span-5 xl:col-start-8 xl:justify-self-end xl:self-end"
        aside={
          <StatBand
            items={[
              { label: "Pro Monat, Endpreis", value: `${storagePlan.price} €` },
              { label: "Mindestlaufzeit", value: "2 Monate" },
            ]}
          />
        }
      />

      {/* Das Abo.

          Die Vorlage des Betreibers verlangte ausdrücklich **eine** zentrale
          Fokus-Box statt einer Preistabelle, und das ist hier auch sachlich
          richtig: Es gibt genau einen Preis. Eine Tabelle braucht mindestens
          zwei Zeilen, zwischen denen man wählt – mit einer Zeile ist sie
          eine Behauptung von Auswahl.

          Die Box liegt in Tinte auf einer Silberfläche. Der Flächenwechsel
          ist der Rhythmusgeber der ganzen Seite (siehe `section.tsx`), und
          hier trägt er die Aufgabe, die sonst eine Umrandung übernehmen
          müsste: Der Preis steht auf der einzigen dunklen Fläche des
          Abschnitts, und Neon darf dort Schrift sein (14,8:1). Auf Silber
          wäre dieselbe Zahl in Neon mit 1,18:1 unlesbar. */}
      <Section id="abo" tone="silver">
        <Container>
          <SectionHead
            eyebrow="Das Angebot"
            title={
              <>
                Ein Platz, ein <Mark>Preis</Mark>, vier Leistungen.
              </>
            }
          />

          <Reveal delay={60}>
            <div className="lift-lg mt-12 grid overflow-hidden rounded-xl bg-ink text-silver on-dark lg:grid-cols-12">
              {/* Links der Preis. Eigene, eine Stufe hellere Fläche
                  (`ink-800`): Ohne sie stünden Preis und Leistungsliste in
                  demselben Schwarz, und die Kachel wäre ein Rechteck mit
                  einer senkrechten Haarlinie darin. */}
              <div className="flex flex-col justify-center gap-7 bg-ink-800 p-7 md:p-10 lg:col-span-5">
                <p className="eyebrow text-current/90">{storagePlan.name}</p>

                {/* Der Preis im Displaygrad und nicht im Statgrad: Er ist die
                    harte Zahl, wegen der diese Kachel überhaupt steht, und
                    die linke Spalte hatte darunter gemessen 250 px leere
                    Fläche, weil `justify-between` den Knopf an den Boden
                    genagelt hat. Die Strecke gehört der Zahl, nicht dem
                    Loch. */}
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="tabular font-display text-[length:var(--text-display)] leading-none font-bold tracking-tight text-accent">
                    {storagePlan.price}&nbsp;€
                  </span>
                  <span className="text-[length:var(--text-lead)] text-current/65">
                    / Monat
                  </span>
                </p>

                <p className="text-[length:var(--text-lead)] leading-relaxed text-current/80">
                  {storagePlan.claim}
                </p>

                {/* Die Mindestlaufzeit steht direkt unter dem Preis und
                    nicht in der Leistungsliste: Sie ist keine Leistung,
                    sondern die Bedingung, unter der der Preis gilt. Als
                    Zeile mit zwei Enden statt als Satz – sie ist die eine
                    Angabe, die jemand mit einem anderen Angebot
                    vergleicht. */}
                <dl className="border-y border-current/15 py-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-current/60">Mindestlaufzeit</dt>
                    <dd className="tabular font-display text-[length:var(--text-subtitle)] leading-none font-bold tracking-tight">
                      {storagePlan.minTerm}
                    </dd>
                  </div>
                </dl>

                <p className="-mt-4 text-sm leading-relaxed text-current/55">
                  Danach läuft die Einlagerung monatlich weiter, die Laufzeit
                  nach oben ist offen.
                </p>

                <div>
                  <ButtonLink href="#anfrage" size="lg" className="w-full">
                    Einlagerung anfragen
                  </ButtonLink>
                  <p className="mt-4 text-sm leading-relaxed text-current/55">
                    {priceNote}
                  </p>
                </div>
              </div>

              {/* Rechts die vier Leistungen als Liste mit Haarlinien, nicht
                  als Kachelraster und nicht als Hakenliste im Fließtext.
                  Jede Zeile trägt die Leistung als Überschrift und darunter,
                  was sie bedeutet – „Standentlastung" erklärt sich niemandem
                  von selbst, und vier Schlagworte nebeneinander wären genau
                  das gewesen.

                  Das Häkchen steht ohne Scheibe und nicht in Neon: Auf
                  dieser Kachel ist der Preis die harte Zahl und der Knopf die
                  Hauptaktion – vier zusätzliche Neonmarken hätten beides
                  entwertet, und vier graue Scheiben lasen sich als vier
                  Plaketten neben einer Liste, die ihre Struktur schon aus
                  den Haarlinien hat.

                  Die letzte Zeile ist die Zusatzleistung und trägt dafür ein
                  Pluszeichen, eine eigene Fläche und die Kartenkante –
                  dasselbe Mittel wie der Kartenfuß der Bestandskarte. Sie
                  stand bis zum 26.09.2026 als eigener silberner Kasten unter
                  der Kachel; damit hatte ein einziges Angebot zwei Flächen,
                  und die untere war die auffälligere von beiden. Als Zeile
                  *in* der Liste bleibt der Einwand von damals erfüllt: Es
                  liest sich als Zusatz zu diesem Abo und nicht als zweites
                  Abo daneben. */}
              <ul className="p-7 md:p-10 lg:col-span-7">
                {storageIncludes.map((item, i) => (
                  <Reveal
                    key={item.title}
                    as="li"
                    delay={80 + i * 60}
                    className="flex max-w-none items-start gap-4 border-b border-current/12 py-5 first:pt-0 last:border-b-0 last:pb-0"
                  >
                    <Check
                      aria-hidden="true"
                      className="mt-1 size-5 shrink-0 text-current/45"
                      strokeWidth={2.5}
                    />
                    <div className="min-w-0">
                      <h3 className="text-[length:var(--text-subtitle)] leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-2 leading-relaxed text-current/65">
                        {item.text}
                      </p>
                    </div>
                  </Reveal>
                ))}

                <Reveal
                  as="li"
                  delay={80 + storageIncludes.length * 60}
                  className="-mx-7 -mb-7 mt-5 flex max-w-none items-start gap-4 bg-silver/[0.05] px-7 py-6 md:-mx-10 md:-mb-10 md:px-10"
                >
                  <Plus
                    aria-hidden="true"
                    className="mt-1 size-5 shrink-0 text-current/45"
                    strokeWidth={2.5}
                  />
                  <div className="min-w-0">
                    <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[length:var(--text-subtitle)] leading-snug">
                      {storageOption.name}
                      <span className="tabular font-display text-base font-bold tracking-tight text-current/70">
                        + {storageOption.price}&nbsp;€ {storageOption.billing}
                      </span>
                    </h3>
                    <p className="mt-2 leading-relaxed text-current/65">
                      {storageOption.text}
                    </p>
                  </div>
                </Reveal>
              </ul>
            </div>
          </Reveal>

        </Container>
      </Section>

      {/* Ablauf */}
      <Section tone="silver-200">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHead
                eyebrow="Ablauf"
                title={
                  <>
                    Vier Schritte bis zum <Mark>Frühjahr</Mark>.
                  </>
                }
                lead="Von der Anfrage bis zur Abholung. Den Zustand des Geräts sehen wir uns bei der Übergabe gemeinsam an – und noch einmal, bevor Sie wieder losfahren."
                className="pb-0 lg:sticky lg:top-28"
              />
            </div>
            <div className="lg:col-span-7">
              <Steps items={[...storageSteps]} />
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="ink">
        <FaqSection
          eyebrow="Häufige Fragen"
          title={
            <>
              Preis, Laufzeit und was mit dem <Mark>Akku</Mark> passiert.
            </>
          }
          lead="Was die Einlagerung kostet, wie lange sie mindestens läuft und warum der Ladezustand während der Lagerung überhaupt eine Rolle spielt."
          items={faqStorage}
        />
      </Section>

      {/* Anfrage. Die Seite trägt ihr eigenes Formular, damit der Weg nicht
          über /kontakt läuft und die Vorauswahl unterwegs verlorengeht –
          dieselbe Entscheidung wie auf allen übrigen Leistungsseiten.

          Es ist eine **Anfrage und keine Buchung**: Der Vertrag entsteht vor
          Ort. Ein online abschließbares Abo wäre ein Dauerschuldverhältnis
          mit Widerrufsbelehrung und Kündigungsknopf nach § 312k BGB; die
          Begründung steht ausführlich in `lib/data/storage.ts`. */}
      <Section tone="silver">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow text-current/90">Einlagerung anfragen</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  Sagen Sie uns, bis wann der Scooter <Mark>steht</Mark>.
                </h2>
                <p className="mt-6 leading-relaxed text-current/65">
                  Wir bestätigen Ihnen den Platz und vereinbaren einen Termin
                  für die Übergabe. Das VIP Detailing können Sie gleich
                  mitbestellen; entscheiden müssen Sie sich erst bei der
                  Abholung.
                </p>
              </Reveal>
            </div>
            <div id="anfrage" className="scroll-mt-32 lg:col-span-7">
              <Reveal delay={80}>
                <InquiryForm
                  defaultTopic="Winterlagerung"
                  storage={{
                    months: storagePickupMonths,
                    optionName: storageOption.name,
                    optionPrice: storageOption.price,
                  }}
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Related
        tone="silver-200"
        items={[
          {
            href: "/wartungsvertrag",
            label: "Wartungsvertrag",
            text: "Wer ohnehin jedes Jahr zum Check kommt, bekommt den Sicherheits-Checkup im Vertrag.",
          },
          {
            href: "/reparatur",
            label: "Reparatur",
            text: "Fällt beim Check vor der Abholung etwas auf, wird es in derselben Werkstatt behoben.",
          },
        ]}
      />

      <CtaBand
        formHref="#anfrage"
        eyebrow="Platz anfragen"
        title={
          <>
            Der Winter ist lang, der <Mark>Akku</Mark> merkt sich das.
          </>
        }
        text="Sagen Sie uns, um welches Gerät es geht und bis wann es stehen soll. Den Termin für die Übergabe klären wir am Telefon oder per E-Mail."
      />

      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "Winterlagerung", path: "/einlagerung" }]),
          service({
            name: "E-Scooter Winterlagerung",
            description:
              "Einlagerung von E-Scootern über den Winter: temperierter Stellplatz, Batterie-Monitoring auf einer Lagerspannung von 50 bis 70 Prozent, Standentlastung für Reifen und Fahrwerk und ein Sicherheitscheck vor der Abholung. 29,99 € im Monat bei zwei Monaten Mindestlaufzeit.",
            path: "/einlagerung",
            serviceType: "E-Scooter Einlagerung",
            offers: [
              {
                name: storagePlan.name,
                price: storagePlan.priceValue,
                unit: "MON",
                description: `${storageIncludes
                  .map((item) => item.title)
                  .join(", ")}. ${storagePlan.minDuration}.`,
              },
              {
                name: storageOption.name,
                price: storageOption.priceValue,
                description: storageOption.text,
              },
            ],
          }),
          faqPage(faqStorage, "/einlagerung"),
        ])}
      />
    </>
  );
}
