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
}: {
  className?: string;
  decorative?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src="/img/siegel-skope.png"
      width={1000}
      height={1000}
      priority={priority}
      /* Größter Einsatz ist derzeit `max-w-md` (448 px), auf Retina also
         896 px. `sizes` deckelt entsprechend, damit nicht die volle
         Kantenlänge ausgeliefert wird. */
      sizes="(min-width: 1024px) 28rem, 60vw"
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
