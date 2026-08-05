

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { PhoneButton } from "@/components/ui/phone-button";
import { Container } from "@/components/ui/section";
import { site } from "@/lib/site";

/**
 * Abschluss-CTA. Steht am Ende jeder Seite und bietet genau zwei Wege:
 * anrufen (dominant, weil bei einer Ein-Mann-Werkstatt am schnellsten)
 * oder schriftlich anfragen.
 */
export function CtaBand({
  eyebrow = "Nächster Schritt",
  title = "Sagen Sie uns, was der Scooter macht.",
  text = "Ein kurzer Anruf reicht meistens, um einzuschätzen, ob es ein Fall für den Checkup, eine Reparatur oder direkt für ein anderes Gerät ist. Kostenvoranschlag gibt es vor jeder Arbeit.",
}: {
  eyebrow?: string;
  title?: string;
  text?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-ink py-24 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-veil opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-40%] left-1/2 h-[36rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,var(--color-flame)_0%,transparent_68%)] opacity-[0.14] blur-2xl"
      />

      <Container className="relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center text-current/55">{eyebrow}</p>
          <h2 className="mt-6 text-[length:var(--text-display)]">{title}</h2>
          <p className="mx-auto mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-paper/65">
            {text}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PhoneButton />
            <ButtonLink
              href="/kontakt"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Anfrage schreiben
            </ButtonLink>
          </div>

          <p className="mt-6 text-sm text-paper/60">{site.openingHours}</p>
        </Reveal>
      </Container>
    </section>
  );
}
