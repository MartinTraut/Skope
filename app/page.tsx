import type { Metadata } from "next";

import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { InsuranceTeaser } from "@/components/sections/insurance-teaser";
import { Pillars } from "@/components/sections/pillars";
import { Process } from "@/components/sections/process";
import { Plans } from "@/components/sections/plans";
import { RecyclingTeaser } from "@/components/sections/recycling-teaser";
import { Region } from "@/components/sections/region";
import { Testimonials } from "@/components/sections/testimonials";
import { Workshop } from "@/components/sections/workshop";
import { FaqSection } from "@/components/ui/faq";
import { Section } from "@/components/ui/section";
import { faqHome } from "@/lib/data/faq";
import { JsonLd, pageGraph, reviews, serviceRef } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { Mark } from "@/components/ui/mark";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter Werkstatt Neuenstadt am Kocher",
  description:
    "E-Scooter Reparatur für Heilbronn und Neckarsulm: Checkup 59,99 €, Wartung ab 17,99 €, geprüfte Gebrauchtgeräte. Fachwerkstatt in Neuenstadt am Kocher.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/*
        Reihenfolge nach Einwandlogik, nicht nach Leistungskatalog.

        Vorher stand direkt hinter dem Hero die Leistungsübersicht – die Seite
        zeigte, WAS es gibt, bevor jemand einen Grund hatte, dem Absender zu
        glauben. Wer mit einem defekten Gerät ankommt, hat aber eine andere
        Reihenfolge im Kopf:

        1. Was passiert, wenn ich anrufe?      → Ablauf
        2. Können die das überhaupt?           → Werkstatt
        3. Hat das schon jemand gemacht?       → Kundenstimmen
        4. Was habe ich zur Auswahl?           → Leistungen, Verträge, Versicherung
        5. Ist das weit weg?                   → Einzugsgebiet
        6. Was ist mit …?                      → FAQ
        7. Wie melde ich mich?                 → Abschluss

        Erst nach Schritt 3 kommen Angebote. Vorher ist jedes Angebot nur eine
        Behauptung. Der Flächenwechsel läuft dabei durchgehend hell → dunkel →
        hell, keine zwei gleichen Töne stoßen aneinander.
      */}
      <Hero />
      <Process />
      <Workshop />
      <Testimonials />
      <Pillars />
      <Plans />
      <InsuranceTeaser />
      <Region />
      <RecyclingTeaser />

      <Section id="faq" tone="silver">
        <FaqSection
          eyebrow="Häufige Fragen"
          title={
            <>
              Was Kunden vor dem ersten <Mark>Termin</Mark> wissen wollen.
            </>
          }
          lead="Vier Fragen, die uns am häufigsten gestellt werden. Ausführlichere Antworten zu Reparatur, Wartung, Versicherung und Kauf finden Sie auf den jeweiligen Leistungsseiten."
          items={faqHome}
        />
      </Section>

      <CtaBand />

      {/*
        Die Startseite verweist nur auf die Leistungen, sie definiert sie nicht:
        Eine @id ist ein global eindeutiger Bezeichner – zwei URLs, die dieselbe
        Entität unterschiedlich beschreiben, erzeugen einen Konflikt.
        Die FAQPage fehlt hier bewusst: die vier Fragen sind sichtbare Auszüge
        aus den Leistungsseiten, und Google schließt seitenübergreifend
        duplizierte FAQ-Inhalte von Rich Results aus.
      */}
      <JsonLd
        nodes={pageGraph([
          {
            "@type": "ItemList",
            "@id": `${site.url}/#leistungen`,
            name: "Leistungen",
            itemListElement: [
              "/e-scooter",
              "/reparatur",
              "/wartungsvertrag",
              "/versicherung",
              "/recycling",
            ].map((path, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: serviceRef(path),
            })),
          },
          ...reviews("/"),
        ])}
      />
    </>
  );
}
