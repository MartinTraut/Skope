/**
 * Die Fahrzeugarten, die der Betrieb führt.
 *
 * Hintergrund: Bis zum 20.09.2026 kannte die Seite genau eine Art – den
 * E-Scooter. In der Hauptnavigation stand „E-Scooter kaufen", die
 * Bestandsseite hieß so, und damit endete das Sortiment nach außen dort.
 * E-Chopper und E-Trike kamen nur an einer Stelle vor: in den
 * Finanzierungsmodellen („Die Modelle gelten für E-Scooter, E-Chopper und
 * E-Trike", Auskunft des Betreibers vom 16.09.2026). Eine Suche nach
 * „E-Chopper kaufen Heilbronn" konnte auf dieser Seite nichts finden, weil
 * es keine Seite dazu gab.
 *
 * **Was hier steht und was nicht.** Jede Art bekommt eine eigene Route, eine
 * eigene Überschrift und einen eigenen Platz in der Navigation. Was diese
 * Seiten *nicht* tun: ein Sortiment behaupten, das die Daten nicht hergeben.
 * `lib/inventory.ts` führt seit dem Abgleich mit den Kleinanzeigen vom
 * 20.09.2026 sieben E-Scooter, einen E-Chopper und ein E-Dreirad. Die Seite
 * für den E-Roller zeigt deshalb keinen erfundenen Bestand, sondern den Weg,
 * auf dem man an ein Gerät kommt – und sobald ein Eintrag mit
 * `category: "roller"` in der Liste steht, listet sie ihn, ohne dass jemand
 * sie anfassen muss.
 *
 * **Keine technischen Angaben je Art.** Ob ein Gerät 25 oder 45 km/h fährt,
 * ob es ein Versicherungskennzeichen und eine Fahrerlaubnis braucht, hängt
 * am einzelnen Modell und nicht an der Gattung. Ein Satz wie „E-Chopper
 * fahren 45 km/h" wäre für die Hälfte der Geräte falsch und für einen
 * Kaufinteressenten teuer.
 *
 * TODO Betreiber – hält die Schaltung der beiden neuen Routen auf:
 *   1. **Welche Arten werden tatsächlich verkauft?** Auskunft vom
 *      20.09.2026: „generalüberholte und neue Roller, Chopper, Scooter und
 *      E-Roller". Die Finanzierungsmodelle vom 16.09.2026 nennen E-Scooter,
 *      E-Chopper und E-Trike. Beides zusammen ergibt die vier Arten hier –
 *      Der Abgleich mit den Kleinanzeigen vom 20.09.2026 hat drei davon
 *      belegt: Es steht ein E-Chopper im Bestand und ein E-Dreirad, beide
 *      zum Verkauf. Der frühere Vorbehalt gegen das E-Trike ist damit
 *      erledigt. Offen bleibt der **E-Roller** – die Art steht in der
 *      Navigation, aber kein Gerät dieser Art in den Daten.
 *   2. Gibt es Geräte zum Fotografieren und Eintragen? Ohne eigenen Bestand
 *      bleibt die Seite ein Anfrageweg; mit drei Geräten ist sie eine Auslage.
 *   3. Beschafft der Betrieb auf Zuruf (Suchauftrag), oder nur aus dem, was
 *      ohnehin hereinkommt? Der Text unten sagt „wir sagen Ihnen, was
 *      möglich ist" und verspricht damit keine Beschaffung.
 */

export type VehicleCategory = "scooter" | "chopper" | "roller" | "trike";

export type VehicleKind = {
  id: VehicleCategory;
  /** Route. Der E-Scooter behält seine seit August bestehende Adresse. */
  href: string;
  /** Beschriftung in der Navigation – kurz, ohne Verb. */
  nav: string;
  /** Singular für Fließtext („ein E-Chopper"). */
  name: string;
  /** Mehrzahl für Überschriften und Listen. */
  plural: string;
};

export const vehicleKinds: VehicleKind[] = [
  {
    id: "scooter",
    href: "/e-scooter",
    nav: "E-Scooter",
    name: "E-Scooter",
    plural: "E-Scooter",
  },
  {
    id: "chopper",
    href: "/e-chopper",
    nav: "E-Chopper",
    name: "E-Chopper",
    plural: "E-Chopper",
  },
  {
    id: "roller",
    href: "/e-roller",
    nav: "E-Roller",
    name: "E-Roller",
    plural: "E-Roller",
  },
  {
    id: "trike",
    href: "/e-trike",
    nav: "E-Trike",
    name: "E-Trike",
    plural: "E-Trikes",
  },
];

export function vehicleKind(id: VehicleCategory): VehicleKind {
  const kind = vehicleKinds.find((k) => k.id === id);
  /* Kein Rückfall auf den ersten Eintrag: Eine Kategorie, die es nicht gibt,
     ist ein Programmierfehler und soll einer bleiben – sonst zeigt die Seite
     für „trike" stillschweigend E-Scooter. */
  if (!kind) throw new Error(`[vehicles] Unbekannte Fahrzeugart: ${id}`);
  return kind;
}

/**
 * Die Adresse eines Geräts: Art + Bezeichner.
 *
 * Steht hier und nicht an der Karte, weil vier Stellen dieselbe Adresse
 * bilden – Bestandskarte, Sitemap, Product-Schema und die untere
 * Aktionsleiste. Bis zum 20.09.2026 stand in allen vieren `/e-scooter/<id>`
 * fest verdrahtet; mit dem ersten E-Chopper im Bestand wären das vier
 * Stellen gewesen, an denen ein Chopper unter einer Scooter-Adresse steht.
 *
 * Das Argument ist absichtlich nur `{ id, category }` und nicht der ganze
 * `InventoryItem`: So kann auch ein Client-Bauteil die Adresse bilden, ohne
 * `lib/inventory` samt Bildern und Datenblättern ins Browserbündel zu ziehen.
 */
export function deviceHref(item: {
  id: string;
  category: VehicleCategory;
}): string {
  return `${vehicleKind(item.category).href}/${item.id}`;
}
