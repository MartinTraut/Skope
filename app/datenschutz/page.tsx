import type { Metadata } from "next";

import { LegalPage } from "@/components/ui/legal";
import { JsonLd, breadcrumb, pageGraph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Datenschutzerklärung",
  description:
    "Welche personenbezogenen Daten beim Besuch dieser Website und bei einer Anfrage über das Formular verarbeitet werden, und welche Rechte Sie dabei haben.",
  path: "/datenschutz",
});

export default function PrivacyPage() {
  return (
    <>
      <LegalPage
        crumb="Datenschutz"
        eyebrow="Rechtliches"
        title="Datenschutzerklärung"
        lead="Ein Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen oder uns eine Anfrage schicken."
      >
        <h2>1. Datenschutz auf einen Blick</h2>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was
          mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website
          besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
          persönlich identifiziert werden können.
        </p>

        <h2>2. Verantwortliche Stelle</h2>
        <p>
          Die verantwortliche Stelle für die Datenverarbeitung auf dieser
          Website ist:
        </p>
        <p>
          {site.owner}
          <br />
          {site.legalName}
          <br />
          {site.address.street}
          <br />
          {site.address.postalCode} {site.address.city}
          <br />
          Deutschland
          <br />
          Telefon: <a href={site.phone.href}>{site.phone.display}</a>
          <br />
          E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>

        <h2>3. Datenerfassung auf dieser Website</h2>
        <h3>Cookies</h3>
        <p>
          Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr
          Webbrowser auf Ihrem Endgerät speichert. Cookies helfen uns dabei,
          unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
          Einige Cookies sind &bdquo;Session-Cookies&ldquo; und werden nach Ende
          Ihres Besuchs automatisch gelöscht, andere bleiben gespeichert, bis
          Sie sie löschen.
        </p>

        <h3>Kontakt- und Anfrageformular</h3>
        <p>
          Wenn Sie uns über das Formular auf dieser Website eine Anfrage
          schicken, verarbeiten wir die von Ihnen angegebenen Daten
          ausschließlich zur Bearbeitung dieser Anfrage: Name, E-Mail-Adresse,
          optional Telefonnummer und Angaben zum Fahrzeug sowie Ihre Nachricht.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bei vertragsanbahnenden
          Anfragen, im Übrigen Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
          Interesse an der Beantwortung von Anfragen). Die Daten verbleiben bei
          uns, bis der Zweck entfällt oder Sie uns zur Löschung auffordern;
          gesetzliche Aufbewahrungsfristen bleiben unberührt.
        </p>

        <h3>Vermittlung von Versicherungen</h3>
        <p>
          Für den Abschluss einer E-Scooter-Versicherung übermitteln wir die von
          Ihnen bereitgestellten Antragsdaten an unseren Partner ERGO. Diese
          Übermittlung erfolgt ausschließlich auf Ihre Veranlassung hin und ist
          zur Vertragserstellung erforderlich (Art. 6 Abs. 1 lit. b DSGVO).
        </p>

        <h2>4. Ihre Rechte</h2>
        <p>
          Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft,
          Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu
          erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung
          dieser Daten zu verlangen. Im Einzelnen:
        </p>
        <ul>
          <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
          <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
          <li>Recht auf Löschung (Art. 17 DSGVO)</li>
          <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
        </ul>
        <p>
          Ihnen steht zudem ein Beschwerderecht bei der zuständigen
          Aufsichtsbehörde zu.
        </p>

        <h2>5. Analyse-Tools</h2>
        <p>
          Beim Besuch dieser Website kann Ihr Surf-Verhalten statistisch
          ausgewertet werden. Das geschieht vor allem mit sogenannten
          Analyseprogrammen. Sofern eine Analyse eine Einwilligung erfordert,
          erfolgt sie erst nach Ihrer ausdrücklichen Zustimmung.
        </p>

        <h2>6. Hosting</h2>
        <p>
          Diese Website wird bei einem externen Dienstleister gehostet (Hoster).
          Die personenbezogenen Daten, die auf dieser Website erfasst werden,
          werden auf den Servern des Hosters gespeichert. Hierbei kann es sich
          v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten,
          Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige
          Daten, die über eine Website generiert werden, handeln.
        </p>

        {/* TODO Betreiber: Diese Erklärung wurde aus der Altseite übernommen und
            um Formular- und Versicherungsvermittlung ergänzt. Vor dem Livegang
            bitte durch eine fachkundige Stelle prüfen lassen und die konkret
            eingesetzten Dienste (Hoster, Analyse, Mail-Provider) namentlich
            benennen. */}
      </LegalPage>

      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "Datenschutz", path: "/datenschutz" }]),
        ])}
      />
    </>
  );
}
