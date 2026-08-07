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
 * Kein `focus:outline-none`: Der Rahmenwechsel allein bleibt unter dem für
 * Fokusindikatoren geforderten Kontrast (WCAG 2.4.11). Die globale
 * `:focus-visible`-Outline aus globals.css muss hier greifen dürfen.
 */
const fieldClass =
  "w-full rounded-sm border border-current/45 bg-transparent px-4 py-3.5 text-current placeholder:text-current/55 transition-colors duration-200 focus:border-flame";

const labelClass =
  "font-display text-xs font-semibold tracking-[0.14em] uppercase opacity-70";

export function InquiryForm({
  topics,
  defaultTopic,
  topicFromQuery = false,
  className,
}: {
  topics: readonly ContactTopic[];
  defaultTopic?: ContactTopic;
  /**
   * Wertet `?anliegen=` aus — die Tarifkarten verlinken so auf das Formular.
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
  const slug = topicFromQuery ? new URLSearchParams(search).get("anliegen") : null;

  /**
   * Ohne Vorauswahl nur dort, wo die volle Liste angeboten wird: Bei vierzehn
   * Optionen und dem Anliegen als erstem Feld würde eine stille Vorbelegung
   * regelmäßig überlesen — und eine Kaufanfrage käme als Reparatur an. Auf den
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
   * der Fokus fällt zurück auf <body>. Das gilt auch für den Fallback — dort
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
            className="inline-flex items-center gap-2.5 font-display font-semibold text-flame hover:underline"
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
    <form action={action} className={cn("flex flex-col gap-6", className)}>
      {/* Honeypot — für Menschen unsichtbar. Neutraler Feldname, damit
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
          className="rounded-sm border border-flame/50 bg-flame/8 p-5"
        >
          <p className="font-display font-semibold">
            {errorCount === 1
              ? "Bitte prüfen Sie eine Angabe:"
              : `Bitte prüfen Sie ${errorCount} Angaben:`}
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {Object.entries(state.errors ?? {}).map(([field, message]) => (
              <li key={field}>
                <a href={`#${field}`} className="text-flame underline">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="text-sm opacity-70">
        Mit <span className="text-flame">*</span> markierte Felder sind
        Pflichtfelder.
      </p>

      <div className="flex flex-col gap-2">
        <label htmlFor="topic" className={labelClass}>
          Anliegen {preselected === "" ? <span className="text-flame">*</span> : null}
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
              <option value="" disabled className="bg-ink-800 text-paper">
                Bitte wählen
              </option>
            ) : null}
            {topics.map((topic) => (
              <option key={topic} value={topic} className="bg-ink-800 text-paper">
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
          <p id="topic-error" className="text-sm text-flame">
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
        <Field
          id="scooter"
          label="Marke & Modell (optional)"
          placeholder="z. B. Xiaomi Pro 2"
          defaultValue={state.values?.scooter}
          error={state.errors?.scooter}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass}>
          Was ist los? <span className="text-flame">*</span>
        </label>
        {/* Als sichtbarer Hilfetext statt als Placeholder: die Anleitung darf
            nicht verschwinden, sobald jemand zu tippen beginnt. */}
        <p id="message-hint" className="text-sm opacity-70">
          Fehlermeldung, Geräusch, Reichweite — und seit wann.
        </p>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          defaultValue={state.values?.message}
          aria-invalid={state.errors?.message ? true : undefined}
          aria-describedby={
            state.errors?.message ? "message-hint message-error" : "message-hint"
          }
          className={cn(fieldClass, "resize-y")}
        />
        {state.errors?.message ? (
          <p id="message-error" className="text-sm text-flame">
            {state.errors.message}
          </p>
        ) : null}
      </div>

      {state.status === "fallback" ? (
        <div
          ref={fallbackRef}
          tabIndex={-1}
          role="alert"
          className="flex items-start gap-3 rounded-sm border border-flame/50 bg-flame/8 p-5"
        >
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-flame"
          />
          <div>
            <p className="leading-relaxed">{state.message}</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-display font-semibold">
              <a
                href={site.phone.href}
                className="inline-flex items-center gap-2 text-flame hover:underline"
              >
                <Phone className="size-4" aria-hidden="true" />
                <span className="tabular">{site.phone.display}</span>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="break-all text-flame hover:underline"
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
        {/* Art. 13 DSGVO verlangt den Verweis an der Erhebungsstelle — und an
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
        {props.required ? <span className="text-flame"> *</span> : null}
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
        <p id={`${id}-error`} className="text-sm text-flame">
          {error}
        </p>
      ) : null}
    </div>
  );
}
