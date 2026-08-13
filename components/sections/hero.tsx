import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Seal } from "@/components/brand/seal";
import { Reveal } from "@/components/motion/reveal";
import { Velaris } from "@/components/motion/velaris";
import { BorderBeamPanel } from "@/components/ui/border-beam-panel";
import { ButtonLink } from "@/components/ui/button";
import { PhoneButton } from "@/components/ui/phone-button";
import { Container } from "@/components/ui/section";
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
  { value: "bis 25 km", label: "Einzugsgebiet um Neuenstadt" },
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

            8/4 statt 7/5: Die erste Zeile „E-Scooter reparieren" belegt im
            Browser gemessen 654 px. Sieben Spalten geben 702, acht geben 808 –
            sieben würden also gerade eben reichen, aber ohne Reserve für einen
            längeren Satz. Die Aufteilung ist damit nicht gesetzt, sondern
            ausgerechnet; derselbe Wert deckelt `--text-hero` bei 5 rem. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="lg:col-span-8">
            <Reveal immediate>
              <p className="eyebrow text-current/60">
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
                E-Scooter <Mark>reparieren</Mark> statt ersetzen
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
              <p className="mt-5 text-sm text-current/65">
                Bremsen und Reifen meist am selben Tag
              </p>
            </Reveal>
          </div>

          <Reveal immediate className="relative lg:col-span-4 lg:col-start-9">
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
                alt="Generalüberholter E-Scooter mit Skope-Qualitätssiegel in Studioaufnahme"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 32vw"
                className="object-cover"
              />
            </BorderBeamPanel>

            {/* Das Siegel sitzt auf der Kante des Bildes und ist die einzige
                helle Fläche im Hero. Genau deshalb funktioniert es: Auf einer
                durchgehend schwarzen Sektion zieht ein Silberblock den Blick
                stärker als jede Farbe – und er trägt eine Aussage, keine
                Dekoration. `on-light` dreht den Akzent im Kasten mit. */}
            <div className="lift mt-4 flex items-center gap-4 rounded-lg bg-silver py-4 pr-7 pl-4 text-ink on-light lg:absolute lg:-bottom-8 lg:-left-8 lg:mt-0">
              <Seal decorative compact className="size-14 shrink-0" />
              <div>
                <p className="font-display text-sm font-bold">
                  {proof.sealName}
                </p>
                <p className="text-xs text-current/70">
                  Jedes Gerät geprüft, bevor es verkauft wird
                </p>
              </div>
            </div>
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
