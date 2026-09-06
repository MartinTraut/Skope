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

  /* Regel 1 auch beim *ersten* Aufruf, nicht nur beim Routenwechsel.

     Der Effekt oben läuft zwar beim Einhängen mit, kommt aber zu früh: Der
     Browser stellt die gemerkte Position eines neu geladenen Dokuments erst
     um das `load`-Ereignis herum wieder her – auf dem Telefon der Regelfall,
     weil Safari eine Seite aus dem Speicher neu aufbaut, sobald der Tab
     zwischendurch weg war. Sichtbare Folge: Man tippt den Verweis an und
     landet mitten im Kopfbereich, mit der Auszeichnungszeile schon über der
     Fensterkante.

     Deshalb `scrollRestoration` für die Dauer des Ladens auf „manual" und
     die Position an drei Stellen gesetzt – beim Einhängen, einen Frame später
     und nach `load`. Danach zurück auf den vorherigen Wert: Vor und Zurück
     innerhalb des Dokuments soll weiter dort landen, wo man war.

     Der Anlauf nach `load` rechnet dieselbe Regel noch einmal, statt stumpf
     auf 0 zu springen – sonst risse eine Adresse mit Raute von ihrem Ziel weg.

     Ein Riegel gegen den eigenen Willen des Nutzers: Wer während des Ladens
     schon wischt, wird nicht mehr zurückgeholt. Ein Sprung nach oben unter
     dem laufenden Finger ist schlimmer als eine falsche Anfangsposition. */
  React.useLayoutEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));

    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";

    const settle = () => {
      if (hash && scrollToId(hash, "instant")) return;
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    settle();
    const frame = requestAnimationFrame(settle);

    let touched = false;
    const stop = () => {
      touched = true;
    };
    const moves: [string, AddEventListenerOptions][] = [
      ["wheel", { passive: true }],
      ["touchmove", { passive: true }],
      ["keydown", {}],
    ];
    for (const [type, opts] of moves)
      window.addEventListener(type, stop, opts);

    const done = () => {
      if (!touched) settle();
      history.scrollRestoration = previous;
      for (const [type, opts] of moves)
        window.removeEventListener(type, stop, opts);
    };
    if (document.readyState === "complete") {
      done();
    } else {
      window.addEventListener("load", done, { once: true });
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", done);
      for (const [type, opts] of moves)
        window.removeEventListener(type, stop, opts);
      history.scrollRestoration = previous;
    };
    /* Leere Abhängigkeiten mit Absicht: Der Routenwechsel läuft über den
       Effekt darüber, dieser hier gilt nur dem ersten Aufruf des Dokuments. */
  }, []);

  /* Regel 2 für Verweise auf derselben Seite.

     Der Zuhörer hängt in der **Einfangphase** am Dokument, und das ist kein
     Detail: `next/link` bricht seinen eigenen Klick ab, sobald
     `defaultPrevented` gesetzt ist – aber nur dann. React hängt seine
     Zuhörer beim Aufhängen der Anwendung ans Dokument, also *vor* diesem
     hier; in der Blasenphase liefe der Verweis damit zuerst durch `Link`,
     würde dort abgebrochen und an den Router weitergereicht. Für eine
     Adresse, die schon in der Zeile steht, tut der Router nichts.

     Gemessen auf `/kontakt` am Telefon: Der erste Druck auf „Anfrage" kam
     von der Startseite und lief über den Seitenwechsel – Formular bei
     289 px. Nach oben gewischt und noch einmal gedrückt passierte nichts,
     die Seite blieb bei 675 px stehen, das Formular lag 1427 px tiefer.
     Betroffen war jeder Verweis mit Raute, der als `Link` gebaut ist: die
     Aktionsleiste am Telefon, „Anfrage senden" im Kopf und im Abschlussband,
     „Kundenstimmen" im Menü.

     `stopPropagation` steht bewusst nicht dabei. Der Verweis soll weiter bei
     den Zuhörern ankommen, die an ihm selbst hängen – im Telefonmenü
     schließt einer davon die Tafel. */
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
      const go = () => scrollToId(id, reduced ? "instant" : "smooth");

      /* Steht der Verweis im offenen Telefonmenü, darf hier noch nicht
         gesprungen werden.

         Die Scrollsperre des Menüs hängt am `<body>` (`position: fixed`) und
         setzt die gemerkte Position beim Schließen zurück. Wer währenddessen
         springt, springt gegen eine festgestellte Seite und wird eine
         Lidschlagbreite später vom Rücksprung wieder eingesammelt. Gemessen
         auf `/kontakt`: Menü auf, „Anfrage senden" – Tafel zu, Position 0,
         das Formular 1885 px tiefer. Außerdem misst `getBoundingClientRect`
         an einer festgestellten Seite den Abstand zur *Fensterkante*, nicht
         zum Dokumentanfang; die Rechnung stimmte also ohnehin nicht.

         Deshalb warten, bis die Sperre gelöst ist, und erst im Bild danach
         springen. Der Riegel bei zwanzig Bildern ist für den Fall, dass die
         Sperre gar nicht von einem Menü kommt. */
      const locked = () => getComputedStyle(document.body).position === "fixed";
      if (locked()) {
        let frames = 0;
        const wait = () => {
          if (!locked() || ++frames > 20) {
            requestAnimationFrame(go);
            return;
          }
          requestAnimationFrame(wait);
        };
        requestAnimationFrame(wait);
      } else {
        go();
      }
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
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
