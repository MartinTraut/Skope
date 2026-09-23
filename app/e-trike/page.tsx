import type { Metadata } from "next";

import { VehicleCategoryPage } from "@/components/sections/vehicle-category-page";
import { Mark } from "@/components/ui/mark";
import { JsonLd, breadcrumb, pageGraph } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { vehicleKind } from "@/lib/data/vehicles";

export const metadata: Metadata = pageMeta({
  title: "E-Trike kaufen in Neuenstadt am Kocher",
  description:
    "Dreirädrige Elektrofahrzeuge aus der Fachwerkstatt in Neuenstadt am Kocher. Suchauftrag stellen, Finanzierung über Mietkauf-Abo oder Ratenkauf möglich.",
  path: "/e-trike",
});

export default function TrikePage() {
  return (
    <>
      <VehicleCategoryPage
        kind={vehicleKind("trike")}
        title={
          <>
            E-Trike <Mark>kaufen</Mark>.
          </>
        }
        lead="Drei Räder statt zwei: Ein Trike steht von allein und kippt im Stand nicht. Welche Zulassung ein Gerät hat, hängt am Modell – das klären wir vor dem Kauf."
        description="Was gerade da ist, steht hier. Was nicht da ist, steht hier auch nicht."
        topic="Suchauftrag E-Trike"
      />
      <JsonLd
        nodes={pageGraph([breadcrumb([{ name: "E-Trike", path: "/e-trike" }])])}
      />
    </>
  );
}
