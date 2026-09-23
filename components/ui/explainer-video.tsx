import { generatedVideoNotice } from "@/lib/data/generated-images";

/**
 * Der Erklärfilm, 35 Sekunden, ohne Ton.
 *
 * Kein eigener Abspieler und keine Client-Komponente: `<video controls>` ist
 * nativ tastaturbedienbar, kennt Vollbild und Geschwindigkeit, funktioniert
 * ohne JavaScript und sieht auf dem Telefon so aus, wie es dort überall
 * aussieht. Ein nachgebauter Abspieler müsste all das erst wieder herstellen
 * und wäre am Ende schlechter.
 *
 * `preload="none"` und ein Standbild als `poster`: Der Film wiegt 2,7 MB, das
 * Standbild 80 kB. Ohne die Angabe lädt Safari beim Seitenaufruf Teile der
 * Datei mit — für einen Film, den die meisten nicht starten, auf Mobilfunk.
 *
 * Beide Dateien sind am 02.09.2026 neu aus dem Schnitt gezogen worden, weil
 * der Film sichtbar unscharf war: Er lag bei 292 kbit/s für 1280 × 720 (CRF 27),
 * gemessen 0,9958 SSIM gegen das Original – bei Schrifttafeln vor dunklem
 * Grund verschmieren dort die Kanten. Jetzt CRF 20, 626 kbit/s, 0,9985. Das
 * Standbild war zusätzlich aus der komprimierten Fassung gezogen und hat deren
 * Weichheit geerbt; es kommt jetzt aus dem Schnitt (Sekunde 3,6, q:v 2).
 *
 * Bewusst kein Autoplay-Loop im Hintergrund: Der Film erklärt mit Schrifttafeln
 * und will gelesen werden. Als Deko hinter Text wäre er beides nicht.
 *
 * Er hat keine Tonspur, deshalb braucht er keine Untertitel — wohl aber eine
 * Textalternative für alle, die ihn nicht sehen können. Die steht sichtbar in
 * der Bildunterschrift, nicht versteckt in einem Attribut: Sie ist auch für
 * jemanden nützlich, der gerade nicht 35 Sekunden hat.
 */
export function ExplainerVideo({
  className,
  caption,
}: {
  className?: string;
  caption: React.ReactNode;
}) {
  return (
    <figure className={className}>
      {/* Deckel bei 70rem (1120 px): Die Quelle ist 1280 px breit, darüber
          würde der Film hochskaliert und die Schrifttafeln würden weich. */}
      <div className="lift mx-auto max-w-[70rem] overflow-hidden rounded-2xl bg-ink">
        <video
          className="block aspect-video w-full"
          controls
          playsInline
          preload="none"
          poster="/img/erklaervideo-poster.jpg"
          aria-label="Erklärfilm: E-Scooter reparieren statt neu kaufen. 35 Sekunden, ohne Ton."
        >
          <source src="/video/skope-erklaervideo.mp4" type="video/mp4" />
          Ihr Browser kann dieses Video nicht abspielen.{" "}
          <a href="/video/skope-erklaervideo.mp4">Datei direkt öffnen</a>.
        </video>
      </div>
      {/* Die Zeile läuft nicht über die Breite des Films: Bei 1120 px stehen
          dort rund 130 Zeichen je Zeile, das Doppelte des Lesbaren. */}
      <figcaption className="mx-auto mt-5 max-w-[70rem] text-sm leading-relaxed text-current/70">
        <span className="block max-w-2xl">
          {/* Die Textalternative steht seit dem 23.09.2026 nur noch für
              Screenreader im Baum, nicht mehr im Bild – auf Ansage. Sie
              beschrieb in vier Zeilen den Inhalt eines Films, der direkt
              darüber steht und sich in 35 Sekunden selbst erklärt. Sie ganz zu
              streichen geht nicht: Der Film hat keine Tonspur, also gibt es
              für jemanden, der ihn nicht sehen kann, sonst nichts. */}
          <span className="sr-only">{caption} </span>
          {/* Die Offenlegung bleibt sichtbar. Sie gehört zum Film, nicht zur
              Seite, und Art. 50 Abs. 4 verlangt sie ohne Tippen und ohne
              Aufklappen – ein `sr-only` wäre hier genau die Fußnote, die die
              Vorschrift ausschließt. */}
          <span className="text-current/50">{generatedVideoNotice}.</span>
        </span>
      </figcaption>
    </figure>
  );
}
