"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, Star, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { PhoneButton } from "@/components/ui/phone-button";
import { Container } from "@/components/ui/section";
import type { GoogleRating } from "@/lib/google-rating";
import { nav, site, vehicleNav } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
 * Die Bewertung kommt als Eigenschaft herein, nicht aus einem Import.
 *
 * Die Leiste ist ein Client-Bauteil (Scrollzustand, Menü, aktive Route), und
 * `getGoogleRating()` liest einen Schlüssel aus der Umgebung – der gehört in
 * kein Browser-Bündel. Das Wurzel-Layout holt den Wert einmal auf dem Server
 * und reicht ihn durch; über `cache()` ist es derselbe Abruf, den auch
 * Kopfbereich und Kundenstimmen benutzen.
 */
/**
 * Die Fahrzeuggruppe in der Navigation am Schreibtisch.
 *
 * Ein Knopf mit `aria-expanded` und eine Liste darunter – kein reines
 * CSS-Hover-Menü: Das wäre mit der Tastatur nicht erreichbar und auf einem
 * Tablet, das `hover` meldet, nach dem ersten Tipp offen stehengeblieben.
 * Geöffnet wird mit Zeiger *und* Klick, geschlossen mit Escape, einem Klick
 * außerhalb, dem Verlassen des Bereichs und jedem Routenwechsel.
 *
 * Die Gruppe trägt selbst kein Ziel. „Fahrzeuge" ist keine Seite, sondern
 * drei Seiten; ein Verweis darauf müsste eine vierte erfinden.
 */
function VehicleMenu({
  active,
  pathname,
}: {
  active: boolean;
  pathname: string;
}) {
  /* Dieselbe Mechanik wie beim Telefonmenü weiter unten: Die Tafel merkt
     sich, auf welcher Route sie geöffnet wurde, statt einen Effekt beim
     Routenwechsel zu schließen. Ein `setState` im Effekt löst eine zweite
     Renderrunde aus – und die Lint-Regel `react-hooks/set-state-in-effect`
     verbietet es zu Recht. */
  const [openedOn, setOpenedOn] = React.useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = React.useCallback(
    (value: boolean) => setOpenedOn(value ? pathname : null),
    [pathname],
  );
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, setOpen]);

  return (
    <div
      ref={ref}
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setOpen(false);
      }}
      /* Tastatur: Verlässt der Fokus die Gruppe, geht sie zu. `focusout`
         blubbert, `blur` nicht – deshalb React's `onBlur` mit Prüfung auf
         das neue Ziel. */
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
        className={cn(
          "press relative inline-flex min-h-11 items-center gap-1 rounded-md px-2.5 text-[0.9375rem] font-medium whitespace-nowrap transition-[color,transform] duration-200",
          active || open
            ? "text-current"
            : "text-current/[0.88] hover:text-current",
        )}
      >
        Fahrzeuge
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3.5 transition-transform duration-200 ease-out-quart",
            open && "rotate-180",
          )}
        />
        <span
          className={cn(
            "absolute inset-x-2.5 bottom-1.5 h-px origin-left bg-accent transition-transform duration-300 ease-out-quart",
            active ? "scale-x-100" : "scale-x-0",
          )}
        />
      </button>

      {/* `visibility` statt `pointer-events-none`: Eine nur durchsichtige
          Tafel stünde weiter in der Tabreihenfolge – derselbe Befund wie an
          der unteren Aktionsleiste. `visibility` muss dafür in der
          Übergangsliste stehen, sonst springt die Tafel. */}
      <div
        className={cn(
          "absolute top-full left-0 w-60 pt-2 transition-[opacity,transform,visibility] duration-200 ease-out-quart",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0",
        )}
      >
        {/* Nur die vier Namen. Vorher stand unter jedem eine Zeile
            Erklärung ("Der Stehroller für den täglichen Weg …"): vier
            Überschriften mit zwölf Zeilen Fließtext in einer 256 px breiten
            Tafel, die man im Vorbeigehen öffnet. Ein Menü ist eine Liste von
            Wegen, kein Text – wer wissen will, was ein E-Chopper ist, findet
            es auf der Seite, auf die der Weg führt.

            Der Grad ist der Untertitelgrad der Seite (1,25 rem), nicht der
            Grundschriftgrad: Die vier Namen sind der ganze Inhalt der Tafel,
            und ein Menüpunkt, der so groß ist wie der Fließtext einer Seite,
            liest sich als Fußnote. Fest und nicht fluid – die Tafel hängt an
            der Kopfzeile und nicht am Satzspiegel, ihre Breite ändert sich
            über den ganzen Bereich nicht, in dem sie überhaupt sichtbar ist
            (ab `lg`). Zeilen 48 statt 44 px hoch, mit 2 px Abstand
            dazwischen: Vier gleich große Flächen ohne Fuge lesen sich als
            eine Fläche mit Strichen. */}
        <ul className="space-y-0.5 overflow-hidden rounded-lg border border-current/12 bg-ink-800 p-2 shadow-[0_24px_60px_-24px_rgb(8_9_11/0.75)]">
          {vehicleNav.map((sub) => (
            <li key={sub.href}>
              <Link
                href={sub.href}
                tabIndex={open ? undefined : -1}
                aria-current={pathname === sub.href ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-12 items-center rounded-md px-3.5 font-display text-[1.25rem] font-semibold tracking-tight transition-colors duration-200",
                  pathname === sub.href
                    ? "bg-current/8 text-accent"
                    : "text-silver/85 hover:bg-current/8 hover:text-silver",
                )}
              >
                {sub.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Header({ rating }: { rating: GoogleRating }) {
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
   *
   * Der Halt selbst läuft über `position: fixed` am <body> und nicht über
   * `overflow: hidden`. Auf dem iPhone hält `overflow: hidden` den Körper nicht
   * an, sobald schon Schwung im Fluss ist: Das Menü steht, die Seite darunter
   * läuft weiter, und wenn das Menü zugeht, ist man an einer anderen Stelle als
   * vorher. Der Körper wird deshalb an seiner Stelle festgenagelt – die
   * Scrollhöhe wandert in `top`, damit dabei nichts nach oben springt – und
   * beim Schließen wieder freigegeben.
   *
   * `behavior: "instant"` beim Zurücksetzen ist Pflicht: `scroll-behavior:
   * smooth` steht global am <html>, und ohne die Angabe scrollt die Seite nach
   * dem Schließen des Menüs sichtbar an ihre alte Stelle zurück.
   */
  React.useEffect(() => {
    const outside = [
      document.getElementById("inhalt"),
      document.querySelector("footer"),
      // Die Aktionsleiste liegt unter dem geöffneten Menü und wäre sonst
      // gleichzeitig sicht- und bedienbar – siehe #mobile-cta in globals.css.
      document.getElementById("mobile-cta"),
    ];
    for (const el of outside) el?.toggleAttribute("inert", open);

    if (!open) {
      return () => {
        for (const el of outside) el?.removeAttribute("inert");
      };
    }

    const body = document.body;
    const y = window.scrollY;
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.insetInline = "0";
    body.style.width = "100%";

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.insetInline = "";
      body.style.width = "";
      window.scrollTo({ top: y, behavior: "instant" });
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

  /* Auf der Startseite führt die Wortmarke nach oben, nicht ins Leere.
     Gemessen: Wer auf `/` 4000 px tief steht und auf das Logo tippt, blieb
     bei 4000 px stehen – der Verweis zeigt auf die Adresse, auf der man schon
     ist, und der Router hat dafür nichts zu tun. Auf jeder anderen Seite
     bleibt es der gewöhnliche Seitenwechsel; Klicks mit Zusatztaste oder
     mittlerer Maustaste gehören dem Browser.

     Der Sprung wartet, bis die Scrollsperre des Telefonmenüs gelöst ist:
     Sie hängt als `position: fixed` am `<body>` und setzt beim Schließen die
     gemerkte Position zurück – wer währenddessen springt, wird eine
     Lidschlagbreite später wieder eingesammelt. Dieselbe Regel wie bei den
     Raute-Verweisen im `ScrollManager`. */
  const toStart = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    setOpen(false);
    const instant = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frames = 0;
    const go = () => {
      if (document.body.style.position === "fixed" && frames++ < 20) {
        requestAnimationFrame(go);
        return;
      }
      window.scrollTo({ top: 0, behavior: instant ? "instant" : "smooth" });
    };
    requestAnimationFrame(go);
  };

  return (
    <header
      data-scrolled={scrolled || open ? "true" : "false"}
      /* Der obere Sicherheitsabstand ist im Browser null – dort beginnt die
         Seite unter der Adressleiste. Er greift, wenn die Seite vom Startbild-
         schirm aus als eigenes Fenster läuft: Dann liegt die Statusleiste des
         Geräts über dem Seitenkopf, und ohne den Abstand steht die Wortmarke
         in der Uhrzeit. */
      className="fixed inset-x-0 top-0 z-50 pt-[var(--safe-top)]"
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

      <Container className="flex h-[var(--header-h)] items-center justify-between gap-4">
        {/* Ohne Unterzeile: Gestapelt war der Logoblock 56 px hoch, der
            Schriftzug selbst saß dadurch bei 34 px Mitte, während Navigation,
            Telefonpille und CTA alle bei 40 px liegen. Sechs Pixel daneben –
            genug, dass die Kopfzeile nicht auf einer Linie liest. Die Zeile
            „Gebrauchtwarenhandel" steht weiterhin im Footer, wo Platz dafür
            ist. */}
        {/* `flex items-center` am Link selbst: Sonst sitzt die Wortmarke als
            inline-Element auf der Grundlinie und schleppt den Unterlängen-
            Durchschuss mit – gemessen weitere 4 px Versatz nach oben. */}
        {/* Nur die Marke. Die Bewertung stand hier eine Runde lang als Zeile
            darunter – sie machte aus dem Logo einen zweizeiligen Block und
            drückte die Marke aus der Mittelachse der Leiste. Die Rezensionen
            stehen im Kopfbereich der Startseite und in der eigenen Sektion. */}
        <Link
          href="/"
          aria-label={`${site.name}, Startseite`}
          onClick={toStart}
          className="press flex min-h-11 items-center"
        >
          <Logo showSub={false} />
        </Link>

        {/* Die Reihe klappt bei 1366 px auf, nicht mehr bei 1280 (`xl`).

            Mit dem achten Punkt „Einlagerung" misst sie 883 px statt 805
            (gemessen bei 1280 px: Fahrzeuge 114, Reparatur 90,
            Wartungsvertrag 141, Einlagerung 105, Finanzierung 113,
            Versicherung 116, Recycling 90, Über uns 85, dazu sieben Fugen).
            Die Aktionsgruppe braucht in ihrer kleinsten Fassung – Symbolknopf
            plus Anfrage – 206 px und stand damit bei 1280 px **66 px
            außerhalb** des Satzspiegels. Der Seitenkopf liegt `fixed`, also
            meldet die Seite dafür keinen waagerechten Überlauf; man sieht es
            nur im Bild oder in der Messung (`grp.right` gegen `inner.right`),
            und genau davor warnt der Eintrag zur siebten Navigationszeile in
            CLAUDE.md.

            1366 ist keine runde Zahl, sondern die gemessene Grenze: Dort
            endet die Gruppe bei 1346 px und hat 20 px Luft. Zwischen 1280 und
            1365 px trägt das Menü hinter dem Symbolknopf dieselben acht
            Punkte – vollständig und mit derselben Reihenfolge, nur
            eingeklappt. Wer hier einen neunten Punkt ergänzt, misst das
            nach. */}
        <nav
          aria-label="Hauptnavigation"
          className="hidden shrink-0 min-[1366px]:block"
        >
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active =
                "group" in item
                  ? vehicleNav.some((v) => pathname.startsWith(v.href))
                  : pathname === item.href;
              if ("group" in item) {
                return (
                  <li key={item.href}>
                    <VehicleMenu active={active} pathname={pathname} />
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "press relative inline-flex min-h-11 items-center rounded-md px-2.5 text-[0.9375rem] font-medium whitespace-nowrap transition-[color,transform] duration-200",
                      // 88 % und Halbfett statt 70 % und Buchschnitt.
                      //
                      // Gemessen war die Navigation 15 px in Regular mit 70 %
                      // Deckkraft – rechnerisch über AA, auf dem Schirm aber
                      // dünn: Der Weichzeichner der Scheibe arbeitet gegen die
                      // Haarlinien der Buchstaben, und 30 % fehlende Deckkraft
                      // nehmen dem Schnitt genau die Kanten, an denen man
                      // Wörter beim Überfliegen erkennt.
                      //
                      // Halbfett bringt Strichstärke zurück, ohne die Zeile
                      // breiter zu machen; 88 % hält den Abstand zur aktiven
                      // Seite sichtbar. Ungünstigster Grund ist weiterhin die
                      // Scheibe über einer Silbersektion, gemessen rgb(63).
                      active
                        ? "text-current"
                        : "text-current/[0.88] hover:text-current",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-2.5 bottom-1.5 h-px origin-left bg-accent transition-transform duration-300 ease-out-quart",
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
          {/* Die Bewertung als Verweis, nicht als Block. Sie stand eine Runde
              lang unter der Wortmarke und machte aus dem Logo einen
              zweizeiligen Klotz; hier steht sie in der Aktionsgruppe, wo
              ohnehin die Gründe stehen, weiterzuklicken.

              Ein Stern statt fünf: Die volle Reihe mit Note maß gemessen
              123 px und drückte den Anfrage-Knopf bei 1280 und 1400 px aus
              der Leiste. Ein Stern mit der Zahl ist dieselbe Aussage in
              55 px – es ist die Schreibweise, die auch Google Maps
              benutzt. Der vollständige Satz steht im `aria-label`. */}
          <Link
            href="/#kundenstimmen"
            aria-label={`${rating.value} von 5 Sternen bei Google, ${rating.count} Rezensionen lesen`}
            /* Dieselbe Bandregel wie bei der Telefonnummer darunter, aus
               demselben Grund: Seit die Navigation sieben Punkte trägt, ist
               sie bei 1280 px 805 px breit (vorher 687), und die
               Aktionsgruppe stand gemessen 53 px über dem Satzspiegel – der
               Anfrage-Knopf war angeschnitten. Da der Seitenkopf `fixed`
               liegt, meldet die Seite dafür keinen waagerechten Überlauf;
               man sieht es nur im Bild oder in der Messung.

               Zwischen 1366 und 1439 px fällt deshalb die Bewertung weg.
               Sie ist von den drei Elementen der Gruppe das einzige, das
               weder Aktion noch Erreichbarkeit ist, und sie steht
               vollständig in den Kundenstimmen, auf die sie verweist. Unter
               1366 px ist die Navigation eingeklappt, dort ist der Platz da.

               **Die Grenzen sind am 25.09.2026 um eine Stufe gewandert**
               (1280 → 1366 und 1400 → 1440), weil die Reihe mit
               „Einlagerung" 78 px breiter ist. Gemessen bei 1400 px mit
               Bewertung: Gruppe bis 1411 px, also 11 px außerhalb. */
            className="press hidden min-h-11 items-center gap-1.5 rounded-md px-2 whitespace-nowrap transition-[color,background-color,transform] duration-200 hover:bg-current/8 min-[1024px]:inline-flex min-[1366px]:hidden min-[1440px]:inline-flex"
          >
            <Star
              aria-hidden="true"
              className="size-3.5 fill-[#fbbc04] text-[#fbbc04]"
              strokeWidth={1.5}
            />
            <span className="tabular font-display text-sm font-bold tracking-tight">
              {rating.value}
            </span>
          </Link>

          <a
            href={site.phone.href}
            /* Zwischen 1366 und 1600 px ist die Leiste voll: Ab 1366 klappt
               die Navigation auf (883 px gemessen), zusammen mit Marke,
               Telefon und Anfrage ist das mehr, als die Seite hergibt – der
               Anfrage-Knopf stand außerhalb. In diesem Band trägt die Nummer
               der Symbolknopf darunter. Unter 1366 px steht sie wieder
               ausgeschrieben, weil die Navigation dort eingeklappt ist. */
            className="press hidden items-center gap-2.5 rounded-md border border-current/20 px-4 py-2.5 font-display text-sm font-semibold whitespace-nowrap transition-[color,border-color,transform] duration-200 hover:border-current/50 min-[1024px]:inline-flex min-[1366px]:hidden min-[1600px]:inline-flex"
          >
            <Phone className="size-4" aria-hidden="true" />
            <span className="tabular">{site.phone.display}</span>
          </a>
          <ButtonLink href="/kontakt#anfrage" className="hidden lg:inline-flex">
            Anfrage senden
          </ButtonLink>

          {/* Zwischen 1280 und 1439 px gab es gar keinen Telefonverweis mehr:
              Die Nummer oben ist dort ausgeblendet (kein Platz, Begründung
              darüber), `PhoneButton` war `lg:hidden` und die untere
              Aktionsleiste ebenfalls. Als Symbolknopf kostet die Nummer
              44 px statt der 150 px der vollen Schreibweise. Seit dem
              25.09.2026 liegt das Band bei 1366 bis 1599 px statt bei 1280
              bis 1599 – die Navigation klappt eine Stufe später auf, also
              beginnt auch die Platznot später. */}
          {/* Alle drei Zustände als arbiträre Abfragen, keine gemischt mit
              `lg:`. Gemessen war der Knopf bei 1280 px `display: none`,
              obwohl `min-[1280px]:inline-flex` hinter `lg:hidden` stand:
              Tailwind ordnet benannte und arbiträre Abfragen nicht in einer
              gemeinsamen Reihe, `lg:hidden` gewann also gegen die spätere
              Regel. In diesem Band gab es damit weiterhin keinen
              Telefonverweis – genau der Fehler, den dieser Knopf beheben
              sollte. */}
          <PhoneButton
            iconOnly
            className="hidden min-[1366px]:inline-flex min-[1600px]:hidden"
          />

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            className="press inline-flex size-11 items-center justify-center rounded-md border border-current/20 min-[1366px]:hidden"
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile / Tablet Navigation
       *
       * Das Menü lag vorher hinter `hidden` und war damit im selben Bild da,
       * in dem man den Schalter berührt hat – eine volle Bildschirmfläche, die
       * ohne Bewegung erscheint. Genau daran erkennt man eine Website: Auf dem
       * Telefon kommt jede Fläche irgendwo her, und der kurze Weg ist die
       * Auskunft darüber, woher.
       *
       * Statt `hidden` jetzt `inert` plus `visibility`. Beides ist nötig:
       *
       * `inert` nimmt das geschlossene Menü aus Tabreihenfolge und
       * Vorleseansicht – das, was `hidden` vorher geleistet hat und was ein
       * bloßes `opacity: 0` nicht leistet.
       *
       * `visibility: hidden` nimmt es aus der Trefferprüfung und lässt sich
       * trotzdem weich schalten (der Wechsel findet am Ende des Übergangs
       * statt). Ohne die Angabe fängt die unsichtbare Fläche jeden Tipp auf
       * die Seite darunter ab.
       *
       * `absolute top-full` statt im Fluss: Läge das Menü weiterhin im Kasten
       * des Seitenkopfs, wäre dieser dauerhaft bildschirmhoch – und der Kopf
       * ist `fixed`, also läge diese Höhe über der ganzen Seite.
       */}
      <div
        ref={panelRef}
        id="mobile-nav"
        inert={!open}
        /* `overscroll-contain`: Ohne das gibt Safari das Weiterziehen am Ende
           der Menüliste an die Seite darunter weiter. Man wischt im Menü und
           bewegt die Seite dahinter – sichtbar, sobald das Menü wieder zugeht. */
        className={cn(
          "absolute inset-x-0 top-full max-h-[calc(100svh-var(--header-block))] min-h-[calc(100svh-var(--header-block))] overflow-y-auto overscroll-contain border-t border-current/10 bg-ink-800 text-silver on-dark min-[1366px]:hidden",
          "transition-[opacity,transform,visibility] duration-300 ease-out-quart motion-reduce:transition-none",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-4 opacity-0",
        )}
      >
        {/* Der untere Abstand hält die beiden Knöpfe über der Streiflinie zum
            Wechseln der App. Ohne ihn liegt „Anrufen" auf dem Balken und der
            erste Wisch nach oben schließt die Seite statt zu wählen. */}
        <Container className="pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              /* Die Zeilen laufen nacheinander ein, 40 ms auseinander.
               *
               * Das ist kein Zierrat, sondern die Leserichtung: Sechs Zeilen,
               * die gleichzeitig erscheinen, sind eine Fläche, die man als
               * Ganzes sieht und dann von oben absucht. Nacheinander eingesetzt
               * führen sie das Auge dorthin, wo die Liste beginnt – und die
               * Verzögerung ist mit 40 ms so kurz, dass die letzte Zeile nach
               * 300 ms steht. Länger wäre Warten statt Führung.
               *
               * Beim Schließen keine Verzögerung: Die Fläche geht als Ganzes
               * weg, weil das Ziel dann nicht mehr die Liste ist.
               */
              <li
                key={item.href}
                style={{ transitionDelay: open ? `${90 + i * 40}ms` : "0ms" }}
                className={cn(
                  "border-b border-current/8 transition-[opacity,transform] duration-[450ms] ease-out-expo",
                  "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
                  open
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0",
                )}
              >
                {/* `aria-current` und die volle Deckkraft der Ziffer wie in
                    der Schreibtisch-Navigation. Sie fehlten hier beide: Auf
                    dem Telefon ist das Menü der einzige Orientierungspunkt,
                    und dort sahen alle sechs Zeilen gleich aus – gemessen kein
                    `aria-current` im Panel auf keiner der sechs Routen. */}
                {"group" in item ? (
                  /* Die Fahrzeuggruppe steht am Telefon **offen**, nicht als
                     zweite Klappe. Ein Menü, das man aufklappt, um darin
                     etwas aufzuklappen, kostet einen Tipp für nichts – und
                     die drei Zeilen sind der Grund, warum jemand das Menü
                     öffnet. Die Gruppenzeile ist deshalb kein Verweis,
                     sondern eine Überschrift; sie zeigt auf keine eigene
                     Seite, die es gäbe. */
                  <div className="py-4">
                    <p className="flex items-baseline gap-4 font-display text-2xl font-bold text-current/[0.88]">
                      <span className="tabular font-sans text-xs font-medium text-accent/45">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </p>
                    <ul className="mt-1 flex flex-col pl-9">
                      {vehicleNav.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            aria-current={
                              pathname === sub.href ? "page" : undefined
                            }
                            onClick={() => setOpen(false)}
                            className={cn(
                              "press flex min-h-11 items-center py-2 font-display text-lg font-semibold",
                              pathname === sub.href
                                ? "text-accent"
                                : "text-current/75",
                            )}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    // Deckt auch den Fall ab, dass die Zielroute die aktuelle ist –
                    // dann ändert sich `pathname` nicht und das Menü bliebe offen.
                    onClick={() => setOpen(false)}
                    className={cn(
                      "press flex items-baseline gap-4 py-4 font-display text-2xl font-bold",
                      pathname === item.href
                        ? "text-current"
                        : "text-current/[0.88]",
                    )}
                  >
                    <span
                      className={cn(
                        "tabular font-sans text-xs font-medium",
                        pathname === item.href
                          ? "text-accent"
                          : "text-accent/45",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          {/* Die beiden Aktionen kommen nach der letzten Zeile der Liste –
              90 + 6 × 40 = 330 ms. */}
          <div
            style={{ transitionDelay: open ? "330ms" : "0ms" }}
            className={cn(
              "mt-7 flex flex-col gap-3 transition-[opacity,transform] duration-[450ms] ease-out-expo",
              "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
              open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
          >
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
              className="press inline-flex h-[3.25rem] w-full items-center justify-center gap-2.5 rounded-full border border-current/25 font-display font-semibold"
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
