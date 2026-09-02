import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { InventoryCard } from "@/components/ui/inventory-card";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { inventoryFacts, inventoryHighlights } from "@/lib/inventory";
import { Mark } from "@/components/ui/mark";
import { proof } from "@/lib/site";

/**
 * Der Bestand auf der Startseite.
 *
 * Bis hierher zeigte die Startseite kein einziges Gerät. Sie beschrieb eine
 * Werkstatt, die nebenbei auch verkauft – und der Verkauf generalüberholter
 * Scooter ist das Hauptgeschäft. Wer über eine Suche nach „E-Scooter
 * gebraucht kaufen" hier landet, musste erst eine Ebene tiefer klicken, um
 * überhaupt zu sehen, dass es etwas zu kaufen gibt.
 *
 * Drei Karten, kein zweiter Bauplan: dieselbe `InventoryCard` wie auf der
 * Bestandsseite. Zwei Darstellungen desselben Geräts wären zwei Bauteile, von
 * denen eines beim nächsten Mal anders aussieht.
 *
 * Die Auswahl kommt aus `inventoryHighlights()` und ist über die Preisspanne
 * verteilt – die Begründung steht dort.
 */
export function InventoryTeaser() {
  const items = inventoryHighlights(3);
  const facts = inventoryFacts();

  return (
    <Section id="bestand" tone="silver">
      <Container>
        <SectionHead
          eyebrow="Sofort verfügbar · Neuenstadt am Kocher"
          title={
            <>
              Geprüfte Geräte, die <Mark>heute</Mark> hier stehen.
            </>
          }
          lead={`Jeder Scooter ist ein Einzelstück und läuft vor dem Verkauf durch dieselbe Werkstatt, die ihn danach auch wartet: Bremsen, Akkukapazität, Elektronik, Verschleißteile. Erst dann bekommt er das ${proof.sealName} und ${proof.warrantyYears} Jahr Gewährleistung.`}
        />

        {/* Die harten Angaben stehen über den Karten, nicht darunter: Sie
            beantworten „lohnt sich das Weiterlesen" – Anzahl, Spanne,
            Gewährleistung –, und diese Frage stellt sich vor der ersten
            Kachel, nicht nach der letzten.

            Als freie Beschreibungsliste auf Silber standen die drei Werte in
            derselben Farbe und auf derselben Fläche wie der Fließtext darüber:
            drei große Zahlen ohne Rahmen, deren Zusammengehörigkeit nur aus
            dem Abstand kam – und die Spanne riss auf mittleren Breiten aus der
            Reihe, weil sie doppelt so breit ist wie die anderen beiden.

            Jetzt tragen sie eine eigene Fläche in Tinte, dieselbe wie die
            Bestandskarten darunter, mit Haarlinien zwischen den Feldern. Auf
            Tinte darf die harte Zahl Neon sein – auf Silber wäre sie mit
            1,18:1 unlesbar –, und die Spanne bekommt zwei Zeilen statt einer:
            der Einstiegspreis groß, die Obergrenze klein darunter. Damit sind
            alle drei Felder gleich breit.

            Alle drei Werte in Neon, nicht nur der erste. Vorher trug „13" die
            Akzentfarbe und „ab 169,99 €" wie „1 Jahr" standen weiß – drei
            gleichrangige Zeilen mit zufällig unterschiedlichem Gewicht. Die
            Regel ist dieselbe wie am Kennzahlenband des Kopfbereichs: Die
            Farbe hängt an der Gattung („das hier sind die Zahlen"), nicht am
            Einzelfall. */}
        <Reveal delay={60}>
          {/* Auf dem Telefon drei Zeilen, ab `sm` drei Spalten.

              Gestapelt trug jedes Feld denselben Aufbau wie auf dem
              Schreibtisch – Bezeichnung oben, Zahl im Statgrad darunter – und
              das Band war damit bei 390 px 380 px hoch: eine halbe Bildhöhe
              für drei Angaben, die zusammen zwölf Wörter haben. Als Zeile mit
              zwei Enden (Bezeichnung links, Wert rechts) sind es 210 px, und
              die drei Werte stehen als Spalte untereinander statt
              eingerückt.

              Der Umschaltpunkt ist `lg`, nicht `sm`: Bei 768 px sind drei
              Spalten je 229 px breit, davon 181 px Satz – „ab 169,99 €"
              braucht im Statgrad rund 190 px und brach dort in zwei Zeilen.
              Ab 1024 px stehen 251 px je Feld zur Verfügung, dort passt
              es.

              Ab `lg` steht der Satz waagerecht mittig in der Zelle. Am
              linken Rand ausgerichtet standen die drei Angaben auf breiten
              Schirmen in der linken Hälfte ihrer Zelle, rechts daneben blieb
              jeweils die halbe Fläche leer – bei 1512 px sind das drei
              Zellen zu 530 px für Sätze von 60 bis 230 px. Die Trennlinien
              machen daraus drei Kästen, und ein Kasten mit Inhalt in einer
              Ecke liest sich als angeschnitten.

              Senkrecht bleibt der Satz oben. Die Preisspanne trägt eine
              zweite Zeile und ist damit 28 px höher als die anderen beiden
              Felder; mittig gesetzt läge ihre Zahl 14 px über „13" und
              „1 Jahr". Drei Zahlen derselben Gattung müssen auf einer Linie
              stehen – die tote Fläche darunter ist der billigere Fehler.

              Der Abstand zwischen Bezeichnung und Wert kommt jetzt aus
              `gap-3` der Spalte, nicht mehr aus einem oberen Rand am Wert –
              sonst stünden dort 24 px statt 12. */}
          <dl className="lift-lg mt-10 grid overflow-hidden rounded-lg border border-silver/15 bg-ink text-silver on-dark lg:grid-cols-3">
            <div className="flex min-w-0 items-baseline justify-between gap-3 border-b border-silver/12 px-5 py-4 lg:flex-col lg:items-center lg:justify-start lg:border-r lg:border-b-0 lg:p-8 lg:text-center">
              <dt className="eyebrow-plain min-w-0 text-silver/55">
                Geräte vorrätig
              </dt>
              <dd className="tabular min-w-0 font-display text-[length:var(--text-stat)] leading-none font-bold tracking-tight text-accent">
                {facts.count}
              </dd>
            </div>
            <div className="flex min-w-0 items-baseline justify-between gap-3 border-b border-silver/12 px-5 py-4 lg:flex-col lg:items-center lg:justify-start lg:border-r lg:border-b-0 lg:p-8 lg:text-center">
              <dt className="eyebrow-plain min-w-0 text-silver/55">
                Preisspanne
              </dt>
              <dd className="min-w-0 text-right lg:text-center">
                <span className="tabular block font-display text-[length:var(--text-stat)] leading-none font-bold tracking-tight text-accent">
                  {facts.priceFrom ? `ab ${facts.priceFrom}` : "auf Anfrage"}
                </span>
                {facts.priceTo ? (
                  <span className="tabular mt-1 block text-sm text-silver/60 lg:mt-2">
                    bis {facts.priceTo}
                  </span>
                ) : null}
              </dd>
            </div>
            <div className="flex min-w-0 items-baseline justify-between gap-3 px-5 py-4 lg:flex-col lg:items-center lg:justify-start lg:p-8 lg:text-center">
              <dt className="eyebrow-plain min-w-0 text-silver/55">
                Gewährleistung
              </dt>
              <dd className="min-w-0 font-display text-[length:var(--text-stat)] leading-none font-bold tracking-tight text-accent">
                {proof.warrantyYears} Jahr
              </dd>
            </div>
          </dl>
        </Reveal>

        {/* Hier eine Spalte am Telefon, auf der Bestandsseite zwei.

            Es ist dieselbe Karte, aber nicht dieselbe Aufgabe: Drei Geräte
            sind eine Auslage, dreizehn sind ein Katalog. Zweispaltig standen
            die drei hier als zwei plus eins – dieselbe ausgefranste Reihe,
            die auch die Schlagwortkapseln auf der Reparaturseite hatten – und
            drei Karten kosten einspaltig nur 1,7 Bildschirmhöhen. Auf der
            Bestandsseite wären dieselben Karten einspaltig 7,5. */}
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 80} as="li">
              <InventoryCard item={item} />
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120}>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ButtonLink href="/e-scooter#bestand" size="lg">
              Alle {facts.count} Geräte ansehen
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </ButtonLink>
            {/* Kein zweiter Knopf daneben: Wer kein passendes Gerät findet,
                ist der häufigere Fall als wer sofort kauft – der Suchauftrag
                gehört deshalb sichtbar hierher, aber nicht auf dieselbe
                Gewichtung wie der Bestand. */}
            <p className="max-w-md text-sm leading-relaxed text-current/70">
              Nichts Passendes dabei? Der Bestand wechselt laufend.{" "}
              <Link
                href="/e-scooter#anfrage"
                className="font-semibold underline underline-offset-2"
              >
                Suchauftrag hinterlegen
              </Link>{" "}
              – wir melden uns, sobald ein passendes Gerät hereinkommt.
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
