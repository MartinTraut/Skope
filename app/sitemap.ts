import type { MetadataRoute } from "next";

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
    { url: `${site.url}/kontakt`, changeFrequency: "yearly" as const, priority: 0.7 },
    ...legalNav.map((item) => ({
      url: `${site.url}${item.href}`,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ].map((entry) => ({ ...entry, lastModified: now }));
}
