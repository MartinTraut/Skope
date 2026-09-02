import "server-only";

import { site } from "@/lib/site";

export type Inquiry = {
  topic: string;
  name: string;
  email: string;
  phone?: string;
  scooter?: string;
  message: string;
};

/**
 * Versand-Adapter für Formularanfragen.
 *
 * TODO Betreiber: einen Mail-Provider anbinden. Vorbereitet für Resend –
 * `RESEND_API_KEY` und optional `INQUIRY_TO` in den Umgebungsvariablen setzen,
 * dann läuft der Versand ohne weitere Codeänderung.
 * Ohne Key wird die Anfrage nur serverseitig protokolliert und die Nutzerin
 * bekommt einen ehrlichen Hinweis, direkt anzurufen – statt einer stillen
 * Erfolgsmeldung für eine Mail, die nie ankommt.
 */
export type SendResult =
  | { delivered: true }
  /**
   * `unconfigured`: kein Schlüssel oder Absender gesetzt – der Betreiber hat
   * den Versand noch nicht eingerichtet. `provider`: eingerichtet, aber der
   * Dienst hat den Versand abgelehnt. Die Action zeigt dem Nutzer je nach
   * Grund einen anderen Text; „noch nicht eingerichtet" wäre bei einem
   * Ausfall des Dienstes eine falsche Aussage über den eigenen Betrieb.
   */
  | { delivered: false; reason: "unconfigured" | "provider" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Empfängeradresse. Ein Tippfehler in der Umgebung (`INQUIRY_TO=…,`) ließe
 * den Dienst jede Anfrage mit 422 ablehnen – und das fiele erst auf, wenn
 * ein Kunde anruft und fragt, warum niemand antwortet. Eine ungültige Angabe
 * wird deshalb protokolliert und durch die Adresse aus `lib/site.ts` ersetzt.
 */
function recipient() {
  const to = process.env.INQUIRY_TO?.trim();
  if (!to) return site.email;
  if (EMAIL.test(to)) return to;
  console.error("[anfrage] INQUIRY_TO ist keine gültige Adresse, nehme site.email");
  return site.email;
}

export async function sendInquiry(inquiry: Inquiry): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = recipient();
  const from = process.env.INQUIRY_FROM;

  if (!apiKey || !from) {
    // Bewusst ohne Namen oder E-Mail: Serverlogs sind ein eigener
    // Verarbeitungsort mit eigener Aufbewahrungsfrist (Art. 5 Abs. 1 lit. c DSGVO).
    console.warn(
      "[anfrage] Kein Mail-Provider konfiguriert, Anfrage nicht zugestellt.",
      { topic: inquiry.topic },
    );
    return { delivered: false, reason: "unconfigured" };
  }

  const lines = [
    `Thema: ${inquiry.topic}`,
    `Name: ${inquiry.name}`,
    `E-Mail: ${inquiry.email}`,
    inquiry.phone ? `Telefon: ${inquiry.phone}` : null,
    inquiry.scooter ? `Scooter: ${inquiry.scooter}` : null,
    "",
    inquiry.message,
  ].filter(Boolean);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: inquiry.email,
      subject: `Anfrage über die Website: ${inquiry.topic}`,
      text: lines.join("\n"),
    }),
    // Ohne Timeout blockiert eine hängende API die Server Action bis zum
    // Plattform-Limit – der Nutzer sähe minutenlang den Spinner.
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    // Der Fehlerbody nennt die Ursache (unverifizierte Domain, ungültiges
    // `from`) und enthält keine Nutzerdaten.
    console.error(
      "[anfrage] Versand fehlgeschlagen",
      response.status,
      await response.text().catch(() => ""),
    );
    return { delivered: false, reason: "provider" };
  }

  return { delivered: true };
}
