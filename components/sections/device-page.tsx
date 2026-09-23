import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Check, ChevronRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { Gallery } from "@/components/ui/gallery";
import { InventoryCard } from "@/components/ui/inventory-card";
import { PhoneButton } from "@/components/ui/phone-button";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { checkupIncludes } from "@/lib/data/services";
import { vehicleKind } from "@/lib/data/vehicles";
import type { InventoryItem } from "@/lib/inventory";
import {
  AVAILABILITY_LABEL,
  deviceAction,
  type Availability,
} from "@/lib/commerce";
import {
  commerceMode,
  condition,
  productAvailability,
  relatedProducts,
} from "@/lib/commerce-source";
import {
  JsonLd,
  breadcrumb,
  inventoryProduct,
  pageGraph,
  serviceRef,
} from "@/lib/schema";
import { fitDescription, pageMeta } from "@/lib/seo";
import { proof } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/ui/mark";

/**
 * Geräteseite: ein Einzelstück, seine Bilder, seine Daten.
 *
 * **Ein Bauteil für alle vier Fahrzeugarten.** Bis zum 20.09.2026 war dies
 * die Route `app/e-scooter/[slug]/page.tsx` und damit auch die einzige
 * Adressform. Seit im Bestand ein E-Chopper und ein E-Dreirad stehen, geht
 * das nicht mehr: Ein Chopper unter `/e-scooter/mangosteen-m1p` widerspricht
 * genau der Trennung, für die es die Kategorieseiten gibt – und Google
 * bekäme für „E-Chopper kaufen" eine Adresse, die „e-scooter" heißt.
 *
 * Die Route liegt jetzt je Art in `app/<art>/[slug]/page.tsx` und besteht
 * dort aus vier Zeilen; alles Übrige steht hier. Die Art kommt nicht aus der
 * Adresse, sondern aus dem Gerät (`item.category`) – damit gibt es keinen
 * Zustand, in dem Brotkrume, Schema und Verweise etwas anderes behaupten als
 * die Daten.
 */
/**
 * Diese Kennwerte stehen im Datenblatt vorn, in dieser Reihenfolge.
 *
 * Nicht die Reihenfolge aus `lib/inventory`: Dort beginnt jedes Gerät mit
 * Zustand und Zulassung – Sätze, keine Zahlen. Verglichen wird aber an Tempo,
 * Reichweite und Akku. Was hier nicht genannt ist, folgt danach in seiner
 * ursprünglichen Reihenfolge; es fällt nichts weg.
 */
const LEAD_SPECS = [
  "Höchstgeschwindigkeit",
  "Reichweite",
  "Akku",
  "Motor",
  "Bereifung",
  "Zuladung",
];

/**
 * Kürzere Aufschrift im Datenblatt.
 *
 * „Höchstgeschwindigkeit" sind 21 Zeichen in Versalien mit Sperrung und
 * passen in eine Spalte von rund 160 px weder in eine Zeile noch sauber in
 * zwei – gemessen bei 1512 px, das Wort lief über die Kante. Ein Trennstrich
 * mitten im Wort wäre die schlechtere Lösung als das kürzere Wort.
 */
const SHORT_LABEL: Record<string, string> = {
  Höchstgeschwindigkeit: "Tempo",
};

/** Die Adresse eines Geräts – aus seiner Art, nicht aus der aufrufenden Seite. */
export function deviceHref(item: InventoryItem): string {
  return `${vehicleKind(item.category).href}/${item.id}`;
}

/**
 * Titel und Einordnung je Gerät.
 *
 * „gebraucht kaufen" stand hier fest im Titel. Das war richtig, solange jedes
 * Gerät gebraucht war; bei einem originalverpackten Neugerät ist es eine
 * falsche Beschaffenheitsangabe im Suchergebnis. Beides kommt jetzt aus
 * `condition`.
 */
export function deviceMeta(item: InventoryItem): Metadata {
  const neu = item.condition === "neu";
  return pageMeta({
    title: neu
      ? `${item.model} neu kaufen`
      : `${item.model} gebraucht kaufen`,
    // Google schneidet bei rund 158 Zeichen; die Zusammenfassung kommt nur
    // dazu, wenn sie als ganzer Satz noch hineinpasst.
    description: fitDescription(
      neu
        ? `${item.model} für ${item.price} bei SKOPE in Neuenstadt am Kocher: fabrikneu, aus der Fachwerkstatt übergeben, mit ${proof.warrantyYears} Jahr Gewährleistung.`
        : `${item.model} für ${item.price} aus der SKOPE-Fachwerkstatt in Neuenstadt am Kocher: geprüft, generalüberholt, mit ${proof.warrantyYears} Jahr Gewährleistung.`,
      item.summary,
    ),
    path: deviceHref(item),
    image: item.images[0].src,
    imageAlt: item.images[0].alt,
  });
}

export function DevicePage({ item }: { item: InventoryItem }) {
  const kind = vehicleKind(item.category);

  const related = relatedProducts(item.id);
  const availability: Availability = productAvailability(item);
  const action = deviceAction(commerceMode(), availability, item.model);
  const specs = [
    ...LEAD_SPECS.map((label) =>
      item.specs.find((spec) => spec.label === label),
    ).filter((spec) => spec !== undefined),
    ...item.specs.filter((spec) => !LEAD_SPECS.includes(spec.label)),
  ];

  return (
    <>
      {/* Kopfbereich: Bild und Entscheidung nebeneinander.
          Bewusst nicht der gemeinsame `PageHeader`. Der trägt Überschrift und
          Einordnung über die volle Breite und darunter freie Fläche – richtig
          für eine Leistungsseite, falsch hier: Auf einer Geräteseite ist das
          Bild die Hauptsache und muss neben dem Preis stehen, nicht unter
          einer Einleitung. */}
      <section className="relative border-b border-current/10 bg-ink pt-28 pb-16 text-silver on-dark md:pt-32 md:pb-20">
        <Container>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-current/60">
              <li>
                <Link
                  href="/"
                  className="-mx-2 inline-flex min-h-11 items-center px-2 transition-colors hover:text-accent"
                >
                  Start
                </Link>
              </li>
              {/* Der Trenner steht *im* Eintrag, den er einleitet, nicht als
                  eigenes Listenelement. Als eigenes Kind einer
                  `flex-wrap`-Zeile beschloss er am Telefon eine Zeile und
                  zeigte ins Leere: Gemessen bei 320 und 390 px stand das
                  zweite Chevron am Ende von Zeile 1 (nach ihm blieben 108 px,
                  der Modellname braucht 161) und der Name fiel allein auf
                  Zeile 2. */}
              <li className="flex items-center gap-1.5">
                <ChevronRight aria-hidden="true" className="size-3.5 shrink-0" />
                <Link
                  href={kind.href}
                  className="-mx-1 inline-flex min-h-11 items-center px-1 transition-colors hover:text-accent"
                >
                  {kind.nav}
                </Link>
              </li>
              <li
                aria-current="page"
                className="flex min-w-0 items-center gap-1.5 text-current/90"
              >
                <ChevronRight aria-hidden="true" className="size-3.5 shrink-0" />
                <span className="min-w-0">{item.model}</span>
              </li>
            </ol>
          </nav>

          {/* Die Bildspalte ist gedeckelt, nicht halbiert.
              Gemessen bei 1512 × 830: Bei zwei gleichen Spalten war die
              Galerie 680 px breit und im Hochformat 3:4 damit 907 px hoch –
              die Vorschaureihe begann 325 px unterhalb der Falz. Wer auf ein
              Gerät tippt, sieht dann ein einziges Bild und weiß nicht, dass
              es sechs sind.

              Statt die Bildform zu ändern (das verschiebt den Beschnitt jeder
              Aufnahme) hängt der Deckel an der Fensterhöhe, nicht an einem
              festen Wert: `min(38rem, 62vh)`. Die Galerie ist 3:4, ihre Höhe
              also ein Drittel größer als die Spalte.

              Zusammen mit 62 rem rechter Spalte und der Lücke sind das
              104 rem – exakt die Breite, auf die `Container` gedeckelt ist.
              Ab 1664 px Fensterbreite steht damit keine Fläche mehr ungenutzt
              neben dem Satz.

              Der Preis dieser Größe ist die Vorschaureihe: Bei 830 px
              Fensterhöhe ist die Galerie 515 px breit, 686 px hoch, und die
              Reihe beginnt rund 30 px unter der Falz – ein Wischen, nicht die
              halbe Seite wie in der Ausgangslage. Ab etwa 900 px Fensterhöhe
              steht sie wieder vollständig im Bild. */}
          {/* **`svh`, nicht `vh` (23.09.2026).** `vh` ist in iOS Safari keine
              Konstante: Es folgt der Adressleiste, und ein Deckel, der ihr
              folgt, ändert beim Scrollen die Breite der Bildspalte – die
              Galerie wird unter dem Finger größer und kleiner. `svh` ist der
              kleine Darstellungsbereich und steht fest; der Deckel fällt
              dadurch etwas knapper aus, dafür bewegt sich nichts. Dieselbe
              Umstellung wie im Kopfbereich am 05.09.2026. */}
          {/* 03.09.2026: Deckel von `min(38rem,62vh)` auf `min(30rem,48vh)`.
              Bei 1512 × 860 war die Galerie 533 px breit und mit Vorschaureihe
              rund 830 px hoch, die H1 lief im Seitentitelgrad über zwei
              Zeilen, und das Datenblatt begann unter der Falz – „links, rechts,
              unten alles abgeschnitten". Jetzt stehen Bild, Modell, Preis,
              Aktionen und Datenblatt in einem Bild. */}
          <div className="mt-5 grid gap-10 lg:grid-cols-[minmax(0,min(30rem,48svh))_minmax(0,1fr)] lg:gap-12">
            {/* Die Galerie hebt sich beim Seitenaufbau an ihren Platz: aus
                einer Spur kleiner und leicht tiefer, in einem Zug. Das ist
                die Bewegung, die den Sprung von der Karte trägt – dieselbe
                Aufnahme, größer geworden.

                Bewusst eine reine CSS-Animation und keine View Transition:
                Die bräuchte in Next einen experimentellen Router-Schalter,
                und der greift in dieselbe Navigation ein wie der bewegte
                Hintergrund und der gemeinsame IntersectionObserver. Der
                Gewinn wäre eine sauberere Verwandlung, der Einsatz die
                Stabilität jeder Seite. */}
            {/* Solange die Spalten gestapelt sind, deckelt die Galerie sich
                selbst. Gemessen bei 768 × 1024: Ohne Deckel war sie 688 px
                breit und im Format 3:4 damit 917 px hoch – auf dem ersten
                Bildschirm stand das Bild und sonst nichts, Modell und Preis
                begannen erst darunter. Der Deckel ist an die Fensterhöhe
                gebunden wie der Spaltendeckel darüber, mit 20 rem Boden für
                das Querformat des Telefons (dort sind 38 vh nur 148 px).

                Er greift erst ab `sm`: Auf dem Telefon im Hochformat sind
                38 vh mit 321 px schmaler als der Satzspiegel (342 px), und
                dort soll das Bild die volle Spalte haben. Ab `lg` übernimmt
                das Raster. */}
            <div className="settle mx-auto w-full sm:max-w-[max(20rem,min(26rem,38svh))] lg:mx-0 lg:max-w-none">
              <Gallery
                images={item.images}
                thumbnails
                priority
                ratio="portrait"
                /* Die Spaltenbreiten von oben, in derselben Reihenfolge:
                   ab 1024 px bis 38 rem, dazwischen der Tablet-Deckel von
                   26 rem, darunter die volle Spalte. Der Wert stand auf
                   400 px und war damit seit der Verbreiterung der Bildspalte
                   zu klein – auf dem Schreibtisch wurde ein 400-px-Bild auf
                   608 px gezogen. */
                sizes="(min-width: 1024px) 30rem, (min-width: 640px) 22rem, calc(100vw - 3rem)"
              />
            </div>

            <div>
              <p className="eyebrow text-current/90">
                Einzelstück · {proof.sealName}
              </p>
              {/* Displaygrad, nicht Seitentitelgrad: Im Seitentitelgrad lief
                  „Segway Ninebot E3 Pro" bei 1512 px über zwei Zeilen à 96 px
                  und drückte Preis und Datenblatt aus dem Bild. Die einzige
                  H2 dieser Seite steht eine Sektion tiefer im Titelgrad. */}
              <h1 className="mt-4 text-[length:var(--text-display)]">
                {item.model}
              </h1>

              {/* Der Preis steht allein auf seiner Zeile und im Zahlengrad.
                  Neben der Überschrift wäre er ein Detail; hier ist er die
                  zweite Angabe, die gelesen wird. */}
              <p className="tabular mt-4 font-display text-[length:var(--text-stat)] leading-none font-bold tracking-tight text-accent">
                {item.price}
              </p>

              {/* Verfügbarkeit und Zustand stehen direkt am Preis, nicht erst
                  im Datenblatt darunter.

                  „Sofort verfügbar" ist keine neue Zusage, sondern die Regel
                  dieser Liste: Verkaufte Geräte werden aus `lib/inventory`
                  genommen, ein Eintrag heißt also, dass das Gerät in der
                  Werkstatt steht. Das Wort kommt aus `AVAILABILITY_LABEL`
                  und der Wert aus `productAvailability()`: Solange die Liste
                  von Hand gepflegt wird, ist er für jedes Gerät „available" –
                  „reserviert" und „verkauft" kann die Seite aber darstellen,
                  sobald Shopify sie liefert, ohne dass hier etwas umgebaut
                  wird.

                  Der Zustand kommt aus dem Datenblatt (`Zustand`) und steht
                  nur da, wo er dort auch steht – bei einem Einzelstück ist
                  das nicht bei jedem Gerät der Fall. */}
              <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-current/70">
                <span className="inline-flex items-center gap-2 font-display font-semibold tracking-tight text-current/90">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-2 rounded-full",
                      availability === "available"
                        ? "bg-accent"
                        : "bg-current/40",
                    )}
                  />
                  {AVAILABILITY_LABEL[availability]}
                </span>
                {condition(item) ? (
                  <>
                    <span aria-hidden="true" className="text-current/25">
                      ·
                    </span>
                    <span>{condition(item)}</span>
                  </>
                ) : null}
              </p>

              {/* Die Einordnung ist eine Lesestrecke, das Datenblatt darunter
                  nicht – deshalb greift die Zeichenbegrenzung nur hier. */}
              <p className="mt-4 max-w-[56ch] leading-relaxed text-current/75">
                {item.summary}
              </p>

              {/* Die Warnung steht im Kopfbereich und nicht erst in der
                  Datentabelle. Wer ein Gerät im Glauben an eine Zulassung
                  kauft, fährt es unversichert – das gehört vor die
                  Entscheidung, nicht dahinter. */}
              {!item.streetLegal ? (
                <p className="mt-7 flex items-start gap-3 rounded-md border border-amber-400/35 bg-amber-400/10 p-4 text-sm leading-relaxed text-amber-200">
                  <AlertTriangle
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0"
                    strokeWidth={2}
                  />
                  <span>
                    <strong className="font-display font-semibold">
                      Keine deutsche Betriebserlaubnis.
                    </strong>{" "}
                    Dieses Gerät darf in Deutschland nicht auf öffentlichen
                    Straßen gefahren werden und bekommt kein
                    Versicherungskennzeichen. Erlaubt ist die Nutzung auf
                    privatem Gelände.
                  </span>
                </p>
              ) : null}

              {/* Beschriftung und Ziel der Hauptaktion kommen aus
                  `deviceAction()` – derselben Funktion, die auch die
                  Aktionsleiste am Telefon liest. Ein verkauftes oder
                  reserviertes Gerät bekommt keinen Knopf, der ins Leere
                  zeigt, sondern eine abgeschaltete Fläche und daneben den
                  Weg zu den Geräten, die es noch gibt. Die Seite selbst
                  bleibt erreichbar: Sie ist indexiert, verlinkt und für
                  Wiederkehrer der Beleg, dass es das Gerät gab. */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {action.href ? (
                  <Link
                    href={action.href}
                    className={buttonVariants({ size: "lg" })}
                  >
                    {action.label}
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "pointer-events-none opacity-55",
                    )}
                  >
                    {action.label}
                  </span>
                )}
                <PhoneButton variant="outline" />
              </div>

              {availability !== "available" ? (
                <p className="mt-4 text-sm leading-relaxed text-current/70">
                  Dieses Gerät ist nicht mehr zu haben.{" "}
                  <Link
                    href={`${kind.href}#bestand`}
                    className="font-semibold underline underline-offset-2"
                  >
                    Vergleichbare Geräte im Bestand
                  </Link>{" "}
                  – oder wir melden uns, sobald ein ähnliches hereinkommt.
                </p>
              ) : null}

              <p className="mt-4 text-sm text-current/60">
                Abholung und Probefahrt in der Werkstatt in Neuenstadt am
                Kocher. Versand auf Anfrage.
              </p>

              {/* Das vollständige Datenblatt steht neben dem Bild, nicht in
                  einer eigenen Sektion darunter.

                  Vorher lagen hier drei Kennwerte in einem Kachelraster und
                  der Rest – Akku, Motor, Bereifung, Zuladung, Gewicht,
                  Prüfung – erst nach einem Sektionswechsel weiter unten. Wer
                  ein Einzelstück kauft, vergleicht aber nicht drei Werte,
                  sondern das Blatt: Genau die Angaben, die die Entscheidung
                  tragen, standen unterhalb der Bildkante und wurden überlesen.

                  Keine Rahmen und keine Trennlinien. Das Kachelraster war
                  schwarz auf schwarz, sichtbar war davon nur das Liniengitter
                  aus den Zwischenräumen – gezeichnet wurde also die
                  Konstruktion, nicht der Inhalt. Eine leichte Fläche und
                  Weissraum ordnen dieselben Werte ruhiger. */}
              {specs.length > 0 ? (
                /* Unter `sm` eine Spalte mit zwei Enden statt zwei Spalten.

                   Gemessen bei 390 px: Die Wertspalte war 135 px breit,
                   „StVZO-konform, mit Betriebserlaubnis" lief über drei
                   Zeilen à zwölf Zeichen, bei 320 px über fünf Zeilen à
                   sieben. Eine Spalte gibt dem Wert 200 px und stellt ihn
                   neben seine Beschriftung – dasselbe Muster wie im
                   Datenband der Bestandskarte und in den Kennzahlen des
                   Seitenkopfs. Ab `sm` bleibt das Raster. */
                <dl className="mt-6 grid gap-x-8 gap-y-3 rounded-xl bg-current/6 p-5 sm:grid-cols-2 sm:gap-y-4 xl:grid-cols-3">
                  {specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-baseline justify-between gap-4 border-t border-current/10 pt-3 first:border-0 first:pt-0 sm:block sm:border-0 sm:pt-0"
                    >
                      <dt className="eyebrow-plain shrink-0 text-current/55">
                        {SHORT_LABEL[spec.label] ?? spec.label}
                      </dt>
                      <dd className="font-display leading-snug font-semibold tracking-tight hyphens-auto max-sm:text-right sm:mt-1.5">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {item.note ? (
                <p className="mt-6 text-sm leading-relaxed text-current/65">
                  {item.note}
                </p>
              ) : null}

              <p className="mt-6 text-sm leading-relaxed text-current/55">
                Die Angaben stammen aus der Werkstattprüfung und den Unterlagen
                des Geräts. Was nicht geprüft vorliegt, steht hier auch nicht.
                Bei einem Einzelstück ist eine fehlende Zeile ehrlicher als ein
                Herstellerwert aus dem Datenblatt eines Neugeräts.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Was das Siegel an diesem Gerät bedeutet.

          Die frühere eigene Sektion „Technische Daten" steht nicht mehr hier:
          Ihr Inhalt liegt jetzt oben neben dem Bild. Auf `silver` statt auf
          `ink-800` – der Zwischenton kam auf keiner anderen Seite vor und war
          gegen die Fläche darüber ohnehin kaum zu unterscheiden. */}
      <Section tone="silver">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow text-current/90">Vor der Übergabe</p>
                <h2 className="mt-5 text-[length:var(--text-title)]">
                  Dieses Gerät hat die volle <Mark>Prüfung</Mark> hinter sich.
                </h2>
                <p className="mt-6 leading-relaxed text-current/70">
                  {checkupIncludes.length} Positionen, dieselben wie bei einem
                  Kundengerät im Sicherheits-Checkup. Erst wenn alle passen,
                  bekommt das Gerät das {proof.sealName} und wird mit{" "}
                  {proof.warrantyYears} Jahr Gewährleistung übergeben.
                </p>

                <Link
                  href={`${kind.href}#bestand`}
                  className="mt-8 inline-flex min-h-11 items-center gap-2 font-display font-semibold tracking-tight hover:underline"
                >
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  Zurück zum Bestand
                </Link>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={70}>
                {/* Zwei Spalten aus leichten Flächen statt zwölf Zeilen mit
                    Unterkante. Häkchen und wanderndes Licht stehen hier in
                    Neon: Die Prüfliste ist der Beleg, auf dem die ganze Seite
                    steht, und sie darf ihn führen. Preis und Hauptaktion
                    bleiben die einzigen weiteren Neonwerte der Seite. */}
                {/* Eine Spalte bis `xl`, nicht schon ab `sm`.

                    Gemessen: Die längste Position („Akku-Diagnose mit
                    Kapazitätsmessung") ist im Grundschriftgrad 315 px breit.
                    In der Pille gehen Füllung, Häkchen und Abstand ab –
                    zweispaltig blieben davon bei 640 px 227 px, bei 768 px
                    275 px und bei 1024 px 188 px übrig, und vier der sechs
                    Positionen liefen zweizeilig. Eine Liste, in der jede
                    zweite Zeile umbricht, liest sich als Fehler. Zwei
                    Spalten erst ab 1440 px – bei 1280 px trägt eine Spalte
                    327 px, gebraucht werden 379. */}
                <ul className="grid gap-2.5 min-[1440px]:grid-cols-2">
                  {checkupIncludes.map((entry, i) => (
                    <li
                      key={entry}
                      /* Versetzter Start, damit die sechs Lichter nicht im
                         Gleichschritt laufen – gleichzeitig wäre es ein
                         Blinken, versetzt ist es ein Umlauf. */
                      style={
                        { "--trace-delay": `${i * -0.9}s` } as CSSProperties
                      }
                      className="trace flex items-start gap-2.5 rounded-lg bg-current/5 px-3 py-3 sm:gap-3 sm:px-4 sm:py-3.5"
                    >
                      {/* Grün als Fläche, nicht als Strich: `text-accent`
                          kippt auf Silber auf Tinte, und ein neongrüner
                          Konturstrich stünde dort bei 1,18:1. Als gefüllte
                          Scheibe mit dunklem Haken ist das Häkchen
                          unmissverständlich grün und trotzdem lesbar. */}
                      <span
                        aria-hidden="true"
                        className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-neon sm:size-5"
                      >
                        <Check
                          className="size-2.5 text-ink sm:size-3"
                          strokeWidth={3.5}
                        />
                      </span>
                      {/* Unter `sm` ein Grad kleiner: Bei 360 px bleiben in
                          der Pille 262 px Satz, die längste Position braucht
                          im Grundschriftgrad 315. Bei 320 px geht es auch so
                          nicht auf – dort blieben 222 px –, das ist die eine
                          Breite, auf der zwei Zeilen stehen bleiben. */}
                      <span className="text-[0.875rem] text-current/80 sm:text-[1.0625rem]">
                        {entry}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Nachbarn im Preis – der eigentliche Vergleich beim Gebrauchtkauf */}
      {related.length > 0 ? (
        <Section tone="silver-200">
          <Container>
            <SectionHead
              eyebrow="Ebenfalls im Bestand"
              title={
                <>
                  Geräte in derselben <Mark>Preisklasse</Mark>.
                </>
              }
              lead="Der Bestand wechselt laufend. Jedes Gerät ist ein Einzelstück, aufbereitet in der eigenen Werkstatt."
            />
            <div className="mt-14 grid auto-rows-fr gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((other, i) => (
                <Reveal key={other.id} delay={(i % 3) * 70}>
                  <InventoryCard item={other} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <JsonLd
        nodes={pageGraph([
          breadcrumb([
            { name: `${kind.nav} kaufen`, path: kind.href },
            { name: item.model, path: deviceHref(item) },
          ]),
          inventoryProduct(item),
          /* Nur ein Verweis: Die vollständige Definition des
             Verkaufsdienstes steht auf /e-scooter – auch für Chopper und
             Dreirad, denn es ist derselbe Dienst (Verkauf geprüfter
             Elektrofahrzeuge) und nicht drei. Zwei Adressen, die dieselbe
             @id unterschiedlich beschreiben, sind ein Konflikt im Graph. */
          serviceRef("/e-scooter"),
        ])}
      />
    </>
  );
}
