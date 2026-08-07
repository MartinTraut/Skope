import type { Metadata } from "next";

import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { InsuranceTeaser } from "@/components/sections/insurance-teaser";
import { Pillars } from "@/components/sections/pillars";
import { Plans } from "@/components/sections/plans";
import { RecyclingTeaser } from "@/components/sections/recycling-teaser";
import { Region } from "@/components/sections/region";
import { Testimonials } from "@/components/sections/testimonials";
import { Workshop } from "@/components/sections/workshop";
import { Faq } from "@/components/ui/faq";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { faqHome } from "@/lib/data/faq";
import {
  JsonLd,
  pageGraph,
  reviews,
  serviceRef,
} from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "E-Scooter Werkstatt Neuenstadt am Kocher",
  description:
    "E-Scooter Reparatur für Heilbronn und Neckarsulm: Checkup 59,99 €, Wartung ab 17,99 €, geprüfte Gebrauchtgeräte. Fachwerkstatt in Neuenstadt am Kocher.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/*
        Reihenfolge nach Argumentationslogik, nicht nach Leistungsliste:
        Erst was wir tun (Pillars), dann wie geprüft wird (Workshop), dann was
        andere darüber sagen (Testimonials) — und erst danach Preise. Die
        Kundenstimmen standen vorher hinter zwei Preisblöcken; damit kam der
        erste fremde Beleg nach der teuersten Entscheidung.
        Der Flächenwechsel ink → ink-800 → paper → ink-800 → ink läuft dabei
        durchgehend, keine zwei gleichen Töne stoßen aneinander.
      */}
      <Hero />
      <Pillars />
      <Workshop />
      <Testimonials />
      <Plans />
      <InsuranceTeaser />
      <Region />
      <RecyclingTeaser />

      <Section id="faq" tone="ink">
        <Container>
          <SectionHead
            eyebrow="Häufige Fragen"
            title="Was Kunden vor dem ersten Termin wissen wollen."
            lead="Vier Fragen, die uns am häufigsten gestellt werden. Ausführlichere Antworten zu Reparatur, Wartung, Versicherung und Kauf finden Sie auf den jeweiligen Leistungsseiten."
          />
          <Faq items={faqHome} className="mt-14" />
        </Container>
      </Section>

      <CtaBand />

      {/*
        Die Startseite verweist nur auf die Leistungen, sie definiert sie nicht:
        Eine @id ist ein global eindeutiger Bezeichner — zwei URLs, die dieselbe
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
