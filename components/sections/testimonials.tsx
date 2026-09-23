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
}: Testimonial & {
  className?: string;
}) {
  /* Anfangsbuchstaben statt Profilbild. Die Fotos liegen auf Googles
     Servern: Sie einzubinden hieße, bei jedem Seitenaufruf die IP-Adresse
     jedes Besuchers dorthin zu schicken – und damit ein Einwilligungsbanner
     vor die Seite zu stellen, das sie heute nicht braucht. Herunterladen und
     selbst ausliefern wäre das Bildnis einer identifizierbaren Person ohne
     deren Einwilligung. Der Kreis leistet dasselbe: Er gibt jeder Stimme ein
     Gesicht in der Reihe. Auf der Achse ist er kleiner, weil er dort neben
     dem Namen steht und nicht über ihm. */
  const avatar = (
    <span
      aria-hidden="true"
      className="grid size-11 shrink-0 place-items-center rounded-full bg-silver/10 font-display text-sm font-bold tracking-wide"
    >
      {initials(author)}
    </span>
  );

  /* Die Quelle ist **ein** Textfluss, keine Flex-Zeile aus vier Kindern.
     Als `flex items-center` ohne `flex-wrap` war sie der eigentliche Grund
     für die verrutschten Rezensionstexte: Bei 390 px bleiben neben dem
     44-px-Kreis 198 px, „Google-Rezension" braucht 131 – der Text brach
     also *innerhalb* seines eigenen Kastens auf zwei Zeilen (48 statt
     24 px), das 12-px-Google-Zeichen wurde über diese 48 px zentriert und
     saß damit zwischen den Zeilen, während „· Käufer" mit
     `whitespace-nowrap` oben rechts allein stehen blieb. Bei 320 px kam der
     zweizeilige Name dazu und `items-center` an der Unterschrift schob den
     Kreis 31 px nach unten.

     Im Satz gesetzt bricht die Zeile dort, wo Text bricht, und das Zeichen
     sitzt auf der Versalhöhe (`align`-Korrektur wie beim Profilverweis
     weiter unten). */
  const source = (
    <span className="mt-0.5 block text-sm leading-snug text-current/60">
      <GoogleMark className="mr-1.5 inline size-3 align-[-0.15em]" />
      Google-Rezension <span aria-hidden="true">·</span> {context}
    </span>
  );

  return (
    /* Feste Kartenbreite, nicht mitwachsend: Ein Laufband braucht ein
       gleichbleibendes Maß, sonst ruckelt die Schleife optisch, obwohl sie
       gleichmäßig läuft. 24rem ergibt rund 45 Zeichen je Zeile – kurz genug
       für ein Zitat im Vorbeigehen, lang genug, dass kein Satz zerfällt.

       Am Telefon gibt die Wischbahn das Maß vor (siehe unten), deshalb ist
       die Breite hier überschreibbar. */
    <figure
      className={cn(
        "lift flex shrink-0 flex-col rounded-lg bg-ink p-6 text-silver on-dark sm:p-7 md:p-8",
        className ?? "w-[min(82vw,24rem)]",
      )}
    >
      <div
        className="flex items-center justify-between gap-4">
        <Stars rating={rating} cascade />
        {/* Das Anführungszeichen in derselben Farbe wie die Sterne: Beides
            gehört zur Herkunft der Aussage, nicht zur Seite.

            Auf der Achse steht es direkt neben der Sternreihe statt an der
            rechten Kante – es gibt dort keine rechte Kante, an der etwas
            stehen könnte. Die Zeile richtet sich deshalb an der Grundlinie
            aus (`items-end`): Das Zeichen sitzt unten in seinem Kegel, mit
            `items-center` hinge es eine halbe Zeile unter den Sternen. */}
        <span
          aria-hidden="true"
          className="font-display text-5xl leading-none font-bold text-[#fbbc04]"
        >
          &bdquo;
        </span>
      </div>

      <blockquote
        className={
          /* Unter `sm` einen Grad kleiner und ohne `text-balance`: Bei 390 px
             ist die Karte 320 px breit, der Satz also 272 px – im
             Untertitelgrad (19,2 px) sind das 24 Zeichen je Zeile über sechs
             Zeilen. Im Leadgrad (16,8 px) werden es 28 Zeichen und vier bis
             fünf Zeilen. `text-balance` gleicht dabei die letzte Zeile aus,
             indem es alle vorherigen kürzt – bei 24 Zeichen kostet das eine
             weitere Zeile. Ab `sm` bleibt beides, wie es war. */
          "mt-5 font-display text-[length:var(--text-lead)] leading-[1.35] font-semibold tracking-tight sm:text-[length:var(--text-subtitle)] sm:text-balance"
        }
      >
        {noBreak(quote)}
      </blockquote>

      {/* `mt-auto` statt fester Höhe: Die Zeile sitzt unten, egal wie lang das
          Zitat darüber ist, und alle Karten des Bands schließen bündig ab. */}
      {/* `items-start` und nicht `items-center`: Sobald Name oder Quelle
          zweizeilig laufen – bei 320 px tun sie das –, setzt `center` den
          44 px hohen Kreis auf die Mitte eines 80 px hohen Textblocks und
          damit gut 30 px unter dessen Oberkante. Gemessen war das der
          zweite Teil des verrutschten Eindrucks. */}
      {/* Keine Haarlinie mehr über der Unterschrift (23.09.2026, auf Ansage).

          Sie stand hier, weil Zitat und Unterschrift am Schreibtisch beide
          linksbündig laufen und die Linie die einzige Kante zwischen ihnen
          war. Auf der Karte ist sie aber der dritte waagerechte Strich neben
          Sternreihe und Kartenkante – und sie trennt zwei Teile derselben
          Aussage: was jemand geschrieben hat und wer es war. Die Trennung
          leisten der Abstand und der Kreis links; das reicht, weil darunter
          ohnehin ein anderer Schriftgrad steht.

          Der Innenabstand bleibt: Ohne die Linie ist er kein Abstand *zu*
          ihr mehr, sondern der Abstand zwischen Zitat und Unterschrift. */}
      <figcaption className="mt-auto flex items-start gap-3.5 pt-5">
        {avatar}
        <span className="min-w-0">
          <span className="block font-display leading-snug font-semibold tracking-tight">
            {author}
          </span>
          {source}
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
          lead="Unverändert im Wortlaut aus dem Google-Profil der Werkstatt übernommen."
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
            className="press group -mx-2 inline-flex min-h-11 items-center rounded-md px-2 text-sm font-semibold transition-[color,background-color,transform] duration-200 hover:bg-current/6"
          >
            {/* Zeichen und Pfeil stehen *im* Satz, nicht als dritte Zelle daneben. Bei
                320 px bricht die Zeile („Alle 37 Rezensionen im /
                Google-Profil"), und als eigene Zellen hingen beide auf halber
                Höhe an den Kanten – ohne Bezug zu einer der beiden Zeilen.
                Inline sitzt das Zeichen auf der ersten Zeile und der Pfeil
                hinter dem letzten Wort. `Google-Profil` bricht nicht am
                Bindestrich auf, sonst stünde in der zweiten Zeile „Profil"
                allein. */}
            <span>
              <GoogleMark className="mr-2 inline size-4 align-[-0.15em]" />
              Alle {googleRating.count} Rezensionen im{" "}
              <span className="whitespace-nowrap">Google-Profil</span>
              <ArrowUpRight
                aria-hidden="true"
                className="ml-1.5 inline size-4 align-[-0.15em] text-current/50 transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
              />
            </span>
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
      {/* Auf Ansage vom 15.09.2026 läuft das Band wieder auf jeder Breite,
          auch am Telefon: Die Bewertungen sollen sich von allein bewegen. Die
          Wischbahn, die hier vom 06.09. bis dahin stand, ist damit weg.

          Am Telefon ist die Ausblendbreite auf 1 rem gesetzt: Bei 390 px
          sind 2 rem je Seite 64 px von 390, und die Karte (320 px) hatte
          zwischen beiden Nebeln nur 326 px Fenster. 5 rem wären ein Fünftel
          der Bildbreite.

          `pauseOnHover` ist wieder an. Es stoppt nichts von allein – die
          Regel greift über `group-active`, also nur solange ein Finger auf
          dem Band liegt. Gemessen läuft das Band 15,4 px/s; ein sechszeiliges
          Zitat wandert während des Lesens rund 40 % seiner Kartenbreite, und
          ohne diese Regel gibt es am Telefon keine Möglichkeit, es
          festzuhalten. */}
      <Reveal
        delay={80}
        className="mt-10 [--fade:1rem] sm:mt-14 sm:[--fade:2rem] md:[--fade:5rem] [mask-image:linear-gradient(to_right,transparent,#000_var(--fade),#000_calc(100%-var(--fade)),transparent)]"
      >
        <Marquee
          className="[--duration:64s] [--gap:1.5rem]"
          repeat={4}
          reverse
        >
          {testimonials.map((item) => (
            <QuoteCard key={item.author} {...item} />
          ))}
        </Marquee>
      </Reveal>
    </Section>
  );
}
