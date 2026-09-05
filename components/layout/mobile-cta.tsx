"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquareText, Phone } from "lucide-react";

import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Wohin „Anfrage" auf der jeweiligen Seite führt.
 * Seiten mit eigenem Formular bekommen den Sprung dorthin – ein Seitenwechsel
 * mitten im Lesefluss ist der teuerste Schritt im Conversion-Pfad.
 */
const FORM_ANCHOR: Record<string, string> = {
  "/reparatur": "#anfrage",
  "/versicherung": "#anfrage",
  "/wartungsvertrag": "#anfrage",
  "/recycling": "#anfrage",
  "/e-scooter": "#suchauftrag",
  "/kontakt": "#anfrage",
};

/**
 * Aktionsleiste am unteren Rand, nur unter `lg`.
 *
 * Auf dem Telefon bleibt beim Scrollen sonst nur ein Telefon-Icon im Header
 * sichtbar; der schriftliche Weg liegt hinter dem Burger-Menü. Auf den langen
 * Leistungsseiten liegen damit mehrere Bildschirmhöhen zwischen zwei
 * Handlungsmöglichkeiten.
 *
 * Erscheint erst nach etwa einer halben Bildschirmhöhe: Im Hero stehen dieselben
 * beiden Aktionen bereits groß, davor wäre die Leiste nur Verdeckung.
 */
export function MobileCta() {
  const pathname = usePathname();
  const [shown, setShown] = React.useState(false);

  /**
   * Ein Bild pro Messung, wie im Seitenkopf.
   *
   * Vorher lief der Vergleich in jedem Scroll-Ereignis. Trägheitsscrollen auf
   * dem Telefon liefert davon deutlich mehr als sechzig pro Sekunde, und jedes
   * hat hier einen `setState` mit gleichem Wert ausgelöst – React verwirft den
   * zwar, die Messung von `innerHeight` erzwingt aber vorher ein Layout. Genau
   * in dem Moment, in dem die Seite flüssig laufen muss.
   */
  React.useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      setShown(window.scrollY > window.innerHeight * 0.55);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const href = `${FORM_ANCHOR[pathname] ? "" : "/kontakt"}${
    FORM_ANCHOR[pathname] ?? "#anfrage"
  }`;

  return (
    <>
      {/* Platzhalter im Fluss, damit die Leiste nicht dauerhaft die letzten
          Zeilen des Footers verdeckt.

          Die Höhe rechnet die Aussparung mit: Auf einem iPhone ohne Knopf ist
          die Leiste um die 34 px der Streiflinie höher als hier stand, und
          genau die fehlten unten: Die letzte Zeile des Fußbereichs lag
          darunter. 4,5 rem sind die Leiste selbst (2 × 0,75 rem Polsterung
          plus 3 rem Knopfhöhe), der Rest ist Luft. */}
      <div
        aria-hidden="true"
        className="h-[calc(5.5rem+env(safe-area-inset-bottom))] lg:hidden"
      />

      {/* Ein Dock mit Rand, keine Leiste bis an die Gehäusekante. Der
          Rollbalken des Systems läuft am rechten Fensterrand über alles, was
          dort fest steht – über eine randlose Leiste also mitten durch den
          Anfrage-Knopf. Mit 0,75 rem Luft an beiden Seiten und unten liegt er
          neben dem Dock statt darauf. Unten gilt die Aussparung des Geräts,
          wenn sie größer ist. */}
      <div
        id="mobile-cta"
        className={cn(
          "liquid-glass fixed right-[max(0.75rem,env(safe-area-inset-right))] bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-[max(0.75rem,env(safe-area-inset-left))] z-40 overflow-hidden rounded-[1.5rem] border border-current/12 text-silver lg:hidden on-dark",
          "transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
          shown
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-[calc(100%+1.5rem)] opacity-0",
        )}
      >
        {/* Der Abstand zur Kameraaussparung liegt am Dock selbst (`left`/
            `right` mit `max(…, env(safe-area-inset-*))`), nicht mehr als
            `.gutter` an der Polsterung – dieselbe Regel wie im Satzspiegel
            der Seite, nur eine Ebene höher. Die Rundung ist die
            der Knöpfe (`rounded-full`, siehe button.tsx): Diese Leiste ist
            die Hauptaktion auf dem Telefon und darf nicht wie eine zweite
            Bauart daherkommen. */}
        <div className="flex items-stretch gap-2.5 px-3 py-3">
          <a
            href={site.phone.href}
            className="press flex h-12 flex-1 items-center justify-center gap-2.5 rounded-full bg-accent font-display font-semibold tracking-tight text-ink"
          >
            <Phone className="size-4" aria-hidden="true" />
            Anrufen
          </a>
          <Link
            href={href}
            className="press flex h-12 flex-1 items-center justify-center gap-2.5 rounded-full border border-current/30 font-display font-semibold tracking-tight text-silver"
          >
            <MessageSquareText className="size-4" aria-hidden="true" />
            Anfrage
          </Link>
        </div>
      </div>
    </>
  );
}
