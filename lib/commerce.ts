/**
 * Ein Ort für die Frage „was kann man hier eigentlich tun".
 *
 * Bis hierher stand die Antwort verteilt in der Oberfläche: „Gerät anfragen"
 * als Beschriftung in der Aktionsleiste, „Sofort verfügbar" als Satz auf der
 * Geräteseite, `InStock` fest im Schema. Drei Stellen, die dasselbe behaupten
 * und beim Anschluss von Shopify einzeln gefunden werden müssten – und keine
 * davon konnte „verkauft" überhaupt ausdrücken.
 *
 * Der Modus sagt, welcher Kaufweg **wirklich** funktioniert:
 *
 * - `catalog` – Auslage mit Anfrage. Es gibt keinen Warenkorb, keine
 *   Reservierung und keine Zahlung; der Weg zum Gerät ist das Formular oder
 *   das Telefon. Das ist der heutige Betrieb.
 * - `reservation` – wie oben, aber eine Reservierung ist eine verbindliche
 *   Zusage mit Zustand: Das Gerät wird für jemanden zurückgelegt und steht
 *   für andere nicht mehr bereit. Setzt einen Speicher voraus, der diesen
 *   Zustand hält.
 * - `checkout` – echter Kauf über Shopify. Setzt Storefront-Zugang, Preise
 *   und Bestand aus dem Shop voraus.
 *
 * **Der Modus wird nicht geglaubt, sondern geprüft.** `COMMERCE_MODE=checkout`
 * ohne Storefront-Zugang fällt auf `catalog` zurück und schreibt eine Zeile
 * ins Protokoll. Ein Knopf „Jetzt kaufen", hinter dem nichts liegt, ist
 * schlimmer als kein Knopf: Er ist eine Zusage, die der Betrieb nicht halten
 * kann (§ 5 UWG), und der Nutzer merkt es erst, nachdem er gedrückt hat.
 *
 * Diese Datei enthält bewusst **keine** Bestandsdaten und importiert
 * `lib/inventory` nicht: Sie wird auch von Client-Bauteilen gelesen (die
 * Aktionsleiste am Telefon), und das Bestandsmodul trägt Bilder, Datenblätter
 * und alle Beschreibungstexte.
 */

export type CommerceMode = "catalog" | "reservation" | "checkout";

/**
 * Zustand eines Einzelstücks.
 *
 * Ein Bestand aus Einzelstücken kennt keine Stückzahl, nur „ist es noch da".
 * Deshalb drei Werte und keine Zahl.
 */
export type Availability = "available" | "reserved" | "sold";

/** Ist eine echte Shopify-Storefront hinterlegt? Nur serverseitig lesbar. */
export function shopifyConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN?.trim() &&
    process.env.SHOPIFY_STOREFRONT_TOKEN?.trim(),
  );
}

/**
 * Gibt es einen Speicher, der Reservierungen hält?
 *
 * Heute nicht. Der Betrieb hat keinen Reservierungsweg – weder im Laden noch
 * hier –, und ein Zustand, den niemand setzen kann, ist kein Zustand.
 * Sobald Shopify hängt, trägt dessen Bestand ihn; bis dahin bleibt die
 * Funktion `false` und der Modus damit unerreichbar.
 */
function reservationConfigured(): boolean {
  return false;
}

let warned = false;

/**
 * Der Modus, der heute tatsächlich funktioniert.
 *
 * Nur auf dem Server aufrufen. Wo ein Client-Bauteil ihn braucht (die
 * Aktionsleiste am Telefon), reicht ihn das Layout als Eigenschaft weiter –
 * dieselbe Regel wie beim Bestand.
 */
export function commerceMode(): CommerceMode {
  const wanted = process.env.COMMERCE_MODE?.trim() as CommerceMode | undefined;
  if (wanted === "checkout" && shopifyConfigured()) return "checkout";
  if (wanted === "reservation" && reservationConfigured()) return "reservation";

  if (wanted && wanted !== "catalog" && !warned) {
    warned = true;
    console.warn(
      `[commerce] COMMERCE_MODE=${wanted} ist nicht einsatzbereit, bleibe bei catalog.`,
    );
  }
  return "catalog";
}

/**
 * Beschriftung und Ziel der Hauptaktion eines Geräts.
 *
 * Eine Funktion für alle Stellen: Geräteseite, Aktionsleiste am Telefon,
 * Bestandskarte. `disabled` heißt nicht „ausgegraut aus Höflichkeit", sondern
 * „diese Aktion gibt es für dieses Gerät nicht" – die Seite selbst bleibt
 * erreichbar, weil sie für Suchmaschinen und Wiederkehrer Bestand hat.
 */
export function deviceAction(
  mode: CommerceMode,
  availability: Availability,
  model: string,
  /**
   * Kaufadresse aus dem Shop. Nur der Shopify-Adapter kann sie liefern – ein
   * hier zusammengebauter Pfad wäre eine Route, die es nicht gibt. Fehlt sie,
   * bleibt es bei der Anfrage, auch wenn der Modus `checkout` sagt.
   */
  checkoutUrl?: string,
): { label: string; href: string | null; disabled: boolean } {
  const anfrage = `/kontakt?anliegen=geraet&geraet=${encodeURIComponent(model)}#anfrage`;

  if (availability === "sold") {
    return { label: "Verkauft", href: null, disabled: true };
  }
  if (availability === "reserved") {
    return { label: "Reserviert", href: null, disabled: true };
  }
  if (mode === "checkout" && checkoutUrl) {
    return { label: "Jetzt kaufen", href: checkoutUrl, disabled: false };
  }
  if (mode === "reservation") {
    return { label: "Reservieren", href: anfrage, disabled: false };
  }
  return { label: "Gerät anfragen", href: anfrage, disabled: false };
}

/** Kurzwort für die Karte und die Zeile unter dem Preis. */
export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: "Sofort verfügbar",
  reserved: "Reserviert",
  sold: "Verkauft",
};

/** schema.org-Wert für den Offer-Knoten. Kein Rateschritt, eine Zuordnung. */
export const AVAILABILITY_SCHEMA: Record<Availability, string> = {
  available: "https://schema.org/InStock",
  /* Ein reserviertes Einzelstück ist bestellbar für genau eine Person und
     für alle anderen nicht – aus Sicht der Seite also nicht verfügbar.
     `PreOrder` wäre falsch: Es sagt „kommt noch", nicht „ist weg". */
  reserved: "https://schema.org/OutOfStock",
  sold: "https://schema.org/SoldOut",
};
