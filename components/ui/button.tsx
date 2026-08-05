import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Ein Button-System, drei Rollen:
 * - flame   → die eine Hauptaktion pro Bildschirm (Anrufen / Anfragen)
 * - solid   → helle Hauptaktion auf dunklem Grund, wenn Orange zu laut wäre
 * - outline → Sekundäraktion, gleiche Größe, deutlich weniger Gewicht
 * - quiet   → Tertiär, wirkt wie ein Textlink mit Klickfläche
 */
const button = cva(
  [
    "group relative inline-flex shrink-0 items-center justify-center gap-2.5",
    "font-display font-semibold tracking-tight whitespace-nowrap",
    "rounded-sm border transition-[background-color,border-color,color,transform] duration-200",
    "ease-[cubic-bezier(.22,1,.36,1)] active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-55",
  ],
  {
    variants: {
      variant: {
        flame:
          "border-flame bg-flame text-ink hover:bg-flame-300 hover:border-flame-300",
        solid: "border-paper bg-paper text-ink hover:bg-white hover:border-white",
        outline:
          "border-current/45 bg-transparent hover:border-current/60 hover:bg-current/[0.06]",
        quiet:
          "border-transparent bg-transparent px-0 underline-offset-[6px] decoration-flame/60 hover:text-flame hover:underline",
      },
      size: {
        md: "h-11 px-5 text-[0.9375rem]",
        lg: "h-[3.25rem] px-7 text-base",
      },
    },
    defaultVariants: { variant: "flame", size: "md" },
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
  return <Link className={cn(button({ variant, size }), className)} {...props} />;
}

export { button as buttonVariants };
