import * as React from "react";

import { Reveal } from "@/components/motion/reveal";
import { Velaris } from "@/components/motion/velaris";
import { ButtonLink } from "@/components/ui/button";
import { Mark } from "@/components/ui/mark";
import { Container } from "@/components/ui/section";
import { site } from "@/lib/site";

/**
 * Abschluss-CTA. Steht am Ende jeder Seite und bietet einen Weg: die
 * schriftliche Anfrage. Der Telefonknopf stand bis zum 03.09.2026 daneben
 * und ist auf Ansage weg – die Nummer trägt die Kopfzeile bzw. die untere
 * Aktionsleiste auf jeder Seite ohnehin dauerhaft.
 */
export function CtaBand({
  eyebrow = "Nächster Schritt",
  title = (
    <>
      Sagen Sie uns, was der Scooter <Mark>macht</Mark>.
    </>
  ),
  text = "Ein kurzer Anruf reicht meistens, um einzuschätzen, ob es ein Fall für den Checkup, eine Reparatur oder ein anderes Gerät ist. Den Kostenvoranschlag gibt es vor jeder Arbeit.",
  formHref = "/kontakt#anfrage",
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  text?: string;
  /**
   * Seiten mit eigenem Formular geben dessen Anker mit (`#anfrage`,
   * `#suchauftrag`). Vorher führte der Knopf von /reparatur nach /kontakt,
   * wo das Anliegen leer und Pflicht ist – der Kunde verließ die Seite und
   * verlor die Vorauswahl. Dieselbe Tabelle führt `mobile-cta.tsx`.
   */
  formHref?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-current/10 bg-ink py-24 md:py-32 text-silver on-dark">
      {/* Bewegter Grund statt eines statischen Neonflecks am unteren Rand.
          Der Fleck lag ausserhalb der Fläche und leuchtete nur in eine Ecke;
          davor stand zusätzlich eine leere Ebene mit `opacity-60`, die gar
          nichts gezeichnet hat.

          Der Schleier ist hier `band-scrim` und nicht `hero-scrim`: Der Text
          steht mittig, also deckt die Ellipse die Mitte und die Ränder
          leuchten – bei seitlichem Ausblenden läge die Überschrift genau im
          hellsten Bereich. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Velaris />
        <div className="band-scrim absolute inset-0" />
      </div>

      <Container className="relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center text-current/90">{eyebrow}</p>
          <h2 className="mt-6 text-[length:var(--text-display)]">{title}</h2>
          <p className="mx-auto mt-6 max-w-lg text-[length:var(--text-lead)] leading-relaxed text-current/65">
            {text}
          </p>

          <div className="mt-10 flex justify-center">
            <ButtonLink href={formHref} size="lg" className="w-full sm:w-auto">
              Anfrage senden
            </ButtonLink>
          </div>

          <p className="mt-6 text-sm text-current/60">{site.openingHours}</p>
        </Reveal>
      </Container>
    </section>
  );
}
