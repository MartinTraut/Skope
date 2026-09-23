"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  MapPin,
  Phone,
} from "lucide-react";

import { submitInquiry, type FormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  TOPIC_BY_SLUG,
  TOPIC_GROUPS,
  type ContactTopic,
} from "@/lib/data/topics";
import { site } from "@/lib/site";
import { subscribeToUrl } from "@/lib/url-state";
import { visitSource } from "@/lib/source";
import { cn } from "@/lib/utils";

const initial: FormState = { status: "idle" };


/**
 * Gefüllte Felder statt umrandeter.
 *
 * Vorher stand jedes Feld als leerer Kasten mit 45-prozentiger Kontur auf der
 * Sektionsfläche: neun Rahmen untereinander, die zusammen mehr Zeichnung
 * hatten als alles, was in ihnen steht, und keiner davon zeigte, wo man
 * hineinschreibt. Eine leichte Füllung macht das Gegenteil – sie zeigt die
 * Schreibfläche und verschwindet als Kontur.
 *
 * Die Füllung allein reicht aber nicht als Grenze. Gemessen: Feld
 * `current/8` auf einer Karte `current/5` – drei Prozent Unterschied, das
 * sind rund 1,2:1, wo WCAG 1.4.11 für die Grenze eines Bedienelements 3:1
 * verlangt. Auf dem Telefon war der Rand des Schreibfeldes damit praktisch
 * nicht zu sehen; man erkannte die Felder an den Beschriftungen, nicht an
 * ihrer Form.
 *
 * Deshalb jetzt Füllung *und* Kontur, aber eine dünne bei 50 %: Das ist nicht
 * der alte leere Kasten mit 45-prozentiger Kontur, denn die Fläche trägt
 * weiterhin die Schreibfläche – die Linie zieht nur ihre Grenze. Gemessen
 * 3,3:1 auf Silber.
 *
 * Die Kontur bleibt auch im Fokus stehen und wechselt nur die Farbe, damit
 * sich die Höhe nicht verschiebt. Kein `focus:outline-none`: Der
 * Rahmenwechsel allein bleibt unter dem für Fokusindikatoren geforderten
 * Kontrast (WCAG 2.4.11), die globale `:focus-visible`-Outline aus globals.css
 * muss hier greifen dürfen.
 */
const fieldClass =
  "w-full rounded-lg border border-current/50 bg-current/8 px-4 py-3.5 text-current placeholder:text-current/50 transition-colors duration-200 focus:border-accent focus:bg-current/12";

const labelClass =
  "font-display text-xs font-semibold tracking-[0.14em] uppercase opacity-75";

function InquiryFormInner({
  defaultTopic,
  topicFromQuery = false,
  periods,
  className,
}: {
  /**
   * Vorauswahl der Seite, auf der das Formular steht. Ohne Angabe steht das
   * Feld auf „Bitte wählen" und ist Pflichtfeld – so ist es auf /kontakt.
   */
  defaultTopic?: ContactTopic;
  /**
   * Wertet `?anliegen=` aus – die Tarifkarten verlinken so auf das Formular.
   * Bewusst im Client statt über searchParams der Seite: sonst müsste
   * /kontakt bei jedem Aufruf serverseitig gerendert werden.
   */
  topicFromQuery?: boolean;
  /**
   * Die Zeiträume der Versicherungstabelle, in der Reihenfolge, in der sie
   * dort stehen. Nur `/versicherung` gibt sie mit: `?zeitraum=<Position>`
   * wird gegen diese Liste geprüft und als Satz ins Nachrichtenfeld
   * geschrieben. Die Liste kommt als Eigenschaft und nicht als Import, damit
   * die Tarifdaten nicht im Bündel jedes anderen Formulars liegen – und
   * damit kein Zeitraum aus der Adresse übernommen wird, den es nicht gibt.
   */
  periods?: readonly string[];
  className?: string;
}) {
  const [state, action, pending] = useActionState(submitInquiry, initial);

  /**
   * `?anliegen=` wird als externer Browser-Zustand gelesen, nicht über
   * useSearchParams: dieser Hook erzwingt eine Suspense-Grenze und nähme die
   * Seite aus dem statischen Prerendering.
   *
   * `subscribeToUrl` kommt aus `lib/url-state` und nicht als eigene Funktion
   * hier: Das Formular hatte eine zweite, die nur auf `popstate` hörte.
   * `history.pushState` löst das aber nicht aus – gemessen auf
   * /finanzierung: Ein Klick auf „Ratenkauf anfragen" aktualisierte die Zeile
   * über dem Formular und die untere Aktionsleiste, das Auswahlfeld selbst
   * blieb auf „Bitte wählen". Betroffen war jede Seite, auf der Karten und
   * Formular zusammen stehen, also auch /wartungsvertrag.
   */
  const search = React.useSyncExternalStore(
    subscribeToUrl,
    () => window.location.search,
    () => "",
  );
  const params = topicFromQuery ? new URLSearchParams(search) : null;
  const slug = params?.get("anliegen") ?? null;

  /**
   * `?geraet=` trägt das Modell aus der Geräteseite ins Formular.
   *
   * Ohne das kommt jede Anfrage von einer Geräteseite als „Frage zu einem
   * Gerät" ohne Gerät an – und die Werkstatt muss zurückfragen, welches der
   * dreizehn gemeint war. Der Wert steht in einem Feld, das ohnehin für Marke
   * und Modell da ist, und bleibt überschreibbar: Wer über den Weg kommt, aber
   * nach etwas anderem fragt, korrigiert eine Zeile statt eine leere zu füllen.
   */
  const device = params?.get("geraet")?.slice(0, 80) || undefined;

  /**
   * `?zeitraum=` trägt die Zeile aus der Tariftabelle ins Nachrichtenfeld.
   *
   * Übergeben wird die Position, nicht der Text: So kann aus der Adresse kein
   * erfundener Zeitraum in eine Anfrage wandern, und der Wortlaut bleibt der
   * der Tabelle. Die Zeile ist überschreibbar – sie ist ein Anfang, keine
   * Behauptung über das, was der Kunde will.
   */
  /* `Number(null)` ist 0 und `Number.isInteger(0)` wahr – ohne die Prüfung
     auf den Rohwert stand auf jeder Seite ohne `?zeitraum=` der erste
     Zeitraum der Tabelle im Nachrichtenfeld. Gemessen: `?zeitraum=2` und
     `?zeitraum=4` schrieben beide die Zeile von Position 0. */
  const rawPeriod = params?.get("zeitraum");
  const periodIndex = rawPeriod === null || rawPeriod === undefined ? NaN : Number(rawPeriod);
  const period =
    periods && Number.isInteger(periodIndex) && periods[periodIndex]
      ? periods[periodIndex]
      : undefined;
  const messagePrefill = period
    ? `Ich möchte ein Versicherungskennzeichen für den Zeitraum ${period}.`
    : undefined;

  /**
   * Reihenfolge der Vorauswahl: Deeplink schlägt Seite, Seite schlägt leer.
   *
   * Das Formular zeigt überall dieselben vierzehn Anliegen; unterschieden
   * wird nur, was vorbelegt ist. Vorher trug jede Leistungsseite eine eigene
   * Teilmenge – wer unter der Reparaturseite ein Altgerät abgeben wollte,
   * fand das Anliegen dort nicht.
   *
   * Auf /kontakt bleibt es leer und damit Pflichtfeld: Dort ist keine Absicht
   * bekannt, und eine stille Vorbelegung würde als Antwort gewertet.
   */
  /* `Object.hasOwn`, weil `TOPIC_BY_SLUG` ein Objektliteral ist:
     `?anliegen=constructor` fände sonst `Object` auf dem Prototyp und
     schriebe eine Funktion in das Auswahlfeld. */
  const preselected =
    (slug && Object.hasOwn(TOPIC_BY_SLUG, slug)
      ? TOPIC_BY_SLUG[slug]
      : undefined) ??
    defaultTopic ??
    "";

  const successRef = React.useRef<HTMLDivElement>(null);
  const errorRef = React.useRef<HTMLDivElement>(null);
  const fallbackRef = React.useRef<HTMLDivElement>(null);
  const sourceRef = React.useRef<HTMLInputElement>(null);

  /* Die Herkunft steht erst im Browser fest (Verweisadresse, `utm_source`).
     Direkt ins Feld geschrieben statt über den Zustand – siehe das Feld. */
  React.useEffect(() => {
    if (sourceRef.current) sourceRef.current.value = visitSource();
  }, []);

  /**
   * Ohne Fokuswechsel bekommen Tastatur- und Screenreader-Nutzer nach dem
   * Absenden gar keine Rückmeldung: Der fokussierte Button verschwindet und
   * der Fokus fällt zurück auf <body>. Das gilt auch für den Fallback – dort
   * steht der einzige verbliebene Weg zur Werkstatt.
   */
  React.useEffect(() => {
    if (state.status === "ok") successRef.current?.focus();
    if (state.status === "error") errorRef.current?.focus();
    if (state.status === "fallback") {
      fallbackRef.current?.focus();
      fallbackRef.current?.scrollIntoView({ block: "center" });
    }
  }, [state]);

  if (state.status === "ok") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={cn(
          "rounded-lg border border-signal/40 bg-signal/8 p-8 md:p-10",
          className,
        )}
      >
        <CheckCircle2
          aria-hidden="true"
          className="size-8 text-signal"
          strokeWidth={1.5}
        />
        <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">
          Anfrage erhalten.
        </h3>
        <p className="mt-3 leading-relaxed opacity-80">{state.message}</p>

        {/* Der Erfolgsfall darf keine Sackgasse sein: Wer es eilig hat,
            braucht hier den Telefonweg, nicht den Zurück-Button. */}
        <div className="mt-7 flex flex-col gap-3 border-t border-current/15 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
          <a
            href={site.phone.href}
            className="inline-flex items-center gap-2.5 font-display font-semibold text-accent hover:underline"
          >
            <Phone className="size-4" aria-hidden="true" />
            <span className="tabular">{site.phone.display}</span>
          </a>
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 font-display font-semibold hover:underline"
          >
            <MapPin className="size-4" aria-hidden="true" />
            Route zur Werkstatt
          </a>
        </div>
      </div>
    );
  }

  const errorCount = state.errors ? Object.keys(state.errors).length : 0;

  return (
    /* Das Formular steht auf einer eigenen Fläche und nicht frei in der
       Sektion. Frei gestellt war es eine Reihe schwebender Kästen ohne
       erkennbaren Anfang und ohne Ende; als Block ist es ein Gegenstand auf
       der Seite – dieselbe Figur wie die Preiskarte auf der Reparaturseite. */
    <form
      action={action}
      className={cn(
        "flex flex-col gap-6 rounded-2xl bg-current/5 p-6 md:p-9",
        className,
      )}
    >
      {/* Honeypot – für Menschen unsichtbar. Neutraler Feldname, damit
          Passwortmanager und Autofill ihn nicht befüllen. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="company_ref">Firmenreferenz</label>
        <input
          id="company_ref"
          name="company_ref"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Herkunft der Sitzung, damit in der Mail steht, über welchen Weg die
          Anfrage zustande kam – „google", „direkt", „instagram". Kein
          `useState`: Der Wert wird erst beim Absenden gebraucht, und im
          Server-Rendern gibt es ihn nicht. Ein `defaultValue` wäre also leer
          und ein `useEffect` mit `setState` nur eine Neuberechnung der ganzen
          Maske für ein Feld, das niemand sieht. Deshalb schreibt der Effekt
          direkt ins Feld.

          Ohne JavaScript bleibt es leer, und der Server trägt dann
          „unbekannt" ein – die Anfrage geht trotzdem raus. */}
      <input type="hidden" name="quelle" ref={sourceRef} />

      {errorCount > 0 ? (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="rounded-md border border-accent bg-accent/10 p-5"
        >
          <p className="font-display font-semibold">
            {errorCount === 1
              ? "Bitte prüfen Sie eine Angabe:"
              : `Bitte prüfen Sie ${errorCount} Angaben:`}
          </p>
          {/* Knöpfe, keine Rautenverweise.

              `ScrollManager` fängt jeden Verweis auf dieselbe Seite in der
              Einfangphase ab und bricht ihn mit `preventDefault` ab, um die
              Sektion sauber unter die Kopfzeile zu setzen. Für eine Sektion
              ist das richtig; für ein Formularfeld nimmt es genau das weg,
              wofür die Zusammenfassung da ist – der Fokus wanderte nicht
              mit, und wer mit der Tastatur arbeitet, stand nach dem Klick
              vor dem Feld, aber nicht darin. Ein Knopf umgeht die Regel und
              tut beides selbst. */}
          <ul className="mt-2 list-disc pl-5 text-sm">
            {Object.entries(state.errors ?? {}).map(([field, message]) => (
              <li key={field}>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(field);
                    if (!(el instanceof HTMLElement)) return;
                    el.scrollIntoView({ block: "center" });
                    el.focus();
                  }}
                  className="text-left text-accent underline"
                >
                  {message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="text-sm opacity-70">
        Mit <span className="text-accent">*</span> markierte Felder sind
        Pflichtfelder.
      </p>

      <div className="flex flex-col gap-2">
        <label htmlFor="topic" className={labelClass}>
          Anliegen{" "}
          {preselected === "" ? <span className="text-accent">*</span> : null}
        </label>
        <div className="relative">
          <select
            key={preselected}
            id="topic"
            name="topic"
            required={preselected === ""}
            defaultValue={state.values?.topic ?? preselected}
            aria-invalid={state.errors?.topic ? true : undefined}
            aria-describedby={state.errors?.topic ? "topic-error" : undefined}
            className={cn(fieldClass, "appearance-none pr-12")}
          >
            {preselected === "" ? (
              <option
                value=""
                disabled
                className="bg-ink-800 text-silver on-dark"
              >
                Bitte wählen
              </option>
            ) : null}
            {TOPIC_GROUPS.map((group) => (
              <optgroup
                key={group.label}
                label={group.label}
                className="bg-ink-800 text-silver on-dark"
              >
                {group.topics.map((topic) => (
                  <option
                    key={topic}
                    value={topic}
                    className="bg-ink-800 text-silver on-dark"
                  >
                    {topic}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 opacity-60"
          />
        </div>
        {state.errors?.topic ? (
          <p id="topic-error" className="text-sm text-accent">
            {state.errors.topic}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* `autoCapitalize="words"` und nicht der Standard: iOS steht auf
            `sentences` und schreibt damit nur das erste Wort groß – aus
            „max mustermann" wird „Max mustermann", und der Nachname bleibt
            klein, bis jemand von Hand zurückgeht. Bei den übrigen Feldern
            braucht es die Angabe nicht: Safari schaltet die Großschreibung
            bei `type="email"` von selbst ab, und eine Telefonnummer hat
            keine. */}
        <Field
          id="name"
          label="Name"
          required
          maxLength={120}
          autoComplete="name"
          autoCapitalize="words"
          defaultValue={state.values?.name}
          error={state.errors?.name}
        />
        <Field
          id="email"
          label="E-Mail"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          defaultValue={state.values?.email}
          error={state.errors?.email}
        />
        <Field
          id="phone"
          label="Telefon (optional, für Rückfragen)"
          type="tel"
          maxLength={60}
          autoComplete="tel"
          defaultValue={state.values?.phone}
          error={state.errors?.phone}
        />
        {/* `key` erzwingt das Neusetzen des Feldes, sobald die Adresszeile
            gelesen ist: `defaultValue` wirkt nur beim ersten Rendern, und beim
            ersten Rendern auf dem Server ist die Suchanfrage leer. Dieselbe
            Mechanik wie beim Anliegen-Feld darüber. */}
        <Field
          key={device}
          id="scooter"
          label="Marke & Modell (optional)"
          maxLength={160}
          placeholder="z. B. Xiaomi Pro 2"
          defaultValue={state.values?.scooter ?? device}
          error={state.errors?.scooter}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass}>
          Ihre Nachricht <span className="text-accent">*</span>
        </label>
        {/* Als sichtbarer Hilfetext statt als Placeholder: die Anleitung darf
            nicht verschwinden, sobald jemand zu tippen beginnt. */}
        <p id="message-hint" className="text-sm opacity-70">
          Beim Kauf: Budget, gewünschte Reichweite, Einsatz. Bei einer
          Reparatur: Fehlermeldung, Geräusch, seit wann.
        </p>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={5}
          defaultValue={state.values?.message ?? messagePrefill}
          aria-invalid={state.errors?.message ? true : undefined}
          aria-describedby={
            state.errors?.message
              ? "message-hint message-error"
              : "message-hint"
          }
          className={cn(fieldClass, "resize-y")}
        />
        {state.errors?.message ? (
          <p id="message-error" className="text-sm text-accent">
            {state.errors.message}
          </p>
        ) : null}
      </div>

      {state.status === "fallback" ? (
        <div
          ref={fallbackRef}
          tabIndex={-1}
          role="alert"
          className="flex items-start gap-3 rounded-md border border-accent bg-accent/10 p-5"
        >
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-accent"
          />
          <div>
            <p className="leading-relaxed">{state.message}</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-display font-semibold">
              <a
                href={site.phone.href}
                className="inline-flex items-center gap-2 text-accent hover:underline"
              >
                <Phone className="size-4" aria-hidden="true" />
                <span className="tabular">{site.phone.display}</span>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="break-all text-accent hover:underline"
              >
                {site.email}
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Wird gesendet
            </>
          ) : (
            "Anfrage senden"
          )}
        </Button>
        {/* Der Zwischenzustand war der einzige, der nicht angesagt wurde:
            Erfolg, Fehler und Rückfall haben eine Live-Region und den
            Fokuswechsel, das Senden selbst wechselte nur die Beschriftung des
            Knopfes. Wer nicht sieht, bekam zwischen Absenden und Antwort –
            eine Server Action, auf dem Telefon spürbar – keinerlei
            Rückmeldung. */}
        <p role="status" aria-live="polite" className="sr-only">
          {pending ? "Anfrage wird gesendet" : ""}
        </p>
        {/* Art. 13 DSGVO verlangt den Verweis an der Erhebungsstelle – und an
            genau dieser Stelle kostet ein fehlender Link Vertrauen. */}
        <p className="text-sm opacity-70">
          Ihre Daten nutzen wir ausschließlich zur Bearbeitung dieser Anfrage.
          Mehr dazu in der{" "}
          <Link href="/datenschutz" className="underline underline-offset-2">
            Datenschutzerklärung
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  ...props
}: {
  id: string;
  label: string;
  error?: string;
} & React.ComponentPropsWithoutRef<"input">) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelClass}>
        {label}
        {props.required ? <span className="text-accent"> *</span> : null}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={fieldClass}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Auffangnetz für einen abgebrochenen Absendeversuch.
 *
 * Gemessen am 14.09.2026: Wird die Verbindung während des Absendens getrennt
 * (Funkloch, Tunnel, Wechsel WLAN → Mobilfunk), scheitert der Aufruf der
 * Server Action im Browser mit „TypeError: Failed to fetch". Diese Ausnahme
 * entsteht *vor* dem Server – `submitInquiry` läuft nie, kann sie also auch
 * nicht abfangen. Sie stieg bis zur Fehlergrenze von Next durch, und die
 * ersetzte die ganze Seite durch einen englischen Knopf „Reload": Formular
 * weg, Eingaben weg, Telefonnummer weg. Genau in dem Moment, in dem jemand
 * die Werkstatt erreichen will.
 *
 * Warum eine Grenze und kein `try/catch` um die Aktion: `useActionState`
 * behält die Fortschreibung ohne JavaScript nur, solange ihm die Server
 * Action **unmittelbar** übergeben wird. Eine Client-Funktion drumherum
 * nähme dem Formular die verborgenen `$ACTION_*`-Felder – und damit die
 * Fähigkeit, ganz ohne JavaScript abzusenden (geprüft, siehe QA.md).
 * Die Grenze kostet die Eingaben, rettet aber den Weg.
 */
class SubmitBoundary extends React.Component<
  { children: React.ReactNode; className?: string },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // Nur die Fehlerart, keine Formularinhalte – dieselbe Regel wie im Server.
    console.error(
      "[anfrage] Absenden im Browser abgebrochen",
      error instanceof Error ? error.name : "unknown",
    );
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div
        role="alert"
        className={cn(
          "rounded-lg border border-accent bg-accent/10 p-6 md:p-8",
          this.props.className,
        )}
      >
        <AlertCircle aria-hidden="true" className="size-6 text-accent" />
        <h3 className="mt-4 font-display text-xl font-bold tracking-tight">
          Die Verbindung ist abgerissen.
        </h3>
        <p className="mt-3 leading-relaxed opacity-80">
          Ihre Anfrage wurde <strong>nicht</strong> übermittelt. Laden Sie die
          Seite neu und versuchen Sie es noch einmal – oder melden Sie sich
          direkt, das geht ohnehin schneller.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-display font-semibold">
          <a
            href={site.phone.href}
            className="inline-flex items-center gap-2 text-accent hover:underline"
          >
            <Phone className="size-4" aria-hidden="true" />
            <span className="tabular">{site.phone.display}</span>
          </a>
          <a
            href={`mailto:${site.email}`}
            className="break-all text-accent hover:underline"
          >
            {site.email}
          </a>
        </div>
      </div>
    );
  }
}

export function InquiryForm(
  props: React.ComponentProps<typeof InquiryFormInner>,
) {
  return (
    <SubmitBoundary className={props.className}>
      <InquiryFormInner {...props} />
    </SubmitBoundary>
  );
}
