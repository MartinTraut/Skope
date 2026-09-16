import type { MetadataRoute } from "next";

import { isPreview } from "@/lib/seo";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Vorschau-Deployments komplett sperren, siehe `isPreview` in lib/seo.ts.
    rules: isPreview
      ? { userAgent: "*", disallow: "/" }
      : {
          userAgent: "*",
          allow: "/",
          /* Die Kennzahlenseite ist intern. Sie trägt schon `noindex`, aber
             das liest ein Crawler erst nach dem Abruf – hier steht es vor
             dem ersten Aufruf. Beides zusammen, weil `Disallow` allein eine
             Adresse nicht aus dem Index hält, wenn irgendwo ein Link darauf
             zeigt. */
          disallow: ["/kennzahlen", "/api/"],
        },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
