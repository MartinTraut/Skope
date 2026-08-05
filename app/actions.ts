"use server";

import { headers } from "next/headers";

import { FALLBACK_TOPIC, isKnownTopic } from "@/lib/data/topics";
import { sendInquiry } from "@/lib/notify";

export type FormState = {
  status: "idle" | "ok" | "fallback" | "error";
  message?: string;
  /** Feldname → Fehlermeldung */
  errors?: Record<string, string>;
};

const MAX = {
  name: 120,
  email: 200,
  phone: 60,
  scooter: 160,
  message: 4000,
} as const;

const SUCCESS_MESSAGE =
  "Ihre Anfrage ist angekommen. Wir melden uns schnellstmöglich — bei Reparaturen mit einem Kostenvoranschlag.";

/**
 * Einfache Drosselung pro IP. Der Endpunkt ist unauthentifiziert: ohne Limit
 * könnte ein Skript beliebig viele Mails auslösen und das Postfach des
 * Betreibers sowie das Kontingent des Mail-Providers erschöpfen.
 *
 * TODO Betreiber: Bei Deployment auf mehrere Instanzen (Vercel) reicht
 * Modul-State nicht aus — dann auf @upstash/ratelimit oder @vercel/kv wechseln.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(key: string, now: number) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);

  // Alte Einträge aufräumen, damit die Map nicht unbegrenzt wächst.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

function str(data: FormData, key: string) {
  const value = data.get(key);
  // Zeilenumbrüche raus: die Werte landen in Mail-Headern.
  return typeof value === "string" ? value.replace(/[\r\n]+/g, " ").trim() : "";
}

export async function submitInquiry(
  _prev: FormState,
  data: FormData,
): Promise<FormState> {
  // Honeypot: von Menschen nie ausgefüllt, von Bots fast immer.
  // Gibt dieselbe Meldung wie der Erfolgsfall zurück, damit ein
  // fälschlich ausgefülltes Feld keine halbe Bestätigung erzeugt.
  if (str(data, "company_ref")) {
    return { status: "ok", message: SUCCESS_MESSAGE };
  }

  const topicRaw = str(data, "topic");
  const inquiry = {
    topic: isKnownTopic(topicRaw) ? topicRaw : FALLBACK_TOPIC,
    name: str(data, "name"),
    email: str(data, "email"),
    phone: str(data, "phone"),
    scooter: str(data, "scooter"),
    // Die Nachricht ist Body, kein Header — Umbrüche bleiben erhalten.
    message:
      typeof data.get("message") === "string"
        ? String(data.get("message")).trim()
        : "",
  };

  const errors: Record<string, string> = {};
  if (inquiry.name.length < 2) errors.name = "Bitte tragen Sie Ihren Namen ein.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inquiry.email)) {
    errors.email = "Bitte eine gültige E-Mail-Adresse angeben.";
  }
  if (inquiry.message.length < 10) {
    errors.message = "Bitte beschreiben Sie Ihr Anliegen in einem Satz.";
  }
  for (const [key, limit] of Object.entries(MAX)) {
    if ((inquiry as Record<string, string>)[key].length > limit) {
      errors[key] = "Diese Angabe ist zu lang.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors };
  }

  const forwarded = (await headers()).get("x-forwarded-for") ?? "unknown";
  if (rateLimited(forwarded.split(",")[0].trim(), Date.now())) {
    return {
      status: "fallback",
      message:
        "Es sind gerade mehrere Anfragen von hier eingegangen. Bitte warten Sie einen Moment oder rufen Sie uns direkt an.",
    };
  }

  try {
    const { delivered } = await sendInquiry(inquiry);
    return delivered
      ? { status: "ok", message: SUCCESS_MESSAGE }
      : {
          status: "fallback",
          message:
            "Der Formularversand ist auf diesem Server noch nicht eingerichtet. Bitte rufen Sie uns kurz an oder schreiben Sie direkt eine E-Mail — wir kümmern uns sofort darum.",
        };
  } catch {
    return {
      status: "fallback",
      message:
        "Die Anfrage konnte gerade nicht übermittelt werden. Rufen Sie uns bitte kurz an oder schreiben Sie direkt eine E-Mail.",
    };
  }
}
