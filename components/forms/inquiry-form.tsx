"use client";

import * as React from "react";
import { useActionState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Loader2,
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

const fieldClass =
  "w-full rounded-sm border border-current/45 bg-transparent px-4 py-3.5 text-current placeholder:text-current/55 transition-colors duration-200 focus:border-flame focus:outline-none";

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
  const preselected =
    (slug ? TOPIC_BY_SLUG[slug] : undefined) ?? defaultTopic ?? topics[0];

  const successRef = React.useRef<HTMLDivElement>(null);
  const errorRef = React.useRef<HTMLDivElement>(null);

  /**
   * Ohne Fokuswechsel bekommen Tastatur- und Screenreader-Nutzer nach dem
   * Absenden gar keine Rückmeldung: Der fokussierte Button verschwindet und
   * der Fokus fällt zurück auf <body>.
   */
  React.useEffect(() => {
    if (state.status === "ok") successRef.current?.focus();
    if (state.status === "error") errorRef.current?.focus();
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
          Anliegen
        </label>
        <div className="relative">
          <select
            key={preselected}
            id="topic"
            name="topic"
            defaultValue={preselected}
            className={cn(fieldClass, "appearance-none pr-12")}
          >
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
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="name"
          label="Name"
          required
          autoComplete="name"
          error={state.errors?.name}
        />
        <Field
          id="email"
          label="E-Mail"
          type="email"
          required
          autoComplete="email"
          error={state.errors?.email}
        />
        <Field
          id="phone"
          label="Telefon (optional)"
          type="tel"
          autoComplete="tel"
          error={state.errors?.phone}
        />
        <Field
          id="scooter"
          label="Marke & Modell (optional)"
          placeholder="z. B. Xiaomi Pro 2"
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
        <p className="text-sm opacity-70">
          Ihre Daten nutzen wir ausschließlich zur Bearbeitung dieser Anfrage.
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
