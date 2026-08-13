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
          lead="Die häufigste Sorge vor einem Werkstattbesuch ist nicht die Reparatur, sondern die Rechnung danach. Deshalb steht der Preis fest, bevor ein Gehäuse aufgeht. Was Sie nicht freigeben, passiert nicht."
        />

        <ol className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 80} as="li">
              <div className="flex h-full flex-col border-t border-current/15 pt-6">
                <span
                  aria-hidden="true"
                  className="tabular font-display text-sm font-bold tracking-[0.14em] text-accent"
                >
                  {step.n}
                </span>
                <h3 className="mt-4 text-[length:var(--text-subtitle)]">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-current/70">
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
