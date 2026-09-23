import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DevicePage, deviceMeta } from "@/components/sections/device-page";
import { getProduct, listByCategory } from "@/lib/commerce-source";

/**
 * Geräteseiten der Art „scooter".
 *
 * Die Datei ist bewusst dünn: Sie sagt nur, welche Art hier wohnt. Alles
 * Weitere – Kopfbereich, Galerie, Datenblatt, Schema – steht einmal in
 * `components/sections/device-page.tsx` und ist für alle vier Arten
 * dasselbe.
 *
 * `dynamicParams = false`: Der Bestand ist eine feste Liste im Code. Alle
 * Adressen entstehen beim Bauen, und eine weitere gibt es nicht. Ohne das
 * würde ein beliebiger Tippfehler in der Adresse serverseitig gerendert und
 * käme mit Status 200 als leere Seite zurück – ein Ergebnis, das Google
 * indexiert.
 *
 * Steht kein Gerät dieser Art im Bestand, entsteht hier keine einzige Seite.
 * Das ist der richtige Zustand und kein Fehler: Die Kategorieseite darüber
 * sagt dann, dass gerade nichts da ist, und bietet den Suchauftrag an.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return listByCategory("scooter").map((item) => ({ slug: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getProduct(slug);
  if (!item || item.category !== "scooter") return {};
  return deviceMeta(item);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getProduct(slug);
  /* Auch die Art muss stimmen: Ohne die Prüfung läge jedes Gerät unter jeder
     der vier Adressen – vier Adressen mit demselben Inhalt sind für Google
     dreimal doppelter Inhalt. */
  if (!item || item.category !== "scooter") notFound();
  return <DevicePage item={item} />;
}
