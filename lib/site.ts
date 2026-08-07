/**
 * Zentrale Stammdaten.
 * Alle Werte stammen aus der Altseite skopegebrauchtwarenhandel.com
 * (Stand der Extraktion: siehe PROJECT-BRIEF.md). Nichts erfunden.
 */

export const site = {
  name: "SKOPE",
  legalName: "Skopegebrauchtwarenhandel",
  owner: "Thomas Zielke",
  // TODO Betreiber: finale Domain festlegen (.com oder .de) und hier eintragen.
  url: "https://www.skopegebrauchtwarenhandel.com",
  tagline: "E-Scooter Fachwerkstatt & Refurbished-Verkauf",
  vatId: "DE346591640",

  address: {
    street: "Im Kampfrad 3",
    postalCode: "74196",
    city: "Neuenstadt am Kocher",
    region: "Baden-Württemberg",
    country: "DE",
  },

  geo: { lat: 49.2338, lng: 9.3327 },

  phone: { display: "+49 178 5097654", href: "tel:+491785097654" },
  email: "skopegebrauchtwarenhandel@gmail.com",

  // TODO Betreiber: verbindliche Öffnungszeiten festlegen und hier eintragen.
  // Bis dahin bewusst ohne Schema-Angabe, um keine falschen Zeiten auszuspielen.
  openingHours: "Termine nach Vereinbarung — telefonisch jederzeit erreichbar",

  // TODO Betreiber: Google-Business-Profil und Social-Profile ergänzen.
  sameAs: [] as string[],

  mapsUrl:
    "https://www.google.com/maps/dir//Im+Kampfrad+3,+74196+Neuenstadt+am+Kocher",
} as const;

export const proof = {
  repairs: 500,
  warrantyYears: 1,
  sealName: "Skope-Qualitätssiegel",
} as const;

/** Einzugsgebiet mit Entfernungen — von der Altseite übernommen. */
export const serviceArea = [
  { name: "Bad Friedrichshall", distance: "8 km" },
  { name: "Neckarsulm", distance: "12 km" },
  { name: "Heilbronn", distance: "15 km" },
  { name: "Bad Rappenau", distance: "18 km" },
  { name: "Öhringen", distance: "20 km" },
  { name: "Mosbach", distance: "25 km" },
] as const;

export const nearbyPlaces = [
  "Degmarn",
  "Stein am Kocher",
  "Cleversulzbach",
  "Möckmühl",
  "Gundelsheim",
  "Weinsberg",
] as const;

export const nav = [
  { href: "/e-scooter", label: "E-Scooter kaufen" },
  { href: "/reparatur", label: "Reparatur" },
  { href: "/wartungsvertrag", label: "Wartungsvertrag" },
  { href: "/versicherung", label: "Versicherung" },
  { href: "/recycling", label: "Recycling" },
  { href: "/ueber-uns", label: "Über uns" },
] as const;

export const legalNav = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB & Widerruf" },
] as const;

/** Hinweiszeile, die überall dort steht, wo Preise genannt werden. */
export const priceNote =
  "Alle Preise sind Endpreise. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).";

export const fullAddress = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;
