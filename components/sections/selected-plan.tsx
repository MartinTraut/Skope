"use client";

import { useQueryParam } from "@/lib/url-state";

/**
 * Die Zeile über dem Formular: welcher Vertrag gewählt ist und was er kostet.
 *
 * Ohne sie steht die Wahl nur im Auswahlfeld des Formulars – unter dem
 * Vertragsnamen, ohne den Preis, für den man sich gerade entschieden hat.
 * Ohne Wahl bleibt die Zeile neutral und nennt beide Wege; erfunden wird
 * nichts, die Angaben kommen als Eigenschaft aus `lib/data/plans`.
 */
export function SelectedPlan({
  plans,
}: {
  plans: Record<string, { name: string; price: string }>;
}) {
  const slug = useQueryParam("anliegen");
  const id = slug?.startsWith("wartungsvertrag-")
    ? slug.slice("wartungsvertrag-".length)
    : null;
  const plan = id ? plans[id] : undefined;

  if (!plan) {
    return (
      <p className="mb-6 text-sm leading-relaxed text-current/65">
        Noch kein Vertrag gewählt – im Formular unter „Anliegen“ auswählen
        oder oben auf eine der beiden Karten tippen.
      </p>
    );
  }

  return (
    <p className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border border-current/15 bg-current/5 px-4 py-3">
      <span className="text-sm text-current/65">Gewählter Vertrag</span>
      <span className="font-display font-semibold tracking-tight">
        {plan.name}
      </span>
      <span className="tabular text-sm text-current/75">{plan.price}</span>
    </p>
  );
}
