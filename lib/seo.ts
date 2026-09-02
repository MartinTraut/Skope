import type { Metadata } from "next";

import { site } from "@/lib/site";

/**
 * Vorschau-Deployments (`*.vercel.app`) sind vollständige Kopien der Seite
 * unter einer fremden Adresse. Der Canonical zeigt zwar fest auf `site.url`,
 * aber gecrawlt und als Duplikat gelistet werden sie trotzdem – der
 * AEO-Bericht vom 18.08.2026 lief genau gegen so eine Vorschau. Vercel setzt
 * `VERCEL_ENV` auf „production" nur für das Produktions-Deployment; lokal ist
 * die Variable leer, und dort soll die Seite sich verhalten wie live.
 */
export const isPreview =
  !!process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production";

/**
 * Baut Metadata für eine Route.
 * Hält Titel und Description in den Längen, die Google tatsächlich anzeigt,
 * und sorgt dafür, dass og:url und canonical nie auseinanderlaufen.
 *
 * **Das Vorschaubild ist das Siegel, kein Motiv.** Bis zum 02.09.2026 stand
 * hier `scooter-studio.jpg`, und fünf Seiten setzten eigene Motive dagegen –
 * alle sechs mit KI erzeugt (siehe `lib/data/generated-images.ts`). Ein
 * Vorschaubild wird aus der Seite herausgelöst: Es steht in Chat-Verläufen, in
 * Zeitleisten und in Nachrichten, ohne die Bildunterschrift und ohne die Marke
 * im Bild, die die Herkunft erklären. Genau dort verlangt Art. 50 Abs. 4
 * EU-KI-VO die Offenlegung aber weiterhin – und mitliefern lässt sie sich
 * nicht. Also steht dort etwas Echtes: das Qualitätssiegel auf Tinte, in den
 * 1200 × 630 px, die alle Netzwerke erwarten (`public/img/og-skope.png`).
 *
 * Damit fällt der Grund für die früheren Einzelbilder je Route weg. Sie waren
 * ohnehin keine Auskunft über die Seite, sondern über ihr Thema; das Siegel
 * ist die Auskunft über den Absender, und die ist beim Teilen die
 * nützlichere. Sobald echte Aufnahmen aus Im Kampfrad 3 vorliegen, dürfen die
 * Routen wieder eigene Bilder bekommen.
 */
/**
 * Hängt einen Zusatz nur an, wenn die Description damit unter der
 * Anzeigegrenze bleibt – sonst schneidet Google mitten im Satz ab.
 */
export function fitDescription(base: string, extra: string, max = 158) {
  const joined = `${base} ${extra}`;
  return joined.length <= max ? joined : base;
}

export function pageMeta({
  title,
  description,
  path,
  absolute = false,
  image = "/img/og-skope.png",
  imageAlt = "Skope-Qualitätssiegel: geprüft in eigener Werkstatt, ein Jahr Gewährleistung, Neuenstadt am Kocher",
}: {
  /** Ohne Marken-Suffix – das Template hängt „| SKOPE" an. Ziel: ≤ 52 Zeichen. */
  title: string;
  /**
   * Nur für die Startseite: Nexts `title.template` gilt für Kind-Segmente,
   * `app/page.tsx` liegt aber im Segment des Layouts – der Titel käme ohne
   * „| SKOPE" heraus, als einzige Seite. Mit `absolute` hängt die Funktion das
   * Suffix selbst an.
   */
  absolute?: boolean;
  /** Ziel: 150–158 Zeichen, wichtigstes Signal zuerst. */
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  const full = `${title} | SKOPE`;
  return {
    title: absolute ? { absolute: full } : title,
    description,
    alternates: { canonical: path },
    // Next mischt `openGraph` nicht tief mit dem Layout: Ohne `siteName` hier
    // verlieren alle Unterseiten den Absender in der Teilen-Vorschau.
    openGraph: {
      type: "website",
      locale: "de_DE",
      siteName: site.name,
      url: path,
      title: full,
      description,
      images: [{ url: image, alt: imageAlt }],
    },
    ...(isPreview ? { robots: { index: false, follow: false } } : {}),
  };
}
