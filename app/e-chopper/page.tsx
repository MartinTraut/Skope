import type { Metadata } from "next";

import { VehicleCategoryPage } from "@/components/sections/vehicle-category-page";
import { Mark } from "@/components/ui/mark";
import { JsonLd, breadcrumb, pageGraph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { vehicleKind } from "@/lib/data/vehicles";

/* Eigene Adresse statt eines Abschnitts auf `/e-scooter`: Eine Suche nach
   „E-Chopper kaufen" landet nur dort, wo Überschrift, Titel und Adresse
   dieselbe Sache benennen. Was die Seite über den Bestand sagt, kommt aus
   den Daten – siehe `components/sections/vehicle-category-page.tsx`. */
export const metadata: Metadata = pageMeta({
  title: "E-Chopper kaufen in Neuenstadt am Kocher",
  description:
    "E-Chopper aus der Fachwerkstatt in Neuenstadt am Kocher, zwischen Heilbronn und Möckmühl. Suchauftrag stellen, Finanzierung über Mietkauf-Abo oder Ratenkauf möglich.",
  path: "/e-chopper",
});

export default function ChopperPage() {
  return (
    <>
      <VehicleCategoryPage
        kind={vehicleKind("chopper")}
        title={
          <>
            E-Chopper <Mark>kaufen</Mark>.
          </>
        }
        lead="Elektroroller im Chopper-Format: tiefer Sitz, breite Reifen, langer Lenker. Welche Zulassung ein Gerät hat, hängt am Modell – das klären wir vor dem Kauf."
        description="Was gerade da ist, steht hier. Was nicht da ist, steht hier auch nicht."
        topic="Suchauftrag E-Chopper"
      />
      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "E-Chopper", path: "/e-chopper" }]),
        ])}
      />
    </>
  );
}
