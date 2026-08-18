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

  /* Der Punkt aus dem Google-Unternehmensprofil (18.08.2026), also die
     Stelle, an der auch Google den Betrieb führt. Davor stand hier die
     geokodierte Lage der Straße Im Kampfrad, weil die Hausnummer 3 in
     OpenStreetMap nicht einzeln erfasst ist – rund 35 m daneben. Und davor
     49,2338 / 9,3327, das lag einen Kilometer südwestlich am Mühlweg.
     Der Wert geht in das LocalBusiness-Schema und damit in die
     Kartenanzeige von Suchmaschinen; falsch verortet schickt er Kunden ins
     Wohngebiet. `public/img/karte-neuenstadt.png` bleibt gültig: 35 m sind
     auf dem Kartenausschnitt keine sichtbare Verschiebung. */
  geo: { lat: 49.2373006, lng: 9.3436176 },

  phone: { display: "+49 178 5097654", href: "tel:+491785097654" },
  email: "skopegebrauchtwarenhandel@gmail.com",

  // TODO Betreiber: verbindliche Öffnungszeiten festlegen und hier eintragen.
  // Bis dahin bewusst ohne Schema-Angabe, um keine falschen Zeiten auszuspielen.
  openingHours: "Termine nach Vereinbarung, telefonisch jederzeit erreichbar",

  /* Das Google-Unternehmensprofil, Kurzlink aus Google Maps. Er steht in
     `sameAs` und verbindet damit den LocalBusiness-Knoten des Schemas mit
     dem Profil, aus dem Note und Anzahl der Rezensionen stammen.
     TODO Betreiber: Social-Profile ergänzen, falls vorhanden. */
  googleProfile: "https://maps.app.goo.gl/hSnxAdXC3NXPHixX9",
  sameAs: ["https://maps.app.goo.gl/hSnxAdXC3NXPHixX9"] as string[],

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
 * Am 18.08.2026 im Profil abgelesen: 5,0 aus 37 Rezensionen. Vorher standen
 * hier 3 – die Zahl der Rezensionen, die von der Altseite übernommen wurden
 * und in `lib/data/testimonials.ts` liegen. Das war keine Angabe aus dem
 * Profil, sondern die Länge unserer eigenen Liste.
 *
 * Beide Werte sind eine Tatsachenbehauptung: Steht dort in Wirklichkeit 4,8
 * oder eine andere Anzahl, ist die Angabe irreführend im Sinne von § 5 UWG.
 * Deshalb gehören sie vor jedem Deploy abgeglichen, so wie der Warenbestand.
 *
 * Weiterhin bewusst kein `AggregateRating` im Schema: Google wertet eine
 * Bewertung, die ein Betrieb über sich selbst auszeichnet, als
 * self-serving – erlaubt ist sie nur für Bewertungen, die nicht die eigene
 * Organisation betreffen. Ein Verstoß kostet die Auszeichnung für die ganze
 * Domain, nicht nur für diesen Block. Der Beleg läuft stattdessen über
 * `site.googleProfile`: sichtbarer Verweis auf die Quelle statt Markup.
 */
export const googleRating = { value: "5,0", count: 37 } as const;

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
