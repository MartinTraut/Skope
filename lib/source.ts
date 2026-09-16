/**
 * Woher ein Besuch kam – im Browser bestimmt, einmal je Sitzung.
 *
 * Die Frage, die das beantworten soll, ist eine Abrechnungsfrage: Wie viele
 * Kontakte entstehen über die Website? Dafür genügt ein grobes Wort –
 * „google", „direkt", „instagram" –, keine Kennung und keine Reise über
 * mehrere Besuche.
 *
 * Gespeichert wird in `sessionStorage`, nicht in einem Cookie: Der Wert
 * überlebt den Tab nicht, wird nie an den Server mitgesendet und dient allein
 * dazu, beim Absenden eines Formulars noch zu wissen, über welchen Weg die
 * erste Seite geöffnet wurde. Nach § 25 Abs. 2 Nr. 2 TDDDG ist das für den
 * ausdrücklich gewünschten Dienst erforderlich – ohne Einwilligung zulässig.
 * Wer hier auf `localStorage` oder ein Cookie wechselt, ändert genau das.
 */

const KEY = "skope:quelle";

/** Bekannte Herkünfte. Alles andere wird zu „sonstige" – damit bleibt die
 *  Liste der Zählerfelder endlich, auch wenn jemand `?utm_source=` mit
 *  beliebigem Inhalt aufruft. */
const KNOWN = [
  "google",
  "bing",
  "instagram",
  "facebook",
  "youtube",
  "tiktok",
  "kleinanzeigen",
  "ebay",
  "maps",
  "direkt",
] as const;

function normalize(raw: string): string {
  const v = raw.toLowerCase();
  const hit = KNOWN.find((k) => v.includes(k));
  if (hit) return hit;
  return v.replace(/[^a-z0-9.-]/g, "").slice(0, 24) || "sonstige";
}

function detect(): string {
  const params = new URLSearchParams(window.location.search);
  const utm = params.get("utm_source");
  if (utm) return normalize(utm);

  const ref = document.referrer;
  if (!ref) return "direkt";
  try {
    const host = new URL(ref).hostname;
    // Ein Wechsel innerhalb der eigenen Seite ist keine Herkunft.
    if (host === window.location.hostname) return "direkt";
    return normalize(host.replace(/^www\./, ""));
  } catch {
    return "direkt";
  }
}

/**
 * Die Herkunft dieser Sitzung. Beim ersten Aufruf bestimmt, danach konstant –
 * sonst stünde bei jemandem, der über Google kommt und dann drei Seiten
 * weiterklickt, am Ende „direkt" im Formular.
 */
export function visitSource(): string {
  if (typeof window === "undefined") return "unbekannt";
  try {
    const stored = window.sessionStorage.getItem(KEY);
    if (stored) return stored;
    const value = detect();
    window.sessionStorage.setItem(KEY, value);
    return value;
  } catch {
    // Privater Modus, gesperrter Speicher: dann eben ohne Gedächtnis.
    return detect();
  }
}
