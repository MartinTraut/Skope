import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { GoogleMark } from "@/components/brand/google-mark";
import { Reveal } from "@/components/motion/reveal";
import { BorderBeamPanel } from "@/components/ui/border-beam-panel";
import { ButtonLink } from "@/components/ui/button";
import { PhoneButton } from "@/components/ui/phone-button";
import { Container } from "@/components/ui/section";
import { initials, Stars } from "@/components/ui/stars";
import { testimonials } from "@/lib/data/testimonials";
import { googleRating, proof } from "@/lib/site";
import { Mark } from "@/components/ui/mark";

/**
 * Die Stimme, die im Kopfbereich im Wortlaut steht.
 *
 * Die kürzeste der drei: Der Kopfbereich trägt bereits Überschrift, Lead und
 * zwei Aktionen – ein Zitat, das dort über drei Zeilen läuft, wird zur
 * zweiten Lesestrecke und nicht mehr überflogen. Ausgewählt wird nach Länge
 * und nicht von Hand, damit eine neue Rezension die Auswahl mitmacht.
 */
const leadReview = testimonials.reduce((shortest, item) =>
  item.quote.length < shortest.quote.length ? item : shortest,
);

/**
 * Kennzahlen in der Akzentfarbe – aber alle vier, nicht eine.
 *
 * Der frühere Einwand gegen Farbe hier war richtig und ist es immer noch:
 * Eine einzelne farbige Zahl in einer Reihe gleichrangiger Werte hebt
 * willkürlich einen heraus. Er trifft nur nicht mehr zu, wenn die Farbe an
 * der Gattung hängt statt am Einzelfall. Vier Zahlen in Neon sagen „das hier
 * sind die Zahlen", eine sagt „diese ist wichtiger" – und das wäre gelogen.
 *
 * Der frühere Zähler bleibt weg: Er erzählt „Menge", was auf eine Entfernung
 * oder eine Frist nicht zutrifft.
 */
const stats = [
  { value: `${proof.repairs}+`, label: "reparierte E-Scooter" },
  { value: "59,99 €", label: "kompletter Sicherheits-Checkup" },
  { value: `${proof.warrantyYears} Jahr`, label: "Gewährleistung gebraucht" },
  // „bis 25 km" statt der früheren Spanne: Ausgeschrieben („8 bis 25 km")
  // bricht der Wert auf 390 px in zwei Zeilen um und schiebt seine Bildunter-
  // zeile 32 px unter die des Nachbarn in derselben Rasterreihe – gemessen.
  // Die Untergrenze trägt ohnehin keine Aussage; die Reichweite tut es.
  //
  // Die Bildunterzeile nennt die Städte. „Einzugsgebiet um Neuenstadt" war
  // ein Fachwort über einem Ort, den außerhalb der Region niemand einordnen
  // kann – zusammen sagten Zahl und Zeile nicht, was sie bedeuten. Drei
  // bekannte Städte beantworten die Frage „bin ich da drin?" sofort und sind
  // zugleich das, wonach gesucht wird.
  { value: "bis 25 km", label: "Umkreis mit Heilbronn, Öhringen, Mosbach" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink pb-0 text-silver on-dark">
      {/* Zwei Zonen, nicht eine: Oben die Bildzone mit Text darauf, darunter
          das Beweisband auf reiner Tinte.

          Grund ist Geometrie, keine Gestaltungslaune. Die Aufnahme ist
          16:10; über die ganze Sektion gelegt (rund 1400 px hoch bei 1512 px
          Breite) müsste `object-cover` sie auf 224 % hochziehen, und vom
          Roller bliebe ein Ausschnitt der Lenkstange. Auf die Textzone
          begrenzt liegt das Verhältnis bei etwa 1,6 – dem der Aufnahme. */}
      <div className="relative">
      {/* Die Werkstatt selbst als Grund, über die volle Breite.
          Vorher stand hier der Shader und rechts daneben ein Hochformat im
          Rahmen – zwei Gegenstände, die um dieselbe Fläche konkurrierten.
          Jetzt trägt eine Aufnahme beides: Tiefe für die Glasleiste des
          Seitenkopfs und das Motiv, das die Sektion braucht.

          Der Shader bleibt auf den Unterseiten und im Abschlussband; hier
          hätte er unter dem Foto nichts zu leuchten. Das Grün kommt aus dem
          Bild – die Leuchtstoffröhre über der Werkzeugwand – und aus dem
          Licht, das die Verfügbarkeitszeile umläuft.

          `object-position` hält den Roller rechts neben der Textspalte: Der
          Bildausschnitt wandert mit der Breite, das Motiv nicht. */}
      {/* Die Bildfläche endet an derselben Kante wie die Textspalte, nicht am
          Fensterrand.

          Gemessen auf einem 49-Zoll-Schirm (5120 px): Die Aufnahme liegt
          `contain` und rechts verankert, also skaliert sie über die Höhe der
          Zone – 1975 px breit – und klebte damit am rechten Fensterrand bei
          3145 px. Die Textspalte steht im Raster und endet bei 3392 px.
          Zwischen Text und Roller lagen 1400 px schwarze Fläche, links vom
          Text noch einmal 1728 px: Aus der einen Komposition von 1512 px
          waren drei Gegenstände geworden, die nichts mehr miteinander zu tun
          hatten.

          Dieselbe Breitengrenze wie `Container` (104rem) bindet das Motiv
          wieder an die Spalte. Unter 1664 px ändert sich nichts – dort ist
          das Fenster schmaler als die Grenze.

          Ab der Grenze bekommt die Fläche seitlich denselben weichen Auslauf,
          den sie unten schon hat: Sonst steht dort, wo das Foto aufhört, eine
          harte senkrechte Kante mitten in der Sektion. Der Auslauf hängt an
          `min-[104rem]`, damit er unterhalb der Grenze nicht den Roller
          anschneidet – dort steht er am rechten Bildrand. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-full max-w-[104rem] -translate-x-1/2 overflow-hidden min-[104rem]:[mask-image:linear-gradient(to_right,transparent,black_7rem,black_calc(100%-7rem),transparent)]"
      >
        {/* `object-contain` statt `object-cover` – die Aufnahme wird
            vollständig gezeigt, nicht beschnitten.

            Mit `cover` bestimmt die längere Seite den Maßstab: Die Bildzone
            ist bei 1512 px gemessen 1512 × 978 px (1,55), die Aufnahme hat
            2400 × 1507 (1,59). Das kostet zwar nur drei Prozent Breite – der
            Roller wirkt trotzdem nah, weil die Sektion 986 px hoch ist und in
            einem üblichen Fenster von 790 px der untere Teil samt Vorderrad
            unter der Falz liegt. `contain` bindet den Maßstab an die Breite
            (1512 / 2400 = 0,63 statt 0,65) und zeigt Lenker wie Vorderrad
            immer vollständig; was oben fehlt, ist Tinte – der Grund der
            Sektion, kein Loch. Unten und rechts verankert, damit der Roller
            neben der Textspalte steht und auf der Standfläche aufsitzt. */}
        {/* Die Beschreibung sitzt an dieser Fläche, nicht an der Tafel weiter
            unten: Die Tafel ist `lg:hidden`, auf dem Schreibtisch war das
            Motiv des Kopfbereichs damit gar nicht beschrieben. Hier steht es
            auf jeder Breite. Die Tafel trägt dafür jetzt ein leeres Attribut –
            sie zeigt dieselbe Aufnahme, und zweimal derselbe Text hintereinander
            ist am Vorleser eine Wiederholung ohne Gewinn. */}
        <Image
          src="/img/hero-werkstatt.jpg"
          alt="Geprüfter E-Scooter in der Werkstatt, dahinter die Werkzeugwand unter der Neonröhre"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[64%_center] lg:object-contain lg:object-[right_bottom]"
        />
        {/* Der Schleier trennt Leuchten von Lesbarkeit – siehe .hero-scrim. */}
        <div className="hero-scrim absolute inset-0" />
        {/* Der Werkstattboden ist die hellste Stelle der Aufnahme und lag
            genau auf der Unterkante der Bildzone – eine waagerechte Kante
            quer durch die Sektion. Der zweite Verlauf zieht die letzten
            10 rem in die Tinte, in der das Beweisband darunter steht. */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>

      {/* Der Kopfabstand hängt an der Höhe des Fensters, nicht an seiner
          Breite.

          Gemessen im Querformat eines iPhone (844 × 390): 112 px fester
          Kopfabstand sind dort 29 % der Bildhöhe. Zusammen mit dem 72 px hohen
          Seitenkopf stand die Auszeichnungszeile bei 290 von 390 px – man sah
          die Überschrift und sonst nichts, beide Knöpfe lagen zwei
          Fingerbreiten unter der Kante. Am Schreibtisch fällt das nie auf, weil
          dort dieselben 112 px nur 12 % der Höhe sind.

          `clamp(5.5rem, 3rem + 8vh, 8rem)` macht daraus einen Wert, der mit der
          Bildhöhe wandert: 88 px im Querformat (16 px unter dem Seitenkopf),
          115 px auf einem Telefon im Hochformat, gedeckelt bei 128 px – genau
          dem Wert, der vorher ab `md` stand. Auf jedem Schirm ab 800 px Höhe
          ändert sich also nichts. */}
      <Container className="relative pt-[clamp(5.5rem,3rem+8vh,8rem)] pb-14 md:pb-16">
        {/* Sieben Spalten Text, fünf für das Motiv – auch wenn die Aufnahme
            als Grund über die volle Breite läuft. Die fünf freien Spalten
            sind kein leerer Platz, sondern der Teil des Bildes, den der
            seitliche Schleier durchlässt; dort steht der Roller.

            Sechs Spalten waren es eine Runde lang und zu wenig: Bei 1512 px
            braucht die erste Zeile „E-Scooter reparieren" gemessen 680 px,
            sechs Spalten geben 680, sieben geben 800. Sie brach damit
            zwischen „E-Scooter" und „reparieren" um, und aus zwei Zeilen
            wurden drei. Der Grad in `--text-hero` ist auf diese sieben
            Spalten gerechnet. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal immediate>
              <p className="eyebrow text-current/90">
                E-Scooter Fachwerkstatt · Neuenstadt am Kocher
              </p>
            </Reveal>

            {/*
              Nüchtern statt Wortspiel. Die vorherige Zeile „Wegwerfen ist
              keine Diagnose." war ein Werbespruch mit goldenem Verlaufswort
              und sagte weder, was hier passiert, noch für wen. Jetzt trägt
              die H1 die Leistung und den Ort, das ist zugleich das, wonach
              gesucht wird.

              Der Umbruch steht wieder fest. Frei umbrochen verteilte
              `text-wrap: balance` den Satz in der halbbreiten Spalte auf drei
              ungleiche Zeilen und trennte „reparieren" von „E-Scooter" – die
              Leistung stand damit nicht mehr in einer Zeile mit dem, woran
              sie geschieht. Zwei Blöcke setzen die Zäsur dorthin, wo der Satz
              sie im Sinn hat.

              Eine Maske für beide Zeilen: Sie steigen gemeinsam auf, weil
              zwei getrennte Masken denselben Satz in zwei Ereignisse
              zerlegen.
            */}
            {/* Acht Spalten für die Überschrift, sieben für alles darunter.
                Die Textspalte fällt bei 1024 px von 820 auf 515 px, und dieser
                eine Punkt deckelte den Grad auf jeder größeren Breite mit.
                115 % sind gemessen genau die achte Spalte samt Rasterabstand
                (800 → 920 px bei 1512 px); der Fließtext bleibt bei sieben,
                weil eine Lesestrecke nicht breiter werden soll. */}
            <h1 className="rise-line mt-6 text-[length:var(--text-hero)] lg:w-[115%]">
              <span>
                <span className="block">
                  E-Scooter <Mark>reparieren</Mark>
                </span>
                <span className="block">statt neu kaufen</span>
              </span>
            </h1>

            <Reveal immediate>
              {/* Der Vorgänger war eine Leistungsaufzählung („Fehlerdiagnose,
                  Wartung und geprüfte Gebrauchtgeräte"). Sie beantwortete die
                  Frage, die jemand mit einem defekten Gerät im Kopf hat, an
                  keiner Stelle: Ist das noch zu retten, und was kostet mich
                  das Nachfragen? Beides steht jetzt in den ersten zwei
                  Sätzen. */}
              {/* `mt-8` gehört hierher und nicht an den Abstand des Rasters:
                  Die Überschrift zieht mit dem negativen Ausgleich von
                  `.rise-line` acht Pixel nach oben in ihre eigene
                  Unterlängen-Reserve. Gemessen begann der Fließtext dadurch
                  neun Pixel oberhalb der Unterkante der Überschrift. */}
              <p className="mt-8 max-w-[42ch] text-[length:var(--text-lead)] leading-relaxed text-current/75">
                Die meisten Defekte sind kein Totalschaden. Wir messen zuerst
                Fehlerspeicher, Akkukapazität und Bauteile und nennen den Preis,
                bevor wir anfangen. Werkstatt in Neuenstadt am Kocher, für
                Heilbronn, Neckarsulm und die Region.
              </p>
            </Reveal>

            <Reveal immediate>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <PhoneButton className="max-sm:w-full" />
                <ButtonLink
                  href="/reparatur#anfrage"
                  variant="outline"
                  size="lg"
                >
                  Reparatur anfragen
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </ButtonLink>
              </div>
              {/* Die Zusage neben den Aktionen, nicht als Fußnote darunter.
                  Vorher stand sie in 14 px bei 65 % Deckkraft unter zwei
                  Buttons – die einzige Stelle im Kopfbereich, an der etwas
                  Konkretes über die Wartezeit steht, und optisch die
                  schwächste. Jetzt trägt sie eine eigene Fläche und den
                  Neonpunkt, der auf der ganzen Seite „verfügbar" meint. */}
              {/* Dasselbe umlaufende Licht wie an den Prüfpositionen der
                  Geräteseite: Es meint an beiden Stellen dasselbe – hier
                  wird geprüft, hier ist etwas verfügbar. Der Kern der Spur
                  läuft in `currentColor`, deshalb ist er auf Tinte hell und
                  auf Silber dunkel, ohne zweite Regel. */}
              <p className="trace mt-7 inline-flex items-center gap-3 rounded-full bg-current/8 py-2.5 pr-6 pl-4.5 font-display text-[0.9375rem] font-semibold tracking-tight">
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full bg-neon"
                />
                Bremsen und Reifen meist am selben Tag
              </p>
            </Reveal>

            {/* Auf dem Telefon steht die Aufnahme im Text, nicht dahinter.
                Gemessen bleibt bei 390 px von einem 16:10-Bild hinter einer
                Sektion von rund 1100 px Höhe ein Streifen von 22 % der
                Bildbreite übrig – dort ist der Roller entweder ganz oder gar
                nicht zu sehen, und der Schleier, der die Schrift trägt,
                verdunkelt ihn zusätzlich. Als eigene Fläche zeigt sie das
                Motiv vollständig; der Lichtring gibt ihr auf Schwarz die
                Kante, die ein Schatten dort nicht geben kann. */}
            <Reveal immediate delay={40} className="mt-10 lg:hidden">
              <BorderBeamPanel
                radius={20}
                thickness={2}
                beams={2}
                className="aspect-[16/10] w-full overflow-hidden bg-ink-700"
              >
                <Image
                  src="/img/hero-werkstatt.jpg"
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </BorderBeamPanel>
            </Reveal>

            {/* Referenzen im Kopfbereich, nicht erst in der vierten Sektion.
                Die Rezensionen standen bisher unterhalb von Ablauf und
                Werkstatt – wer nach dem Kopfbereich weiterklickt, hatte bis
                dahin nur unsere eigenen Aussagen gelesen. Der Beleg gehört
                dorthin, wo die Entscheidung fällt.

                Es ist derselbe Bestand wie im Band weiter unten, nur der
                Auszug: die Gesichter aller Stimmen, die Note, und eine
                Rezension im Wortlaut. Gold statt Neon, weil das hier ein
                Zitat von Google ist und kein Handlungsangebot – die Regel
                steht an `components/ui/stars.tsx`. */}
            <Reveal immediate delay={60}>
              <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4">
                <div aria-hidden="true" className="flex items-center -space-x-3">
                  {testimonials.map((item) => (
                    <span
                      key={item.author}
                      className="grid size-10 place-items-center rounded-full border-2 border-ink bg-silver/12 font-display text-xs font-bold tracking-wide backdrop-blur-sm"
                    >
                      {initials(item.author)}
                    </span>
                  ))}
                </div>

                <div className="min-w-0">
                  <p className="flex items-center gap-2.5">
                    <span className="tabular font-display text-lg leading-none font-bold tracking-tight">
                      {googleRating.value}
                    </span>
                    <Stars
                      rating={5}
                      className="size-4"
                      label={`${googleRating.value} von 5 Sternen bei Google`}
                    />
                  </p>
                  <p className="mt-1.5 flex items-center gap-2 text-sm text-current/70">
                    <GoogleMark className="size-3.5 shrink-0" />
                    {googleRating.count} Rezensionen bei Google
                  </p>
                </div>
              </div>

              <figure className="mt-6 max-w-[46ch] border-l-2 border-current/20 pl-5">
                <blockquote className="font-display leading-snug font-semibold tracking-tight text-current/90">
                  &bdquo;{leadReview.quote}&ldquo;
                </blockquote>
                <figcaption className="mt-2 text-sm text-current/60">
                  {leadReview.author} · {leadReview.context}
                </figcaption>
              </figure>
            </Reveal>
          </div>

        </div>

      </Container>
      </div>

      <Container className="relative">
        {/* Beweisband schließt den Hero ab und leitet in die Seite über.

            Ohne Linien. Vorher stand um die vier Werte ein Raster aus Ober-,
            Unter- und Trennkanten – auf Schwarz liest sich das als Kasten, und
            ein Kasten ist genau die Baukasten-Anmutung, die der Rest der Seite
            vermeidet. Die Trennung leisten jetzt der Abstand und der
            Neon-Grad; das reicht, weil die vier Blöcke ohnehin je aus einer
            großen Zahl und einer kleinen Zeile bestehen.

            Der obere Abstand ist halbiert (16 → 8, auf großen Schirmen
            20 → 10). Über dem Band steht der letzte Verlauf der Bildzone, der
            ohnehin schon 10 rem reine Tinte erzeugt; zusammen mit vier
            Leerzeilen Abstand riss das Band von der Aufnahme ab, statt sie
            abzuschließen. */}
        <Reveal
          delay={80}
          className="grid grid-cols-2 gap-x-8 gap-y-10 pt-8 pb-20 lg:grid-cols-4 lg:gap-x-10 lg:pt-10 lg:pb-24"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-0">
              <p className="tabular font-display text-[length:var(--text-stat)] leading-none font-bold text-accent">
                {stat.value}
              </p>
              <p className="mt-3 text-sm leading-snug text-current/70">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
