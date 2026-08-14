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
import { TOPIC_BY_SLUG, type ContactTopic } from "@/lib/data/topics";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const initial: FormState = { status: "idle" };

function subscribeToUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

/**
 * Gefüllte Felder statt umrandeter.
 *
 * Vorher stand jedes Feld als leerer Kasten mit 45-prozentiger Kontur auf der
 * Sektionsfläche: neun Rahmen untereinander, die zusammen mehr Zeichnung
 * hatten als alles, was in ihnen steht, und keiner davon zeigte, wo man
 * hineinschreibt. Eine leichte Füllung macht das Gegenteil – sie zeigt die
 * Schreibfläche und verschwindet als Kontur.
 *
 * Der transparente Rahmen bleibt stehen, damit der Wechsel auf `border-accent`
 * im Fokus die Höhe nicht verschiebt. Kein `focus:outline-none`: Der
 * Rahmenwechsel allein bleibt unter dem für Fokusindikatoren geforderten
 * Kontrast (WCAG 2.4.11), die globale `:focus-visible`-Outline aus globals.css
 * muss hier greifen dürfen.
 */
const fieldClass =
  "w-full rounded-lg border border-transparent bg-current/8 px-4 py-3.5 text-current placeholder:text-current/50 transition-colors duration-200 focus:border-accent focus:bg-current/12";

const labelClass =
  "font-display text-xs font-semibold tracking-[0.14em] uppercase opacity-75";

export function InquiryForm({
  topics,
  defaultTopic,
  topicFromQuery = false,
  className,
}: {
  topics: readonly ContactTopic[];
  defaultTopic?: ContactTopic;
  /**
   * Wertet `?anliegen=` aus – die Tarifkarten verlinken so auf das Formular.
   * Bewusst im Client statt über searchParams der Seite: sonst müsste
   * /kontakt bei jedem Aufruf serverseitig gerendert werden.
   */
  topicFromQuery?: boolean;
  className?: string;
}) {
  const [state, action, pending] = useActionState(submitInquiry, initial);

  /**
   * `?anliegen=` wird als externer Browser-Zustand gelesen, nicht über
   * useSearchParams: dieser Hook erzwingt eine Suspense-Grenze und nähme die
   * Seite aus dem statischen Prerendering.
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
   * Ohne Vorauswahl nur dort, wo die volle Liste angeboten wird: Bei vierzehn
   * Optionen und dem Anliegen als erstem Feld würde eine stille Vorbelegung
   * regelmäßig überlesen – und eine Kaufanfrage käme als Reparatur an. Auf den
   * Leistungsseiten ist die Teilmenge dagegen eindeutig, dort ist die
   * Vorauswahl die schnellere Bedienung.
   */
  const preselected =
    (slug ? TOPIC_BY_SLUG[slug] : undefined) ??
    defaultTopic ??
    (topics.length > 6 ? "" : topics[0]);

  const successRef = React.useRef<HTMLDivElement>(null);
  const errorRef = React.useRef<HTMLDivElement>(null);
  const fallbackRef = React.useRef<HTMLDivElement>(null);

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
          <ul className="mt-2 list-disc pl-5 text-sm">
            {Object.entries(state.errors ?? {}).map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`} className="text-accent underline">
                  {message}
                </a>
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
            {topics.map((topic) => (
              <option
                key={topic}
                value={topic}
                className="bg-ink-800 text-silver on-dark"
              >
                {topic}
              </option>
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
        <Field
          id="name"
          label="Name"
          required
          autoComplete="name"
          defaultValue={state.values?.name}
          error={state.errors?.name}
        />
        <Field
          id="email"
          label="E-Mail"
          type="email"
          required
          autoComplete="email"
          defaultValue={state.values?.email}
          error={state.errors?.email}
        />
        <Field
          id="phone"
          label="Telefon (optional)"
          type="tel"
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
          placeholder="z. B. Xiaomi Pro 2"
          defaultValue={state.values?.scooter ?? device}
          error={state.errors?.scooter}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass}>
          Was ist los? <span className="text-accent">*</span>
        </label>
        {/* Als sichtbarer Hilfetext statt als Placeholder: die Anleitung darf
            nicht verschwinden, sobald jemand zu tippen beginnt. */}
        <p id="message-hint" className="text-sm opacity-70">
          Fehlermeldung, Geräusch, Reichweite und seit wann.
        </p>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          defaultValue={state.values?.message}
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
