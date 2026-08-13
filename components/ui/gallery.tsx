"use client";

import * as React from "react";
import Image from "next/image";

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
 * Die Vorschaubilder sind Knöpfe, keine Punkte: Wer sieht, was hinter der
 * dritten Position liegt, klickt gezielt. Pfeiltasten bedienen dieselbe
 * Auswahl, damit die Galerie ohne Maus vollständig ist.
 */
export function Gallery({
  images,
  className,
}: {
  images: InventoryImage[];
  className?: string;
}) {
  const [active, setActive] = React.useState(0);

  const step = (delta: number) =>
    setActive((i) => (i + delta + images.length) % images.length);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
    else return;
    event.preventDefault();
  };

  return (
    <div className={className}>
      {/* 3:4 ist das native Seitenverhältnis der Aufnahmen (720 x 960).
          Jeder andere Rahmen würde den Roller oben oder unten anschneiden. */}
      <div
        role="group"
        aria-label="Bilder des Geräts"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative aspect-[3/4] overflow-hidden rounded-lg bg-ink-700"
      >
        {images.map((image, i) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            aria-hidden={i === active ? undefined : "true"}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            priority={i === 0}
            className={cn(
              "object-cover transition-opacity duration-300 motion-reduce:transition-none",
              i === active ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        <span className="tabular pointer-events-none absolute right-3 bottom-3 rounded-md bg-ink/75 px-2.5 py-1 text-xs text-silver on-dark">
          {active + 1} / {images.length}
        </span>
      </div>

      {/* Ein Raster über die volle Spaltenbreite, keine Scrollleiste: Bei
          fester Vorschaubreite lag die sechste Aufnahme angeschnitten am
          Rand, und ein angeschnittenes Bild liest sich als Fehler, nicht als
          Hinweis auf mehr. Sechs Spalten passen bei 390 px mit 45 px pro
          Knopf – über der Mindestgröße für Finger. */}
      <ul className="mt-3 grid grid-cols-6 gap-2">
        {images.map((image, i) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={image.alt}
              aria-current={i === active ? "true" : undefined}
              className={cn(
                "relative block aspect-[3/4] w-full overflow-hidden rounded-md transition-opacity duration-200",
                "outline-offset-2",
                i === active
                  ? "opacity-100 ring-2 ring-accent"
                  : "opacity-55 hover:opacity-100",
              )}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
