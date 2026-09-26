import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { LaneArrows } from "@/components/ui/lane-arrows";
import { Mark } from "@/components/ui/mark";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { workshopPhotos } from "@/lib/data/workshop-photos";

/**
 * Einblicke in den Betrieb – echte Aufnahmen, als Wischbahn.
 *
 * Warum eine Bahn und kein Raster: Die sieben Motive sind eine Folge
 * (Standort, Büro, Lager, Werkbank, Reparatur) und kein Katalog. Als Raster
 * bräuchten sie am Telefon sieben Bildschirmhöhen; als Bahn ist es eine
 * Geste, und auf dem Schreibtisch stehen zweieinhalb Kacheln nebeneinander,
 * also sieht man sofort, dass es weitergeht.
 *
 * **Alle Kacheln sind gleich hoch, aber verschieden breit.** Fünf Aufnahmen
 * sind hochkant, zwei quer. Ein gemeinsames Seitenverhältnis (4/3) hätte
 * beides beschädigt: Bei den Hochformaten schneidet `object-cover` oben und
 * unten je ein Fünftel weg – beim Bürocontainer genau das Schild über der
 * Tür, also die Aussage der Aufnahme. Bei gemeinsamer Höhe und freier Breite
 * liegt jedes Bild unbeschnitten in seiner Kachel (`object-contain` braucht
 * es dafür nicht, die Kachel *hat* das Verhältnis des Bildes), und die Bahn
 * liest sich als Filmstreifen statt als Raster mit Löchern.
 *
 * Die Breite kommt über `aspect-ratio` aus den Maßen der Datei, nicht über
 * eine Rechnung im Skript: Die Kachel hat eine feste Höhe, das Verhältnis
 * setzt die Breite. Damit steht die Bahn richtig, bevor ein einziges Bild
 * geladen ist – kein Umspringen, CLS 0.
 *
 * Gebaut wie die Bestandsgalerie am Telefon: native Rollfläche mit
 * Einrastpunkten (`.scroll-x`, `snap-x`), kein JavaScript. Damit funktioniert
 * sie ohne Skript, mit Finger, Trackpad, Rad *und* Tastatur – die Bahn ist
 * fokussierbar und reagiert auf die Pfeiltasten, weil der Browser das für
 * rollbare Flächen selbst mitbringt.
 *
 * **Keine Bildunterschriften (23.09.2026, auf Ansage).** Was zu sehen ist,
 * steht weiterhin im `alt` jeder Aufnahme – für alle, die die Bilder nicht
 * sehen. Unter dem Bild war es eine zweite, kürzere Fassung derselben
 * Aussage und gab der Bahn eine ausgefranste Unterkante, die erst mit einem
 * festen Textkasten (`min-h-[2lh]`) wieder gerade wurde.
 *
 * **Keine KI-Kennzeichnung.** Diese Bilder sind fotografiert; der
 * `GeneratedMark` gehört ausschließlich auf die acht erzeugten Motive
 * (`lib/data/generated-images.ts`). Eine falsche Kennzeichnung ist genauso
 * irreführend wie eine fehlende.
 */
export async function WorkshopGallery({
  tone = "silver-200",
}: {
  tone?: "silver" | "silver-200" | "ink";
}) {
  const photos = await workshopPhotos();

  /* Keine Datei, keine Sektion. Eine Überschrift über einer leeren Bahn wäre
     ein Fehler, den man erst im Bild sieht. */
  if (photos.length === 0) return null;

  return (
    <Section tone={tone}>
      <Container>
        <SectionHead
          eyebrow="Einblicke"
          title={
            <>
              Der Betrieb, <Mark>fotografiert</Mark>.
            </>
          }
        />
        {/* Die Pfeile stehen über der Bahn, nicht auf den Bildern: Auf der
            Kachel läge ein Knopf über einer Aufnahme, die gerade deshalb hier
            steht, weil man sie ansehen soll. */}
        <LaneArrows target="werkstatt-bahn" className="mt-8 justify-start" />
      </Container>

      {/* Die Bahn läuft über die volle Fensterbreite, nicht im Satzspiegel:
          Eine Rollfläche, die an der Satzkante endet, sieht am Telefon aus
          wie ein abgeschnittenes Bild. Der erste und der letzte Rand tragen
          dieselben Werte wie `.gutter`, damit die erste Kachel auf der
          Textkante beginnt.

          `snap-start`, nicht `snap-center`: Bei verschieden breiten Kacheln
          hat eine mittig eingerastete links und rechts einen anderen Rest,
          und die Bahn wirkt bei jedem Wisch anders ausgerichtet.

          **`scroll-padding-left` muss denselben Wert tragen wie der
          Innenabstand.** `snap-start` legt die Kante der Kachel an die Kante
          der Rollfläche und übergeht den Innenabstand: Gemessen bei 390 px
          rastete die Bahn beim ersten Sichtkontakt selbsttätig um 24 px ein,
          die erste Kachel stand dann an der Gehäusekante und 24 px links von
          Überschrift und Lead. */}
      {/* Ein Reveal um die **ganze** Bahn, nicht eines je Kachel.

          Mit einem Reveal pro Kachel hängt jedes Bild an einem
          IntersectionObserver gegen das *Fenster*; die Bahn bewegt sich aber
          waagerecht, und der Beobachter zählt das nicht mit. Gemessen bei
          390 px nach einem Wisch bis ans Ende: Deckkräfte 1,1,0,0,0,1,1 –
          drei Kacheln blieben leer und kamen nie zurück. Die Staffelung war
          den Fehler nicht wert. */}
      <Reveal
        id="werkstatt-bahn"
        className="scroll-x mt-12 flex snap-x snap-mandatory gap-4 px-[max(1.5rem,env(safe-area-inset-left))] pb-2 [scroll-padding-left:max(1.5rem,env(safe-area-inset-left))] md:gap-6 md:px-10 md:[scroll-padding-left:2.5rem]"
        tabIndex={0}
        /* Fokussierbare Rollfläche mit eigenem Namen: `region`, nicht
           `group` – eine Bahn, die man mit den Pfeiltasten bewegt, ist ein
           Bereich, in den man hinein- und wieder herausnavigiert. */
        role="region"
        aria-label="Aufnahmen aus dem Betrieb"
      >
        {photos.map((photo) => (
          /* Kein `<figure>` mehr um die Kachel: Ohne Bildunterschrift hätte
             es kein zweites Kind, und die Umgehung ihrer Mindestbreite
             (`w-0 min-w-full`) fällt damit ebenfalls weg. Die Kachel ist
             jetzt selbst das Flex-Kind – feste Höhe, Breite aus dem
             Seitenverhältnis der Datei.

             Am Telefon zusätzlich auf 82vw gedeckelt: Ein Querformat wäre
             bei 17 rem Höhe 361 px breit und stünde bei 390 px Fensterbreite
             fast randlos. */
          <div
            key={photo.file}
            style={{ aspectRatio: `${photo.w} / ${photo.h}` }}
            className="relative h-[17rem] max-w-[82vw] shrink-0 snap-start overflow-hidden rounded-lg bg-ink-700 sm:h-[22rem] sm:max-w-none lg:h-[26rem]"
          >
            <Image
              src={`/img/werkstatt/${photo.file}`}
              alt={photo.alt}
              fill
              /* Die Kachel ist am Telefon höchstens 82vw breit, ab `sm`
                 höchstens 22rem × (1600/1205) ≈ 468 px, ab `lg` 553 px. */
              sizes="(min-width: 1024px) 560px, (min-width: 640px) 470px, 82vw"
              /* 65 statt der voreingestellten 75: Gemessen bei 390 px und
                 DPR 3 holte eine Kachel 142 kB, und beim Wischen wird sie
                 in genau dem Moment angefordert, in dem man sie ansehen
                 will. Es sind Telefonaufnahmen von Containern, Regalen und
                 einem geöffneten Trittbrett – keine Schrift, keine feinen
                 Kanten, die eine höhere Stufe rechtfertigen. */
              quality={65}
              {...(photo.blur
                ? { placeholder: "blur" as const, blurDataURL: photo.blur }
                : {})}
              className="object-cover"
            />
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
