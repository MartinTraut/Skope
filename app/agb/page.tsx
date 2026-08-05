import type { Metadata } from "next";

import { LegalPage } from "@/components/ui/legal";
import { JsonLd, breadcrumb, pageGraph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { fullAddress, site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "AGB & Widerrufsbelehrung",
  description:
    "Widerrufsrecht, Folgen des Widerrufs, Wertersatz und die einjährige Gewährleistung bei Gebrauchtwaren für Käufe bei Skopegebrauchtwarenhandel.",
  path: "/agb",
});

export default function TermsPage() {
  return (
    <>
      <LegalPage
        crumb="AGB & Widerruf"
        eyebrow="Rechtliches"
        title="AGB & Widerrufsbelehrung"
        lead="Was gilt, wenn Sie bei uns einen E-Scooter kaufen: Widerrufsrecht, Rückabwicklung und die Gewährleistung bei Gebrauchtwaren."
      >
        <h2>1. Widerrufsrecht</h2>
        <p>
          Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
          diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage
          ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter die Waren
          in Besitz genommen haben bzw. hat.
        </p>
        <p>Der Widerruf ist zu richten an:</p>
        <p>
          Inhaber: {site.owner}
          <br />
          Betriebsstätte: {fullAddress}
          <br />
          E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>

        <h2>2. Folgen des Widerrufs & Wertersatz</h2>
        <p>
          Im Falle eines wirksamen Widerrufs werden alle Zahlungen inklusive
          Lieferkosten (Standardversand) innerhalb von 14 Tagen zurückerstattet.
          Die unmittelbaren Kosten der Rücksendung tragen Sie als Käufer.
        </p>
        <p>
          <strong>Wichtiger Hinweis zum Zustand:</strong> Sie müssen für einen
          etwaigen Wertverlust (z. B. durch Beschädigung, Wasserschaden oder
          übermäßige Nutzung) aufkommen, wenn dieser auf einen Umgang
          zurückzuführen ist, der zur Prüfung der Beschaffenheit nicht notwendig
          war. In solchen Fällen wird der Wertverlust vom Erstattungsbetrag
          abgezogen.
        </p>

        <h2>3. Gewährleistung bei Gebrauchtwaren</h2>
        <p>
          Für alle verkauften Gebrauchtwaren (z. B. Scooter) gilt eine verkürzte
          Gewährleistungsfrist von einem Jahr ab Übergabe der Ware. Die Haftung
          für Schäden aus der Verletzung des Lebens, des Körpers oder der
          Gesundheit sowie für grob fahrlässige oder vorsätzliche
          Pflichtverletzungen bleibt hiervon unberührt.
        </p>

        <h2>4. Preise</h2>
        <p>
          Alle angegebenen Preise sind Endpreise. Gemäß § 19 UStG wird keine
          Umsatzsteuer berechnet und daher auch nicht ausgewiesen
          (Kleinunternehmerregelung).
        </p>

        {/* TODO Betreiber: Diese Bedingungen entsprechen inhaltlich der
            Altseite. Vor dem Livegang bitte durch eine fachkundige Stelle
            prüfen lassen — insbesondere, falls künftig ein Online-Verkauf mit
            Versand hinzukommt. */}
      </LegalPage>

      <JsonLd nodes={pageGraph([breadcrumb([{ name: "AGB & Widerruf", path: "/agb" }])])} />
    </>
  );
}
