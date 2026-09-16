"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { visitSource } from "@/lib/source";

/**
 * Zählt zwei Dinge: aufgerufene Seiten und angetippte Telefonverweise.
 *
 * **Warum der Telefontipp hier hängt und nicht am Knopf.** Die Nummer steht an
 * sieben Stellen – Kopfzeile ab 1280 px, Symbolknopf darunter, untere
 * Aktionsleiste, Bestandsseite, Geräteseite, 404, Fußbereich. Ein `onClick` an
 * jeder einzelnen macht aus jedem dieser Bauteile eine Client Component und
 * vergisst beim achten Knopf die Zeile. Ein Zuhörer am Dokument erfasst
 * `a[href^="tel:"]` überall und für immer, auch in Bauteilen, die es noch
 * nicht gibt.
 *
 * Der Zuhörer hängt in der **Blasenphase** und ruft weder `preventDefault`
 * noch `stopPropagation`: Der Anruf muss zustande kommen, auch wenn das Zählen
 * scheitert. `sendBeacon` blockiert den Seitenwechsel nicht – ein `fetch`
 * würde beim Wechsel in die Telefon-App abgebrochen und die Hälfte der Tipps
 * ginge verloren.
 *
 * Gezählt werden Summen, keine Personen – die Begründung steht in
 * `lib/metrics.ts`.
 */
export function Counter() {
  const pathname = usePathname();

  useEffect(() => {
    send({ event: "seite", path: pathname });
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const link = target?.closest?.('a[href^="tel:"]');
      if (link) send({ event: "telefon", source: visitSource() });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

function send(payload: Record<string, string>) {
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/ereignis",
        new Blob([body], { type: "application/json" }),
      );
      return;
    }
    void fetch("/api/ereignis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* Zählen ist Beiwerk. Es darf die Seite unter keinen Umständen stören. */
  }
}
