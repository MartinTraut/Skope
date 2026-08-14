"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

import type { InventoryImage } from "@/lib/inventory";
import { cn } from "@/lib/utils";

/**
 * Bildergalerie für ein Bestandsgerät.
 *
 * Alle Aufnahmen liegen gleichzeitig im DOM und blenden über die Deckkraft
 * ineinander. Der naheliegende Weg – immer nur das aktive Bild rendern – hat
 * einen sichtbaren Fehler: Next lädt die neue Datei erst beim Wechsel, und
 * bis sie da ist, steht der Rahmen leer. Übereinander gelegt sind alle sechs
 * nach dem ersten Durchklicken im Cache, und der Wechsel ist ein reiner
 * Compositor-Schritt.
 *
 * Vor- und Zurück-Knöpfe liegen auf dem Bild: Sie kosten keine Höhe und sind
 * mit 44 Pixeln fingergerecht. Pfeiltasten bedienen dieselbe Auswahl, damit
 * die Galerie ohne Maus vollständig ist.
 *
 * Die Vorschaureihe ist abschaltbar und im Bestandsraster abgeschaltet. Das
 * ist kein halber Ausbau, sondern gemessen: Sechs 45-Pixel-Kacheln desselben
 * Rollers unterscheiden sich für das Auge nicht, kosten aber gut sechzig
 * Pixel unter jeder der dreizehn Karten. Auf der Geräteseite steht die Reihe
 * in voller Breite und zeigt tatsächlich unterschiedliche Ansichten.
 */
export function Gallery({
  images,
  className,
  sizes = "(max-width: 640px) 92vw, (max-width: 1280px) 46vw, 30vw",
  thumbnails = false,
  priority = false,
  ratio = "square",
}: {
  images: InventoryImage[];
  className?: string;
  sizes?: string;
  /** Vorschaureihe unter dem Bild – siehe Begründung oben. */
  thumbnails?: boolean;
  priority?: boolean;
  /**
   * Seitenverhältnis des Rahmens. Das Bild füllt ihn in beiden Fällen ganz
   * aus – es gibt keine Variante mit Balken.
   *
   * `square` hält das Bestandsraster in einer Linie: dreizehn Kacheln
   * brauchen dieselbe Kantenlänge, und ein Streifen Boden weniger zählt dort
   * weniger als ein einheitliches Raster.
   *
   * `portrait` ist das Verhältnis der Aufnahmen selbst (720 × 960). Auf der
   * Geräteseite ist der Rahmen damit deckungsgleich mit dem Bild: nichts wird
   * beschnitten und nichts bleibt leer. Der Zwischenschritt davor – Quadrat
   * mit `object-contain` – zeigte zwar das ganze Gerät, liess aber links und
   * rechts je gut achtzig Pixel hellen Grund stehen, und der las sich als
   * Platzhalterkasten statt als Bild.
   */
  ratio?: "square" | "portrait";
}) {
  const [active, setActive] = React.useState(0);
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [zoomed, setZoomed] = React.useState(false);

  const step = React.useCallback(
    (delta: number) =>
      setActive((i) => (i + delta + images.length) % images.length),
    [images.length],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
    else return;
    event.preventDefault();
  };

  /**
   * Vollbild über das native `<dialog>`: Es bringt Fokusfalle, Escape und die
   * Sperre für den Hintergrund mit. Eine nachgebaute Überlagerung müsste all
   * das von Hand haben – und hat es in der Praxis nie vollständig.
   */
  const openZoom = () => {
    setZoomed(true);
    dialogRef.current?.showModal();
  };

  const closeZoom = React.useCallback(() => {
    setZoomed(false);
    dialogRef.current?.close();
  }, []);

  return (
    <>
      <div className={cn("flex flex-col gap-3", className)}>
        <div
          role="group"
          aria-label="Bilder des Geräts"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className={cn(
            "group/gal relative overflow-hidden rounded-md bg-ink-700",
            ratio === "portrait" ? "aspect-[3/4]" : "aspect-square",
          )}
        >
          {images.map((image, i) => (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              aria-hidden={i === active ? undefined : "true"}
              fill
              sizes={sizes}
              priority={priority && i === 0}
              className={cn(
                "object-cover transition-opacity duration-300 motion-reduce:transition-none",
                i === active ? "opacity-100" : "opacity-0",
              )}
            />
          ))}

          {/* Vergrößern liegt auf dem Bild, nicht daneben: Die Fläche, die man
              größer sehen will, ist auch die, auf die man tippt. Der Knopf ist
              trotzdem ein eigener Knopf und nicht das ganze Bild – sonst
              fängt er auf der Geräteseite jede Wischgeste ab. */}
          <button
            type="button"
            onClick={openZoom}
            aria-label={`Bild ${active + 1} von ${images.length} vergrößern`}
            className="absolute top-2 right-2 grid size-11 place-items-center rounded-full bg-ink/70 text-silver on-dark transition-colors duration-200 hover:bg-ink/90"
          >
            <Expand className="size-4" aria-hidden="true" />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Vorheriges Bild"
                className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/70 text-silver on-dark transition-colors duration-200 hover:bg-ink/90"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Nächstes Bild"
                className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/70 text-silver on-dark transition-colors duration-200 hover:bg-ink/90"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>

              <span
                aria-live="polite"
                className="tabular pointer-events-none absolute right-3 bottom-3 rounded-md bg-ink/75 px-2.5 py-1 text-xs text-silver on-dark"
              >
                {active + 1} / {images.length}
              </span>
            </>
          ) : null}
        </div>

        {thumbnails && images.length > 1 ? (
          <ul className="grid grid-cols-6 gap-2">
            {images.map((image, i) => (
              <li key={image.src}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Ansicht ${i + 1} zeigen`}
                  aria-current={i === active || undefined}
                  className={cn(
                    "relative block aspect-square w-full overflow-hidden rounded-sm bg-ink-700 transition-[opacity,outline-color] duration-200",
                    i === active
                      ? "outline-2 outline-offset-2 outline-neon"
                      : "opacity-55 outline-2 outline-offset-2 outline-transparent hover:opacity-100",
                  )}
                >
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Vollbild. `object-contain` statt `cover`: Hier geht es darum, das
          ganze Gerät zu sehen – ein Ausschnitt wäre genau das Gegenteil des
          Zwecks. Der Klick auf den Grund schließt, wie man es von jeder
          Bildansicht erwartet. */}
      <dialog
        ref={dialogRef}
        onClose={() => setZoomed(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeZoom();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          else if (event.key === "ArrowLeft") step(-1);
          else return;
          event.preventDefault();
        }}
        className="m-0 h-full max-h-none w-full max-w-none bg-ink/95 text-silver on-dark backdrop:bg-ink/80"
      >
        {zoomed ? (
          <div className="relative flex h-full w-full flex-col">
            <div className="relative min-h-0 flex-1">
              <Image
                src={images[active].src}
                alt={images[active].alt}
                fill
                sizes="100vw"
                className="object-contain p-4 md:p-10"
              />
            </div>

            <div className="flex items-center justify-center gap-4 px-4 pb-6">
              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Vorheriges Bild"
                    className="grid size-12 place-items-center rounded-full border border-current/25 transition-colors duration-200 hover:border-current/60"
                  >
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </button>
                  <span aria-live="polite" className="tabular text-sm">
                    {active + 1} / {images.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Nächstes Bild"
                    className="grid size-12 place-items-center rounded-full border border-current/25 transition-colors duration-200 hover:border-current/60"
                  >
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </button>
                </>
              ) : null}
            </div>

            <button
              type="button"
              onClick={closeZoom}
              aria-label="Vollbild schließen"
              className="absolute top-4 right-4 grid size-12 place-items-center rounded-full bg-ink/70 transition-colors duration-200 hover:bg-ink"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
