import type { MetadataRoute } from "next";

import { inventory } from "@/lib/inventory";
import { legalNav, nav, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

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
  ].map((entry) => ({ ...entry, lastModified: now }));
}
