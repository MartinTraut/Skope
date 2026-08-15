# Qualitätsaudit — Geschwindigkeit, Ladeverhalten, Laufruhe, Bildschirmanpassung

Stand 14.08.2026. Produktionsbau (`next build`), ausgeliefert über `next start`
auf Port 4312. Vier Gutachter haben parallel je eine Dimension am Quelltext
geprüft; alle Aussagen mit Zahlen sind zusätzlich im Browser nachgemessen.

**Messumfang:** 14 Bildschirmbreiten (320, 360, 390, 430, 744, 820, 1024, 1180,
1280, 1440, 1512, 1920, 2560, 3440 px) × 13 Seiten = 182 Seitenaufrufe, jeweils
komplett durchgescrollt. Dazu Ladekennzahlen auf Desktop und auf gedrosseltem
Mobilfunk (390 px, 4-fach gedrosselte Rechenleistung, 1,6 Mbit/s, 150 ms
Latenz), Bildfolgemessung mit echter Grafikkarte und mit Software-Rasterizer,
298 Farb-/Schriftgrad-Kombinationen auf sechs Seiten.

---

## Was einwandfrei ist

Das ist kein Höflichkeitsabsatz — es grenzt ein, wo *nicht* gesucht werden muss.

| Prüfung | Ergebnis |
|---|---|
| Horizontaler Überlauf | **0 px auf allen 182 Kombinationen** |
| Konsolenfehler, fehlgeschlagene Anfragen | keine (außer dem erwarteten 404 auf der Fehlerseite) |
| Seitenstruktur | genau eine H1 je Seite, keine Sprünge in der Überschriftenfolge, kein fehlendes `alt` |
| Titel und Beschreibungen | alle 13 Seiten innerhalb der Anzeigelängen (17–53 bzw. 139–261 Zeichen) |
| Layoutsprung (CLS) | 0,000 auf allen Seiten und beiden Profilen, einmalig 0,0117 |
| Serverantwort (TTFB) | 4–60 ms |
| Erster sichtbarer Inhalt, Mobilfunk gedrosselt | 836–1112 ms |
| Laufruhe beim Scrollen, echte Grafikkarte | 4,2–6,5 ms je Bild, entspricht 150–240 fps |
| Textkontraste | 296 von 298 Kombinationen über der Schwelle |
| Formular | sichtbare Beschriftungen, Fehler am Feld *und* als Zusammenfassung, `role="alert"`, Fokusversatz, `autocomplete`, Doppelabsende-Sperre |
| Bewegung reduzieren | greift, alle 43 Einblendungen sofort sichtbar, Hintergrund als Standbild |
| Ohne WebGL | Rückfallebene greift, kein JS-Fehler, Text vollständig |

---

## 🔴 Kritisch

### 1. Der Fokusring der Hauptaktion ist unsichtbar — gemessen 1,00:1

`app/globals.css:338`, `components/ui/button.tsx:39`

`:focus-visible { outline: 2px solid currentColor }` nimmt die **Schriftfarbe**
des Knopfes. Beim Neon-Knopf ist das Tinte — und der Ring liegt mit 3 px
Versatz außerhalb, also auf der Tintenfläche daneben.

Gemessen an fokussierten Knöpfen auf drei Seiten:

| Knopf | Ringfarbe | Untergrund | Verhältnis |
|---|---|---|---:|
| **„Anfrage senden"** (Neon auf Tinte) | rgb(8,9,11) | rgb(8,9,11) | **1,00:1** |
| **„Route planen"** (hell auf Silber) | rgb(238,241,244) | rgb(222,226,232) | **1,15:1** |
| „SKOPE, Startseite" | rgb(238,241,244) | rgb(8,9,11) | 17,57:1 |
| „Basis anfragen" | rgb(8,9,11) | rgb(222,226,232) | 15,32:1 |

Wer die Seite mit der Tastatur bedient, sieht auf der wichtigsten Schaltfläche
jeder Seite nicht, wo er steht. Alle übrigen Knöpfe sind einwandfrei — der
Fehler trifft ausgerechnet die beiden, die etwas auslösen.

**Fix:** Ring nicht aus `currentColor`, sondern aus der Fläche ableiten. In
`:root`, `.on-light` und `.on-dark` ein `--focus-ring` setzen (Silber auf
Tinte, Tinte auf Silber) und zusätzlich einen gegenläufigen zweiten Ring über
`box-shadow: 0 0 0 4px var(--surface)`, damit er auf beiden Räumen trägt.

### 2. Ohne Hardwarebeschleunigung sind die Unterseiten unbedienbar

`components/ui/page-header.tsx:42` mit `components/motion/velaris.tsx`

Gemessen auf `/reparatur`, identischer Aufbau, einmal mit echter Grafikkarte,
einmal mit dem Software-Rasterizer, den Chromium einsetzt, wenn die
Grafikkarte gesperrt oder nicht vorhanden ist:

| Zustand | Ø je Bild | 95. Perzentil | Bilder über 32 ms |
|---|--:|--:|--:|
| echte Grafikkarte | **4,2 ms** | 4,4 ms | 0 von 599 |
| echte Grafikkarte, 4-fach gedrosselte CPU | 8,3 ms | 16,4 ms | 5 von 299 |
| Software-Rasterizer | **164,3 ms** | 225,1 ms | 14 von 14 |
| Software-Rasterizer, gedrosselt | **242,4 ms** | 291,7 ms | 10 von 10 |

164 ms je Bild sind sechs Bilder in der Sekunde. Die Gegenprobe zeigt die
Ursache eindeutig: Wird `getContext("webgl")` unterbunden, fällt derselbe
Messwert auf **8,3 ms und null ruckelnde Bilder**; das Abschalten von
`backdrop-filter` ändert dagegen nichts (2782 ms Blockierzeit statt 2778 ms).

Die Startseite ist nicht betroffen — sie zeigt seit dem Hero-Umbau ein Foto
statt des Shaders. Betroffen sind alle Seiten mit `PageHeader`, also alle
Unterseiten.

Die Rückfallebene in `velaris.tsx` greift nur, wenn der Kontext **fehlt** oder
verlorengeht, nicht wenn er *langsam* ist. Genau das ist der Fall auf Geräten
mit gesperrtem Treiber.

**Fix:** Eine Bildratenkontrolle in `velaris.tsx`: die ersten rund 30 Bilder
messen und bei einem Mittel über etwa 25 ms auf `.velaris-still` umschalten,
denselben Weg wie bei Kontextverlust. Zehn Zeilen, und die Seite ist auf jedem
Gerät benutzbar.

### 3. Velaris läuft nach einem Kontextverlust weiter — auf einem toten Kontext

`components/motion/velaris.tsx:310`

`onLost` bricht die Schleife ab und blendet die Fläche aus, setzt aber kein
Kennzeichen und trennt den `IntersectionObserver` nicht. Beim nächsten
Sichtbarkeitswechsel startet `requestAnimationFrame(loop)` erneut und dreht mit
60 Bildern je Sekunde auf einem toten Kontext — unsichtbar, aber voller
Bildtakt, und zwar auf genau dem Gerät, das den Kontext verloren hat, weil es
überlastet war.

**Fix:** in `onLost` ein `dead = true` setzen, `io.disconnect()` aufrufen und in
`loop` früh zurückkehren.

---

## 🟠 Hoch

### 4. Bilder werden bis zum Neunfachen der benötigten Fläche ausgeliefert

`next.config.ts` (leer), `components/sections/hero.tsx:99`,
`recycling-teaser.tsx:55`, `pillars.tsx:92`, `workshop.tsx:24`,
`app/ueber-uns/page.tsx:67`, `app/versicherung/page.tsx:142`

Zwei Ursachen greifen ineinander. Erstens rechnen die `sizes`-Angaben in `vw`,
während der Satzspiegel bei 96 rem gedeckelt ist: Ab 1536 px wächst die
Anforderung weiter, die Anzeigefläche nicht. Zweitens ist `deviceSizes` nicht
begrenzt, Next greift deshalb bis in den 3840er-Eimer.

Gemessen (angeforderte Breite gegen tatsächliche Anzeigebreite):

| Breite | Seite | geliefert | angezeigt | Faktor |
|--:|---|--:|--:|--:|
| 3440 | `/e-scooter` | 3840 px | 425 px | **9,0×** |
| 3440 | `/` | 3840 px | 612 px | 6,3× |
| 2560 | `/kontakt` | 3840 px | 556 px | 6,9× |
| 1180 | `/` | 3840 px | 1180 px | 3,3× |
| 1024 | `/e-scooter` | 1080 px | 410 px | 2,6× |

Die Startseite überträgt am Schreibtisch **905 kB Bilddaten** von 981 kB
Gesamtlast. Auf dem Telefon sind es 245 kB — dort greifen die kleinen Eimer.

**Fix:** in `next.config.ts` `images.deviceSizes` auf `[640, 750, 828, 1080,
1200, 1600, 1920]` deckeln und `formats: ["image/avif", "image/webp"]`
ergänzen (AVIF ist derzeit nicht aktiv, das sind rund 20–30 % der Bildbytes).
Dann die `vw`-Angaben oben deckeln, Muster:
`sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 30vw, 460px"`.

### 5. Die Hero-Überschrift bricht auf schmalen Telefonen dreizeilig um

`app/globals.css:129`, `components/sections/hero.tsx:155` — gemessen:

| Breite | Schriftgrad | Zeilen | Spalte | benötigt |
|--:|--:|--:|--:|--:|
| **320** | 35,2 px | **3** | 272 px | 272 px |
| **360** | 35,2 px | **3** | 312 px | 312 px |
| 390 | 35,2 px | 2 | 342 px | 342 px |
| 430 | 35,2 px | 2 | 382 px | 382 px |
| 1512 | 71,4 px | 2 | 800 px | 800 px |

Der Clamp-Boden von 2,2 rem wurde auf genau eine Zielbreite gerechnet — 390 px.
Darunter zerfällt der bewusst gesetzte Umbruch nach „reparieren".

**Fix:** Boden auf den kleinsten Fall rechnen. Bei 9,51 px Laufweite je px
Schriftgrad braucht 272 px Spalte 28,6 px Grad →
`--text-hero: clamp(1.79rem, 4.3vw + 0.4rem, 4.7rem)`.

### 6. Eine Kennzahl im Hero wird auf schmalen Telefonen zweizeilig

`app/globals.css:135`, `components/sections/hero.tsx:316` — gemessen:
Bei 320 und 360 px bricht **„bis 25 km"** bei 32 px Grad auf zwei Zeilen um;
bei 390 und 430 px sind alle vier Kennzahlen einzeilig.

Ursache: Der Clamp-Boden 2 rem = 32 px liegt über dem Vorzugswert, bis
`2.4vw + 13.6px = 32px`, also bis 766,7 px — der Grad ist bei 320 px derselbe
wie bei 760 px. Im Raster `grid-cols-2 gap-x-8` bleiben bei 320 px genau
120 px je Spalte.

**Fix:** `--text-stat: clamp(1.65rem, 2.4vw + 0.85rem, 3.5rem)`.

### 7. Zwischen 768 und 1023 px fehlt jede Zwischenstufe

`components/sections/pillars.tsx:58` (`lg:grid-cols-3`),
`components/sections/plans.tsx:29` (`lg:grid-cols-2`),
`components/sections/process.tsx:73` (`lg:grid-cols-4`)

Auf dem iPad im Hochformat (820 px) ist jede der drei Säulen 740 px breit, das
4:3-Bild damit **555 px hoch** — drei davon ergeben rund 2.000 px Bildstrecke
für einen Abschnitt, der ab 1024 px mit 213 px hohen Bildern auskommt. Über
eine einzige Pixelgrenze hinweg ändert sich die Bildhöhe um 342 px. Beim
Ablauf fehlt in diesem Band zusätzlich die Prozesslinie, die die Reihenfolge
überhaupt lesbar macht.

**Fix:** `md:grid-cols-3` für die Säulen (Trennlinien-Logik mitziehen),
`md:grid-cols-2` für die Pläne, `md:grid-cols-2 lg:grid-cols-4` für den Ablauf.

### 8. Die Kopfzeile ist zwischen 744 und 1023 px leer

`components/layout/header.tsx:153` (`xl:block`), `:210`, `:229`
(`min-[1024px]`), `:234` (`lg:inline-flex`)

In diesem Band greift keine der vier rechten Komponenten: Navigation erst ab
1280, Bewertung, Telefonpille und Anfrage-Knopf ab 1024. Auf 740 px
Satzspiegel stehen Logo, ein Telefon-Zeichen und ein Burger — die Hauptaktion
fehlt, obwohl reichlich Platz da ist.

**Fix:** `ButtonLink` auf `md:inline-flex`, `PhoneButton iconOnly` auf
`md:hidden`.

### 9. Die Galerie lädt zwölf Bilder gleichzeitig

`components/ui/gallery.tsx:106`

Alle sechs Aufnahmen liegen gleichzeitig im DOM (`opacity-0` statt
Aushängen), sind damit für den Lazy-Loader „im Sichtfeld" und werden beim
Seitenaufbau vollständig geladen; mit den Vorschaubildern kommen sechs weitere
Anfragen dazu. Auf jeder Gerätedetailseite sind das rund **270–300 kB über dem
Falz** — passend dazu ist die Detailseite mit gedrosseltem Mobilfunk die
einzige Seite mit **1864 ms** bis zum größten Inhalt.

**Fix:** nur das aktive Bild und die beiden Nachbarn rendern, bereits gesehene
merken:
`const [seen, setSeen] = useState(new Set([0]))` und
`seen.has(i) || Math.abs(i - active) <= 1 ? <Image …/> : null`.

### 10. Höhe des Menüpanels rechnet gegen die falsche Kopfhöhe

`components/layout/header.tsx:263` (`min-h-[calc(100svh-4.5rem)]`) gegen
`:131` (`h-[4.5rem] md:h-20`)

Ab `md` ist die Leiste 80 px hoch, das Panel rechnet weiter mit 72 px — es ist
8 px höher als der verbleibende Raum, die letzte Zeile steht angeschnitten.
Betrifft 820, 1024 und 1180 px.

**Fix:** `md:min-h-[calc(100svh-5rem)]` ergänzen, besser die Kopfhöhe als
Token `--header-h` führen und beide Stellen daraus ableiten.

---

## 🟡 Mittel und Politur

11. **Rahmen der Formularfelder praktisch unsichtbar** —
    `components/forms/inquiry-form.tsx:44`: `bg-current/8` mit
    `border-transparent` ergibt gegen Silber 1,25:1. WCAG verlangt 3:1 für die
    Grenze eines Bedienelements. → `border-current/45`.

12. **Kartennachweis unter der Schwelle** — `components/ui/expand-map.tsx:114`:
    gemessen **4,27:1** bei 13 px, nötig sind 4,5:1. Es ist zugleich die
    lizenzpflichtige OpenStreetMap-Namensnennung. → `text-current/65`.

13. **`aria-label` der Bestandskarte verschluckt die ABE-Warnung** —
    `components/ui/inventory-card.tsx:71`: Der zugängliche Name ersetzt den
    Inhalt des Links; „Ohne deutsche Betriebserlaubnis" wird beim Durchlaufen
    der Linkliste nicht ausgegeben. → Warnung in das Label aufnehmen oder das
    Label streichen und den Zusatz als `sr-only` in den Link legen.

14. **8-px-Schrift im Fußbereich** — `components/layout/footer.tsx:32`:
    „Gebrauchtwarenhandel" in 0,5 rem gesperrten Versalien, auf allen 14
    Breiten. Das Projekt hat die kleinsten Grade bewusst auf 13 px angehoben —
    diese Stelle unterläuft die eigene Regel um mehr als das Doppelte.

15. **11-px-Schrift an fünf Stellen** — Kennzahlbeschriftungen auf `/`,
    `/wartungsvertrag` und der Gerätedetailseite („Tempo", „Reichweite",
    „Zuladung", „Zustand", „Zulassung", „Jährlich", „Monatlich").

16. **Trennzeichen bei 2,01:1** — das „/" zwischen zwei Angaben auf `/` und
    `/reparatur`. Rein dekorativ, aber es steht neben Text, der die Schwelle
    einhält.

17. **Scroll-Zuhörer der Aktionsleiste ohne rAF-Riegel** —
    `components/layout/mobile-cta.tsx:41`: passiv, aber ungedrosselt, liest
    `window.innerHeight` im Handler. Der Header nebenan (`header.tsx:47`) macht
    es korrekt vor.

18. **Zwei WebGL-Kontexte je Unterseite** — `page-header.tsx:42` und
    `cta-band.tsx:36`; bei Client-Navigation kurzzeitig vier. Die Instanz am
    Seitenende wird initialisiert, bevor der Sichtbarkeitsbeobachter das erste
    Mal auslöst.

19. **Laufbänder pausieren nicht außerhalb des Sichtfelds** —
    `region.tsx:127` (`repeat={4}`) und `testimonials.tsx:117`: sieben dauerhaft
    animierte Ebenen auf der Startseite. Reine Verschiebung, also billig, aber
    ohne Gegenwert.

20. **`will-change` auf 30 bis 40 Elementen gleichzeitig** —
    `app/globals.css:1045`: `.reveal:not([data-shown])`. Für die untersten
    Abschnitte gilt das faktisch die ganze Sitzung. Browser promoten
    `opacity`/`transform` ohnehin selbst.

21. **Laufband nicht per Tastatur anzuhalten** — `components/ui/marquee.tsx:63`:
    Pause nur über `group-hover`. → `group-focus-within` ergänzen.

22. **Bildwechsel wird nur als Zahl angesagt** — `components/ui/gallery.tsx:154`:
    der Live-Bereich enthält „3 / 6", nicht den Alt-Text des neuen Bildes.

23. **`color-scheme` widerspricht sich** — `app/layout.tsx:67` (`light`,
    Themenfarbe `#f4f2ed`) gegen `app/globals.css:153` (`dark`). Die Farbe
    `#f4f2ed` kommt im Designsystem nicht vor; Silber ist `#eef1f4`.

24. **Zwei Schriftfamilien, beide vorgeladen** — `app/layout.tsx:27` und `:33`:
    zusammen 77 kB auf jeder Seite, beide mit `rel="preload"` in Konkurrenz zum
    Hero-Bild.

25. **Toter Code** — `components/ui/green-border.tsx` (22 kB, nirgends
    importiert; enthält einen nicht-passiven Scroll-Zuhörer in der
    Capture-Phase mit `getBoundingClientRect` je Ereignis) und `motion@13` in
    `package.json`, das im gesamten Quelltext nicht vorkommt und der Vorgabe
    „keine Animationsbibliothek" widerspricht.

26. **Quellbilder überdimensioniert** — `werkstatt-service.jpg` und
    `scooter-studio.jpg` je 1611 × 2000 px bei 584 bzw. 428 kB, gezeigt werden
    sie in 40-vw-Flächen. Kostet keine Bytes im Betrieb, aber Zeit bei der
    ersten Umrechnung jeder Größe.

27. **Berührflächen knapp unter 40 px** — Logo-Link 154 × 20 px (mobil) bzw.
    177 × 24 px, Galerie-Vorschaubilder 39 × 39 px bei 320 px.

---

## Geprüft und widerlegt

Drei Verdachtsfälle haben die Messung nicht überstanden — sie stehen hier,
damit sie nicht ein zweites Mal untersucht werden:

- **Platzhalter der Aktionsleiste zu klein** (`mobile-cta.tsx:55`, 76 px gegen
  72 px + Sicherheitsabstand): In der Messung bei 390, 430 und 820 px sind die
  Links der Fußzeile **frei**, die Leiste beginnt bei 772 von 844 px. Der
  Sicherheitsabstand ist in der Emulation allerdings 0 — auf einem echten
  iPhone kommen etwa 34 px dazu, dann fehlen rechnerisch 30 px. Nicht
  widerlegt, aber auch nicht belegbar ohne echtes Gerät. Der Fix
  (`h-[calc(4.5rem+env(safe-area-inset-bottom))]`) kostet nichts.
- **Eingabefeld mit 193 × 28 px als zu kleine Berührfläche**: Das ist das
  Honigtopf-Feld (`inquiry-form.tsx:186`), 9999 px außerhalb des Bildes, mit
  `tabIndex={-1}` und `aria-hidden`. Kein Befund.
- **Sprunglink mit 1 × 1 px**: `sr-only`, wird beim Fokussieren auf volle Größe
  gebracht. So gebaut, kein Befund.

---

## Reihenfolge der Umsetzung

Nach Verhältnis von Wirkung zu Aufwand:

1. **Punkt 1** (Fokusring) — eine Regel in `globals.css`, behebt die
   schwerwiegendste Barriere.
2. **Punkt 4** (`next.config.ts`) — zwei Zeilen, spart auf großen Monitoren den
   größten Einzelposten an Bytes.
3. **Punkt 2** (Bildratenkontrolle in `velaris.tsx`) — zehn Zeilen, macht die
   Unterseiten auf Geräten ohne Grafikbeschleunigung überhaupt bedienbar.
4. **Punkte 5, 6** (zwei Clamp-Böden) — zwei Zahlen.
5. **Punkte 7, 8, 10** (Haltepunkte für Tablets) — eine Runde Klassenarbeit.
6. **Punkt 9** (Galerie) — der einzige Punkt mit echter Bauarbeit.
7. Der Rest als Politur.
