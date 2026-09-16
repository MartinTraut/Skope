"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  accessToken,
  METRICS_COOKIE,
  metricsPassword,
  sameSecret,
} from "@/lib/metrics-view";

/**
 * Passwort prüfen und den Zugang als Cookie setzen.
 *
 * Die Verzögerung bei einem Fehlversuch ist kein Schmuck: Der Endpunkt ist
 * öffentlich erreichbar, und ohne sie ließe sich ein kurzes Passwort in
 * Stunden durchprobieren. Eine halbe Sekunde macht daraus Jahre und fällt
 * einem Menschen, der einmal danebentippt, nicht auf.
 */
export async function unlock(data: FormData) {
  const expected = metricsPassword();
  if (!expected) redirect("/");

  const given = typeof data.get("passwort") === "string"
    ? String(data.get("passwort"))
    : "";

  if (!sameSecret(given, expected)) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    redirect("/kennzahlen");
  }

  const jar = await cookies();
  jar.set(METRICS_COOKIE, accessToken(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/kennzahlen",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/kennzahlen");
}
