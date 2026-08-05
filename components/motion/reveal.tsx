"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-Reveal ohne Motion-Library.
 *
 * Pro Instanz entsteht ein IntersectionObserver, der sich nach dem ersten
 * Treffer selbst trennt — Speicher wird also sofort wieder frei. Die eigentliche
 * Bewegung liegt in `.reveal` (globals.css) und respektiert dort sowohl
 * `prefers-reduced-motion` als auch den Fall ohne JavaScript.
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
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Staffelung in ms — bewusst klein halten (max. ~240 ms). */
  delay?: number;
  immediate?: boolean;
  as?: "div" | "section" | "article" | "li" | "header" | "figure";
}) {
  const ref = React.useRef<HTMLElement>(null);
  const Element = Tag as React.ElementType;

  React.useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-shown", "true");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate]);

  return (
    <Element
      ref={ref}
      className={cn("reveal", className)}
      data-shown={immediate ? "true" : undefined}
      style={
        delay && !immediate
          ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Element>
  );
}
