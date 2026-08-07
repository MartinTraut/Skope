/**
 * Strukturierte Daten als EIN verbundener @graph pro Seite.
 *
 * Wichtig: Basis- und Seitenknoten müssen im selben <script>-Block stehen.
 * Google führt zwar alle JSON-LD-Blöcke einer Seite zusammen, aber
 * validator.schema.org, Bing und generische RDF-Parser behandeln jedes
 * Script-Tag als eigenes Dokument — dort würden `provider`, `brand` und
 * `isPartOf` sonst auf leere Knoten zeigen. Deshalb rendert jede Seite
 * `pageGraph([...])`, nicht das Layout.
 */

import type { FaqItem } from "@/lib/data/faq";
import { testimonials } from "@/lib/data/testimonials";
import { fullAddress, nearbyPlaces, proof, serviceArea, site } from "@/lib/site";

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;
const PERSON_ID = `${site.url}/ueber-uns#thomas-zielke`;

type Node = Record<string, unknown>;

/**
 * Einzugsgebiet für `areaServed`.
 *
 * Der eigene Ort gehört ausdrücklich dazu — er fehlte, weil `serviceArea` nur
 * die Nachbarorte mit Entfernung führt. Die Kreisebene ergänzt, was
 * Ortsnamen allein nicht abdecken: Suchanfragen mit Landkreisbezug.
 */
const cities: Node[] = [
  { "@type": "City", name: site.address.city },
  ...serviceArea.map((place) => ({ "@type": "City", name: place.name })),
  ...nearbyPlaces.map((name) => ({ "@type": "City", name })),
  { "@type": "AdministrativeArea", name: "Landkreis Heilbronn" },
  { "@type": "AdministrativeArea", name: "Hohenlohekreis" },
  { "@type": "AdministrativeArea", name: "Neckar-Odenwald-Kreis" },
];

/** Basisknoten: LocalBusiness, Inhaber und WebSite. Steht auf jeder Seite. */
function baseNodes(): Node[] {
  return [
    {
      "@type": ["LocalBusiness", "AutoRepair", "Organization"],
      "@id": ORG_ID,
      name: site.legalName,
      alternateName: site.name,
      url: site.url,
      description:
        "Fachwerkstatt für E-Scooter und Verkauf generalüberholter Elektrokleinstfahrzeuge in Neuenstadt am Kocher. Reparatur, Wartungsverträge, Versicherung über ERGO und kostenlose Verwertung von Altgeräten.",
      telephone: site.phone.display,
      email: site.email,
      vatID: site.vatId,
      priceRange: "€€",
      hasMap: site.mapsUrl,
      // Referenz statt Inline-Knoten, sonst entstehen zwei getrennte Personen.
      founder: { "@id": PERSON_ID },
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        postalCode: site.address.postalCode,
        addressLocality: site.address.city,
        addressRegion: site.address.region,
        addressCountry: site.address.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: site.geo.lat,
        longitude: site.geo.lng,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: site.phone.display,
        email: site.email,
        contactType: "customer service",
        areaServed: "DE",
        availableLanguage: "German",
      },
      areaServed: cities,
      knowsAbout: [
        "E-Scooter Reparatur",
        "Akku-Diagnose",
        "Elektrokleinstfahrzeuge",
        "Refurbished E-Scooter",
        "E-Scooter Versicherung",
      ],
      image: `${site.url}/img/werkstatt-service.jpg`,
      // Pflichtfeld für das Marken-Panel. Quelle ist dieselbe Glyphe, aus der
      // auch das App-Icon gerastert wird — Next liefert sie unter /icon.png aus.
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/icon.png`,
        width: 512,
        height: 512,
      },
      // TODO Betreiber: Google-Business-Profil in site.sameAs eintragen —
      // ohne dieses Signal fehlt im Local Pack ein Hauptranking-Faktor.
      ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
      // Bewusst kein aggregateRating: keine belegbare Gesamtbewertung vorhanden.
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: site.owner,
      jobTitle: "Inhaber und Werkstattleiter",
      worksFor: { "@id": ORG_ID },
      knowsAbout: [
        "E-Scooter Reparatur",
        "Akku-Diagnose",
        "Elektrokleinstfahrzeuge",
      ],
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      url: site.url,
      name: `${site.name} — ${site.tagline}`,
      inLanguage: "de-DE",
      publisher: { "@id": ORG_ID },
    },
  ];
}

/** Setzt Basis- und Seitenknoten zu einem Graph zusammen. */
export function pageGraph(nodes: Node[] = []): Node[] {
  return [...baseNodes(), ...nodes];
}

/** Breadcrumb ab Ebene 2. Auf der Startseite weggelassen. */
export function breadcrumb(trail: { name: string; path: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    "@id": `${site.url}${trail.at(-1)?.path ?? ""}#breadcrumb`,
    itemListElement: [{ name: "Startseite", path: "/" }, ...trail].map(
      (item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: `${site.url}${item.path === "/" ? "" : item.path}`,
      }),
    ),
  };
}

/**
 * Ein Serviceknoten, immer mit dem Betrieb als provider verknüpft.
 * Die vollständige Definition gehört ausschließlich auf die jeweilige
 * Leistungsseite — anderswo nur `serviceRef()` benutzen, sonst beschreiben
 * zwei URLs dieselbe @id unterschiedlich.
 */
export function service({
  name,
  description,
  path,
  serviceType,
  offers,
  areaServed,
}: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  offers?: {
    name: string;
    price: string;
    unit?: string;
    description?: string;
    /**
     * Setzt den Wert als Untergrenze statt als Festpreis. Pflicht überall dort,
     * wo sichtbar „ab 15 €" steht: Ein `price` im Markup ist eine Zusage, und
     * Google darf ihn als Preis-Snippet ausspielen. Ein Startpreis, der als
     * Festpreis ausgezeichnet ist, ist damit eine Falschangabe.
     */
    from?: boolean;
  }[];
  /** Überschreibt das lokale Einzugsgebiet, z. B. für deutschlandweite Angebote. */
  areaServed?: Node[];
}): Node {
  return {
    "@type": "Service",
    "@id": `${site.url}${path}#service`,
    name,
    description,
    serviceType,
    provider: { "@id": ORG_ID },
    areaServed: areaServed ?? cities,
    ...(offers
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name,
            itemListElement: offers.map((offer) => ({
              "@type": "Offer",
              name: offer.name,
              ...(offer.description ? { description: offer.description } : {}),
              priceSpecification: {
                "@type": offer.unit
                  ? "UnitPriceSpecification"
                  : "PriceSpecification",
                ...(offer.from
                  ? { minPrice: offer.price }
                  : { price: offer.price }),
                priceCurrency: "EUR",
                // Kleinunternehmerregelung: Der genannte Betrag ist der Endpreis.
                valueAddedTaxIncluded: true,
                ...(offer.unit ? { unitText: offer.unit } : {}),
              },
              // Festpreise zusätzlich flach als `price` — nur so erzeugt Google
              // ein Preis-Snippet. Bei „ab"-Preisen bleibt das Feld bewusst leer.
              ...(offer.from
                ? {}
                : { price: offer.price, priceCurrency: "EUR" }),
            })),
          },
        }
      : {}),
  };
}

/** Reiner Verweis auf einen anderswo definierten Service. */
export function serviceRef(path: string): Node {
  return { "@id": `${site.url}${path}#service` };
}

/** FAQPage — nur ausgeben, wenn die Fragen sichtbar auf der Seite stehen. */
export function faqPage(items: FaqItem[], path: string): Node {
  return {
    "@type": "FAQPage",
    "@id": `${site.url}${path}#faq`,
    inLanguage: "de-DE",
    isPartOf: { "@id": SITE_ID },
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * Verkauf geprüfter Gebrauchtgeräte.
 * Bewusst als Service und nicht als Product: verkauft wird ein wechselnder
 * Bestand ohne veröffentlichte Preise, und ein Product ohne `offers`
 * verletzt die Pflichtfelder und erzeugt einen Fehler in der Search Console.
 */
export function refurbishedService(): Node {
  return service({
    name: `Verkauf geprüfter refurbished E-Scooter mit ${proof.sealName}`,
    description: `Generalüberholte E-Scooter aus der eigenen Fachwerkstatt ${fullAddress}. Jedes Gerät durchläuft vor dem Verkauf eine vollständige Prüfung von Bremsen, Akku, Elektronik und Verschleißteilen, erhält das ${proof.sealName} und wird mit ${proof.warrantyYears} Jahr Gewährleistung übergeben.`,
    path: "/e-scooter",
    serviceType: "Verkauf generalüberholter Elektrokleinstfahrzeuge",
  });
}

/**
 * Kundenstimmen als Review-Knoten — ohne reviewRating, weil keine
 * belegbaren Sterne vorliegen. Nur dort ausgeben, wo die Zitate sichtbar sind.
 */
export function reviews(path: string): Node[] {
  return testimonials.map((item, i) => ({
    "@type": "Review",
    // Die @id muss aus dem Seitenpfad kommen: Die Zitate stehen auf drei
    // Seiten, und drei URLs, die dieselbe @id definieren, sind genau der
    // Konflikt, vor dem der Kommentar bei service() warnt.
    "@id": `${site.url}${path === "/" ? "" : path}#review-${i + 1}`,
    author: { "@type": "Person", name: item.author },
    reviewBody: item.quote,
    itemReviewed: { "@id": ORG_ID },
    inLanguage: "de-DE",
  }));
}

/** Rendert den fertigen Graph als JSON-LD-Script. */
export function JsonLd({ nodes }: { nodes: Node[] }) {
  const graph = { "@context": "https://schema.org", "@graph": nodes };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
