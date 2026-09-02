import { cache } from "react";

import { googleRatingFallback } from "@/lib/site";

/**
 * Note und Anzahl der Google-Rezensionen, täglich frisch.
 *
 * Vorher stand beides als Konstante in `lib/site.ts` und musste vor jedem
 * Deploy von Hand abgeglichen werden. Genau das ist einmal schiefgegangen: Die
 * Seite behauptete drei Rezensionen, weil die Zahl aus der Länge unserer
 * eigenen Zitatliste kam statt aus dem Profil; im Profil standen 37. Eine Zahl,
 * die nur bei einem Deploy stimmt, ist zwischen zwei Deploys eine
 * Tatsachenbehauptung ins Blaue – und sie wächst weiter, während niemand
 * hinsieht.
 *
 * Quelle ist die Places API (New), Endpunkt „Place Details". Abgefragt werden
 * ausschließlich `rating` und `userRatingCount`; die Feldmaske ist Pflicht und
 * bestimmt zugleich den Preis, weil Google nach angeforderten Feldern
 * abrechnet. Bei einer Auffrischung am Tag sind das rund 30 Aufrufe im Monat.
 *
 * **Zwei Dinge, die man wissen muss, bevor man hier etwas ändert:**
 *
 * 1. Die Nutzungsbedingungen der Places API erlauben das Zwischenspeichern der
 *    Inhalte nur befristet. 24 Stunden liegen weit darunter und sind zugleich
 *    die Auflösung, die diese Zahl braucht – ein Betrieb mit 37 Rezensionen
 *    bekommt keine zwei am Tag.
 * 2. Die Anzeige bleibt an den sichtbaren Verweis auf das Profil gebunden
 *    (`site.googleProfile`). Weiterhin **kein** `AggregateRating` im Schema:
 *    Eine Bewertung, die ein Betrieb über sich selbst auszeichnet, wertet
 *    Google als self-serving, und das kostet die Auszeichnung für die ganze
 *    Domain. Dass die Zahl jetzt aus Googles eigener Schnittstelle kommt,
 *    ändert daran nichts.
 *
 * Ohne Schlüssel oder Ortskennung liefert die Funktion den zuletzt von Hand
 * abgeglichenen Stand aus `lib/site.ts` und meldet `live: false`. Das ist der
 * Grund, warum sie nie wirft: Ein Ausfall bei Google darf die Startseite nicht
 * mitnehmen, und „0 Rezensionen" wäre schlimmer als ein Wert von gestern.
 */
export type GoogleRating = {
  /** Note in deutscher Schreibweise, z. B. „5,0". */
  value: string;
  /** Anzahl der Rezensionen. */
  count: number;
  /** Note gerundet auf ganze Sterne – für die Sternreihe. */
  stars: number;
  /** Kam der Wert aus der Schnittstelle oder aus dem Rückfall? */
  live: boolean;
};

const fallback: GoogleRating = {
  ...googleRatingFallback,
  stars: Math.round(Number(googleRatingFallback.value.replace(",", "."))),
  live: false,
};

/** Einmal am Tag. Die Zahl wächst in Monaten, nicht in Minuten. */
const REVALIDATE_SECONDS = 60 * 60 * 24;

/*
 * `cache()` und nicht bloß der fetch-Cache: Header, Kopfbereich und
 * Kundenstimmen fragen denselben Wert innerhalb einer Anfrage ab. Ohne die
 * Klammer stünden im schlechtesten Fall zwei Stände auf derselben Seite –
 * oben 37, unten 38 –, und das fällt genau der Person auf, die zählt.
 */
export const getGoogleRating = cache(async (): Promise<GoogleRating> => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!key || !placeId) return fallback;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=de&regionCode=DE`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "rating,userRatingCount",
        },
        next: { revalidate: REVALIDATE_SECONDS },
        /* Der Aufruf läuft im Root-Layout, also beim Build und bei jeder
           Regeneration jeder Route. Ohne Frist hinge ein hängendes Google
           den Build bis zum Standard-Timeout von Undici (fünf Minuten). */
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!res.ok) return fallback;

    const data: unknown = await res.json();
    if (typeof data !== "object" || data === null) return fallback;

    const { rating, userRatingCount } = data as {
      rating?: unknown;
      userRatingCount?: unknown;
    };

    /* Beides muss stimmen, sonst gilt der Rückfall. Ein Profil ohne
       Rezensionen liefert die Felder gar nicht mit – dann steht hier `undefined`
       und nicht etwa 0, und ein stillschweigendes „0,0 von 5 Sternen" wäre der
       teuerste denkbare Anzeigefehler. */
    if (
      typeof rating !== "number" ||
      typeof userRatingCount !== "number" ||
      !Number.isFinite(rating) ||
      rating <= 0 ||
      userRatingCount < 1
    ) {
      return fallback;
    }

    return {
      value: rating.toFixed(1).replace(".", ","),
      count: Math.trunc(userRatingCount),
      stars: Math.round(rating),
      live: true,
    };
  } catch {
    /* Netzfehler, Zeitüberschreitung, ungültiges JSON – alles derselbe Fall. */
    return fallback;
  }
});
