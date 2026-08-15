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

/* Zwei Oktaven, nicht vier.
   Vier Oktaven waren der Grund, warum die Flaeche wie Rauch aussah: Die
   dritte und vierte Lage bringen feine, gedrehte Schlieren, und genau die
   liest das Auge als Qualm. Milchiges Licht hat keine Feinstruktur, es hat
   grosse weiche Zonen. Die zweite Lage bleibt, damit die Flaeche nicht zu
   einem gleichfoermigen Verlauf einschlaeft. */
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 2; i++) {
    v += a * snoise(p);
    p *= 1.85;
    a *= 0.45;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * (uRes.x / uRes.y), uv.y);

  /* Zwei Zeiten, nicht eine.
     Das Rauschfeld darf langsam bleiben – es ist der Grund, kein Ereignis.
     Die Lichter darueber laufen dreimal so schnell, und erst daran sieht man
     ueberhaupt, dass sich etwas bewegt. Vorher hing alles an einer Zeit: Bei
     einer Geschwindigkeit, die als Licht noch ruhig aussah, stand das Bild
     praktisch still. */
  float t = uTime * 0.038;
  float tl = uTime * 0.115;

  /* Zwei grosse Felder statt drei gestapelter Rauschlagen. Die Frequenzen
     liegen dicht beieinander und beide tief: Was entsteht, sind breite
     Zonen, die ineinanderlaufen, keine Faeden. */
  float n1 = fbm(p * 0.70 + vec2(t, t * 0.55));
  float n2 = fbm(p * 1.15 - vec2(t * 0.62, t * 0.28) + 4.3);

  float mask = n1 * 0.62 + n2 * 0.38;
  mask = clamp(mask * 0.75 + 0.5, 0.0, 1.0);
  /* Zweimal glaetten: einmal die Flanken breit ziehen, einmal die Kurve
     selbst weichzeichnen. Harte Uebergaenge sind das zweite Rauchmerkmal. */
  mask = smoothstep(0.16, 0.94, mask);
  mask = mask * mask * (3.0 - 2.0 * mask);

  /* Die Rampe ist die Markenfarbe, abgedunkelt – nicht irgendein Gruen.
     Die Spitze ist exakt #9ef605, die Stufen darunter sind derselbe Ton mit
     weniger Helligkeit.

     Die Stufen ueberlappen jetzt stark: Jede Mischung beginnt, bevor die
     vorherige zu Ende ist. Dadurch gibt es keine sichtbare Kante zwischen
     zwei Farbzonen mehr – das Gruen wird heller, statt umzuspringen. */
  vec3 base = vec3(0.031, 0.035, 0.043);
  vec3 deep = vec3(0.140, 0.245, 0.014);
  vec3 lit  = vec3(0.430, 0.680, 0.020);
  vec3 core = vec3(0.620, 0.965, 0.020);

  vec3 col = mix(base, deep, smoothstep(0.00, 0.62, mask));
  col = mix(col, lit, smoothstep(0.34, 0.96, mask));
  col = mix(col, core, smoothstep(0.70, 1.00, mask) * 0.55);

  /* Zwei wandernde Lichter auf weiten, unterschiedlich langen Bahnen.
     Beide laufen mit eigener Frequenz, damit sich das Muster nicht nach ein
     paar Sekunden wiederholt – ein sichtbarer Takt waere schlimmer als
     Stillstand.

     Das helle Licht haelt sich in der rechten Haelfte auf, also hinter der
     Bildseite. Das zweite ist deutlich schwaecher und laeuft gegenlaeufig
     durch die linke Haelfte: Es traegt die Bewegung dorthin, wo der
     Schleier ueber der Textspalte ohnehin fast alles abdeckt, ohne die
     Lesbarkeit anzutasten. */
  vec2 lp = vec2(0.78 + 0.20 * sin(tl), 0.80 + 0.17 * cos(tl * 0.73));
  float glow = smoothstep(1.05, 0.02, distance(uv, lp));
  col += lit * glow * 0.55;

  vec2 lp2 = vec2(0.24 - 0.20 * cos(tl * 0.61), 0.34 + 0.19 * sin(tl * 0.87));
  col += deep * smoothstep(0.85, 0.05, distance(uv, lp2)) * 1.10;

  float vig = smoothstep(1.30, 0.30, distance(uv, vec2(0.5)));
  col *= mix(0.52, 1.0, vig);

  col = min(col, core);

  /* Nur noch halb so viel Korn, und es ist kein Stilmittel mehr, sondern
     Dither: Ohne die Stoerung zeigen so weiche Verlaeufe in 8 Bit sichtbare
     Streifen. Als Filmkorn gelesen hat es die Flaeche zusaetzlich schmutzig
     wirken lassen. */
  float grain = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.010;

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

    /* Scheitert irgendetwas an der Grafikkarte, verschwindet die Fläche und
       das Standbild darunter übernimmt. Das ist wichtiger, als es klingt:
       Mit `alpha: false` ist die Fläche deckend, auch wenn nie ein Bild
       gezeichnet wurde. Ein gescheiterter Shader liefert dann keinen leeren
       Bereich, sondern einen deckenden Kader vor dem Ersatz. */
    const giveUp = () => {
      canvas.style.visibility = "hidden";
    };

    /* Ein früherer Durchlauf kann die Fläche ausgeblendet haben – React
       verwendet dasselbe <canvas> beim Seitenwechsel weiter, und ein von Hand
       gesetzter Inline-Stil überlebt das Wiedereinhängen. Ohne dieses
       Zurücksetzen bleibt die Fläche für den Rest der Sitzung verborgen. */
    canvas.style.visibility = "";

    const gl =
      canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      }) ?? null;

    // Kein WebGL, kein Drama: Darunter liegt `velaris-still`, und die Sektion
    // sieht ohne Bewegung immer noch so aus, wie sie soll.
    if (!gl) return giveUp();

    /* Die Leerfarbe ist der Grundton des Shaders, nicht Schwarz.
       Ein frisch angelegter Kontext wird mit (0,0,0,0) geleert; bei
       `alpha: false` setzt der Compositor das als deckendes Schwarz. Zwischen
       Kontext und erstem Bild liegt damit ein Kader, der weder zum Shader
       noch zum Standbild darunter passt. Verliert der Kontext später den
       Speicher, ist es derselbe Kader – nur dauerhaft. */
    gl.clearColor(0.031, 0.035, 0.043, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return giveUp();

    const program = gl.createProgram();
    if (!program) return giveUp();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return giveUp();
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

    /* Aufräumen heißt hier: die eigenen Objekte löschen, nicht den Kontext
       wegwerfen.

       Vorher stand in beiden Abräumern `WEBGL_lose_context.loseContext()`.
       Das war als Rückgabe von Grafikspeicher gedacht und hat den bewegten
       Grund beim Seitenwechsel zuverlässig abgeschaltet: Beim Wechsel über
       einen Link im Seitenkopf hängt React dieselbe <canvas> weiter – gleicher
       Typ, gleiche Stelle im Baum –, führt aber den Abräumer der alten Seite
       aus. Der Kontext war danach verloren; `getContext` auf demselben Element
       liefert dann kein neues Objekt, sondern das verlorene zurück, und der
       nachgereichte `webglcontextlost` blendet die Fläche über `giveUp` aus.
       Gemessen: nach Reload `isContextLost() === false`, nach einem Klick auf
       einen Menüpunkt `true` und `visibility: hidden` – bis zum nächsten
       Neuladen.

       Wird die Fläche wirklich aus dem Baum genommen, räumt der Browser den
       Kontext mit dem Element ab. Wird sie weiterverwendet, ist es genau
       richtig, ihn zu behalten: Der nächste Durchlauf baut Programm und Puffer
       darauf neu auf, statt einen zweiten Kontext zu eröffnen. */
    const release = () => {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };

    const draw = (seconds: number) => {
      gl.uniform1f(uTime, seconds);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    /* Auflösung gedeckelt. Das Bild ist eine weiche Wolke ohne harte Kante –
       oberhalb von 1,5 sieht man keinen Unterschied mehr, die Füllrate
       vervierfacht sich aber gegenüber 1,0. Auf einem Retina-Telefon ist das
       der Unterschied zwischen flüssig und warm. */
    /* Der Puffer wird nur bei echter Änderung neu angelegt, Sichtfeld und
       Auflösungs-Uniform werden aber jedes Mal gesetzt.

       Das ist der zweite Teil des Seitenwechsel-Fehlers. Uniforms hängen am
       Programm, nicht am Kontext, und beim Wechsel über einen Menüpunkt baut
       dieser Effekt ein neues Programm auf derselben weiterverwendeten
       <canvas> auf. Hatte die Fläche danach exakt dieselben Maße – bei zwei
       Unterseiten mit gleich hohem Seitenkopf die Regel –, sprang der frühere
       vorzeitige Ausstieg heraus, bevor `uRes` gesetzt war. `uRes` blieb also
       (0, 0), im Shader wurde durch null geteilt, und übrig blieb eine
       Fläche ohne Wanderlichter. Erst ein Neuladen änderte die Puffergröße
       und setzte das Uniform wieder. */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
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
        release();
      };
    }

    let raf = 0;
    /* Zwölf Sekunden Vorlauf, damit jedes Neuladen mitten im Bild einsteigt
       und nicht am Anfang.

       Bei `uTime = 0` stehen beide Wanderlichter am Scheitel ihrer Bahnen –
       `sin(0) = 0`, `cos(0) = 1` –, und das Rauschfeld liegt in seiner
       ungewanderten Ausgangslage. Das ist der hellste und flächigste Zustand,
       den der Shader kennt, und genau der stand bisher bei jedem Neuladen
       einen Moment lang da, bevor die Bewegung ihn auseinanderzog.

       Zwölf Sekunden sind keine runde Zahl aus dem Nichts: Es ist derselbe
       Zeitpunkt, den die Fläche bei `prefers-reduced-motion` als Standbild
       zeigt (`frozenAt = 12` weiter oben). Bewegter und stehender Grund
       starten damit im selben Bild. */
    const started = performance.now() - 12_000;

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

    /* Der Browser darf den Kontext jederzeit einziehen – beim Aufwachen aus
       dem Ruhezustand, beim Wechsel der Grafikeinheit, wenn zu viele Flächen
       gleichzeitig offen sind. Ohne diesen Zuhörer bleibt danach genau das
       stehen, was der Compositor zuletzt hatte: eine tote, oft graue Fläche,
       die aussieht wie ein Fehler im Entwurf. Mit ihm fällt die Sektion auf
       das Standbild zurück, und der Unterschied ist, dass es nicht mehr
       wabert. */
    const onLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(raf);
      giveUp();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", onLost);
      io.disconnect();
      ro.disconnect();
      release();
    };
  }, []);

  /* Das Standbild liegt hinter der Fläche, nicht daneben, und gehört zu
     dieser Komponente statt zu jeder Sektion, die sie einsetzt. Sonst hätte
     der Hero eine Absicherung und der Kopf einer Unterseite keine – und
     genau das fällt erst auf dem Rechner auf, auf dem WebGL streikt. */
  return (
    <div className={cn("relative block size-full", className)}>
      <div aria-hidden="true" className="velaris-still absolute inset-0" />
      <canvas
        ref={ref}
        aria-hidden="true"
        className="absolute inset-0 size-full"
      />
    </div>
  );
}
