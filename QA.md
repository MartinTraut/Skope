# QA — Stand 14.09.2026

Prüfdurchgang zu den externen Review-Prompts 08 bis 11, gemessen gegen den
**Produktionsbuild** (`next build` + `next start`, Port 4312), nicht gegen den
Entwicklungsserver. Alle Zahlen in dieser Datei sind gemessen; wo etwas nicht
prüfbar war, steht das als offener Punkt und nicht als Ergebnis.

## Werkzeug

Playwright liegt nicht im Projekt, sondern im Sitzungsordner. Die Skripte
(`sweep.mjs`, `seo.mjs`, `schema.mjs`, `perf.mjs`, `anim.mjs`, `reduced.mjs`,
`a11y.mjs`, `robust.mjs`, `back.mjs`) sind nicht Teil des Repositorys —
es gibt in diesem Projekt keine Testinfrastruktur, und eine halbe einzurichten
wäre mehr Versprechen als Nutzen. Die Befehle, die jederzeit laufen:

```
npx tsc --noEmit && npx eslint . && npm run build
```

## Automatische Prüfungen

| Prüfung | Befehl | Ergebnis |
|---|---|---|
| Typen | `npx tsc --noEmit` | ohne Befund |
| Lint | `npx eslint .` | ohne Befund |
| Produktionsbuild | `npm run build` | erfolgreich, 30 Seiten, alle statisch |
| Abhängigkeiten | `npm audit --omit=dev` | ohne Befund nach `next` 16.3.4 → **16.3.5** und `npm audit fix` (nanoid GHSA-2v37-7h3g-55p8) |
| Unit-/E2E-Tests | — | **gibt es nicht** (kein Testframework im Projekt) |

## Routen × Breiten

13 Routen × 10 Breiten = **130 Prüfungen**. Routen: `/`, `/e-scooter`,
`/e-scooter/zamelux-green-e9`, `/reparatur`, `/wartungsvertrag`,
`/versicherung`, `/recycling`, `/ueber-uns`, `/kontakt`, `/impressum`,
`/datenschutz`, `/agb`, eine 404-Adresse.
Breiten: 320, 375, 390, 430, 640, 768, 1024, 1280, 1440 und Querformat
844 × 390. Jede Seite wird dabei vollständig durchgescrollt.

Geprüft je Kombination: waagerechter Überlauf
(`scrollWidth − clientWidth`), Konsolenfehler, Schriftgrade unter 11 px,
Zielflächen unter 44 × 44 px.

**Ergebnis: kein Überlauf, keine Kleinstschrift, keine zu kleine Zielfläche,
keine Konsolenfehler.**

Zwei wiederkehrende Roh-Treffer sind Messartefakte und keine Fehler:

- `INPUT 193×28` auf jeder Formularseite ist der Honeypot
  (`absolute -left-[9999px]`, `aria-hidden`, `tabIndex={-1}`).
- Der Konsolenfehler auf der 404-Adresse ist die 404 selbst.
- Ein Lauf meldete „Zurück zum Bestand" bei 1440 px mit knapp unter 44 px Höhe.
  Nachgemessen im Ruhezustand: **44 × 180 px**. Der Treffer entsteht, während
  die Schriftdatei noch lädt, und ist keine dauerhafte Eigenschaft.

## SEO und Indexierung

| Route | Titel | Description | H1 | Sprung in der Hierarchie | Canonical |
|---|---|---|---|---|---|
| `/` | 47 | 151 | 1 | – | ✓ |
| `/e-scooter` | 47 | 151 | 1 | – | ✓ |
| `/e-scooter/<gerät>` | 46 | 140 | 1 | – | ✓ |
| `/reparatur` | 50 | 148 | 1 | – | ✓ |
| `/wartungsvertrag` | 53 | 152 | 1 | – | ✓ |
| `/versicherung` | 53 | 155 | 1 | – | ✓ |
| `/recycling` | 51 | 148 | 1 | – | ✓ |
| `/ueber-uns` | 48 | 160 | 1 | – | ✓ |
| `/kontakt` | 50 | 149 | 1 | – | ✓ |
| `/impressum` | 17 | 139 | 1 | – | ✓ |
| `/datenschutz` | 28 | 152 | 1 | – | ✓ |
| `/agb` | 32 | 142 | 1 | – | ✓ |

Genau eine H1 je Route, kein übersprungener Überschriftengrad, kein Bild ohne
`alt`-Attribut, Canonical überall auf `site.url`. Sitemap: 24 Adressen, kein
`lastmod` (Absicht — das Datum trägt der `WebPage`-Knoten).

**Vorschau bleibt draußen, Produktion bleibt drin.** Gemessen mit
`VERCEL_ENV=preview npm run build`:

| | robots.txt | `<meta name="robots">` |
|---|---|---|
| Vorschau | `Disallow: /` | `noindex, nofollow` |
| Produktion | `Allow: /` | `index, follow` |

**Wichtig für den Betrieb:** `VERCEL_ENV` muss beim **Bauen** gesetzt sein,
nicht erst beim Starten. Alle Seiten sind statisch vorgebaut; ein zur Laufzeit
gesetztes `VERCEL_ENV=preview` ändert an der ausgelieferten Datei nichts. Auf
Vercel ist das der Normalfall, lokal ist es eine Stolperstelle.

## Strukturierte Daten

Ein `@graph` je Seite, 5 bis 11 Knoten, **kein `@id`-Verweis ohne Ziel**,
`dateModified` auf jeder Route. `FAQPage` steht auf `/`, `/e-scooter`,
`/reparatur`, `/wartungsvertrag` und `/versicherung` — also genau dort, wo
eine FAQ sichtbar im Dokument steht. Kein `AggregateRating` (eine Bewertung
über die eigene Organisation wertet Google als self-serving).

Verfügbarkeit im `Offer` kommt jetzt aus `AVAILABILITY_SCHEMA` und nicht mehr
fest aus `InStock` — gemessen mit je einem versuchsweise auf `reserved` und
`sold` gesetzten Gerät: `OutOfStock` bzw. `SoldOut`, und dieselbe Aussage in
Karte, Geräteseite und unterer Aktionsleiste.

## Formulare

Ein Bauteil (`components/forms/inquiry-form.tsx`), sieben Einbaustellen, ein
Ziel: die Server Action `submitInquiry` in `app/actions.ts`.

| Fall | Erwartung | Gemessen |
|---|---|---|
| Gültige Anfrage, kein Mail-Provider | ehrlicher Hinweis, **kein** Erfolg | „noch nicht eingerichtet" + Telefon |
| Vier Pflichtfelder leer/falsch | Zusammenfassung + Feldfehler | 4 Meldungen, Werte bleiben stehen |
| Honeypot ausgefüllt | Erfolgsseite, kein Versand | wie erwartet |
| `topic` mit Header-Injection | auf Whitelist zurückgesetzt | „Sonstiges" |
| Vierte Anfrage in 10 Minuten | Drosselung | ab dem 4. Versuch abgewiesen |
| **Ohne JavaScript** (roher POST) | Server verarbeitet | HTTP 200, Antwort wie mit Skript |
| Verbindung bricht beim Absenden ab | ehrlicher Hinweis + Telefonnummer | Auffangnetz greift |
| Doppelklick | zweiter Klick wirkungslos | Knopf ist während `pending` gesperrt |

Vorbelegungen: `?anliegen=` (acht Kürzel) und `?geraet=` (Modellname) kommen im
Formular an; die Tarifkarten des Wartungsvertrags verlinken auf
`wartungsvertrag-basis` bzw. `-premium`.

**Bekannte Grenze:** Die Vorbelegung wird im Browser aus der Adresszeile
gelesen. Ohne JavaScript kommt sie nicht an — das Formular ist dann vollständig
bedienbar, das Anliegen muss aber von Hand gewählt werden. Die Alternative wäre,
`/kontakt` bei jedem Aufruf serverseitig zu rendern; das ist der teurere Fehler.

**Benötigte Umgebungsvariablen** (vollständig in `.env.example`):
`RESEND_API_KEY`, `INQUIRY_FROM`, optional `INQUIRY_TO`. Ohne sie gehen
Anfragen **nicht** verloren, aber auch nicht raus — die Nutzerin bekommt den
Telefonweg. Vor dem Livegang zwingend setzen.

## Bedienbarkeit

- **Fokusreihenfolge:** 33 bis 40 Stationen je Route, **kein Rückwärtssprung**,
  jede Station mit sichtbarem Fokusring (`/`, `/kontakt`, `/e-scooter`,
  Geräteseite, je 390 px).
- **Filter per Tastatur:** `Enter` auf „Mit ABE" filtert (13 → 11), die Auswahl
  steht in der Adresse, **Zurück stellt die vorige Auswahl wieder her**
  (13 → 11 → 8 → 11 → 13).
- **Reduzierte Bewegung:** auf `/`, `/ueber-uns` und `/e-scooter` läuft keine
  einzige Animation, und kein Element bleibt unsichtbar hängen.
- **Zoom:** Die Pinch-Zoom-Sperre (`maximumScale: 1`) steht seit dem 05.09.2026
  auf Ansage des Betreibers und wurde am 13.09.2026 ausdrücklich bestätigt. Sie
  ist ein bewusster Verstoß gegen WCAG 1.4.4 und **kein Versehen**. Der Inhalt
  ist bis 320 px Satzbreite geprüft, was einer 200-%-Vergrößerung eines
  640-px-Fensters entspricht; die Browservergrößerung am Schreibtisch ist von
  der Sperre nicht betroffen.

## Robustheit

| Fall | Gemessen |
|---|---|
| Alle Bilder blockiert (`/e-scooter`) | kein Überlauf, kein Layoutsprung, kein Bild ohne `alt` |
| Sehr langer Modellname bei 320 px | Karte 272 px, kein Überlauf |
| Unbekannte Geräteadresse | HTTP 404 |
| `COMMERCE_MODE=checkout` ohne Shopify-Zugang | Rückfall auf `catalog`, Protokollzeile, **kein Kaufknopf** |

## Leistung

Mobil (390 × 844, DPR 3, CPU vierfach gedrosselt, 1,6 Mbit/s, Median aus drei
Läufen):

| Route | LCP | CLS | längste Aufgabe | Bildzeit p95 |
|---|---|---|---|---|
| `/` | 1252 ms | 0 | 50 ms | 18 ms |
| `/e-scooter` | 1004 ms | 0 | 75 ms | 18 ms |
| `/reparatur` | 940 ms | 0 | 76 ms | 18 ms |

Vorher (dieselbe Messung mit dem Stand vor dem Bewegungs-Durchgang): 1244 /
988 / 940 ms, längste Aufgabe 55 / 77 / 77 ms. **Das ist kein Fortschritt,
sondern Rauschen** — die Änderungen an den Animationen sind an LCP und CLS
nicht messbar und werden hier auch nicht als Gewinn ausgegeben. Messbar ist,
was tatsächlich weniger geworden ist:

| | 390 px | 1512 px |
|---|---|---|
| Aktive Bildfahrten (`.parallax`) vorher | 1 je Seite | 1 je Seite |
| Aktive Bildfahrten nachher | **0** | 1 (unverändert) |
| Längste Staffelung einer Einblendung vorher | 220 ms | 220 ms |
| Längste Staffelung nachher | **88 ms** | 220 ms (unverändert) |

Keine Lighthouse-Werte in dieser Datei: Lighthouse wurde nicht ausgeführt, und
eine geschätzte Punktzahl wäre eine erfundene Messung.

## Offene Punkte

Echte Restpunkte, keine Codefragen:

1. **Kein Mail-Versand konfiguriert.** Solange `RESEND_API_KEY` und
   `INQUIRY_FROM` fehlen, geht keine Anfrage raus. Vor dem Livegang setzen.
2. **Kein Testframework.** Es gibt keine Unit- oder E2E-Tests im Repository;
   alles in dieser Datei ist ein manuell angestoßener Messlauf.
3. **Drosselung liegt im Arbeitsspeicher.** Auf mehreren Vercel-Instanzen
   zählt jede für sich. Bei Missbrauch auf `@upstash/ratelimit` wechseln.
4. **Shopify ist nicht angebunden.** Die fünf fehlenden Voraussetzungen stehen
   im Kopf von `lib/commerce-shopify.ts`.
5. **`lib/inventory.ts` ist Platzhalter** — Modelle, Preise und Stückzahl sind
   fiktiv (Auskunft des Betreibers vom 20.08.2026).
6. **Die offenen Punkte aus dem Faktenaudit** (§ 34d GewO, WEEE-Nummer,
   Öffnungszeiten, Leih-Scooter, zweite Preisspalte im ERGO-Aushang) stehen
   unverändert in `CLAUDE.md` und brauchen eine Auskunft des Betreibers.
7. **Google-Bewertung vor jedem Deploy abgleichen** — 5,0 aus 37 Rezensionen,
   Stand 18.08.2026. Die Zahl wächst.

## Feinschliff Telefon und Tablet — 16.09.2026

Produktionsbuild auf Port 4312, Playwright. Zwölf Routen × sieben Formaten
(320 × 568, 390 × 844, 430 × 932, 768 × 1024, 1024 × 768, 1440 × 900,
844 × 390 Querformat) = 84 Ansichten.

| Prüfung | Ergebnis |
|---|---|
| Waagerechter Überlauf | 0 auf allen 84 Ansichten |
| Abgeschnittener Text | 0 (vorher 10 Zustandszeilen auf `/e-scooter`) |
| Schrift unter 11 px | nur „SAISON" (8,5 px) auf der Plakette – Grafik, keine Schrift zum Lesen |
| Zielfläche unter 44 px | 0 (Skip-Link und Honeypot sind Messartefakte) |
| Konsolenfehler | 0 |
| Beschriftung jedes Eingabefelds | vorhanden auf `/e-scooter`, `/kontakt`, `/wartungsvertrag`, `/versicherung` |

**Interaktion geprüft**

| Fall | Ergebnis |
|---|---|
| Bestand filtern (Alle → ABE → bis 250 € → ab 30 km) | 13 → 11 → 8 → 6, Adresse `?filter=…`, Live-Region „x von 13 Geräten" |
| Sortierung „teuerste zuerst" | erste Karte `audi-egret-pro`, `?filter=…&sort=preis-ab` |
| Drei Zurück-Schritte | 6 → 8 → 11 Geräte, Seite bleibt `/e-scooter` |
| Tarifwahl Basis ↔ Premium | Karte, Zeile über dem Formular, Auswahlfeld und untere Leiste zeigen denselben Vertrag und Beitrag; Zurück stellt die vorige Wahl her |
| `?zeitraum=0/2/4` auf `/versicherung` | schreibt genau die zugehörige Tabellenzeile ins Nachrichtenfeld |
| Formular leer abschicken | vier Fehler, Zusammenfassung, `aria-invalid` an allen vier Feldern |
| Formular gültig abschicken | ehrlicher Hinweis „Versand nicht eingerichtet" mit Telefon und E-Mail, kein Scheinerfolg |
| Doppelklick auf Absenden | Knopf während des Sendens deaktiviert |
| Fokus in einem Formularfeld | untere Aktionsleiste ausgeblendet (`visibility: hidden`) |
| Galerie, Wisch mit der Maus | ohne Wirkung (Absicht: nur Finger und Stift) |
| Scrollen, CPU 4× gedrosselt | CLS 0, höchstens zwei lange Aufgaben je Route, längste 56 ms |

**Nicht durchführbar**

- Echte Bildschirmtastatur: Im Prüfbrowser lässt sie sich nicht öffnen. Die
  Leiste blendet deshalb schon am Fokus aus, nicht erst am Tastatur-Ereignis.
- Wischgesten mit echter Berührung auf der Galerie: Playwright liefert
  synthetische Zeiger; die Wege wurden in früheren Durchgängen von Hand
  geprüft.
- Zustellung einer echten Anfrage: bewusst nicht ausgelöst, es ist kein
  Versand konfiguriert.

**Offen**

- `RESEND_API_KEY` und `INQUIRY_FROM` fehlen – ohne sie geht keine Anfrage
  raus. Der Zustand wird dem Nutzer ehrlich angezeigt.
- Verfügbarkeit je Gerät: `availability` ist bei allen dreizehn Einträgen
  leer. Plakette und Schema können „reserviert" und „verkauft" darstellen,
  sobald die Daten es hergeben.
- Prüfliste bei 320 px zweizeilig – bei 222 px Satz und 315 px Textbreite
  physikalisch nicht anders lösbar.
