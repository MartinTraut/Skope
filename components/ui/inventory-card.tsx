import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Images } from "lucide-react";

import type { InventoryItem } from "@/lib/inventory";

/**
 * Reihenfolge, in der Kennwerte auf die Karte kommen.
 *
 * Nicht die ersten beiden aus der Liste: Dort steht bei jedem Gerät zuerst
 * der Zustand und dann die Zulassung – beides Sätze, keine Zahlen, und in
 * einer Übersicht bei allen Geräten fast gleich. Wer dreizehn Roller
 * vergleicht, sucht Tempo und Reichweite. Fehlt eines davon, rückt der
 * nächste harte Wert nach.
 */
const KEY_SPECS = [
  "Höchstgeschwindigkeit",
  "Reichweite",
  "Akku",
  "Motor",
  "Bereifung",
];

function keyFacts(item: InventoryItem) {
  return KEY_SPECS.map((label) =>
    item.specs.find((spec) => spec.label === label),
  )
    .filter((spec) => spec !== undefined)
    .slice(0, 2)
    .map((spec) => spec.value);
}

/**
 * Eine Karte im Bestandsraster – vollständig ein Link auf die Geräteseite.
 *
 * Vorher klappte hier ein Datenblatt in der Karte auf. Das hatte drei Fehler
 * auf einmal, und alle drei verschwinden mit der eigenen Seite:
 *
 * 1. **Das Raster brach auf.** Rasterfelder ziehen sich auf die Höhe des
 *    höchsten Feldes ihrer Reihe. Eine ausgeklappte Karte ließ ihren beiden
 *    Nachbarn also eine große leere Fläche – sichtbar in jedem Screenshot,
 *    und nicht durch Feinarbeit zu beheben, sondern nur durch Verzicht auf
 *    den Aufklapper.
 * 2. **Dieselben Angaben lagen zweimal unter einer Adresse.** Übersicht und
 *    Datenblatt auf `/e-scooter` – für eine Suchmaschine ist das eine Seite
 *    mit dreizehn Datenblättern, aus der sich kein einzelnes Gerät als
 *    Ergebnis ausspielen lässt.
 * 3. **Die Bilder blieben klein.** Genau das war die Bitte.
 *
 * Die Karte zeigt jetzt nur, wonach in einer Übersicht ausgewählt wird: ein
 * Bild, Modell, Preis, zwei Kennwerte – und die Warnung, wenn ein Gerät keine
 * deutsche Betriebserlaubnis hat. Die bleibt ausdrücklich auf der Karte: Sie
 * ist der einzige Wert, der die Kaufentscheidung umdrehen kann, und hinter
 * einem Klick wäre sie das Kleingedruckte, das sie nicht sein darf.
 *
 * Nur die erste Aufnahme, keine Galerie mit Pfeilen: Ein `<button>` in einem
 * `<a>` ist ungültiges HTML, und ein Pfeil, der die Auswahl weiterschaltet,
 * ohne die Karte zu öffnen, ist auf dem Telefon nicht von einem Fehlklick zu
 * unterscheiden. Wie viele Ansichten es gibt, steht als Zahl auf dem Bild –
 * das ist der Grund, weiterzuklicken, nicht der Weg dorthin.
 *
 * Ohne Zustand ist die Karte wieder eine Server Component. Dreizehn Stück
 * JavaScript weniger auf der Bestandsseite.
 */
export function InventoryCard({ item }: { item: InventoryItem }) {
  const cover = item.images[0];

  return (
    <Link
      href={`/e-scooter/${item.id}`}
      aria-label={`${item.model}, ${item.price}, alle Daten und Bilder`}
      className="press group lift flex h-full flex-col rounded-lg border border-silver/15 bg-ink p-4 text-silver on-dark transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] [--press-scale:0.985] hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Quadrat statt 3:4: Die Aufnahmen sind hochkant (720 x 960), der
          Roller steht darin waagerecht in der Mitte – ein Quadrat schneidet
          oben und unten Wand und Boden weg, nicht das Gerät. */}
      <div className="relative aspect-square overflow-hidden rounded-md bg-ink-700">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          /* Die Schwellen standen an anderen Stellen als die des Rasters
             (640/1280 gegen 380/640/1280) und behaupteten durchgehend zu
             viel: Bei 640 px Fenster ist die Karte gemessen 250 px breit,
             `92vw` versprach 589 – geholt wurde ein 1200er Bild für einen
             500-px-Bedarf. Jetzt folgen die Schwellen dem Raster. */
          sizes="(min-width: 1280px) 30vw, (min-width: 380px) 46vw, calc(100vw - 3rem)"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />

        {item.images.length > 1 ? (
          <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-md bg-ink/75 px-2.5 py-1 text-xs">
            <Images aria-hidden="true" className="size-3.5" />
            <span className="tabular">{item.images.length}</span>
          </span>
        ) : null}
      </div>

      {/* Modell und Preis auf einer Grundlinie: In einer Rasterspalte ist der
          Preis das zweite, was gelesen wird, und untereinander kostet er eine
          eigene Zeile pro Karte. */}
      {/* In zwei Spalten ist die Karte am Telefon 163 px breit. Modell und
          Preis nebeneinander gehen dort nicht auf – „199,99 €" braucht allein
          85 px, für den Modellnamen blieben 60. Deshalb untereinander, bis
          die Karte wieder Platz hat. */}
      <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        {/* 1,0625 rem ist der Grundschriftgrad der Seite (`body` in
            globals.css), nicht 1 rem. Die Überschrift der Karte stand mit
            16 px darunter – in der zweispaltigen Ansicht war sie damit die
            kleinste Überschrift des ganzen Auftritts und lag nur 3 px über
            dem Kennwert darunter. Jetzt schließt sie mit dem Fließtext der
            Seite ab, und der Abstand zum Kartentext (14 px) ist eine
            sichtbare Stufe statt einer gemessenen. */}
        <h3 className="text-[1.0625rem] leading-snug font-semibold sm:text-lg">
          {item.model}
        </h3>
        <p className="tabular font-display text-lg leading-none font-bold tracking-tight text-accent sm:shrink-0 sm:text-xl">
          {item.price}
        </p>
      </div>

      <p className="mt-2 text-sm text-current/65">
        {keyFacts(item).join(" · ")}
      </p>

      {!item.streetLegal ? (
        /* Der Text muss im Kasten umbrechen, nicht daneben. In einer
           Flex-Zeile ist ein bloßer Textknoten ein anonymes Element mit
           `min-width: auto` und schrumpft nicht: In der zweispaltigen Karte
           (163 px) war der Kasten gemessen 129 px breit bei 160 px Inhalt,
           „Betriebserlaubnis" stand also 31 px außerhalb der gelben Fläche. */
        <p className="mt-3 flex items-start gap-2 rounded-md bg-amber-400/10 px-3 py-2 text-xs text-amber-200 sm:text-sm">
          <AlertTriangle
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
            strokeWidth={2}
          />
          {/* Silbentrennung, weil das Wort allein nicht passt: In der
              schmalen Karte bleiben 105 px Satz, „Betriebserlaubnis" misst
              bei 13 px 118. Dieselbe Ausnahme wie in der Tarif-Tabelle. */}
          <span className="min-w-0 [hyphens:auto] break-words">
            Ohne deutsche Betriebserlaubnis
          </span>
        </p>
      ) : null}

      {/* `mt-auto` zieht die Zeile auf die Unterkante: In einer Rasterreihe
          sind die Karten unterschiedlich hoch, und Abschlusszeilen auf
          verschiedenen Höhen lesen sich als Fehler.

          Kein Knopf, sondern eine Zeile mit Pfeil. Ein Knopf in einer Karte,
          die selbst ein Link ist, verspricht eine zweite Aktion, die es nicht
          gibt – und wäre als `<button>` im `<a>` ungültig. */}
      {/* In der schmalen Spalte (163 px am Telefon, davon 129 px Satz) brach
          „Alle Daten und Bilder" auf zwei Zeilen. Kürzere Beschriftung und
          ein Grad kleiner: 85 px Text plus Abstand und Pfeil sind 109 px. Der
          vollständige Satz steht weiterhin im `aria-label` der Karte. */}
      {/* Kein Neon: Der Verweis ist weder Hauptaktion noch harte Zahl. Mit
          Neon trug jede Karte zwei Signale, und der Preis – die eine harte
          Zahl je Karte – verlor seine Auszeichnung. Unterstrichen wie der
          `quiet`-Knopf. */}
      <span className="mt-auto flex items-center gap-2 pt-5 font-display text-xs font-semibold tracking-tight text-current underline decoration-current/40 underline-offset-4 group-hover:decoration-current sm:text-sm">
        Daten &amp; Bilder
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1 motion-reduce:transition-none"
        />
      </span>
    </Link>
  );
}
