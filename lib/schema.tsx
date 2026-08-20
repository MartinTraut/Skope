/**
 * Strukturierte Daten als EIN verbundener @graph pro Seite.
 *
 * Wichtig: Basis- und Seitenknoten müssen im selben <script>-Block stehen.
 * Google führt zwar alle JSON-LD-Blöcke einer Seite zusammen, aber
 * validator.schema.org, Bing und generische RDF-Parser behandeln jedes
 * Script-Tag als eigenes Dokument – dort würden `provider`, `brand` und
 * `isPartOf` sonst auf leere Knoten zeigen. Deshalb rendert jede Seite
 * `pageGraph([...])`, nicht das Layout.
 */

import type { FaqItem } from "@/lib/data/faq";
import { inventory, type InventoryItem } from "@/lib/inventory";
import { testimonials } from "@/lib/data/testimonials";
import {
  fullAddress,
  nearbyPlaceNames,
  proof,
  serviceArea,
  site,
} from "@/lib/site";

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;
const PERSON_ID = `${site.url}/ueber-uns#thomas-zielke`;

type Node = Record<string, unknown>;

/**
 * Einzugsgebiet für `areaServed`.
 *
 * Der eigene Ort gehört ausdrücklich dazu – er fehlte, weil `serviceArea` nur
 * die Nachbarorte mit Entfernung führt. Die Kreisebene ergänzt, was
 * Ortsnamen allein nicht abdecken: Suchanfragen mit Landkreisbezug.
 */
const cities: Node[] = [
  { "@type": "City", name: site.address.city },
  ...serviceArea.map((place) => ({ "@type": "City", name: place.name })),
  ...nearbyPlaceNames.map((name) => ({ "@type": "City", name })),
  { "@type": "AdministrativeArea", name: "Landkreis Heilbronn" },
  { "@type": "AdministrativeArea", name: "Hohenlohekreis" },
  { "@type": "AdministrativeArea", name: "Neckar-Odenwald-Kreis" },
];

/** Basisknoten: LocalBusiness, Inhaber und WebSite. Steht auf jeder Seite. */
function baseNodes(): Node[] {
  return [
    {
      /* `Store` steht vorn, `AutoRepair` dahinter.
         Die Reihenfolge hat keine formale Bedeutung, die Auswahl schon: Bis
         zum 20.08.2026 war der Betrieb ausschließlich als Werkstatt
         ausgezeichnet. Für einen Betrieb, dessen Hauptgeschäft der Verkauf
         generalüberholter Geräte ist, fehlte damit im Schema genau der Typ,
         unter dem er gefunden werden soll. Beide bleiben stehen – er ist
         tatsächlich beides, und `AutoRepair` trägt die Reparaturseiten. */
      "@type": ["Store", "LocalBusiness", "AutoRepair", "Organization"],
      "@id": ORG_ID,
      name: site.legalName,
      alternateName: site.name,
      url: site.url,
      description:
        "Verkauf generalüberholter E-Scooter mit Skope-Qualitätssiegel und einem Jahr Gewährleistung in Neuenstadt am Kocher. Jedes Gerät wird in der eigenen Fachwerkstatt geprüft und aufbereitet. Dazu Reparatur aller Marken, Wartungsverträge, Versicherungskennzeichen über ERGO und kostenlose Verwertung von Altgeräten.",
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
      /* Reihenfolge nach Geschäftsgewicht: Verkauf zuerst. `knowsAbout` ist
         kein Ranking-Signal im engeren Sinn, aber es ist die Liste, aus der
         Antwortsysteme ableiten, wofür dieser Betrieb steht – und dort stand
         die Reparatur an erster und der Verkauf an vierter Stelle. */
      knowsAbout: [
        "Refurbished E-Scooter",
        "Gebrauchte E-Scooter mit Gewährleistung",
        "Ankauf gebrauchter E-Scooter",
        "E-Scooter Reparatur",
        "Akku-Diagnose",
        "Elektrokleinstfahrzeuge",
        "E-Scooter Versicherung",
      ],
      image: `${site.url}/img/scooter-studio.jpg`,
      // Pflichtfeld für das Marken-Panel. Quelle ist dieselbe Glyphe, aus der
      // auch das App-Icon gerastert wird – Next liefert sie unter /icon.png aus.
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/icon.png`,
        width: 512,
        height: 512,
      },
      // TODO Betreiber: Google-Business-Profil in site.sameAs eintragen –
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
        "Aufbereitung gebrauchter E-Scooter",
        "E-Scooter Reparatur",
        "Akku-Diagnose",
        "Elektrokleinstfahrzeuge",
      ],
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      url: site.url,
      name: `${site.name}: ${site.tagline}`,
      inLanguage: "de-DE",
      publisher: { "@id": ORG_ID },
    },
  ];
}

/**
 * Der Zeitpunkt, zu dem diese Seiten zuletzt erzeugt wurden.
 *
 * Einmal je Build ausgewertet, nicht je Aufruf: Alle Seiten sind statisch
 * vorgerendert, der Wert wird also in das HTML eingebacken und ändert sich erst
 * beim nächsten Deploy. Genau das soll er auch aussagen — nicht „dieser Text
 * wurde umgeschrieben", sondern „dieser Stand ist geprüft und veröffentlicht".
 * Für diese Seite ist das keine Behauptung ins Blaue: Vor jedem Deploy werden
 * Bestand, Verfügbarkeit und Preise durchgesehen (siehe CLAUDE.md).
 *
 * Warum es das überhaupt braucht: Ohne Datum irgendwo im Dokument stufen
 * Suchmaschinen und Antwortsysteme den Inhalt als undatiert und damit als
 * möglicherweise veraltet ein. Die Sitemap trägt zwar `lastmod`, aber nur für
 * die kanonische Adresse — wer die Seite unter einer anderen Domain abruft
 * (Vorschau-Deployment), findet dort keinen Eintrag und damit kein Datum.
 * Am Dokument selbst hängt das Signal unabhängig vom Host.
 */
const BUILD_DATE = new Date().toISOString();

type CrumbItem = { name?: string; item?: string };

/**
 * Setzt Basis- und Seitenknoten zu einem Graph zusammen und ergänzt den Knoten
 * für die Seite selbst.
 *
 * Der fehlte bisher komplett: Der Graph beschrieb den Betrieb, die Person, die
 * Website und die Leistungen — nur nicht das Dokument, auf dem er steht. Damit
 * gab es keinen Ort für Adresse, Sprache und Datum dieser einen Seite.
 *
 * Adresse und Name kommen aus dem Breadcrumb, den die Seite ohnehin mitgibt.
 * Das ist der Grund, warum hier keine zwölf Aufrufe geändert werden mussten:
 * Die Angabe steht schon da, sie wurde nur nicht weiterverwendet. Seiten ohne
 * Breadcrumb sind die Startseite und die Fehlerseite; dort greift die
 * Grundadresse.
 */
export function pageGraph(nodes: Node[] = []): Node[] {
  const crumb = nodes.find((node) => node["@type"] === "BreadcrumbList");
  const trail = (crumb?.itemListElement ?? []) as CrumbItem[];
  const last = trail.at(-1);

  const page: Node = {
    "@type": "WebPage",
    // `breadcrumb()` baut `item` ohne Schrägstrich am Ende, `site.url` ebenso –
    // die @id ist damit auf jeder Seite genau einmal vergeben.
    "@id": `${last?.item ?? site.url}#webpage`,
    url: last?.item ?? site.url,
    name: last?.name ?? `${site.name}: ${site.tagline}`,
    inLanguage: "de-DE",
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    dateModified: BUILD_DATE,
    ...(crumb ? { breadcrumb: { "@id": crumb["@id"] } } : {}),
  };

  return [...baseNodes(), page, ...nodes];
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
 * Leistungsseite – anderswo nur `serviceRef()` benutzen, sonst beschreiben
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
              // Festpreise zusätzlich flach als `price` – nur so erzeugt Google
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

/** FAQPage – nur ausgeben, wenn die Fragen sichtbar auf der Seite stehen. */
export function faqPage(items: FaqItem[], path: string): Node {
  return {
    "@type": "FAQPage",
    "@id": `${site.url}${path}#faq`,
    inLanguage: "de-DE",
    isPartOf: { "@id": SITE_ID },
    dateModified: BUILD_DATE,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * Der Erklärfilm auf der Startseite als `VideoObject`.
 *
 * Nur dort ausgeben, wo der Film sichtbar eingebunden ist – ein
 * VideoObject ohne abspielbaren Film auf der Seite ist genau der Fall, für
 * den Google die Auszeichnung als irreführend wertet. Er steht auf
 * /ueber-uns, deshalb hängt auch die @id dort.
 *
 * `uploadDate` ist das Datum der Fertigstellung und bleibt fest: Es ist eine
 * Eigenschaft des Films, nicht des Builds – anders als `dateModified` am
 * Dokument. `duration` in ISO 8601, gemessen mit ffprobe: 35,0 s.
 *
 * Kein `embedUrl`: Der Film liegt als Datei auf der eigenen Domain, es gibt
 * keinen Abspieler unter eigener Adresse. `contentUrl` ist hier das richtige
 * und einzige Feld.
 */
export function explainerVideo(): Node {
  return {
    "@type": "VideoObject",
    "@id": `${site.url}/ueber-uns#erklaerfilm`,
    name: "SKOPE: E-Scooter reparieren statt neu kaufen",
    description:
      "Erklärfilm der SKOPE E-Scooter Fachwerkstatt in Neuenstadt am Kocher: warum sich eine Reparatur meist lohnt, wie Fehlerspeicher und Akkukapazität gemessen werden, was der Kostenvoranschlag vor der Arbeit enthält, sowie geprüfte Gebrauchtgeräte, Wartungsverträge und Versicherungskennzeichen aus einer Hand.",
    thumbnailUrl: `${site.url}/img/erklaervideo-poster.jpg`,
    contentUrl: `${site.url}/video/skope-erklaervideo.mp4`,
    encodingFormat: "video/mp4",
    uploadDate: "2026-08-19",
    duration: "PT35S",
    inLanguage: "de-DE",
    isFamilyFriendly: true,
    publisher: { "@id": ORG_ID },
    about: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
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
 * Ein Bestandsgerät als Product mit Offer.
 *
 * Der Kommentar über `refurbishedService()` nennt den Grund, warum der
 * Verkauf dort als Service steht: ein Product ohne `offers` ist ein Fehler in
 * der Search Console. Bei einem einzelnen Gerät kehrt sich das um – Preis,
 * Bilder und Zustand liegen vor, und genau dieser Knoten trägt in der Suche
 * Preis und Verfügbarkeit.
 *
 * Der Knoten gehört ausschließlich auf `/e-scooter/<id>` und steht deshalb
 * auch mit dieser Adresse in `@id` und `offers.url`. Vorher lag er dreizehnmal
 * auf der Übersicht mit einem Sprungziel als Angebotsadresse: Google kann
 * daraus kein einzelnes Gerät als Ergebnis ausspielen, weil dreizehn Produkte
 * auf dieselbe URL zeigen. Die Übersicht führt sie jetzt nur noch als
 * `inventoryList()` – eine Liste mit Verweisen, keine dreizehn Datenblätter.
 *
 * `itemCondition` steht auf RefurbishedCondition und nicht auf UsedCondition,
 * weil jedes Gerät die Werkstattprüfung durchlaufen hat. Das ist der Zustand,
 * den das Siegel beschreibt.
 */
export function inventoryProduct(item: InventoryItem): Node {
  const url = `${site.url}/e-scooter/${item.id}`;

  return {
    "@type": "Product",
    "@id": `${url}#product`,
    name: item.model,
    description: item.summary,
    url,
    image: item.images.map((image) => `${site.url}${image.src}`),
    itemCondition: "https://schema.org/RefurbishedCondition",
    additionalProperty: item.specs.map((spec) => ({
      "@type": "PropertyValue",
      name: spec.label,
      value: spec.value,
    })),
    offers: {
      "@type": "Offer",
      price: item.priceValue,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/RefurbishedCondition",
      url,
      seller: { "@id": ORG_ID },
      warranty: {
        "@type": "WarrantyPromise",
        durationOfWarranty: {
          "@type": "QuantitativeValue",
          value: proof.warrantyYears,
          unitCode: "ANN",
        },
      },
    },
  };
}

/**
 * Der Bestand auf der Übersicht: eine geordnete Liste mit Verweisen auf die
 * Geräteseiten. Kein Product-Knoten – der steht dort, wo das Gerät vollständig
 * beschrieben ist. Die Liste sagt einer Suchmaschine, dass es sich um dreizehn
 * einzelne Angebote handelt und wo sie stehen.
 *
 * Leerer Bestand, keine Liste: `itemListElement: []` ist kein gültiger Knoten.
 */
export function inventoryList(): Node[] {
  if (inventory.length === 0) return [];

  return [
    {
      "@type": "ItemList",
      "@id": `${site.url}/e-scooter#bestand`,
      name: "Verfügbare generalüberholte E-Scooter",
      numberOfItems: inventory.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: inventory.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.model,
        url: `${site.url}/e-scooter/${item.id}`,
      })),
    },
  ];
}

/**
 * Kundenstimmen als Review-Knoten – ohne reviewRating, weil keine
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
