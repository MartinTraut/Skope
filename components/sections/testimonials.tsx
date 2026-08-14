import { GoogleMark } from "@/components/brand/google-mark";
import { Reveal } from "@/components/motion/reveal";
import { Marquee } from "@/components/ui/marquee";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { initials, Stars } from "@/components/ui/stars";
import { testimonials, type Testimonial } from "@/lib/data/testimonials";
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

function QuoteCard({ quote, author, context, rating }: Testimonial) {
  return (
    /* Feste Kartenbreite, nicht mitwachsend: Ein Laufband braucht ein
       gleichbleibendes Maß, sonst ruckelt die Schleife optisch, obwohl sie
       gleichmäßig läuft. 24rem ergibt rund 45 Zeichen je Zeile – kurz genug
       für ein Zitat im Vorbeigehen, lang genug, dass kein Satz zerfällt. */
    <figure className="lift flex w-[min(78vw,24rem)] shrink-0 flex-col rounded-lg bg-ink p-7 text-silver on-dark md:p-8">
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
        {quote}
      </blockquote>

      {/* `mt-auto` statt fester Höhe: Die Zeile sitzt unten, egal wie lang das
          Zitat darüber ist, und alle Karten des Bands schließen bündig ab. */}
      <figcaption className="mt-auto flex items-center gap-3.5 border-t border-current/12 pt-5 mt-7">
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
            <span className="truncate">Google-Rezension · {context}</span>
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  return (
    <Section id="kundenstimmen" tone="silver-200">
      <Container>
        <SectionHead
          eyebrow="Kundenstimmen"
          title={
            <>
              Was <Mark>Kunden</Mark> nach dem Werkstattbesuch sagen.
            </>
          }
          lead="Rezensionen aus dem Google-Profil der Werkstatt, unverändert im Wortlaut übernommen."
        />
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
      <Reveal
        delay={80}
        className="mt-14 [--fade:2rem] md:[--fade:5rem] [mask-image:linear-gradient(to_right,transparent,#000_var(--fade),#000_calc(100%-var(--fade)),transparent)]"
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
