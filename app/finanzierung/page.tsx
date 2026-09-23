import type { Metadata } from "next";
import { Check, Clock, KeyRound, ShieldCheck } from "lucide-react";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { FinancingCompare } from "@/components/sections/financing-compare";
import { Related } from "@/components/sections/related";
import { ChoiceAction } from "@/components/ui/choice-action";
import { ChosenLine } from "@/components/ui/chosen-line";
import { FaqSection } from "@/components/ui/faq";
import { Mark } from "@/components/ui/mark";
import { PageHeader } from "@/components/ui/page-header";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { faqFinancing } from "@/lib/data/faq";
import { financingModels, financingTerms } from "@/lib/data/financing";
import { JsonLd, breadcrumb, faqPage, pageGraph, service } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter finanzieren: Mietkauf-Abo und Ratenkauf",
  description:
    "E-Scooter, E-Chopper und E-Trike in Raten zahlen: Mietkauf-Abo über 24 oder 36 Monate mit Versicherung und Service in der Rate, oder Ratenkauf mit Anzahlung und SEPA-Lastschrift. Beratung in Neuenstadt am Kocher.",
  path: "/finanzierung",
});

/* Ein Zeichen je Modell, nicht in den Daten: `lib/data/financing.ts` ist die
   Belegstelle für Vertragsinhalte und soll keine Symbolbibliothek importieren.
   Beide stehen im Ring in Silber, nicht in Neon – die Akzentfarbe markiert auf
   dieser Seite die Hauptaktion und die harte Angabe, und ein Plakettchen wäre
   eine vierte Aufgabe. */
const MODEL_ICONS = {
  mietkauf: ShieldCheck,
  ratenkauf: KeyRound,
  bank: Clock,
} as const;

/* Nur Name je Modell für das Bauteil über dem Formular – nicht das Datenmodul
   mit Leistungslisten, Ausschlüssen und Rechtsanmerkungen. Dieselbe Regel wie
   bei den Geräten in der unteren Aktionsleiste. Kein `detail`: Auf dieser
   Seite steht keine Zahl, siehe § 16 PAngV. */
const modelSummary = Object.fromEntries(
  financingModels.map((model) => [model.id, { name: model.name }]),
);

/* Keine Beispielrate, nirgends auf dieser Seite – die Begründung steht in
   `lib/data/financing.ts`. Wer hier später eine Zahl einträgt, trägt damit
   auch den effektiven Jahreszins und die übrigen Pflichtangaben nach § 16
   PAngV ein. */
export default function FinancingPage() {
  const available = financingModels.filter((model) => model.available);
  const planned = financingModels.filter((model) => !model.available);

  return (
    <>
      <PageHeader
        crumb="Finanzierung"
        eyebrow="Zahlung & Finanzierung"
        title={
          <>
            Den Kaufpreis in <Mark>Raten</Mark> verteilen.
          </>
        }
        lead="Zwei Wege: das Mietkauf-Abo mit fester Monatsrate und der Ratenkauf mit Anzahlung. Beide gelten für E-Scooter, E-Chopper und E-Trike."
      />

      {/* Die beiden verfügbaren Modelle nebeneinander, nicht untereinander:
          Es ist eine Entscheidung zwischen zweien, und die trifft man im
          Vergleich. Derselbe Aufbau wie bei den Tarifkarten des
          Wartungsvertrags – Name, Kernsatz, Eckdaten als Band, Leistungen,
          Einschränkung, Aktion. */}
      <Section tone="silver">
        <Container>
          {/* `center` statt des voreingestellten `split`.

              Diese Seite ist die einzige, deren Inhalt eine Entscheidung
              zwischen zwei gleichrangigen Dingen ist – und die steht auf
              einer Mittelachse, nicht an der linken Kante. Gemessen bei
              1512 px hingen vorher Auszeichnung, Überschrift, Lead, beide
              Kartenköpfe, „Für beide Modelle gilt", der Bankhinweis und der
              Formularkopf alle an x = 48, während rechts zwischen 280 und
              860 px Fläche frei blieb. Der Rest der Seite behält die
              Hausform; hier trägt sie die Komposition nicht. */}
          <SectionHead
            align="center"
            eyebrow="Zwei Wege"
            title={
              <>
                Planbare Rate oder <Mark>sofortiges</Mark> Eigentum.
              </>
            }
            lead="Der Unterschied liegt nicht im Preis, sondern darin, wann das Fahrzeug Ihnen gehört und was in der monatlichen Rate schon enthalten ist."
          />

          {/* Erst der Vergleich, dann die beiden Karten.

              Die Reihenfolge ist der Punkt: Wer auf diese Seite kommt, will
              wissen, was der Unterschied ist – nicht zuerst zwei Angebote
              lesen und den Unterschied selbst bilden. Die Spaltenköpfe der
              Tabelle tragen die Namen, die Karten darunter die Begründung,
              die Anmerkungen und die Aktion. */}
          <FinancingCompare
            models={{
              mietkauf: {
                name: financingModels[0].name,
                short: financingModels[0].short,
                icon: MODEL_ICONS[financingModels[0].id],
              },
              ratenkauf: {
                name: financingModels[1].name,
                short: financingModels[1].short,
                icon: MODEL_ICONS[financingModels[1].id],
              },
            }}
          />

          {/* Deckel 76 rem und mittig gesetzt, nicht die volle Breite.

              Ungedeckelt war jede Karte bei 1512 px 708 px breit; die
              Eckdatenzelle „monatlich per SEPA-Lastschrift" braucht davon
              196 px, die Leistungszeilen rund 380 px. Der Rest war Luft
              *innerhalb* der Karte, und zwei 708 px breite Kästen mit
              Fließtext in halber Breite lesen sich als angeschnittene Seite.
              Jetzt 600 px je Karte, und das Paar steht als Block in der
              Mitte des Satzspiegels. */}
          <ul className="mx-auto mt-14 grid max-w-[76rem] auto-rows-fr gap-6 lg:grid-cols-2">
            {available.map((model, i) => {
              const Icon = MODEL_ICONS[model.id];
              return (
              <Reveal key={model.id} delay={i * 80} as="li" className="flex">
                <div
                  className={cn(
                    "flex w-full flex-col rounded-xl border p-7 md:p-9",
                    /* Zwei Karten in derselben Farbe sind kein Vergleich,
                       sondern eine Wiederholung: Bis hierher standen beide in
                       Tinte, unterschieden sich nur im Text und in der
                       Knopffarbe, und die Seite las sich als zwei gleich
                       laute Angebote. Jetzt derselbe Bauplan wie bei den
                       Tarifkarten des Wartungsvertrags – die Karte mit dem
                       Vollton-Knopf in Tinte, die andere in Silber mit
                       Kontur. Dieselben Farben trägt die Tabelle darüber in
                       ihren Spalten, und damit ist die Zuordnung eine Farbe
                       und keine Leseaufgabe. */
                    model.id === "mietkauf"
                      ? "lift-lg border-transparent bg-ink text-silver on-dark"
                      : "lift border-ink/15 bg-silver-200",
                  )}
                >
                  {/* Der Kopf der Karte steht auf ihrer eigenen Achse:
                      Zeichen, Name, Kernsatz und Beschreibung mittig. Bei
                      zwei Karten nebeneinander ergibt das eine durchgehende
                      Symmetrie – links und rechts derselbe Aufbau um
                      dieselbe Mitte. Die Listen darunter bleiben linksbündig:
                      Zentrierter Flattersatz über vier Zeilen ist keine
                      Komposition, sondern schlecht lesbar. */}
                  <div className="text-center">
                    <span
                      aria-hidden="true"
                      className="mx-auto grid size-12 place-items-center rounded-full border border-current/20"
                    >
                      <Icon className="size-5 text-current/75" />
                    </span>
                    <h2 className="mt-5 font-display text-[length:var(--text-subtitle)] leading-tight font-bold tracking-tight">
                      {model.name}
                    </h2>
                    {/* `text-accent` kippt auf der hellen Karte auf Tinte
                        (Farbregel in globals.css) – auf der dunklen stünde
                        der Kernsatz also in Neon und auf der hellen in
                        Grau: dieselbe Rolle, zwei Erscheinungen. Deshalb
                        auf beiden Karten dieselbe Abstufung des
                        Flächentons; das Neon gehört hier dem Knopf. */}
                    <p className="mt-3 font-display text-[length:var(--text-lead)] leading-snug font-semibold tracking-tight text-balance">
                      {model.claim}
                    </p>
                    <p className="mt-5 leading-relaxed text-current/70">
                      {model.description}
                    </p>
                  </div>

                  {/* Das Eckdatenband der Karte ist weg: Seine drei Angaben
                      stehen in der Vergleichstabelle darüber, und dort in
                      denselben Kategorien für beide Modelle. Hier standen sie
                      mit je eigenen Beschriftungen – „Laufzeit / Übernahme /
                      Enthalten" gegen „Anzahlung / Raten / Eigentum" –, und
                      genau daran war der Unterschied zwischen den Modellen
                      nicht zu sehen. */}
                  <ul className="mt-7 grid gap-3">
                    {model.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-neon"
                        >
                          <Check className="size-3 text-ink" strokeWidth={3.5} />
                        </span>
                        <span className="text-current/85">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Was nicht enthalten ist, steht in derselben Liste und
                      nicht im Kleingedruckten – nur mit `×` statt Häkchen und
                      eine Stufe blasser. Dieselbe Lösung wie bei den
                      Ausschlüssen des Wartungsvertrags.

                      Ohne diese Zeilen stehen zwei Karten nebeneinander, von
                      denen die eine vier Häkchen hat und die andere vier: Der
                      Unterschied zwischen den Modellen ist aber gar nicht die
                      Anzahl der Leistungen, sondern wer ab der Übergabe
                      Anmeldung, Versicherung und Wartung trägt. */}
                  {model.excludes ? (
                    <ul className="mt-3 grid gap-3">
                      {model.excludes.map((entry) => (
                        <li key={entry} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-current/25 text-[0.6875rem] leading-none font-bold text-current/55"
                          >
                            ×
                          </span>
                          <span className="text-current/60">
                            <span className="sr-only">Nicht enthalten: </span>
                            {entry}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {model.note ? (
                    <p className="mt-6 text-sm leading-relaxed text-current/60">
                      {model.note}
                    </p>
                  ) : null}

                  {/* `mt-auto`, damit beide Knöpfe auf einer Linie stehen,
                      auch wenn der eine Block eine Zeile länger ist.

                      Der Knopf ist jetzt zugleich die Anzeige der Wahl: Die
                      Karten *sind* eine Auswahl, seit das Formular unten sie
                      liest. Vorher führte er an das Formular, ohne dass von
                      der Entscheidung danach irgendwo etwas zu sehen war –
                      wer zurückscrollte, fand zwei gleich aussehende Karten.
                      Dieselbe Mechanik wie bei den Tarifkarten des
                      Wartungsvertrags, dasselbe Bauteil. */}
                  <div className="mt-auto pt-8">
                    <ChoiceAction
                      group="finanzierung"
                      id={model.id}
                      name={model.name}
                      primary={model.id === "mietkauf"}
                      href={`/finanzierung?anliegen=finanzierung-${model.id}#anfrage`}
                    />
                  </div>
                </div>
              </Reveal>
              );
            })}
          </ul>

          {/* Was für beide Modelle gilt – und der Satz, der sagt, warum auf
              dieser Seite keine einzige Beispielrate steht. */}
          {/* Überschrift und Einordnung auf der Achse, die fünf Punkte als
              ein Block darunter.

              Vorher stand die Überschrift in vier von zwölf Spalten links
              und die Liste in acht rechts – bei 1512 px eine 429 px breite
              Überschrift neben 936 px Liste, und die Liste selbst lief über
              die ganze rechte Hälfte. Der Block gehört aber zu *beiden*
              Karten darüber, nicht zu einer Seite; deshalb steht er in ihrer
              Mitte und in ihrer Breite (`max-w-[52rem]` gegen die 76 rem des
              Paares, damit die Lesestrecke nicht breiter wird als der Satz
              in den Karten).

              Die Einträge bleiben linksbündig: Es sind ganze Sätze, und
              zentriert wandert ihr Zeilenanfang unter jedem Aufzählungspunkt
              an eine andere Stelle. */}
          <Reveal delay={160}>
            <div className="mx-auto mt-14 max-w-[52rem] border-t border-current/12 pt-12 text-center">
              <h2 className="text-[length:var(--text-title)]">
                Für beide Modelle gilt
              </h2>
              <p className="mt-5 text-[length:var(--text-lead)] leading-relaxed">
                {financingTerms.intro}
              </p>
              <ul className="mt-8 text-left">
                {financingTerms.items.map((entry) => (
                  <li
                    key={entry}
                    className="flex items-start gap-3 border-b border-current/12 py-3 leading-relaxed first:border-t"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-current/40"
                    />
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Das geplante Modell steht sichtbar, aber ohne Anfrage: Ein Knopf an
          einem Angebot, das es noch nicht gibt, ist eine Zusage. Deshalb auch
          eine andere Fläche und ein anderes Zeichen als bei den beiden
          darüber – man soll den Unterschied sehen, bevor man liest. */}
      {planned.map((model) => (
        <Section key={model.id} tone="silver-200" space="tight">
          <Container>
            {/* Das Zeichen steht über dem Text, nicht daneben, und der Block
                auf der Achse.

                Als Zeile mit Zeichen links stand der Hinweis bei 1512 px in
                einer 768 px breiten Spalte am linken Rand einer 1416 px
                breiten Fläche – die größte Leerstelle der Seite, und sie lag
                unter zwei mittig gesetzten Karten. Der Aufbau ist jetzt
                derselbe wie im Kopf dieser Karten: Ring, Auszeichnung, Name,
                Satz. Der Unterschied zu ihnen bleibt sichtbar, weil er dort
                liegt, wo er hingehört – anderes Zeichen, andere Fläche, und
                keine Aktion: Ein Knopf an einem Angebot, das es noch nicht
                gibt, wäre eine Zusage. */}
            <Reveal className="mx-auto max-w-[36rem] border-t border-current/12 pt-12 text-center">
              <span
                aria-hidden="true"
                className="mx-auto grid size-12 place-items-center rounded-full border border-current/20"
              >
                <Clock className="size-5 text-current/70" />
              </span>
              <p className="eyebrow mt-5 justify-center text-current/90">
                {model.claim}
              </p>
              <h2 className="mt-3 text-[length:var(--text-title)]">
                {model.name}
              </h2>
              <p className="mt-4 leading-relaxed text-current/70">
                {model.description}
              </p>
            </Reveal>
          </Container>
        </Section>
      ))}

      <Section tone="ink">
        <FaqSection
          eyebrow="Häufige Fragen"
          title={
            <>
              Was feststeht und was im <Mark>Angebot</Mark> steht.
            </>
          }
          lead="Laufzeiten, Übernahme, Bonität und der Unterschied zwischen Abo und Ratenkauf."
          items={faqFinancing}
          mobileMax={4}
          more={
            <>Die übrigen Fragen beantworten wir in der Beratung.</>
          }
        />
      </Section>

      <Section tone="silver">
        <Container>
          {/* Einordnung über dem Formular, nicht daneben.

              Die Fünf-zu-sieben-Teilung ist die Hausform, und auf den anderen
              Formularseiten bleibt sie. Hier war sie der letzte linke Hang
              einer Seite, die oben schon auf der Mitte steht: Überschrift in
              553 px links, Formular in 816 px rechts, und der Text darüber
              gehört zu genau diesem Formular. Jetzt steht er über ihm, in
              seiner Breite und auf seiner Achse.

              Der Anker sitzt weiter an der Formularspalte und nicht an der
              Sektion – an der Sektion landete jeder Knopf, der „anfragen"
              heißt, auf der Überschrift statt am ersten Feld. */}
          <Reveal className="mx-auto max-w-[44rem] text-center">
            <p className="eyebrow justify-center text-current/90">
              Finanzierung anfragen
            </p>
            <h2 className="mt-5 text-[length:var(--text-display)]">
              Sagen Sie uns, welches <Mark>Fahrzeug</Mark> es sein soll.
            </h2>
            <p className="mt-6 leading-relaxed text-current/65">
              Mit dem Fahrzeug und der gewünschten Laufzeit rechnen wir Ihnen
              die Rate aus und schicken Ihnen das Angebot schriftlich. Erst
              danach entscheiden Sie.
            </p>
          </Reveal>
          <div
            id="anfrage"
            className="mx-auto mt-12 max-w-[44rem] scroll-mt-32 md:mt-14"
          >
            <Reveal delay={80}>
              {/* `topicFromQuery`: Die Wahl auf den beiden Karten steht in
                  der Adresse und wird hier gelesen – dieselbe Mechanik wie
                  beim Wartungsvertrag. Ohne Wahl bleibt das Feld leer und
                  ist Pflicht.

                  Die Zeile darüber sagt, was gewählt ist. Ohne sie stand die
                  Wahl allein im Auswahlfeld, also unter dem Namen und drei
                  Felder tiefer als der Knopf, der sie getroffen hat. Kein
                  Betrag daneben: Es gibt auf dieser Seite keinen. */}
              <ChosenLine
                group="finanzierung"
                items={modelSummary}
                label="Gewähltes Modell"
                empty={
                  <>
                    Noch kein Modell gewählt – im Formular unter „Anliegen“
                    auswählen oder oben auf eine der beiden Karten tippen.
                  </>
                }
              />
              <InquiryForm topicFromQuery />
            </Reveal>
          </div>
        </Container>
      </Section>

      <Related
        tone="silver-200"
        items={[
          {
            href: "/e-scooter",
            label: "Geprüfte E-Scooter",
            text: "Welche Geräte gerade da sind, mit Fotos, Messwerten und Preis.",
          },
          {
            href: "/versicherung",
            label: "Versicherungskennzeichen",
            text: "Wer kauft statt least, braucht das Kennzeichen separat – wir vermitteln es über die ERGO.",
          },
        ]}
      />

      <CtaBand
        formHref="#anfrage"
        eyebrow="Nächster Schritt"
        title={
          <>
            Welches Modell passt, klären wir <Mark>vorher</Mark>.
          </>
        }
        text="Sagen Sie uns, welches Fahrzeug Sie im Auge haben und über welchen Zeitraum Sie zahlen wollen. Rate, Laufzeit und Gesamtbetrag stehen dann vollständig in Ihrem Angebot."
      />

      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "Finanzierung", path: "/finanzierung" }]),
          /* Kein `offers`: Ein Offer ohne Preis ist kein Angebot, und einen
             Preis gibt es hier nicht – er hängt am Fahrzeug. Der Service
             beschreibt deshalb nur, was es gibt. */
          service({
            name: "Finanzierung und Mietkauf für E-Scooter",
            description:
              "Mietkauf-Abo über 24 oder 36 Monate mit Anmeldung, Haftpflicht- und Vollkaskoversicherung sowie Service in der Monatsrate, Übernahme zu 20 % des Neupreises. Alternativ Ratenkauf mit Anzahlung und monatlichen Raten per SEPA-Lastschrift, Eigentumsübergang mit der letzten Rate.",
            path: "/finanzierung",
            serviceType: "Finanzierung",
          }),
          faqPage(faqFinancing, "/finanzierung"),
        ])}
      />
    </>
  );
}
