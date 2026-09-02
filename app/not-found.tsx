import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { PhoneButton } from "@/components/ui/phone-button";
import { Container } from "@/components/ui/section";
import { Mark } from "@/components/ui/mark";
import { JsonLd, pageGraph } from "@/lib/schema";
import { nav } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70svh] items-center overflow-hidden bg-ink pt-32 pb-24 text-silver on-dark">
      <Container className="relative">
        <p className="eyebrow text-current/90">Fehler 404</p>
        <h1 className="mt-6 max-w-2xl text-[length:var(--text-display)]">
          Diese Seite gibt es hier <Mark>nicht</Mark>.
        </h1>
        <p className="mt-6 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-current/65">
          Vielleicht ein Tippfehler in der Adresse, vielleicht ist die Seite
          umgezogen. Diese Wege führen weiter, oder Sie rufen kurz an.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            Zur Startseite
          </ButtonLink>
          <PhoneButton variant="outline" />
        </div>

        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-current/12 pt-8">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-current/60 transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      <JsonLd nodes={pageGraph()} />
    </section>
  );
}
