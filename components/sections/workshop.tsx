import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { checkupIncludes, turnaround } from "@/lib/data/services";
import { cn } from "@/lib/utils";

/* Die beiden Aufnahmen stehen hier und nicht in `workshop-photos.ts`: Jene
   Liste ist die Bahn auf `/ueber-uns` und wird zur Bauzeit gegen das
   Dateisystem geprüft – fehlt eine Datei, fällt sie dort still heraus. An
   dieser Stelle wäre das falsch: Die Sektion hat einen festen Platz für zwei
   Motive, und eine Lücke darin ist ein Fehler, kein Rückfall. Die
   Beschreibungen sind wortgleich mit den Einträgen dort. */
const workshopStills = [
  {
    src: "/img/werkstatt/reparatur-trittbrett.jpg",
    alt: "Geöffnetes Trittbrett eines E-Scooters von oben, eine Hand hebt die Abdeckung über Kabelbaum und Akkuanschluss an",
  },
  {
    src: "/img/werkstatt/reparatur-stecker.jpg",
    alt: "Hand hält einen durchgeschmorten Steckverbinder mit verkohltem Schrumpfschlauch über dem geöffneten Trittbrett eines E-Scooters",
  },
];

/**
 * Die Vertrauens-Sektion: konkrete Prüfschritte und echte Bearbeitungszeiten
 * statt Adjektiven. Heller Grund als Ruhepunkt zwischen zwei dunklen Zonen.
 */
export function Workshop() {
  return (
    <Section tone="ink">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Ab `lg` bestimmt die Textspalte die Höhe, die Bildspalte füllt
              sie: Gemessen bei 1999 × 1123 war die Textspalte 902 px hoch,
              ein festes 4/5-Bild 770 – und die ganze Sektion 1110 px, die
              Knöpfe damit unter der Fensterkante. Jetzt ist die Textspalte
              auf rund 690 px gestrafft und die Bilder wachsen mit ihr statt
              mit einem festen Seitenverhältnis. Am Telefon bleibt 4/5. */}
          {/* Zwei Aufnahmen, und ihre Anordnung folgt der Spaltenform.
              Am Telefon ist die Spalte breit und flach – dort stehen die
              beiden Hochformate nebeneinander (gemessen bei 390 px je
              165 × 206 px, zusammen 206 statt der 428 px, die das eine Bild
              im Format 4/5 brauchte). Ab `lg` ist die Spalte schmal und hoch
              und wird von der Textspalte bemessen: dort untereinander, je
              zur Hälfte der Texthöhe (`auto-rows-fr` an einer Fläche, die
              `flex-1` ist).

              Warum überhaupt zwei: Die Sektion zählt auf, was für 59,99 €
              geprüft wird – Bremsen, Akku, Elektronik, Verschleißteile. Ein
              geöffnetes Trittbrett zeigt den Zugang, der durchgeschmorte
              Steckverbinder zeigt den Befund. Zusammen belegen sie beide
              Hälften des Satzes; einzeln belegt jede nur eine. */}
          <Reveal className="flex flex-col lg:col-span-5">
            <div className="grid auto-rows-fr grid-cols-2 gap-3 lg:grid-cols-1 lg:min-h-[28rem] lg:flex-1">
              {workshopStills.map((photo) => (
                <div
                  key={photo.src}
                  className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ink-700 lg:aspect-auto"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 40vw, (min-width: 768px) calc(50vw - 3rem), calc(50vw - 2rem)"
                    className="parallax object-cover"
                  />
                </div>
              ))}
            </div>
            {/* **Echte Aufnahmen, keine Symbolbilder – deshalb kein
                `GeneratedMark`.** Hier lag bis zum 20.09.2026
                `werkstatt-service.jpg`, eines der acht erzeugten Motive. Für
                eine Sektion, die aufzählt, was für 59,99 € *tatsächlich*
                passiert, war ein erfundenes Bild die schlechteste Wahl der
                ganzen Seite: Der Absatz belegt eine Prüfung, das Bild belegte
                nichts. Jetzt stehen dort zwei Aufnahmen aus der eigenen
                Werkstatt (dieselben Motive wie in
                `lib/data/workshop-photos.ts`).

                Damit trägt die Startseite ein erzeugtes Motiv weniger. Die
                Datei bleibt in `generated-images.ts` – sie ist weiter im
                Projekt, und die Liste beschreibt die Bilder, nicht ihre
                Verwendung.

                Keine Bildunterschrift: Der Ort gehört nicht darunter – unter
                einem erzeugten Motiv wäre er eine Tatsachenbehauptung
                (§ 5 UWG) gewesen, und auch unter einer echten Aufnahme sagt
                die Sektion ihn nicht besser als die Seite es ohnehin tut. */}
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-current/90">Der Sicherheits-Checkup</p>
              <h2 className="mt-5 text-[length:var(--text-display)]">
                {/* Der Preis trägt die Aussage der Zeile, also bekommt er den
                    Akzent – die harte Zahl ist einer der drei Fälle, für die
                    Neon reserviert ist. Die Sektion ist dunkel, dort ist Neon
                    Schrift (14,8:1 auf Tinte). */}
                Was für <span className="text-accent">59,99&nbsp;€</span>{" "}
                tatsächlich passiert.
              </h2>
              <p className="mt-5 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-current/65">
                Eine vollständige Aufnahme des Zustands in sechs Positionen:
                dieselbe Prüfung, die jeder Scooter durchläuft, bevor er unser
                Qualitätssiegel bekommt.
              </p>
            </Reveal>

            <Reveal delay={80}>
              {/* Am Telefon drei Positionen statt sechs, dazu der Weg zur
                  vollständigen Liste.

                  Die sechs Positionen stehen ausgeschrieben auf `/reparatur`,
                  auf `/e-scooter` und auf jeder Geräteseite – auf der
                  Startseite sind sie der Beleg dafür, dass es eine Prüfung
                  gibt, nicht ihre Dokumentation. Sechs Zeilen plus
                  Bearbeitungszeiten waren dort gemessen der längste Block
                  zwischen zwei Aktionen. */}
              <ul className="mt-8 grid gap-x-10 gap-y-0 sm:grid-cols-2">
                {checkupIncludes.map((item, i) => (
                  <li
                    key={item}
                    className={cn(
                      "flex items-baseline gap-4 border-b border-silver/12 py-3",
                      i > 2 && "hidden sm:flex",
                    )}
                  >
                    <span className="tabular font-display text-xs font-semibold text-current/65">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-current/80">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-9 hidden sm:block">
                <p className="eyebrow-plain text-current/90">
                  Wie lange es dauert
                </p>
                {/* Drei Angaben, die man vergleicht, stehen nebeneinander –
                    als drei Zeilen mit zwei Enden waren es 175 px für
                    neun Wörter. Am Telefon gestapelt (gemessen bei 390 px:
                    „meist am selben Tag" stieß rechts an den Satzspiegel).
                    Bezeichnung oben, Wert darunter, in jeder Breite dieselbe
                    Form. */}
                <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-3">
                  {turnaround.map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-col gap-1 border-t border-silver/12 pt-3"
                    >
                      <dt className="text-sm text-current/70">{row.label}</dt>
                      <dd className="font-display font-semibold tracking-tight text-balance text-silver">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Eine Hauptaktion, ein Textlink daneben: Dasselbe Button-Paar
                  stand auf der Startseite vorher viermal. Der zweite Weg bleibt
                  erhalten, tritt aber nicht mehr als gleichwertig auf. */}
              <p className="mt-6 text-sm leading-relaxed text-current/70 sm:hidden">
                Alle {checkupIncludes.length} Positionen und die
                Bearbeitungszeiten stehen auf der{" "}
                <Link
                  href="/reparatur"
                  className="font-semibold underline underline-offset-2"
                >
                  Reparaturseite
                </Link>
                .
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <ButtonLink href="/reparatur#anfrage" size="lg">
                  Reparatur anfragen
                </ButtonLink>
                <ButtonLink
                  href="/wartungsvertrag"
                  variant="quiet"
                  size="lg"
                  className="text-silver"
                >
                  Checkup im Vertrag ab 17,99&nbsp;€
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
