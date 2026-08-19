# SKOPE — Projektgedächtnis

Kurzfassung für den Start einer Sitzung. Ziel dieser Datei: nicht noch einmal
herausfinden müssen, was hier schon entschieden und gemessen wurde.

## Was das ist

Website der SKOPE E-Scooter Fachwerkstatt, Im Kampfrad 3, 74196 Neuenstadt am
Kocher. Verkauf geprüfter Gebrauchtgeräte, Reparatur, Wartungsverträge,
Versicherungsvermittlung (ERGO), kostenlose Altgerät-Rücknahme. Inhaber Thomas
Zielke, Kleinunternehmer nach § 19 UStG.

Next.js 16 (App Router), React 19, TypeScript, Tailwind v4. Keine
Animationsbibliothek, kein UI-Framework über shadcn hinaus.

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
- **`lib/inventory.ts`** — 13 Geräte, Stand 13.08.2026, aus dem alten Shop
  übernommen. Kein Warenwirtschaftssystem dahinter: Verfügbarkeit und Preis
  vor jedem Deploy prüfen, verkaufte Geräte löschen.
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
