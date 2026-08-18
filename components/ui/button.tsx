import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Ein Button-System, fünf Rollen:
 * - neon    → die eine Hauptaktion, auf jeder Fläche
 * - solid   → schwarzer Block, Hauptaktion auf Silber ohne Neon
 * - invert  → heller Block, dieselbe Rolle auf Schwarz
 * - outline → Sekundäraktion, gleiche Größe, deutlich weniger Gewicht
 * - quiet   → Tertiär, wirkt wie ein Textlink mit Klickfläche
 *
 * Die Hauptaktion ist die einzige Stelle außerhalb der Marke, an der Neon als
 * Fläche auftritt. Das ist die Regel des Systems und der Grund, warum sie
 * funktioniert: Wer auf einer Seite nach dem nächsten Schritt sucht, sucht
 * nach Grün.
 *
 * Die Kante des Neon-Knopfes kommt aus der Fläche (`--btn-edge`, globals.css)
 * und ist nicht fest schwarz. Auf Silber muss sie dunkel sein: Neon liegt dort
 * bei 1,18:1, ohne Kante hätte der Knopf keine erkennbare Grenze und
 * verfehlte WCAG 1.4.11 (3:1 für Bedienelement-Grenzen). Auf Schwarz zieht die
 * Neonfläche die Grenze selbst – dort war dieselbe schwarze Kante ein
 * sichtbarer schwarzer Ring um den Knopf, besonders im Seitenkopf.
 */
const button = cva(
  [
    "group relative inline-flex shrink-0 items-center justify-center gap-2.5",
    "font-display font-semibold whitespace-nowrap",
    "rounded-full border transition-[background-color,border-color,color,transform] duration-200",
    "ease-[cubic-bezier(.22,1,.36,1)]",
    /* Der Druckpunkt kommt aus `.press` (globals.css) und nicht mehr aus
       `active:translate-y-px`. Ein Pixel Versatz ist am Zeiger eine Nuance und
       auf dem Telefon nichts: Dort hat der Finger den Knopf verdeckt, bevor
       sich etwas bewegt hat. Das kurze Eindrücken sieht man auch unter dem
       Daumen, weil sich die Kante mitbewegt. */
    "press",
    "disabled:pointer-events-none disabled:opacity-55",
  ],
  {
    variants: {
      variant: {
        /* Neon als Vollton, Schrift in Ink: 14,8:1. Kein Verlauf und kein
           farbiger Schlagschatten – ein Vollton hat mehr Gewicht als jeder
           Verlauf und sieht nicht nach Baukasten aus. */
        neon: "border-[var(--btn-edge)] bg-neon text-ink hover:bg-neon-300 hover:border-[var(--btn-edge)]",
        solid:
          "border-ink bg-ink text-silver hover:bg-ink-700 hover:border-ink-700 on-dark",
        invert:
          "border-silver bg-silver text-ink hover:bg-silver-200 hover:border-silver-200",
        outline:
          "border-current/40 bg-transparent hover:border-current/70 hover:bg-current/[0.05]",
        quiet:
          "border-transparent bg-transparent px-0 underline-offset-[6px] decoration-current/40 hover:underline",
      },
      size: {
        md: "h-11 px-5 text-[0.9375rem]",
        lg: "h-[3.25rem] px-7 text-base",
      },
    },
    defaultVariants: { variant: "neon", size: "md" },
  },
);

type ButtonProps = VariantProps<typeof button> &
  React.ComponentPropsWithoutRef<"button">;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(button({ variant, size }), className)} {...props} />
  );
}

type ButtonLinkProps = VariantProps<typeof button> &
  React.ComponentPropsWithoutRef<typeof Link>;

export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(button({ variant, size }), className)} {...props} />
  );
}

export { button as buttonVariants };
