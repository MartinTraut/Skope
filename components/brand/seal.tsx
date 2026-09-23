import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Das Skope-Qualitätssiegel.
 *
 * Vorher als Vektor nachgebaut, jetzt die vom Betreiber gelieferte Plakette:
 * gebürstetes Metall auf schwarzer Platte, Neonring, fünf Sterne über der
 * Gewährleistungszeile. Der Vektor konnte die Materialanmutung nicht
 * abbilden — und genau die ist hier die Aussage: ein Zeichen, das wie ein
 * angeschlagenes Prüfsiegel aussieht, nicht wie ein Icon.
 *
 * Die Vorlage liegt kreisrund freigestellt bei 1000 px (`public/img/
 * siegel-skope.png`); die schwarze Umgebung der Originaldatei ist entfernt,
 * damit das Siegel auf Silber wie auf Tinte auf seiner eigenen Fläche steht.
 * Ausgeliefert wird über `next/image`, also als WebP in der tatsächlich
 * angeforderten Größe.
 *
 * `decorative` für Einsätze, deren Aussage der umgebende Text bereits trägt –
 * sonst liest der Screenreader dieselbe Information zweimal vor.
 */
export function Seal({
  className,
  decorative = false,
  priority = false,
  sizes = "(min-width: 640px) 28rem, calc(100vw - 3rem)",
}: {
  className?: string;
  decorative?: boolean;
  priority?: boolean;
  /** Breite der Fläche, in der das Siegel steht. Siehe unten. */
  sizes?: string;
}) {
  return (
    <Image
      src="/img/siegel-skope.png"
      width={1000}
      height={1000}
      priority={priority}
      /* Der Deckel ist `max-w-md` (448 px) – aber nur, wo die Spalte so
         breit ist. Am Telefon ist sie es nie: Dort steht das Siegel in der
         vollen Spalte, gemessen 342 px bei 390 px Fensterbreite. Die feste
         Angabe `28rem` ließ den Browser dort trotzdem für 448 px wählen und
         bei dreifacher Pixeldichte 1344 statt 1026 px holen – rund ein
         Drittel Bild für nichts, auf der Breite, auf der es am meisten
         kostet. `min()` nimmt, was kleiner ist. */
      sizes={sizes}
      alt={
        decorative
          ? ""
          : "Skope-Qualitätssiegel: geprüft in eigener Werkstatt in Neuenstadt am Kocher, ein Jahr Gewährleistung"
      }
      aria-hidden={decorative || undefined}
      className={cn("h-auto w-full select-none", className)}
    />
  );
}
