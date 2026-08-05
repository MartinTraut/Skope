# SKOPE — E-Scooter Fachwerkstatt Neuenstadt am Kocher

Relaunch von `skopegebrauchtwarenhandel.com`. Next.js 16 (App Router),
TypeScript, Tailwind v4. Alle Seiten werden statisch vorgerendert.

Die strategischen und gestalterischen Entscheidungen sowie sämtliche
offenen Punkte stehen in **[PROJECT-BRIEF.md](./PROJECT-BRIEF.md)**.

## Entwickeln

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Produktionsbuild
npm run lint
npm run typecheck
```

## Wo was liegt

| Pfad | Inhalt |
|---|---|
| `lib/site.ts` | Stammdaten: Adresse, Telefon, USt-ID, Einzugsgebiet, Navigation |
| `lib/data/` | Inhalte: Leistungen, Wartungsverträge, ERGO-Tarife, FAQ, Kundenstimmen |
| `lib/inventory.ts` | Aktueller Bestand an refurbished E-Scootern (derzeit leer) |
| `lib/schema.tsx` | Strukturierte Daten als verbundener `@graph` |
| `lib/notify.ts` | Versand-Adapter für Formularanfragen |
| `components/sections/` | Wiederverwendbare Seitenabschnitte |
| `app/globals.css` | Designsystem: Farben, Fluid Type, Motion |

## Konfiguration

Für den Versand der Formularanfragen (`lib/notify.ts`):

```bash
RESEND_API_KEY=...              # API-Key des Mail-Providers
INQUIRY_FROM=noreply@ihre-domain.de   # verifizierte Absenderadresse
INQUIRY_TO=...                  # optional, sonst die E-Mail aus lib/site.ts
```

Ohne diese Variablen zeigt das Formular einen ehrlichen Hinweis mit
Telefonnummer und E-Mail-Adresse statt einer Erfolgsmeldung für eine Mail,
die nie ankommt.

## Deployment

Vercel-kompatibel, keine Laufzeitabhängigkeiten. Vor dem Livegang die
offenen `TODO`-Punkte aus `PROJECT-BRIEF.md` abarbeiten — insbesondere
Öffnungszeiten, finale Domain und die Prüfung der Rechtstexte.
