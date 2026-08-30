import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Velaris } from "@/components/motion/velaris";
import { Container } from "@/components/ui/section";

/**
 * Kopf für alle Unterseiten. Trägt genau eine H1 und die sichtbare
 * Breadcrumb, die im Schema als BreadcrumbList gespiegelt wird.
 *
 * Der Kopfbereich ist dunkel, wie die Grundfläche der Seite. Er trägt deshalb
 * kein `page-top-light` – diese Klasse meldet dem festen Seitenkopf, dass eine
 * Seite ausnahmsweise auf einer Silberfläche beginnt und er Schrift und Akzent
 * umdrehen muss (siehe globals.css). Solange hier Schwarz steht, stimmt die
 * normale Vererbung.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  crumb,
  aside,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead: React.ReactNode;
  crumb: string;
  aside?: React.ReactNode;
}) {
  /* Kopf- und Fußabstand hängen an der Bildhöhe, nicht an der Breite – dieselbe
     Rechnung wie im Hero der Startseite, wo sie ausführlich steht. Hier war es
     noch deutlicher: 128 px oben plus 80 px unten sind im Querformat eines
     Telefons 53 % der Bildhöhe für zwei Ränder.

     Der Boden war trotzdem zu hoch. Gemessen bei 390 × 844: 132 px Vorlauf,
     dazu `mt-10` (40) für die Auszeichnungszeile und `mt-6` (24) für die
     Überschrift – die H1 begann bei 270 bis 283 px, also 200 px unter der
     Kopfzeile, und dazwischen stand auf zehn Unterseiten nichts als der
     bewegte Grund und die Brotkrume. Am Schreibtisch fällt das nicht auf,
     weil dieselben Werte dort ein Viertel der Bildhöhe sind.

     Jetzt 91 px am Telefon, der Anstieg über `vh` bleibt: Ab 1000 px
     Fensterhöhe steht wieder der alte Wert. Die beiden Innenabstände sind
     mitgezogen (`mt-7` / `mt-4`), sonst hätte der gewonnene Platz nur die
     Stelle gewechselt. */
  return (
    <section className="relative overflow-hidden border-b border-current/10 bg-ink pt-[clamp(4.5rem,2rem+7vh,10rem)] pb-[clamp(3.5rem,2rem+5vh,6rem)] text-silver on-dark">
      {/* Derselbe bewegte Grund wie im Hero der Startseite, nicht ein zweiter.
          Vorher lag hier ein statischer radialer Neonfleck – zwei Verfahren
          für dieselbe Aufgabe, und der Unterschied fiel beim Wechsel von der
          Startseite auf eine Unterseite sofort auf.

          Der Schleier ist `head-scrim` und nicht `hero-scrim`: Der Grund
          dafür steht in globals.css – hier deckt rechts kein Bild ab, und der
          feste Seitenkopf braucht die obersten 5,5 rem. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Velaris />
        <div className="head-scrim absolute inset-0" />
      </div>

      <Container className="relative">
        <Reveal immediate>
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
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="text-current/90">
                {crumb}
              </li>
            </ol>
          </nav>
        </Reveal>

        {/* Die Überschrift läuft über die volle Breite, nicht in acht von zwölf
            Spalten. Direkt darunter folgt auf jeder Unterseite ein SectionHead
            in 7/5; die H1 hebt sich jetzt über die Breite von ihm ab, nicht
            über eine andere Spaltenteilung. Der Deckel hält die Lesebreite in
            Grenzen, damit auf großen Bildschirmen keine Zeile über 20 Wörter
            läuft.

            `max-w-6xl` statt `5xl`: Der Grad wächst bis 5,5 rem, die Fläche
            stand aber fest bei 1024 px. Gemessen brach die längste Überschrift
            (Versicherung) dadurch ab 1600 px Fensterbreite auf drei Zeilen –
            bei 78 px lief ihre breiteste Zeile 910 px, bei 88 px sind es
            1027 px und damit drei Pixel über dem Deckel. 1152 px fangen das
            ab. Wer eine längere Überschrift einträgt, misst nach. */}
        <Reveal immediate className="mt-7 md:mt-10">
          <p className="eyebrow text-current/90">{eyebrow}</p>
          <h1 className="mt-4 max-w-6xl text-[length:var(--text-page-title)] md:mt-6">
            {title}
          </h1>
        </Reveal>

        {/* Die Einordnung steht unter der Überschrift, nicht neben ihr.
            Vorher lag sie in einer eigenen Spalte rechts oben, auf Höhe der
            Auszeichnungszeile: vier Rasterspalten schmal, also sieben bis
            acht Wörter pro Zeile, und ohne sichtbaren Bezug zu dem Satz, zu
            dem sie gehört. Man las die Überschrift und übersah den Absatz –
            genau die Reihenfolge, die er umdrehen soll.

            Jetzt beginnt der Absatz an derselben Kante wie die Überschrift.
            Sechs Spalten geben ihm 60 bis 70 Zeichen Lesebreite. Rechts
            daneben steht, was zu tun ist – oder nichts, dann leuchtet dort
            der Grund.

            Die Haarlinie, die vorher zwischen Überschrift und Einordnung lag,
            ist weg: Sie hat den Kopf quer durchgeschnitten, statt ihn zu
            gliedern. Der Abstand allein trägt die Zäsur. */}
        <div className="mt-12 grid gap-x-16 gap-y-8 lg:grid-cols-12 lg:mt-14">
          <Reveal immediate className="lg:col-span-6">
            <p className="text-[length:var(--text-lead)] leading-relaxed text-current/70">
              {lead}
            </p>
          </Reveal>
          {aside ? (
            <Reveal
              immediate
              className="lg:col-span-4 lg:col-start-9 lg:justify-self-end"
            >
              {aside}
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
