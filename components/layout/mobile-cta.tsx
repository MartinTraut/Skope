"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  MapPin,
  MessageSquareText,
  Phone,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  deviceAction,
  type Availability,
  type CommerceMode,
} from "@/lib/commerce";
import { site } from "@/lib/site";
import { useQueryParam } from "@/lib/url-state";
import { cn } from "@/lib/utils";

/**
 * Die eine Aktion, die auf dieser Seite als Nächstes dran ist.
 *
 * Bis hierher trug die Leiste auf jeder Route dieselben zwei Knöpfe: „Anrufen"
 * und „Anfrage". Das ist auf der Startseite dieselbe Aussage wie auf
 * /recycling, obwohl beide Seiten etwas völlig anderes von ihrem Leser wollen –
 * die eine, dass er sich Geräte ansieht, die andere, dass er ein Altgerät
 * anmeldet. Eine Leiste, die überall dasselbe sagt, wird überall gleich
 * überlesen.
 *
 * `href` ohne führenden Schrägstrich bleibt auf der Seite; der Sprung selbst
 * läuft über den Zuhörer im `ScrollManager`, der das Ziel unter die Kopfzeile
 * setzt.
 */
type BarAction = { label: string; href: string; icon: LucideIcon };

const ACTIONS: Record<string, BarAction> = {
  "/": {
    label: "Bestand ansehen",
    href: "/e-scooter#bestand",
    icon: ArrowRight,
  },
  /* Kein „Filter": Die Bestandsseite hat keine Filterung, und ein Knopf, der
     eine Bedienung verspricht, die es nicht gibt, ist teurer als gar keiner.
     Der Suchauftrag ist das, was man dort tun kann, wenn nichts passt. */
  "/e-scooter": {
    label: "Suchauftrag stellen",
    href: "#suchauftrag",
    icon: Search,
  },
  "/reparatur": {
    label: "Reparatur anfragen",
    href: "#anfrage",
    icon: MessageSquareText,
  },
  /* Nicht „gewählten Tarif anfragen": Die Tarifkarten sind keine Auswahl,
     sondern zwei Darstellungen. Es gibt keinen Zustand, den die Leiste lesen
     könnte, und einen zu erfinden hieße, dem Nutzer eine Entscheidung
     zuzuschreiben, die er nicht getroffen hat. */
  "/wartungsvertrag": {
    label: "Vertrag anfragen",
    href: "#anfrage",
    icon: MessageSquareText,
  },
  "/finanzierung": {
    label: "Finanzierung anfragen",
    href: "#anfrage",
    icon: MessageSquareText,
  },
  "/versicherung": {
    label: "Kennzeichen anfragen",
    href: "#anfrage",
    icon: MessageSquareText,
  },
  "/recycling": {
    label: "Altgerät anmelden",
    href: "#anfrage",
    icon: MessageSquareText,
  },
  /* Die drei übrigen Fahrzeugarten. Ohne eigene Einträge fielen sie auf
     `FALLBACK` und führten am Telefon nach `/kontakt#anfrage` – also **weg**
     von dem Formular, das auf der Seite selbst steht und dort das Anliegen
     schon vorausgewählt hat. Auf Seiten, deren Zweck genau dieses Formular
     ist, ist das die teuerste Fehlleitung der ganzen Leiste. */
  "/e-chopper": {
    label: "E-Chopper anfragen",
    href: "#anfrage",
    icon: MessageSquareText,
  },
  "/e-roller": {
    label: "Suchauftrag stellen",
    href: "#anfrage",
    icon: Search,
  },
  "/e-trike": {
    label: "E-Dreirad anfragen",
    href: "#anfrage",
    icon: MessageSquareText,
  },
};

const FALLBACK: BarAction = {
  label: "Anfrage senden",
  href: "/kontakt#anfrage",
  icon: MessageSquareText,
};

/**
 * Aktionsleiste am unteren Rand, nur unter `lg`.
 *
 * Auf dem Telefon bleibt beim Scrollen sonst nur ein Telefon-Icon im Header
 * sichtbar; der schriftliche Weg liegt hinter dem Burger-Menü. Auf den langen
 * Leistungsseiten liegen damit mehrere Bildschirmhöhen zwischen zwei
 * Handlungsmöglichkeiten.
 *
 * Erscheint erst nach etwa einer halben Bildschirmhöhe. Der Grund stand hier
 * bis zum 13.09.2026 falsch („im Hero stehen dieselben beiden Aktionen bereits
 * groß") – die beiden Hero-Knöpfe sind seit dem 02.09. weg. Der Grund ist
 * jetzt ein anderer und gemessen: Der Kopfbereich der Startseite ist am
 * Telefon genau ein Bildschirm hoch und endet mit dem Kennzahlenband an der
 * Gehäusekante (390 × 844: Band von 644 bis 844 px). Eine Leiste bei
 * Scrollposition 0 läge mit ihren rund 90 px über den Beschriftungen dieses
 * Bands – sie verdeckt dort also die Angaben, wegen derer der Kopfbereich so
 * gebaut ist.
 *
 * `devices` kommt als Zuordnung Kennung → Modell und Preis aus dem Layout und
 * nicht aus einem Import von `lib/inventory`: Das Modul trägt Bilder,
 * Datenblätter und Beschreibungstexte aller dreizehn Geräte, und alles davon
 * läge sonst im Browserbündel, damit die Leiste zwei Zeichenketten anzeigen
 * kann.
 */
export function MobileCta({
  devices,
  plans,
  financing,
  mode,
}: {
  devices: Record<
    string,
    { model: string; price: string; availability: Availability }
  >;
  /** Aus dem Layout, nicht selbst gelesen: `commerceMode()` liest die
      Umgebung, und die steht im Browser nicht. */
  mode: CommerceMode;
  /** Name und Beitrag je Wartungsvertrag – zwei Zeichenketten, nicht das
      Datenmodul: dieselbe Regel wie bei den Geräten. */
  plans: Record<string, { name: string; price: string }>;
  /** Kurzname je Finanzierungsmodell. Nur der Name, kein Betrag: Auf
      /finanzierung steht bewusst keine Rate, siehe `lib/data/financing.ts`. */
  financing: Record<string, string>;
}) {
  const pathname = usePathname();
  const [shown, setShown] = React.useState(false);

  /* Die Tarifwahl steht in der Adresse und wird hier gelesen, nicht geraten.
     Ohne Wahl bleibt die Leiste neutral („Vertrag anfragen") – der frühere
     Einwand, es gebe keinen Zustand, war richtig, solange die Karten keiner
     waren. Jetzt sind sie einer, und die Leiste zeigt denselben Vertrag und
     denselben Beitrag wie Karte und Formular. */
  const topicSlug = useQueryParam("anliegen");
  const plan =
    pathname === "/wartungsvertrag" && topicSlug?.startsWith("wartungsvertrag-")
      ? plans[topicSlug.slice("wartungsvertrag-".length)]
      : undefined;

  /* Dieselbe Mechanik auf /finanzierung, aber ohne die linke Zelle: Es gibt
     dort keinen Betrag, den sie zeigen könnte. Die Wahl steht deshalb in der
     Beschriftung des Knopfes. */
  const model =
    pathname === "/finanzierung" && topicSlug?.startsWith("finanzierung-")
      ? financing[topicSlug.slice("finanzierung-".length)]
      : undefined;

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

  /* Während getippt wird, ist die Leiste weg.

     Auf dem Telefon schiebt die Bildschirmtastatur den sichtbaren Bereich
     auf rund die halbe Höhe; die Leiste steht dabei in iOS Safari weiter am
     unteren Rand des Layout-Fensters und liegt damit über dem Feld oder dem
     Absendeknopf, an dem gerade gearbeitet wird. Ein Knopf „Anfrage senden",
     der den echten Absendeknopf verdeckt, ist schlimmer als keiner.

     Ausgelöst wird das an der Tastatur, nicht an der Maus: `focusin` in
     einem `<form>` heißt, dass jemand schreibt. Die tatsächliche Tastatur
     lässt sich im Prüfbrowser nicht öffnen – die Regel greift deshalb schon
     am Fokus und damit auch dann, wenn ein Gerät ohne Bildschirmtastatur
     im Spiel ist. */
  const [typing, setTyping] = React.useState(false);
  React.useEffect(() => {
    const inForm = (node: EventTarget | null) =>
      node instanceof Element &&
      !!node.closest("form") &&
      !!node.closest("input, textarea, select");
    const onIn = (event: FocusEvent) => {
      if (inForm(event.target)) setTyping(true);
    };
    const onOut = (event: FocusEvent) => {
      if (inForm(event.target) && !inForm(event.relatedTarget))
        setTyping(false);
    };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  /* Die Geräteseite trägt links den Preis statt des Telefonknopfs. Er ist die
     Angabe, wegen der man auf dieser Seite zurückscrollt, und die Nummer steht
     unter `lg` ohnehin dauerhaft als Symbolknopf in der Kopfzeile. Das Anliegen
     und das Modell reisen wie im Kopfbereich der Seite in der Adresse mit,
     damit im Formular nicht steht „Anfrage zu einem Gerät". */
  /* Die Adresse kann seit dem 20.09.2026 unter jeder der vier Fahrzeugarten
     liegen (`/e-chopper/…`, `/e-trike/…`). Deshalb der letzte Pfadabschnitt
     statt eines festen Präfixes – und nachgeschlagen wird in `devices`, das
     nur echte Geräte enthält: Die Kategorieseite `/e-chopper` selbst hat
     keinen zweiten Abschnitt und fällt damit von allein heraus. */
  const device = devices[pathname.split("/").filter(Boolean)[1] ?? ""];

  /* Beschriftung und Ziel kommen aus `deviceAction()` – derselben Funktion,
     die auch der Kopf der Geräteseite liest. Zwei Stellen mit demselben Knopf
     und getrennter Beschriftung laufen beim ersten Eingriff auseinander, und
     bei einem verkauften Gerät wäre die eine „Verkauft" und die andere
     „Gerät anfragen". */
  const deviceCta = device
    ? deviceAction(mode, device.availability, device.model)
    : null;

  const action: BarAction | null = deviceCta
    ? deviceCta.href
      ? {
          label: deviceCta.label,
          href: deviceCta.href,
          icon: MessageSquareText,
        }
      : null
    : plan
      ? {
          /* Nur „Anfragen": Der Vertragsname steht links über dem Beitrag,
             und zweimal „Basis" in einer 296 px breiten Leiste heißt, dass
             die Beschriftung des Knopfes bei 320 px abschneidet – gemessen
             „Basis anfrag…" in 134 px. */
          label: "Anfragen",
          href: "#anfrage",
          icon: MessageSquareText,
        }
      : model
        ? {
            /* Die Kurzform, nicht „Anfragen": Anders als beim
               Wartungsvertrag steht links neben dem Knopf kein gewählter
               Name, weil es dort keinen Betrag gibt, über dem er stehen
               könnte. Die Wahl muss also im Knopf selbst sichtbar sein. */
            label: `${model} anfragen`,
            href: "#anfrage",
            icon: MessageSquareText,
          }
        : (ACTIONS[pathname] ?? FALLBACK);
  const Icon = action?.icon;

  const solid =
    "press flex h-12 items-center justify-center gap-2.5 rounded-full bg-accent font-display font-semibold tracking-tight text-ink";
  const outline =
    "press flex h-12 items-center justify-center gap-2.5 rounded-full border border-current/30 font-display font-semibold tracking-tight text-silver";

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
          /* `visibility` statt `pointer-events-none`, und deshalb in der
             Übergangsliste: Die ausgefahrene Leiste war mit `opacity-0` zwar
             unsichtbar und nicht antippbar, aber weiter in der
             Tabreihenfolge – gemessen mit `focus()` auf dem ersten Knopf, er
             nahm den Fokus an. Wer oben auf einer Seite mit der Tastatur
             tabbt, landet also auf zwei Schaltflächen, die niemand sieht.
             `visibility: hidden` nimmt sie aus Tabreihenfolge und
             Trefferprüfung und schaltet trotzdem weich, weil der Wechsel am
             Ende des Übergangs stattfindet – dieselbe Lösung wie am
             Menü im Seitenkopf. */
          "transition-[opacity,transform,visibility] duration-300 ease-out-quart",
          shown && !typing
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-[calc(100%+1.5rem)] opacity-0",
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
          {pathname === "/kontakt" ? (
            /* Auf /kontakt sind beide Wege die Hauptsache, und keiner davon
               ist eine Anfrage: Das Formular steht auf derselben Seite. Der
               Anruf trägt deshalb hier den Vollton, die Route den Umriss. */
            <>
              <a
                href={site.phone.href}
                className={cn(solid, "flex-1")}
                aria-label={`Anrufen: ${site.phone.display}`}
              >
                <Phone className="size-4" aria-hidden="true" />
                Anrufen
              </a>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(outline, "flex-1")}
              >
                <MapPin className="size-4" aria-hidden="true" />
                Route
              </a>
            </>
          ) : (
            <>
              {device || plan ? (
                <p className="flex h-12 min-w-0 shrink flex-col justify-center pr-1 pl-2 leading-none">
                  <span className="font-display text-[0.6875rem] font-semibold tracking-[0.14em] text-current/60 uppercase">
                    {device ? "Preis" : plan?.name}
                  </span>
                  <span className="tabular mt-1 truncate font-display text-lg font-bold tracking-tight text-accent">
                    {device ? device.price : plan?.price}
                  </span>
                </p>
              ) : (
                <a
                  href={site.phone.href}
                  aria-label={`Anrufen: ${site.phone.display}`}
                  className={cn(outline, "size-12 shrink-0")}
                >
                  <Phone className="size-5" aria-hidden="true" />
                </a>
              )}
              {/* Ein verkauftes oder reserviertes Gerät hat keine Aktion.
                  Die Leiste zeigt dann den Zustand statt eines Knopfs, der
                  ins Leere führt – der Preis links bleibt stehen, weil er die
                  Angabe ist, wegen der man hier zurückscrollt. */}
              {action && Icon ? (
                <Link
                  href={action.href}
                  className={cn(solid, "min-w-0 flex-1")}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{action.label}</span>
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className={cn(outline, "min-w-0 flex-1 opacity-60")}
                >
                  <span className="truncate">{deviceCta?.label}</span>
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
