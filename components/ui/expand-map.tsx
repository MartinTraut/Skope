"use client";

import * as React from "react";

import { ShaderBackground } from "@/components/ui/green-border";
import { cn } from "@/lib/utils";

/**
 * Aufklappbare Lageskizze — Vorlage: „expand-map" (21st.dev).
 *
 * Vier Dinge sind gegenüber der Vorlage anders, und keines davon ist Geschmack:
 *
 * 1. Ohne `framer-motion`. Die Vorlage bringt die Bibliothek als Abhängigkeit
 *    mit; im Projekt ist `motion` zwar in der package.json, wird aber von
 *    keiner Komponente importiert und landet damit heute in keinem Bündel.
 *    Für eine Karte auf einer Seite rund 35 kB Laufzeit auszuliefern, lohnt
 *    nicht — Neigung, Aufklappen und der Aufbau der Skizze laufen hier über
 *    CSS-Übergänge und zwei Custom Properties. Verhalten identisch.
 * 2. Feste Pixelmaße raus. Die Vorlage animiert 240 → 360 px Breite; auf
 *    einem 320-px-Gerät steht die Karte damit über den Rand hinaus. Hier
 *    füllt sie ihre Spalte und animiert nur die Höhe.
 * 3. Kein „Live"-Punkt. Der grüne Blinkpunkt der Vorlage behauptet eine
 *    Echtzeitverbindung, hinter der nichts steht.
 * 4. Es heißt Lageskizze, nicht Karte. Das Straßenraster ist schematisch und
 *    bildet Neuenstadt nicht ab. Wer wirklich hin will, nimmt den Link
 *    darunter; die Skizze zeigt, dass es einen festen Ort gibt, und
 *    behauptet nicht, der Weg dorthin zu sein.
 *
 * Die Neigung folgt dem Zeiger nur auf Geräten mit Zeiger. Auf dem Telefon
 * gibt es sie nicht — dort trägt der Fingertipp das Aufklappen, und ein
 * Kippeffekt am Scrollfinger wäre nur Unruhe.
 */
export function LocationMap({
  location,
  coordinates,
  href,
  frame = false,
  className,
}: {
  location: string;
  coordinates: string;
  href?: string;
  /** Pulsierender Shader-Rand hinter der Karte. */
  frame?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLButtonElement>(null);

  const onPointerMove = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // ±8 Grad, wie in der Vorlage: genug für Tiefe, zu wenig, um die Schrift
    // schräg zu stellen. Der Nenner ist die halbe Kantenlänge, damit der
    // Ausschlag an der Kante voll ist und in der Mitte null.
    const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y =
      (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    ref.current.style.setProperty("--tilt-y", `${x * 8}deg`);
    ref.current.style.setProperty("--tilt-x", `${y * -8}deg`);
  };

  const resetTilt = () => {
    ref.current?.style.setProperty("--tilt-x", "0deg");
    ref.current?.style.setProperty("--tilt-y", "0deg");
  };

  /* Die Striche zeichnen sich über `stroke-dashoffset`. `pathLength="1"`
     normiert jede Linie auf die Länge 1, damit ein einziger Dash-Wert für
     alle gilt – ohne das Attribut müsste jede Linie ihre eigene Länge
     kennen. */
  const road = (delay: number) => ({
    strokeDasharray: 1,
    strokeDashoffset: open ? 0 : 1,
    transition: `stroke-dashoffset .55s var(--ease-out-expo) ${delay}ms`,
  });

  const block = (delay: number) => ({
    transitionDelay: `${delay}ms`,
  });

  return (
    <div className={className}>
      {/* Der Shader-Rahmen sitzt in derselben schwarzen Fläche wie die Karte,
          der Hinweis darunter steht bewusst außerhalb: Auf dem pulsierenden
          Rand gemessen fiel seine Schrift unter jede lesbare Schwelle – ein
          Hinweis, den man nur zwischen zwei Pulsen lesen kann, ist keiner. */}
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-ink p-3 [perspective:1000px]",
          frame && "p-4",
        )}
      >
        {frame ? (
          <ShaderBackground className="pointer-events-none absolute inset-0" />
        ) : null}
        <button
          ref={ref}
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          onPointerMove={onPointerMove}
          onPointerLeave={resetTilt}
          onBlur={resetTilt}
          className={cn(
            "group relative z-10 w-full overflow-hidden rounded-lg border border-current/12 bg-ink text-left text-silver on-dark",
            "transition-[height,transform] duration-[420ms] ease-[var(--ease-out-expo)] motion-reduce:transition-none",
            "[transform:rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))] [transform-style:preserve-3d]",
            open ? "h-72" : "h-36",
          )}
        >
          {/* Rasterflächen und Skizze liegen hinter dem Text, nie darüber. */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none",
              open ? "opacity-100" : "opacity-0",
            )}
          >
            <svg
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
            >
              {[
                { y: "35%", w: 4, o: 0.22, d: 120 },
                { y: "65%", w: 4, o: 0.22, d: 190 },
                { y: "20%", w: 1.5, o: 0.1, d: 320 },
                { y: "50%", w: 1.5, o: 0.1, d: 380 },
                { y: "80%", w: 1.5, o: 0.1, d: 440 },
              ].map((r) => (
                <line
                  key={`h-${r.y}`}
                  x1="0%"
                  y1={r.y}
                  x2="100%"
                  y2={r.y}
                  pathLength={1}
                  stroke="currentColor"
                  strokeOpacity={r.o}
                  strokeWidth={r.w}
                  style={road(r.d)}
                />
              ))}
              {[
                { x: "30%", w: 3, o: 0.18, d: 240 },
                { x: "70%", w: 3, o: 0.18, d: 280 },
                { x: "15%", w: 1.5, o: 0.09, d: 400 },
                { x: "50%", w: 1.5, o: 0.09, d: 460 },
                { x: "85%", w: 1.5, o: 0.09, d: 520 },
              ].map((r) => (
                <line
                  key={`v-${r.x}`}
                  x1={r.x}
                  y1="0%"
                  x2={r.x}
                  y2="100%"
                  pathLength={1}
                  stroke="currentColor"
                  strokeOpacity={r.o}
                  strokeWidth={r.w}
                  style={road(r.d)}
                />
              ))}
            </svg>

            {/* Baublöcke: nur so viele, dass das Raster bewohnt wirkt. */}
            {[
              "top-[40%] left-[10%] h-[20%] w-[15%]",
              "top-[15%] left-[35%] h-[15%] w-[12%]",
              "top-[68%] left-[74%] h-[18%] w-[18%]",
              "top-[20%] right-[10%] h-[25%] w-[10%]",
              "top-[8%] left-[74%] h-[10%] w-[14%]",
            ].map((pos, i) => (
              <span
                key={pos}
                className={cn(
                  "absolute rounded-xs border border-current/10 bg-current/12 transition-all duration-300 motion-reduce:transition-none",
                  pos,
                  open ? "scale-100 opacity-100" : "scale-90 opacity-0",
                )}
                style={block(300 + i * 60)}
              />
            ))}

            {/* Der Punkt sitzt in der Mitte, weil die Skizze um ihn herum
              gebaut ist – er ist die einzige Stelle mit Aussage. */}
            <span
              className={cn(
                "absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon transition-transform duration-500 ease-[var(--ease-out-expo)] delay-200 motion-reduce:transition-none",
                open ? "scale-100" : "scale-0",
              )}
            />
            <span
              className={cn(
                "absolute top-1/2 left-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon/40 transition-opacity duration-500 delay-300 motion-reduce:transition-none",
                open ? "opacity-100" : "opacity-0",
              )}
            />
            {/* Zwei Schleier statt einem: Der untere trägt Adresse und
              Koordinaten, der obere die Zeile „Lageskizze" – ohne ihn liegt
              sie auf einem der Baublöcke. */}
            <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
            <span className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-ink to-transparent" />
          </span>

          <span className="relative flex h-full flex-col justify-between p-5">
            <span className="flex items-start justify-between gap-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-[18px] text-neon"
              >
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" x2="9" y1="3" y2="18" />
                <line x1="15" x2="15" y1="6" y2="21" />
              </svg>
              <span className="eyebrow text-current/60">Lageskizze</span>
            </span>

            <span className="block">
              <span className="block font-display text-sm font-bold">
                {location}
              </span>
              <span
                className={cn(
                  "tabular block overflow-hidden text-xs text-current/65 transition-all duration-300 motion-reduce:transition-none",
                  open ? "mt-1 max-h-6 opacity-100" : "max-h-0 opacity-0",
                )}
              >
                {coordinates}
              </span>
              {/* Die Linie ist der einzige Hinweis darauf, dass hier etwas
                passiert, solange die Karte zu ist. */}
              <span
                className={cn(
                  "mt-3 block h-px origin-left bg-gradient-to-r from-neon/70 to-transparent transition-transform duration-[400ms] ease-out motion-reduce:transition-none",
                  open ? "scale-x-100" : "scale-x-30 group-hover:scale-x-100",
                )}
              />
            </span>
          </span>
        </button>
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-current/60">
        <span>
          {open ? "Nochmal tippen schließt die Skizze" : "Antippen zum Öffnen"}
        </span>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-colors hover:text-current"
          >
            Route öffnen
          </a>
        ) : null}
      </p>
    </div>
  );
}
