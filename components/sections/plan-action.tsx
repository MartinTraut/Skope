"use client";

import { Check } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { useQueryParam } from "@/lib/url-state";
import { cn } from "@/lib/utils";

/**
 * Der Knopf einer Tarifkarte – und zugleich die Anzeige, ob dieser Tarif
 * gewählt ist.
 *
 * Die Auswahl steht in der Adresse (`?anliegen=wartungsvertrag-premium`) und
 * nirgends sonst. Damit lesen Karte, Formular und untere Aktionsleiste
 * denselben Wert, der Zurück-Knopf macht die Wahl rückgängig, und eine
 * geteilte Adresse trägt sie mit. Ein zweiter Zustand in React wäre eine
 * zweite Wahrheit.
 *
 * Nur der Knopf ist ein Client-Bauteil, nicht die ganze Karte: Alles andere
 * an ihr ist unveränderlicher Text aus `lib/data/plans`.
 */
export function PlanAction({
  id,
  name,
  href,
  popular,
}: {
  id: string;
  name: string;
  href: string;
  popular?: boolean;
}) {
  const selected = useQueryParam("anliegen") === `wartungsvertrag-${id}`;

  return (
    <div className="flex flex-col gap-3">
      <ButtonLink
        href={href}
        size="lg"
        variant={popular ? "neon" : "outline"}
        className="w-full"
        aria-current={selected ? "true" : undefined}
      >
        {selected ? (
          <Check aria-hidden="true" className="size-4 shrink-0" />
        ) : null}
        {selected ? `${name} gewählt – zur Anfrage` : `${name} anfragen`}
      </ButtonLink>
      {/* Die Zeile erscheint nur an der gewählten Karte. Ohne sie steht die
          Auswahl allein im Formular weiter unten, und wer nach oben
          zurückscrollt, sieht zwei gleich aussehende Karten. */}
      <p
        aria-hidden={!selected}
        className={cn(
          "text-center text-sm transition-opacity duration-200",
          selected ? "text-current/70 opacity-100" : "opacity-0",
        )}
      >
        {selected ? "Im Formular unten vorausgewählt." : " "}
      </p>
    </div>
  );
}
