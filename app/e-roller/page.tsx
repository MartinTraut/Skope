import type { Metadata } from "next";

import { VehicleCategoryPage } from "@/components/sections/vehicle-category-page";
import { Mark } from "@/components/ui/mark";
import { JsonLd, breadcrumb, pageGraph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { vehicleKind } from "@/lib/data/vehicles";

/* Eigene Adresse statt eines Abschnitts auf `/e-scooter`: Eine Suche nach
   „E-Roller kaufen" landet nur dort, wo Überschrift, Titel und Adresse
   dieselbe Sache benennen. Was die Seite über den Bestand sagt, kommt aus
   den Daten – siehe `components/sections/vehicle-category-page.tsx`. */
export const metadata: Metadata = pageMeta({
  title: "E-Roller kaufen in Neuenstadt am Kocher",
  description:
    "E-Roller aus der Fachwerkstatt in Neuenstadt am Kocher, zwischen Heilbronn und Möckmühl: neu und generalüberholt. Suchauftrag stellen, Finanzierung über Mietkauf-Abo oder Ratenkauf möglich.",
  path: "/e-roller",
});

export default function RollerPage() {
  return (
    <>
      <VehicleCategoryPage
        kind={vehicleKind("roller")}
        title={
          <>
            E-Roller <Mark>kaufen</Mark>.
          </>
        }
        lead="Der Sitzroller im Mopedformat: Sitzbank, Trittbrett, Stauraum unter dem Sitz. Welche Zulassung ein Gerät hat, hängt am Modell – das klären wir vor dem Kauf."
        description="Was gerade da ist, steht hier. Was nicht da ist, steht hier auch nicht."
        topic="Suchauftrag E-Roller"
      />
      <JsonLd
        nodes={pageGraph([
          breadcrumb([{ name: "E-Roller", path: "/e-roller" }]),
        ])}
      />
    </>
  );
}
