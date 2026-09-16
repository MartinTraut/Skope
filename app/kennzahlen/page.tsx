import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { Container, Section } from "@/components/ui/section";
import { Mark } from "@/components/ui/mark";
import { demoDays } from "@/lib/data/metrics-demo";
import { dayKey, metricsMode } from "@/lib/metrics";
import {
  accessToken,
  loadSummary,
  METRICS_COOKIE,
  metricsPassword,
  summarize,
  type Summary,
} from "@/lib/metrics-view";

import { LoginForm } from "./login-form";

/**
 * Kennzahlen der Website – wie viele Kontakte über sie entstehen.
 *
 * Die Seite ist **kein Teil des Auftritts**: nicht in der Navigation, nicht in
 * der Sitemap, `noindex`, und ohne gesetztes `METRICS_PASSWORD` gibt es sie
 * gar nicht (404 statt Passwortmaske – eine Maske verrät, dass hier etwas
 * liegt).
 *
 * Sie beantwortet genau eine Frage, und zwar die der Abrechnung: Wie viele
 * Menschen melden sich über die Website, auf welchem Weg, zu welchem Thema.
 * Was sie **nicht** kann, steht unten auf der Seite selbst – ein Wert, den man
 * für eine Abrechnung heranzieht, muss seine Grenzen mitliefern.
 */
export const metadata: Metadata = {
  title: "Kennzahlen",
  robots: { index: false, follow: false, nocache: true },
};

/* Zahlen von heute, nicht vom letzten Build. */
export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90] as const;
type Range = (typeof RANGES)[number];

export default async function MetricsPage({
  searchParams,
}: {
  searchParams: Promise<{ tage?: string }>;
}) {
  const password = metricsPassword();
  if (!password) notFound();

  const jar = await cookies();
  if (jar.get(METRICS_COOKIE)?.value !== accessToken(password)) {
    return <LoginForm />;
  }

  const { tage } = await searchParams;
  const parsed = Number(tage);
  const range: Range = (RANGES as readonly number[]).includes(parsed)
    ? (parsed as Range)
    : 30;

  const live = metricsMode() === "on" ? await loadSummary(range) : null;
  const data = live ?? summarize(demoDays(range, dayKey()));

  return (
    <Section tone="ink">
      <Container>
        <p className="eyebrow text-current/90">
          Kennzahlen · letzte {range} Tage
        </p>
        <h1 className="mt-5 text-[length:var(--text-display)]">
          Was die Website <Mark>einbringt</Mark>.
        </h1>

        {live ? null : (
          /* Der Hinweis steht über der ersten Zahl und trägt die Warnfarbe,
             nicht das Neon der Marke: Er ist kein Etikett, sondern der
             Vorbehalt, unter dem alles darunter steht. */
          <p className="mt-7 max-w-2xl rounded-md border border-amber-300/40 bg-amber-300/10 p-5 leading-relaxed text-amber-100">
            <strong className="font-semibold">
              Das sind Beispielzahlen, keine Messung.
            </strong>{" "}
            Der Zählspeicher ist auf diesem Server nicht eingerichtet
            (<code className="text-amber-200">UPSTASH_REDIS_REST_URL</code> und{" "}
            <code className="text-amber-200">…_TOKEN</code>). Die Seite zeigt,
            wie die Auswertung aussehen wird. Sobald der Speicher steht,
            verschwindet dieser Hinweis und es stehen echte Werte hier.
          </p>
        )}

        <nav aria-label="Zeitraum" className="mt-8 flex gap-2">
          {RANGES.map((value) => (
            <a
              key={value}
              href={`/kennzahlen?tage=${value}`}
              aria-current={value === range ? "page" : undefined}
              className={
                value === range
                  ? "press rounded-full bg-neon px-4 py-2 font-display text-sm font-semibold text-ink"
                  : "press rounded-full border border-current/25 px-4 py-2 font-display text-sm font-semibold text-current/70"
              }
            >
              {value} Tage
            </a>
          ))}
        </nav>

        {/* Die vier Zahlen, um die es geht. Kontakte zuerst: Das ist die
            Größe, über die abgerechnet wird – Anfragen und Telefontipps sind
            ihre beiden Hälften und stehen deshalb daneben, nicht darüber. */}
        <dl className="mt-10 grid gap-px overflow-hidden rounded-lg border border-silver/15 bg-silver/15 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Kontakte gesamt"
            value={data.total.kontakte}
            hint="Anfragen und Telefontipps zusammen"
            accent
          />
          <Stat
            label="Formularanfragen"
            value={data.total.anfragen}
            hint="abgeschickt und geprüft"
          />
          <Stat
            label="Telefon angetippt"
            value={data.total.telefon}
            hint="nicht jeder Tipp wird ein Gespräch"
          />
          <Stat
            label="Seitenaufrufe"
            value={data.total.seiten}
            hint={`${quote(data)} % davon führen zu einem Kontakt`}
          />
        </dl>

        {/* Verlauf über die volle Breite, die beiden Listen darunter
            nebeneinander – nicht Diagramm links, Listen rechts.

            Als Zweispalter war die linke Spalte nach dem Diagramm zu Ende,
            während rechts noch dreizehn Zeilen liefen: gemessen 500 px leere
            Fläche unter den Balken. Die beiden Inhalte haben verschiedene
            Längen und verschiedene Ansprüche – dreißig Säulen wollen Breite,
            eine Liste aus acht Zeilen will sie nicht. */}
        <div className="mt-14">
          <h2 className="text-[length:var(--text-title)]">Kontakte je Tag</h2>
          <Verlauf data={data} />
        </div>

        <div className="mt-14 grid gap-10 border-t border-current/12 pt-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-[length:var(--text-title)]">Woher sie kamen</h2>
            <Bars rows={data.quellen} total={data.total.kontakte} />
          </div>
          <div>
            <h2 className="text-[length:var(--text-title)]">Worum es ging</h2>
            <Bars rows={data.themen} total={data.total.anfragen} />
          </div>
        </div>

        {/* Was die Zahlen nicht können. Gehört auf diese Seite und nicht in
            eine Mail, weil sie hier gelesen werden – und weil eine
            Abrechnungsgrundlage ohne ihre Grenzen eine Behauptung ist. */}
        <div className="mt-16 max-w-3xl border-t border-current/12 pt-10">
          <h2 className="text-[length:var(--text-title)]">
            Was die Zahlen nicht sagen
          </h2>
          <ul className="mt-6">
            {[
              "Ein angetippter Telefonverweis ist kein geführtes Gespräch. Wer auflegt, bevor es klingelt, steht trotzdem in der Zahl.",
              "Wer die Nummer abliest und von einem anderen Gerät anruft, steht in keiner Zahl. Das ist der größte blinde Fleck – er verschwindet erst mit einer eigenen Rufnummer für die Website.",
              "Kein Wert hier ist ein Umsatz. Was aus einem Kontakt wird, weiß nur die Werkstatt. Umsätze lassen sich erst zuordnen, wenn der Verkauf über Shopify läuft.",
              "Gezählt werden Summen pro Tag, keine Personen. Zehn Aufrufe können ein Besucher sein oder zehn.",
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-3 border-b border-current/12 py-3 leading-relaxed text-current/70 first:border-t"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-current/40"
                />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

function quote(data: Summary) {
  if (data.total.seiten === 0) return "0";
  return ((data.total.kontakte / data.total.seiten) * 100).toFixed(1);
}

function Stat({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: number;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-ink p-6">
      <dt className="eyebrow-plain text-current/55">{label}</dt>
      <dd
        className={`tabular mt-3 font-display text-[length:var(--text-stat)] leading-none font-bold tracking-tight ${
          accent ? "text-accent" : "text-current"
        }`}
      >
        {value.toLocaleString("de-DE")}
      </dd>
      <dd className="mt-2 text-sm text-current/50">{hint}</dd>
    </div>
  );
}

/**
 * Der Verlauf als Säulen aus zwei Lagen – Anfragen unten in Neon, Telefon
 * darüber in Silber. Kein Diagrammpaket: Es sind 7 bis 90 Werte in einer
 * Dimension, und eine Bibliothek dafür wäre mehr Code als die Seite selbst.
 */
function Verlauf({ data }: { data: Summary }) {
  const max = Math.max(
    1,
    ...data.verlauf.map((d) => d.anfragen + d.telefon),
  );
  return (
    <div className="mt-6">
      <div
        className="flex h-56 items-end gap-[3px]"
        role="img"
        aria-label={`Kontakte je Tag über ${data.verlauf.length} Tage, höchster Wert ${max}`}
      >
        {data.verlauf.map((d) => {
          const total = d.anfragen + d.telefon;
          return (
            <div
              key={d.day}
              title={`${new Date(d.day).toLocaleDateString("de-DE")}: ${d.anfragen} Anfragen, ${d.telefon} Telefontipps`}
              className="flex h-full flex-1 flex-col justify-end"
            >
              <div
                className="w-full rounded-t-[2px] bg-silver/35"
                style={{ height: `${(d.telefon / max) * 100}%` }}
              />
              <div
                className="w-full bg-neon"
                style={{ height: `${(d.anfragen / max) * 100}%` }}
              />
              {total === 0 ? (
                <div className="h-px w-full bg-current/15" />
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-current/60">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-3 rounded-[2px] bg-neon" />
          Formularanfragen
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-3 rounded-[2px] bg-silver/35"
          />
          Telefon angetippt
        </span>
        <span className="tabular ml-auto">
          {data.verlauf[0]?.day} – {data.verlauf.at(-1)?.day}
        </span>
      </p>
    </div>
  );
}

function Bars({
  rows,
  total,
}: {
  rows: { label: string; value: number }[];
  total: number;
}) {
  if (rows.length === 0) {
    return (
      <p className="mt-6 text-current/60">
        In diesem Zeitraum noch nichts gezählt.
      </p>
    );
  }
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <dl className="mt-6">
      {rows.map((row) => (
        <div
          key={row.label}
          className="border-b border-current/12 py-3 first:border-t"
        >
          <div className="flex items-baseline justify-between gap-4">
            <dt className="min-w-0 leading-snug [hyphens:auto]">{row.label}</dt>
            <dd className="tabular shrink-0 font-display font-semibold tracking-tight">
              {row.value}
              <span className="ml-2 text-sm font-normal text-current/45">
                {total > 0 ? `${Math.round((row.value / total) * 100)} %` : "–"}
              </span>
            </dd>
          </div>
          <div
            aria-hidden="true"
            className="mt-2 h-1 rounded-full bg-current/10"
          >
            <div
              className="h-full rounded-full bg-accent/70"
              style={{ width: `${(row.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </dl>
  );
}
