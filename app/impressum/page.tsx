import type { Metadata } from "next";

import { LegalPage } from "@/components/ui/legal";
import { JsonLd, breadcrumb, pageGraph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Impressum",
  description:
    "Impressum und Anbieterkennzeichnung nach § 5 TMG für Skopegebrauchtwarenhandel, Inhaber Thomas Zielke, Im Kampfrad 3, Neuenstadt am Kocher.",
  path: "/impressum",
});

export default function ImprintPage() {
  return (
    <>
      <LegalPage
        crumb="Impressum"
        eyebrow="Rechtliches"
        title="Impressum"
        lead="Anbieterkennzeichnung nach § 5 TMG und Verantwortlichkeit für den Inhalt nach § 55 Abs. 2 RStV."
      >
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          {site.legalName}
          <br />
          Inhaber: {site.owner}
          <br />
          {site.address.street}
          <br />
          {site.address.postalCode} {site.address.city}
          <br />
          Deutschland
        </p>

        <h2>Kontakt</h2>
        <p>
          Telefon: <a href={site.phone.href}>{site.phone.display}</a>
          <br />
          E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>

        <h2>Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
          <br />
          {site.vatId}
        </p>
        <p>
          Gemäß § 19 UStG wird keine Umsatzsteuer berechnet
          (Kleinunternehmerregelung).
        </p>

        <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p>
          {site.owner}
          <br />
          {site.address.street}
          <br />
          {site.address.postalCode} {site.address.city}
        </p>

        <h2>Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ec.europa.eu/consumers/odr
          </a>
          . Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </p>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
          vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <h2>Haftung für Inhalte</h2>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
          §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
          Tätigkeit hinweisen.
        </p>

        <h2>Haftung für Links</h2>
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
          fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
          verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
          Seiten verantwortlich.
        </p>

        <h2>Urheberrecht</h2>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
          Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
          Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
          jeweiligen Autors bzw. Erstellers.
        </p>

        {/* Der Nachweis ersetzt die Kennzeichnung am Bild nicht, er ergänzt
            sie. Art. 50 Abs. 4 EU-KI-VO verlangt die Offenlegung dort, wo der
            Inhalt wahrgenommen wird – das leistet die Marke im Bild. Hier
            steht, was sich in einer Ecke nicht sagen lässt: welche Aufnahmen
            es betrifft, womit sie entstanden sind und dass die Motive keinen
            realen Ort und keine reale Person zeigen. */}
        <h2>Bildnachweis und KI-Kennzeichnung</h2>
        <p>
          Ein Teil der Aufnahmen auf dieser Website ist mit künstlicher
          Intelligenz erzeugt und im Bild selbst als KI-Bild gekennzeichnet.
          Betroffen sind die Motive aus Werkstatt und Umgebung: die Aufnahme im
          Kopfbereich der Startseite, die Werkstattszene auf den Seiten Über uns
          und Wartungsvertrag, die Akku-Diagnose, die Studioaufnahme, die
          Tarifübersicht sowie die drei Straßen- und Stadtmotive. Diese Bilder
          sind Symbolbilder. Sie zeigen weder die Räume in Im Kampfrad 3 noch
          reale Personen; abgebildete Menschen existieren nicht. In den Dateien
          selbst ist die Herkunft zusätzlich als IPTC-Angabe hinterlegt
          (<code>DigitalSourceType: trainedAlgorithmicMedia</code>).
        </p>
        <p>
          Nicht erzeugt und damit nicht gekennzeichnet sind: das
          Skope-Qualitätssiegel, die Wort- und Bildmarke, die Preistafel zur
          ERGO-Versicherung, der Erklärfilm sowie die Fotos der angebotenen
          Geräte. Der Kartenausschnitt auf der Kontaktseite stammt aus
          OpenStreetMap.
        </p>
      </LegalPage>

      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "Impressum", path: "/impressum" }]),
        ])}
      />
    </>
  );
}
