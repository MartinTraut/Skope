import type { Metadata } from "next";
import { Check, X } from "lucide-react";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Plans } from "@/components/sections/plans";
import { Related } from "@/components/sections/related";
import { FaqSection } from "@/components/ui/faq";
import { PageHeader } from "@/components/ui/page-header";
import { Container, Section } from "@/components/ui/section";
import { faqPlans } from "@/lib/data/faq";
import { planExclusions, plans } from "@/lib/data/plans";
import { JsonLd, breadcrumb, faqPage, pageGraph, service } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { Mark } from "@/components/ui/mark";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter Wartungsvertrag ab 17,99 € im Monat",
  description:
    "Wartungsvertrag für E-Scooter: Basis 130 € im Jahr, Premium 17,99 € im Monat mit Akku-Deep-Check, Express-Reparatur und Hol- und Bringservice bis 15 km.",
  path: "/wartungsvertrag",
  image: "/img/werkstatt-service.jpg",
  imageAlt: "Wartung an einem E-Scooter in der Werkstatt Neuenstadt am Kocher",
});

export default function PlansPage() {
  return (
    <>
      <PageHeader
        crumb="Wartungsvertrag"
        eyebrow="Service-Verträge"
        title={
          <>
            Wartung, <Mark>bevor</Mark> etwas kaputtgeht.
          </>
        }
        lead="Wer täglich pendelt, merkt einen Defekt meistens genau dann, wenn er losfahren will. Ein Wartungsvertrag verschiebt diesen Moment nach vorn, in die Werkstatt, zu einem geplanten Termin."
      />

      {/* Die Entscheidungshilfe zuerst – und zwar die ehrliche: Premium
          amortisiert sich rechnerisch nicht, es kauft Reaktionszeit.

          Das stand hier als ein Absatz über neun Zeilen, und darin lagen vier
          Preise, vier Zusatzleistungen und zwei Empfehlungen. Wer die Seite
          überfliegt – und das tut hier jeder, die Tarifkarten kommen direkt
          darunter –, liest davon den ersten Halbsatz. Jetzt trägt jede der
          drei Aussagen ihre eigene Form: der Kernsatz als Lead, die vier
          Zusatzleistungen als Liste, die Empfehlung als abgesetzter Block.
          Kein Wort und keine Zahl ist dabei weggefallen. */}
      <Section tone="silver-200">
        <Container>
          {/* Der Block stand in einer Spalte von 56 rem am linken Rand, auf
              breiten Schirmen also auf gut der halben Fläche, und die rechte
              Hälfte blieb leer. Er ist aber kein Fließtext, sondern eine
              Gegenüberstellung: Aussage links, Beleg rechts. Genau so liegt
              er jetzt – fünf Spalten Argument, sieben Spalten Leistungen –
              und nimmt damit dieselbe Breite ein wie die Tarifkarten, die
              direkt darunter kommen. */}
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <p className="eyebrow text-current/90">Entscheidungshilfe</p>
              <h2 className="mt-4 text-[length:var(--text-title)]">
                Wofür Sie bei <Mark>Premium</Mark> bezahlen
              </h2>

              <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed">
                Nicht für die Stückzahl, sondern für die Ausfallzeit.
              </p>

              <p className="mt-4 leading-relaxed text-current/70">
                Der jährliche Sicherheits-Checkup kostet einzeln 59,99&nbsp;€
                und ist in beiden Verträgen enthalten. Premium für 17,99&nbsp;€
                im Monat ergänzt vier Dinge:
              </p>
            </Reveal>

            {/* Die vier Zusatzleistungen waren eine Hakenliste im Fließtext –
                dieselbe Schriftgröße, dieselbe Farbe, dieselbe Fläche wie der
                Absatz darüber. Es ist aber die Antwort auf die Frage der
                Überschrift und damit der Grund, warum jemand den teureren
                Vertrag nimmt. Jetzt vier eigene Kacheln mit gleichem Gewicht;
                das Häkchen sitzt in einer Tintenscheibe statt frei im Satz. */}
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {[
                "Akku-Deep-Check",
                "20\u00a0% Rabatt auf Ersatzteile",
                "Express-Reparatur innerhalb von 24 Stunden",
                "Hol- und Bringservice im Umkreis von 15\u00a0km",
              ].map((entry, i) => (
                <Reveal key={entry} delay={60 + i * 60} as="li">
                  <div className="flex h-full items-start gap-4 rounded-md border border-current/10 bg-silver p-5 md:p-6">
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-silver"
                    >
                      <Check className="size-4" strokeWidth={2.75} />
                    </span>
                    <span className="font-display leading-snug font-semibold tracking-tight">
                      {entry}
                    </span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Die Empfehlung steht auf eigener Fläche, weil sie die einzige
              Stelle ist, an der wir von einem der beiden Verträge abraten.
              Im Fließtext war das der letzte Nebensatz.

              Zwei Flächen statt einer: Der empfohlene Fall liegt in Tinte,
              der günstigere auf Silber. Damit ist die Empfehlung schon vor
              dem ersten Wort sichtbar, und der Preis darf links Neon sein –
              auf Silber wäre er mit 1,18:1 unlesbar. */}
          <Reveal delay={120}>
            <dl className="lift-lg mt-12 grid overflow-hidden rounded-xl sm:grid-cols-2">
              <div className="bg-ink p-7 text-silver on-dark md:p-10">
                <dt className="eyebrow-plain text-silver/55">
                  Täglich zur Arbeit
                </dt>
                <dd className="mt-3 leading-relaxed text-silver/85">
                  <strong className="block font-display text-[length:var(--text-subtitle)] leading-tight font-bold tracking-tight text-accent">
                    Premium, 17,99&nbsp;€ im Monat.
                  </strong>{" "}
                  <span className="mt-2 block">
                    Sie zahlen für Planbarkeit, nicht für die Stückzahl der
                    Termine.
                  </span>
                </dd>
              </div>
              <div className="bg-silver p-7 md:p-10">
                <dt className="eyebrow-plain text-current/60">
                  Gelegentlich unterwegs
                </dt>
                <dd className="mt-3 leading-relaxed text-current/80">
                  <strong className="block font-display text-[length:var(--text-subtitle)] leading-tight font-bold tracking-tight text-ink">
                    Basis, 130&nbsp;€ im Jahr.
                  </strong>{" "}
                  <span className="mt-2 block">
                    Günstiger, und der Sicherheits-Checkup ist auch hier drin.
                  </span>
                </dd>
              </div>
            </dl>
          </Reveal>
        </Container>
      </Section>

      <Plans />

      {/* Ausschlüsse – Ehrlichkeit ist hier das Verkaufsargument.

          `space="tight"`: Der Block gehört zu den Tarifkarten darüber – er
          sagt, was in denselben zwei Verträgen *nicht* drinsteht – und liegt
          in derselben Fläche. Mit der vollen Stufe standen dort 128 px
          silberne Leere ohne jede Kante zwischen Preis und Einschränkung,
          und die Einschränkung las sich als eigenes Thema. */}
      <Section tone="silver" space="tight">
        <Container>
          {/* Vorher: eine Etikettenzeile in vier Spalten links, ein blasser
              Absatz in acht Spalten rechts – dazwischen eine halbe
              Bildschirmbreite Leere, und die vier Ausschlüsse als Komma-Kette
              mitten im Satz. Das ist der Block, auf den wir uns im Streitfall
              berufen; er darf nicht der unauffälligste der Seite sein.

              Jetzt eine echte Überschrift, die Ausschlüsse als Reihe mit
              eigenem Zeichen und der Ersatzteil-Hinweis abgesetzt darunter.
              Der Wortlaut ist unverändert, nur zerlegt (`planExclusions` in
              `lib/data/plans.ts`). */}
          <Reveal className="grid gap-8 border-t border-current/12 pt-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="eyebrow text-current/90">Grenzen</p>
              <h2 className="mt-4 text-[length:var(--text-title)]">
                Was nicht abgedeckt ist
              </h2>
            </div>

            <div className="lg:col-span-8">
              <p className="text-[length:var(--text-lead)] leading-relaxed">
                {planExclusions.scope}
              </p>
              <p className="mt-5 leading-relaxed text-current/70">
                {planExclusions.intro}
              </p>
              {/* Dieselbe Korrektur wie bei den Reparaturbereichen: Als
                  `flex-wrap` brachen vier verschieden breite Kapseln am
                  Telefon als zwei plus eins plus eins um – „Wasserschäden
                  durch Hochdruckreiniger" allein über die volle Breite, mit
                  einem einzelnen „Unfälle" darunter. Eine Aufzählung, die
                  je nach Wortlänge eine andere Form annimmt, liest sich als
                  Fehler. Haarlinien geben jedem Punkt dieselbe Zeile. */}
              {/* Die obere Haarlinie sitzt am ersten Eintrag, nicht an der
                  Liste: `li` trägt aus `globals.css` das Lesemaß von 58ch,
                  die Liste nicht – am Schreibtisch lief die Linie der Liste
                  923 px breit über Einträge von 574 px. */}
              <ul className="mt-5">
                {planExclusions.items.map((entry) => (
                  <li
                    key={entry}
                    className="flex items-center gap-3 border-b border-current/12 py-2.5 text-sm font-semibold first:border-t"
                  >
                    <X
                      aria-hidden="true"
                      className="size-3.5 shrink-0 text-current/45"
                      strokeWidth={3}
                    />
                    {entry}
                  </li>
                ))}
              </ul>
              <p className="mt-6 leading-relaxed text-current/70">
                {planExclusions.note}
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="ink">
        <FaqSection
          eyebrow="Häufige Fragen zum Wartungsvertrag"
          title={
            <>
              Was im Vertrag steht und was <Mark>nicht</Mark>.
            </>
          }
          lead="Umfang, Ersatzteile, Ort der Wartung und die Frage, welcher der beiden Verträge zu welchem Fahrprofil passt."
          items={faqPlans}
        />
      </Section>

      {/* Anfrage – bisher zwang diese Seite als einzige Vertragsseite zum
          Seitenwechsel, obwohl die Vorauswahl längst existiert. */}
      <Section tone="silver">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow text-current/90">Vertrag anfragen</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  Welcher passt, klären wir <Mark>vorher</Mark>.
                </h2>
                <p className="mt-6 leading-relaxed text-current/65">
                  Schreiben Sie uns, wie oft Sie fahren und welches Gerät Sie
                  nutzen. Wir sagen Ihnen, welcher der beiden Verträge dazu
                  passt, auch wenn das der günstigere ist.
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
                <InquiryForm defaultTopic="Wartungsvertrag Basis" />
              </Reveal>
            </div>
          </div>
        </Container>
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
            href: "/reparatur",
            label: "Reparatur",
            text: "Was außerhalb der Wartung anfällt, mit Kostenvoranschlag vor jeder Arbeit.",
          },
          {
            href: "/e-scooter",
            label: "Geprüfte E-Scooter",
            text: "Wer hier kauft, bekommt das Gerät Jahre später in derselben Werkstatt gewartet.",
          },
        ]}
      />

      <CtaBand
        eyebrow="Vertrag abschließen"
        title={
          <>
            <Mark>Kurz</Mark> durchsprechen, dann steht es.
          </>
        }
        text="Welcher Vertrag passt, hängt vor allem davon ab, wie oft Sie fahren. Ein Anruf reicht, um das in zwei Minuten zu klären."
      />

      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "Wartungsvertrag", path: "/wartungsvertrag" }]),
          service({
            name: "E-Scooter Wartungsvertrag",
            description:
              "Wartungsverträge für E-Scooter mit jährlichem Sicherheits-Check, Akku-Deep-Check, Ersatzteil-Rabatt und Express-Reparatur. Hol- und Bringservice im Umkreis von 15 km um Neuenstadt am Kocher.",
            path: "/wartungsvertrag",
            serviceType: "E-Scooter Wartung",
            // Preise und Leistungen kommen aus derselben Quelle wie die
            // sichtbaren Karten – sonst laufen Anzeige und Schema auseinander,
            // sobald jemand einen Preis ändert.
            offers: plans.map((plan) => ({
              name: `${plan.name}-Wartungsvertrag`,
              price: plan.priceValue,
              unit: plan.period === "pro Jahr" ? "JAHR" : "MON",
              description: [plan.features.join(", "), plan.minDuration]
                .filter(Boolean)
                .join(". "),
            })),
          }),
          faqPage(faqPlans, "/wartungsvertrag"),
        ])}
      />
    </>
  );
}
