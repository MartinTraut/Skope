"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { PhoneButton } from "@/components/ui/phone-button";
import { Container } from "@/components/ui/section";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  /**
   * Das Menü merkt sich, auf welcher Route es geöffnet wurde. Sobald sich die
   * Route ändert, ist es abgeleitet wieder zu – ohne setState im Effect und
   * damit auch korrekt bei Vor- und Zurück-Navigation.
   */
  const [openedOn, setOpenedOn] = React.useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = React.useCallback(
    (next: boolean) => setOpenedOn(next ? pathname : null),
    [pathname],
  );
  const toggleRef = React.useRef<HTMLButtonElement>(null);

  /**
   * Zwei Schwellen, nicht eine – und ein Bild pro Zustandswechsel.
   *
   * Vorher stand hier ein einziger Vergleich gegen 24 px. Gemessen: Wer in
   * dieser Höhe stehenbleibt, schaltet den Kopf mit Bewegungen von einem
   * Pixel um; ein Test mit zehn Mikro-Scrolls zwischen 21 und 28 px ergab
   * zehn Umschaltungen. Jede davon startet eine 300-ms-Blende, die nächste
   * unterbricht sie – das ist das Flackern. Trägheitsscrollen und der
   * Gummiband-Effekt auf dem Telefon treffen diesen Bereich ständig.
   *
   * Mit getrennten Schwellen muss der Nutzer 32 px überschreiten, um die
   * Scheibe einzublenden, und wieder unter 8 px kommen, um sie loszuwerden.
   * Dazwischen passiert nichts. Der rAF-Riegel fasst zusätzlich die vielen
   * Scroll-Ereignisse pro Bild zu einer Messung zusammen.
   */
  React.useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      setScrolled((was) => (was ? window.scrollY > 8 : window.scrollY > 32));
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

  const panelRef = React.useRef<HTMLDivElement>(null);

  /**
   * Solange das Menü offen ist, bleibt der Seiteninhalt dahinter stehen – und
   * zwar auch für die Tastatur. Ohne `inert` tabbt man nach dem letzten
   * Menüpunkt in die verdeckten Links von <main> und <footer> und verliert den
   * sichtbaren Fokus komplett. Das Attribut wird per DOM gesetzt, weil beide
   * Elemente im Server-Layout liegen und nicht Kinder dieser Komponente sind.
   */
  React.useEffect(() => {
    const outside = [
      document.getElementById("inhalt"),
      document.querySelector("footer"),
      // Die Aktionsleiste liegt unter dem geöffneten Menü und wäre sonst
      // gleichzeitig sicht- und bedienbar – siehe #mobile-cta in globals.css.
      document.getElementById("mobile-cta"),
    ];
    document.body.style.overflow = open ? "hidden" : "";
    for (const el of outside) el?.toggleAttribute("inert", open);
    return () => {
      document.body.style.overflow = "";
      for (const el of outside) el?.removeAttribute("inert");
    };
  }, [open]);

  // Beim Öffnen in das Menü hineinspringen, statt den Fokus auf dem Auslöser
  // stehen zu lassen – Escape bringt ihn anschließend wieder zurück.
  React.useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector("a")?.focus();
  }, [open]);

  // Escape schließt das Menü und gibt den Fokus an den Auslöser zurück.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <header
      data-scrolled={scrolled || open ? "true" : "false"}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* Die Glasscheibe liegt als eigene Fläche hinter dem Inhalt, nicht auf
          dem <header> selbst. Grund: `backdrop-filter` lässt sich nicht sauber
          animieren – ein Übergang von `blur(0)` auf `blur(24px)` ruckelt in
          Chromium sichtbar, weil der Filter pro Bild neu gerechnet wird.
          `opacity` an einer eigenen Ebene läuft dagegen im Compositor, und die
          Scheibe blendet sauber ein.

          `-z-10` innerhalb des Stapelkontexts, den `z-50` am <header> ohnehin
          aufmacht: Die Scheibe liegt damit hinter Navigation und Knöpfen, aber
          weiterhin vor dem Seiteninhalt. */}
      <div
        aria-hidden="true"
        className={cn(
          "liquid-glass absolute inset-0 -z-10 transition-opacity duration-300",
          scrolled || open ? "opacity-100" : "opacity-0",
        )}
      />

      <Container className="flex h-[4.5rem] items-center justify-between gap-4 md:h-20">
        {/* Ohne Unterzeile: Gestapelt war der Logoblock 56 px hoch, der
            Schriftzug selbst saß dadurch bei 34 px Mitte, während Navigation,
            Telefonpille und CTA alle bei 40 px liegen. Sechs Pixel daneben –
            genug, dass die Kopfzeile nicht auf einer Linie liest. Die Zeile
            „Gebrauchtwarenhandel" steht weiterhin im Footer, wo Platz dafür
            ist. */}
        {/* `flex items-center` am Link selbst: Sonst sitzt die Wortmarke als
            inline-Element auf der Grundlinie und schleppt den Unterlängen-
            Durchschuss mit – gemessen weitere 4 px Versatz nach oben. */}
        <Link
          href="/"
          aria-label={`${site.name}, Startseite`}
          className="flex min-h-11 items-center"
        >
          <Logo showSub={false} />
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden shrink-0 xl:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex min-h-11 items-center rounded-md px-2.5 text-[0.9375rem] whitespace-nowrap transition-colors duration-200",
                      // 70 %, nicht 65. Auf der Glasscheibe über einer
                      // Silbersektion misst der Grund rgb(70,72,74); bei 65 %
                      // liegt der Link dort bei 4,51:1 und damit einen
                      // Hundertstel über AA. 70 % geben 4,95:1 – Luft für den
                      // Fall, dass die Scheibe irgendwann heller wird.
                      active
                        ? "text-current"
                        : "text-current/70 hover:text-current",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-2.5 bottom-1.5 h-px origin-left bg-accent transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.phone.href}
            className="hidden items-center gap-2.5 rounded-md border border-current/20 px-4 py-2.5 font-display text-sm font-semibold whitespace-nowrap transition-colors duration-200 hover:border-current/50 lg:inline-flex"
          >
            <Phone className="size-4" aria-hidden="true" />
            <span className="tabular">{site.phone.display}</span>
          </a>
          <ButtonLink href="/kontakt#anfrage" className="hidden lg:inline-flex">
            Anfrage senden
          </ButtonLink>

          <PhoneButton iconOnly className="lg:hidden" />

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            className="inline-flex size-11 items-center justify-center rounded-md border border-current/20 xl:hidden"
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile / Tablet Navigation */}
      <div
        ref={panelRef}
        id="mobile-nav"
        hidden={!open}
        className="max-h-[calc(100svh-4.5rem)] min-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-current/10 bg-ink-800 text-silver xl:hidden on-dark"
      >
        <Container className="py-6">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li key={item.href} className="border-b border-current/8">
                <Link
                  href={item.href}
                  // Deckt auch den Fall ab, dass die Zielroute die aktuelle ist –
                  // dann ändert sich `pathname` nicht und das Menü bliebe offen.
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-4 font-display text-2xl font-bold"
                >
                  <span className="tabular font-sans text-xs font-medium text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col gap-3">
            <ButtonLink
              href="/kontakt#anfrage"
              size="lg"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Anfrage senden
            </ButtonLink>
            <a
              href={site.phone.href}
              className="inline-flex h-[3.25rem] w-full items-center justify-center gap-2.5 rounded-md border border-current/25 font-display font-semibold"
            >
              <Phone className="size-4" aria-hidden="true" />
              <span className="tabular">{site.phone.display}</span>
            </a>
          </div>
        </Container>
      </div>
    </header>
  );
}
