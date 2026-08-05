import type { Metadata } from "next";

/**
 * Baut Metadata für eine Route.
 * Hält Titel und Description in den Längen, die Google tatsächlich anzeigt,
 * und sorgt dafür, dass og:url und canonical nie auseinanderlaufen.
 */
export function pageMeta({
  title,
  description,
  path,
  image = "/img/scooter-studio.jpg",
  imageAlt = "Generalüberholter E-Scooter mit Skope-Qualitätssiegel",
}: {
  /** Ohne Marken-Suffix — das Template hängt „| SKOPE" an. Ziel: ≤ 52 Zeichen. */
  title: string;
  /** Ziel: 150–158 Zeichen, wichtigstes Signal zuerst. */
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: path,
      title,
      description,
      images: [{ url: image, alt: imageAlt }],
    },
  };
}
