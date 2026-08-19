import { ExplainerVideo } from "@/components/ui/explainer-video";
import { Reveal } from "@/components/motion/reveal";
import { Container, Section, SectionHead } from "@/components/ui/section";
import { Mark } from "@/components/ui/mark";

/**
 * Der Ablauf, direkt hinter dem Versprechen aus dem Hero.
 *
 * Die Startseite sprang vorher vom Versprechen („reparieren statt ersetzen")
 * unmittelbar zu den Leistungen. Damit fehlte die Antwort auf die Frage, die
 * jemand mit einem defekten Gerät zuerst stellt: Was passiert, wenn ich da
 * anrufe – und was kostet mich das, bevor ich zusage?
 *
 * Die vier Schritte sind wortgleich mit denen auf /reparatur. Gleiche Aussage
 * an zwei Stellen unterschiedlich zu formulieren, ist keine Abwechslung,
 * sondern eine zweite Version der Wahrheit.
 */
const steps = [
  {
    n: "01",
    title: "Sie beschreiben das Symptom",
    text: "Am Telefon oder über das Formular. Fehlermeldung, Geräusch, Reichweite, seit wann: je konkreter, desto schneller die Einschätzung.",
  },
  {
    n: "02",
    title: "Wir messen, statt zu raten",
    text: "Fehlerspeicher auslesen, Restkapazität des Akkus messen, Bauteile einzeln prüfen. Erst danach steht fest, was tatsächlich defekt ist.",
  },
  {
    n: "03",
    title: "Kostenvoranschlag vor der Arbeit",
    text: "Sie bekommen den Preis, bevor etwas geöffnet oder getauscht wird. Was Sie nicht freigeben, passiert nicht.",
  },
  {
    n: "04",
    title: "Reparatur und Sicherheitsfreigabe",
    text: "Nach der Reparatur läuft die vollständige Funktionsprüfung. Der Scooter geht nur fahrbereit und sicher wieder raus.",
  },
];

export function Process() {
  return (
    <Section id="ablauf" tone="silver">
      <Container>
        <SectionHead
          eyebrow="So läuft das ab"
          title={
            <>
              Sie wissen, was es kostet, <Mark>bevor</Mark> wir anfangen.
            </>
          }
          /* Der letzte Satz stand wortgleich noch einmal in Schritt 03.
             Zweimal dieselbe Zusage im selben Bildausschnitt liest sich nicht
             als Nachdruck, sondern als Versehen – hier gestrichen, weil der
             Satz an der Stelle steht, an der er passiert. */
          lead="Die häufigste Sorge vor einem Werkstattbesuch ist nicht die Reparatur, sondern die Rechnung danach. Deshalb steht der Preis fest, bevor ein Gehäuse aufgeht."
        />

        {/* Der Film steht vor den Schritten, nicht hinter ihnen.
            Er ist die Kurzfassung derselben Aussage in 35 Sekunden; wer
            lieber liest, scrollt an ihm vorbei und findet den Ablauf direkt
            darunter. Umgekehrt hätte er die Rolle des Nachschlags — und
            niemand sieht sich einen Film an, nachdem er den Inhalt gelesen
            hat.

            Er bleibt in dieser Sektion und bekommt keine eigene: Die
            Startseite wechselt durchgehend hell/dunkel, und jede zusätzliche
            Fläche bricht diesen Wechsel an einer Kante auf. Auf Silber ist
            der dunkle Filmblock ohnehin der stärkere Auftritt. */}
        <Reveal delay={60}>
          <ExplainerVideo
            className="mt-14"
            caption={
              <>
                <span className="font-semibold text-current">
                  35 Sekunden, ohne Ton:
                </span>{" "}
                Warum sich eine Reparatur meist lohnt, wie wir messen statt zu
                raten, was ein Kostenvoranschlag enthält – und was es bei uns
                sonst noch gibt: geprüfte Gebrauchtgeräte, Wartungsverträge ab
                17,99 € im Monat und das Versicherungskennzeichen zum
                Mitnehmen.
              </>
            }
          />
        </Reveal>

        {/* Eine Zeitschiene, kein Textraster.
            Vorher standen hier vier gleich aussehende Spalten mit einer
            Haarlinie obendrauf und einer kleinen grünen Ziffer – vier
            Textblöcke nebeneinander, denen man die Reihenfolge nur am Wort
            „01" ansieht. Ein Ablauf ist aber genau das: eine Reihenfolge.

            Deshalb läuft jetzt eine durchgehende Linie durch alle vier
            Schritte, und auf ihr sitzt je eine Marke mit der Nummer. Die
            Marke ist eine Neonfläche mit schwarzer Ziffer, keine grüne
            Schrift: Auf Silber misst Neon als Schrift 1,18:1, als Fläche
            trägt es dieselbe Farbe lesbar (siehe Farbregel in globals.css).

            Kein zweiter Bauplan fürs Telefon: Gestapelt wird aus derselben
            Zeile eine Trennlinie über jedem Schritt. Die Marke bleibt an
            derselben Stelle, die Bedienung ist überall dieselbe. */}
        <ol className="mt-20 grid gap-y-10 lg:grid-cols-4 lg:gap-x-0">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 90} as="li">
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    /* `bg-neon text-ink` und nicht `bg-accent`: Das
                       Akzent-Token kippt auf hellen Flächen absichtlich auf
                       Tinte, weil es dort meist Schriftfarbe ist. Die Marke
                       ist aber eine Fläche – und als Fläche darf Neon auf
                       Silber stehen, mit schwarzer Ziffer bei 14,8:1. */
                    className="tabular grid size-11 shrink-0 place-items-center rounded-full bg-neon font-display text-sm font-bold tracking-[0.08em] text-ink"
                  >
                    {step.n}
                  </span>
                  {/* Am letzten Schritt läuft die Linie aus, statt an einer
                      Kante abzubrechen – der Ablauf endet, er reißt nicht ab. */}
                  <span
                    aria-hidden="true"
                    className={
                      i === steps.length - 1
                        ? "h-px flex-1 bg-gradient-to-r from-current/20 to-transparent"
                        : "h-px flex-1 bg-current/20"
                    }
                  />
                </div>

                <h3 className="mt-6 text-[length:var(--text-subtitle)] lg:pr-10">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-current/70 lg:pr-10">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
