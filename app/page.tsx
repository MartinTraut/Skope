import type { Metadata } from "next";

import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { InsuranceTeaser } from "@/components/sections/insurance-teaser";
import { Pillars } from "@/components/sections/pillars";
import { InventoryTeaser } from "@/components/sections/inventory-teaser";
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
import { fullAddress, site } from "@/lib/site";
import { Mark } from "@/components/ui/mark";

export const metadata: Metadata = pageMeta({
  /* Bewusst nicht wortgleich mit /e-scooter („E-Scooter gebraucht kaufen in
     Heilbronn"): Zwei Seiten derselben Domain auf dieselbe Wortfolge
     anzusetzen, lässt Google eine davon aussortieren. Die Startseite trägt
     den eigenen Ort und das Unterscheidungsmerkmal, die Bestandsseite die
     größere Nachbarstadt und das Wort „gebraucht". */
  title: "Geprüfte E-Scooter kaufen in Neuenstadt",
  description:
    "Generalüberholte E-Scooter ab 169,99 € mit einem Jahr Gewährleistung, geprüft in eigener Werkstatt in Neuenstadt am Kocher. Dazu Reparatur und Wartung.",
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

        1. Was gibt es zu kaufen?              → Bestand
        2. Warum sollte ich dort kaufen?       → Werkstattprüfung
        3. Hat das schon jemand gemacht?       → Kundenstimmen
        4. Was gibt es sonst noch?             → Leistungen, Verträge, Versicherung
        5. Ist das weit weg?                   → Einzugsgebiet
        6. Was ist mit …?                      → FAQ
        7. Wie melde ich mich?                 → Abschluss

        An erster Stelle stand bis zum 20.08.2026 der Ablauf einer Reparatur.
        Das war die Startseite einer Reparaturannahme, und der Betrieb ist
        keine: Der Verkauf generalüberholter Geräte trägt das Geschäft,
        Reparatur, Wartung und Versicherung hängen daran. Wer nach „E-Scooter
        gebraucht kaufen" sucht, sah bis dahin auf der ganzen Startseite kein
        einziges Gerät.

        Die vier Reparaturschritte sind ersatzlos weg und nicht verschoben:
        Sie standen hier wortgleich noch einmal, obwohl /reparatur sie ohnehin
        führt. Zwei Kopien desselben Ablaufs sind kein zweiter Baustein,
        sondern einer, der beim nächsten Umschreiben an einer Stelle anders
        aussieht.

        Der Flächenwechsel bleibt: Bestand steht auf Silber, genau dort, wo der
        Ablauf stand. Hell → dunkel → hell läuft durch, keine zwei gleichen
        Töne stoßen aneinander.
      */}
      <Hero />
      <InventoryTeaser />
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
              Was Kunden vor dem <Mark>Kauf</Mark> wissen wollen.
            </>
          }
          lead="Die Fragen, die vor einem Gebrauchtkauf tatsächlich gestellt werden – und was eine Reparatur kostet. Ausführlichere Antworten zu Kauf, Reparatur, Wartung und Versicherung stehen auf den jeweiligen Leistungsseiten."
          items={faqHome}
        />
      </Section>

      {/* Der Abschluss der Startseite trägt jetzt einen eigenen Text statt
          der Vorgabe aus `CtaBand`. Die Vorgabe fragt „was macht der
          Scooter" – das ist die Reparaturannahme und passt auf /reparatur,
          wo sie auch steht. Hier ist der häufigste nächste Schritt ein Blick
          auf ein Gerät oder die Frage, ob eines mit passenden Daten
          hereinkommt. */}
      <CtaBand
        eyebrow="Nächster Schritt"
        title={
          <>
            Kommen Sie vorbei und <Mark>fahren</Mark> Sie ihn.
          </>
        }
        text={`Alle Geräte stehen ${fullAddress} und können vor dem Kauf gefahren werden. Ist nichts Passendes dabei, hinterlegen Sie einen Suchauftrag – wir melden uns, sobald ein Gerät hereinkommt. Für Reparaturen reicht ein kurzer Anruf.`}
      />

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
