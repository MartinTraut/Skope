"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Ein Lichtpunkt, der die Kante einer Fläche umläuft.
 *
 * Nach „Border Beam Panel" von Motiq (MIT), auf das SKOPE-System umgebaut:
 * eigene Farbtoken statt der mitgelieferten `--motiq-*`, `cn` aus dem Projekt,
 * und alles entfernt, was hier keine Aufgabe hat.
 *
 * Warum überhaupt: Auf Schwarz kann eine Fläche nicht durch Abdunkeln
 * hervortreten. Ein Schlagschatten auf schwarzem Grund ist per Definition
 * unsichtbar – bleibt nur Licht. Der Ring ist deshalb kein Zierrat, sondern
 * der Tiefenhinweis, den der Schatten auf hellem Grund gibt.
 *
 * Technik, weil sie nicht offensichtlich ist:
 * - Der Ring ist ein rotierender `conic-gradient`, ausgestanzt über eine
 *   zweilagige CSS-Alphamaske mit `mask-composite: exclude`. SVG-Masken
 *   scheiden aus – Luminanzmasken greifen in Chromium still nicht.
 * - Gesprungen ist die *Geschwindigkeit*, nicht der Winkel. Deshalb läuft der
 *   Punkt beim Überfahren an und trudelt danach aus, statt zwischen zwei
 *   Tempi umzuschalten.
 * - Pro Bild ändert sich genau eine Custom Property. Der Inhalt der Fläche
 *   wird dabei nie neu gezeichnet.
 * - Der Startwinkel ist aus `seed` gerechnet, nicht aus `Math.random()`:
 *   Sonst lieferten Server und Client verschiedene Werte und React meldete
 *   einen Hydration-Fehler.
 */

export interface BorderBeamPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Ein umlaufender Punkt oder zwei gegenüberliegende. */
  beams?: 1 | 2;
  /** Ringstärke in px. */
  thickness?: number;
  /** Ruhegeschwindigkeit in Grad pro Sekunde. */
  idleSpeed?: number;
  /** Geschwindigkeit bei Hover und Fokus – die Feder zieht dorthin. */
  hoverSpeed?: number;
  /** Weichgezeichnete Kopie des Rings dahinter, liest sich als Streulicht. */
  glow?: boolean;
  /** Eckradius in px. Muss zur Fläche darunter passen. */
  radius?: number;
  /** Fester Startwinkel, damit Server und Client dasselbe rendern. */
  seed?: number;
}

/** Ruhewinkel bei reduzierter Bewegung – beide Punkte auf sichtbaren Kanten. */
const PARKED_ANGLE = 40;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));

/**
 * Feder auf der Geschwindigkeit, nicht auf dem Winkel. Von Hand gerechnet,
 * damit die Komponente ohne Animationsbibliothek auskommt.
 */
class Spring {
  x: number;
  v = 0;
  target: number;
  constructor(
    value: number,
    public k: number,
    public d: number,
  ) {
    this.x = value;
    this.target = value;
  }
  step(dt: number): number {
    const a = this.k * (this.target - this.x) - this.d * this.v;
    this.v += a * dt;
    this.x += this.v * dt;
    return this.x;
  }
}

/**
 * Ein Komet: ein rund 45° langer Schweif, der in einen 4° kurzen hellen Kopf
 * ausläuft. Der Ansatz nutzt 4 % der Farbe statt `transparent` – `transparent`
 * ist rgba(0,0,0,0), und eine Kegelrampe durch diesen Wert kippt sichtbar
 * ins Graue.
 */
function comet(color: string, tip: string, start: number): string {
  return [
    `color-mix(in srgb, ${color} 4%, transparent) ${start + 18}deg`,
    `color-mix(in srgb, ${color} 55%, transparent) ${start + 46}deg`,
    `${color} ${start + 56}deg`,
    `${tip} ${start + 60}deg`,
    `transparent ${start + 63}deg`,
  ].join(", ");
}

function ringGradient(beams: 1 | 2): string {
  const neon = "var(--color-neon)";
  const tip = "var(--color-neon-300)";
  const stops = ["transparent 0deg", comet(neon, tip, 0)];
  if (beams === 2) stops.push("transparent 198deg", comet(neon, tip, 198));
  stops.push("transparent 360deg");
  return `conic-gradient(from var(--beam-angle, 0deg), ${stops.join(", ")})`;
}

export function BorderBeamPanel({
  children,
  beams = 2,
  thickness = 2,
  idleSpeed = 42,
  hoverSpeed = 240,
  glow = true,
  radius = 20,
  seed = 1,
  className,
  style,
  ...props
}: BorderBeamPanelProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `beam-${uid}`;
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  /* `useSyncExternalStore` statt State plus Effect: Der Serverschnappschuss ist
     fest `false`, der Client liest die echte Einstellung. React gleicht die
     Differenz nach der Hydration selbst ab – mit einem `setState` im Effect
     wäre derselbe Ablauf ein Umweg über einen ungültigen Zwischenzustand. */
  const reduced = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
  const [onScreen, setOnScreen] = React.useState(true);

  /* Außerhalb des Sichtfelds läuft keine Schleife. Ohne das drehte der Ring
     auch dann pro Bild weiter, wenn er zehn Bildschirme weiter oben steht. */
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const startAngle = React.useMemo(
    () => (((seed * 137.508) % 360) + 360) % 360,
    [seed],
  );

  const speedRef = React.useRef(new Spring(idleSpeed, 30, 11));
  const angleRef = React.useRef(startAngle);
  /* Die Zielgeschwindigkeiten liegen in einem Ref, damit die Schleife sie
     lesen kann, ohne bei jeder Änderung neu aufgesetzt zu werden. Geschrieben
     wird im Effect, nicht im Render – ein Ref während des Renderns zu ändern
     ist in React 19 ein Fehler und nicht bloß unsauber. */
  const speeds = React.useRef({ idleSpeed, hoverSpeed });
  React.useEffect(() => {
    speeds.current = { idleSpeed, hoverSpeed };
  }, [idleSpeed, hoverSpeed]);

  const paint = React.useCallback((angle: number) => {
    rootRef.current?.style.setProperty(
      "--beam-angle",
      `${(((angle % 360) + 360) % 360).toFixed(2)}deg`,
    );
  }, []);

  React.useEffect(() => {
    if (reduced) {
      angleRef.current = PARKED_ANGLE;
      paint(PARKED_ANGLE);
      return;
    }
    if (!onScreen) return;
    let raf = 0;
    let last = 0;
    const frame = (now: number) => {
      if (!last) last = now;
      const dt = clamp((now - last) / 1000, 0, 0.05);
      last = now;
      angleRef.current += speedRef.current.step(dt) * dt;
      paint(angleRef.current);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduced, onScreen, paint]);

  const surge = () => {
    speedRef.current.target = speeds.current.hoverSpeed;
  };
  const settle = () => {
    speedRef.current.target = speeds.current.idleSpeed;
  };

  const gradient = React.useMemo(() => ringGradient(beams), [beams]);

  const css = `
.${cls} .beam-ring, .${cls} .beam-glow {
  position: absolute;
  inset: -1px;
  border-radius: ${radius}px;
  pointer-events: none;
  background: ${gradient};
}
.${cls} .beam-ring {
  padding: ${Math.max(1, thickness)}px;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
}
.${cls} .beam-glow { filter: blur(16px); opacity: 0.4; z-index: -1; }
/* Im Kontrastmodus des Betriebssystems ersetzt eine echte Kante den Ring. */
@media (forced-colors: active) {
  .${cls} .beam-ring, .${cls} .beam-glow { display: none; }
  .${cls} { border: 1px solid CanvasText; }
}`.trim();

  return (
    <div
      ref={rootRef}
      onPointerEnter={surge}
      onPointerLeave={settle}
      onFocus={surge}
      onBlur={settle}
      className={cn("relative", cls, className)}
      style={{
        borderRadius: `${radius}px`,
        isolation: "isolate",
        ["--beam-angle" as string]: `${startAngle.toFixed(2)}deg`,
        ...style,
      }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {glow ? <div aria-hidden="true" className="beam-glow" /> : null}
      <div aria-hidden="true" className="beam-ring" />
      {children}
    </div>
  );
}
