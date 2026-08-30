import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { GoogleMark } from "@/components/brand/google-mark";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { PhoneButton } from "@/components/ui/phone-button";
import { Container } from "@/components/ui/section";
import { initials, Stars } from "@/components/ui/stars";
import { testimonials } from "@/lib/data/testimonials";
import { inventoryFacts } from "@/lib/inventory";
import { googleRating, proof } from "@/lib/site";
import { Mark } from "@/components/ui/mark";

/**
 * Kennzahlen in der Akzentfarbe – aber alle vier, nicht eine.
 *
 * Der frühere Einwand gegen Farbe hier war richtig und ist es immer noch:
 * Eine einzelne farbige Zahl in einer Reihe gleichrangiger Werte hebt
 * willkürlich einen heraus. Er trifft nur nicht mehr zu, wenn die Farbe an
 * der Gattung hängt statt am Einzelfall. Vier Zahlen in Neon sagen „das hier
 * sind die Zahlen", eine sagt „diese ist wichtiger" – und das wäre gelogen.
 *
 * Die Reihenfolge folgt dem Geschäft: Bestand, Einstiegspreis und
 * Gewährleistung stehen vorn, weil der Verkauf generalüberholter Geräte das
 * Hauptgeschäft ist. Die Zahl der Reparaturen steht hinten und hat dort eine
 * andere Aufgabe als früher – sie ist nicht mehr das Angebot, sondern der
 * Beleg dafür, dass die Aufbereitung aus einer Werkstatt kommt und nicht aus
 * einem Lager.
 *
 * Anzahl und Einstiegspreis kommen aus dem Bestand, nicht aus dem Fließtext:
 * Bei einer Liste, die laut eigener Ansage laufend wechselt, wäre eine von
 * Hand geschriebene Zahl der erste Satz, der unbemerkt falsch wird.
 */
const facts = inventoryFacts();

const stats = [
  { value: `${facts.count}`, label: "geprüfte Geräte vorrätig" },
  /* Die Obergrenze steht in der Zeile darunter und nicht mehr in einer
     zweiten Kachel eine Bildschirmhöhe tiefer – siehe den Kommentar am
     Kennzahlenband in `inventory-teaser.tsx`. */
  {
    value: facts.priceFrom,
    label: `Einstiegspreis bis ${facts.priceTo}, Endpreis ohne USt.`,
  },
  {
    value: `${proof.warrantyYears} Jahr`,
    label: "Gewährleistung auf jedes Gerät",
  },
  {
    value: `${proof.repairs}+`,
    label: "reparierte E-Scooter in eigener Werkstatt",
  },
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
        <div className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 hidden w-full max-w-[104rem] -translate-x-1/2 overflow-hidden lg:block min-[104rem]:[mask-image:linear-gradient(to_right,transparent,black_7rem,black_calc(100%-7rem),transparent)]">
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
          {/* Diese Fläche ist `hidden lg:block`, die Bühne darüber `lg:hidden`:
            Auf keiner Breite steht die Aufnahme zweimal, deshalb trägt jede
            der beiden dieselbe Beschreibung und dieselbe `sizes`-Angabe – es
            ist immer nur eine da, und zwei verschiedene Angaben hätten mit
            `priority` zwei Breiten derselben Datei vorgeladen.

            Kein `aria-hidden` an der umgebenden Fläche. Es stand hier, und
            damit war der `alt`-Text darunter wirkungslos – `aria-hidden` am
            Elternteil nimmt den Bildknoten samt Beschreibung aus dem Baum.
            Das Kopfbild war auf Telefon *und* Schreibtisch unbeschrieben,
            obwohl beide Flächen einen ausformulierten `alt` tragen.
            `pointer-events-none` und `-z-10` halten die Fläche weiterhin aus
            jeder Bedienung heraus. */}
          <Image
            src="/img/hero-werkstatt.jpg"
            alt="Geprüfter E-Scooter in der Werkstatt, dahinter die Werkzeugwand unter der Neonröhre"
            fill
            priority
            sizes="min(100vw, 104rem)"
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

        {/* Dieselbe Aufnahme für das Telefon – aber als Bühne über dem Text,
            nicht als Grund hinter der ganzen Sektion.

            Über die volle Sektionshöhe gelegt bleibt bei 390 px nichts vom
            Motiv übrig: Die Sektion ist 1630 px hoch, die Aufnahme 2400 × 1507.
            `object-cover` skaliert dann über die Höhe (Faktor 1,08), das Bild
            wird 2600 px breit, und sichtbar sind 15 % davon – ein Ausschnitt
            der Trittfläche. Auf eine Zone von 26 rem begrenzt liegt der Faktor
            bei 0,28, sichtbar sind 59 % der Breite, und der Roller steht
            vollständig darin.

            Die Fläche läuft bis an beide Gehäusekanten (`w-screen`), weil ein
            Motiv, das im Satzspiegel endet, auf dem Telefon eine Tafel wäre –
            und eine Tafel war hier schon.

            Der Verlauf ist dreiteilig: oben leicht abgedunkelt für die
            Auszeichnungszeile, in der Mitte offen für den Roller, unten dicht,
            damit die Überschrift darauf steht und die Zone ohne Kante in die
            Tinte übergeht. */}
        <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[max(min(58vh,26rem),min(56vw,26rem))] w-screen -translate-x-1/2 overflow-hidden lg:hidden">
          <Image
            src="/img/hero-werkstatt.jpg"
            alt="Geprüfter E-Scooter in der Werkstatt, dahinter die Werkzeugwand unter der Neonröhre"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[82%_center] brightness-115"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--color-ink)_45%,transparent)_0%,color-mix(in_oklab,var(--color-ink)_8%,transparent)_38%,color-mix(in_oklab,var(--color-ink)_80%,transparent)_74%,var(--color-ink)_100%)]" />
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
        <Container className="relative pt-[clamp(6.5rem,4rem+10vh,10rem)] pb-10 lg:pt-[clamp(5.5rem,3rem+8vh,8rem)] md:pb-16">
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
                {/* Die Auszeichnungszeile nennt das Angebot, nicht den
                  Betriebstyp: „Fachwerkstatt" beschreibt, was hier steht,
                  „generalüberholt" beschreibt, was verkauft wird. Der Ort
                  bleibt, er ist die halbe Suchanfrage.

                  „Refurbished" stand hier eine Runde lang und war der
                  Fachbegriff der Branche, nicht das Wort des Kunden – wer
                  „E-Scooter gebraucht kaufen" sucht, kennt es nicht. Dazu
                  brauchte die Zeile bei 390 px zwei Zeilen; als erstes, was
                  über der Überschrift steht, ist das eine Zeile zu viel. */}
                <p className="eyebrow text-current/90">
                  Generalüberholt · Neuenstadt
                </p>
              </Reveal>

              {/*
              Die Überschrift trägt das Hauptgeschäft, nicht die bekannteste
              Leistung.

              Vorher stand hier „E-Scooter reparieren statt neu kaufen". Der
              Satz war gut gebaut und beschrieb den falschen Betrieb: Er
              verkauft in erster Linie generalüberholte Geräte; Reparatur,
              Wartung und Versicherung hängen daran. Eine Startseite, deren
              erster Satz eine Reparaturannahme ankündigt, wird für „E-Scooter
              gebraucht kaufen" nicht gefunden – und wer sie trotzdem findet,
              liest zuerst ein Angebot, das er nicht gesucht hat.

              „Geprüfte E-Scooter gebraucht kaufen" enthält die Suchanfrage
              vollständig und stellt ihr das Unterscheidungsmerkmal voran.
              Markiert ist „geprüfte": Das ist der Unterschied zum
              Kleinanzeigenportal, und es ist das einzige Wort im Satz, für
              das dieser Betrieb einsteht.

              Der Umbruch steht fest. Frei umbrochen verteilte
              `text-wrap: balance` den Satz in der halbbreiten Spalte auf drei
              ungleiche Zeilen. Zwei Blöcke setzen die Zäsur dorthin, wo der
              Satz sie im Sinn hat.

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
              <h1 className="rise-line mt-4 text-[length:var(--text-hero)] sm:mt-6 lg:w-[115%]">
                <span>
                  <span className="block">
                    <Mark>Geprüfte</Mark> E-Scooter
                  </span>
                  <span className="block">gebraucht kaufen</span>
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
                {/* Kürzer als bisher, und zwar um genau den Satzteil, der
                  drei Zeilen tiefer noch einmal als Kennzahl steht: „mit
                  1 Jahr Gewährleistung übergeben". Bei 390 px lief der Absatz
                  über sechs Zeilen und war damit der längste Block über der
                  ersten Aktion – der Kopfbereich soll die Sache benennen,
                  nicht sie schon erklären. Jetzt vier Zeilen. */}
                <p className="mt-6 max-w-[42ch] text-[length:var(--text-lead)] leading-relaxed text-current/75 sm:mt-8">
                  Jedes Gerät wird in der eigenen Werkstatt geprüft und
                  aufbereitet – von derselben Werkstatt, die es danach repariert
                  und wartet. In Neuenstadt am Kocher, für Heilbronn, Neckarsulm
                  und die Region.
                </p>
              </Reveal>

              <Reveal immediate>
                {/* Die Aktionen als ein Block, nicht als drei Kästen
                    untereinander.

                    Am Telefon standen hier ein neongelber Knopf, ein
                    Umrissknopf und darunter mit 28 px Abstand eine dritte
                    Fläche mit der Zusage – drei gleich große Rechtecke in drei
                    verschiedenen Abständen. Jetzt liegen die beiden Knöpfe
                    2,5 Einheiten auseinander, die Zusage 3 darunter und über
                    die volle Spaltenbreite mittig: eine Gruppe mit einer Kante
                    links und einer rechts.

                    Beide Knöpfe sind am Telefon voll breit. Der Umrissknopf
                    bekommt dort zusätzlich eine schwache Fläche – auf Tinte
                    ist ein reiner Umriss neben einem Vollton so leicht, dass
                    er wie ein Nachtrag aussieht. */}
                <div className="mt-7 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:items-center sm:gap-3">
                  <PhoneButton className="max-sm:w-full" />
                  {/* Der zweite Weg führt in den Bestand, nicht in die
                    Reparaturannahme. Wer kaufen will, soll die Geräte sehen;
                    wer eine Reparatur braucht, greift zum Telefon daneben
                    oder findet die Leistung in der Navigation an zweiter
                    Stelle. */}
                  <ButtonLink
                    href="/e-scooter#bestand"
                    variant="outline"
                    size="lg"
                    className="max-sm:w-full max-sm:border-current/25 max-sm:bg-current/8"
                  >
                    {facts.count} Geräte ansehen
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
                {/* Am Telefon keine Fläche, ab `sm` die Pille.

                  Mit Fläche und Kachelradius stand hier ein drittes Rechteck
                  in der Größe der beiden Knöpfe darüber – gleiche Breite,
                  gleiche Höhe, gleiche Rundung. Wer den Block überfliegt,
                  liest drei Aktionen und tippt auf eine, die keine ist. Ohne
                  Fläche ist es das, was es sein soll: eine Zustandszeile mit
                  dem Neonpunkt, der auf der ganzen Seite „verfügbar" meint.

                  Ab `sm` ist der Satz einzeilig, dort trägt die Pille wieder
                  – ein Stadionradius um zwei Zeilen liest sich als Fehler. */}
                <p className="trace trace-from-sm mt-4 flex items-start gap-3 font-display text-[0.9375rem] leading-snug font-semibold tracking-tight text-current/80 sm:mt-7 sm:inline-flex sm:w-auto sm:items-center sm:rounded-full sm:bg-current/8 sm:py-2.5 sm:pr-6 sm:pl-4.5 sm:text-current">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-2.5 shrink-0 rounded-full bg-neon sm:mt-0"
                  />
                  Alle Geräte sofort verfügbar, Probefahrt vor Ort
                </p>
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
                  steht an `components/ui/stars.tsx`.

                  Und als ein Gegenstand, nicht als drei: Gestapelt standen
                  hier auf dem Telefon vier Kreise, darunter eine Note mit
                  Sternen, darunter eine Zeile mit dem Google-Zeichen und
                  darunter ein Zitat an einer Randlinie – vier Blöcke in vier
                  verschiedenen Abständen, die alle dasselbe sagen und die
                  nichts zusammenhält. Jetzt eine Fläche mit Haarlinie: oben
                  die Note samt Anzahl, unten die Stimme im Wortlaut. Die
                  Gesichter stehen in derselben Zeile wie die Note, weil sie
                  ihre Herkunft sind. */}
              <Reveal immediate delay={60}>
                <div className="mt-7 max-w-[46ch] overflow-hidden rounded-md border border-current/12 bg-current/5 sm:mt-9">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-current/12 px-5 py-4">
                    <div
                      aria-hidden="true"
                      className="flex items-center -space-x-1.5 sm:-space-x-2.5"
                    >
                      {testimonials.map((item) => (
                        <span
                          key={item.author}
                          className="grid size-9 place-items-center rounded-full border-2 border-ink bg-silver/12 font-display text-xs font-bold tracking-wide"
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

                  {/* Hier stand die kürzeste Rezension im Wortlaut. Sie steht
                    auf derselben Seite ein zweites Mal: `leadReview` kommt aus
                    derselben `testimonials`-Liste, die das Band der
                    Kundenstimmen rendert – gemessen 4300 px auseinander, aber
                    Wort für Wort dasselbe Zitat.

                    Der Beleg braucht es hier auch nicht. Note, Anzahl und die
                    drei Gesichter sagen im Kopfbereich, was zu sagen ist; der
                    Wortlaut ist die Aufgabe der Sektion weiter unten. Statt
                    des Zitats jetzt der Weg dorthin – und damit ist die Karte
                    eine Aussage mit einem Ziel statt zweier Aussagen. */}
                  <Link
                    href="#kundenstimmen"
                    className="press group flex items-center justify-between gap-3 px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-current/6"
                  >
                    Was drei Kunden geschrieben haben
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-current/50 transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
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
          className="grid grid-cols-2 gap-x-8 gap-y-10 pt-8 pb-12 lg:grid-cols-4 lg:gap-x-10 lg:pt-10 lg:pb-24"
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
