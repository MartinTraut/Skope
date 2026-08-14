import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Sternreihe einer Google-Rezension.
 *
 * Eigene Datei, weil die Sterne an zwei Stellen stehen: im Kopfbereich der
 * Startseite und auf den Rezensionskarten. Zwei Fassungen derselben Reihe
 * hätten unweigerlich zwei Größen und zwei Gelbtöne bekommen.
 *
 * Das Gold ist kein zweiter Markenton, sondern ein Zitat: In genau dieser
 * Farbe erkennt jeder eine Google-Bewertung wieder. Neon kommt hier deshalb
 * nicht vor – es ist die Farbe der Handlung, und ein Beleg ist keine.
 */
export function Stars({
  rating,
  className,
  label,
  decorative = false,
}: {
  rating: number;
  className?: string;
  label?: string;
  /**
   * Für Stellen, an denen das umgebende Element die Bewertung bereits
   * ausspricht – sonst liest der Screenreader sie zweimal.
   */
  decorative?: boolean;
}) {
  return (
    <span
      className="flex items-center gap-0.5"
      {...(decorative
        ? { "aria-hidden": true as const }
        : { role: "img", "aria-label": label ?? `${rating} von 5 Sternen` })}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            "size-4",
            i < rating ? "fill-[#fbbc04] text-[#fbbc04]" : "text-current/25",
            className,
          )}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

/** Anfangsbuchstaben als Bildersatz – Begründung an `QuoteCard`. */
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
