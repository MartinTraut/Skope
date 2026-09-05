"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

/**
 * Zwei Regeln für die Seitenposition, beide gemessen an der Beschwerde
 * „ich lande irgendwo mitten auf der Seite":
 *
 * 1. **Ein Seitenwechsel beginnt oben.** Wer in der Kopfzeile „Reparatur"
 *    wählt, sieht den Kopfbereich der Reparaturseite – nicht die Stelle,
 *    an der er auf der vorigen Seite stand. Next setzt die Position beim
 *    Routenwechsel zwar selbst, aber weich (`scroll-behavior: smooth` am
 *    `html`) und auf das erste geänderte Segment; das ließ sich vom
 *    laufenden Rad überholen. Hier steht sie hart auf 0, bevor der neue
 *    Inhalt gezeichnet ist.
 *
 * 2. **Ein Sprungziel steht ganz im Bild.** Passt die Sektion unter die
 *    Kopfzeile, wird sie dort mittig gesetzt; ist sie höher als das Fenster,
 *    beginnt sie direkt unter der Kopfzeile. In beiden Fällen ist von der
 *    Sektion darüber nichts mehr zu sehen. Das gilt für jeden Verweis mit
 *    Raute auf derselben Seite (`#bestand`, `#anfrage`, `/#kundenstimmen`)
 *    und für den Aufruf einer Adresse mit Raute von einer anderen Seite aus.
 */
function headerHeight(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--header-h",
  );
  const rem = parseFloat(raw);
  return Number.isFinite(rem) ? rem * 16 : 80;
}

function scrollToId(id: string, behavior: ScrollBehavior) {
  const el = document.getElementById(id);
  if (!el) return false;
  const header = headerHeight();
  const rect = el.getBoundingClientRect();
  const room = window.innerHeight - header;
  const top =
    rect.height <= room
      ? rect.top + window.scrollY - header - (room - rect.height) / 2
      : rect.top + window.scrollY - header;
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

export function ScrollManager() {
  const pathname = usePathname();

  /* Regel 1 und 2 beim Routenwechsel. `useLayoutEffect`, damit die Position
     steht, bevor der Browser den neuen Inhalt malt. */
  React.useLayoutEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      /* Der Inhalt einer neuen Route ist im selben Tick noch nicht
         vollständig gemessen; ein Frame später stimmen die Maße. */
      requestAnimationFrame(() => {
        if (!scrollToId(hash, "instant")) {
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      });
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  /* Regel 2 für Verweise auf derselben Seite. */
  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const url = new URL(anchor.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        !url.hash
      )
        return;
      const id = decodeURIComponent(url.hash.slice(1));
      if (!document.getElementById(id)) return;
      event.preventDefault();
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      scrollToId(id, reduced ? "instant" : "smooth");
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  /* Kein Zoom auf dem iPhone. Safari beachtet weder `user-scalable=no` noch
     `maximum-scale` (seit iOS 10), wohl aber `preventDefault` auf seinen
     eigenen `gesture*`-Ereignissen, die nur bei zwei Fingern feuern. Ein
     Wischen mit einem Finger läuft unverändert. `passive: false` ist nötig,
     sonst wirkt `preventDefault` nicht. */
  React.useEffect(() => {
    const block = (event: Event) => event.preventDefault();
    const opts: AddEventListenerOptions = { passive: false };
    document.addEventListener("gesturestart", block, opts);
    document.addEventListener("gesturechange", block, opts);
    return () => {
      document.removeEventListener("gesturestart", block, opts);
      document.removeEventListener("gesturechange", block, opts);
    };
  }, []);

  return null;
}
