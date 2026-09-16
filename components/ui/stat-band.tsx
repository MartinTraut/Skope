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
      className="grid gap-y-8 text-center md:grid-flow-col md:auto-cols-max md:justify-end md:gap-x-8 lg:gap-x-10"
    >
      {items.map((item) => (
        /* `items-baseline` gibt es hier nicht: Die Zellen sind gleich hoch,
           weil die Beschriftung einzeilig ist. Bricht sie doch einmal um,
           soll die Zahl mitwandern statt allein stehen zu bleiben. */
        <div key={item.label} className="min-w-0">
          {/* Beschriftung im Fließtextgrad, Zahl im Kennzahlengrad – und
              beides mittig in der Zelle. Die Zahlen sind verschieden lang
              („500+" gegen „59,99 €"); an einer gemeinsamen linken oder
              rechten Kante hängt unter jeder ein anderer Rest, und die
              Zeile liest sich als zwei Blöcke mit zufälligem Abstand. */}
          <dt className="leading-snug text-current/60">{item.label}</dt>
          <dd className="tabular mt-2 font-display text-[length:var(--text-stat)] leading-none font-bold tracking-tight text-accent">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
