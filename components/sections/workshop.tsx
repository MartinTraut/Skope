import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { GeneratedMark, GeneratedNote } from "@/components/ui/generated-mark";
import { Container, Section } from "@/components/ui/section";
import { checkupIncludes, turnaround } from "@/lib/data/services";

/**
 * Die Vertrauens-Sektion: konkrete Prüfschritte und echte Bearbeitungszeiten
 * statt Adjektiven. Heller Grund als Ruhepunkt zwischen zwei dunklen Zonen.
 */
export function Workshop() {
  return (
    <Section tone="ink">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Bild – hochformatig, bricht das Raster der übrigen Sektionen */}
          {/* Ab `lg` bestimmt die Textspalte die Höhe, das Bild füllt sie:
              Gemessen bei 1999 × 1123 war die Textspalte 902 px hoch, das
              4/5-Bild 770 – und die ganze Sektion 1110 px, die Knöpfe damit
              unter der Fensterkante. Jetzt ist die Textspalte auf rund 690 px
              gestrafft und das Bild wächst mit ihr statt mit einem festen
              Seitenverhältnis. Am Telefon bleibt 4/5. */}
          <Reveal className="flex flex-col lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-ink-700 lg:aspect-auto lg:min-h-[28rem] lg:flex-1">
              <Image
                src="/img/werkstatt-service.jpg"
                alt="Symbolbild: Prüfung des Klappscharniers an einem eingespannten E-Scooter mit dem Drehmomentschlüssel"
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) calc(100vw - 5rem), calc(100vw - 3rem)"
                className="parallax object-cover"
              />
              <GeneratedMark src="/img/werkstatt-service.jpg" />
            </div>
            {/* Die Zeile nannte den Ort: „Werkstatt Im Kampfrad 3, Neuenstadt
                am Kocher." Unter einem erzeugten Motiv ist das keine
                Bildunterschrift mehr, sondern eine Tatsachenbehauptung über
                den eigenen Betrieb – genau der Fall, den § 5 UWG meint. Sie
                benennt jetzt den Vorgang, nicht den Ort. Die Adresse steht
                unverändert im Fußbereich, auf /kontakt und im Schema. */}
            <p className="mt-4 text-sm text-current/65">
              Sicherheits-Checkup an einem Klappscharnier.{" "}
              <GeneratedNote src="/img/werkstatt-service.jpg" />
            </p>
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
              <ul className="mt-8 grid gap-x-10 gap-y-0 sm:grid-cols-2">
                {checkupIncludes.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-4 border-b border-silver/12 py-3"
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
              <div className="mt-9">
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
