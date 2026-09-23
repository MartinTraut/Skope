import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { InquiryForm } from "@/components/forms/inquiry-form";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";
import { Related } from "@/components/sections/related";
import { InventoryCard } from "@/components/ui/inventory-card";
import { Mark } from "@/components/ui/mark";
import { PageHeader } from "@/components/ui/page-header";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { listByCategory } from "@/lib/commerce-source";
import type { ContactTopic } from "@/lib/data/topics";
import type { VehicleKind } from "@/lib/data/vehicles";

/**
 * Kategorieseite für eine Fahrzeugart außer dem E-Scooter.
 *
 * Der E-Scooter hat seine eigene, gewachsene Seite (`/e-scooter`) mit Filter,
 * Sortierung, Siegel-Abschnitt und eigener FAQ – die wird hier nicht
 * nachgebaut. Diese Seite ist der schlanke Zwilling für `/e-chopper` und
 * `/e-trike`: eine Adresse, unter der eine Suche nach „E-Chopper kaufen"
 * landen kann, mit dem Bestand dieser Art und dem Weg zu einem Gerät.
 *
 * **Sie behauptet keinen Bestand.** `listByCategory` liest dieselbe Liste wie
 * jede andere Seite; steht dort kein Gerät dieser Art – und Stand heute steht
 * dort keines –, sagt die Seite genau das und zeigt den Anfrageweg. Sobald
 * ein Eintrag mit der passenden `category` in `lib/inventory.ts` liegt,
 * listet sie ihn, ohne dass jemand diese Datei anfassen muss. Ein
 * Platzhalter-Gerät oder ein „ab"-Preis ohne Ware wäre an dieser Stelle eine
 * Tatsachenbehauptung über das Sortiment.
 */
export function VehicleCategoryPage({
  kind,
  title,
  lead,
  topic,
  description,
}: {
  kind: VehicleKind;
  /** Überschrift der Seite, mit genau einem Wort in Neon. */
  title: React.ReactNode;
  lead: string;
  /** Vorauswahl im Formular – ein Anliegen aus der Whitelist. */
  topic: ContactTopic;
  /** Ein Satz unter der Bestandsüberschrift. */
  description: string;
}) {
  const items = listByCategory(kind.id);

  return (
    <>
      <PageHeader
        crumb={kind.nav}
        /* Nicht der Name der Art: Der steht eine Zeile tiefer als
           Überschrift, und zweimal „E-Chopper" untereinander ist keine
           Einordnung, sondern eine Wiederholung. */
        eyebrow="Fahrzeuge · Neuenstadt am Kocher"
        title={title}
        lead={lead}
      />

      <Section id="bestand" tone="silver">
        <Container>
          <SectionHead
            eyebrow="Bestand"
            title={
              <>
                {kind.plural} <Mark>im Bestand</Mark>.
              </>
            }
            lead={description}
          />

          {items.length > 0 ? (
            /* Dasselbe Raster und dieselbe Karte wie auf der Bestandsseite –
               inklusive `auto-rows-fr`, damit alle Karten einer Reihe gleich
               hoch sind. Zwei Auslagen mit zwei Kartenformen wären zwei
               Bausteine. */
            <ul className="mt-12 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <li key={item.id} className="flex">
                  <InventoryCard item={item} />
                </li>
              ))}
            </ul>
          ) : (
            /* Der Leerstand ist eine Aussage, kein Fehlerzustand: Er nennt
               den Stand, den Grund und den nächsten Schritt. Kein
               „demnächst", kein Datum – beides wäre eine Zusage, für die es
               keine Grundlage gibt. */
            <Reveal className="mt-12">
              <div className="rounded-xl border border-ink/12 bg-silver-200/60 p-7 md:p-9">
                <PackageSearch
                  aria-hidden="true"
                  className="size-7 text-ink/45"
                  strokeWidth={1.5}
                />
                <p className="mt-5 font-display text-[length:var(--text-subtitle)] leading-snug font-bold tracking-tight">
                  Aktuell steht kein {kind.name} im Bestand.
                </p>
                <p className="mt-4 max-w-2xl leading-relaxed text-ink/70">
                  Der Bestand wechselt laufend. Sagen Sie uns über das Formular
                  unten, was Sie suchen – Einsatzzweck, Budget, gewünschte
                  Reichweite. Wir melden uns, sobald wir ein passendes Gerät
                  geprüft haben, und sagen Ihnen ehrlich, wenn es nichts wird.
                </p>
                <p className="mt-6 text-sm leading-relaxed text-ink/60">
                  Im Bestand stehen heute{" "}
                  <Link
                    href="/e-scooter#bestand"
                    className="font-semibold underline underline-offset-2"
                  >
                    generalüberholte E-Scooter
                  </Link>
                  .
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </Section>

      <Section tone="ink">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow text-current/90">Suchauftrag</p>
                <h2 className="mt-5 text-[length:var(--text-display)]">
                  Sagen Sie uns, was Sie <Mark>suchen</Mark>.
                </h2>
                <p className="mt-6 leading-relaxed text-current/65">
                  Einsatzzweck, Budget, gewünschte Reichweite. Wir melden uns,
                  sobald ein passendes Gerät geprüft und freigegeben ist.
                </p>
              </Reveal>
            </div>
            {/* Anker an der Formularspalte, nicht an der Sektion – sonst
                landet jeder „Anfrage"-Knopf auf der Überschrift und das erste
                Feld steht unter der Falz. Dieselbe Regel wie auf
                `/e-scooter`. */}
            <div id="anfrage" className="lg:col-span-7">
              <Reveal delay={80}>
                <InquiryForm defaultTopic={topic} />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Der Ton unterscheidet sich vom Block darüber (Tinte) und vom
          Abschluss darunter (Tinte). */}
      <Related
        tone="silver-200"
        items={[
          {
            href: "/finanzierung",
            label: "Finanzierung",
            text: `Mietkauf-Abo und Ratenkauf gelten für E-Scooter, E-Chopper und E-Trike.`,
          },
          {
            href: "/e-scooter",
            label: "E-Scooter im Bestand",
            text: "Generalüberholte Geräte mit einem Jahr Gewährleistung, geprüft in der eigenen Werkstatt.",
          },
          {
            href: "/reparatur",
            label: "Werkstatt",
            text: "Diagnose, Reparatur und Kostenvoranschlag vor der Arbeit – auch für Geräte, die nicht von uns sind.",
          },
        ]}
      />

      <CtaBand />
    </>
  );
}
