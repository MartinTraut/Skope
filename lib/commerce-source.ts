import "server-only";

import {
  commerceMode,
  type Availability,
  type CommerceMode,
} from "@/lib/commerce";
import {
  availabilityOf,
  condition,
  inventory,
  inventoryFacts,
  inventoryHighlights,
  inventoryItem,
  rangeKm,
  relatedInventory,
  type InventoryItem,
} from "@/lib/inventory";

/**
 * Die eine Stelle, an der die Seite ihre Ware herbekommt.
 *
 * Bis hierher las jede Seite `lib/inventory` unmittelbar: die Bestandsseite,
 * die Geräteseite, der Teaser der Startseite, das Schema. Solange die Ware in
 * einer TypeScript-Datei liegt, ist das bequem – beim Anschluss von Shopify
 * wäre es fünf Umbauten statt einem.
 *
 * Deshalb dieses Modul: Es reicht heute die lokale Liste durch und wird
 * morgen die Storefront fragen. Der **Rückgabetyp ist der Vertrag** – wer
 * eine zweite Quelle baut, muss ihn erfüllen, nicht die Oberfläche ändern.
 *
 * `server-only`: Die Ware trägt Bilder, Datenblätter und alle
 * Beschreibungstexte und gehört nicht ins Browserbündel. Client-Bauteile
 * bekommen die zwei, drei Werte, die sie brauchen, als Eigenschaft – so
 * arbeiten die Aktionsleiste am Telefon und der Bestandsfilter schon heute.
 */
export type Product = InventoryItem;

export type ProductSource = {
  /** Woher die Ware kommt – steht in Protokollen und im QA-Bericht. */
  readonly name: "local" | "shopify";
  list(): Product[];
  get(id: string): Product | undefined;
  related(id: string, count?: number): Product[];
  highlights(count?: number): Product[];
  facts(): ReturnType<typeof inventoryFacts>;
  availability(item: Product): Availability;
};

/**
 * Die gepflegte Liste aus `lib/inventory.ts`.
 *
 * TODO Betreiber: Sie ist Platzhalter – Modelle, Preise und Stückzahl sind
 * fiktiv (Auskunft vom 20.08.2026). Nichts daraus darf als Tatsache in Text,
 * Meta oder Schema wandern, was nicht ohnehin aus `facts()` kommt.
 */
const localSource: ProductSource = {
  name: "local",
  list: () => inventory,
  get: inventoryItem,
  related: relatedInventory,
  highlights: inventoryHighlights,
  facts: inventoryFacts,
  availability: availabilityOf,
};

/**
 * Die aktive Quelle.
 *
 * Sie hängt am Modus und nicht umgekehrt: `catalog` und `reservation` lesen
 * die lokale Liste, `checkout` setzt Shopify voraus – und `commerceMode()`
 * gibt `checkout` nur zurück, wenn der Zugang wirklich hinterlegt ist. Es
 * gibt damit keinen Zustand, in dem die Seite auf eine Quelle zeigt, die es
 * nicht gibt.
 */
export function productSource(): ProductSource {
  if (commerceMode() === "checkout") {
    /* Hier hängt später `shopifySource` aus `lib/commerce-shopify.ts`.
       Solange der Adapter nicht implementiert ist, kommt man an dieser Zeile
       ohnehin nicht vorbei – `shopifyConfigured()` müsste dafür wahr sein,
       und dann ist auch der Adapter fällig. */
    throw new Error(
      "[commerce] checkout-Modus verlangt eine Shopify-Quelle, die noch nicht implementiert ist.",
    );
  }
  return localSource;
}

/** Kurzwege für die Seiten – dieselben Namen wie bisher, andere Herkunft. */
export const listProducts = () => productSource().list();
export const getProduct = (id: string) => productSource().get(id);
export const relatedProducts = (id: string, count = 3) =>
  productSource().related(id, count);
export const highlightProducts = (count = 3) =>
  productSource().highlights(count);
export const productFacts = () => productSource().facts();
export const productAvailability = (item: Product) =>
  productSource().availability(item);

export { commerceMode, condition, rangeKm };
export type { Availability, CommerceMode };
