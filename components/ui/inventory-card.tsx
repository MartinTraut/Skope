import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Images, Sparkles } from "lucide-react";

import { AVAILABILITY_LABEL } from "@/lib/commerce";
import { availabilityOf, condition, type InventoryItem } from "@/lib/inventory";
import { deviceHref } from "@/lib/data/vehicles";
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
  if (state === "available") {
    /* Die Plakette gibt es nur für Neugeräte, nicht für beide Zustände.
       Generalüberholt ist der Normalfall dieses Bestands – ein Etikett auf
       jeder Karte sagt nichts, es färbt nur. Was „generalüberholt" hier
       konkret heißt, steht als Zustandszeile unter dem Preis und
       ausführlich auf der Geräteseite. */
    if (item.condition !== "neu") return null;
    /* **Größer, mit Zeichen und mit Rand** (24.09.2026, auf Ansage).
       Vorher ein 11-px-Chip von 44 × 24 px oben links – auf einer 456 px
       breiten Karte mit einem Foto darunter fiel er nicht auf, und er war
       der einzige Hinweis darauf, dass zwischen dreizehn Gebrauchtgeräten
       auch Neuware steht.

       Der Ring in Tinte ist kein Zierrat: Die Aufnahmen sind Telefonfotos
       vor einer hellen Containerwand, und Neon auf Hellgrau steht bei 1,18:1
       – ohne die dunkle Kante verschwand der Chip auf der oberen Bildhälfte.
       Der Funke ist das einzige Zeichen im Satz, das „ungebraucht" sagt,
       ohne ein Wort zu brauchen. */
    return (
      <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-neon py-1.5 pr-3.5 pl-3 font-display text-sm font-bold tracking-tight text-ink uppercase ring-2 ring-ink/70">
        <Sparkles aria-hidden="true" className="size-4" strokeWidth={2.5} />
        Neu
      </span>
    );
  }
  return (
    /* Dieselbe Größe und Lage wie die Neu-Plakette: Zwei Plaketten, die
       sich gegenseitig ausschließen, dürfen nicht verschieden groß sein –
       sonst liest man aus dem Maß eine Rangfolge, die es nicht gibt. */
    <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center rounded-full bg-ink/90 px-3.5 py-1.5 font-display text-sm font-bold tracking-tight text-silver uppercase ring-2 ring-silver/25">
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
  const cond = condition(item);

  if (layout === "row") {
    return (
      <Link
        href={deviceHref(item)}
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

          {/* Kein `line-clamp`: Eine Zeile schnitt zehn von dreizehn
              Zustandsangaben mitten im Satz ab („Gebraucht, vollständig…").
              Seit die Karten eines Rasters ohnehin gleich hoch sind, kostet
              die zweite Zeile nichts – sie steht im leeren Rest. */}
          {cond ? <p className="mt-2 text-xs text-current/60">{cond}</p> : null}

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
      href={deviceHref(item)}
      aria-label={`${item.model}, ${item.price}, mehr Daten und Bilder`}
      className={cn(
        /* `w-full` gehört an die Karte, nicht an die Aufrufstelle.
           Gemessen auf `/e-chopper` bei 1512 px: Die Karte stand 34 px breit
           in einer 456 px breiten Rasterspalte – genau Innenabstand plus
           Rahmen, der Inhalt hatte Breite 0. Grund ist `@container`: Die
           Klasse setzt `container-type: inline-size`, und damit rechnet der
           Browser die Breite der Karte **ohne ihren Inhalt**. Als Flex-Kind
           mit `flex-basis: auto` bleibt davon nichts übrig. Der Aufrufer auf
           `/e-scooter` gab das `w-full` mit, die Kategorieseite nicht – eine
           Angabe, die an vier Stellen stehen muss und an einer fehlen darf,
           ist kein Bauteil, sondern eine Falle. */
        "press group lift @container flex h-full w-full flex-col rounded-lg border border-silver/15 bg-ink p-3.5 text-silver on-dark transition-[transform,box-shadow,border-color] duration-300 ease-out-quart [--press-scale:0.985] hover:-translate-y-1 hover:border-neon/45 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-4",
        className,
      )}
    >
      {/* Quadrat als Ausgangsmaß, aber die Zone darf wachsen (`grow`).

          Das ist die Stelle, an der der Längenunterschied zwischen den
          Karten aufgefangen wird. Dreizehn Geräte haben Namen von einer bis
          drei Zeilen und Zustandsangaben von einer bis zwei; in einem Raster
          mit `auto-rows-fr` sind trotzdem alle Karten gleich hoch, und
          irgendwo muss die Differenz hin.

          Sie lag bis hierher im Text – zwei Kästen mit `min-h-[2lh]` über
          Modellname und Zustand hielten vier Zeilen frei, und eine Karte wie
          „Zamelux E9" füllte davon zwei. Gemessen bei 1512 px: 27 px leer
          unter dem Modellnamen, 29 px unter dem Zustand. Das war kein
          Abstand, sondern eine Lücke mitten im Satz – zweimal dieselbe
          Sorte Fehler, die schon die ausgeschriebene ABE-Warnung verursacht
          hatte.

          Das Bild ist das einzige Element der Karte, das beliebige Höhe
          verträgt, ohne als Fehler gelesen zu werden: Es liegt `object-cover`
          und zeigt bei ein paar Pixeln mehr schlicht mehr vom Roller. Die
          Aufnahmen sind ohnehin hochkant (720 × 960), ein leicht stehendes
          Format liegt ihnen näher als das Quadrat.

          `grow` und nicht `flex-1`: `flex-1` setzt die Basis auf 0, damit
          wäre die Höhe allein der Restraum und `aspect-square` wirkungslos –
          bei einer Karte mit dreizeiligem Namen schrumpfte das Bild. So
          bleibt das Quadrat die Untergrenze und der Überschuss kommt oben
          drauf. */}
      <div className="relative aspect-square grow overflow-hidden rounded-md bg-ink-700">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 46vw, calc(100vw - 3rem)"
          className="object-cover transition-transform duration-[650ms] ease-out-expo group-hover:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />

        <StatusBadge item={item} />
        {item.images.length > 1 ? (
          <span
            className={cn(
              "pointer-events-none absolute right-3 inline-flex items-center gap-1.5 rounded-md bg-ink/75 px-2.5 py-1 text-xs",
              // Über dem Warnstreifen, nicht dahinter.
              item.streetLegal ? "bottom-3" : "bottom-11",
            )}
          >
            <Images aria-hidden="true" className="size-3.5" />
            <span className="tabular">{item.images.length}</span>
          </span>
        ) : null}

        {!item.streetLegal ? (
          /* Die Zelle im Band sagt „Keine ABE", dieser Streifen sagt, was das
             heißt – und er liegt auf dem Bild, nicht unter dem Band.

             Zwei Gründe. Der sichtbare: Als Absatz in der Karte machte die
             zweizeilige Warnung genau zwei der dreizehn Karten höher, und
             weil alle Karten eines Rasters gleich hoch sind, bekamen die elf
             übrigen dieselbe Höhe als leere Fläche geschenkt – gemessen 48 px
             unter dem Zustand, auf jeder Karte, auf jeder Breite. Eine
             Ausnahme, die zwei Geräte betrifft, darf nicht das Layout aller
             dreizehn bestimmen.

             Der inhaltliche: Auf dem Bild steht sie vor dem Preis statt
             hinter den Kennwerten. Sie ist damit nicht kleiner geworden,
             sondern lauter – Bernstein auf Tinte, volle Kartenbreite,
             ausgeschrieben wie bisher. Genau das verlangt der Eintrag in
             CLAUDE.md: nicht einklappen, nicht ins Kleingedruckte. */
          <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-amber-300/95 px-3 py-2 text-[0.6875rem] leading-snug font-semibold text-ink">
            Ohne deutsche Betriebserlaubnis – nicht für den öffentlichen
            Straßenverkehr.
          </p>
        ) : null}
      </div>

      {/* Die Karte hat vier Teile in fester Reihenfolge: Bild, Benennung,
          Datenband, Weg. Die überschüssige Höhe liegt an genau einer Stelle –
          unter dem Preis –, und zwar so, dass man sie nicht als Lücke liest.

          Vorher war sie auf zwei Abstände verteilt (je ein `mt-auto` über
          Modell und über dem Verweis). Das war der Versuch, ein Loch durch
          zwei kleinere zu ersetzen: Das Datenband schwamm dadurch frei in der
          Mitte, mit Leere darüber *und* darunter, und die Karte hatte keine
          Ordnung mehr, die man am Rand ablesen konnte.

          Jetzt hängt die untere Gruppe – Warnung, Datenband, Verweis –
          zusammen am Boden der Karte, und das Band läuft über die volle
          Kartenbreite statt im Satzspiegel. Damit trägt es eine echte Kante:
          Über der Kante steht, was das Gerät ist, darunter, was es kann.
          Freie Höhe steht dann direkt unter dem Preis, also unter dem Punkt,
          auf den das Auge in dieser Karte ohnehin zuerst fällt – dort ist
          Abstand Satz und keine vergessene Fläche.

          Modell links, Preis rechts auf einer Grundlinie. In der einzelnen
          Spalte (342 px) geht das auf; in zwei Spalten ab `sm` ist die Karte
          mindestens 280 px breit, „Audi Electric Kick Scooter powered by
          Egret Pro" läuft dann über zwei Zeilen, der Preis bleibt oben. */}
      <div className="mt-4 flex items-start justify-between gap-4">
        {/* Kein reservierter Zweizeiler mehr: Der Name nimmt die Zeilen, die
            er braucht, und der Unterschied zwischen den Karten wird oben in
            der Bildzone ausgeglichen. */}
        <h3 className="text-[1.0625rem] leading-snug font-semibold text-balance">
          {item.model}
        </h3>
        <p className="tabular shrink-0 font-display text-lg leading-none font-bold tracking-tight text-accent sm:text-xl">
          {item.price}
        </p>
      </div>

      {/* Der Zustand – auf der quadratischen Karte bisher gar nicht gezeigt,
          obwohl er in den Daten steht und die Zeilenkarte am Telefon ihn
          trägt.

          Er gehört genau hierhin, und zwar aus zwei Gründen. Erstens ist es
          die Angabe, die nach Modell und Preis als Nächstes gefragt wird –
          bei einem Einzelstück aus zweiter Hand ist „vollständig überholt"
          der Unterschied zum Kleinanzeigenportal. Zweitens war unter dem
          Preis das Loch: Die Karten eines Rasters sind alle gleich hoch, und
          die überschüssige Höhe der kürzesten stand dort als leere Fläche.
          Ein Abstand lässt sich nicht kleiner machen, ohne die Karten wieder
          ungleich zu machen – Inhalt füllt ihn. Die Angaben sind zwischen 30
          und 90 Zeichen lang, nehmen also je nach Gerät ein bis drei Zeilen
          und schlucken damit genau die Schwankung, die sie verursacht.

          Kein `line-clamp`: Dieselbe Entscheidung wie auf der Zeilenkarte –
          zehn von dreizehn Angaben brächen mitten im Satz ab. */}
      {cond ? (
        <p className="mt-2 text-sm leading-relaxed text-current/60">{cond}</p>
      ) : null}

      {/* Der Fuß der Karte: Warnung, Datenband und Weg als ein Block, an den
          unteren Rand gehängt. Ein `mt-auto` für alle drei statt eines je
          Teil – sonst wandert bei jeder Kartenhöhe ein anderer Abstand mit. */}
      {/* Kein `mt-auto` mehr: In einer Flex-Spalte gewinnt ein automatischer
          Rand gegen jedes `grow`, der Rest ginge also wieder an diesen
          Abstand statt an die Bildzone. Der Fuß steht auch so unten – über
          ihm liegt nichts mehr, was sich ausdehnen könnte. */}
      {/* **Der Fuß ist eine eigene Fläche** (24.09.2026, auf Ansage
          „besser dargestellt").

          Die Karte hatte zwei Zonen, die sich ansahen wie eine: Unter dem
          Bild lief alles als ein Textblock durch – Modell, Preis, Zustand,
          drei Kennwerte zwischen Haarlinien, ein Verweis –, und die untere
          Hälfte war damit eine flache Liste ohne Abschluss. Die Haarlinien
          des Datenbands waren die einzige Struktur darin und zugleich das
          schwächste Element der Karte.

          Jetzt liegen Datenband und Weg auf einer eigenen, kaum abgesetzten
          Fläche, die bis an die Kartenränder läuft und unten deren Radius
          aufnimmt. Die Karte liest sich damit von oben nach unten als drei
          Zonen: das Gerät (Bild), was es ist (Modell, Preis, Zustand), was es
          kann (Daten, Weg). Der Ton ist bewusst gering – 3,5 Prozent Silber
          auf Tinte –, es ist eine Zone, kein zweiter Kasten.

          Der Radius ist `calc(…)`: Die Fläche liegt innerhalb des 1-px-Rahmens
          der Karte, ihr Radius muss also um genau diese Linie kleiner sein,
          sonst steht zwischen Fläche und Rahmen an der Rundung ein dunkler
          Sichel. */}
      <div className="-mx-3.5 -mb-3.5 mt-5 rounded-b-[calc(var(--radius-lg)-1px)] bg-silver/[0.035] px-3.5 pt-4 pb-3.5 sm:-mx-4 sm:-mb-4 sm:px-4 sm:pb-4">
        {/* Über die volle Kartenbreite statt im Satzspiegel: Die Haarlinien
            sind damit Kanten der Karte und nicht drei Striche in ihrer Mitte.
            Die Zellen behalten ihren Innenabstand über `first:pl-*` /
            `last:pr-*` in `Fact`, die Werte stehen also weiter auf derselben
            Linie wie Modell und Preis darüber. */}
        {/* Zwei oder drei Zellen – entschieden an der **Kartenbreite**, nicht
            an der Fensterbreite. Genau daran war die Zeile bisher kaputt: Bei
            768 px Fenster ist die Karte 332 px breit und alles passt, bei
            1024 px sind es wegen der dritten Rasterspalte nur 293 – und dort
            brach „bis 20 km" in zwei Zeilen um. Eine Media Query kann das
            nicht treffen, eine Container-Query schon.

            Die Schwelle ist gemessen, nicht gerundet: Bei gleich breiten
            Spalten bestimmt das längste Etikett die Zelle. „REICHWEITE" misst
            76 px, mit dem Zellenabstand 100 px, mal drei            der Karte ergibt 332 px. Darunter fällt Tempo weg – die Angabe,
            die am wenigsten unterscheidet: Zwölf der dreizehn Geräte fahren
            20 km/h. Dieselbe Entscheidung wie auf der Zeilenkarte am Telefon,
            dort aus demselben Grund. Vollständig steht das Tempo auf der
            Geräteseite. */}
        <dl className="@[18.75rem]:grid-cols-3 grid grid-cols-2 divide-x divide-current/12 border-b border-current/12 pb-1">
          {/* `hidden` lässt die Zelle `:first-child` bleiben, `first:pl-0` in
              `Fact` greift also weiter an ihr statt an der Reichweite. Die
              bekommt den linken Rand deshalb ausdrücklich genommen, solange
              das Tempo nicht steht. */}
          <Fact
            label="Tempo"
            value={speed(item)}
            className="@[18.75rem]:block hidden"
          />
          <Fact
            label="Reichweite"
            value={range(item)}
            className="@[18.75rem]:pl-3 pl-0"
          />
          <Fact
            label="Zulassung"
            value={item.streetLegal ? "ABE" : "Keine ABE"}
            warn={!item.streetLegal}
          />
        </dl>

        {/* Kein Knopf, sondern eine Zeile mit Pfeil – die Karte ist selbst der
            Link. Kein Neon: Der Verweis ist weder Hauptaktion noch harte
            Zahl. */}
        <span className="mt-4 flex items-center gap-2 font-display text-sm font-semibold tracking-tight text-current underline decoration-current/40 underline-offset-4 group-hover:decoration-current">
          Mehr Daten
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 ease-out-quart group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </span>
      </div>
    </Link>
  );
}
