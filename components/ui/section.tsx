import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

/** Einheitliche Seitenbreite — ein Container, keine Sonderfälle. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[82rem] px-6 md:px-10", className)}>
      {children}
    </div>
  );
}

/**
 * Sektionsrahmen. `tone` steuert Grundfläche und Hairline-Farbe;
 * `.on-paper` kippt die Hairlines für helle Flächen mit.
 */
export function Section({
  id,
  tone = "ink",
  className,
  children,
}: {
  id?: string;
  tone?: "ink" | "ink-800" | "paper" | "petrol";
  className?: string;
  children: React.ReactNode;
}) {
  const tones = {
    ink: "bg-ink text-paper",
    "ink-800": "bg-ink-800 text-paper",
    paper: "on-paper bg-paper text-ink",
    petrol: "bg-petrol-900 text-paper",
  } as const;

  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 py-16 md:py-22 lg:py-26",
        tones[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * Sektionskopf: Eyebrow, H2 und optionaler Lead.
 * `align="split"` setzt die Headline links und den Lead rechts —
 * das bricht die Mittelachse auf und wirkt weniger schematisch.
 */
export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "split",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "split" | "left" | "center";
  className?: string;
}) {
  /* Nur die Headline bekommt den Masken-Reveal, Eyebrow und Lead das ruhige
     Einblenden mit Versatz. Liefe alles maskiert, wäre der Effekt kein Akzent
     mehr, sondern die Grundeinstellung. */
  if (align === "split") {
    return (
      <div
        className={cn(
          "grid items-end gap-8 border-b border-current/12 pb-10 lg:grid-cols-12 lg:gap-16",
          className,
        )}
      >
        <div className="lg:col-span-7">
          {eyebrow ? (
            <Reveal>
              <p className="eyebrow mb-5 text-current/65">{eyebrow}</p>
            </Reveal>
          ) : null}
          <Reveal mask delay={60}>
            <h2 className="text-[length:var(--text-display)]">{title}</h2>
          </Reveal>
        </div>
        {lead ? (
          <Reveal delay={140} className="lg:col-span-5">
            <p className="text-[length:var(--text-lead)] leading-relaxed opacity-70">
              {lead}
            </p>
          </Reveal>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <p
            className={cn(
              "eyebrow mb-5 text-current/65",
              align === "center" && "justify-center",
            )}
          >
            {eyebrow}
          </p>
        </Reveal>
      ) : null}
      <Reveal mask delay={60}>
        <h2 className="text-[length:var(--text-display)]">{title}</h2>
      </Reveal>
      {lead ? (
        <Reveal delay={140}>
          <p className="mt-6 text-[length:var(--text-lead)] leading-relaxed opacity-70">
            {lead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
