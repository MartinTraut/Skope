import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronRight,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { Gallery } from "@/components/ui/gallery";
import { InventoryCard } from "@/components/ui/inventory-card";
import { PhoneButton } from "@/components/ui/phone-button";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { checkupIncludes } from "@/lib/data/services";
import { inventory, inventoryItem, relatedInventory } from "@/lib/inventory";
import {
  JsonLd,
  breadcrumb,
  inventoryProduct,
  pageGraph,
  serviceRef,
} from "@/lib/schema";
import { pageMeta } from "@/lib/seo";
import { proof } from "@/lib/site";
import { Mark } from "@/components/ui/mark";

/**
 * Geräteseite: ein Einzelstück, seine Bilder, seine Daten.
 *
 * Der Bestand ist eine feste Liste im Code – kein Warenwirtschaftssystem,
 * keine Datenbank. Deshalb `dynamicParams = false`: Alle dreizehn Adressen
 * entstehen beim Bauen, und eine vierzehnte gibt es nicht. Ohne das würde ein
 * beliebiger Tippfehler in der Adresse serverseitig gerendert und käme mit
 * Status 200 als leere Seite zurück – ein Ergebnis, das Google indexiert.
 */
export const dynamicParams = false;

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

export function generateStaticParams() {
  return inventory.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = inventoryItem(slug);
  if (!item) return {};

  return pageMeta({
    title: `${item.model} gebraucht kaufen`,
    description:
      `${item.model} für ${item.price} aus der SKOPE-Fachwerkstatt in Neuenstadt am Kocher: geprüft, generalüberholt, mit ${proof.warrantyYears} Jahr Gewährleistung. ${item.summary}`.slice(
        0,
        300,
      ),
    path: `/e-scooter/${item.id}`,
    image: item.images[0].src,
    imageAlt: item.images[0].alt,
  });
}

export default async function ScooterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = inventoryItem(slug);
  if (!item) notFound();

  const related = relatedInventory(item.id);
  const specs = [
    ...LEAD_SPECS.map((label) =>
      item.specs.find((spec) => spec.label === label),
    ).filter((spec) => spec !== undefined),
    ...item.specs.filter((spec) => !LEAD_SPECS.includes(spec.label)),
  ];
  const anfrage = `/kontakt?anliegen=geraet&geraet=${encodeURIComponent(item.model)}#anfrage`;

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
                  className="-mx-1 inline-flex min-h-11 items-center px-1 transition-colors hover:text-accent"
                >
                  Start
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li>
                <Link
                  href="/e-scooter"
                  className="-mx-1 inline-flex min-h-11 items-center px-1 transition-colors hover:text-accent"
                >
                  E-Scooter kaufen
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="text-current/90">
                {item.model}
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
              Aufnahme) ist die Spalte auf 25 rem begrenzt: 400 px breit,
              533 px hoch, Vorschaureihe bei 809 px – über der Falz, ohne dass
              ein Bild anders angeschnitten wird. Der frei werdende Platz geht
              an die rechte Spalte, wo das vollständige Datenblatt steht. */}
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,25rem)_minmax(0,50rem)] lg:gap-14">
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
            <div className="settle">
              <Gallery
                images={item.images}
                thumbnails
                priority
                ratio="portrait"
                sizes="(max-width: 1024px) 92vw, 400px"
              />
            </div>

            <div>
              <p className="eyebrow text-current/90">
                Einzelstück · {proof.sealName}
              </p>
              <h1 className="mt-5 text-[length:var(--text-display)]">
                {item.model}
              </h1>

              {/* Der Preis steht allein auf seiner Zeile und im Zahlengrad.
                  Neben der Überschrift wäre er ein Detail; hier ist er die
                  zweite Angabe, die gelesen wird. */}
              <p className="tabular mt-7 font-display text-[length:var(--text-stat)] leading-none font-bold tracking-tight text-accent">
                {item.price}
              </p>

              {/* Die Einordnung ist eine Lesestrecke, das Datenblatt darunter
                  nicht – deshalb greift die Zeichenbegrenzung nur hier. */}
              <p className="mt-6 max-w-[56ch] text-[length:var(--text-lead)] leading-relaxed text-current/75">
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

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href={anfrage} className={buttonVariants({ size: "lg" })}>
                  Zu diesem Gerät anfragen
                </Link>
                <PhoneButton variant="outline" />
              </div>

              <p className="mt-6 text-sm text-current/60">
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
                <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 rounded-xl bg-current/6 p-6 md:p-7">
                  {specs.map((spec) => (
                    <div key={spec.label}>
                      <dt className="eyebrow-plain text-current/55">
                        {SHORT_LABEL[spec.label] ?? spec.label}
                      </dt>
                      <dd className="mt-1.5 font-display leading-snug font-semibold tracking-tight hyphens-auto">
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
                  bekommt der Scooter das {proof.sealName} und wird mit{" "}
                  {proof.warrantyYears} Jahr Gewährleistung übergeben.
                </p>

                <Link
                  href="/e-scooter#bestand"
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
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {checkupIncludes.map((entry, i) => (
                    <li
                      key={entry}
                      /* Versetzter Start, damit die sechs Lichter nicht im
                         Gleichschritt laufen – gleichzeitig wäre es ein
                         Blinken, versetzt ist es ein Umlauf. */
                      style={
                        { "--trace-delay": `${i * -0.9}s` } as CSSProperties
                      }
                      className="trace flex items-start gap-3 rounded-lg bg-current/5 px-4 py-3.5"
                    >
                      {/* Grün als Fläche, nicht als Strich: `text-accent`
                          kippt auf Silber auf Tinte, und ein neongrüner
                          Konturstrich stünde dort bei 1,18:1. Als gefüllte
                          Scheibe mit dunklem Haken ist das Häkchen
                          unmissverständlich grün und trotzdem lesbar. */}
                      <span
                        aria-hidden="true"
                        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-neon"
                      >
                        <Check className="size-3 text-ink" strokeWidth={3.5} />
                      </span>
                      <span className="text-current/80">{entry}</span>
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
            <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
            { name: "E-Scooter kaufen", path: "/e-scooter" },
            { name: item.model, path: `/e-scooter/${item.id}` },
          ]),
          inventoryProduct(item),
          // Nur ein Verweis: Die vollständige Definition des Verkaufsdienstes
          // steht auf /e-scooter. Zwei Adressen, die dieselbe @id
          // unterschiedlich beschreiben, sind ein Konflikt im Graph.
          serviceRef("/e-scooter"),
        ])}
      />
    </>
  );
}
