"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * Filter und Sortierung über dem Bestand.
 *
 * Die Karten kommen als `children` fertig gerendert vom Server und bleiben
 * dort: Das Modul `lib/inventory` trägt Bilder, Datenblätter und alle
 * Beschreibungstexte, und nichts davon gehört ins Browserbündel, damit eine
 * Liste sich sortieren lässt. Gefiltert wird deshalb nicht über einen
 * Datenbestand im Client, sondern über die Angaben, die an jedem Listeneintrag
 * als `data-*` stehen. Ohne JavaScript steht die vollständige Liste – die
 * Bedienelemente erscheinen erst, wenn sie auch etwas tun können.
 *
 * Es gibt nur Filter, deren Feld es wirklich gibt:
 * - „Mit ABE" liegt als `streetLegal` vor.
 * - „Bis 250 €" kommt aus `priceValue`.
 * - „Ab 30 km" liest `rangeKm()`; wo keine Reichweite in den Daten steht,
 *   fällt das Gerät aus diesem Filter heraus statt mit einer Schätzung darin
 *   zu stehen.
 *
 * Nicht gebaut, weil das Datenmodell es nicht hergibt: „Neu / Gebraucht
 * geprüft" (es gibt kein Zustandsfeld, nur einen Satz je Gerät) und die
 * Zustände „reserviert" und „verkauft" (verkaufte Geräte werden aus der Liste
 * genommen, einen Status gibt es nicht). Ein Filter, der immer alles zeigt,
 * ist ein Versprechen ohne Deckung.
 */
type Filter = "alle" | "neu" | "gebraucht" | "abe" | "bis250" | "ab30km";
type Sort = "" | "preis-auf" | "preis-ab" | "reichweite";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "alle", label: "Alle" },
  /* Zustand: Seit der Auskunft vom 20.09.2026 verkauft der Betrieb neue
     *und* generalüberholte Geräte. Die beiden Kapseln erscheinen nur, wenn
     in der gezeigten Liste tatsächlich beides steht – ein Filter, der immer
     alles oder immer nichts zeigt, ist ein Versprechen ohne Deckung. */
  { id: "neu", label: "Neu" },
  { id: "gebraucht", label: "Generalüberholt" },
  { id: "abe", label: "Mit ABE" },
  { id: "bis250", label: "Bis 250 €" },
  { id: "ab30km", label: "Ab 30 km" },
];

const SORTS: { id: Sort; label: string }[] = [
  { id: "", label: "Preis: günstigste zuerst" },
  { id: "preis-ab", label: "Preis: teuerste zuerst" },
  { id: "reichweite", label: "Reichweite: größte zuerst" },
];

function match(item: BrowserItem, filter: Filter) {
  if (filter === "neu") return item.isNew;
  if (filter === "gebraucht") return !item.isNew;
  if (filter === "abe") return item.abe;
  if (filter === "bis250") return item.price <= 250;
  if (filter === "ab30km") return item.range !== null && item.range >= 30;
  return true;
}

export type BrowserItem = {
  id: string;
  /** Bruttopreis als Zahl – `priceValue` aus dem Bestand. */
  price: number;
  /** Reichweite in km, `null` wenn sie nicht in den Daten steht. */
  range: number | null;
  abe: boolean;
  /** Neugerät. Steuert die beiden Zustandskapseln und die Plakette. */
  isNew: boolean;
};

/**
 * `useSearchParams` zwingt alles darüber in eine Suspense-Grenze, sonst lässt
 * sich die Seite nicht statisch vorbauen. Der Rückfall ist dieselbe Liste
 * ohne Bedienelemente – also genau das, was auch ohne JavaScript steht.
 */
export function InventoryBrowser(props: {
  items: BrowserItem[];
  children: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={<PlainList>{props.children}</PlainList>}>
      <Browser {...props} />
    </React.Suspense>
  );
}

/* `auto-rows-fr` **erst ab `sm`**, also erst ab zwei Spalten.
 *
 * Wozu es da ist: Ohne das bekommt jede Rasterreihe ihre eigene Höhe – die
 * Reihe mit den Geräten ohne ABE trägt die ausgeschriebene Warnung und war
 * bei 1512 px 662 px hoch, die Reihe darüber 614. Gleich große Karten
 * nebeneinander und verschieden große untereinander liest sich als Zufall.
 *
 * Warum es am Telefon weg muss: Dort steht **eine** Spalte, es gibt also
 * keinen Nachbarn, an dem sich etwas ausrichten könnte – `fr` gibt jeder
 * Karte trotzdem die Höhe der größten *sichtbaren*. Und weil der Filter die
 * Einträge über `hidden` aus dem Raster nimmt, ändert sich diese größte mit
 * jedem Filterklick: gemessen bei 390 px war dieselbe Zeilenkarte ohne
 * Filter 212 px hoch, mit „Bis 250 €" 176 px. Man drückt auf einen Filter
 * und die ganze Liste wechselt die Proportion, obwohl an den Geräten nichts
 * anders ist. Einspaltig ist die natürliche Höhe die richtige. */
const listClass =
  "mt-6 grid gap-3 sm:mt-8 sm:auto-rows-fr sm:grid-cols-2 sm:gap-6 lg:grid-cols-3";

function PlainList({ children }: { children: React.ReactNode }) {
  return <ul className={listClass}>{children}</ul>;
}

function Browser({
  items,
  children,
}: {
  items: BrowserItem[];
  children: React.ReactNode;
}) {
  const list = React.useRef<HTMLUListElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  /* Die Zustandskapseln nur, wenn die Liste beides enthält. Mit dreizehn
     generalüberholten Geräten und keinem Neugerät sagte „Generalüberholt"
     dasselbe wie „Alle" und „Neu" führte auf eine leere Liste. */
  const mixed =
    items.some((item) => item.isNew) && items.some((item) => !item.isNew);
  const filters = React.useMemo(
    () =>
      FILTERS.filter(
        (f) => mixed || (f.id !== "neu" && f.id !== "gebraucht"),
      ),
    [mixed],
  );

  const raw = params.get("filter");
  const filter: Filter = filters.some((f) => f.id === raw)
    ? (raw as Filter)
    : "alle";
  const rawSort = params.get("sort");
  const sort: Sort = SORTS.some((s) => s.id === rawSort)
    ? (rawSort as Sort)
    : "";

  /* „Läuft JavaScript?" ohne Zustand im Effekt: Auf dem Server liefert der
     dritte Rückgabewert `false`, im Browser der zweite `true`. Damit stehen
     die Bedienelemente erst da, wenn sie auch etwas tun – ohne Skript bleibt
     die vollständige Liste, und niemand drückt auf einen Filter, der nicht
     filtert. */
  const ready = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const visible = React.useMemo(
    () => items.filter((item) => match(item, filter)),
    [items, filter],
  );
  const total = items.length;
  const shown = visible.length;

  /* Gefiltert und sortiert wird am gerenderten Eintrag, nicht an einem
     zweiten Datenbestand: `hidden` nimmt ihn aus Bild und Vorlesereihenfolge,
     `order` setzt ihn im Raster um. Beides ohne Neuaufbau der Liste – die
     Bilder bleiben geladen, und es gibt keinen Sprung. */
  React.useEffect(() => {
    const ul = list.current;
    if (!ul) return;
    const byId = new Map(
      ([...ul.children] as HTMLElement[]).map((el) => [el.dataset.id, el]),
    );
    for (const item of items) byId.get(item.id)?.setAttribute("hidden", "");
    [...visible]
      .sort((a, b) => {
        if (sort === "preis-ab") return b.price - a.price;
        if (sort === "reichweite") return (b.range ?? 0) - (a.range ?? 0);
        return a.price - b.price;
      })
      .forEach((item, i) => {
        const el = byId.get(item.id);
        if (!el) return;
        el.removeAttribute("hidden");
        el.style.order = String(i);
      });
  }, [items, visible, sort]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    /* `push`, nicht `replace`: Mit `replace` überschreibt jeder Filter den
       einzigen Eintrag im Verlauf – gemessen führte der Zurück-Knopf nach
       zwei Filterklicks von der Bestandsseite **weg** statt einen Schritt
       zurück in die vorige Auswahl. Auf dem Telefon ist Zurück die
       Hauptgeste; wer sie benutzt, um eine Filterung rückgängig zu machen,
       verliert damit die ganze Seite.

       `scroll: false`, sonst springt die Seite bei jedem Filter an den
       Anfang – man filtert aber mitten in der Liste. */
    router.push(`${pathname}?${next.toString()}#bestand`, { scroll: false });
  };

  return (
    <>
      {/* Erst zeigen, wenn JavaScript läuft: Ohne das stünden hier
          Schaltflächen, die nichts tun, und ein „13 von 13", das nie etwas
          anderes sagt. */}
      {ready ? (
        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="group"
            aria-label="Bestand filtern"
            /* Dieselben Ränder wie `.gutter`, nicht fest auf 24 px – siehe
               die Begründung an der Gerätebahn im Startseiten-Teaser. */
            className="scroll-x -mr-[max(1.5rem,env(safe-area-inset-right))] -ml-[max(1.5rem,env(safe-area-inset-left))] flex gap-2 pr-[max(1.5rem,env(safe-area-inset-right))] pl-[max(1.5rem,env(safe-area-inset-left))] lg:mx-0 lg:flex-wrap lg:px-0"
          >
            {filters.map((f) => {
              const active = f.id === filter;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setParam("filter", f.id === "alle" ? "" : f.id)}
                  className={cn(
                    "press h-11 shrink-0 rounded-full border px-4 font-display text-sm font-semibold tracking-tight transition-[background-color,border-color,color] duration-200 ease-out-quart",
                    active
                      ? "border-ink bg-ink text-silver"
                      : "border-current/25 text-current/75 hover:border-current/50",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="bestand-sortierung"
              className="shrink-0 text-sm text-current/70"
            >
              Sortierung
            </label>
            <select
              id="bestand-sortierung"
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
              className="h-11 min-w-0 rounded-full border border-current/25 bg-transparent px-4 text-[1.0625rem] font-medium"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      {/* Die Zahl steht in einer Live-Region: Wer die Liste nicht sieht,
          erfährt sonst nicht, dass ein Filter etwas getan hat. */}
      {ready ? (
        <p aria-live="polite" className="mt-4 text-sm text-current/65">
          {shown === total
            ? `${total} Geräte`
            : `${shown} von ${total} Geräten`}
        </p>
      ) : null}

      <ul ref={list} className={listClass}>
        {children}
      </ul>

      {ready && shown === 0 ? (
        <p className="mt-8 rounded-lg border border-current/15 p-6 leading-relaxed text-current/75">
          Zu dieser Auswahl steht gerade kein Gerät im Bestand.{" "}
          <a
            href="#suchauftrag"
            className="font-semibold underline underline-offset-2"
          >
            Suchauftrag hinterlegen
          </a>{" "}
          – wir melden uns, sobald eines hereinkommt.
        </p>
      ) : null}
    </>
  );
}
