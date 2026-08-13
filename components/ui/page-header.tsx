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
  return (
    <section className="relative overflow-hidden border-b border-current/10 bg-ink pt-32 pb-20 md:pt-40 md:pb-24 text-silver on-dark">
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
                  className="-mx-1 inline-flex min-h-11 items-center px-1 transition-colors hover:text-accent"
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
            über eine andere Spaltenteilung. `max-w-5xl` deckelt die
            Lesebreite, damit auf grossen Bildschirmen keine Zeile über 20
            Wörter läuft. */}
        <Reveal immediate className="mt-10">
          <p className="eyebrow text-current/65">{eyebrow}</p>
          <h1 className="mt-6 max-w-5xl text-[length:var(--text-page-title)]">
            {title}
          </h1>
        </Reveal>

        {/* Die Einordnung steht unter der Überschrift, nicht neben ihr.
            Vorher lag sie in einer eigenen Spalte rechts oben, auf Höhe der
            Auszeichnungszeile: vier Rasterspalten schmal, also sieben bis
            acht Wörter pro Zeile, und ohne sichtbaren Bezug zu dem Satz, zu
            dem sie gehört. Man las die Überschrift und übersah den Absatz –
            genau die Reihenfolge, die er umdrehen soll.

            Jetzt trennt eine Haarlinie den Kopf von der Einordnung, und der
            Absatz beginnt an derselben Kante wie die Überschrift. Sechs
            Spalten geben ihm 60 bis 70 Zeichen Lesebreite. Rechts daneben
            steht, was zu tun ist – oder nichts, dann leuchtet dort der
            Grund. */}
        <div className="mt-10 grid gap-x-16 gap-y-8 border-t border-current/12 pt-8 lg:grid-cols-12 lg:pt-10">
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
