"use server";

import { isStoragePickupMonth } from "@/lib/data/storage";
import { FALLBACK_TOPIC, isKnownTopic } from "@/lib/data/topics";
import { fieldSlug, recordEvent } from "@/lib/metrics";
import { sendInquiry } from "@/lib/notify";
import { clientKey, limit } from "@/lib/rate-limit";

export type InquiryValues = {
  topic: string;
  name: string;
  email: string;
  phone: string;
  scooter: string;
  message: string;
  /**
   * Die beiden Zusatzangaben der Winterlagerung. Optional, weil sie nur auf
   * `/einlagerung` im Formular stehen – auf jeder anderen Seite gibt es die
   * Felder gar nicht, und ein leerer Wert wäre dort keine Antwort, sondern
   * eine Zeile ohne Frage.
   */
  detailing?: boolean;
  pickupMonth?: string;
};

export type FormState = {
  status: "idle" | "ok" | "fallback" | "error";
  message?: string;
  /** Feldname → Fehlermeldung */
  errors?: Record<string, string>;
  /**
   * Die eingegebenen Werte, zurück an das Formular.
   * React 19 setzt nach jeder Form-Action `requestFormReset()` ab – ohne diese
   * Rückgabe stünde der Nutzer nach einem Validierungsfehler vor leeren
   * Feldern und müsste alles neu tippen.
   */
  values?: InquiryValues;
};

const MAX = {
  name: 120,
  email: 200,
  phone: 60,
  scooter: 160,
  message: 4000,
} as const;

const UNAVAILABLE_MESSAGE =
  "Die Anfrage konnte gerade nicht übermittelt werden. Rufen Sie uns bitte kurz an oder schreiben Sie direkt eine E-Mail.";

const SUCCESS_MESSAGE =
  "Ihre Anfrage ist angekommen. Wir melden uns schnellstmöglich: bei Reparaturen mit einem Kostenvoranschlag, bei Suchaufträgen, sobald ein passendes Gerät geprüft ist.";

/**
 * Abwehr gegen Skripte – vier Schichten, keine davon allein ausreichend.
 *
 * Bewusst **ohne Captcha**: Jedes verfügbare (reCAPTCHA, hCaptcha, Turnstile)
 * ist ein Drittanbieter-Aufruf aus dem Browser des Kunden. Die CSP dieser
 * Seite lässt keinen zu, es gäbe eine Einwilligungsfrage, und ein Banner für
 * ein Formular, das ein paarmal am Tag abgeschickt wird, ist der schlechtere
 * Handel. Stattdessen:
 *
 *  1. **Zwei Honigtöpfe** im Formular (`company_ref`, `website`).
 *  2. **Zeitfalle** (`gestartet`): Wer in unter drei Sekunden zurückkommt,
 *     hat nicht getippt. Greift nur, wenn das Feld gesetzt ist – ohne
 *     JavaScript bleibt es leer, und der Versand ohne JavaScript soll
 *     funktionieren.
 *  3. **Inhaltsprüfung**: zwei oder mehr Adressen in der Nachricht sind
 *     Linkspam. **Eine** ist erlaubt – ein Kunde schickt den Link zu seinem
 *     Gerät oder zu einer Anzeige, und genau das soll er dürfen.
 *  4. **Drosselung** über `lib/rate-limit.ts`, geteilt über alle Instanzen,
 *     sobald der Redis-Speicher steht.
 *
 * **Ein erkannter Bot bekommt die Erfolgsmeldung.** Wer eine Abweisung
 * sieht, probiert das nächste Muster; wer „angekommen" liest, hört auf.
 * Verschickt und gezählt wird nichts – im Protokoll steht, welche Schicht
 * gegriffen hat, damit der Betreiber falsch positive Fälle findet.
 */
/* Drei Sekunden. Gemessen braucht das Formular mit Anliegen, Name, Adresse
   und einem Satz Nachricht auch bei flinkem Tippen mehr; eine Maske, die
   länger offen stand, ist ohnehin unauffällig – nach oben gibt es deshalb
   keine Grenze. */
const MIN_FILL_MS = 3000;

const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+|\[url[=\]]/gi;

function botSignal(data: FormData, message: string): string | null {
  if (str(data, "company_ref") || str(data, "website")) return "honigtopf";

  const started = Number(str(data, "gestartet"));
  if (Number.isFinite(started) && started > 0) {
    const elapsed = Date.now() - started;
    if (elapsed >= 0 && elapsed < MIN_FILL_MS) return "zu-schnell";
  }

  if ((message.match(URL_PATTERN) ?? []).length >= 2) return "linkspam";

  return null;
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
  /* Ein weiter Eimer über *allen* Aufrufen, noch vor jeder Prüfung.

     Die Bot-Erkennung darunter weist ab, ohne zu zählen – ein Skript könnte
     sonst beliebig oft mit gefülltem Honigtopf anklopfen und dabei nie an
     ein Limit stoßen. Dreißig Aufrufe in zehn Minuten sind großzügig genug,
     dass ein Mensch mit mehreren Tippfehlern nicht hineinläuft, und eng
     genug, dass niemand den Endpunkt als Dauerlast benutzt. Der enge Eimer
     weiter unten (drei *gültige* Anfragen) bleibt davon unberührt. */
  const caller = await clientKey();
  const { ok: underBurst } = await limit("anfrage-roh", caller, 30, 10 * 60);
  if (!underBurst) {
    console.warn("[anfrage] abgewiesen", { grund: "zu-viele" });
    return { status: "ok", message: SUCCESS_MESSAGE };
  }

  /* Die Nachricht wird zweimal gelesen: hier roh für die Inhaltsprüfung,
     unten getrimmt für die Anfrage selbst. */
  const rawMessage =
    typeof data.get("message") === "string" ? String(data.get("message")) : "";

  const signal = botSignal(data, rawMessage);
  if (signal) {
    console.warn("[anfrage] abgewiesen", { grund: signal });
    return { status: "ok", message: SUCCESS_MESSAGE };
  }

  /* Herkunft aus dem versteckten Feld. Sie kommt aus dem Browser und damit
     aus fremder Hand: gegen ein enges Muster geprüft, sonst „unbekannt". Sie
     landet in einer Mail und in einem Zählerfeld – beides Orte, an denen
     beliebiger Text nichts zu suchen hat. */
  const sourceRaw = str(data, "quelle").toLowerCase();
  const source = /^[a-z0-9.-]{1,24}$/.test(sourceRaw) ? sourceRaw : "unbekannt";

  const topicRaw = str(data, "topic");

  /* Die beiden Felder der Winterlagerung.

     Der Abholmonat wird gegen die Liste aus `lib/data/storage` geprüft und
     nicht übernommen, wie er ankommt: Aus einer von Hand zusammengebauten
     Adresse darf kein erfundener Zeitraum in eine Anfrage wandern –
     dieselbe Regel wie beim `?zeitraum=` der Versicherungstabelle.

     Beide gelten nur, wenn das Anliegen wirklich die Einlagerung ist. Sonst
     stünde unter einer Reparaturanfrage „VIP Detailing: ja", weil jemand das
     Feld von Hand mitgeschickt hat. */
  const isStorage = topicRaw === "Winterlagerung";
  const pickupRaw = str(data, "abholmonat");
  const detailing = isStorage && str(data, "detailing") === "ja";
  const pickupMonth =
    isStorage && isStoragePickupMonth(pickupRaw) ? pickupRaw : "";

  const inquiry: InquiryValues = {
    topic: isKnownTopic(topicRaw) ? topicRaw : FALLBACK_TOPIC,
    name: str(data, "name"),
    email: str(data, "email"),
    phone: str(data, "phone"),
    scooter: str(data, "scooter"),
    // Die Nachricht ist Body, kein Header – Umbrüche bleiben erhalten.
    message: rawMessage.trim(),
    ...(isStorage ? { detailing, pickupMonth } : {}),
  };

  const errors: Record<string, string> = {};
  // Das Kontaktformular startet ohne Vorauswahl, damit eine Kaufanfrage nicht
  // stillschweigend als Reparatur im Postfach landet.
  if (!topicRaw) errors.topic = "Bitte wählen Sie Ihr Anliegen aus.";
  if (inquiry.name.length < 2)
    errors.name = "Bitte tragen Sie Ihren Namen ein.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inquiry.email)) {
    errors.email = "Bitte eine gültige E-Mail-Adresse angeben.";
  }
  if (inquiry.message.length < 10) {
    errors.message = "Bitte beschreiben Sie Ihr Anliegen in einem Satz.";
  }
  for (const key of Object.keys(MAX) as (keyof typeof MAX)[]) {
    if (inquiry[key].length > MAX[key]) {
      errors[key] = "Diese Angabe ist zu lang.";
    }
  }

  if (Object.keys(errors).length > 0) {
    // `topic` roh zurück, nicht normalisiert: Sonst steht auf /kontakt „Bitte
    // wählen Sie Ihr Anliegen aus" über einem Feld, das den Rückfall zeigt.
    return { status: "error", errors, values: { ...inquiry, topic: topicRaw } };
  }

  /* Drei Anfragen in zehn Minuten je Aufrufer. Der Endpunkt ist
     unauthentifiziert: Ohne Limit könnte ein Skript beliebig viele Mails
     auslösen und Postfach wie Versandkontingent erschöpfen. */
  const { ok: underLimit } = await limit("anfrage", caller, 3, 10 * 60);
  if (!underLimit) {
    return {
      status: "fallback",
      message:
        "Es sind gerade mehrere Anfragen von hier eingegangen. Bitte warten Sie einen Moment oder rufen Sie uns direkt an.",
      values: { ...inquiry, topic: topicRaw },
    };
  }

  try {
    const result = await sendInquiry({ ...inquiry, source });

    /* Gezählt wird die abgeschickte, geprüfte Anfrage – nicht der Versuch und
       nicht die erfolgreiche Zustellung. Ein Ausfall des Mail-Providers darf
       die Kontaktzahl nicht senken: Der Kunde hat die Anfrage gestellt, und
       der Rückfalltext nennt ihm Nummer und Adresse.

       `await`, obwohl das Ergebnis niemanden interessiert: Auf einer
       Serverless-Plattform wird alles eingefroren, was nach der Antwort noch
       laufen will. `recordEvent` wirft nie und hat einen eigenen Zeitdeckel. */
    await recordEvent([
      "anfrage",
      `anfrage:${fieldSlug(inquiry.topic)}`,
      `quelle:${source}`,
    ]);
    if (result.delivered) return { status: "ok", message: SUCCESS_MESSAGE };
    return {
      status: "fallback",
      message:
        result.reason === "unconfigured"
          ? "Der Formularversand ist auf diesem Server noch nicht eingerichtet. Bitte rufen Sie uns kurz an oder schreiben Sie direkt eine E-Mail. Wir kümmern uns sofort darum."
          : UNAVAILABLE_MESSAGE,
      values: { ...inquiry, topic: topicRaw },
    };
  } catch (err) {
    /* Netzfehler oder Zeitüberschreitung. Der Nutzer bekommt den Rückfall,
       der Betreiber muss es im Protokoll sehen – sonst fällt ein Ausfall des
       Versands erst auf, wenn wochenlang keine Anfrage mehr ankommt. Nur die
       Fehlerart, keine Nutzerdaten (siehe notify.ts). */
    console.error(
      "[anfrage] Versand abgebrochen",
      err instanceof Error ? err.name : "unknown",
    );
    return {
      status: "fallback",
      message: UNAVAILABLE_MESSAGE,
      values: { ...inquiry, topic: topicRaw },
    };
  }
}
