import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

/** Einheitliche Seitenbreite – ein Container, keine Sonderfälle. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[82rem] px-6 md:px-10", className)}
    >
      {children}
    </div>
  );
}

/**
 * Sektionsrahmen. `tone` steuert die Grundfläche.
 *
 * Vier Töne, aber nur zwei Räume – und der Sprung zwischen den Räumen ist
 * der eigentliche Rhythmus der Seite:
 *
 * - `ink`        satt Schwarz, der Normalfall
 * - `ink-800`    eine Stufe heller im dunklen Raum
 * - `silver`     helles Metall, trägt die dichten Lesestrecken
 * - `silver-200` eine Stufe tiefer, für die abwechselnde helle Sektion
 *
 * Die Zwischenstufen sind bewusst keine eigenen Sektionsflächen. Eine frühere
 * Fassung hatte vier Abstufungen, die alle im Dunkeln lagen und sich um
 * wenige Prozent Helligkeit unterschieden. Auf einem normalen Display war
 * davon nichts zu sehen: Die Startseite las sich über 10.653 px als eine
 * einzige Fläche. Der Sprung von Schwarz auf Silber ist dagegen nicht zu
 * übersehen — deshalb darf es ihn nur selten geben, sonst flackert die Seite.
 *
 * `text-*` und die Flächenklasse (`on-light` / `on-dark`) werden hier
 * mitgesetzt, damit Kindelemente ihre Abstufungen über `text-current/70` und
 * `text-accent` aus der Fläche ableiten können, statt eine feste Farbe zu
 * verdrahten. Genau daran wäre der Wechsel sonst gescheitert.
 */
export function Section({
  id,
  tone = "ink",
  className,
  children,
}: {
  id?: string;
  tone?: "silver" | "silver-200" | "ink" | "ink-800";
  className?: string;
  children: React.ReactNode;
}) {
  const tones = {
    silver: "bg-silver text-ink on-light",
    "silver-200": "bg-silver-200 text-ink on-light",
    ink: "bg-ink text-silver on-dark",
    "ink-800": "bg-ink-800 text-silver on-dark",
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
 * `align="split"` setzt die Headline links und den Lead rechts –
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
