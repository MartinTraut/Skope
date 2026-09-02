import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * „E-Scooter" bricht am Bindestrich – im Displaygrad ist ein Zeilenschluss
 * auf „E-" der auffälligste Satzfehler der Seite (gemessen: H1, Zitate, fünf
 * FAQ-Fragen). Der geschützte Bindestrich U+2011 verhindert den Umbruch.
 * Für Datenstrings, die als Text gerendert werden; in JSX-Überschriften
 * steht stattdessen ein `whitespace-nowrap`-Span.
 */
export function noBreak(text: string) {
  return text.replace(/E-Scooter/g, "E\u2011Scooter");
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
