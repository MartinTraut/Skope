/**
 * Kennzahlen im Kopf einer Unterseite: rechts neben der Einordnung,
 * nebeneinander, ohne Linien.
 *
 * Zwei Fassungen sind hier gescheitert und dürfen nicht zurückkommen:
 *
 * - **Die Angaben in der schmalen Seitenspalte mit Etikettengrad.** Vier von
 *   zwölf Spalten sind bei 1024 px 113 px breit; „Diagnose im Checkup" misst
 *   im Etikettengrad 186 px. Jede Beschriftung stand damit zweizeilig über
 *   ihrer Zahl, auf `/reparatur` zusätzlich die beiden Angaben untereinander.
 * - **Ein Band über die volle Breite mit Haarlinien.** Es löste den Umbruch,
 *   nahm dem Kopf aber seine Form: Der Kopfbereich ist Überschrift links,
 *   Antwort rechts – eine Linie quer darunter macht daraus zwei Blöcke.
 *
 * Was bleibt: die Spalte rechts, aber breit genug für eine Zeile, und die
 * Beschriftung im Fließtextgrad statt im Etikettengrad. Sie steht über der
 * Zahl, weil man erst wissen muss, wovon 500+ die Rede ist.
 *
 * Die Breite der Spalte gibt die aufrufende Seite über `asideClassName` vor –
 * sie hängt an der Anzahl der Werte und an der längsten Beschriftung, und
 * beides weiß nur die Seite.
 */
export function StatBand({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <dl
      /* Die Spalten sind so breit wie ihr Inhalt, nicht gleich breit.

         Mit drei gleichen Dritteln bekam jede Zelle 195 px (1280) bis 240 px
         (1512) – „Werktage zum Kennzeichen" misst im Fließtextgrad 210 px und
         lief als einzige zweizeilig, während neben „5–10" 150 px leer standen.
         `auto-cols-max` verteilt den Platz nach Bedarf statt nach Anzahl.

         Erst ab `md`: Bei 390 px wären zwei Zellen 151 px und drei 87 px
         breit; dort steht eine Angabe je Zeile über die volle Breite. */
      /* Am Telefon Zeilen mit zwei Enden, erst ab `md` die Spalten.

         Gemessen auf /versicherung bei 390 px: Brotkrume, Auszeichnung,
         Überschrift und Lead standen an x = 24, die drei Werte mittig bei
         x ≈ 195 – 171 px Achsversatz innerhalb einer Sektion, und dazu
         240 px Höhe für drei Angaben. Ein zentrierter Block unter vier
         linksbündigen ist der sichtbarste Einzelfehler des Kopfes.

         Dieselbe Lösung wie beim Kennzahlenband im Hero (21.08.):
         Beschriftung links, Wert rechts, Haarlinie darüber. Ab `md` bleibt
         alles, wie es war – dort stehen die Werte als Spalten rechts neben
         dem Lead und tragen ihre Mitte selbst. */
      className="grid gap-y-3 md:gap-y-8 md:grid-flow-col md:auto-cols-max md:justify-end md:gap-x-8 md:text-center lg:gap-x-10"
    >
      {items.map((item) => (
        /* Unter `md` eine Zeile mit zwei Enden: Die Beschriftung darf
           umbrechen, der Wert nicht (`shrink-0`), und beide sitzen auf der
           Grundlinie. Ab `md` wieder ein Block – dort sind die Zellen gleich
           hoch, weil die Beschriftung einzeilig ist. */
        <div
          key={item.label}
          className="flex min-w-0 items-baseline justify-between gap-4 border-t border-current/15 pt-3 md:block md:border-0 md:pt-0"
        >
          {/* Beschriftung im Fließtextgrad, Zahl im Kennzahlengrad. Ab `md`
              steht beides mittig in der Zelle: Die Zahlen sind verschieden
              lang („500+" gegen „59,99 €"), und an einer gemeinsamen linken
              oder rechten Kante hängt unter jeder ein anderer Rest. Am
              Telefon gibt es dieses Problem nicht – dort steht je Zeile nur
              eine Angabe, und ihre rechte Kante ist die des Satzspiegels. */}
          <dt className="leading-snug text-current/60">{item.label}</dt>
          <dd className="tabular shrink-0 font-display text-[length:var(--text-stat)] leading-none font-bold tracking-tight text-accent md:mt-2">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
