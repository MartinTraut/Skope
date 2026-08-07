/** Wartungsverträge — Preise und Leistungen 1:1 aus der Altseite. */

export type Plan = {
  id: "basis" | "premium";
  name: string;
  price: string;
  priceValue: string;
  period: string;
  paymentType: string;
  yearlyTotal?: string;
  minDuration?: string;
  claim: string;
  description: string;
  features: string[];
  popular?: boolean;
};

export const plans: Plan[] = [
  {
    id: "basis",
    name: "Basis",
    price: "130,–",
    priceValue: "130.00",
    period: "pro Jahr",
    paymentType: "Jährlich",
    claim: "Einmal im Jahr alles geprüft.",
    description:
      "Für Gelegenheitsfahrer, die einmal jährlich eine vollständige Sicherheitshistorie für ihren Scooter wollen.",
    features: [
      "1× großer Jahres-Sicherheitscheck",
      "Komplette Funktionsprüfung (Bremsen, Lager, Elektronik)",
      "10 % Rabatt auf alle Ersatzteile",
      "Bevorzugte Terminvergabe in der Werkstatt",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "17,99",
    priceValue: "17.99",
    period: "pro Monat",
    paymentType: "Monatlich",
    yearlyTotal: "215,88 € im Jahr",
    minDuration: "Mindestlaufzeit 12 Monate",
    claim: "Der Scooter fällt nicht aus.",
    description:
      "Für Pendler aus Heilbronn, Neckarsulm und Umgebung, die täglich fahren und keinen Ausfalltag einplanen können.",
    features: [
      "Jährlicher Sicherheits-Check inklusive",
      "Akku-Deep-Check inklusive",
      "Vorrang bei der Terminvergabe für Reparaturen",
      "20 % Rabatt auf alle Ersatzteile",
      "Express-Reparatur, bevorzugt innerhalb 24 h",
      "Hol- und Bringservice im Umkreis von 15 km",
    ],
    popular: true,
  },
];

/** Was ein Vertrag nicht abdeckt — steht so auf der Altseite. */
export const planExclusions =
  "Die Service-Verträge decken die reguläre Wartung ab. Schäden durch unsachgemäßen Umgang — Tuning, Sprünge, Wasserschäden durch Hochdruckreiniger oder Unfälle — sind ausgeschlossen. Benötigte Ersatzteile berechnen wir separat und weisen sie einzeln auf der Rechnung aus.";
