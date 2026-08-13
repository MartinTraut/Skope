"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Ein einziger IntersectionObserver für die gesamte Seite.
 *
 * Vorher legte jede Instanz einen eigenen an – auf der Startseite über
 * dreißig, auf /reparatur über zwanzig. Die Beobachtungsparameter sind für
 * alle identisch, also reicht einer: Er nimmt Elemente auf, setzt beim ersten
 * Sichtkontakt das Attribut und entlässt sie wieder. Das ist die einzige
 * dauerhafte Laufzeitlast im Scroll-Pfad, und so kostet sie fast nichts.
 */
let observer: IntersectionObserver | null = null;

function shared() {
  if (typeof IntersectionObserver === "undefined") return null;
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-shown", "true");
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
  );
  return observer;
}

type RevealTag =
  "div" | "section" | "article" | "li" | "header" | "figure" | "figcaption";

/**
 * Scroll-Reveal ohne Motion-Library.
 *
 * Die eigentliche Bewegung liegt in `.reveal` (globals.css) und respektiert
 * dort sowohl `prefers-reduced-motion` als auch den Fall ohne JavaScript.
 *
 * `immediate` überspringt die Animation und rendert den Inhalt schon im
 * Server-Markup sichtbar. Pflicht für alles above the fold: sonst wird das
 * LCP-Element transparent gemalt und die Messung startet erst nach der
 * Hydration.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  immediate = false,
  mask = false,
  as: Tag = "div",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  /** Staffelung in ms – bewusst klein halten (max. ~240 ms). */
  delay?: number;
  immediate?: boolean;
  /**
   * Masken-Reveal statt Einblenden: Der Inhalt wird von oben nach unten
   * freigegeben. Nur für große Überschriften – auf Fließtext wirkt es unruhig.
   */
  mask?: boolean;
  as?: RevealTag;
  /** Durchgereicht, damit ein Reveal auch eine Scroll-Region oder Figur sein kann. */
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">) {
  const ref = React.useRef<HTMLElement>(null);
  const Element = Tag as React.ElementType;

  React.useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    const io = shared();
    if (!el || !io) return;

    io.observe(el);
    return () => io.unobserve(el);
  }, [immediate]);

  return (
    <Element
      ref={ref}
      className={cn(mask ? "reveal-mask" : "reveal", className)}
      data-shown={immediate ? "true" : undefined}
      style={
        delay && !immediate
          ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties)
          : undefined
      }
      {...rest}
    >
      {mask ? <span className="reveal-mask-inner">{children}</span> : children}
    </Element>
  );
}
