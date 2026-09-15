import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Images } from "lucide-react";

import { AVAILABILITY_LABEL } from "@/lib/commerce";
import { availabilityOf, condition, type InventoryItem } from "@/lib/inventory";
import { cn } from "@/lib/utils";

/**
 * Die drei Kennwerte, nach denen in einer Übersicht verglichen wird.
 *
 * Immer dieselben drei Felder in derselben Reihenfolge, nicht „die ersten
 * zwei, die es gibt": Vorher stand bei einem Gerät „20 km/h · bis 20 km je
 * nach Fahrprofil", beim nächsten „20 km/h · 8,5 Zoll Honeycomb-Vollgummi"
 * und beim Odys gar nichts – dreizehn Karten, dreizehn verschiedene Zeilen,
 * und nichts davon ließ sich von Karte zu Karte lesen. Jetzt trägt jede Karte
 * Tempo, Reichweite und Zulassung an derselben Stelle. Fehlt ein Wert in den
 * Daten, steht ein Strich – das ist eine ehrliche Lücke und keine erfundene
 * Zahl. Die Zulassung ist der Wert, der die Kaufentscheidung umdrehen kann;
 * sie steht deshalb nicht im Kleingedruckten, sondern als dritte Zelle in
 * Bernstein, wenn sie fehlt.
 */
function speed(item: InventoryItem) {
  const raw = item.specs.find(
    (s) => s.label === "Höchstgeschwindigkeit",
  )?.value;
  return raw?.replace(/^ca\.\s*/, "") ?? null;
}

function range(item: InventoryItem) {
  const raw = item.specs.find((s) => s.label === "Reichweite")?.value;
  if (!raw) return null;
  /* „bis 20 km je nach Fahrprofil" → „bis 20 km". Der Zusatz steht auf der
     Geräteseite; in einer Zelle von 100 px bricht er dreizeilig. */
  return raw.match(/bis\s*\d+\s*km/)?.[0] ?? raw;
}

function Fact({
  label,
  value,
  warn = false,
  className,
}: {
  label: string;
  value: string | null;
  warn?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 px-3 py-2.5 first:pl-0 last:pr-0", className)}>
      <dt className="text-[0.6875rem] font-medium tracking-[0.08em] uppercase text-current/50">
        {label}
      </dt>
      <dd
        className={cn(
          "tabular mt-1 flex items-center gap-1.5 font-display text-sm leading-tight font-semibold tracking-tight",
          warn ? "text-amber-300" : "text-current/90",
        )}
      >
        {warn ? (
          <AlertTriangle
            aria-hidden="true"
            className="size-3.5 shrink-0"
            strokeWidth={2}
          />
        ) : null}
        {value ?? "–"}
      </dd>
    </div>
  );
}

/**
 * Der Zustand nur, wenn er vom Regelfall abweicht.
 *
 * „Sofort verfügbar" auf dreizehn Karten ist keine Auskunft, sondern
 * Grundrauschen – die Liste führt ohnehin nur, was da ist. Reserviert und
 * verkauft sind die Fälle, die jemanden vom Klicken abhalten sollen, und die
 * stehen deshalb als Plakette auf dem Bild statt als Zeile im Text.
 */
function StatusBadge({ item }: { item: InventoryItem }) {
  const state = availabilityOf(item);
  if (state === "available") return null;
  return (
    <span className="pointer-events-none absolute top-2 left-2 rounded bg-ink/85 px-2 py-1 font-display text-[0.6875rem] font-semibold tracking-[0.08em] text-silver uppercase">
      {AVAILABILITY_LABEL[state]}
    </span>
  );
}

/**
 * Eine Karte im Bestandsraster – vollständig ein Link auf die Geräteseite.
 *
 * Bild, Modell und Preis auf einer Zeile, drei Kennwerte als Zeile mit
 * Haarlinien, ein Verweis. Alles Weitere steht auf der Seite des Geräts.
 *
 * Am Telefon steht die Karte allein in der Spalte. Zweispaltig war sie bei
 * 390 px 163 px breit: Modell über zwei Zeilen, Preis darunter, dann eine
 * Kennwertzeile, die je nach Gerät einzeilig oder dreizeilig war – zwei
 * Karten nebeneinander waren nie gleich hoch, und die Reihe sah zerrissen
 * aus. Einspaltig teilen sich Modell und Preis eine Zeile, und die drei
 * Zellen haben je 100 px. Ab `sm` wieder zwei Spalten.
 *
 * Nur die erste Aufnahme, keine Galerie mit Pfeilen: Ein `<button>` in einem
 * `<a>` ist ungültiges HTML, und ein Pfeil, der die Auswahl weiterschaltet,
 * ohne die Karte zu öffnen, ist auf dem Telefon nicht von einem Fehlklick zu
 * unterscheiden. Wie viele Ansichten es gibt, steht als Zahl auf dem Bild.
 *
 * Ohne Zustand ist die Karte eine Server Component.
 */
export function InventoryCard({
  item,
  className,
  layout = "card",
}: {
  item: InventoryItem;
  className?: string;
  /**
   * `row` ist die schmale Zeilenform für die Liste am Telefon: Bild links,
   * Angaben rechts. Dreizehn quadratische Karten sind dort gemessen 7,5
   * Bildschirmhöhen – dieselbe Liste als Zeilen ist ein Drittel davon, und
   * ein Katalog wird überflogen, nicht betrachtet. Die Auslage auf der
   * Startseite bleibt `card`: Drei Geräte sind kein Katalog.
   */
  layout?: "card" | "row";
}) {
  const cover = item.images[0];

  if (layout === "row") {
    const cond = condition(item);
    return (
      <Link
        href={`/e-scooter/${item.id}`}
        aria-label={`${item.model}, ${item.price}, mehr Daten und Bilder`}
        className={cn(
          "press group flex w-full gap-4 rounded-lg border border-silver/15 bg-ink p-3 text-silver on-dark [--press-scale:0.99]",
          className,
        )}
      >
        {/* Feste Bildfläche, damit die Zeilen nicht unterschiedlich hoch
            werden und beim Laden nichts springt: 115 × 145 sind die
            Innenmaße, das Verhältnis der Aufnahmen (720 × 960) passt fast
            genau darauf. */}
        <div className="relative h-[145px] w-[115px] shrink-0 overflow-hidden rounded-md bg-ink-700">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="115px"
            className="object-cover"
          />
          <StatusBadge item={item} />
          {item.images.length > 1 ? (
            <span className="pointer-events-none absolute right-1.5 bottom-1.5 inline-flex items-center gap-1 rounded bg-ink/75 px-1.5 py-0.5 text-[0.6875rem]">
              <Images aria-hidden="true" className="size-3" />
              <span className="tabular">{item.images.length}</span>
            </span>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="text-[1.0625rem] leading-snug font-semibold">
            {item.model}
          </h3>
          <p className="tabular mt-1.5 font-display text-lg leading-none font-bold tracking-tight text-accent">
            {item.price}
          </p>

          {cond ? (
            <p className="mt-2 line-clamp-1 text-xs text-current/60">{cond}</p>
          ) : null}

          {/* Nur die zwei Werte, nach denen in einer Liste verglichen wird.
              Tempo steht auf der Geräteseite: Zwölf von dreizehn Geräten
              fahren 20 km/h, die Zelle unterscheidet also nichts. */}
          <p className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 font-display text-sm font-semibold tracking-tight">
            <span className="text-current/85">{range(item) ?? "–"}</span>
            <span aria-hidden="true" className="text-current/25">
              ·
            </span>
            <span
              className={cn(
                item.streetLegal ? "text-current/85" : "text-amber-200",
              )}
            >
              {item.streetLegal ? "Mit ABE" : "Keine ABE"}
            </span>
          </p>

          {!item.streetLegal ? (
            <p className="mt-1.5 text-[0.6875rem] leading-snug text-amber-200/90">
              Nicht für den öffentlichen Straßenverkehr.
            </p>
          ) : null}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/e-scooter/${item.id}`}
      aria-label={`${item.model}, ${item.price}, mehr Daten und Bilder`}
      className={cn(
        "press group lift flex h-full flex-col rounded-lg border border-silver/15 bg-ink p-3.5 text-silver on-dark transition-[transform,box-shadow] duration-300 ease-out-quart [--press-scale:0.985] hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-4",
        className,
      )}
    >
      {/* Quadrat, auch in der einzelnen Spalte. Ein Versuch mit 4:3 am
          Telefon sparte 86 px Höhe, schnitt aber bei jedem zweiten Gerät die
          Räder oder den Lenker ab: Die Aufnahmen sind hochkant (720 × 960)
          und der Roller füllt sie von oben bis unten. Das Quadrat nimmt nur
          Wand und Boden weg. */}
      <div className="relative aspect-square overflow-hidden rounded-md bg-ink-700">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 46vw, calc(100vw - 3rem)"
          className="object-cover transition-transform duration-[650ms] ease-out-expo group-hover:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />

        <StatusBadge item={item} />
        {item.images.length > 1 ? (
          <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-md bg-ink/75 px-2.5 py-1 text-xs">
            <Images aria-hidden="true" className="size-3.5" />
            <span className="tabular">{item.images.length}</span>
          </span>
        ) : null}
      </div>

      {/* Modell links, Preis rechts auf einer Grundlinie. In der einzelnen
          Spalte (342 px) geht das auf; in zwei Spalten ab `sm` ist die Karte
          mindestens 280 px breit, „Audi Electric Kick Scooter powered by
          Egret Pro" läuft dann über zwei Zeilen, der Preis bleibt oben. */}
      <div className="mt-4 flex items-start justify-between gap-4">
        {/* Zwei Zeilen Platz, auch wenn der Name nur eine braucht: Von
            dreizehn Modellen laufen „Audi Electric Kick Scooter powered by
            Egret Pro" und die beiden Xiaomi über zwei Zeilen, die übrigen
            über eine – ohne festen Kasten beginnt die Kennwertzeile dann bei
            jeder zweiten Karte 24 px höher, und die Karten einer Reihe lesen
            sich als verschieden aufgebaut. `lh` ist die Zeilenhöhe dieses
            Elements; kennt ein Browser die Einheit nicht, fällt die Angabe
            weg und es bleibt beim alten Verhalten. */}
        <h3 className="min-h-[2lh] text-[1.0625rem] leading-snug font-semibold text-balance">
          {item.model}
        </h3>
        <p className="tabular shrink-0 font-display text-lg leading-none font-bold tracking-tight text-accent sm:text-xl">
          {item.price}
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-3 divide-x divide-current/12 border-y border-current/12">
        <Fact label="Tempo" value={speed(item)} />
        <Fact label="Reichweite" value={range(item)} />
        <Fact
          label="Zulassung"
          value={item.streetLegal ? "ABE" : "Keine ABE"}
          warn={!item.streetLegal}
        />
      </dl>

      {!item.streetLegal ? (
        /* Die Zelle sagt „Keine ABE", der Satz sagt, was das heißt. Die
           Warnung bleibt ausgeschrieben auf der Karte – hinter einem Klick
           wäre sie das Kleingedruckte, das sie nicht sein darf. */
        <p className="mt-3 text-xs leading-snug text-amber-200/90">
          Ohne deutsche Betriebserlaubnis – nicht für den öffentlichen
          Straßenverkehr.
        </p>
      ) : null}

      {/* `mt-auto` zieht die Zeile auf die Unterkante: In einer Rasterreihe
          sind die Karten unterschiedlich hoch, und Abschlusszeilen auf
          verschiedenen Höhen lesen sich als Fehler. Kein Knopf, sondern eine
          Zeile mit Pfeil – die Karte ist selbst der Link. Kein Neon: Der
          Verweis ist weder Hauptaktion noch harte Zahl. */}
      <span className="mt-auto flex items-center gap-2 pt-4 font-display text-sm font-semibold tracking-tight text-current underline decoration-current/40 underline-offset-4 group-hover:decoration-current">
        Mehr Daten
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 ease-out-quart group-hover:translate-x-1 motion-reduce:transition-none"
        />
      </span>
    </Link>
  );
}
