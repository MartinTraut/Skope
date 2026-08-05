import { cn } from "@/lib/utils";

/** Scooter-Glyph — abgeleitet aus dem bestehenden SKOPE-Siegel. */
export function ScooterMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 46 32"
      fill="none"
      aria-hidden="true"
      className={cn("h-6 w-auto", className)}
    >
      <g
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9.5" cy="24.5" r="5.6" />
        <circle cx="36.5" cy="24.5" r="5.6" />
        <path d="M9.8 19 15 4.6" />
        <path d="M10.4 4.6h9.8" />
        <path d="M13.4 26.6h17.6" />
      </g>
    </svg>
  );
}

/** Wortmarke mit Glyph — Hauptlogo in Header und Footer. */
export function Logo({
  className,
  showSub = true,
}: {
  className?: string;
  showSub?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <ScooterMark className="h-7 w-auto text-flame" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.375rem] font-extrabold tracking-[-0.03em]">
          SKOPE
        </span>
        {showSub ? (
          <span className="font-display text-[0.5rem] font-semibold tracking-[0.22em] uppercase opacity-55">
            Gebrauchtwarenhandel
          </span>
        ) : null}
      </span>
    </span>
  );
}
