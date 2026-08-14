/**
 * Echte Kundenstimmen, unverändert übernommen – nach Angabe des Betreibers
 * Rezensionen aus dem Google-Unternehmensprofil.
 *
 * Bewusst ohne Sterne und ohne AggregateRating-Schema: Zu diesen drei
 * Rezensionen liegt weder die einzelne Sternzahl noch eine belegbare
 * Gesamtnote vor. Sterne, die niemand vergeben hat, sind auf einer Seite mit
 * Review-Auszeichnung kein Schönheitsfehler, sondern ein Verstoß gegen die
 * Richtlinien für strukturierte Daten – und der kostet die Auszeichnung für
 * die ganze Domain, nicht nur für diesen Block.
 *
 * TODO Betreiber: Das sind die drei Rezensionen, die auf der Altseite standen.
 * Für den vollständigen Satz fehlt die URL des Google-Unternehmensprofils
 * (siehe `lib/site.ts`). Mit ihr kommen die restlichen Rezensionen hierher,
 * die Quellenangabe unter jeder Karte wird zum Link, und – sobald die
 * Sternzahl je Rezension vorliegt – kann die Bewertung ausgewiesen werden.
 */

export type Testimonial = {
  quote: string;
  author: string;
  context: string;
  /**
   * Sternzahl der Rezension, 1 bis 5.
   *
   * ⚠️ ZU PRÜFEN: Die Werte hier sind aus dem Wortlaut abgeleitet, nicht aus
   * dem Google-Profil abgelesen — die Altseite hat die Sterne nicht mit
   * übernommen. Sichtbare Sterne sind eine Tatsachenbehauptung über die
   * Bewertung eines echten Menschen. Steht bei einer dieser Rezensionen in
   * Wirklichkeit eine 4, ist die 5 auf der Seite falsch, und zwar in einer
   * Weise, die abmahnfähig ist (§ 5 UWG, irreführende Angaben über
   * Bewertungen). Bitte einmal gegen das Profil abgleichen und hier
   * korrigieren.
   */
  rating: 1 | 2 | 3 | 4 | 5;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Wir haben dort 2 E-Scooter gekauft. Die Beratung war sehr nett. Auch nach dem Kauf war Thomas immer für uns da. Vielen Dank!",
    author: "Aus zwei mach eins",
    context: "Käufer, 2 Scooter",
    rating: 5,
  },
  {
    quote:
      "Sehr netter und kompetenter Ansprechpartner für gebrauchte E-Scooter. Preisvorstellung ist gut und Auswahl hat's auch. Gerne jederzeit wieder.",
    author: "Steffen Gorzawski",
    context: "Käufer",
    rating: 5,
  },
  {
    quote:
      "Habe einen Roller bei ihm gekauft. Der Laden war schon zu und hab den Roller trotzdem bekommen. Keine Probleme, gern wieder!",
    author: "Rene Röcker",
    context: "Käufer",
    rating: 5,
  },
];
