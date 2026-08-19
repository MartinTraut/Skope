/**
 * Der Erklärfilm, 35 Sekunden, ohne Ton.
 *
 * Kein eigener Abspieler und keine Client-Komponente: `<video controls>` ist
 * nativ tastaturbedienbar, kennt Vollbild und Geschwindigkeit, funktioniert
 * ohne JavaScript und sieht auf dem Telefon so aus, wie es dort überall
 * aussieht. Ein nachgebauter Abspieler müsste all das erst wieder herstellen
 * und wäre am Ende schlechter.
 *
 * `preload="none"` und ein Standbild als `poster`: Der Film wiegt 1,3 MB, das
 * Standbild 47 kB. Ohne die Angabe lädt Safari beim Seitenaufruf Teile der
 * Datei mit — für einen Film, den die meisten nicht starten, auf Mobilfunk.
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
        <span className="block max-w-2xl">{caption}</span>
      </figcaption>
    </figure>
  );
}
