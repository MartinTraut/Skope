import type { MetadataRoute } from "next";

import { isPreview } from "@/lib/seo";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Vorschau-Deployments komplett sperren, siehe `isPreview` in lib/seo.ts.
    rules: isPreview
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
