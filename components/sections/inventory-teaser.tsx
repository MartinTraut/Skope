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
            Kachel, nicht nach der letzten. */}
        <Reveal delay={60}>
          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
            <div>
              <dt className="text-sm text-current/60">Geräte vorrätig</dt>
              <dd className="tabular mt-1 font-display text-[length:var(--text-stat)] font-bold tracking-tight">
                {facts.count}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-current/60">Preisspanne</dt>
              <dd className="tabular mt-1 font-display text-[length:var(--text-stat)] font-bold tracking-tight">
                {facts.priceFrom} – {facts.priceTo}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-current/60">Gewährleistung</dt>
              <dd className="mt-1 font-display text-[length:var(--text-stat)] font-bold tracking-tight">
                {proof.warrantyYears} Jahr
              </dd>
            </div>
          </dl>
        </Reveal>

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
