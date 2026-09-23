"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Zwei Pfeile für eine waagerechte Rollfläche.
 *
 * **Warum es sie gibt:** Eine Wischbahn hat am Telefon ihre Geste und nach
 * einem Tab ihre Pfeiltasten – am Schreibtisch mit der Maus hat sie nichts.
 * Gemessen an der Werkstattbahn bei 1512 px: `scrollWidth` 2893 bei 1512 px
 * sichtbarer Breite, also vier von sieben Kacheln außerhalb; der Rollbalken
 * ist über `.scroll-x` ausgeblendet, und ein senkrechtes Mausrad über der
 * Fläche bewegt sie nicht. Wer ein Trackpad hat, kommt weiter, wer eine Maus
 * hat, sieht drei Bilder und hält das für alle. Die Projektregel verlangt für
 * jede Hover- und Zeigergeste einen gleichwertigen zweiten Weg – hier gilt
 * sie andersherum.
 *
 * **Die Bahn wird über ihre `id` gefunden, nicht über eine Ref.** Die
 * Galerien sind Server-Bauteile; eine Ref ließe sich nicht über die Grenze
 * reichen, und die Bahn zum Client-Bauteil zu machen hieße, ihren Inhalt
 * mitzunehmen. So bleibt genau dieser Knopf das einzige Stück JavaScript.
 *
 * Ohne Skript erscheinen die Pfeile nicht – sie stehen erst, wenn sie auch
 * etwas tun (`useSyncExternalStore`, dieselbe Regel wie beim Bestandsfilter).
 * Gerollt wird um eine Sichtbreite minus einer Kachelkante, damit die
 * angeschnittene Kachel nach dem Schritt vollständig dasteht.
 */
export function LaneArrows({
  target,
  className,
}: {
  target: string;
  className?: string;
}) {
  /* Der Zustand kommt über `useSyncExternalStore`, nicht über `useState` samt
     Effekt: Die Rollposition ist ein Wert *außerhalb* von React, und ein
     `setState` im Effektkörper ist im Projekt per Lint gesperrt
     (`react-hooks/set-state-in-effect`) – dieselbe Stelle, an der schon das
     Fahrzeugmenü im Kopf und der Bestandsfilter hängengeblieben sind.

     Die Momentaufnahme ist eine Zeichenkette, kein Objekt: React vergleicht
     sie mit `Object.is`, und ein frisches Objekt je Aufruf wäre bei jedem
     Rollereignis ein neuer Wert und damit eine Endlosschleife.

     Auf dem Server und solange die Bahn nicht im Dokument steht, ist sie
     leer – dann erscheinen die Pfeile nicht. Das ist zugleich der Rückfall
     ohne JavaScript: Knöpfe, die nichts tun können, stehen nicht da. */
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const el = document.getElementById(target);
      if (!el) return () => {};
      el.addEventListener("scroll", onChange, { passive: true });
      const ro = new ResizeObserver(onChange);
      ro.observe(el);
      return () => {
        el.removeEventListener("scroll", onChange);
        ro.disconnect();
      };
    },
    [target],
  );

  const snapshot = React.useCallback(() => {
    const el = document.getElementById(target);
    if (!el) return "";
    /* 2 px Toleranz: Bei gebrochenen Gerätepixeln erreicht `scrollLeft` das
       rechnerische Maximum nie genau, und der rechte Pfeil bliebe für immer
       bedienbar, ohne etwas zu bewegen. */
    const start = el.scrollLeft <= 2;
    const end = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
    return `${start ? "1" : "0"}${end ? "1" : "0"}`;
  }, [target]);

  const state = React.useSyncExternalStore(subscribe, snapshot, () => "");

  if (!state) return null;

  const step = (dir: -1 | 1) => {
    const el = document.getElementById(target);
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth - 96), behavior: "smooth" });
  };

  const btn =
    "press grid size-12 place-items-center rounded-full border border-current/25 transition-[background-color,border-color,opacity] duration-200 ease-out-quart hover:border-current/50 disabled:pointer-events-none disabled:opacity-30";

  return (
    /* Nur ab `md`: Darunter ist die Geste da, und zwei Knöpfe über einer
       Bahn, die man ohnehin wischt, sind zwei Ziele ohne Aufgabe. */
    <div className={cn("hidden gap-2 md:flex", className)}>
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={state[0] === "1"}
        aria-controls={target}
        className={btn}
      >
        <ChevronLeft aria-hidden="true" className="size-5" />
        <span className="sr-only">Vorherige Aufnahmen</span>
      </button>
      <button
        type="button"
        onClick={() => step(1)}
        disabled={state[1] === "1"}
        aria-controls={target}
        className={btn}
      >
        <ChevronRight aria-hidden="true" className="size-5" />
        <span className="sr-only">Weitere Aufnahmen</span>
      </button>
    </div>
  );
}
