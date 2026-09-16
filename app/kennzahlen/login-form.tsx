import { Container, Section } from "@/components/ui/section";

import { unlock } from "./actions";

/**
 * Zugang zur Kennzahlenseite.
 *
 * Kein Benutzername, kein Konto, keine Registrierung – ein Passwort aus der
 * Umgebung für zwei Menschen. Alles darüber hinaus wäre eine Benutzerverwaltung
 * für eine Seite mit vier Zahlen.
 *
 * Bewusst ohne Rückmeldung, *warum* es nicht ging: „Passwort falsch" und
 * „Zugang nicht eingerichtet" sind zwei Auskünfte, die hier niemand braucht,
 * der sie nicht ohnehin kennt.
 */
export function LoginForm() {
  return (
    <Section tone="ink">
      <Container>
        <div className="mx-auto max-w-md">
          <p className="eyebrow text-current/90">Intern</p>
          <h1 className="mt-5 text-[length:var(--text-title)]">Kennzahlen</h1>
          <form action={unlock} className="mt-8">
            <label
              htmlFor="passwort"
              className="block font-display font-semibold tracking-tight"
            >
              Passwort
            </label>
            <input
              id="passwort"
              name="passwort"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-md border border-current/50 bg-current/8 px-4 py-3 outline-none focus-visible:border-neon"
            />
            <button
              type="submit"
              className="press mt-4 w-full rounded-full bg-neon px-6 py-3 font-display font-semibold text-ink"
            >
              Öffnen
            </button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
