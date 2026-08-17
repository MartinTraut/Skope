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
| `components/ui/gallery.tsx` | Bildergalerie der Bestandsgeräte. Alle Bilder gleichzeitig im DOM, Pfeile auf dem Bild, quadratischer Ausschnitt. |
| `components/ui/inventory-card.tsx` | Bestandskarte. Geschlossen nur Bild, Modell, Preis, zwei Kennwerte — plus die ABE-Warnung, die nie eingeklappt wird. |
| `components/ui/expand-map.tsx` | Lagekarte als eingefärbtes PNG aus OpenStreetMap-Kacheln. Kein Embed: kein Drittanbieter-Request, keine Einwilligung nötig. Namensnennung ist Lizenzpflicht. |
| `components/ui/faq.tsx` | `FaqSection` trägt Kopf **und** Liste: fünf Spalten Überschrift, sieben Spalten Fragen. Alle fünf FAQ-Blöcke der Seite laufen darüber – gestapelt blieb die rechte Hälfte leer und das Pluszeichen stand 500 px hinter der Frage. |
| `components/brand/seal.tsx` | Qualitätssiegel als Rasterbild (`public/img/siegel-skope.png`, kreisrund freigestellt, 1000 px). Der frühere SVG-Nachbau ist ersetzt; die Metallanmutung ist hier die Aussage. |
| `lib/schema.tsx` | Ein `@graph` mit `@id`-Verweisen. `inventoryProducts()` erzeugt Product + Offer je Gerät. |

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
- **`lib/site.ts` → `geo`** — die alten Koordinaten lagen einen Kilometer
  daneben (Mühlweg statt Im Kampfrad). Jetzt die geokodierte Lage der Straße;
  die Hausnummer 3 ist in OSM nicht erfasst. Exakten Punkt der Einfahrt
  bestätigen lassen, dann `public/img/karte-neuenstadt.png` neu erzeugen.
- **Zweite Preisspalte im ERGO-Aushang** — der Werkstattaushang führt in fünf
  Zeilen einen zweiten Haftpflichtwert (ab 122, 186, 180, 115, 130 €). Wofür
  er gilt, ist ungeklärt; er steht deshalb nicht auf der Seite. Steht als TODO
  in `lib/data/insurance.ts`.
- **Google-Bewertung** — „5,0" und „3 Rezensionen" stehen im Seitenkopf, im
  Hero und als `AggregateRating` im Schema, sind aber aus drei übernommenen
  Rezensionen abgeleitet und nicht vom Profil abgelesen; die Profil-URL ist in
  `lib/site.ts` weiterhin ein TODO. Entweder abgleichen oder rausnehmen.
- **Öffnungszeiten** in `lib/site.ts` sind „nach Vereinbarung" — verbindliche
  Zeiten fehlen.
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
