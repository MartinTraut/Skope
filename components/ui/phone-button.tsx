import { Phone } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Der Anruf ist die dominante Aktion der Seite und taucht auf jeder Seite
 * mehrfach auf. Eine Komponente statt sechsmal derselben Klassenkette.
 */
export function PhoneButton({
  variant = "flame",
  size = "lg",
  className,
  iconOnly = false,
}: {
  variant?: "flame" | "outline" | "solid";
  size?: "md" | "lg";
  className?: string;
  iconOnly?: boolean;
}) {
  return (
    <a
      href={site.phone.href}
      aria-label={iconOnly ? `Anrufen: ${site.phone.display}` : undefined}
      className={cn(
        buttonVariants({ variant, size }),
        iconOnly && "size-11 px-0",
        className,
      )}
    >
      <Phone className={iconOnly ? "size-5" : "size-4"} aria-hidden="true" />
      {iconOnly ? null : <span className="tabular">{site.phone.display}</span>}
    </a>
  );
}
