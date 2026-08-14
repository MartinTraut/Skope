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

  /* TODO Betreiber: exakten Punkt der Einfahrt bestätigen.
     Hier standen 49,2338 / 9,3327 – das liegt rund einen Kilometer
     südwestlich am Mühlweg und nicht in der Straße Im Kampfrad. Der Wert
     geht in das LocalBusiness-Schema und damit in die Kartenanzeige von
     Suchmaschinen; falsch verortet schickt er Kunden ins Wohngebiet.
     Die jetzigen Werte sind die geokodierte Lage der Straße Im Kampfrad
     (OpenStreetMap), die Hausnummer 3 ist dort nicht einzeln erfasst. */
  geo: { lat: 49.237, lng: 9.3441 },

  phone: { display: "+49 178 5097654", href: "tel:+491785097654" },
  email: "skopegebrauchtwarenhandel@gmail.com",

  // TODO Betreiber: verbindliche Öffnungszeiten festlegen und hier eintragen.
  // Bis dahin bewusst ohne Schema-Angabe, um keine falschen Zeiten auszuspielen.
  openingHours: "Termine nach Vereinbarung, telefonisch jederzeit erreichbar",

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

/**
 * Bewertung aus dem Google-Unternehmensprofil.
 *
 * ⚠️ ZU PRÜFEN, bevor die Seite live geht. `value` und `count` sind aus den
 * drei Rezensionen abgeleitet, die von der Altseite übernommen wurden (siehe
 * `lib/data/testimonials.ts`) – nicht aus dem Profil abgelesen. Eine sichtbare
 * Durchschnittsnote ist eine Tatsachenbehauptung: Steht dort in Wirklichkeit
 * 4,8 oder eine andere Anzahl, ist die Angabe irreführend im Sinne von § 5
 * UWG und abmahnfähig.
 *
 * Sobald die Profil-URL vorliegt (`site.googleProfile`, ebenfalls offen),
 * gehören beide Werte von dort – und der Badge wird ein Link auf das Profil.
 *
 * Bewusst kein `AggregateRating` im Schema: Für strukturierte Daten muss die
 * Bewertung belegbar sein, und ein Verstoß kostet die Auszeichnung für die
 * ganze Domain, nicht nur für diesen Block.
 */
export const googleRating = { value: "5,0", count: 3 } as const;

/** Einzugsgebiet mit Entfernungen – von der Altseite übernommen. */
export const serviceArea = [
  { name: "Bad Friedrichshall", distance: "8 km" },
  { name: "Neckarsulm", distance: "12 km" },
  { name: "Heilbronn", distance: "15 km" },
  { name: "Bad Rappenau", distance: "18 km" },
  { name: "Öhringen", distance: "20 km" },
  { name: "Mosbach", distance: "25 km" },
] as const;

/**
 * Die näheren Orte, ebenfalls mit Entfernung.
 *
 * Ohne Kilometerangabe war das eine reine Namensliste – und im Laufband stand
 * die Hälfte der Orte ohne den einen Wert, wegen dem jemand hinsieht. Die
 * Werte sind Fahrstrecken ab Im Kampfrad, berechnet über OSRM auf
 * OpenStreetMap-Daten (Stand 13.08.2026), auf ganze Kilometer gerundet:
 * Degmarn 5,7 · Stein am Kocher 6,0 · Cleversulzbach 2,9 · Möckmühl 13,4 ·
 * Gundelsheim 16,9 · Weinsberg 16,8.
 *
 * Ausgangspunkt ist `geo` und damit die Strasse, nicht die Hausnummer – auf
 * ganze Kilometer gerundet fällt das nicht ins Gewicht.
 */
export const nearbyPlaces = [
  { name: "Cleversulzbach", distance: "3 km" },
  { name: "Degmarn", distance: "6 km" },
  { name: "Stein am Kocher", distance: "6 km" },
  { name: "Möckmühl", distance: "13 km" },
  { name: "Weinsberg", distance: "17 km" },
  { name: "Gundelsheim", distance: "17 km" },
] as const;

/** Nur die Namen – für Fliesstext und strukturierte Daten. */
export const nearbyPlaceNames = nearbyPlaces.map((place) => place.name);

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
