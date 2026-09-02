import type { NextConfig } from "next"

/**
 * Sicherheitskopfzeilen.
 *
 * Alle Ressourcen der Seite sind eigene: `next/font` liegt selbst gehostet,
 * es gibt kein `<Script>` von Dritten, kein iframe, keine Karte als Embed
 * (die Lagekarte ist ein PNG). Deshalb ist eine strenge CSP ohne Nonce-Proxy
 * möglich. `'unsafe-inline'` bleibt an zwei Stellen nötig: Next bootet über
 * Inline-Skripte, und der `<noscript>`-Block im Layout schreibt ein
 * `<style>`-Element; `next/image` und Tailwind setzen Inline-Styles. `'unsafe-eval'` braucht nur der
 * Entwicklungsserver (React Refresh); im Produktionsbuild fehlt es.
 * `blob:` und `data:` bei `img-src` sind für die Platzhalter von `next/image`.
 *
 * HSTS setzt Vercel selbst; `X-Frame-Options` steht neben `frame-ancestors`
 * für Browser, die die CSP-Direktive nicht kennen.
 */
const dev = process.env.NODE_ENV !== "production"

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ")

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ]
  },
}

export default nextConfig
