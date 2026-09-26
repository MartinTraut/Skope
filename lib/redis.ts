import "server-only";

/**
 * Der eine Zugang zu Upstash Redis über REST.
 *
 * Er lag bis zum 26.09.2026 in `lib/metrics.ts` und war damit an den Zähler
 * gebunden. Seit die Drosselung des Formulars denselben Speicher braucht,
 * steht er hier: Zwei Module mit je eigener `fetch`-Schleife laufen beim
 * ersten Eingriff auseinander – und es ist genau die Stelle, an der ein
 * fehlender Zeitdeckel eine Server Action hängen lässt.
 *
 * Ohne die beiden Umgebungsvariablen gibt es keinen Speicher. Dann liefert
 * `redisPipeline` `null`, und jeder Aufrufer entscheidet selbst, was das
 * heißt: Der Zähler zählt nicht, die Drosselung fällt auf ihren Notbehelf im
 * Prozessspeicher zurück. Es gibt keinen Zustand, in dem etwas so tut, als
 * sei es angeschlossen.
 */
function config() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

export function redisMode(): "on" | "off" {
  return config() ? "on" : "off";
}

/**
 * Eine Folge von Befehlen an Redis, `null` bei jedem Fehler.
 *
 * Wirft nie. Weder ein Zähler noch eine Drosselung darf eine Anfrage
 * scheitern lassen; was bei einem Ausfall gilt, entscheidet der Aufrufer.
 */
export async function redisPipeline(
  commands: string[][],
  label = "redis",
): Promise<unknown[] | null> {
  const cfg = config();
  if (!cfg) return null;
  try {
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
      cache: "no-store",
      // Ohne Deckel hängt eine Server Action am Speicher, und der ist für die
      // Anfrage selbst völlig nebensächlich.
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      console.error(`[${label}] Speicher antwortet`, res.status);
      return null;
    }
    const body = (await res.json()) as { result?: unknown; error?: string }[];
    return body.map((entry) => entry.result ?? null);
  } catch (err) {
    console.error(
      `[${label}] Speicher nicht erreichbar`,
      err instanceof Error ? err.name : "unknown",
    );
    return null;
  }
}
