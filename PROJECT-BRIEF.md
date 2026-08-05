# PROJECT BRIEF — SKOPE Gebrauchtwarenhandel (Relaunch)

Autonom abgeleitet aus der Bestandsseite `https://skopegebrauchtwarenhandel.com`
(React/Vite-SPA). Alle Fakten stammen aus der Altseite; nichts erfunden.
Offene Punkte sind als `TODO` markiert.

---

## 1. Faktenbasis (aus der Altseite extrahiert)

**Unternehmen**
- Name: Skopegebrauchtwarenhandel — Marke: **SKOPE**
- Inhaber / verantwortlich: **Thomas Zielke** (Einzelunternehmen, Kleinunternehmer § 19 UStG)
- Betriebsstätte: **Im Kampfrad 3, 74196 Neuenstadt am Kocher**
- Telefon: **+49 178 5097654**
- E-Mail: **skopegebrauchtwarenhandel@gmail.com**
- USt-IdNr. (§ 27a UStG): **DE346591640**
- Keine Umsatzsteuer gemäß § 19 UStG (Kleinunternehmerregelung)

**Leistungen**
1. Verkauf generalüberholter (refurbished) E-Scooter mit **Skope-Qualitätssiegel**, 1 Jahr Gewährleistung
2. Reparatur & Werkstattservice für alle gängigen Marken
   (Xiaomi, Segway-Ninebot, Tier, Lime, Bird, Moover, SoFlow, Trekstor u. a.)
   - Elektronik-Diagnose (Fehlercodes, Controller, Display, Kabelbaum)
   - Akku-Service (Kapazitätsmessung, Zellentausch, BMS)
   - Mechanische Instandsetzung (Bremsen, Lager, Lenker, Reifen, Klappmechanik)
   - Motor-Reparatur (Nabenmotor, Hallsensor, Motorlager, Antriebsstrang)
3. **Sicherheits-Checkup: 59,99 €**
4. **Wartungsverträge**
   - Basis: **130,- € / Jahr** — 1× großer Jahres-Sicherheitscheck, komplette
     Funktionsprüfung (Bremsen, Lager, Elektronik), 10 % Ersatzteil-Rabatt,
     bevorzugte Termine
   - Premium: **17,99 € / Monat** (215,88 €/Jahr, Mindestlaufzeit 12 Monate) —
     Jahres-Sicherheitscheck, Akku-Deep-Check, VIP-Priorität, 20 % Ersatzteil-
     Rabatt, Express-Reparatur (bevorzugt < 24 h); Hol- & Bringservice im
     Umkreis von 15 km
5. **E-Scooter-Versicherung über ERGO** (Partner), deutschlandweit.
   Reale Saisonpreise 2026/2027 aus dem Preisaushang der Altseite:
   | Zeitraum | Haftpflicht (pur) | Teilkasko (+ Diebstahl) |
   |---|---|---|
   | 01.04.2026 – 31.03.2027 | ab 42 € | ab 69 € |
   | 01.05.2026 – 31.05.2026 | ab 35 € / ab 122 € | ab 69 € |
   | 01.07.2026 – 30.09.2026 | ab 57 € / ab 186 € | ab 70 € |
   | 01.10.2026 – 31.12.2026 | ab 57 € / ab 180 € | ab 59 € |
   | 01.01.2027 – 31.01.2027 | ab 75 € / ab 115 € | ab 49 € |
   | 01.02.2027 – 28.02.2027 | ab 36 € / ab 130 € | ab 69 € |
   Kennzeichen-Versand durch ERGO per Post in **5–10 Werktagen**.
   Haftpflicht ist gesetzlich Pflicht (eKFV, § 1 PflVG) ab 6 km/h Höchstgeschwindigkeit.
6. **Kostenlose Verwertung & fachgerechtes Recycling** ausgedienter E-Scooter
   (Motoren, Akkus, Aluminium-Rahmen)

**Reparatur-Preisanker (Altseite):** Bremsbeläge ab 15 €, Reifenwechsel ab 25 €,
Elektronik-Reparaturen ab 40 €. Standard-Reparaturen meist am selben Tag,
Elektronik 1–3 Werktage, Premium-Kunden Express < 24 h.

**Trust-Signale**
- **Über 500 erfolgreich reparierte E-Scooter**
- Skope-Qualitätssiegel (eigenes Prüfsiegel)
- ERGO als Versicherungspartner
- 1 Jahr Gewährleistung auf Gebrauchtware (verkürzt, gesetzeskonform)
- 3 echte Kundenstimmen (übernommen, unverändert)

**Einzugsgebiet (Altseite):** Heilbronn 15 km · Neckarsulm 12 km ·
Bad Friedrichshall 8 km · Bad Rappenau 18 km · Öhringen 20 km · Mosbach 25 km.
Weitere Orte: Degmarn, Stein am Kocher, Cleversulzbach, Möckmühl, Gundelsheim, Weinsberg.

**Schwächen der Altseite**
- Client-side-only SPA → schlechte Crawlbarkeit, kein SSR, leerer HTML-Shell
- Hero ohne Wirkung, generische Card-Raster, Serif-Headlines wirken deplatziert
- Shop nicht funktionsfähig ("Shopify-Store benötigt einen aktiven Zahlungsplan")
- Preise und Argumente über viele Seiten verstreut, kein klarer Conversion-Pfad
- Vertrauensbeweise (500 Reparaturen, Siegel, ERGO) nicht prominent inszeniert
- Schema.org nur als verstreute Microdata, kein verbundener `@graph`

---

## 2. Strategie

**Zielgruppe**
1. **Pendler & Alltagsfahrer** (Heilbronn, Neckarsulm, Bad Friedrichshall) — Scooter
   ist Verkehrsmittel, Ausfall = Problem. Intent: schnelle, verlässliche Reparatur.
2. **Preisbewusste Erstkäufer** — wollen einen Scooter, aber nicht zum Neupreis.
   Einwand: „Gebraucht = Risiko." → Antwort: Qualitätssiegel + 1 Jahr Gewährleistung.
3. **Bestandsfahrer ohne Versicherung** — brauchen jährlich ein gültiges
   Versicherungskennzeichen. Intent: schnell, günstig, rechtssicher.

**Positionierung**
Nicht „Gebrauchtwarenhändler", sondern **die Fachwerkstatt für Elektro-
kleinstfahrzeuge in der Region Heilbronn** — mit angeschlossenem Verkauf
geprüfter Scooter. Premium heißt in dieser Nische: technische Kompetenz sichtbar
machen, Preise offen zeigen, Werkstattatmosphäre statt Hochglanz-Lifestyle.

**Die fünf UX-Antworten**
1. *Was ist das?* — Hero: Fachwerkstatt + Verkauf refurbished E-Scooter, Neuenstadt.
2. *Für wen?* — Region-Strip + Zielgruppen-Sprache („Pendler", „alle gängigen Marken").
3. *Warum besser?* — Leistungs-Sektionen mit konkreten Preisen und Fristen.
4. *Warum vertrauen?* — Zahlenband (500+ Reparaturen), Siegel, ERGO, Kundenstimmen, Inhaber mit Namen und Gesicht.
5. *Was nun?* — Durchgehend: **Anrufen** (dominant) oder **Anfrage senden**.

**Primäres Conversion-Ziel:** Kontaktaufnahme (Anruf oder Formular-Anfrage).
Sekundär: Wartungsvertrag-Anfrage, Versicherungs-Anfrage.

**Seitenarchitektur**
| Route | Zweck |
|---|---|
| `/` | Startseite — Hero, Leistungen, Zahlen, Wartung, Versicherung, Region, Stimmen, FAQ, Kontakt |
| `/e-scooter` | Refurbished-Bestand + Kaufprozess + Qualitätssiegel |
| `/reparatur` | Werkstattleistungen, Preisanker, Ablauf, Marken, Reparatur-Anfrage |
| `/wartungsvertrag` | Basis vs. Premium, Rechenbeispiel, FAQ |
| `/versicherung` | ERGO-Tarife 2026/2027, Pflichten, Ablauf, Anfrage |
| `/recycling` | Kostenlose Verwertung, Kreislaufwirtschaft |
| `/ueber-uns` | Thomas Zielke, Werkstatt, Qualitätsversprechen |
| `/kontakt` | Kontaktdaten, Anfahrt, Formular |
| `/impressum`, `/datenschutz`, `/agb` | Rechtliches (Inhalte 1:1 übernommen) |

---

## 3. Designsystem (autonom entschieden)

**Herleitung:** Das bestehende SKOPE-Siegel trägt Petrolblau + Orange. Diese
Markenidentität bleibt erhalten und wird präzisiert — kein Identitätsbruch.

- **Basis:** tiefes, blaustichiges Anthrazit (`--ink`) als dominanter Grund —
  Werkstatt, Technik, Wertigkeit. Warmes Off-White (`--paper`) als Gegenpol.
- **Marke:** Petrol `#1E5D82` (Vertrauen, Technik) — Flächen, Linien, Tiefe.
- **Akzent:** Orange `#F0842B` — genau eine Akzentfarbe, ausschließlich für
  CTAs, aktive Zustände und Schlüsselzahlen. Nie dekorativ.
- **Typografie (2 Familien):**
  - Display: **Archivo** — industriell, breit, selbstbewusst; enges Tracking,
    fluide Größen via `clamp()`.
  - Text: **Instrument Sans** — ruhig, gut lesbar, moderne Anmutung.
  Bewusst kein Serif (die Altseite nutzte Serif — für eine technische Werkstatt
  dissonant) und bewusst kein Inter/Geist-Default.
- **Radius:** klein und konsequent (2–14 px) — technisch, nicht verspielt.
- **Schatten:** keine dekorativen Schatten. Tiefe entsteht durch Flächen-
  kontrast, 1px-Hairlines und Layering.
- **Raster:** asymmetrische Splits (7/5, 8/4), versetzte Container,
  großzügiger Weißraum, Wechsel aus ruhigen und dichten Zonen.
- **Motion:** eigene, abhängigkeitsfreie Reveal-Komponente auf Basis von
  `IntersectionObserver` + CSS-Transitions (220–420 ms, `cubic-bezier(.22,1,.36,1)`),
  `prefers-reduced-motion` respektiert. Keine Motion-Library — kleinere Bundles,
  stabiler auf Mobile.

---

## 4. Annahmen

- **Öffnungszeiten** sind auf der Altseite nirgends angegeben → als
  „Termine nach Vereinbarung" formuliert und als `TODO` markiert.
- **Bestand an refurbished Scootern** ist unbekannt (der alte Shopify-Shop war
  inaktiv). Statt erfundener Produkte: Bestandsseite mit Kaufprozess,
  Qualitätsversprechen und Anfrage-CTA; Platzhalter-Karten klar als `TODO`.
- **Formularversand:** Die Altseite nutzte Supabase; Zugangsdaten liegen nicht
  vor. Die Formulare laufen über eine Server Action mit austauschbarem
  Versand-Adapter (`lib/notify.ts`) — Mail-Provider muss der Betreiber setzen (`TODO`).
- Kein Google-Rating/Anzahl Bewertungen belegbar → **kein** `AggregateRating`
  im Schema (Verstoß gegen Google-Richtlinien wäre die Alternative).

---

## 5. Ergebnis des Experten-Audits

Nach der Fertigstellung haben vier Gutachter parallel geprüft (Design/Typografie,
UX & Accessibility, Technical SEO/GEO/Schema, Code & Performance). Umgesetzt:

**Kritisch**
- `.reveal` setzte `opacity: 0` und nahm es nur per JavaScript zurück — ohne JS
  war die gesamte Seite leer. Jetzt über `@media (scripting: none)` plus
  `<noscript>`-Style abgesichert.
- Above-the-fold-Inhalte (Hero, Seitenköpfe) rendern mit `immediate` sichtbar im
  Server-Markup. Vorher wurde das LCP-Bild transparent gemalt und der
  `priority`-Preload verpuffte.
- Der Schema-Graph war auf zwei `<script>`-Blöcke gesplittet (Layout + Seite).
  Google führt die zusammen, Bing, validator.schema.org und generische
  RDF-Parser nicht — dort zeigten `provider`, `brand` und `worksFor` ins Leere.
  Jetzt rendert jede Seite genau einen Graph über `pageGraph()`.
- `topic` aus dem Formular landete ungeprüft im Mail-Betreff (Header-Injection).
  Jetzt Whitelist in `lib/data/topics.ts` plus Zeilenumbruch-Filter.
- Kein Rate-Limiting auf der öffentlichen Server Action. Jetzt 3 Anfragen pro
  IP und 10 Minuten.
- Klarname des Anfragenden landete im Serverlog (Art. 5 Abs. 1 lit. c DSGVO).

**Hoch**
- Orange war zur Standardfarbe für Auszeichnungszeilen geworden (18 Vorkommen)
  und der CTA hatte keine Signalwirkung mehr. Jetzt nur noch: Buttons, aktiver
  Navigationszustand, ein Hero-Keyword, eine Schlüsselzahl pro Seite.
- Kontraste: `text-paper/35–45` und `text-ink/45–55` lagen zwischen 2,99:1 und
  4,27:1. Untergrenze projektweit auf `/60` bzw. `/65` gezogen; Feld- und
  Buttonränder von 1,81:1 auf ≈3,3:1.
- Formular: Fehlerzusammenfassung mit `role="alert"`, Fokussteuerung nach
  Absenden, sichtbare Pflichtfeldmarkierung, Hilfetext statt Placeholder.
- Mobile-Menü: blieb offen und sperrte den Scroll, wenn man den Link der
  aktuellen Seite antippte. Dazu Escape-Handler und Fokusrückgabe.
- Unter 640 px enthielt der Header nur den Burger — der Anruf, die dominante
  Aktion, war nicht erreichbar.
- `?anliegen=` aus den Tarif-CTAs wurde nirgends ausgewertet.
- Typo-Skala: H1 und H2 waren identisch groß, Kennzahlen konkurrierten mit
  Sektions-Headlines. Vier klar getrennte Stufen, neue `--text-page-title`.
- Titel (6 von 11 über 85 Zeichen) und Descriptions (7 von 11 über 160) gekürzt;
  Open Graph pro Route statt überall Startseite.
- Startseite definierte `@id`s doppelt und widersprüchlich; FAQ-Inhalte waren
  seitenübergreifend dupliziert (Google-Richtlinienverstoß).
- `Product` ohne `offers` war schema-ungültig → jetzt `Service`.
- Versicherungs-`areaServed` sagte „6 Orte", die Seite sagt „deutschlandweit".

**Mittel**
- `reduce` ohne Startwert hätte den Build gerissen, sobald die Tarifliste leer
  ist; Preis-Parsing war bei Kommastellen falsch.
- Honeypot-Treffer erzeugte eine halbe Erfolgsmeldung; Feldname `website` war
  ein Autofill-Magnet.
- `will-change` dauerhaft auf ~40 Elementen pro Seite.
- Kein Timeout beim Mail-Versand; Fehlerbody wurde verworfen.
- `next-themes`, `tw-animate-css`, `@base-ui/react`, `shadcn` entfernt
  (0 Importe). Telefon-Button war 6× handkopiert → `PhoneButton`.
- Überschriften-Hierarchie: Sidebar-Boxen und Navigationslabels waren `h2`.
- Vier Seiten nutzten dasselbe nummerierte Raster; `/versicherung` ist jetzt
  eine vertikale Timeline.

**Bewusst nicht umgesetzt**
- Duotone-Einfärbung der Bilder zur Vereinheitlichung: Die generierten Bilder
  sind ohnehin Platzhalter (siehe TODO 4). Ein Farbfilter würde das kaschieren,
  statt das Problem zu lösen — echte Werkstattfotos sind der richtige Fix.

---

## 6. Offene TODOs für den Betreiber

1. `TODO` Öffnungszeiten festlegen → `lib/site.ts` → `openingHours`.
   Ohne verbindliche Zeiten fehlt im Google Local Pack ein Hauptranking-Faktor.
2. `TODO` Aktuellen Scooter-Bestand pflegen → `lib/inventory.ts`
   (leer = die Seite zeigt automatisch den Anfrage-Weg)
3. `TODO` Mail-Versand konfigurieren → `RESEND_API_KEY`, `INQUIRY_FROM`,
   optional `INQUIRY_TO`. Ohne Keys zeigt das Formular ehrlich Telefon und
   E-Mail statt einer Erfolgsmeldung für eine Mail, die nie ankommt.
4. `TODO` Echte Werkstatt- und Inhaberfotos ersetzen die generierten Bilder in
   `public/img/`. `werkstatt-service.jpg` liegt zudem nur bei 800×1000 und ist
   für die Ausspielung mit `100vw` auf Mobile zu knapp.
5. `TODO` Google-Business-Profil verknüpfen → `site.sameAs`
6. `TODO` ERGO-Tarife jährlich aktualisieren → `lib/data/insurance.ts`
7. `TODO` Domain final festlegen (`.com` vs `.de`) → `lib/site.ts` → `url`.
   Daran hängen Canonicals, alle `@id`s, Sitemap und robots.txt. `www` vs.
   non-`www` und `http` serverseitig per 301 zusammenführen.
8. `TODO` Rechtstexte (Datenschutz, AGB) vor dem Livegang fachkundig prüfen
   lassen — insbesondere die konkret eingesetzten Dienste namentlich benennen.
9. `TODO` Bei Deployment auf mehrere Instanzen das Rate-Limiting in
   `app/actions.ts` auf einen geteilten Speicher umstellen (`@upstash/ratelimit`).
