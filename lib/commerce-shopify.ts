import "server-only";

import { shopifyConfigured } from "@/lib/commerce";

/**
 * Anschlussstelle für die Shopify-Storefront – **noch nicht verbunden**.
 *
 * Der alte Shop hängt bereits an einer Storefront-API
 * (`qcdf0s-b5.myshopify.com`, Auskunft vom 20.08.2026). Zugangsdaten liegen
 * hier nicht vor und werden nicht erfunden: Diese Datei enthält deshalb den
 * Vertrag, die Fehlerfälle und die Abbildung der Felder – aber keinen Aufruf,
 * der ohne Konfiguration etwas vortäuschen könnte.
 *
 * **Was zum Livegang mit echtem Kauf noch fehlt** (keine davon ist eine
 * Codefrage):
 *
 * 1. Eine Entscheidung des Betreibers, ob über die Website überhaupt gekauft
 *    werden soll oder ob es bei Anfrage und Abholung bleibt. Bei
 *    Einzelstücken mit Differenzbesteuerung (§ 25a UStG) ist das keine
 *    Formalie – Rechnungslegung, Widerruf und Versand hängen daran.
 * 2. `SHOPIFY_STORE_DOMAIN` und `SHOPIFY_STOREFRONT_TOKEN` als
 *    serverseitige Umgebungsvariablen. Ein Storefront-Token ist zwar für den
 *    Browser gedacht, gehört hier aber trotzdem nicht hinter `NEXT_PUBLIC_`:
 *    Die Seite fragt serverseitig und liefert fertiges HTML aus.
 * 3. Die Zuordnung Gerät ↔ Shopify-Produkt. Die dreizehn Einträge in
 *    `lib/inventory.ts` haben eigene Kennungen; ohne `handle` oder Produkt-ID
 *    je Gerät gibt es keine Brücke, und geraten wird sie nicht.
 * 4. Wie der Bestand eines Einzelstücks geführt wird. Ein Roller ist genau
 *    einmal da; `quantityAvailable` muss auf 1 stehen und die Variante nach
 *    dem Verkauf auf `availableForSale: false` fallen, sonst verkauft der
 *    Shop denselben Scooter zweimal.
 * 5. Ob verkaufte Geräte im Shop bleiben. Die Seite kann sie führen
 *    (`availability: "sold"`, Aktion abgeschaltet) – dafür muss Shopify sie
 *    aber weiter ausliefern statt sie zu archivieren.
 * 6. **Wie die easyCredit-Finanzierung an den Kauf kommt** (Partnerschaft
 *    seit 25.09.2026, siehe `lib/data/financing.ts`). easyCredit führt auf
 *    seiner Plugin-Liste Shopware, WooCommerce, Magento, JTL, OXID,
 *    PrestaShop und rund fünfzehn weitere – **Shopify ist nicht dabei.**
 *    Drei Wege, und nur der erste kostet keine Entwicklung:
 *      a) Manuelle Zahlart in Shopify plus „Ratenkauf per Link" aus dem
 *         easyCredit-Händlerportal. Der Kunde bestellt, bekommt den Link,
 *         durchläuft die Prüfung bei der TeamBank, der Händler gibt die
 *         Zahlungsanfrage frei (Frist fünf Tage). Preis dafür: Die
 *         Entscheidung fällt **nach** der Bestellung, nicht im Checkout.
 *      b) Shopware oder WooCommerce statt Shopify – offizielles Plugin,
 *         Prüfung im Kaufvorgang, dafür ein Shopwechsel.
 *      c) Eigene Shopify-Payments-App. Bei dreizehn Einzelstücken
 *         unverhältnismäßig.
 *    Diese Datei ist von der Entscheidung nicht betroffen: Sie liest den
 *    Bestand, sie verkauft nicht. Der Punkt steht hier, weil er zusammen
 *    mit Punkt 1 beantwortet werden muss.
 */

export class ShopifyNotConfiguredError extends Error {
  constructor() {
    super(
      "Shopify ist nicht konfiguriert: SHOPIFY_STORE_DOMAIN und SHOPIFY_STOREFRONT_TOKEN fehlen.",
    );
    this.name = "ShopifyNotConfiguredError";
  }
}

/** Der Ausschnitt der Storefront-Antwort, den die Oberfläche braucht. */
export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceAmount: string;
  priceCurrency: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  images: { url: string; altText: string | null }[];
  /** Datenblattzeilen als Metafelder – Label und Wert wie in der Werkstatt. */
  specs: { label: string; value: string }[];
  /** Adresse für den Kauf. Ohne sie zeigt die Seite keinen Kaufknopf. */
  checkoutUrl: string | null;
};

/**
 * Ein Aufruf gegen die Storefront-API.
 *
 * Bewusst als einzige Netzstelle: Wer später Produkte, Preise oder Bestand
 * holt, geht hier durch – damit Zeitüberschreitung, Fehlerbehandlung und
 * Protokollierung einmal existieren und nicht dreimal.
 */
export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  if (!shopifyConfigured()) throw new ShopifyNotConfiguredError();

  const domain = process.env.SHOPIFY_STORE_DOMAIN!.trim();
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN!.trim();
  const version = process.env.SHOPIFY_API_VERSION?.trim() || "2025-01";

  const response = await fetch(
    `https://${domain}/api/${version}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      // Ohne Grenze hängt eine langsame Storefront die ganze Seite.
      signal: AbortSignal.timeout(8000),
    },
  );

  if (!response.ok) {
    /* Nur Status, kein Token und keine Nutzerdaten – dieselbe Regel wie in
       `lib/notify.ts`. */
    console.error("[shopify] Storefront antwortet nicht", response.status);
    throw new Error(`Storefront ${response.status}`);
  }

  const body = (await response.json()) as { data?: T; errors?: unknown[] };
  if (body.errors?.length) {
    console.error("[shopify] GraphQL-Fehler", body.errors.length);
    throw new Error("Storefront meldet GraphQL-Fehler");
  }
  if (!body.data) throw new Error("Storefront liefert keine Daten");
  return body.data;
}
