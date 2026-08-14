import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { GoogleMark } from "@/components/brand/google-mark";
import { Reveal } from "@/components/motion/reveal";
import { Velaris } from "@/components/motion/velaris";
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
  { value: "59,99 €", label: "kompletter Sicherheits-Checkup" },
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
    <section className="relative isolate overflow-hidden bg-ink pt-28 pb-0 text-silver md:pt-32 on-dark">
      {/* Der bewegte Grund ersetzt den vorherigen radialen Neonschein – der
          Schein steckt jetzt im Shader, an derselben Stelle rechts oben.

          Er hat hier eine zweite Aufgabe außer Tiefe: Die Glasleiste des
          Seitenkopfs liegt darüber und hatte bis eben nichts zu brechen. Über
          einer glatten schwarzen Fläche kann auch das beste Glas nur grau
          aussehen. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <Velaris />
        {/* Der Schleier trennt Leuchten von Lesbarkeit – siehe .hero-scrim. */}
        <div className="hero-scrim absolute inset-0" />
      </div>

      <Container className="relative">
        {/* Bild und Text beginnen auf derselben Linie.

            Vorher lief die Überschrift über die volle Breite und alles
            Weitere darunter – dadurch stand das obere rechte Viertel des
            Kopfbereichs leer, rund 290 px hoch über die halbe Seitenbreite.
            Auf Schwarz fällt so ein Loch doppelt auf, weil nichts es füllt.

            7/5 statt 8/4: Die erste Zeile „E-Scooter reparieren" belegt im
            Browser gemessen 654 px, sieben Spalten geben 702 – es passt, mit
            knapper Reserve. Die fünfte Spalte geht an das Bild, weil es der
            einzige Gegenstand in dieser Sektion ist und in vier Spalten
            (rund 390 px) neben einer 5-rem-Überschrift zu klein blieb, um als
            Hauptmotiv zu wirken. Derselbe Wert deckelt `--text-hero`. */}
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

              Ein Block, keine zwei. Vorher stand jede Zeile in einer eigenen
              Maske und stieg mit 110 ms Versatz auf; die Zäsur nach
              „reparieren" war damit fest verdrahtet. Der Satz bricht jetzt
              dort, wo die Breite es verlangt, und `text-wrap: balance` aus
              den Basisregeln verteilt die Zeilen gleichmäßig. Die Maske
              bleibt, sie umschließt nun die ganze Überschrift.
            */}
            <h1 className="rise-line mt-6 text-[length:var(--text-hero)]">
              <span>
                E-Scooter <Mark>reparieren</Mark> statt neu kaufen
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
              <p className="mt-7 inline-flex items-center gap-3 rounded-full bg-current/8 py-2.5 pr-6 pl-4.5 font-display text-[0.9375rem] font-semibold tracking-tight">
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full bg-neon"
                />
                Bremsen und Reifen meist am selben Tag
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

          <Reveal immediate className="relative lg:col-span-5 lg:col-start-8">
            {/* Das Studiofoto ist Hochformat, 1409 x 1750, also 4:5 – und der
                Roller füllt 81 % der Bildhöhe. In einem 16:10-Rahmen schnitt
                `object-cover` oben den Lenker und unten das Vorderrad ab. Der
                Rahmen trägt deshalb jetzt das native Seitenverhältnis: kein
                Beschnitt, und die schmalere Spalte hält die Höhe im Rahmen. */}
            {/* Der Lichtring ersetzt hier den Schlagschatten. Auf der
                schwarzen Sektion hat das Studiofoto einen fast schwarzen
                Hintergrund – ohne eine leuchtende Kante schwimmt es
                randlos in der Fläche und liest sich nicht als Objekt.
                `radius` muss dem `rounded-lg` der Fläche darunter
                entsprechen, sonst schneidet der Ring die Ecken. */}
            <BorderBeamPanel
              radius={28}
              thickness={2}
              beams={2}
              className="lift-lg aspect-[4/5] w-full overflow-hidden bg-ink-700"
            >
              <Image
                src="/img/scooter-studio.jpg"
                alt="Geprüfter E-Scooter mit Prüfanhänger vor der Werkstattwand mit dem Skope-Schild"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </BorderBeamPanel>

          </Reveal>
        </div>

        {/* Beweisband schließt den Hero ab und leitet in die Seite über.

            Ohne Linien. Vorher stand um die vier Werte ein Raster aus Ober-,
            Unter- und Trennkanten – auf Schwarz liest sich das als Kasten, und
            ein Kasten ist genau die Baukasten-Anmutung, die der Rest der Seite
            vermeidet. Die Trennung leisten jetzt der Abstand und der
            Neon-Grad; das reicht, weil die vier Blöcke ohnehin je aus einer
            großen Zahl und einer kleinen Zeile bestehen. */}
        <Reveal
          delay={80}
          className="mt-20 grid grid-cols-2 gap-x-8 gap-y-10 pb-20 lg:mt-24 lg:grid-cols-4 lg:gap-x-10 lg:pb-24"
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
