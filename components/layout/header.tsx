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
   * Route ändert, ist es abgeleitet wieder zu — ohne setState im Effect und
   * damit auch korrekt bei Vor- und Zurück-Navigation.
   */
  const [openedOn, setOpenedOn] = React.useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = React.useCallback(
    (next: boolean) => setOpenedOn(next ? pathname : null),
    [pathname],
  );
  const toggleRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const panelRef = React.useRef<HTMLDivElement>(null);

  /**
   * Solange das Menü offen ist, bleibt der Seiteninhalt dahinter stehen — und
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
      // gleichzeitig sicht- und bedienbar — siehe #mobile-cta in globals.css.
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
  // stehen zu lassen — Escape bringt ihn anschließend wieder zurück.
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
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-white/10 bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <Container className="flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
        <Link
          href="/"
          aria-label={`${site.name} — Startseite`}
          className="text-paper"
        >
          <Logo />
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-sm px-3.5 py-2 text-[0.9375rem] transition-colors duration-200",
                      active
                        ? "text-paper"
                        : "text-paper/65 hover:text-paper",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-flame transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
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
            className="hidden items-center gap-2.5 rounded-sm border border-white/20 px-4 py-2.5 font-display text-sm font-semibold whitespace-nowrap text-paper transition-colors duration-200 hover:border-flame hover:text-flame lg:inline-flex"
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
            className="inline-flex size-11 items-center justify-center rounded-sm border border-white/20 text-paper xl:hidden"
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
        className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-white/10 bg-ink xl:hidden"
      >
        <Container className="py-6">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li key={item.href} className="border-b border-white/8">
                <Link
                  href={item.href}
                  // Deckt auch den Fall ab, dass die Zielroute die aktuelle ist —
                  // dann ändert sich `pathname` nicht und das Menü bliebe offen.
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-4 font-display text-2xl font-bold tracking-tight text-paper"
                >
                  <span className="tabular font-sans text-xs font-medium text-flame">
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
              className="inline-flex h-[3.25rem] w-full items-center justify-center gap-2.5 rounded-sm border border-white/25 font-display font-semibold text-paper"
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
