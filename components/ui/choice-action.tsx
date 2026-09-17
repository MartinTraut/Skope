"use client";

import { Check } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { useQueryParam } from "@/lib/url-state";
import { cn } from "@/lib/utils";

/**
 * Der Knopf einer Auswahlkarte – und zugleich die Anzeige, ob diese Karte
 * gewählt ist.
 *
 * Die Auswahl steht in der Adresse (`?anliegen=wartungsvertrag-premium`,
 * `?anliegen=finanzierung-mietkauf`) und nirgends sonst. Damit lesen Karte,
 * Formular und untere Aktionsleiste denselben Wert, der Zurück-Knopf macht
 * die Wahl rückgängig, und eine geteilte Adresse trägt sie mit. Ein zweiter
 * Zustand in React wäre eine zweite Wahrheit.
 *
 * Nur der Knopf ist ein Client-Bauteil, nicht die ganze Karte: Alles andere
 * an ihr ist unveränderlicher Text aus `lib/data/plans` bzw.
 * `lib/data/financing`.
 *
 * `group` ist der Rumpf des Kürzels vor dem Bindestrich. Er steht hier als
 * Eigenschaft und nicht fest im Bauteil, weil zwei Seiten dieselbe Mechanik
 * brauchen – Wartungsvertrag und Finanzierung. Zwei Bauteile mit demselben
 * Verhalten und getrennter Beschriftung laufen beim ersten Eingriff
 * auseinander.
 */
export function ChoiceAction({
  group,
  id,
  name,
  href,
  primary,
}: {
  group: string;
  id: string;
  name: string;
  href: string;
  /** Trägt den Vollton. Genau eine Karte je Seite. */
  primary?: boolean;
}) {
  const selected = useQueryParam("anliegen") === `${group}-${id}`;

  return (
    <div className="flex flex-col gap-3">
      <ButtonLink
        href={href}
        size="lg"
        variant={primary ? "neon" : "outline"}
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
        {selected ? "Im Formular unten vorausgewählt." : " "}
      </p>
    </div>
  );
}
