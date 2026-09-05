import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/ui/mark";
import { GeneratedMark } from "@/components/ui/generated-mark";

const pillars = [
  {
    href: "/e-scooter",
    image: "/img/scooter-stadt.jpg",
    imageAlt:
      "Aufgeklappter E-Scooter auf dem Kopfsteinpflaster eines Marktplatzes, dahinter Fachwerkhäuser im Abendlicht",
    kicker: "Kaufen",
    title: "Geprüfte E-Scooter mit Gewährleistung",
    text: "Verkauft wird nur, was alle sechs Prüfpositionen bestanden hat. Und wenn nach dem Kauf etwas ist, kommen Sie in die Werkstatt zurück, die das Gerät kennt.",
    meta: "1 Jahr Gewährleistung",
  },
  {
    href: "/reparatur",
    image: "/img/akku-diagnose.jpg",
    imageAlt:
      "Kapazitätsmessung an einem geöffneten E-Scooter-Akku: Prüfspitzen an den Zellverbindern, daneben das Messgerät mit dem abgelesenen Wert",
    kicker: "Reparieren",
    title: "Erst messen, dann tauschen",
    text: "Fehlercode auslesen, Restkapazität messen, Ursache finden. Wir ersetzen kein Bauteil, das noch funktioniert, und legen vor jeder Arbeit einen Kostenvoranschlag vor.",
    meta: "Checkup 59,99 €",
  },
  {
    href: "/versicherung",
    image: "/img/scooter-allee.jpg",
    imageAlt:
      "Hinterrad eines E-Scooters mit Rücklicht und noch leerem Halter für das Versicherungskennzeichen, auf einem Weg zwischen Bäumen",
    kicker: "Absichern",
    title: "Versicherung und Kennzeichen über ERGO",
    text: "Die Haftpflicht ist für jeden E-Scooter über 6 km/h Pflicht. Wir vermitteln sie als ERGO-Partner deutschlandweit. Das Kennzeichen kommt innerhalb von fünf bis zehn Werktagen per Post.",
    meta: "ERGO Partner",
  },
];

export function Pillars() {
  return (
    <Section id="leistungen" tone="ink">
      <Container>
        <SectionHead
          eyebrow="Drei Wege, ein Ansprechpartner"
          title={
            <>
              Kaufen, reparieren, absichern: alles bei <Mark>derselben</Mark>{" "}
              Werkstatt.
            </>
          }
          lead="Der Unterschied zum Kleinanzeigen-Kauf: Wer Ihnen den Scooter verkauft, kann ihn auch Jahre später noch warten. Verkauf und Service liegen hier in einer Hand."
        />

        {/* `gap-px` erzeugte ohne Zellenhintergrund keine Trennlinie, sondern
            nur einen toten Pixel: Auf Mobile klebte die Meta-Zeile der einen
            Kachel direkt an der Oberkante der nächsten. */}
        {/* `lg:-mx-5` plus `lg:px-5` an jeder Kachel: gleiche Innenbreite in
            allen drei Spalten, und die Reihe schließt trotzdem bündig mit
            dem Abschnittskopf darüber ab. */}
        <div className="mt-16 grid gap-y-10 lg:-mx-5 lg:grid-cols-3 lg:gap-y-0">
          {pillars.map((pillar, i) => (
            /* Trennlinien und Innenabstände liegen auf dem Rasterkind, nicht
               auf dem Link. Vorher standen sie am Link mit `lg:first:…` –
               und der ist immer einziges Kind seines Reveal, `:first-child`
               traf also bei allen drei Kacheln. Die senkrechten Trennlinien
               sind deshalb nie erschienen. */
            /* Kein Versatz mehr zwischen den drei Kacheln, und zwar aus zwei
               Gründen. Der sichtbare: Die Innenabstände waren unsymmetrisch –
               die erste Spalte hatte nur rechts Luft, die mittlere links und
               rechts, die letzte nur links. Bei festem Seitenverhältnis ist
               ein schmaleres Bild ein niedrigeres Bild, die mittlere Kachel
               stand also dauerhaft tiefer als ihre Nachbarn. Jetzt tragen
               alle drei denselben Innenabstand.

               Der zweite: Die gestaffelte Einblendung liess die Reihe auch
               beim Hereinscrollen schief laufen. Drei gleichwertige Wege
               brauchen keine Reihenfolge – sie kommen als ein Band. */
            <Reveal
              key={pillar.href}
              className={cn(
                "border-t border-current/10 pt-8 lg:border-t-0 lg:px-5 lg:pt-0",
                i > 0 && "lg:border-l lg:border-current/10",
              )}
            >
              <Link
                href={pillar.href}
                className="press group flex h-full flex-col [--press-scale:0.985]"
              >
                {/* 4:3 statt 16:10 – rund 130 px mehr Bildhöhe pro Kachel.
                    Bei 16:10 war der Roller in einer Drittelspalte kaum
                    grösser als die Überschrift darunter. */}
                <div className="lift relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-ink-700">
                  {/* Beschreibender Alt-Text, nicht `alt=""`.
                      Die drei Aufnahmen sind der sichtbare Inhalt der Kacheln
                      und nicht ihr Schmuck – die dritte zeigt sogar genau das,
                      worum es geht: den leeren Halter für das
                      Versicherungskennzeichen. Als leeres Attribut waren sie
                      für Bildsuche und Antwortsysteme nicht vorhanden, und auf
                      der Startseite trugen damit vier von sieben Bildern keine
                      Beschreibung.

                      Die Texte beschreiben, was zu sehen ist, und wiederholen
                      nicht die Überschrift darunter – sonst hört man am
                      Vorleser dieselbe Zeile zweimal. */}
                  <Image
                    src={pillar.image}
                    alt={pillar.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) calc(100vw - 5rem), calc(100vw - 3rem)"
                    className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-4 left-4 rounded-md bg-ink/80 px-3 py-1.5 font-display text-xs font-semibold tracking-[0.14em] uppercase backdrop-blur-sm text-silver on-dark">
                    {pillar.kicker}
                  </span>
                  <GeneratedMark src={pillar.image} />
                </div>

                {/* Unter `lg` steht der Pfeil nicht neben der Überschrift,
                    sondern in der Kennzahlzeile. Gemessen bei 390 px: Der
                    Satz ist 342 px breit, Pfeil und Abstand nahmen 40 davon,
                    und „Erst messen, dann tauschen" braucht im Titelgrad
                    313 px – mit dem Pfeil daneben zwei Zeilen, ohne ihn eine.
                    Der frühere Deckel `max-w-[16ch]` zwang außerdem
                    „Versicherung und Kennzeichen über ERGO" auf drei Zeilen;
                    er gilt nur noch in den drei Spalten ab `lg`. */}
                <h3 className="mt-7 flex items-start justify-between gap-4 text-[length:var(--text-title)]">
                  <span className="lg:max-w-[16ch]">{pillar.title}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-1.5 hidden size-6 shrink-0 text-current/30 transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent lg:block"
                  />
                </h3>

                <p className="mt-4 leading-relaxed text-current/60">
                  {pillar.text}
                </p>

                {/* `mt-auto` zieht die Kennzahl auf die Unterkante. Die drei
                    Texte sind unterschiedlich lang; ohne das stehen die drei
                    Zeilen auf drei Höhen und die Reihe franst unten aus. */}
                <p className="mt-auto flex items-center justify-between gap-4 border-t border-current/8 pt-4 font-display text-sm font-semibold tracking-tight text-current/85">
                  {pillar.meta}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 shrink-0 text-current/30 lg:hidden"
                  />
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
