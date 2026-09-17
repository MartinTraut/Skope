"use client";

import { useQueryParam } from "@/lib/url-state";

/**
 * Die Zeile über dem Formular: was gewählt ist – und beim Wartungsvertrag,
 * was es kostet.
 *
 * Ohne sie steht die Wahl nur im Auswahlfeld des Formulars, also unter dem
 * Namen und ohne die Angabe, für die man sich gerade entschieden hat. Ohne
 * Wahl bleibt die Zeile neutral; erfunden wird nichts, die Angaben kommen als
 * Eigenschaft aus `lib/data/plans` bzw. `lib/data/financing`.
 *
 * `detail` ist bewusst optional: Auf der Finanzierungsseite gibt es keine
 * Zahl, die hier stehen könnte. Rate, Laufzeit und Gesamtbetrag hängen am
 * Fahrzeug, und eine Beispielzahl zöge nach § 16 PAngV die ganze
 * Pflichtangabenkette nach sich – die Begründung steht in
 * `lib/data/financing.ts`.
 */
export function ChosenLine({
  group,
  items,
  label,
  empty,
}: {
  /** Rumpf des Kürzels vor dem Bindestrich, z. B. `wartungsvertrag`. */
  group: string;
  items: Record<string, { name: string; detail?: string }>;
  label: string;
  empty: React.ReactNode;
}) {
  const slug = useQueryParam("anliegen");
  const prefix = `${group}-`;
  const id = slug?.startsWith(prefix) ? slug.slice(prefix.length) : null;
  const item = id ? items[id] : undefined;

  if (!item) {
    return (
      <p className="mb-6 text-sm leading-relaxed text-current/65">{empty}</p>
    );
  }

  return (
    <p className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border border-current/15 bg-current/5 px-4 py-3">
      <span className="text-sm text-current/65">{label}</span>
      <span className="font-display font-semibold tracking-tight">
        {item.name}
      </span>
      {item.detail ? (
        <span className="tabular text-sm text-current/75">{item.detail}</span>
      ) : null}
    </p>
  );
}
