"use client";

import * as React from "react";

/**
 * Die Adresszeile als gemeinsamer Zustand für Client-Bauteile.
 *
 * Die Seite ist vollständig statisch vorgebaut; eine Auswahl darf deshalb
 * nicht im Server-Rendering hängen. Sie steht in der Adresse
 * (`?anliegen=wartungsvertrag-premium`), und wer sie braucht – Formular,
 * Tarifkarte, untere Aktionsleiste – liest sie hier. Ein zweiter Zustand in
 * React wäre eine zweite Wahrheit: Beim Teilen der Adresse, beim
 * Zurück-Knopf und beim Neuladen liefe er auseinander.
 *
 * `useSyncExternalStore` statt `useSearchParams`: Der Hook von Next erzwingt
 * eine Suspense-Grenze und nähme der Seite das statische Vorbauen. Der
 * Server-Wert ist deshalb bewusst leer – vorbelegt wird erst im Browser.
 */
const EVENT = "skope:urlchange";

export function subscribeToUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

/**
 * Nach einem `history.pushState`/`replaceState` von Hand aufzurufen: Beide
 * lösen kein `popstate` aus – ohne dieses Signal merkt kein Bauteil, dass die
 * Auswahl sich geändert hat.
 */
export function notifyUrlChange() {
  window.dispatchEvent(new Event(EVENT));
}

/** Eine einzelne Angabe aus der Adresse, gekürzt auf eine sichere Länge. */
export function useQueryParam(name: string, maxLength = 80) {
  const search = React.useSyncExternalStore(
    subscribeToUrl,
    () => window.location.search,
    () => "",
  );
  return React.useMemo(() => {
    const value = new URLSearchParams(search).get(name);
    return value ? value.slice(0, maxLength) : null;
  }, [search, name, maxLength]);
}
