# SKOPE — Projektgedächtnis

Kurzfassung für den Start einer Sitzung. Ziel dieser Datei: nicht noch einmal
herausfinden müssen, was hier schon entschieden und gemessen wurde.

## Was das ist

Website von SKOPE, Im Kampfrad 3, 74196 Neuenstadt am Kocher. Inhaber Thomas
Zielke, Kleinunternehmer nach § 19 UStG.

**Das Hauptgeschäft ist der Verkauf generalüberholter E-Scooter.** Reparatur,
Wartungsverträge, Versicherungsvermittlung (ERGO) und die kostenlose
Altgerät-Rücknahme sind Nebenleistungen; sie tragen den Betrieb nicht, sondern
begründen ihn: Die eigene Werkstatt ist der Grund, warum man dort ein
gebrauchtes Gerät kauft statt über ein Kleinanzeigenportal.

Das war bis zum **20.08.2026 andersherum aufgebaut** — Auskunft des Betreibers,
nicht Vermutung. Was daraufhin gedreht wurde, steht unter „Rangfolge der
Leistungen". Wer hier Texte ändert, prüft vorher, ob die Änderung diese
Rangfolge wieder aufweicht.

Next.js 16 (App Router), React 19, TypeScript, Tailwind v4. Keine
Animationsbibliothek, kein UI-Framework über shadcn hinaus.

## Rangfolge der Leistungen

Umgestellt am 20.08.2026. Die Seite verkaufte bis dahin eine Reparaturwerkstatt,
die nebenbei Geräte hat. Gedreht wurde nicht der Tonfall, sondern die Struktur:

- **Die Startseite zeigt jetzt Geräte.** Vorher stand hinter dem Kopfbereich der
  Ablauf einer Reparatur — und auf der ganzen Startseite kein einziger Scooter.
  `components/sections/inventory-teaser.tsx` steht jetzt auf diesem Platz, mit
  drei Karten aus `inventoryHighlights()`, Anzahl, Preisspanne und
  Gewährleistung.
- **`components/sections/process.tsx` ist gelöscht,** nicht verschoben. Die vier
  Schritte standen dort wortgleich noch einmal, obwohl `/reparatur` sie führt.
- **H1 der Startseite:** „E-Scooter reparieren statt neu kaufen" →
  „Geprüfte E-Scooter gebraucht kaufen". Die zweite Aktion im Kopfbereich führt
  in den Bestand statt in die Reparaturannahme, die Verfügbarkeitszeile nennt
  die Geräte statt der Bearbeitungszeit.
- **Kennzahlen im Kopfbereich:** Bestand, Einstiegspreis und Gewährleistung
  zuerst; die 500 reparierten Scooter stehen hinten und haben dort eine andere
  Aufgabe — sie sind der Beleg für die Aufbereitung, nicht das Angebot.
  Anzahl und Einstiegspreis kommen aus `inventoryFacts()`, nicht aus dem Text.
- **Schema:** `Store` ist als Typ dazugekommen (vorher nur LocalBusiness,
  AutoRepair, Organization — für einen Betrieb, dessen Hauptgeschäft der Verkauf
  ist, fehlte genau der Typ). `description` und `knowsAbout` führen den Verkauf
  voran, das Organisationsbild zeigt ein Gerät statt einer Reparaturszene.
- **`site.tagline`** ist „Geprüfte E-Scooter & Fachwerkstatt", nicht mehr
  umgekehrt. Der Wert steht im WebSite-Knoten und in jedem Seitennamen ohne
  eigenen Titel.
- **Titel:** Startseite „Geprüfte E-Scooter kaufen in Neuenstadt", Bestandsseite
  „E-Scooter gebraucht kaufen in Heilbronn". Bewusst nicht wortgleich — zwei
  Seiten auf dieselbe Wortfolge lässt Google eine davon aussortieren.
- **`faqHome`** führt drei Kauffragen vor der Reparaturfrage.

**Offen:** Der Betreiber nennt „Ersatzteile" als zweites Standbein neben der
Reparatur. Auf der Seite kommen Ersatzteile bisher nur als Rabatt im
Wartungsvertrag und als wiederverwendete Teile aus dem Recycling vor. Ob
Ersatzteile auch einzeln verkauft werden — an wen, welche, zu welchen Preisen —
ist nicht belegt und deshalb nirgends behauptet. Vor dem Ausbau erfragen.

## Bevor etwas als fertig gemeldet wird

In dieser Reihenfolge, ohne Ausnahme:

```
npx tsc --noEmit && npx eslint . && npm run build
```

Danach Aufnahmen bei **1512 und 390 px** mit Playwright, dazu Konsolenfehler
und horizontaler Überlauf (`documentElement.scrollWidth - clientWidth`).

**Der Dev-Server läuft auf Port 4311**, nicht 3000. Ein zweiter lässt sich
nicht starten. Neue Server abgekoppelt starten: `nohup … & disown`.

Layoutfragen werden **im Browser gemessen**, nicht geschätzt:
`getBoundingClientRect`, `getComputedStyle`, `currentSrc`. Bei Kontrastfragen
über dem bewegten Grund immer **mehrere Frames** abtasten und die Kopfzeile
vorher ausblenden — sonst misst man die Buchstaben statt den Untergrund.

## Fallen, die hier schon zugeschnappt sind

- **Backticks in GLSL-Kommentaren** in `velaris.tsx` beenden das
  Template-Literal. Der Build bricht mit „Expected a semicolon" an einer
  Stelle, die nichts damit zu tun hat. Auch `prettier-ignore` an beiden
  Shader-Programmen muss stehen bleiben.
- **JSX-Kommentare zwischen Attributen** sind ein Syntaxfehler. Kommentare
  über das Element.
- **Globales Suchen-und-Ersetzen in Inhaltsdateien** hat schon aus einer
  Preisspanne zwei Festpreise gemacht. Jeden Treffer einzeln ansehen.
- **`bg-accent` kippt auf hellen Flächen auf Tinte.** Das Token ist für
  Schrift gedacht. Wer Neon als *Fläche* auf Silber will, nimmt
  `bg-neon text-ink` (siehe Farbregel oben in `globals.css`).
- **Inline-Elemente in Displaygröße** erben den Zeilenabstand des Fließtextes
  und reißen mehrzeilige Adressen auseinander. `block leading-tight` setzen.
- **Ein JSX-Kommentar direkt hinter `return (`** ist kein Kommentar, sondern ein
  zweites Wurzelelement. Erklärungen vor dem `return` als `/* … */` setzen.
- **`.press` liegt im `components`-Layer, Tailwind-Utilities im `utilities`-Layer
  darüber.** Cascade Layers gewinnen *vor* Spezifität: Wer auf demselben Element
  eine Transform-Utility im `active`-Zustand hat (`active:translate-y-0`),
  überschreibt den Druckpunkt komplett. Entweder die Utility entfernen oder den
  Druckpunkt über Tailwinds eigenes `active:scale-*` setzen, das sich mit
  anderen Transforms verrechnet statt sie zu ersetzen. Dasselbe gilt für die
  Übergangsdauer: Eine `transition-*`-Utility muss `transform` mitführen, sonst
  springt der Druckpunkt statt zu laufen.

## Telefon, Tablet, Querformat

Durchgang vom 17.08.2026, gemessen über zwölf Routen × neun Breiten
(320 – 1512 px) plus Querformat 844 × 390. Danach: kein waagerechter Überlauf,
keine Konsolenfehler, keine Schrift unter 11 px, keine Schaltfläche unter 44 px
außer den Verweisen *im* Fließtext (dort greift die Ausnahme aus WCAG 2.5.8).

Was dabei entschieden wurde und nicht wieder aufgeweicht werden darf:

- **`viewport-fit=cover` und `.gutter` gehören zusammen.** Die Fläche läuft bis
  an die Gehäusekante, damit im Querformat keine grauen Balken neben der
  schwarzen Seite stehen. Dafür muss *jeder* Rand über `.gutter` laufen
  (`max(Wert, env(safe-area-inset-*))`) — sonst liegt Text unter der
  Kameraaussparung. `Container` und die untere Aktionsleiste tun das.
- **`themeColor` ist `#08090b`.** Er stand auf `#f4f2ed` aus einer hellen
  Fassung und hat Safari die Bedienleisten beige eingefärbt.
- **Hover-Regeln in `globals.css` stehen hinter `(hover: hover)`.** Ohne die
  Abfrage bleibt auf dem Telefon der Zustand des letzten Tipps stehen.
  Tailwinds `hover:` bringt die Abfrage seit v4 selbst mit, handgeschriebene
  Regeln nicht.
- **Die Scrollsperre des Menüs läuft über `position: fixed` am `<body>`**, nicht
  über `overflow: hidden` — und setzt die Position beim Schließen mit
  `behavior: "instant"` zurück. Gemessen: 1800 px vorher, 1800 px nachher.
- **Kopfabstände von Hero und Unterseitenkopf hängen an `vh`**, nicht an fixen
  Werten. Im Querformat waren 128 px oben plus 80 px unten 53 % der Bildhöhe.
- **Die Tarif-Tabelle hat keine Mindestbreite mehr.** Sie passt bei 320 px in
  272 px, weil die Kopfzellen trennen dürfen (`[hyphens:auto]`, „HAFT-PFLICHT").
  Wer die Sperrung dort erhöht, bricht das.
- **Kleinstgrade sind weg.** Die Firmenzeile im Fußbereich stand auf 8 px, vier
  Etikettenreihen auf 11 px. Untergrenze ist jetzt 11 px, und die gilt nur für
  die eine Zeile unter der Marke.

## Zweiter Telefondurchgang — 21.08.2026

Gemessen mit Playwright über zwölf Routen × zehn Breiten (320 – 1024 px) plus
Querformat, dazu Leistungswerte bei vierfach gedrosselter CPU und 1,6 Mbit/s.
Ergebnis nach dem Durchgang: kein waagerechter Überlauf, keine Konsolenfehler,
LCP 0,76 – 0,79 s, CLS 0, längste Aufgabe 76 ms.

Der Durchgang vom 17.08. hatte Überlauf, Zielflächen und Kleinstgrade
abgeräumt — die Beschwerde danach betraf nicht Fehler, sondern **Proportionen**.
Die waren an drei Stellen tatsächlich falsch:

- **Die Schriftgrade standen auf dem Kopf.** Bei 390 px war die H1 der
  Startseite 28 px, jede Abschnittsüberschrift 34 px und jeder
  Unterseitentitel 42 px. Ursache: Der Boden von `--text-hero` (1,75 rem) war
  auf die **alte** H1 „E-Scooter reparieren statt neu kaufen" gerechnet, die
  am 20.08. ersetzt wurde. Jetzt Hero und Unterseitentitel auf 2,125 rem,
  Displaygrad auf 1,75 rem — Rangfolge 34 / 28 / 24 / 17 px. Ab 565 px
  übernimmt wieder der alte Anstieg, am Desktop ändert sich nichts. Die
  Rechnung steht am Token in `globals.css`.
- **Das Kennzahlenband war auf dem Telefon 380 px hoch** — eine halbe Bildhöhe
  für drei Angaben. Auf Telefon und Tablet stehen sie jetzt als Zeilen mit
  zwei Enden (210 px), erst ab `lg` als drei Spalten. Der Umschaltpunkt ist
  `lg` und nicht `sm`, weil bei 768 px drei Spalten je 181 px Satz haben und
  „ab 169,99 €" im Statgrad rund 190 px braucht.
- **Auf dem iPad füllte die Galerie den ersten Bildschirm allein.** Ohne
  Deckel war sie bei 768 px 688 px breit und 917 px hoch; Modell und Preis
  begannen darunter. Deckel jetzt `max(20rem, min(26rem, 38vh))` ab `sm`, am
  Telefon unverändert volle Spalte, ab `lg` das Raster.

Kleiner, aber aus demselben Grund geändert:

- **Vorschaubilder der Galerie:** feste vier Spalten hießen bei sechs
  Aufnahmen vier oben, zwei unten. Jetzt `min(Anzahl, 6)`, unter 360 px drei —
  sechs Felder wären dort 39 px breit und damit unter der 44-px-Grenze.
- **Bearbeitungszeiten** (`workshop.tsx`) standen als Zeile mit zwei Enden;
  bei 390 px stieß der Wert rechts an den Satzspiegel und eine der drei
  Zeilen brach als einzige um. Auf dem Telefon jetzt gestapelt.
- **Die Zusage im Kopfbereich** ist zweizeilig, sobald das Fenster schmal
  ist. Ein Stadionradius um zwei Zeilen liest sich als Fehler — unter `sm`
  deshalb Kachelradius.
- **Die Kacheln der Premium-Leistungen** trugen `rounded-xl`; in dieser
  Radienstaffel sind das 36 px und damit fast eine Pille um eine 78 px hohe
  Kachel. Jetzt `rounded-md`.
- **Die E-Mail im Fußbereich** brach mit `break-all` als „…gmail.c / om".
  Jetzt `<wbr>` hinter dem Klammeraffen und `break-words` als Rückfall.
- **Das Einzugsgebiet im Fußbereich** stand bei 390 px in zwei Spalten zu je
  160 px; „Bad Friedrichshall" brach um, die Entfernung stand allein.
  Einspaltig bis `sm`.
- **`sizes` der Geräteaufnahme** stand auf 400 px und war seit der
  Verbreiterung der Bildspalte zu klein — auf dem Schreibtisch wurde ein
  400-px-Bild auf 608 px gezogen.

**Bewusst nicht geändert:** Die Schrift „SAISON" auf der Plakette misst 8,5 px.
Sie ist Teil einer Zeichnung (`role="img"` mit Beschriftung), kein Bedienelement
und kein Text zum Lesen — die 11-px-Grenze gilt für Text, nicht für Grafik.

**Werkzeug:** Playwright liegt nicht im Projekt, sondern im Sitzungsordner
(`npm --prefix <scratchpad>/qa --cache <scratchpad>/.npmcache i playwright`,
Browser über `PLAYWRIGHT_BROWSERS_PATH`). Der npm-Cache des Nutzers ist für
diese Sitzung nicht beschreibbar; ohne eigenen Cache-Pfad bricht die
Installation mit EACCES ab. Gemessen wird gegen `next start` (Port 4312),
nicht gegen den Entwicklungsserver.

## Datumssignal und Alt-Texte

Aus einem AEO-Bericht vom 18.08.2026 (92/100, zwei Lücken):

- **Jede Seite trägt jetzt einen eigenen `WebPage`-Knoten** mit `dateModified`.
  Der Graph beschrieb vorher Betrieb, Person, Website und Leistungen — nur nicht
  das Dokument, auf dem er steht, und damit gab es nirgends ein Datum. Adresse
  und Name zieht `pageGraph()` aus dem Breadcrumb, den die Seiten ohnehin
  mitgeben; deshalb musste kein einziger der zwölf Aufrufe geändert werden.
  Der Wert ist die Bauzeit, einmal je Build ausgewertet.
- **Die Sitemap trägt `lastmod`, aber nur für `site.url`.** Wer die Seite unter
  einer Vorschau-Adresse prüft (`*.vercel.app`), findet dort keinen passenden
  Eintrag — genau das war der Befund „no date signals". Das Datum am Dokument
  ist hostunabhängig und deshalb der stabilere Weg.
- **Alt-Texte der Startseite:** vier von sieben Bildern hatten `alt=""`. Die drei
  Kachelbilder sind der Inhalt der Kacheln, nicht ihr Schmuck, und haben jetzt
  Beschreibungen. Die Aufnahme im Kopfbereich wird an der Fläche beschrieben,
  die auf jeder Breite da ist — die Tafel darunter ist `lg:hidden` und trug die
  einzige Beschreibung, auf dem Schreibtisch war das Motiv also unbeschrieben.
  Offen bleiben die positionsbeschreibenden Alt-Texte der importierten Geräte
  (siehe unten).

## Designsystem

Die vollständige Begründung steht als Kommentar oben in `app/globals.css` —
zwei Flächen (Tinte `#08090b`, Silber `#eef1f4`), **ein** Grünton `#9ef605`.
Neon markiert genau drei Dinge: die Hauptaktion, die harte Zahl und **ein**
Wort je Überschrift. Auf Silber ist Neon Fläche, nie Schrift (1,18:1).

Fluid Type über `clamp(MIN, vw + rem, MAX)`, nie reines `vw`. Die Grade liegen
als Tokens in `@theme`.

## Eigenbauten, die man kennen muss

| Datei | Was |
|---|---|
| `components/motion/velaris.tsx` | Bewegter Hintergrund, rohes WebGL. Zwei Rauschoktaven (nicht vier — vier sehen aus wie Rauch), zwei wandernde Lichter mit eigener Zeit. Fällt bei jedem Fehler auf `.velaris-still` zurück und blendet die Fläche aus. DPR-Deckel 1,5, Pause beim Ausscrollen, `prefers-reduced-motion` = ein Standbild. |
| `components/motion/reveal.tsx` | Ein einziger IntersectionObserver für die ganze Seite. |
| `components/ui/section.tsx` | `Section`, `Container`, `SectionHead`. Der Lead steht **unter** der Überschrift, nicht in einer Spalte rechts. |
| `components/ui/gallery.tsx` | Bildergalerie der Bestandsgeräte. Alle Bilder gleichzeitig im DOM, quadratischer Ausschnitt. Drei Wege zum nächsten Bild, einer pro Eingabeart: Wischen (Pointer-Events, 44 px Schwelle, `touch-action: pan-y`), Pfeiltasten, Knöpfe auf dem Bild. Vorschaureihe vier Spalten unter `sm`, sechs darüber. |
| `components/ui/inventory-card.tsx` | Bestandskarte. Geschlossen nur Bild, Modell, Preis, zwei Kennwerte — plus die ABE-Warnung, die nie eingeklappt wird. |
| `components/ui/expand-map.tsx` | Lagekarte als eingefärbtes PNG aus OpenStreetMap-Kacheln. Kein Embed: kein Drittanbieter-Request, keine Einwilligung nötig. Namensnennung ist Lizenzpflicht. |
| `components/ui/faq.tsx` | `FaqSection` trägt Kopf **und** Liste: fünf Spalten Überschrift, sieben Spalten Fragen. Alle fünf FAQ-Blöcke der Seite laufen darüber – gestapelt blieb die rechte Hälfte leer und das Pluszeichen stand 500 px hinter der Frage. |
| `components/brand/seal.tsx` | Qualitätssiegel als Rasterbild (`public/img/siegel-skope.png`, kreisrund freigestellt, 1000 px). Der frühere SVG-Nachbau ist ersetzt; die Metallanmutung ist hier die Aussage. |
| `app/globals.css` → `.press` / `.gutter` / `.scroll-x` | Die drei Klassen der Telefonbedienung: Druckpunkt samt `touch-action: manipulation` (Faktor über `--press-scale`), Seitenrand mit Aussparungsschutz, waagerechte Rollfläche mit `overscroll-behavior-x: contain`. Begründungen stehen an den Klassen. |
| `lib/schema.tsx` | Ein `@graph` mit `@id`-Verweisen. `inventoryProducts()` erzeugt Product + Offer je Gerät. |
| `components/forms/inquiry-form.tsx` | Ein Formular für die ganze Seite. Alle vierzehn Anliegen aus `lib/data/topics.ts`, in `<optgroup>` gruppiert; die Seite gibt nur `defaultTopic` mit. Die früheren Teilmengen je Leistungsseite sind weg – wer unter der Reparaturseite ein Altgerät abgeben wollte, fand das Anliegen dort nicht. Auf `/kontakt` bleibt das Feld leer und ist Pflicht. Ein neues Anliegen ohne Gruppe bricht den Typecheck (`allTopicsGrouped`). |

## Offene Punkte für den Betreiber

**Vor dem Livegang abzuarbeiten — Stand 14.08.2026.** Die drei Punkte mit
Rechtsbezug (KI-Bilder, Google-Bewertung, zweite Preisspalte) sind bewusst
zurückgestellt und werden vor der Schaltung erledigt, nicht danach.

- **KI-Kennzeichnung: später, aber vor dem Livegang.** Entscheidung vom
  14.08.2026. Der Weg ist festgelegt: entweder echte Fotos aus Im Kampfrad 3,
  oder die erzeugten Bilder werden zu Symbolbildern — `image` in
  `lib/schema.tsx` und das Standard-og:image in `lib/seo.ts` auf das Logo
  oder eine echte Aufnahme umstellen, sichtbarer Bildhinweis, IPTC-Kennzeichen
  in den Dateien, Logo aus den Motiven raus. Ein Hinweis in AGB oder
  Datenschutz erfüllt weder Art. 50 EU-KI-VO (Hinweis dort, wo der Inhalt
  wahrgenommen wird) noch § 5 UWG (die Bilder behaupten den eigenen Betrieb).
- **`lib/inventory.ts` ist Platzhalter, keine Ware.** Auskunft des Betreibers
  vom 20.08.2026: Modelle, Preise und Stückzahl sind fiktiv. Der echte
  Bestand kommt später über Shopify — der alte Shop hängt bereits an einer
  Storefront-API (`qcdf0s-b5.myshopify.com`). Bis dahin ist jeder Abgleich
  gegen den Altbestand sinnlos, und nichts aus dieser Datei darf als
  Tatsache in Text, Meta oder Schema wandern, was nicht ohnehin aus
  `inventoryFacts()` kommt. Ausnahme: `app/page.tsx` trägt die
  Einstiegspreis-Angabe hart in der Meta-Description — beim Anschluss der
  API mitziehen.
- **Zwei Geräte ohne deutsche Betriebserlaubnis** (Ninebot F2 E, Xiaomi 5
  Max). Steht in `streetLegal`, in den Daten, im Hinweis und als Warnung auf
  der Karte. Das ist Absicht und darf nicht zusammengestrichen werden.
- **`lib/site.ts` → `geo`** — steht seit dem 18.08.2026 auf dem Punkt aus dem
  Google-Unternehmensprofil (49,2373006 / 9,3436176), rund 35 m neben der
  vorherigen Straßengeokodierung. `public/img/karte-neuenstadt.png` bleibt
  gültig; auf dem Ausschnitt sind 35 m nicht sichtbar.
- **Zweite Preisspalte im ERGO-Aushang** — der Werkstattaushang führt in fünf
  Zeilen einen zweiten Haftpflichtwert (ab 122, 186, 180, 115, 130 €). Wofür
  er gilt, ist ungeklärt; er steht deshalb nicht auf der Seite. Steht als TODO
  in `lib/data/insurance.ts`.
- **Google-Bewertung — abgeglichen am 18.08.2026.** Im Profil stehen 5,0 aus
  **37** Rezensionen; hier stand 3, weil die Zahl aus der Länge unserer
  eigenen Zitatliste kam statt aus dem Profil. `googleRating` in
  `lib/site.ts` trägt jetzt beide Werte, `site.googleProfile` die Profil-URL
  (auch in `sameAs`), und die Kundenstimmen-Sektion verweist sichtbar darauf.
  Kein `AggregateRating` im Schema: Eine Bewertung über die eigene
  Organisation wertet Google als self-serving. Vor jedem Deploy abgleichen —
  die Zahl wächst.
- **Öffnungszeiten** — das Google-Profil führt inzwischen echte Zeiten
  („Öffnet Mi um 10:00"). `lib/site.ts` sagt weiterhin „nach Vereinbarung".
  Die vollständige Woche aus dem Profil übernehmen, dann kann auch
  `openingHours` ins Schema.
- **Alt-Texte** der zwölf importierten Geräte sind positionsbeschreibend
  („Aufnahme 3 von 6"). Nur beim Zamelux Green E9 sind sie geschrieben, nachdem
  jemand die Fotos angesehen hat.
- **Die vier Stimmungsbilder sind erzeugt, nicht fotografiert.**
  `werkstatt-service`, `akku-diagnose`, `scooter-studio` und `ergo-tarife`
  stammen aus Nano Banana Pro (14.08.2026), mit dem echten Logo als Vorlage;
  das Schild an der Wand und der Aufnäher tragen deshalb die Marke korrekt.
  Sie zeigen eine Werkstatt, die so nicht existiert, und Personen, die es
  nicht gibt. Vor dem Livegang entweder durch echte Aufnahmen aus Im
  Kampfrad 3 ersetzen oder als erzeugt kennzeichnen (EU-KI-VO Art. 50,
  § 5 UWG). Echte Fotos sind hier ohnehin das stärkere Vertrauenssignal.

## Faktenaudit vom 20.08.2026 — vor dem Livegang abarbeiten

Vier Gutachter haben Zahlen, Preise, Fristen und Rechtsangaben gegen die alte
Live-Seite geprüft. Die alte Seite ist eine React-SPA; die Inhalte stecken im
Bundle `assets/index-CQw8GHEI.js`, der Shop hängt an der Shopify-Storefront-API.
Alles zum Gerätebestand ist mit der Platzhalter-Auskunft (siehe oben) erledigt.
Was bleibt, hängt an Leistungs- und Rechtsaussagen:

**Belegt falsch — korrigierbar ohne Rückfrage:**

- **Teilkasko „ab 49 €" ist ein Monatspreis.** Der Aushang führt 49 € für
  01.01.–31.01.2027. Für ein volles Jahr gilt **69 €**. Steht dreifach als
  Jahresbeitrag: `lib/data/faq.ts`, Meta-Description und als `minPrice 49.00`
  mit `unitText: "ANN"` im Schema von `app/versicherung/page.tsx`. Der
  Kommentar in `lib/data/insurance.ts` warnt selbst genau davor.
- **Express ist „bevorzugt innerhalb 24 h", keine Frist.** `plans.ts` und
  `services.ts` führen die Einschränkung mit, `app/wartungsvertrag/page.tsx`,
  `app/reparatur/page.tsx` und eine FAQ-Antwort streichen sie.
- **„meistergeprüft"** (Ninebot F2 Pro in `lib/inventory.ts`) ist nirgends
  belegt; die Altseite sagt durchgängig „zertifizierte Fachkraft". Ein
  Meistertitel ist nach § 5 UWG überprüfbar.
- **Die Marke „Audi Egret" gibt es nicht.** `BRAND_PATTERNS` in
  `lib/inventory.ts` erzeugt sie aus „Audi Electric Kick Scooter powered by
  Egret Pro". Richtig ist Egret (Walberg), Lizenzkooperation mit Audi.
- **`unitText` trägt UN/CEFACT-Codes** („ANN", gemischt mit „JAHR"/„MON").
  Codes gehören in `unitCode`, `unitText` ist das lesbare Feld.

**Braucht eine Auskunft des Betreibers:**

- **Versicherungskennzeichen „sofort in der Werkstatt"** (`insurance.ts`)
  widerspricht der Altseite direkt: dort ausdrücklich „Abholung vor Ort ist
  leider nicht möglich … direkt von ERGO per Post". Die Repo-Aussage stammt
  aus dem Werkstattaushang vom 14.08.2026. Gegenzeichnen lassen.
- **Leih-Scooter fehlt komplett.** Alt: „Dauert die Reparatur länger als 48
  Stunden, erhalten Sie kostenlos einen Leih-Scooter", Bestandteil des
  Premium-Vertrags. Die einzige ersatzlos verlorene Leistung. Gibt es sie
  noch, gehört sie in `lib/data/plans.ts`.
- **Radius 25 statt 30 km.** Alt zweimal „bis 30 km", im alten Schema
  `geoRadius: "30000"`. Neu abgeleitet aus der Ortsliste (Mosbach, 25 km).
- **Rücknahme „auch für Geräte, die nicht bei uns gekauft wurden"**
  (`app/recycling/page.tsx`) ist auf der Altseite nicht belegt.
- **Checkup: „Profil kontrollieren" und „mit Protokoll"** gehen über die
  belegten vier bzw. sechs Punkte hinaus; „Protokoll" steht alt nur beim
  Wartungsvertrag. Gibt es das Prüfprotokoll physisch?
- **§ 34d GewO fehlt.** Kein Treffer für Vermittlerstatus, Registernummer,
  DIHK oder Schlichtungsstelle im ganzen Repo. Die Altseite hatte sie auch
  nicht, aber die neue Seite bewirbt die Vermittlung mit eigener Route und
  Formular. Erlaubnisstatus klären (Abs. 1 oder gebundener Vertreter Abs. 7).
- **Keine ear-/WEEE-Nummer, keine ElektroG- und BattG-Hinweise**, obwohl
  Elektrogeräte verkauft und Altgeräte zurückgenommen werden (§ 17 ElektroG).
- **USt-IdNr. DE346591640 neben § 19 UStG.** Beides stand auch alt so da.
  Möglich, aber ungewöhnlich — oft ist es in Wahrheit die Steuernummer. Wenn
  ja: Überschrift ändern und `vatID` aus `lib/schema.tsx` entfernen.
- **Zweite Preisspalte des ERGO-Aushangs ist im ausgelieferten Foto sichtbar**
  (122/186/180/115/130 €), die Tabelle nennt nur eine. Bedeutung klären oder
  den Bildausschnitt beschneiden — ein unerklärter Zweitpreis ist PAngV-
  riskanter als gar keiner.
- **Erster Tarifzeitraum endet 31.03.2027**, das Verkehrsjahr am 28.02.2027.
  So steht es auf dem Aushang, ist aber sachlich fragwürdig.
- **`skopegebrauchtwarenhandel.de` gehört dem Betreiber**, zeigt auf Wix und
  ist nicht verbunden (404). Das alte JSON-LD nutzte bereits die .de-Adresse
  als `@id`, obwohl die Seite unter .com lief. Hauptdomain festlegen, die
  andere per 301.
- **Hinweis auf eine Festnetznummer:** Das alte Schema trug den Platzhalter
  `+49-7139-XXXXXX` (Vorwahl Neuenstadt). Festnetz ist im Local Pack das
  stärkere NAP-Signal als eine Mobilnummer.
- **eBay-Konto:** Es gibt Treffer, aber über mehrere Konten verteilt und
  keinem davon zuzuordnen. Verkäufernamen erfragen, dann in `sameAs`.

**Erledigt durch die Prüfung, nicht mehr offen:**

- **Social-Profile gibt es nicht.** Roh-HTML aller sechs Altseiten nach
  facebook/instagram/tiktok/youtube/whatsapp/ebay/kleinanzeigen durchsucht:
  null Treffer. `sameAs` bleibt einelementig.
- **Geo bestätigt:** Der Maps-Kurzlink löst auf `!3d49.2373006!4d9.3436176`
  auf — exakt die Werte in `lib/site.ts`. Die Altseite lag mit 49,2333/9,3333
  rund einen Kilometer daneben.
- **Nicht prüfbar blieb das Google-Profil** (Consent-Wall): Öffnungszeiten und
  5,0 aus 37 Rezensionen sind weiterhin unbestätigt. Im eingeloggten Browser
  ablesen.
- **Deckungsgleich und sauber übernommen:** alle Leistungspreise (59,99 €,
  ab 15/25/40 €, 130 €/Jahr, 17,99 €/Monat, 215,88 €, 15 km Abholung,
  Kennzeichen 5–10 Werktage), „über 500 reparierte Scooter", Gewährleistung
  ein Jahr (wörtlich in den Alt-AGB, § 476 Abs. 2 BGB), Adresse, Telefon,
  E-Mail, alle sechs ERGO-Zeiträume, die ABE-Warnungen bei F2 E und Xiaomi 5
  Max. Zwei Altseiten-Übertreibungen wurden zu Recht nicht übernommen: der
  „27-Punkte-Sicherheitscheck" und die „unbegrenzten Checks".

## Der Erklärfilm

35 Sekunden, **ohne Tonspur**, Motion Design in der Markensprache. Liegt als
`public/video/skope-erklaervideo.mp4` (1,3 MB) mit Standbild
`public/img/erklaervideo-poster.jpg`. Die Rohdatei aus dem Schnitt wiegt
10,5 MB und wird nicht ausgeliefert; `/*.mp4` im Projektstamm ist deshalb
ignoriert. Neue Fassung:

```
ffmpeg -i ROH.mp4 -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p \
  -movflags +faststart -an public/video/skope-erklaervideo.mp4
```

- **Er steht auf `/ueber-uns`, nicht auf der Startseite.** Zuerst lag er im
  Ablauf-Block der Startseite; dort war er ein zweiter Erzähler neben einer
  Seite, die dasselbe schon sagt. Auf der Über-uns-Seite beantwortet er die
  Frage, die dort gestellt wird — wer ist das und wie arbeiten die —, und
  steht vor den Kundenstimmen: erst die eigene Darstellung, dann das Urteil
  anderer. Eigene Sektion in Tinte, damit die Folge Silber → Tinte →
  Silber-200 den Wechsel hält.
- **Nativer `<video controls>`, kein eigener Abspieler**, dazu `preload="none"`
  und Standbild. Ohne die Angabe lädt Safari beim Seitenaufruf Teile der Datei
  mit. Gemessen: null Videoanfragen beim Aufruf der Startseite.
- **Deckel 70 rem (1120 px).** Die Quelle ist 1280 px breit; darüber würden die
  Schrifttafeln weich.
- **Kein Autoplay.** Der Film erklärt mit Schrift und will gelesen werden.
- **Textalternative sichtbar in der Bildunterschrift**, nicht in einem Attribut:
  Ohne Tonspur braucht er keine Untertitel, wohl aber einen Text für alle, die
  ihn nicht sehen.
- **`VideoObject` im Graph** (`explainerVideo()` in `lib/schema.tsx`), nur auf
  `/ueber-uns`, weil er nur dort abspielbar ist — die `@id` hängt an derselben
  Adresse. Wandert der Film, wandern beide mit. `uploadDate` ist fest und
  gehört dem Film, nicht dem Build.
- **Die Zahlen im Film sind geprüft** (19.08.2026): 59,99 €, ab 15/25/40 €,
  17,99 € im Monat, Express 24 h, 15 km Abholung, Adresse — alles deckungsgleich
  mit `lib/data/services.ts` und `lib/data/plans.ts`. Ändern sich Preise, ändert
  sich der Film mit, sonst stehen zwei Wahrheiten auf derselben Seite.

## Sehr breite Schirme

Gemessen am 19.08.2026 auf 5120 × 1440 (49-Zoll-Curved), gegengeprüft bei 3440
und 2560.

Der Inhalt läuft überall über `Container` und ist bei **104 rem (1664 px)**
gedeckelt — ab dieser Breite ändert sich am Satz nichts mehr, das ist Absicht.
Kaputt war nur, was **am Fenster** hing statt am Raster: Die Aufnahme im
Kopfbereich liegt `contain` und rechts verankert, skalierte also über die Höhe
(1975 px breit) und klebte am rechten Fensterrand. Zwischen Textspalte
(endet bei 3392 px) und Roller (beginnt bei 3145 px … am Rand) lagen 1400 px
schwarze Fläche, links vom Text noch einmal 1728 px.

Die Bildfläche trägt jetzt dieselbe Grenze wie `Container` und ab `min-[104rem]`
einen seitlichen Auslauf per `mask-image` — sonst steht dort, wo das Foto
aufhört, eine harte senkrechte Kante. Unterhalb von 1664 px ist beides wirkungslos.

**Regel daraus:** Was als Grund über die volle Breite läuft, darf eine
Flächenfarbe oder ein Verlauf sein. Ein Motiv, das zur Komposition gehört, wird
an `Container` gebunden, nicht ans Fenster.

## Das Flackern des Seitenkopfs — gefunden

Lange als „nicht reproduzierbar" geführt, weil an der falschen Stelle gesucht
wurde: Die Scroll-Schwelle hat Hysterese (32 px hinein, 8 px hinaus) und einen
rAF-Riegel, und auf drei Routen über die ganze Seitenlänge gab es **null
Zustandswechsel**. Es war nie der Zustand, sondern die **Farbe der Leiste**.

Gemessen (mittlere Helligkeit eines 300 × 68 px großen Ausschnitts der Leiste,
alle 250 px Scrollweg über die Startseite): Die Leiste schwankte zwischen
rgb(22) und rgb(80) und sprang neunmal hin und her — einmal an jeder Kante
zwischen einer schwarzen und einer silbernen Sektion. Ursache war die
Durchsicht der Scheibe: 32 % Tinte über `brightness(0.4)`.

Faustformel: Schwankung ≈ (1 − Deckkraft) × Helligkeit × 229. Jetzt 90 % und
0,35 → 8 Stufen, unter der Wahrnehmungsschwelle. Wer an `.liquid-glass`
schraubt, rechnet das nach.
