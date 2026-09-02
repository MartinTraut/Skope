import { ArrowUpRight } from "lucide-react";

import { GoogleMark } from "@/components/brand/google-mark";
import { Reveal } from "@/components/motion/reveal";
import { Marquee } from "@/components/ui/marquee";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { initials, Stars } from "@/components/ui/stars";
import { testimonials, type Testimonial } from "@/lib/data/testimonials";
import { getGoogleRating } from "@/lib/google-rating";
import { site } from "@/lib/site";
import { cn, noBreak } from "@/lib/utils";
import { Mark } from "@/components/ui/mark";

/**
 * Rezensionen als laufendes Band.
 *
 * Vorher standen die drei Stimmen als drei gleich hohe Spalten nebeneinander,
 * getrennt von Haarlinien. Das war ordentlich und vollkommen unauffällig: drei
 * Textblöcke im Raster der Seite, die man beim Scrollen für einen weiteren
 * Absatz hält. Rezensionen sind aber kein Fließtext, sondern Belege – sie
 * müssen als eigene Sorte Inhalt erkennbar sein, bevor man sie liest.
 *
 * Deshalb jetzt Karten in Tinte auf der silbernen Fläche, die ohne Halt
 * durchlaufen. Die Bewegung leistet zweierlei: Sie zeigt auf einen Blick, dass
 * es mehr als eine Stimme gibt, und sie hebt den Block aus der Ruhe der
 * umliegenden Sektionen heraus.
 *
 * Zu den Farben, die hier von der Hausregel abweichen: Gold für die Sterne
 * und das vierfarbige Google-Zeichen sind keine neuen Markenfarben, sondern
 * ein Zitat. Genau in diesen Farben erkennt jeder eine Google-Rezension
 * wieder, und darum geht es an dieser Stelle – der Block soll nicht nach
 * SKOPE aussehen, sondern nach Beleg. Neon kommt hier deshalb gar nicht vor.
 *
 * Das Band hält nicht an, auch nicht beim Überfahren. Bei
 * `prefers-reduced-motion` steht es von vornherein still und wird von Hand
 * scrollbar – das bleibt, weil eine Dauerbewegung ohne Ausweg für Menschen
 * mit vestibulären Beschwerden den Inhalt unbenutzbar macht.
 */

function QuoteCard({
  quote,
  author,
  context,
  rating,
  className,
}: Testimonial & { className?: string }) {
  return (
    /* Feste Kartenbreite, nicht mitwachsend: Ein Laufband braucht ein
       gleichbleibendes Maß, sonst ruckelt die Schleife optisch, obwohl sie
       gleichmäßig läuft. 24rem ergibt rund 45 Zeichen je Zeile – kurz genug
       für ein Zitat im Vorbeigehen, lang genug, dass kein Satz zerfällt.

       Am Telefon gibt die Wischbahn das Maß vor (siehe unten), deshalb ist
       die Breite hier überschreibbar. */
    <figure
      className={cn(
        "lift flex shrink-0 flex-col rounded-lg bg-ink p-7 text-silver on-dark md:p-8",
        className ?? "w-[min(78vw,24rem)]",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <Stars rating={rating} />
        {/* Das Anführungszeichen in derselben Farbe wie die Sterne: Beides
            gehört zur Herkunft der Aussage, nicht zur Seite. */}
        <span
          aria-hidden="true"
          className="font-display text-5xl leading-none font-bold text-[#fbbc04]"
        >
          &bdquo;
        </span>
      </div>

      <blockquote className="mt-5 font-display text-[length:var(--text-subtitle)] leading-[1.35] font-semibold tracking-tight text-balance">
        {noBreak(quote)}
      </blockquote>

      {/* `mt-auto` statt fester Höhe: Die Zeile sitzt unten, egal wie lang das
          Zitat darüber ist, und alle Karten des Bands schließen bündig ab. */}
      <figcaption className="mt-auto flex items-center gap-3.5 border-t border-current/12 pt-5">
        {/* Anfangsbuchstaben statt Profilbild. Die Fotos liegen auf Googles
            Servern: Sie einzubinden hieße, bei jedem Seitenaufruf die
            IP-Adresse jedes Besuchers dorthin zu schicken – und damit ein
            Einwilligungsbanner vor die Seite zu stellen, das sie heute nicht
            braucht. Herunterladen und selbst ausliefern wäre das Bildnis
            einer identifizierbaren Person ohne deren Einwilligung. Der Kreis
            leistet dasselbe: Er gibt jeder Stimme ein Gesicht in der Reihe. */}
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-silver/10 font-display text-sm font-bold tracking-wide"
        >
          {initials(author)}
        </span>
        <span className="min-w-0">
          <span className="block font-display font-semibold tracking-tight">
            {author}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-sm text-current/60">
            <GoogleMark className="size-3.5 shrink-0" />
            <span className="break-words">Google-Rezension · {context}</span>
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export async function Testimonials({
  tone = "silver-200",
}: {
  /**
   * Muss sich vom Ton der Sektion darüber *und* darunter unterscheiden –
   * dieselbe Regel wie bei `Related`. Auf `/ueber-uns` folgt `Region`
   * (silver-200), deshalb steht das Band dort auf Silber.
   */
  tone?: "silver" | "silver-200";
} = {}) {
  const googleRating = await getGoogleRating();

  return (
    <Section id="kundenstimmen" tone={tone}>
      <Container>
        <SectionHead
          eyebrow="Kundenstimmen"
          title={
            <>
              Was <Mark>Käufer</Mark> bei Google schreiben.
            </>
          }
          lead="Rezensionen aus dem Google-Profil der Werkstatt, unverändert im Wortlaut übernommen."
        />

        {/* Der Verweis auf das Profil steht hier, weil die Note und die Zahl
            der Rezensionen sonst nur eine Behauptung dieser Seite wären. Drei
            Stimmen stehen im Band, alle stehen bei Google – der Link ist der
            Unterschied zwischen „wir sagen" und „sehen Sie selbst". */}
        <Reveal delay={180}>
          <a
            href={site.googleProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="press group -mx-2 inline-flex min-h-11 items-center gap-2.5 rounded-md px-2 text-sm font-semibold transition-[color,background-color,transform] duration-200 hover:bg-current/6"
          >
            <GoogleMark className="size-4 shrink-0" />
            Alle {googleRating.count} Rezensionen im Google-Profil
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 shrink-0 text-current/50 transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
            />
          </a>
        </Reveal>
      </Container>

      {/* Volle Fensterbreite, außerhalb des Satzspiegels: Ein Band, das am
          Satzspiegel endet, sieht aus wie ein Kasten mit Inhalt, der zufällig
          wandert. Läuft es aus dem Bild heraus, liest man es als Ausschnitt
          aus etwas Längerem – und genau das ist es.

          Die Maske blendet beide Ränder aus, damit keine Karte an einer harten
          Kante abgeschnitten wird. Die Ausblendbreite ist am Telefon kleiner:
          5 rem sind dort ein Fünftel der Bildbreite, und die erste Karte stand
          halb im Nebel. Gemessen bei 390 px – 2 rem lassen die Kante weich und
          die Karte lesbar. */}
      {/* Am Telefon eine Wischbahn statt des Laufbands.

          Das Band war dort keine Darstellung, sondern ein Defekt: Bei 390 px
          ist die Karte 304 px breit, es passt also eine und ein Drittel ins
          Bild – gemessen stand links eine halbe Karte an der Gehäusekante und
          rechts eine, die mitten im Wort abbrach („sehr net", „immer fü").
          Dazu ließ sich das Band mit dem Finger nur *anhalten*
          (`group-active`), nicht bewegen; bei 64 s Umlauf wartet man auf die
          dritte Stimme bis zu 21 Sekunden.

          Eine Karte je Bild, Einrastpunkte, gewischt wie in der Galerie –
          derselbe Auslöser für dieselbe Absicht. Ab `sm` läuft das Band
          weiter, dort stehen mehrere Karten gleichzeitig im Bild und die
          Bewegung leistet, wofür sie gedacht ist. */}
      <Reveal delay={80} className="mt-14 sm:hidden">
        {/* Fokussierbar wie die Tarifbahn auf /versicherung: Die Karten
            enthalten nichts Fokussierbares, ohne `tabIndex` wären zweite und
            dritte Stimme per Tastatur unerreichbar. */}
        <ul
          tabIndex={0}
          role="region"
          aria-label="Kundenstimmen"
          className="scroll-x flex snap-x snap-mandatory gap-4 scroll-px-6 px-6 pb-2"
        >
          {testimonials.map((item) => (
            <li key={item.author} className="flex snap-center">
              <QuoteCard {...item} className="w-[calc(100vw-3rem)]" />
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal
        delay={80}
        className="mt-14 hidden [--fade:2rem] sm:block md:[--fade:5rem] [mask-image:linear-gradient(to_right,transparent,#000_var(--fade),#000_calc(100%-var(--fade)),transparent)]"
      >
        <Marquee
          className="[--duration:64s] [--gap:1.5rem]"
          repeat={4}
          reverse
          pauseOnHover={false}
        >
          {testimonials.map((item) => (
            <QuoteCard key={item.author} {...item} />
          ))}
        </Marquee>
      </Reveal>
    </Section>
  );
}
