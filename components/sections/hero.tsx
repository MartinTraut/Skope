import Image from "next/image";

import { GoogleMark } from "@/components/brand/google-mark";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/section";
import { initials, Stars } from "@/components/ui/stars";
import { testimonials } from "@/lib/data/testimonials";
import { inventoryFacts } from "@/lib/inventory";
import { GeneratedMark } from "@/components/ui/generated-mark";
import { getGoogleRating } from "@/lib/google-rating";
import { proof } from "@/lib/site";
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

/* `short` ist die Beschriftung unter `sm`. Dort standen die vollen Sätze
   zwei- bis dreizeilig unter jeder Zahl („Einstiegspreis bis 599,99 €,
   Endpreis ohne USt."), und das Band war mit 380 px der schwerste Block des
   Kopfbereichs. Am Telefon reicht das Stichwort; der Satz steht ab `sm`. */
const stats = [
  {
    value: `${facts.count}`,
    label: "geprüfte Geräte vorrätig",
    short: "Geräte vorrätig",
  },
  /* Die Obergrenze steht in der Zeile darunter und nicht mehr in einer
     zweiten Kachel eine Bildschirmhöhe tiefer – siehe den Kommentar am
     Kennzahlenband in `inventory-teaser.tsx`. */
  /* Ohne Preise (leerer Bestand) fällt die Kachel weg statt „null" zu zeigen. */
  ...(facts.priceFrom && facts.priceTo
    ? [
        {
          value: facts.priceFrom,
          label: `Einstiegspreis bis ${facts.priceTo}, Endpreis ohne USt.`,
          short: "Einstiegspreis",
        },
      ]
    : []),
  {
    value: `${proof.warrantyYears} Jahr`,
    label: "Gewährleistung auf jedes Gerät",
    short: "Gewährleistung",
  },
  {
    value: `${proof.repairs}+`,
    label: "reparierte E-Scooter in eigener Werkstatt",
    short: "reparierte E-Scooter",
  },
];

export async function Hero() {
  const googleRating = await getGoogleRating();

  return (
    <section className="relative isolate flex flex-col overflow-hidden bg-ink pb-0 text-silver on-dark lg:min-h-svh">
      {/* Zwei Zonen, nicht eine: Oben die Bildzone mit Text darauf, darunter
          das Beweisband auf reiner Tinte.

          Grund ist Geometrie, keine Gestaltungslaune. Die Aufnahme ist
          16:10; über die ganze Sektion gelegt (rund 1400 px hoch bei 1512 px
          Breite) müsste `object-cover` sie auf 224 % hochziehen, und vom
          Roller bliebe ein Ausschnitt der Lenkstange. Auf die Textzone
          begrenzt liegt das Verhältnis bei etwa 1,6 – dem der Aufnahme. */}
      {/* `flex-1`: Was von der Fensterhöhe übrig bleibt, bekommt die Bildzone –
          nicht der Abstand unter den Kennzahlen.

          Vorher stand die Sektion auf ihrer Inhaltshöhe. Nachdem die beiden
          Knöpfe weggefallen waren, war sie bei 1990 × 1080 rund 130 px kürzer
          als das Fenster: Unter den Kennzahlen lag ein Streifen Tinte, und
          weil die Aufnahme `contain` in der Bildzone liegt, war sie um
          dieselbe Strecke geschrumpft – der Roller stand zu klein und zu weit
          oben. Jetzt wächst die Zone mit, der Roller sitzt wieder auf seiner
          Standfläche direkt über dem Kennzahlenband, und die Sektion endet
          genau an der Fensterkante.

          Nur ab `lg`. Am Telefon ist die Sektion ohnehin höher als das
          Fenster, dort würde `min-h-svh` nichts festlegen und `flex-1` nichts
          verteilen. */}
      <div className="relative lg:flex-1">
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

          Die Fläche endet 2,5 rem *unter* der Bildzone, nicht an ihrer
          Unterkante. Die Aufnahme liegt `contain` und unten verankert, steht
          also immer auf dem Boden dieser Fläche – bündig mit der Zone stand der
          Roller damit auf einer Linie mit der letzten Textzeile und wirkte
          angehoben. Die 40 px reichen in den oberen Rand des Kennzahlenbands
          hinein; dort liegt nur der Auslauf in die Tinte, und die Fläche steht
          ohnehin auf `-z-10` hinter allem.

          Ab der Grenze bekommt die Fläche seitlich denselben weichen Auslauf,
          den sie unten schon hat: Sonst steht dort, wo das Foto aufhört, eine
          harte senkrechte Kante mitten in der Sektion. Der Auslauf hängt an
          `min-[104rem]`, damit er unterhalb der Grenze nicht den Roller
          anschneidet – dort steht er am rechten Bildrand. */}
        <div className="pointer-events-none absolute top-0 bottom-[-2.5rem] left-1/2 -z-10 hidden w-full max-w-[104rem] -translate-x-1/2 overflow-hidden lg:block min-[104rem]:[mask-image:linear-gradient(to_right,transparent,black_7rem,black_calc(100%-7rem),transparent)]">
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
          {/* Die Kennzeichnung liegt über dem Schleier, nicht darunter: Der
              Schleier zieht die rechte Bildhälfte auf ein Fünftel der
              Helligkeit, und ein Hinweis, den man suchen muss, ist keiner.

              Sie steht in der äußersten unteren Ecke, nicht auf dem Motiv:
              11 rem über der Kante lag sie auf dem hellen Werkstattboden und
              damit auf der Aufnahme selbst. Gemessen bei 1512 px endet die
              Kennzahlenreihe bei 1056 px, die Sektion bei 1155 – unterhalb
              davon liegt nur noch der Auslauf in die Tinte. Dort ist die
              Marke vollständig lesbar (Silber auf Tinte) und stört das Bild
              nicht mehr. Erkennbar bleibt sie, weil sie im selben Bildfeld
              steht; Art. 50 Abs. 4 verlangt Erkennbarkeit, nicht Auffälligkeit. */}
          <GeneratedMark
            src="/img/hero-werkstatt.jpg"
            className="right-[max(1.5rem,env(safe-area-inset-right))] bottom-6"
          />
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
        <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[max(min(64svh,30rem),min(56vw,30rem))] w-screen -translate-x-1/2 overflow-hidden sm:h-[max(min(58svh,26rem),min(56vw,26rem))] lg:hidden">
          {/* Die Aufnahme beginnt unter der Kopfzeile, nicht am oberen Rand
              der Bühne.

              Der Grund ist die Deckung: `object-cover` skaliert hier über die
              Höhe (Bühne 390 × 416, Aufnahme 2400 × 1507), der Roller füllt
              also immer die volle Höhe der Fläche, in der er liegt – sein
              Lenker klebte damit an der Oberkante und lief quer durch das
              Wortzeichen der Kopfzeile. Kein Bildausschnitt behebt das:
              `object-position` in der Senkrechten ist wirkungslos, solange die
              Aufnahme in der Höhe hineinpasst.

              Deshalb eine eigene Fläche, die 4 rem tiefer anfängt. Der Roller
              wird dadurch rund 15 % kleiner und sitzt mit seinem Lenker gut
              20 px unter der Kopfzeile. Der Verlauf darüber bleibt an der
              Bühne und damit unverändert – die gemessenen Kontraste hinter
              Überschrift und Fließtext hängen an seinen Stopps.

              Die Maske nimmt der neuen Oberkante die Kante: Ohne sie stünde
              bei 4 rem eine waagerechte Naht zwischen leerer Tinte und dem zu
              62 % durchscheinenden Bild. */}
          <div className="absolute inset-x-0 top-16 bottom-0 [mask-image:linear-gradient(to_bottom,transparent,black_2rem)]">
            <Image
              src="/img/hero-werkstatt.jpg"
              alt="Geprüfter E-Scooter in der Werkstatt, dahinter die Werkzeugwand unter der Neonröhre"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[82%_center] brightness-115"
            />
          </div>
          {/* Rechts, und so tief wie die Bühne es zulässt.

              Die untere Hälfte der Bühne ist besetzt: Gemessen bei 320 px
              beginnt die Auszeichnungszeile bei 148 px, die Überschrift bei
              207, der Fließtext bei 384 – die Bühne endet bei 416. Unterhalb
              der Überschrift bleibt nirgends ein freier Streifen, und die
              Bühne liegt mit `-z-10` *hinter* dem Text: Eine Marke dort wäre
              nicht dezent, sondern von Buchstaben überdeckt und damit keine
              Kennzeichnung mehr.

              Frei ist genau der Streifen zwischen Kopfzeile und
              Auszeichnungszeile. Dort steht sie rechts statt links und 1 rem
              unter der Kopfzeile – 30 px unter dem Menüknopf (44 px), damit
              sie nicht als dessen Beschriftung gelesen wird.

              Der Abstand stand auf 2,75 rem und war seit der Straffung des
              Kopfbereichs am 05.09. zu groß: Bei 320 px bricht die
              Auszeichnungszeile zweizeilig um und begann bei 121 px, die
              Marke lag von 116 bis 135 px – sie stand quer über der Zeile.
              Jetzt 88 bis 107 px, gemessen 14 px darüber. */}
          <GeneratedMark
            src="/img/hero-werkstatt.jpg"
            className="right-[max(0.75rem,env(safe-area-inset-right))] bottom-[25%] sm:top-[calc(var(--header-h)+1rem)] sm:right-[max(1.5rem,env(safe-area-inset-right))] sm:bottom-auto"
          />
          <div className="hero-stage-scrim absolute inset-0 sm:bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--color-ink)_45%,transparent)_0%,color-mix(in_oklab,var(--color-ink)_8%,transparent)_38%,color-mix(in_oklab,var(--color-ink)_80%,transparent)_74%,var(--color-ink)_100%)]" />
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
        <Container className="relative pt-[var(--hero-head)] pb-6 lg:pt-[clamp(4rem,2rem+6svh,6.5rem)] md:pb-8">
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
              {/* Am Telefon steht diese Zeile nicht mehr hier, sondern
                  gekürzt über den Sternen – siehe den Kommentar dort. */}
              <Reveal immediate className="hidden sm:block">
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
              <h1 className="rise-line text-[length:var(--text-hero)] sm:mt-6 lg:w-[115%]">
                <span>
                  <span className="block">
                    <Mark>Geprüfte</Mark> E-Scooter
                  </span>
                  <span className="block">gebraucht kaufen</span>
                </span>
              </h1>

              {/* Am Telefon steht der Lead nicht. Vier Zeilen Fließtext
                  zwischen Überschrift und Beleg waren dort der längste Block
                  des Kopfbereichs und lagen genau auf dem Roller – und was
                  sie sagt, sagt die Seite unmittelbar darunter noch einmal:
                  die Prüfung im Kennzahlenband, die Werkstatt in den Säulen,
                  die Region in `Region`. Ab `sm` bleibt sie. */}
              <Reveal immediate className="hidden sm:block">
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
                <p className="mt-6 max-w-[42ch] text-[length:var(--text-lead)] leading-relaxed text-current/75">
                  Jedes Gerät wird hier geprüft und aufbereitet – in der
                  Werkstatt, die es danach auch repariert und wartet. In
                  Neuenstadt am Kocher, für Heilbronn, Neckarsulm und die
                  Region.
                </p>
              </Reveal>

              {/* Hier stand bis zum 05.09.2026 die Bestandszeile („Alle 13
                  Geräte vor Ort, Probefahrt möglich – zum Bestand") als
                  Pille mit Neonpunkt. Auf Ansage entfernt: Die Zahl steht im
                  Band darunter, der Weg in den Bestand in der Kopfzeile und
                  im Teaser. Nicht zurückbauen. */}

              {/* Referenzen im Kopfbereich, nicht erst in der vierten Sektion.
                  Die Rezensionen standen bisher unterhalb von Ablauf und
                  Werkstatt – wer nach dem Kopfbereich weiterklickt, hatte bis
                  dahin nur unsere eigenen Aussagen gelesen. Der Beleg gehört
                  dorthin, wo die Entscheidung fällt.

                  Es ist derselbe Bestand wie im Band weiter unten, nur der
                  Auszug: die Gesichter aller Stimmen, die Note und die
                  Anzahl. Gold statt Neon, weil das hier ein
                  Zitat von Google ist und kein Handlungsangebot – die Regel
                  steht an `components/ui/stars.tsx`.

                  Ohne Fläche, ohne Kante, ohne zweite Zeile: Note, Sterne,
                  Anzahl und die drei Gesichter stehen frei auf der Tinte.

                  Eine Kachel mit Rahmen und Füllung stand hier eine Runde
                  lang und war ein Rückschritt in dieselbe Richtung wie die
                  Zusage darüber: ein weiteres Rechteck in Knopfgröße unter
                  zwei Knöpfen, dazu eine Haarlinie und darunter ein Verweis
                  („Was drei Kunden geschrieben haben") – aus einem Beleg
                  wurde ein drittes Bedienelement. Der Verweis ist weg: Die
                  Kundenstimmen stehen weiter unten auf derselben Seite, und
                  wer vom Kopfbereich aus irgendwohin geht, soll ans Telefon
                  oder in den Bestand.

                  Was bleibt, ist die Aussage selbst. Auf Tinte trägt sie das
                  Gold der Sterne und das vierfarbige Google-Zeichen; beides
                  ist als Zitat sofort erkennbar und braucht keinen Rahmen,
                  der es als Karte ausweist. Die Gesichter stehen in derselben
                  Zeile wie die Note, weil sie ihre Herkunft sind. */}
              {/* Zwei Zeilen am Telefon, eine ab `sm` – und keine Spalte
                  neben den Gesichtern. Vorher hing rechts neben den drei
                  36-px-Kreisen ein 48 px hoher Zweizeiler, mittig dazu
                  gesetzt: Die Note ragte oben über die Kreise hinaus, die
                  Quellenzeile unten darunter, und der ganze Block las sich
                  gegen den linken Rand der Überschrift als verschoben. Jetzt
                  stehen Gesichter, Note und Sterne auf einer Zeile mit
                  gleicher Mitte (36 px), die Quelle als eigene Zeile darunter
                  an derselben linken Kante wie alles andere in der Spalte.

                  Das Google-Zeichen misst 12 px statt 14: Neben 14-px-Text
                  ist die Versalhöhe rund 10 px, ein 14-px-„G" stand darüber
                  hinaus und wirkte wie ein Fremdkörper neben der Zeile. Es
                  hängt jetzt direkt am Wort, das es belegt. */}
              <Reveal immediate delay={60}>
                {/* Am Telefon steht die Auszeichnung hier statt über der
                    Überschrift: Der Kopfbereich beginnt dann mit dem Satz,
                    für den die Seite gefunden werden soll, und die Zeile
                    darüber gibt den oberen Rand der Aufnahme frei.

                    Gekürzt auf ein Wort. „· Neuenstadt" stand über der
                    Überschrift, weil dort der Ort die halbe Suchanfrage
                    trägt; über den Sternen wäre es eine zweite Herkunft
                    neben „Rezensionen bei Google" in derselben Gruppe. Der
                    Ort steht am Telefon weiterhin im Seitentitel, in
                    `Region` und im Fußbereich. */}
                <p className="eyebrow mt-9 text-current/90 sm:hidden">
                  Generalüberholt
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2.5 sm:mt-7 sm:gap-x-5">
                  {/* Die Gesichter erst ab `sm`. Am Telefon ist der Beleg eine
                      Zeile: Sterne, Note, Anzahl – der Kopfbereich trug dort
                      sieben Blöcke gleicher Schwere übereinander, und die drei
                      Kreise waren der einzige, der nichts sagt, was die Zeile
                      daneben nicht schon sagt. */}
                  <div
                    aria-hidden="true"
                    className="hidden items-center -space-x-1.5 sm:flex sm:-space-x-2.5"
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

                  <p className="flex items-center gap-2.5">
                    <span className="tabular font-display text-lg leading-none font-bold tracking-tight">
                      {googleRating.value}
                    </span>
                    <Stars
                      rating={googleRating.stars}
                      className="size-4"
                      label={`${googleRating.value} von 5 Sternen bei Google`}
                    />
                  </p>

                  <p className="flex basis-full items-center gap-2 text-sm leading-none text-current/70 sm:basis-auto sm:border-l sm:border-current/15 sm:pl-5">
                    {googleRating.count} Rezensionen bei
                    <span className="inline-flex items-center gap-1.5">
                      <GoogleMark className="size-3 shrink-0" />
                      Google
                    </span>
                  </p>
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
          className="grid grid-cols-2 gap-x-6 gap-y-7 pt-6 pb-10 sm:gap-x-8 sm:gap-y-10 sm:pb-12 lg:grid-cols-4 lg:gap-x-10 lg:pt-4 lg:pb-14"
        >
          {/* Ab `lg` mittig in der eigenen Spalte, darunter linksbündig.

              Vier gleich breite Spalten mit linksbündigem Inhalt sehen
              ungleichmäßig aus, sobald die Inhalte verschieden lang sind: „13"
              füllt 60 von 376 px, „Einstiegspreis bis 599,99 €, Endpreis ohne
              USt." fast die ganze Spalte. Der Abstand *zwischen* den Blöcken
              ist damit an jeder Naht ein anderer, obwohl das Raster
              gleichmäßig ist – man sieht die Lücke, nicht die Spalte.

              Mittig gesetzt liegt um jeden Block links und rechts derselbe
              Rest, und die Reihe liest sich als vier gleich schwere Angaben.
              Die Beschriftung ist zusätzlich auf 26 Zeichen begrenzt: Ohne
              Deckel läuft die längste über die volle Spaltenbreite und die
              kürzeste über ein Drittel – nebeneinander wieder derselbe Effekt,
              nur eine Zeile tiefer.

              Am Telefon bleibt es linksbündig. Dort stehen zwei Spalten, die
              Beschriftungen laufen ohnehin über zwei bis drei Zeilen, und
              zentrierter Flattersatz über drei Zeilen liest sich schlechter
              als linksbündiger. */}
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-0 lg:text-center">
              <p className="tabular font-display text-[length:var(--text-stat)] leading-none font-bold text-accent">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-snug text-current/70 sm:mt-3 lg:mx-auto lg:max-w-[26ch]">
                <span className="sm:hidden">{stat.short}</span>
                <span className="hidden sm:inline">{stat.label}</span>
              </p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
