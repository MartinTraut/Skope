"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquareText, Phone } from "lucide-react";

import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Wohin „Anfrage" auf der jeweiligen Seite führt.
 * Seiten mit eigenem Formular bekommen den Sprung dorthin — ein Seitenwechsel
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

  React.useEffect(() => {
    const onScroll = () =>
      setShown(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const href = `${FORM_ANCHOR[pathname] ? "" : "/kontakt"}${
    FORM_ANCHOR[pathname] ?? "#anfrage"
  }`;

  return (
    <>
      {/* Platzhalter im Fluss, damit die Leiste nicht dauerhaft die letzten
          Zeilen des Footers verdeckt. */}
      <div aria-hidden="true" className="h-[4.75rem] lg:hidden" />

      <div
        id="mobile-cta"
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-white/12 bg-ink/95 backdrop-blur-xl lg:hidden",
          "pb-[env(safe-area-inset-bottom)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
          shown
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0",
        )}
      >
        <div className="flex items-stretch gap-2.5 px-4 py-3">
          <a
            href={site.phone.href}
            className="flex h-12 flex-1 items-center justify-center gap-2.5 rounded-sm bg-flame font-display font-semibold tracking-tight text-ink"
          >
            <Phone className="size-4" aria-hidden="true" />
            Anrufen
          </a>
          <Link
            href={href}
            className="flex h-12 flex-1 items-center justify-center gap-2.5 rounded-sm border border-white/30 font-display font-semibold tracking-tight text-paper"
          >
            <MessageSquareText className="size-4" aria-hidden="true" />
            Anfrage
          </Link>
        </div>
      </div>
    </>
  );
}
