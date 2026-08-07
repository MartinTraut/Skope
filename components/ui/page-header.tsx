import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/section";

/**
 * Kopf für alle Unterseiten. Trägt genau eine H1 und die sichtbare
 * Breadcrumb, die im Schema als BreadcrumbList gespiegelt wird.
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
    <section className="relative overflow-hidden border-b border-white/10 bg-ink pt-32 pb-20 md:pt-40 md:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-veil opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-30%] right-[-10%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,var(--color-petrol)_0%,transparent_65%)] opacity-25 blur-2xl"
      />

      <Container className="relative">
        <Reveal immediate>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-paper/60">
              <li>
                <Link
                  href="/"
                  className="-mx-1 inline-flex min-h-11 items-center px-1 transition-colors hover:text-flame"
                >
                  Start
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="text-paper/75">
                {crumb}
              </li>
            </ol>
          </nav>
        </Reveal>

        {/* 8/4 mit Lücke statt 7/5: Direkt darunter folgt auf jeder Unterseite
            ein SectionHead in 7/5 — bei gleicher Teilung stünde dieselbe Figur
            zweimal untereinander. Die breitere H1-Spalte trennt die Ebenen. */}
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <Reveal immediate>
              <p className="eyebrow text-current/65">{eyebrow}</p>
              <h1 className="mt-6 text-[length:var(--text-page-title)]">
                {title}
              </h1>
            </Reveal>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal immediate>
              <p className="text-[length:var(--text-lead)] leading-relaxed text-paper/70">
                {lead}
              </p>
              {aside ? <div className="mt-8">{aside}</div> : null}
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
