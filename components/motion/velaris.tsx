"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Bewegter Hintergrund für den Seitenkopf — geschichtetes Simplex-Rauschen,
 * Vignette und Filmkorn.
 *
 * Nachgebaut statt eingekauft: Die Vorlage (Velaris, 21st.dev) liegt nicht
 * offen, ihre Bauteile sind aber benannt. Der Nachbau hat zwei handfeste
 * Vorteile gegenüber einer fertigen Komponente aus der lokalen Bibliothek –
 * er braucht kein `ogl` als Abhängigkeit (rohes WebGL sind hier sechzig
 * Zeilen), und die Farben kommen aus der Marke statt aus einem Demo-Preset.
 *
 * Über dieser Fläche steht silberner Text, der Shader darf trotzdem leuchten.
 * Beides zusammen geht nur, weil die Lesbarkeit nicht hier geregelt wird,
 * sondern ortsabhängig im Schleier darüber (`hero-scrim` in globals.css):
 * dicht über der Textspalte, offen über der Bildspalte.
 *
 * `prettier-ignore` an beiden Programmen ist kein Geschmack, sondern nötig:
 * Prettier greift in die Zeichenkette hinein und hat den Bindestrich in
 * einem GLSL-Kommentar schon einmal als Rechenzeichen umbrochen. Das Ergebnis
 * war ein Shader, der nicht mehr kompiliert – und ein TypeScript-Fehler an
 * einer ganz anderen Stelle.
 */
// prettier-ignore
const VERT = `attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

// prettier-ignore
const FRAG = `precision highp float;

uniform vec2 uRes;
uniform float uTime;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

/* Vier Oktaven reichen. Bei fünf ist der Zugewinn auf einer weichen Fläche
   nicht mehr sichtbar, die Füllrate steigt aber weiter. */
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * snoise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * (uRes.x / uRes.y), uv.y);

  float t = uTime * 0.055;

  float n1 = fbm(p * 1.15 + vec2(t, t * 0.60));
  float n2 = fbm(p * 2.30 - vec2(t * 0.80, t * 0.45) + 3.1);
  float n3 = snoise(p * 0.55 + vec2(-t * 0.40, t * 0.22));

  float mask = n1 * 0.55 + n2 * 0.30 + n3 * 0.45;
  mask = smoothstep(-0.15, 0.95, mask);

  /* Vier Stufen statt zwei. Der Kern ist das, was die Fläche „saftig" macht:
     eine kleine, sehr helle Zone in der Spitze des Rauschens, die als
     leuchtende Fahne über dem satteren Grün steht. Ohne sie bleibt es ein
     dunkler Verlauf, egal wie hoch man die mittlere Stufe zieht. */
  /* Die Rampe ist die Markenfarbe, abgedunkelt – nicht irgendein Gruen.
     Vorher lief sie ueber einen blaettrigen Ton (0.43, 0.82, 0.24), der neben
     dem Neon der Zahlen und des Siegels als zweites, schmutzigeres Gruen las.
     Jetzt teilen sich Grund und Akzent denselben Farbton: die Spitze ist
     exakt #9ef605, die beiden Stufen darunter sind derselbe Ton mit weniger
     Helligkeit. */
  vec3 base = vec3(0.031, 0.035, 0.043);
  vec3 deep = vec3(0.098, 0.160, 0.012);
  vec3 lit  = vec3(0.330, 0.530, 0.016);
  vec3 core = vec3(0.620, 0.965, 0.020);

  vec3 col = mix(base, deep, smoothstep(0.08, 0.55, mask));
  col = mix(col, lit, smoothstep(0.52, 0.90, mask));
  col = mix(col, core, smoothstep(0.86, 1.00, mask) * 0.75);

  /* Der Schein sitzt rechts oben, also hinter der Bildseite. Er ersetzt den
     vorherigen radialen Verlauf im Markup. */
  float glow = smoothstep(1.05, 0.15, distance(uv, vec2(0.86, 0.92)));
  col += lit * glow * 0.30;

  float vig = smoothstep(1.30, 0.30, distance(uv, vec2(0.5)));
  col *= mix(0.42, 1.0, vig);

  /* Der Deckel verhindert nur das Ausbrennen ins Weiße. Die Lesbarkeit haengt
     nicht mehr an ihm, sondern am Schleier ueber der Textspalte: Klasse
     hero_scrim in globals.css, dort geschrieben mit Bindestrich. Das ist die
     richtige Arbeitsteilung, der Grund darf leuchten, wo nichts steht. */
  col = min(col, core);

  float grain = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.022;

  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function Velaris({ className }: { className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      }) ?? null;

    // Kein WebGL, kein Drama: Darunter liegt der Verlauf aus dem Markup, und
    // die Sektion sieht ohne Bewegung immer noch so aus, wie sie soll.
    if (!gl) return;

    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Ein einzelnes Dreieck, das über den Bildschirmrand hinausragt – deckt
    // die Fläche mit drei Vertices statt vier ab und spart die Naht in der
    // Mitte, an der zwei Dreiecke sonst doppelt schattieren.
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");

    const draw = (seconds: number) => {
      gl.uniform1f(uTime, seconds);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    /* Auflösung gedeckelt. Das Bild ist eine weiche Wolke ohne harte Kante –
       oberhalb von 1,5 sieht man keinen Unterschied mehr, die Füllrate
       vervierfacht sich aber gegenüber 1,0. Auf einem Retina-Telefon ist das
       der Unterschied zwischen flüssig und warm. */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    let paused = false;
    let frozenAt = 0;

    resize();
    // Beim Umbau der Fläche steht kein neues Bild an, solange die Schleife
    // pausiert oder gar nicht erst läuft. Dann muss der letzte Zeitpunkt von
    // Hand nachgezeichnet werden, sonst bleibt die Fläche schwarz.
    const ro = new ResizeObserver(() => {
      resize();
      if (paused) draw(frozenAt);
    });
    ro.observe(canvas);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Bei reduzierter Bewegung ein einziges Bild – die Fläche bleibt, die
    // Bewegung geht. Kein rAF, keine dauerhafte GPU-Last.
    if (reduced.matches) {
      paused = true;
      frozenAt = 12;
      draw(frozenAt);
      return () => {
        ro.disconnect();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    let raf = 0;
    const started = performance.now();

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      frozenAt = (now - started) / 1000;
      draw(frozenAt);
    };

    /* Der Kopfbereich scrollt aus dem Bild. Ohne diesen Beobachter rechnet
       die GPU den Shader über die gesamte Seitenlänge weiter, für nichts. */
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        if (visible === !paused) return;
        paused = !visible;
        if (paused) cancelAnimationFrame(raf);
        else raf = requestAnimationFrame(loop);
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("block size-full", className)}
    />
  );
}
