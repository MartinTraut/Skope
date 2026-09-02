import type { MetadataRoute } from "next";

import { inventory } from "@/lib/inventory";
import { legalNav, nav, site } from "@/lib/site";

/**
 * Kein `lastModified`. Bis zum 02.09.2026 stand hier die Bauzeit an allen
 * 21 Adressen – Google ignoriert das Feld dauerhaft, sobald es nachweislich
 * nicht die Änderung des Dokuments beschreibt, und damit war auch das
 * wöchentliche Signal der Geräteseiten wertlos. Ein Datum kommt zurück,
 * sobald der Bestand über Shopify ein echtes `updatedAt` je Gerät liefert.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly" as const, priority: 1 },
    ...nav.map((item) => ({
      url: `${site.url}${item.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    /**
     * Die Geräteseiten. `weekly`, weil der Bestand tatsächlich wechselt – und
     * mit 0.7 unter den Leistungsseiten: Ein verkauftes Gerät verschwindet,
     * eine Leistungsseite bleibt. Wer die Einzelstücke gleichrangig meldet,
     * schickt Crawler bevorzugt auf die Adressen mit der kürzesten Lebensdauer.
     */
    ...inventory.map((item) => ({
      url: `${site.url}/e-scooter/${item.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    {
      url: `${site.url}/kontakt`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    },
    ...legalNav.map((item) => ({
      url: `${site.url}${item.href}`,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
