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

- **Der Kopfbereich zeigte den Roller auf dem Telefon zweimal** – als Grund
  hinter der Sektion *und* als gerahmte Tafel im Text. Jetzt trägt jede Breite
  genau eine Aufnahme: der Grund `hidden lg:block`, die Telefonbühne
  `lg:hidden`. Beide tragen dieselbe Beschreibung und dieselbe `sizes`-Angabe;
  beide stehen mit `priority` im Vorladen, und zwei verschiedene Angaben hätten
  zwei Breiten derselben Datei geholt.
- **Auf dem Telefon steht der Text jetzt auf dem Bild, nicht daneben.** Über
  die volle Sektionshöhe gelegt bleibt vom Motiv nichts: Die Sektion ist bei
  390 px rund 1400 px hoch, die Aufnahme 2400 × 1507 – `object-cover` skaliert
  dann über die Höhe und zeigt 15 % der Bildbreite, einen Ausschnitt der
  Trittfläche. Deshalb eine **Bühne** am oberen Rand statt eines Grundes:
  `h-[max(min(58vh,26rem),min(56vw,26rem))]`, volle Gehäusebreite (`w-screen`).
  Der zweite Term ist für das Querformat – bei 844 × 390 wären 58 vh nur
  226 px, und die Aufnahme wird dort über die Breite skaliert; man sah nur die
  Lenkstange.
- **Der Verlauf darüber ist dreiteilig:** oben 45 % Tinte für die
  Auszeichnungszeile, bei 38 % nur 8 % für den Roller, ab 74 % dicht, damit die
  Überschrift darauf steht und die Bühne ohne Kante in die Tinte übergeht.
  Gemessen mit ausgeblendetem Text: hinter Überschrift und Fließtext liegt das
  95. Perzentil bei 18–22 von 255, hellste Stelle 116 (Weiß darauf 4,7:1),
  im Querformat 135 (3,6:1 – Großtext, Grenze 3:1).
- **Der Bildausschnitt ist `object-[82%_center]`** und nicht mittig: Bei 59 %
  sichtbarer Bildbreite steht der Roller sonst halb hinter der Überschrift.
  `brightness-115` hebt ihn aus dem dunklen Motiv, ohne die Tinte aufzuhellen.
- **Der Kopfabstand am Telefon ist eigenständig** (`clamp(7rem,4.5rem+11vh,
  10rem)`, ab `lg` wieder der alte Wert): Die Überschrift muss auf den dichten
  Teil des Verlaufs fallen, nicht darüber.
- **Die Aktionen sind ein Block, nicht drei Kästen.** Zwei Knöpfe in vollem
  Satz mit 2,5 Einheiten Abstand, die Zusage 3 darunter – vorher lagen 28 px
  dazwischen und alle drei Flächen sahen gleich schwer aus. Der Umrissknopf
  bekommt am Telefon `bg-current/8`, weil ein reiner Umriss neben einem
  Neon-Vollton auf Tinte wie ein Nachtrag aussieht.
- **Der Beleg ist eine Fläche statt vier freier Blöcke.** Gesichter, Note,
  Anzahl und Zitat standen in vier verschiedenen Abständen untereinander und
  sagten alle dasselbe. Jetzt eine Kachel mit Haarlinie; die Kürzel
  überlappen nur noch `-space-x-1.5` (bei `-space-x-3` lag jedes zweite
  Zeichen unter dem Nachbarn).

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

## Handy-Qualitätsprüfung — 21.08.2026

Vier Gutachter (Komposition, Bedienbarkeit, Code/Responsive, Conversion) gegen
elf Routen × 320/390/430 px plus Querformat, Produktionsbuild auf Port 4312.
Ergebnis nach der Abarbeitung: kein waagerechter Überlauf, keine
Konsolenfehler, keine Zielfläche unter 44 px, keine Schrift unter 11 px auf
keiner Route und keiner Breite.

**Was echt kaputt war und nicht wieder eingebaut werden darf:**

- **`--text-stat` war auf dem ganzen Telefon tot geklemmt.** Der Anstieg
  (2,4vw + 0,85rem) erreichte den Boden von 2 rem erst bei 766 px – 447 px
  Fensterbreite ohne jede Skalierung. Sichtbare Folge: Im Kennzahlenband der
  Startseite war die Zelle bei 320 px 297 px breit bei 272 px Platz, und
  `overflow-hidden` schnitt 25 px **jedes Werts** ab („1 Jah", „bis 599,99"
  ohne Zeichen, der Preis angeschnitten). Wer an einem Grad-Token schraubt,
  rechnet nach, ab welcher Breite der PREFERRED-Term den Boden überholt.
- **Der Fokusring lief in `currentColor`** und liegt mit 3 px Versatz
  *außerhalb* des Elements. Auf einem Neon-Knopf ist `currentColor` Tinte, und
  der Knopf steht auf Tinte: 1,0:1 auf der wichtigsten Schaltfläche der Seite.
  Er kommt jetzt wie Akzent und Knopfkante aus der Fläche (`--focus-ring`).
- **`overflow-x: clip` an `html`/`body` hebelt die Scrollsperre des
  `<dialog>` aus.** Gemessen: Galerie-Vollbild offen, ein Wisch, `scrollY`
  0 → 1063. Die Sperre läuft jetzt wie im Menü über `position: fixed` am
  `<body>`, aufgehoben in `onClose` (Escape läuft nicht durch `closeZoom`).
  Der Rücksprung braucht ein erzwungenes Layout (`void body.offsetHeight`) –
  ohne das klemmt `scrollTo` gegen die noch fensterhohe Seite.
- **`aria-hidden` an der Bildfläche tötet den `alt` darunter.** Beide Flächen
  im Kopfbereich trugen es; das Kopfbild war auf Telefon *und* Schreibtisch
  unbeschrieben, obwohl der Eintrag unter „Datumssignal und Alt-Texte" das
  Gegenteil behauptete. `pointer-events-none` und `-z-10` halten die Fläche
  auch ohne `aria-hidden` aus jeder Bedienung heraus.
- **Ein Textknoten in einer Flex-Zeile schrumpft nicht.** Die ABE-Warnung der
  Bestandskarte stand in der zweispaltigen Ansicht 31 px außerhalb ihrer
  gelben Fläche. Braucht einen `<span className="min-w-0">`, und weil
  „Betriebserlaubnis" bei 13 px 118 px misst und nur 105 px Satz bleiben,
  zusätzlich `[hyphens:auto]`.

**Proportionen und Struktur:**

- **Der Kopfbereich am Telefon ist kompakter.** Auszeichnungszeile
  „Generalüberholt · Neuenstadt" statt „Refurbished E-Scooter · Neuenstadt am
  Kocher" – einzeilig bei 390 px statt zweizeilig, und „refurbished" ist der
  Fachbegriff der Branche, nicht das Wort des Kunden. Der Lead hat den
  Satzteil verloren, der drei Zeilen tiefer als Kennzahl steht
  („mit 1 Jahr Gewährleistung übergeben"): vier Zeilen statt sechs. Sektion
  1411 → 1328 px, H1 bei 207 statt 227.
- **Der Unterseitenkopf begann 200 px unter der Kopfzeile.**
  `pt-[clamp(6rem,3.5rem+9vh,10rem)]` = 132 px, dazu `mt-10` und `mt-6` –
  H1 bei 270 bis 283 px auf allen zehn Unterseiten. Jetzt
  `clamp(4.5rem,2rem+7vh,10rem)` mit `mt-7`/`mt-4` unter `md`.
- **Die Zusage im Kopfbereich hat am Telefon keine Fläche mehr.** Mit
  Kachelradius und Füllung war sie ein drittes Rechteck in Knopfgröße unter
  zwei Knöpfen – man liest drei Aktionen und tippt auf eine, die keine ist. Ab
  `sm` trägt die Pille wieder; `sm:trace` gibt es nicht (components-Layer),
  dafür steht `.trace-from-sm` in `globals.css`.
- **Die Startseite ist von 19.667 auf 12.845 px gefallen** (23,3 → 15,2
  Bildschirmhöhen), die Bestandsseite von 16.156 auf 12.266. `Plans`,
  `InsuranceTeaser` und `RecyclingTeaser` sind von der Startseite weg: Sie
  standen dort nicht als Anriss, sondern in voller Länge, und alle drei sind
  in `Pillars` angerissen und verlinkt. `Region` steht jetzt vor der FAQ –
  wer ein Gerät gesehen hat, entscheidet als Nächstes über die Strecke.
- **Das Zitat stand zweimal auf der Startseite.** `leadReview` im Kopfbereich
  kam aus derselben `testimonials`-Liste wie das Band der Kundenstimmen. Der
  Kopfbereich trägt jetzt Note, Anzahl und den Weg dorthin.
- **Das Zitatband ist am Telefon eine Wischbahn.** Bei 390 px ist die Karte
  304 px breit – links stand eine halbe Karte an der Gehäusekante, rechts eine,
  die mitten im Wort abbrach. Dazu ließ sich das Band mit dem Finger nur
  *anhalten* (`group-active`), nicht bewegen; 64 s Umlauf heißt bis zu 21 s
  Wartezeit auf die dritte Stimme. Ab `sm` läuft das Band weiter.
- **Bestandsraster: zwei Spalten ab 380 px auf der Bestandsseite, eine Spalte
  im Startseiten-Teaser.** Dieselbe Karte, andere Aufgabe: drei Geräte sind
  eine Auslage (zweispaltig standen sie als zwei plus eins), dreizehn sind ein
  Katalog (einspaltig 7,5 Bildschirmhöhen, zweispaltig 3,8). Unter 380 px eine
  Spalte – dort wäre die Karte 160 px breit.
- **Nummerierte Ablaufschritte:** Die Textspalte war bei 342 px Satzspiegel
  nur 274 px breit, verschachtelt 234 px – 23 bis 25 Zeichen je Zeile. Am
  Telefon steht die Nummer jetzt neben der Überschrift und der Fließtext
  darunter über beide Spalten (`col-span-2 sm:col-start-2`).
- **Die Schlagwortkapseln der Reparaturbereiche sind eine Liste mit
  Haarlinien.** Als `flex-wrap` brachen fünf verschieden breite Kapseln als
  zwei plus eins plus eins plus eins um, und jede Karte an anderer Stelle.
- **Zwei `<h2>` liefen mit 13 px** („Passt dazu", „Marken, die wir betreuen") –
  kleiner als jedes H3 der Seite. Auszeichnungszeile ist jetzt ein `<p>`, die
  Überschrift trägt `--text-title`. Dasselbe für „Direkt erreichbar" auf
  /kontakt.
- **Schriftleiter am Telefon:** H1 34 / Display 26 / Titel 24 / Subtitle 19.
  Vorher lagen Display bei 28 und Subtitle bei 20,8 – Faktoren von 1,21 und
  1,17, die man misst statt sieht. Zeilenabstand der großen Grade unter 40 rem
  auf 1,12 statt 1,03: Am Telefon läuft fast jede Abschnittsüberschrift über
  drei Zeilen, und bei 1,03 stoßen Unterlängen an die Versalien der nächsten.
- **`order-*` dreht nur das Bild, nicht den DOM.** Auf /kontakt sprang der
  Tastaturfokus dadurch 1600 px zurück, und ein Screenreader las Adresse und
  Karte vor dem Formular; im `insurance-teaser` stand die Tariftabelle vor
  ihrer eigenen Überschrift. Beide drehen jetzt nur noch ab `lg`.
- **Der Anker `#anfrage` sitzt an der Formularspalte, nicht an der Sektion.**
  An der Sektion landete jeder „Anfrage"-Knopf auf der Überschrift: erstes
  Feld bei 646 px, nutzbar sind 696 px.
- **Formularfelder hatten keine sichtbare Grenze:** Feld `current/8` auf Karte
  `current/5` sind rund 1,2:1, gefordert sind 3:1 (WCAG 1.4.11). Jetzt Füllung
  *und* dünne Kontur bei 50 % – gemessen 3,3:1. Das ist nicht der alte leere
  Kasten: Die Fläche trägt weiter die Schreibfläche, die Linie zieht nur die
  Grenze.
- **`--header-h` ist das eine Token für die Kopfhöhe.** Die Menütafel rechnete
  fest mit 4,5 rem, die Kopfzeile ist ab `md` 5 rem – die Tafel stand von 768
  bis 1279 px acht Pixel unter der Fensterkante. `scroll-padding-top` hängt
  jetzt auch daran.
- **Zwischen 1280 und 1439 px gab es keinen Telefonverweis.** Die Nummer oben
  ist dort ausgeblendet, `PhoneButton` war `lg:hidden`, die untere
  Aktionsleiste ebenfalls. Jetzt Symbolknopf in genau diesem Band.
- **`sizes` folgt jetzt der echten Bildbreite, nicht dem Fenster.**
  `(max-width: 1024px) 100vw` ignorierte die `.gutter` und holte im Querformat
  bei DPR 3 fünf 3840er Bilder – gemessen 1103 KB statt rund 500. Kinder von
  `.gutter` tragen `calc(100vw - 3rem)` bzw. `- 5rem` ab 768 px. Das Siegel
  ist über `max-w-md` bei 28 rem gedeckelt, nicht über eine Media Query.
- **Kleineres, aber aus demselben Grund:** Brotkrume 42 → 44 px; Kartennachweis
  von 4,27:1 auf 5,6:1; `aria-current` und volle Deckkraft der aktiven Zeile im
  Telefonmenü; Live-Region für den Sendezustand des Formulars; `quiet`-Knopf
  immer unterstrichen (auf dem Telefon gibt es kein Hover); Einzugsgebiet auf
  /kontakt einspaltig bis `sm`; Ortsliste im Fußbereich auf drei Orte gekürzt
  (die vollständige steht in `Region` und auf /kontakt); alle drei Werte der
  Kennzahlenkarte in Neon statt nur der erste; die Markenliste auf /e-scooter
  ist eine Zeile mit Trennpunkten statt runder Kapseln, die wie Filter aussahen
  und auf nichts antworten.

**Zwei Roh-Treffer waren Messartefakte, keine Fehler:** Der Skip-Link ist im
Ruhezustand 1 × 1 px, im Fokus 200 × 52 px und korrekt gebaut. Das
193 × 28-`<input>` auf jeder Formularseite ist der Honeypot
(`absolute -left-[9999px]`, `aria-hidden`, `tabIndex={-1}`).

**Die beiden offenen Punkte sind am 23.08.2026 nachgezogen.** Was dabei
entschieden wurde:

- **Die Abstandsleiter hat zwei Stufen.** `Section` nimmt jetzt
  `space="tight"` und lässt damit den oberen Rand weg; die Sektion darüber
  trägt den Abstand allein – gemessen 64 statt 128 px am Telefon, 104 statt
  208 auf 1512. Erlaubt ist das **nur bei gleichem Ton**: Bei einem
  Farbwechsel begänne die neue Fläche an der letzten Textzeile.
- **Die Regel dahinter:** Wo die Fläche wechselt, trägt die Kante die Zäsur
  und der volle Abstand gibt ihr Luft. Wo sie nicht wechselt, trägt nichts
  eine Zäsur – und dieselben 208 px sind kein Absatz, sondern ein Loch.
  Gemessen gab es drei solche Nahtstellen, und zwei davon waren gar keine
  Abstandsfrage, sondern eine fehlende Kante:
  - `/wartungsvertrag`: „Was nicht abgedeckt ist" gehört zu den Tarifkarten
    darüber (was in denselben zwei Verträgen *nicht* drinsteht) → `tight`.
    Das ist die einzige Stelle im Projekt, die die Stufe benutzt.
  - `/e-scooter`: `Related` stand auf Silber unter einer FAQ auf Silber –
    entgegen der eigenen Vorgabe des Bauteils („Muss sich vom Ton der
    vorhergehenden Sektion unterscheiden"). Jetzt silver-200.
  - `/ueber-uns`: `Testimonials` (silver-200) stieß an `Region`
    (silver-200). Das Band nimmt deshalb ein `tone`-Prop und steht dort auf
    Silber.
- **Einzelwerte für `py-*` an Sektionen sind weg** (`/reparatur` Marken,
  `/wartungsvertrag` zweimal). Sie wichen nur zwischen 768 und 1023 px von
  der Leiter ab – ein Unterschied, den niemand als Absicht liest.
- **Die H3 der Bestandskarte steht auf 1,0625 rem**, dem Grundschriftgrad aus
  `body`. 1 rem war ein Wert aus der Tailwind-Skala, nicht aus dieser Seite.

Zwei Kapselwolken sind bei der Gelegenheit mitgegangen, weil es dieselbe
Sorte Fehler war wie bei den Reparaturbereichen:

- **Die Ausschlüsse im Wartungsvertrag** brachen als zwei plus eins plus eins
  um („Wasserschäden durch Hochdruckreiniger" allein über die volle Breite).
  Jetzt dieselbe Haarlinienliste, mit `×` statt Neonpunkt.
- **Die Markenliste auf `/reparatur`** war eine Wolke aus acht Kapseln, auf
  `/e-scooter` dieselbe Liste eine Zeile mit Trennpunkten. Jetzt beide als
  Zeile; der Grad bleibt hier größer, weil die Namen dort der Inhalt des
  Blocks sind.
- **Die obere Haarlinie sitzt am ersten `<li>`, nicht an der `<ul>`.**
  `globals.css` gibt jedem `li` in `main` ein Lesemaß von 58ch, der Liste
  nicht: Am Schreibtisch lief die Linie der Liste 923 px breit über Einträge
  von 574 px.

## Kopfbereich der Startseite — 02.09.2026

- **Die beiden Knöpfe sind weg** (Telefonnummer im Vollton, „13 Geräte
  ansehen" als Umriss). Sie wiederholten, was die Kopfzeile dauerhaft trägt:
  Nummer ab 1280 px im Kopf, darunter als Symbolknopf bzw. in der unteren
  Aktionsleiste, dazu „Anfrage senden" und „E-Scooter kaufen" in der
  Navigation. Bezahlt wurde das mit Höhe — mit ihnen begann das Kennzahlenband
  bei 1512 × 790 erst bei 797 px und die vier Werte waren im ersten Bild
  angeschnitten.
- **Der Rest ist nachgerückt, nicht nur der Wegfall.** Oberer Rand ab `lg`
  `clamp(4rem,2rem+6vh,6.5rem)` statt `clamp(5.5rem,3rem+8vh,8rem)`, unterer
  Rand `pb-6 md:pb-8` statt `pb-10 md:pb-16`, Band `pt-6 lg:pt-4` statt
  `pt-8 lg:pt-10`, dazu drei Abstände ab `sm` um acht Pixel enger. Gemessen
  liegt die Unterkante der Kennzahlen jetzt bei 772 (1512 × 790), 759
  (1440 × 780), 735 (1280 × 800) und 822 px (390 × 844) — auf allen vier
  Formaten über der Falz. Bei 320 px geht es nicht: Dort läuft die H1 über
  drei und der Lead über sechs Zeilen.
- **Die Sektion füllt ab `lg` die Fensterhöhe** (`min-h-svh`, Bildzone
  `flex-1`). Nach dem Wegfall der Knöpfe war sie bei 1990 × 1080 rund 130 px
  kürzer als das Fenster: unter den Kennzahlen ein Streifen Tinte, und weil
  die Aufnahme `contain` in der Bildzone liegt, war sie um dieselbe Strecke
  geschrumpft – der Roller stand zu klein und zu weit oben. Die Resthöhe
  bekommt jetzt die Bildzone, nicht der Abstand: Gemessen 1080 von 1080 px
  bei 1990 Breite, 900 von 900 bei 1512, und der Roller sitzt wieder auf
  seiner Standfläche direkt über dem Band. Der Auslauf unter den Kennzahlen
  ist dabei von `lg:pb-24` auf `lg:pb-14` gefallen – 96 px waren der Rest,
  aus dem der Leerstreifen bestand. Nur ab `lg`: Am Telefon ist die Sektion
  ohnehin höher als das Fenster.
- **Die Bildfläche endet 2,5 rem unter der Bildzone** (`bottom-[-2.5rem]`
  statt `inset-y-0`). Die Aufnahme liegt `contain` und unten verankert, steht
  also immer auf dem Boden dieser Fläche – bündig mit der Zone stand der Roller
  auf einer Linie mit der letzten Textzeile und wirkte angehoben. Die 40 px
  reichen in den oberen Rand des Kennzahlenbands hinein; dort liegt nur der
  Auslauf in die Tinte, und die Fläche steht auf `-z-10` hinter allem.
- **Der Beleg steht ohne Fläche.** Rahmen, Füllung, Haarlinie und die Zeile
  „Was drei Kunden geschrieben haben" sind weg; Note, Sterne, Anzahl und die
  drei Kürzel stehen frei auf der Tinte. Als Kachel war es dasselbe Problem
  wie bei der Zusage darüber — ein weiteres Rechteck in Knopfgröße, das sich
  als Bedienelement liest. Das Gold der Sterne und das Google-Zeichen weisen
  den Beleg auch ohne Rahmen als Zitat aus.

## Roller im Kopfbereich am Schreibtisch — 10.09.2026

Derselbe Fehler wie am Telefon am 06.09., nur vier Tage später bemerkt: Der
Lenker lief durch Navigation und Telefonpille. Die Absenkung von damals galt
ausdrücklich nur unter `lg`; am Schreibtisch stand die Aufnahme unverändert
seit dem 02.09. **Es hat sich nichts von selbst verschoben** — die Stelle war
nie angefasst worden.

- **Gemessen vorher:** Die Aufnahme liegt `contain` und unten verankert, füllt
  die Bildzone also über die Höhe (1465 × 964: Bild 1321 × 829 in einer Zone
  von 1465 × 829). Ihre Oberkante lag bei 0 und damit **80 px über** der
  Unterkante der Kopfzeile.
- **Jetzt** beginnt die Bildfläche bei `calc(var(--header-h) + 1.5rem)`:
  Oberkante 104 px, also 24 px unter der Kopfzeile — auf 1465, 1512 und 1920
  derselbe Wert, weil er an der Kopfhöhe hängt und nicht an der Fensterhöhe.
  Der Roller wird rund 12 % kleiner und steht weiter auf demselben Boden
  (unten verankert, Fläche endet mit der Zone).
- **Der Versatz hängt an einer eigenen Fläche**, nicht am `<Image>` (`fill`
  schreibt `inset: 0` inline) und nicht an der Zone (an ihr hängen `.hero-scrim`
  und der Auslauf in die Tinte, deren Stopps auf gemessene Kontraste gerechnet
  sind). Maske wie am Telefon gegen die neue Oberkante.
- Sektionshöhen und H1-Positionen auf neun Breiten unverändert, kein Überlauf,
  keine Konsolenfehler.

## Roller im Kopfbereich am Telefon — 06.09.2026

Der Lenker lief quer durch das Wortzeichen der Kopfzeile. Kein
Bildausschnitt behebt das: Die Bühne ist bei 390 px 390 × 416, die Aufnahme
2400 × 1507 – `object-cover` skaliert über die **Höhe**, die Aufnahme passt
senkrecht vollständig hinein, und damit ist `object-position` in der
Senkrechten wirkungslos. Der Roller füllt immer die volle Höhe der Fläche,
in der er liegt, sein Lenker klebt also immer an deren Oberkante.

- **Die Aufnahme liegt jetzt in einer eigenen Fläche, die 4 rem tiefer
  beginnt** (`absolute inset-x-0 top-16 bottom-0` innerhalb der Bühne). Der
  Roller wird dadurch rund 15 % kleiner und sein Lenker sitzt gut 20 px
  unter der Kopfzeile. **Nicht** über die Bühne selbst lösen: Der Verlauf
  liegt an der Bühne, und seine Stopps tragen die gemessenen Kontraste
  hinter Überschrift und Fließtext. Verschiebt man die Bühne, verschiebt man
  den Verlauf mit, und die Überschrift steht im offenen Teil.
- **`fill`-Bilder von Next tragen `inset: 0` als Inline-Stil.** Eine
  Tailwind-Klasse am `<Image>` selbst (`top-16`) verliert dagegen. Der
  Versatz muss deshalb an einer eigenen Fläche darum hängen.
- **Die Maske nimmt der neuen Oberkante die Kante**
  (`mask-image: linear-gradient(to bottom, transparent, black 2rem)`). Ohne
  sie stünde bei 4 rem eine waagerechte Naht zwischen leerer Tinte und dem
  zu 62 % durchscheinenden Bild.
- **Die KI-Marke steht ab `sm` 1 rem unter der Kopfzeile, nicht 2,75.** Seit
  der Straffung vom 05.09. bricht die Auszeichnungszeile bei 320 px
  zweizeilig um und beginnt bei 121 px – die Marke lag von 116 bis 135 px
  quer darüber. Unter `sm` steht sie seit dem Umbau desselben Tages unten
  rechts, siehe den nächsten Abschnitt.

Gemessen unter den Zeilenkästen von Überschrift und Lead (Text ausgeblendet):
hellste Stelle 65 (320), 106 (390), 61 px im Querformat – Weiß darauf 10,2 /
5,4 / 10,9:1. Vorher standen dort 116 (4,7:1) und im Querformat 135 (3,6:1).

## Telefon-Durchgang — 05.09.2026

Auf Ansage des Betreibers, alles nur unter `sm` bzw. `lg`, am Schreibtisch
unverändert:

- **Zoom gesperrt** (`maximumScale: 1`, `userScalable: false`,
  `touch-action: pan-x pan-y` am `html`, `gesturestart`-Riegel in
  `ScrollManager` für Safari). Bewusst gegen WCAG 1.4.4.
- **Der Shader blitzte beim Scrollen schwarz.** Ursache: Seitenkopf und Hero
  hingen an `vh`, das sich mit der Adressleiste ändert; jeder Umbau leerte
  die Zeichenfläche einen Frame lang. Jetzt `svh`, und Velaris zeichnet nach
  jedem `ResizeObserver`-Aufruf sofort neu.
- **Die untere Aktionsleiste ist ein Dock** mit 0,75 rem Rand (und
  Aussparungsschutz über `max(…, env(safe-area-inset-*))`), weil der
  Rollbalken des Systems über eine randlose Leiste lief.
- **Kopfbereich am Telefon: 1328 → 726 px**, passt in ein Bild bei 390 × 844.
  Bestandszeile ganz entfernt (auf Ansage, auch am Schreibtisch – die Zahl
  steht im Band, der Weg in den Bestand in der Kopfzeile), Gesichter
  `hidden sm:flex`, Beleg als zwei Zeilen (Note + Sterne, Quelle), Band mit
  Kurzbeschriftung (`short`) unter `sm`.
- **Bestandsraster einspaltig bis `sm`** (vorher zweispaltig ab 380 px). Die
  Karte trägt drei feste Zellen mit je 100 px, dafür braucht sie die Spalte.
  Vier Geräten fehlten Tempo/Reichweite/Motor; nachgetragen als
  **Herstellerangaben mit `TODO Betreiber`**, nicht gemessen.
- **Kundenstimmen am Telefon zentriert** (`centered`-Prop der `QuoteCard`),
  Quelle einzeilig „G Google-Rezension · Käufer“; `context` „Käufer,
  2 Scooter“ ist auf „Käufer“ gekürzt. Im Laufband bleibt die linke Kante.
- **Bildunterschriften unter den Werkstattfotos sind weg** (Startseite,
  /ueber-uns); die KI-Offenlegung trägt der Chip im Bild allein.
- **Pfeil der Säulenkarten** steht unter `lg` in der Kennzahlzeile, der
  `max-w-[16ch]`-Deckel der Überschrift gilt nur ab `lg` – sonst brach
  „Erst messen, dann tauschen“ zweizeilig.

## Kopfbereich am Telefon neu komponiert — 06.09.2026

Auf Ansage, in zwei Runden. Zuerst: „sehr überladen, man sieht den Roller und
den Hintergrund nicht". Dann, nachdem der Kopfbereich dadurch auf 561 px
geschrumpft war: „wenn man auf die Website kommt, soll man nur den Hero
sehen … die Zahlen perfekt unten am Displayrand, alles mit Luft". Beides ist
umgesetzt, alles unter `sm`; ab 640 px steht der Kopfbereich unverändert
(gemessen 796 / 813 / 751 / 900 px bei 640, 768, Querformat und 1512 – wie
vorher).

**Text:**

- **Die Auszeichnungszeile steht nicht mehr über der Überschrift, sondern
  über den Sternen** – und dort nur noch als „Generalüberholt". Der
  Kopfbereich beginnt damit mit dem Satz, für den die Seite gefunden werden
  soll. „· Neuenstadt" fällt am Telefon weg: über den Sternen wäre der Ort
  eine zweite Herkunft neben „Rezensionen bei Google". Er steht weiterhin im
  Seitentitel, in `Region` und im Fußbereich.
- **Der Lead ist am Telefon weg.** Vier Zeilen Fließtext zwischen Überschrift
  und Beleg waren dort der längste Block und lagen genau auf dem Roller. Was
  er sagt, sagt die Seite unmittelbar darunter noch einmal: die Prüfung im
  Kennzahlenband, die Werkstatt in den Säulen, die Region in `Region`.
- **Die H1 beginnt dadurch bei 148 statt 194 px** (390 px Breite). Reiner
  Wegfall, kein neuer Wert: `--hero-head` ist unverändert.

**Höhe – die Sektion ist genau ein Bildschirm:**

- **`min-h-svh` und `flex-1` gelten jetzt auch am Telefon** (`sm:min-h-0
  lg:min-h-svh` bzw. `sm:flex-initial lg:flex-1`), bisher nur ab `lg`. Ohne
  das war der Kopfbereich nach dem Textabbau 561 von 844 px hoch: Man kam auf
  die Seite und sah sofort das Silber der nächsten Sektion. Gemessen sitzt
  die Unterkante der Sektion jetzt bei 780 (360), 844 (390), 915 (412) und
  932 px (430) – also exakt auf der Fensterkante, das Kennzahlenband mit
  seinen 40 px Auslauf davor. **Nicht ab `sm` einschalten:** Bei 640 × 900
  und 768 × 1024 wächst dort nur die Bühne nicht mit, und zwischen Beleg und
  Band stünden 104 bzw. 211 px leere Tinte.
- **Bei 320 × 568 geht es nicht auf** (Inhalt 627 px). Dort läuft die H1 über
  vier Zeilen; die letzte Kennzahlenreihe steht unter der Falz. Das ist die
  einzige gemessene Breite, auf der das so ist.
- **Die Bühne füllt die Bildzone** (`top-0 bottom-0` statt fester Höhe, ab
  `sm` wieder 26 rem). Die freie Höhe bekommt damit die Aufnahme und nicht
  ein Loch: Bei 390 px ist die Bühne 644 statt 416 px hoch, die Bildfläche
  580 statt 352. Der Roller steht vollständig im Bild, mit Reifen, Trittfläche
  und Werkstattboden. Der Ausschnitt wird dabei schmaler (42 % der Bildbreite
  statt 59) – das ist der Preis und er ist richtig herum bezahlt.

**Verlauf:**

- **Der Verlauf ist eine eigene Klasse** (`.hero-stage-scrim`) aus zwei
  Ebenen, keine Tailwind-Angabe mehr.
- **Seine Stopps stehen in Längen, nicht in Prozent.** Die Bühne ist je nach
  Fensterhöhe 410 bis 730 px hoch, die Überschrift beginnt aber immer bei
  `--hero-head` – in Prozent gerechnet wandert die dichte Kante unter der
  Überschrift weg. Genau das war beim ersten Versuch passiert: Hinter der
  ersten Zeile lag die Leuchtstoffröhre mit 35 % Tinte bei 186 von 255, Weiß
  darauf **1,9:1**.
- **Die erste Ebene ist der Schleier über dem Text**: 45 % oben, 6 % bei
  `--hero-head − 4rem` (das Fenster für den Lenker), 56 % an `--hero-head`,
  86 % ab `+5rem` und über die ganze Textstrecke bis `+17rem`, dann auf 8 %
  bei `+21rem`. Die 17 rem sind kein runder Wert: Bei 320 px läuft die H1
  vier Zeilen und der Beleg endet bei `--hero-head + 16,5 rem`.
- **Die zweite Ebene ist der Auslauf in die Tinte** (`transparent 68%` →
  Tinte). Sie hängt an der Höhe der Bühne, weil der Übergang ins
  Kennzahlenband keine Kante haben darf – gleich wie hoch das Fenster ist.
  Auf einem kurzen Telefon überlagert sie den Schleier und hält die Aufnahme
  unter dem Text dunkel; dort ist ohnehin kein Platz für ein zweites Fenster.
- **Gemessen unter den Zeilenkästen** (Text ausgeblendet, hellster Punkt):
  Überschrift 8,3 / 6,0 / 6,6 / 5,2:1 bei 320 / 360 / 390 / 430 px, jede
  Kleinschrift über 15:1.
- **`--hero-head` ist das eine Token für den oberen Rand des Kopfbereichs.**
  Es steht am Satzspiegel *und* im Verlauf. Zwei getrennte Werte laufen beim
  ersten Eingriff an einem von beiden auseinander, und das sieht man erst als
  Kontrastfehler.

**KI-Marke:**

- **Sie steht in der unteren rechten Ecke der Aufnahme** (`bottom-6`, ab
  `sm` wieder oben rechts) – auf Höhe des Werkstattbodens unter dem
  Hinterrad. Am Boden der *Bühne* wäre sie es nicht: Die Bühne reicht bis zum
  Kennzahlenband, und die Marke stand dort zwischen „169,99 €" und „500+".
- **Unter 360 px steht sie höher** (`bottom-[25%]`, Umschaltpunkt
  `min-[360px]`). Bei 320 px liegt die Unterkante der Bühne nur 24 px unter
  der Zeile „37 Rezensionen bei Google", und deren Text endet 7 px vor der
  Marke – beides stünde nebeneinander auf einer Zeile. Auf 25 % liegt sie
  zwischen Überschrift und Auszeichnung und ist frei.
- **Nicht schwächer und nicht unter das Bild.** Sie muss auf der Aufnahme
  liegen – die Begründung steht unter „KI-Kennzeichnung".
- **Das Kennzahlenband steht am Telefon mittig** (`text-center sm:text-left
  lg:text-center`). Zwei linksbündige Spalten hatten rechts von „13" und
  „169,99 €" einen jeweils anderen Rest, und die ganze Reihe hing sichtbar an
  der linken Kante. Der frühere Einwand gegen Zentrierung – Flattersatz über
  drei Zeilen – gilt unter `sm` nicht mehr, weil dort die Kurzform (`short`)
  steht und die einzeilig ist. Zwischen `sm` und `lg` bleibt es linksbündig:
  Dort steht die lange Beschriftung über zwei bis drei Zeilen.

## Untere Aktionsleiste nach Route — 12.09.2026

Aus einem externen Review. Die Leiste trug auf jeder Route dieselben zwei
Knöpfe, „Anrufen" und „Anfrage" – auf der Startseite dieselbe Aussage wie auf
/recycling. Jetzt trägt sie links den Telefonknopf als Symbol (48 px) und
rechts die eine Aktion, die auf dieser Seite dran ist: Startseite „Bestand
ansehen" (`/e-scooter#bestand`), /e-scooter „Suchauftrag stellen", /reparatur
„Reparatur anfragen", /wartungsvertrag „Vertrag anfragen", /versicherung
„Kennzeichen anfragen", /recycling „Altgerät anmelden", sonst „Anfrage
senden".

- **Auf /kontakt gibt es keinen Anfrage-Knopf**, sondern „Anrufen" im Vollton
  und „Route" im Umriss (`site.mapsUrl`). Das Formular steht auf derselben
  Seite; ein Knopf, der auf den Abschnitt darunter zeigt, ist dort kein Weg.
- **Auf der Geräteseite steht links der Preis statt des Telefonknopfs.** Er ist
  die Angabe, wegen der man auf dieser Seite zurückscrollt; die Nummer trägt
  unter `lg` ohnehin der Symbolknopf in der Kopfzeile. Das Modell reist wie im
  Kopfbereich in der Adresse mit (`?anliegen=geraet&geraet=…`).
- **Modell und Preis kommen als Eigenschaft aus dem Layout**, nicht aus einem
  Import von `lib/inventory` im Client-Bauteil: Das Modul trägt Bilder,
  Datenblätter und alle Beschreibungstexte. So sind es dreizehn Paare aus zwei
  Zeichenketten.
- **Nicht gebaut, weil es die Bedienung nicht gibt:** „Filter" auf /e-scooter
  (die Seite hat keine Filterung) und „gewählter Tarif" auf /wartungsvertrag
  (die Tarifkarten sind keine Auswahl, es gibt keinen Zustand zu lesen).
- Gemessen über zwölf Routen × dreizehn Breiten (320 – 1512 px): kein
  Überlauf, keine Konsolenfehler, jede Fläche 48 px, keine Beschriftung
  abgeschnitten (engster Fall 320 px: „Kennzeichen anfragen" in 212 px).
- **Die ausgefahrene Leiste geht über `visibility`, nicht über
  `pointer-events-none`.** Mit `opacity-0` allein war sie unsichtbar und nicht
  antippbar, stand aber weiter in der Tabreihenfolge – gemessen nahm der erste
  Knopf `focus()` an. Wer oben auf einer Seite tabbt, landete auf zwei
  Schaltflächen, die niemand sieht. `visibility` muss dafür in der
  Übergangsliste stehen, sonst springt die Leiste statt zu laufen. Dieselbe
  Lösung wie am Menü im Seitenkopf.
- **Zoom bleibt gesperrt.** Das Review verlangt die Freigabe. Die Sperre steht
  seit dem 05.09.2026 auf Ansage des Betreibers und wurde am 13.09.2026 nach
  Vorlage des Reviews ausdrücklich bestätigt. Wer sie das nächste Mal
  aufgeschrieben findet, hat sie zum zweiten Mal gefunden – sie ist kein
  Versehen. Siehe „Telefon-Durchgang".

## Externes Review Astra 6, Prompts 3–6 — 14.09.2026

Auf Ansage („mach mal alles was das Feedback sagt und dann schauen wir")
umgesetzt.

> **Der Kopfbereich ist am 14.09.2026 wieder zurückgedreht** — Ansage: „der
> hero sieht scheiße aus auf dem handy". Es gilt wieder die Fassung vom
> 06.09.2026 (Roller über die volle Bühne, Text darauf, Kennzahlenband an der
> Displaykante; gemessen 844 von 844 px bei 390 px Breite). Der folgende
> Abschnitt „Kopfbereich am Telefon neu" beschreibt damit **nicht** den
> aktuellen Stand, sondern nur, was verworfen wurde. Beide Fassungen liegen
> unter `.backup/vor-astra-feedback/`. Die einzige Änderung gegenüber dem
> Stand von HEAD ist der Import: `productFacts()` statt `inventoryFacts()`.

**Kopfbereich am Telefon neu (Prompt 3, nur unter `sm`) — verworfen, siehe
oben:**

- **Der Text steht nicht mehr auf der Aufnahme, sondern darunter.** Die Bühne
  ist eine Fläche im Fluss (`h-[max(42svh,min(46vw,18rem))]`), darunter auf
  reiner Tinte: Auszeichnung, H1, ein zweizeiliges Nutzenversprechen, der
  Vollton-Knopf „E-Scooter ansehen", der Textweg „Reparatur anfragen" und der
  Google-Beleg. Damit hängt kein Textkontrast mehr an einem Bildinhalt.
- **Die Bildfläche beginnt 4 rem *über* der Bühne** (`-top-16`), nicht mehr
  4 rem darunter. Bei 42 % Höhe skaliert `object-cover` über die Höhe; ohne
  den Zug nach oben stand der Roller klein in der Mitte und die dunkle Decke
  füllte das obere Drittel. Dafür läuft der Lenker wieder in die Kopfzeile —
  der Verlauf hält dort jetzt 78 % Tinte bis `--header-h`.
- **Das Kennzahlenband steht unter der Falz.** Die Bildzone trägt am Telefon
  `min-h-svh`, das Band ist ihr Nachbar. Gemessen 390 × 844: Bühne 380,
  Beleg endet bei 740, Band ab 844.
- **Bei 320 × 568 geht es nicht auf** (Beleg endet bei 723). Dort läuft die H1
  über vier Zeilen. Einzige geprüfte Breite, auf der das so ist.

**Startseite (Prompt 4):** Reihenfolge jetzt Hero → Kennzahlen → Bestand →
Werkstatt → Säulen → Kundenstimmen → Region → FAQ → Abschluss. Gedreht wurde
nur ein Paar: Die Kundenstimmen stehen hinter den drei Wegen statt davor.

- **Drei Dopplungen sind am Telefon weg:** das Kennzahlenband im
  `inventory-teaser` (wortgleich mit dem im Kopfbereich), drei der sechs
  Checkup-Positionen samt Bearbeitungszeiten (stehen vollständig auf
  `/reparatur`, `/e-scooter` und jeder Geräteseite) und zwei der fünf FAQ
  (`mobileMax` an `FaqSection`; die übrigen bleiben im Dokument, weil sie zum
  Schema gehören, und stehen nur nicht im Weg).
- **Zwei neue Wischbahnen** nach dem Bauplan der Kundenstimmen: die drei
  Geräte im Teaser und die drei Säulen. Kein `tabIndex` an der Säulenbahn —
  die Kacheln sind selbst Verweise, ein zusätzlicher Halt wäre auf dem
  Schreibtisch einer zu viel.
- Seitenhöhe bei 390 px von 15,2 auf 11,8 Bildschirme.
- `#faq` gibt es jetzt auch auf `/e-scooter` und `/reparatur` — die Verweise
  unter der gekürzten FAQ zeigen dorthin.

**Bestandsseite (Prompt 5):**

- **Unter `sm` Zeilenkarten** (`InventoryCard layout="row"`): Bild 115 × 145
  links, rechts Modell, Preis, Zustand, Reichweite und ABE. Liste bei 390 px
  von rund 6000 auf 2397 px. Ab `sm` unverändert die quadratische Karte.
- **Raster `sm:grid-cols-2 lg:grid-cols-3`** statt `xl:grid-cols-3`.
- **`InventoryBrowser` ist ein Client-Bauteil, das keine Bestandsdaten
  bekommt.** Die Karten kommen fertig vom Server als `children`; der Filter
  erhält je Gerät drei Zahlen (`id`, Preis, Reichweite, ABE) und schaltet die
  Einträge über `hidden` und `order`. `lib/inventory` bleibt damit außerhalb
  des Browserbündels — dieselbe Regel wie bei der unteren Aktionsleiste.
- **Nur Filter mit echtem Feld:** Alle, Mit ABE (`streetLegal`), Bis 250 €
  (`priceValue`), Ab 30 km (`rangeKm()`, liest „bis N km" aus dem Datenblatt
  und liefert sonst `null`). **Nicht gebaut:** „Neu / Gebraucht geprüft" (es
  gibt kein Zustandsfeld) und die Zustände „reserviert" / „verkauft" (es gibt
  keinen Status; verkaufte Geräte werden aus der Liste genommen).
- **Filter und Sortierung stehen in der Adresse** (`?filter=`, `?sort=`,
  `router.replace` mit `scroll:false`). Zurück-Navigation gemessen.
- `useSearchParams` zwingt zu einer Suspense-Grenze, sonst bricht der
  statische Bau. Der Rückfall ist dieselbe Liste ohne Bedienelemente — also
  das, was auch ohne JavaScript steht. Die Bedienelemente selbst hängen an
  `useSyncExternalStore` statt an einem `setState` im Effekt (Lint-Regel
  `react-hooks/set-state-in-effect`).

**Geräteseite (Prompt 6):** Verfügbarkeit und Zustand stehen jetzt direkt
unter dem Preis. „Sofort verfügbar" ist keine neue Zusage, sondern die Regel
der Liste; der Zustand kommt aus dem Datenblatt und steht nur da, wo er dort
steht. **Die Galerie wurde nicht umgebaut** — Wischen (Pointer-Events, nur
`pointerType !== "mouse"`), Pfeile, Vorschaubilder und Pfeiltasten halten
Zustand, Beschriftung und Vorschau gemessen synchron.

**Was aus dem Review nicht gebaut ist, und warum:**

- **„Reservieren" in der unteren Leiste.** Es gibt keinen Reservierungsweg;
  „Gerät anfragen" ist die Aktion, die es gibt. Eine Reservierung ist eine
  Zusage, kein Etikett.
- **„Neue & geprüfte gebrauchte E-Scooter" als Positionierung.** Kein
  Zustandsfeld, alle dreizehn Geräte sind gebraucht. Der Prompt sieht für
  diesen Fall selbst die wahrheitsgemäße Formulierung vor.
- **Verkaufte Geräteseiten mit deaktivierter Aktion.** Ohne Statusfeld gibt
  es keinen Zustand, den die Seite lesen könnte. Kommt mit Shopify.

## Roller im Kopfbereich auf langen Telefonen — 15.09.2026

Auf Ansage („positionier es besser", mit Aufnahme). Der Roller war auf einem
langen Fenster fast nicht zu sehen: nur ein senkrechter Streifen Werkstattwand,
der Lenker als Stange quer durch die Überschrift, das Vorderrad aus dem linken
Rand gefallen.

**Es war kein Positionsfehler, sondern ein Seitenverhältnis-Fehler.** Die
Bildfläche hing allein an der Bühne, und die füllt seit dem 06.09. den ganzen
ersten Bildschirm. Je länger das Fenster, desto schmaler und höher die Fläche —
und `object-cover` skaliert dann über die Höhe. Gemessen, wie viel Bildbreite
übrig blieb:

| Fenster | sichtbare Bildbreite (vorher) |
|---|---|
| 360 × 780 | 46 % |
| 390 × 844 | 42 % |
| 412 × 915 | 40 % |
| 440 × 1180 | **30 %** |
| 390 × 1200 | **26 %** |

Der Roller braucht **33,5 %** der Bildbreite (Vorderrad bei 49 %, Hinterrad bei
82,5 % — am Original 2400 × 1507 abgelesen). Unter 34 % passt er nicht mehr
hinein, ganz gleich, wohin man `object-position` setzt. Bei 82 % fiel genau
sein Vorderrad heraus.

- **Die Bildfläche ist auf `157vw` gedeckelt** (2400 / 1507 / 0,40) und hängt
  **unten** (`bottom-0` plus Höhe statt `top-16 bottom-0`). Damit bleiben
  überall mindestens 40 % Bildbreite stehen, der Roller steht weiter auf dem
  Boden der Bühne, und die gewonnene Strecke wird oben zu Tinte — genau dort,
  wo Überschrift und Beleg ohnehin einen dichten Grund brauchen. Gemessen
  390 × 844 unverändert 580 px, 440 × 1180 jetzt 691 statt 914.
- **Der Ausschnitt liegt bei 74 % statt 82 %.** Über die ganze Spanne von 40
  bis 46 % sichtbarer Breite liegt die Mitte des Sichtfensters damit bei 0,63
  bis 0,64; der Roller (0,49 – 0,825) hat auf beiden Seiten Luft, statt an
  einer Kante zu kleben.
- **Nicht über die Bühne gelöst.** An ihr hängen `.hero-stage-scrim` und der
  Auslauf ins Kennzahlenband, und deren Stopps tragen die gemessenen
  Kontraste. Dieselbe Regel wie am 06.09.
- **Kontraste nachgemessen** (Text und Kopfzeile ausgeblendet, hellster Punkt
  im Zeilenkasten): H1 mindestens 4,8:1 (412 × 915), auf den langen Fenstern
  19,8:1, weil die Überschrift dort auf reiner Tinte steht. Beleg überall über
  17:1. Die Sektion endet weiterhin exakt an der Fensterkante — 780 / 844 /
  915 / 932 / 1180 / 1200 px —, am Schreibtisch unverändert 900 bei 1512.
- **320 × 568 bleibt die Ausnahme** wie bisher: Dort läuft die H1 über vier
  Zeilen, die Bühne ist nur 346 px hoch und zeigt einen waagerechten Ausschnitt.

## Externes Review Astra 6, Prompts 8–11 — 14.09.2026

Der ganze Durchgang steht als Messprotokoll in **`QA.md`** im Projektstamm —
Routen, Breiten, Befunde, offene Punkte. Hier nur, was als Entscheidung
bleibt.

**Formulare (Prompt 8).** Der Aufbau war schon der geforderte: eine Server
Action, serverseitige Prüfung, Honeypot, Drosselung, ehrlicher Rückfall statt
stiller Erfolgsmeldung. Zwei echte Löcher waren trotzdem drin:

- **Die Fehlerzusammenfassung sprang, ohne den Fokus mitzunehmen.** Ihre
  Einträge waren Rautenverweise, und `ScrollManager` fängt jeden Verweis auf
  dieselbe Seite in der Einfangphase ab (`preventDefault`), um die *Sektion*
  sauber unter die Kopfzeile zu setzen. Für ein Formularfeld nimmt das genau
  das weg, wofür die Zusammenfassung da ist. Jetzt Knöpfe, die selbst
  scrollen und fokussieren.
- **Ein Verbindungsabbruch beim Absenden ersetzte die ganze Seite.** Gemessen:
  Wird die Verbindung während des Absendens getrennt, scheitert der Aufruf im
  Browser mit „TypeError: Failed to fetch" — *vor* dem Server, `submitInquiry`
  läuft nie und kann es nicht abfangen. Die Ausnahme stieg bis zur
  Fehlergrenze von Next durch, und die zeigte einen englischen Knopf
  „Reload": Formular weg, Eingaben weg, Telefonnummer weg. Jetzt fängt
  `SubmitBoundary` im Formular selbst ab und zeigt Nummer und E-Mail.
  **Kein `try/catch` um die Aktion:** `useActionState` behält die
  Fortschreibung ohne JavaScript nur, solange ihm die Server Action
  unmittelbar übergeben wird — eine Client-Funktion drumherum nähme dem
  Formular die verborgenen `$ACTION_*`-Felder. Der Versand ohne JavaScript
  ist mit einem rohen POST geprüft und funktioniert.
- Dazu Längengrenzen am Feld, die denen des Servers entsprechen.
- **Nicht geändert:** `inputmode`. `type="email"` und `type="tel"` setzen die
  Tastatur bereits; ein zweites Attribut mit derselben Aussage ist eine
  Stelle mehr, die auseinanderlaufen kann.
- **Bekannte Grenze:** `?anliegen=` und `?geraet=` werden im Browser aus der
  Adresszeile gelesen. Ohne JavaScript kommt die Vorbelegung nicht an. Die
  Alternative wäre, `/kontakt` bei jedem Aufruf serverseitig zu rendern.

**Verkaufsweg (Prompt 9).** Neu `lib/commerce.ts`, `lib/commerce-source.ts`,
`lib/commerce-shopify.ts`.

- **Der Modus wird geprüft, nicht geglaubt.** `COMMERCE_MODE` kennt `catalog`,
  `reservation` und `checkout`; `commerceMode()` gibt `checkout` nur zurück,
  wenn Storefront-Domain *und* Token wirklich gesetzt sind, und `reservation`
  gar nicht, weil es keinen Speicher für diesen Zustand gibt. Gemessen:
  `COMMERCE_MODE=checkout npm run build` fällt auf `catalog` zurück und
  schreibt eine Zeile ins Protokoll. Es gibt keinen Zustand, in dem ein
  Kaufknopf ohne Kaufweg steht.
- **`InventoryItem` hat ein Feld `availability`**, und alle dreizehn Einträge
  lassen es leer — `availabilityOf()` liefert dann „available", was die
  Pflegeregel der Datei ist (verkaufte Geräte werden gelöscht). Das Feld
  existiert trotzdem, weil die Oberfläche „reserviert" und „verkauft"
  darstellen können muss, **bevor** Shopify sie liefert. Sonst wäre der
  Anschluss nicht das Füllen eines Feldes, sondern ein zweiter Umbau von
  Karte, Geräteseite, Aktionsleiste und Schema. Mit je einem versuchsweise
  gesetzten Gerät geprüft: Zeile unter dem Preis, Plakette auf der Karte,
  abgeschaltete Aktion samt Verweis auf Vergleichbares, `OutOfStock` bzw.
  `SoldOut` im Schema — und die Geräteseite bleibt erreichbar.
- **`deviceAction()` ist die eine Stelle für Beschriftung und Ziel.** Kopf der
  Geräteseite und untere Aktionsleiste lesen dieselbe Funktion; zwei Knöpfe
  mit getrennter Beschriftung laufen beim ersten Eingriff auseinander.
- **`lib/commerce-source.ts` ist die einzige Stelle, an der die Seite ihre
  Ware herbekommt.** Sitemap, Layout, Bestandsseite, Geräteseite, Teaser,
  Kopfbereich und Schema lesen nicht mehr `lib/inventory` unmittelbar. Der
  Rückgabetyp ist der Vertrag: Wer eine zweite Quelle baut, erfüllt ihn,
  statt die Oberfläche zu ändern.
- **Kein Adapter, der etwas vortäuscht.** `lib/commerce-shopify.ts` enthält
  Typen, Fehlerfälle, den einen Netzaufruf und die fünf Voraussetzungen, die
  fehlen — darunter eine, die keine Codefrage ist: ob über die Website
  überhaupt gekauft werden soll. Bei Einzelstücken mit Differenzbesteuerung
  hängen Rechnungslegung, Widerruf und Versand daran.

**Bewegung (Prompt 10).** Der Bestand war in Ordnung — Laufband schon
anhaltbar und bei reduzierter Bewegung aus, Kundenstimmen am Telefon schon
eine Wischbahn, kein großflächiger `backdrop-filter` (die Kopfzeile ist seit
dem Flacker-Befund deckend). Geändert wurden zwei Dinge, beide nur unter
768 px:

- **Die Bildfahrt (`.parallax`) gilt erst ab 48 rem.** Sie skaliert auf 110 %
  und schiebt über den ganzen Scrollweg; am Telefon ist der sichtbare Ertrag
  rund 7 % Bildhöhe, bezahlt mit einer Compositor-Ebene je Bild über die
  volle Seitenlänge. Gemessen 390 px: aktive Bildfahrten 1 → **0**, bei
  1512 px unverändert 1.
- **`--reveal-scale` skaliert alle Staffelungen.** Der Faktor hängt an der
  Rechnung in `.reveal`, nicht am einzelnen Wert — unter 768 px 0,4. Die
  Choreografie des Kopfbereichs bleibt in ihrer Reihenfolge und wird nur
  schneller abgespielt (0/90/300/400/500 → 0/36/120/160/200 ms). Gemessen
  längste Staffelung am Telefon 220 → **88 ms**, am Schreibtisch unverändert.
- **Was nicht messbar besser wurde, wird auch nicht so verkauft:** LCP, CLS
  und die längste Aufgabe sind vorher wie nachher gleich (Zahlen in `QA.md`).
  Wer hier das nächste Mal Bewegung reduziert, sollte das wissen — der Gewinn
  liegt in der Wartezeit auf die dritte Kachel, nicht in einer Kennzahl.

**Prüfung (Prompt 11).**

- **130 Prüfungen** (13 Routen × 10 Breiten, 320 – 1440 px plus Querformat):
  kein Überlauf, keine Kleinstschrift, keine Zielfläche unter 44 px, keine
  Konsolenfehler. Genau eine H1 je Route, kein übersprungener
  Überschriftengrad, kein Bild ohne `alt`.
- **`VERCEL_ENV` muss beim Bauen gesetzt sein, nicht beim Starten.** Alle
  Seiten sind statisch vorgebaut; ein zur Laufzeit gesetztes
  `VERCEL_ENV=preview` ändert an der ausgelieferten Datei nichts. Gemessen:
  mit `VERCEL_ENV=preview npm run build` trägt `robots.txt` `Disallow: /` und
  jede Seite `noindex, nofollow`, ohne die Variable das Gegenteil. Auf Vercel
  ist das der Normalfall, lokal eine Stolperstelle.
- **Der Bestandsfilter benutzt jetzt `push` statt `replace`.** Mit `replace`
  überschrieb jeder Filterklick den einzigen Verlaufseintrag; gemessen führte
  der Zurück-Knopf nach zwei Filtern von der Bestandsseite **weg** statt
  einen Schritt zurück. Auf dem Telefon ist Zurück die Hauptgeste. Jetzt
  13 → 11 → 8 → 11 → 13.
- **Die Startseite trägt einen `FAQPage`-Knoten.** Sie hatte als einzige eine
  sichtbare FAQ ohne Schema. Alle fünf Fragen stehen im Dokument; `mobileMax`
  blendet zwei am Telefon nur aus — genau dafür war die Entscheidung so
  getroffen worden.
- **Zoom bleibt gesperrt** und ist zum dritten Mal aufgeschrieben worden. Sie
  ist kein Versehen, siehe „Telefon-Durchgang" und „Untere Aktionsleiste".
- **`next` 16.3.4 → 16.3.5** plus `npm audit fix` wegen der nanoid-Meldung
  GHSA-2v37-7h3g-55p8 (über postcss in der Toolchain). `npm audit --omit=dev`
  ist danach leer. **Achtung beim Nacharbeiten:** `npm audit fix --omit=dev`
  räumt die Entwicklungsabhängigkeiten aus `node_modules`; danach `npm install`
  ohne `--omit`, sonst fehlt `tsc`.

## Bestandskarten gleich groß — 15.09.2026

Auf Ansage („schau, dass die alle gleich groß sind"). Es waren zwei Fehler
übereinander, beide gemessen bei 640 – 1512 px:

- **Die Karten waren verschieden breit.** Der Listeneintrag auf `/e-scooter`
  ist `<li className="flex">`, die Karte darin ein Flex-Kind ohne
  Breitenangabe – und das wird so breit wie sein Inhalt. Bei 1512 px stand
  eine Karte mit kurzem Modellnamen 338 px breit in einer 456 px breiten
  Spalte, mitsamt entsprechend kleinerem Quadratbild (304 statt 422 px).
  Daher waren sie auch verschieden hoch. Die Karte trägt jetzt `w-full`.
- **Jede Rasterreihe hatte ihre eigene Höhe.** Innerhalb einer Reihe sind
  Rasterzellen gleich hoch, von Reihe zu Reihe nicht: 614 / 662 / 638 px bei
  1512. Die Reihe mit den beiden Geräten ohne ABE trägt die ausgeschriebene
  Warnung, eine andere einen zweizeiligen Modellnamen. Alle drei Raster
  (Bestandsseite, Startseiten-Teaser, „Passt dazu" auf der Geräteseite)
  tragen jetzt `auto-rows-fr`. Die gewonnene Strecke fällt über das
  vorhandene `mt-auto` vor die Zeile „Mehr Daten" – also zwischen Inhalt und
  Abschluss, nicht in den Text.
- **Der Modellname hat zwei Zeilen Platz** (`min-h-[2lh]` an der H3). Drei
  von dreizehn Namen laufen zweizeilig; ohne festen Kasten begann die
  Kennwertzeile bei diesen Karten 24 px tiefer als bei den Nachbarn. `lh`
  ist die Zeilenhöhe des Elements; kennt ein Browser die Einheit nicht,
  fällt die Angabe weg.

Gemessen danach: gleiche Breite **und** gleiche Höhe auf 390, 640, 768,
1024, 1280 und 1512 px, auf allen drei Rastern. Kein Überlauf, keine
Konsolenfehler. Preis am Telefon: Die Zeilenkarten sind 193 statt 171 px
hoch, die Liste wächst um rund 250 px.

## Bahnen und Bewegung am Telefon — 15.09.2026

Auf Ansage, in dieser Reihenfolge entschieden:

- **Die Kundenstimmen laufen wieder auf jeder Breite von allein.** Die
  Wischbahn vom 06.09. ist weg, es gilt wieder das Laufband („mach die
  bewertungen wie davor, also dass sie sich von alleine bewegen"). Der
  Einwand von damals bleibt bestehen und ist bewusst getragen: Bei 390 px
  ist die Karte 304 px breit, es steht also eine und ein Drittel im Bild.
  Die Ausblendbreite am Telefon bleibt bei 2 rem.
- **Die drei Säulen stehen am Telefon wieder untereinander,** nicht als
  Wischbahn. `pillars.tsx` ist damit wieder auf dem Stand vor dem Review.
- **Die Wischbahn der Geräte im Teaser bleibt.** Sie war kurz
  zurückgenommen und auf Ansage sofort wieder hergestellt.
- **Die Wortmarke in der Kopfzeile führt auf der Startseite nach oben.**
  Gemessen: Wer auf `/` 4000 px tief stand und auf das Logo tippte, blieb
  bei 4000 px — der Verweis zeigt auf die Adresse, auf der man schon ist.
  Jetzt weicher Sprung auf 0, bei `prefers-reduced-motion` hart. Der Sprung
  wartet über `requestAnimationFrame`, bis die Scrollsperre des Telefonmenüs
  gelöst ist; dieselbe Regel wie bei den Raute-Verweisen im `ScrollManager`.

## Feinschliff Telefon und Tablet — 16.09.2026

Auftrag: verbleibende Darstellungs- und Bedienfehler prüfen und beheben, ohne
Hero, Referenzen, Leistungen und Zoom-Sperre anzutasten. Gemessen über zwölf
Routen × sieben Formaten (320, 390, 430, 768, 1024, 1440 und 844 × 390).

**Was wirklich falsch war:**

- **Die Prüfliste der Geräteseite brach zeilenweise um.** Die längste
  Position („Akku-Diagnose mit Kapazitätsmessung") ist im Grundschriftgrad
  315 px breit; zweispaltig blieben davon 227 px (640), 275 px (768) und
  188 px (1024). Jetzt eine Spalte bis 1439 px, zwei ab 1440 (380 px je
  Spalte), unter `sm` ein Grad kleiner und engere Pille. **320 px bleibt die
  Ausnahme** – dort stehen 222 px Satz zur Verfügung, eine Zeile ginge erst
  bei 12 px.
- **Die Tariftabelle war unter 768 px keine Tabelle mehr.** Bei 320 px stand
  der Kopf 111 px hoch („HAFT-PFLICHT" über vier Zeilen), jede Datenzeile
  113 px, Spalten von 118 / 84 / 70 px. Unter `md` jetzt Karten aus
  **denselben Daten**: Zeitraum, beide Preise nebeneinander, Verweis ins
  Formular. Die Position der Zeile reist als `?zeitraum=` mit, das Formular
  schreibt daraus den Zeitraum ins Nachrichtenfeld – Wortlaut aus der
  Tabelle, nicht aus der Adresse, damit aus einer manipulierten Adresse kein
  erfundener Zeitraum in eine Anfrage wandert.
- **Die Zustandszeile der Bestandskarte war abgeschnitten.** `line-clamp-1`
  schnitt zehn von dreizehn Angaben mitten im Satz ab („Gebraucht,
  vollständig…"). Seit alle Karten eines Rasters gleich hoch sind, kostet
  die zweite Zeile nichts.
- **Das Formular der Vertragsseite stand fest auf „Basis".** Wer von der
  Premium-Karte kam, fand unten den anderen Vertrag.
- **`?anliegen=` überlebte den Rautensprung nicht.** `ScrollManager` schrieb
  beim Abfangen eines Verweises auf dieselbe Seite nur `url.hash` – die
  Auswahl war aus der Adresse verschwunden, bevor ein Bauteil sie lesen
  konnte. Jetzt bleibt die Abfrage stehen (und die vorhandene erhalten, wenn
  der Verweis selbst keine trägt), dazu ein Ereignis `skope:urlchange`:
  `pushState` löst kein `popstate` aus, ohne das Signal merkt kein Bauteil
  die Änderung.
- **`Number(null)` ist 0.** Die erste Fassung der Zeitraum-Vorbelegung schrieb
  auf jeder Seite ohne `?zeitraum=` die erste Tabellenzeile ins
  Nachrichtenfeld.

**Die Tarifwahl ist jetzt ein Zustand, und zwar genau einer:**
`?anliegen=wartungsvertrag-basis|premium` in der Adresse. Karte („Premium
gewählt – zur Anfrage"), Zeile über dem Formular (Name + Beitrag),
Auswahlfeld des Formulars und die untere Aktionsleiste (Name links, Beitrag
darunter, Knopf „Anfragen") lesen denselben Wert über `lib/url-state.ts`.
Ohne Wahl bleibt alles neutral und das Anliegen ein Pflichtfeld. Der frühere
Eintrag „nicht gebaut, weil es die Bedienung nicht gibt" ist damit erledigt –
die Karten *sind* jetzt eine Auswahl. Der Knopf heißt nur „Anfragen": Mit
„Basis anfragen" schnitt die Beschriftung bei 320 px ab (134 px), und der
Name steht ohnehin links daneben.

**Die untere Aktionsleiste verschwindet, während getippt wird.** Auf dem
Telefon schiebt die Bildschirmtastatur den sichtbaren Bereich auf etwa die
halbe Höhe; in iOS Safari bleibt eine feste Leiste am unteren Rand des
Layout-Fensters stehen und liegt damit über Feld oder Absendeknopf. Ausgelöst
über `focusin`/`focusout` innerhalb eines `<form>`. **Nicht mit echter
Tastatur geprüft** – im Prüfbrowser lässt sie sich nicht öffnen.

**Geprüft und in Ordnung, nichts geändert:** Filter, Sortierung und
Zurück-Navigation der Bestandsseite (13 → 11 → 8 → 6 und über drei
Zurück-Schritte zurück, Live-Region meldet „x von 13"), Beschriftung der
Sortierung, Formularprüfung (vier Fehler, Zusammenfassung, `aria-invalid`),
Doppelklick-Schutz über `disabled={pending}`, Galerie (Mauswisch tut
bewusst nichts), Scrollverhalten bei vierfach gedrosselter CPU (CLS 0,
höchstens zwei lange Aufgaben, längste 56 ms).

**Offen und nicht erfindbar:** Der Formularversand ist auf diesem Server
nicht eingerichtet (`RESEND_API_KEY`, `INQUIRY_FROM`); das Formular zeigt
statt einer Erfolgsmeldung Telefonnummer und E-Mail-Adresse – geprüft, keine
stille Verwerfung. Ein Verfügbarkeitsstatus je Gerät steht in den Daten
nicht: `availability` ist bei allen dreizehn leer, die Plakette für
„reserviert" und „verkauft" liegt bereit.

## Telefonknöpfe — 03.09.2026

Auf Ansage entfernt: der Neon-Telefonknopf im Abschlussband (`CtaBand`, alle
Seiten) und der im Kopf von `/kontakt`. Beide wiederholten, was die
Kopfzeile ab 1280 px, der Symbolknopf darunter und die untere Aktionsleiste
am Telefon dauerhaft tragen. Im Band trägt „Anfrage senden" jetzt den
Vollton – ein Umrissknopf allein ist keine Hauptaktion. Die Telefonknöpfe
auf `/e-scooter`, der Geräteseite und der 404 stehen noch; dort sind sie
nicht die Wiederholung einer Aktion daneben.

## Das Mausrad — 02.09.2026, zurückgenommen am selben Tag

Es gab für einen Nachmittag `components/motion/smooth-scroll.tsx`: Das Rad
wurde abgefangen und die Strecke exponentiell angenähert, weil ein Rad in
100-px-Rasten springt. **Das ist wieder weg**, und zwar aus einem gemessenen
Grund, nicht aus Geschmack: Die Erkennung „Rad oder Trackpad" (ganzzahliger
Ausschlag ab 40 px, kein dichter Strom) kippte bei der Maus des Betreibers
von Ereignis zu Ereignis. Die Hälfte der Rasten lief nativ, die andere
Hälfte über die Annäherung mit aufsummiertem Ziel – „manchmal muss ich
mehrmals scrollen, manchmal fliege ich über die ganze Seite". Ein
Scroll-Ersatz, den man nicht auf jedem Eingabegerät des Nutzers testen kann,
ist ein Fehler, den man nur beim Nutzer sieht. **Scrollen bleibt nativ.**
Wer die Rasten wieder glätten will, macht es mit einer Bibliothek, die auf
Rad *und* Trackpad denselben Weg nimmt, oder gar nicht.

## Seitenposition — 02.09.2026

`components/motion/scroll-manager.tsx`, im Layout vor dem Header. Zwei
Regeln, beide aus der Beschwerde „ich lande irgendwo mitten auf der Seite":

- **Ein Seitenwechsel beginnt oben.** Beim Wechsel des `pathname` steht die
  Position hart auf 0 (`useLayoutEffect`, `behavior: "instant"`), bevor der
  neue Inhalt gemalt ist. Next setzt sie zwar selbst, aber weich und auf das
  erste geänderte Segment – das ließ sich überholen. `html` trägt jetzt
  außerdem `data-scroll-behavior="smooth"`, womit Next die weiche Bewegung
  während eines Routenwechsels selbst abschaltet.
- **Ein Sprungziel steht ganz im Bild.** Jeder Verweis mit Raute auf
  derselben Seite (`#bestand`, `#anfrage`, `/#kundenstimmen` aus der
  Kopfzeile) und jeder Aufruf mit Raute von einer anderen Seite: Passt die
  Sektion unter die Kopfzeile, wird sie dort mittig gesetzt; ist sie höher
  als das Fenster, beginnt sie direkt unter der Kopfzeile (`--header-h`).
  In beiden Fällen ist von der Sektion darüber nichts zu sehen. Gemessen:
  Kundenstimmen bei 1512 × 900 → Oberkante 80 px, Bestand → 80 px,
  Navigation aus 1500 px Tiefe → 0.

- **Der Zuhörer für Raute-Verweise hängt in der Einfangphase — 06.09.2026.**
  `next/link` bricht seinen eigenen Klick nur ab, wenn `defaultPrevented`
  gesetzt ist. React hängt seine Zuhörer beim Aufhängen der Anwendung ans
  Dokument, also *vor* dem hier – in der Blasenphase lief der Verweis damit
  zuerst durch `Link`, wurde dort abgebrochen und an den Router
  weitergereicht, und für eine Adresse, die schon in der Zeile steht, tut der
  Router nichts. Gemessen auf `/kontakt` am Telefon: Der erste Druck auf
  „Anfrage" kam von der Startseite und lief über den Seitenwechsel – Formular
  bei 289 px. Nach oben gewischt und noch einmal gedrückt passierte nichts,
  die Seite blieb stehen und das Formular lag 1427 px tiefer. Betroffen war
  jeder Verweis mit Raute, der als `Link` gebaut ist. `stopPropagation` steht
  bewusst nicht dabei: Der Verweis soll weiter bei den Zuhörern ankommen, die
  an ihm selbst hängen – im Telefonmenü schließt einer davon die Tafel.

- **Aus dem offenen Telefonmenü wird erst gesprungen, wenn die Sperre
  gelöst ist — 06.09.2026.** Die Scrollsperre des Menüs hängt am `<body>`
  (`position: fixed`) und setzt die gemerkte Position beim Schließen zurück.
  Wer währenddessen springt, springt gegen eine festgestellte Seite und wird
  eine Lidschlagbreite später vom Rücksprung wieder eingesammelt; außerdem
  misst `getBoundingClientRect` dort den Abstand zur Fensterkante statt zum
  Dokumentanfang. Gemessen auf `/kontakt`: Menü auf, „Anfrage senden" – Tafel
  zu, Position 0, das Formular 1885 px tiefer. Der Sprung wartet jetzt in
  `requestAnimationFrame`, bis `position` nicht mehr `fixed` ist (Riegel bei
  zwanzig Bildern), und läuft ein Bild danach.

- **Der erste Aufruf eines Dokuments beginnt oben — 05.09.2026.** Der
  Effekt oben läuft beim Einhängen zwar mit, kommt aber zu früh: Der
  Browser stellt die gemerkte Position eines neu geladenen Dokuments erst um
  `load` herum wieder her. Am Telefon ist das der Regelfall, weil Safari die
  Seite neu aufbaut, sobald der Tab zwischendurch weg war — man kommt auf die
  Seite und steht mitten im Kopfbereich. `scrollRestoration` steht deshalb für
  die Dauer des Ladens auf `manual`, die Position wird dreimal gesetzt
  (Einhängen, nächster Frame, `load`) und danach steht `scrollRestoration`
  wieder auf dem alten Wert — Vor und Zurück im selben Dokument sollen weiter
  dort landen, wo man war. Der Anlauf nach `load` rechnet dieselbe Regel noch
  einmal statt stumpf auf 0 zu springen, sonst räumt er eine Adresse mit Raute
  von ihrem Ziel. Wischt der Nutzer während des Ladens schon selbst
  (`wheel`, `touchmove`, `keydown`), unterbleibt die Korrektur.

## Versicherungsseite — 02.09.2026

Neu komponiert, weil ab `lg` die rechte Hälfte auf der ganzen oberen Seite
leer war: Kopf, Tabelle mit Deckel bei 48 rem und die Schrittfolge liefen
alle als schmale Spalte an der linken Kante.

- **Kopf:** drei Kennzahlen (Haftpflicht Saison, Teilkasko, 5–10 Werktage
  Post) als **Zeile rechts neben dem Lead**, unten bündig – `PageHeader`
  nimmt dafür `asideClassName` (sechs Spalten statt vier). Erst standen sie
  als Turm rechts (335 px, „so wirkt der Hero zu groß"), dann als Zeile
  unter dem Lead (`below`-Slot, zu weit vom Text). Lead auf drei Zeilen
  gekürzt. Preise aus `tariffs[0]`. Nur ab `lg`.
- **Tarife:** Tabelle 7 Spalten ohne Deckel, rechts 5 Spalten eine
  Tinte-Karte „Abschluss direkt vor Ort" mit der Plakette, darunter der
  Aushang in voller Spaltenbreite mit Unterschrift. Eine 9-rem-Miniatur
  daneben war ein Versuch, der sofort zurückkam: „warum ist das so klein".
- **Ablauf:** Schritte 7 Spalten, rechts 5 Spalten die Karte „Diese Angaben
  brauchen wir", `sticky top-28`, Liste einspaltig.

## Bestandsseite, Kennzahlenband — 03.09.2026

Stückzahl, Preisspanne, Gewährleistung und Marken sind ein Band mit
Haarlinien (`border-y`), nicht drei lose Blöcke mit `gap-x-14` – die
standen bei 1512 px mit 900 px Luft in der Mitte. Mittlere Spalte `auto`,
weil die Preisspanne im Zahlengrad breiter ist als ein Drittel. Marken im
Untertitelgrad ohne Trennpunkte (am Telefon begann sonst die zweite Zeile
mit „·"), weiterhin keine Kapseln.

## Geräteseite am Schreibtisch — 03.09.2026

„Links, rechts, unten alles abgeschnitten": Bei 1512 × 860 war die Galerie
533 px breit und mit Vorschaureihe 830 px hoch, die H1 lief im
Seitentitelgrad zweizeilig, das Datenblatt begann unter der Falz. Jetzt
Bildspalte `min(30rem,48vh)`, H1 im Displaygrad (die einzige H2 der Seite
steht eine Sektion tiefer im Titelgrad), Abstände 4/4/6 statt 7/6/9,
Datenblatt ab `xl` dreispaltig mit `p-5`. Gemessen bei 1512 × 860: Galerie
samt Vorschaureihe, Modell, Preis, Aktionen und das ganze Datenblatt im
ersten Bild. Am Telefon ändert sich nichts.

## Reparaturkarten

Die vier Bereichskarten auf `/reparatur` tragen den Neonschimmer oben links
(`.tint-neon`). Er war am 02.09. als „dritte Fläche" entfernt und kam am
03.09. auf Ansage zurück – nicht wieder anfassen.

## Kundenstimmen

Das Laufband bleibt auf jeder Breite ab `sm` – ein Versuch, es ab `lg`
durch drei feste Karten zu ersetzen, wurde am 02.09.2026 auf Ansage
zurückgenommen. Am Telefon die Wischbahn.

**Am Telefon neu komponiert — 06.09.2026.** Der Block war bei 390 px 830 px
hoch, davon 397 Kopf; die Karte begann unter der Falz und war 361 px hoch.
Jetzt 733 px, Karte 307. Was dafür geändert wurde:

- **Kreis und Name stehen in einer Zeile**, nicht übereinander. Gestapelt
  waren unter fünf Zeilen Zitat drei Reihen Möbel – Kreis, Name, Quelle –,
  und die Karte las sich nach unten hin als Liste. Der Kreis ist auf der
  Achse `size-9` statt `size-11`, weil er dort neben dem Namen steht.
  Im Laufband bleibt alles wie es war.
- **Der Lead nennt die Zahl nicht mehr.** „3 von 37 Rezensionen aus dem
  Google-Profil" stand eine Zeile über „Alle 37 Rezensionen im
  Google-Profil" – dieselbe Zahl und dasselbe Wort zweimal untereinander.
  Die Zahl trägt der Verweis, der Lead nur noch die Herkunft.
- **Zeichen und Pfeil des Verweises stehen im Satz**, nicht als eigene
  Zellen daneben. Bei 320 px bricht die Zeile, und als Flex-Zellen hingen
  beide auf halber Höhe an den Kanten. „Google-Profil" bricht dort nicht
  am Bindestrich auf.
- **Kartenfüllung unter `sm` von `p-7` auf `p-6`**, Abstand vom Kopf zur
  Wischbahn von `mt-14` auf `mt-10`. Ab `sm` unverändert.

**Strich, Zitatzeichen, Bewegung — 06.09.2026.** Auf Ansage:

- **Kein Trennstrich über der Unterschrift auf der Achse** (`border-t-0`).
  Die Karte ist dort mittig gesetzt; die Linie zog quer durch eine
  Komposition, die ohnehin von der Mitte her gelesen wird. Am Schreibtisch
  bleibt sie: Dort steht die Unterschrift links unter einem linksbündigen
  Zitat, und die Linie ist die einzige Kante zwischen beiden.
- **Das goldene Anführungszeichen steht auch am Telefon**, neben der
  Sternreihe statt an der rechten Kante – die gibt es auf der Achse nicht.
  Die Zeile richtet sich an der Grundlinie aus (`items-end`), sonst hinge
  das Zeichen eine halbe Zeile unter den Sternen. Grad `text-4xl` statt
  `text-5xl`.
- **Die Sterne setzen sich einzeln** (`.star-cascade`, 80 ms Versatz).
  Ausgelöst vom `data-shown` des umgebenden `Reveal`, nicht von der
  Ladezeit: Die Animation steht auf `paused`, bis der Block im Bild ist.
  Zwei Rückfälle sind Pflicht, weil `both` sonst den Anfangszustand für
  immer hält – ohne JavaScript und bei reduzierter Bewegung steht
  `animation: none`. Gemessen: bei `reduce` alle Sterne auf Deckkraft 1.
- **Die Karte in der Mitte der Wischbahn ist die volle** (`.snap-focus`,
  `view(inline)`): Nachbarn auf 0,55 Deckkraft und 0,94 Größe. Nicht
  dunkler – bei 0,4 verschwand die halb sichtbare Nachbarkarte auf Silber
  ganz, und die Bahn sah aus wie eine einzelne Karte. Die Karte ist dafür
  `calc(100vw-4.5rem)` statt `-3rem` breit: Mit 342 px blieben nach der
  Skalierung 8 px Ausblick, und der war weg.

**Zwei Fallen, die dabei aufgeflogen sind — beide betrafen auch ältere
Bewegungen:**

- **`animation: name linear both` setzt die Dauer auf 0 s.** Auf einer
  Fortschritts-Zeitleiste (`animation-timeline: view()`) steht die
  Animation damit sofort auf ihrem Endbild und rührt sich nie. Betroffen
  waren `.parallax`, `.chain-draw` und `.seal-stamp` – seit sie gebaut
  wurden. `animation-duration: auto` muss als **eigene Zeile** dahinter
  stehen; im Kurzschreibweise-Slot ist `auto` kein gültiger Zeitwert.
- **Lightning CSS zieht `animation-range` falsch zusammen.**
  `entry 0% exit 100%` wird beim Bauen zu `entry exit 0%` – also Ende bei
  `exit 0%` statt `exit 100%`, und die Spanne liegt außerhalb des
  erreichbaren Scrollwegs. Die Langformen werden genauso zusammengezogen.
  Ausweg: Wo die Spanne dem Standard entspricht (`cover 0%` bis
  `cover 100%`), die Angabe **weglassen**; wo sie abweicht
  (`.seal-stamp`, `.chain-draw`), über eigene Eigenschaften gehen
  (`--range-start` / `--range-end` und `animation-range-start: var(…)`).
  Wer hier etwas ändert, prüft danach im Build:
  `grep -o "\.snap-focus{[^}]*}" .next/static/chunks/*.css`.

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
  **Das hat bis zum 21.08.2026 nichts bewirkt:** Beide Bildflächen trugen
  `aria-hidden`, und das nimmt den Bildknoten samt `alt` aus dem Baum — siehe
  „Handy-Qualitätsprüfung".
  Offen bleiben die positionsbeschreibenden Alt-Texte der importierten Geräte
  (siehe unten).

## Animations-Audit — 10.09.2026

Durchgang über jede Bewegung im Projekt: `globals.css`, `Reveal`, alle
`transition-*`-Angaben in den Bauteilen. Gefunden wurden keine kaputten
Animationen, sondern ein fehlendes System — jede Stelle war für sich richtig
gebaut und keine sprach dieselbe Sprache wie die nächste.

**Was auseinanderlief:**

- **Dieselbe Kurve in vier Schreibweisen:** `ease-[cubic-bezier(.22,1,.36,1)]`
  elfmal, `ease-[cubic-bezier(0.22,1,0.36,1)]` einmal,
  `ease-[var(--ease-out-expo)]` einmal, dazu `var(--ease-out-expo)` im CSS.
  Das Token lag die ganze Zeit in `@theme` — die Utility `ease-out-expo` gab
  es also, sie stand nur in keiner Datei. Jetzt überall die Utility.
- **Sechs Dauerstufen ohne Leiter:** 150, 200, 300, 400, 500, 600 ms. Jetzt
  vier: **200 Mikro / 300 Fläche / 450 Tafel / 650 Bildfahrt.** Alles
  dazwischen ist ein Unterschied, den man misst statt sieht.
- **Eine Kurve für alles, und für die Hälfte die falsche.** `out-expo` legt
  neun Zehntel des Weges in den ersten 25 % der Zeit zurück. Über 500 ms
  gelesen ist das ein Auftritt; über 200 ms an einem Hover ist es ein
  Nachwippen — die Fläche springt und kriecht dann hinterher. Zweite Kurve
  **`--ease-out-quart`** für alles unter 300 ms, inklusive `.press`
  (dort lief der Rückweg von 260 ms auf Expo).
- **Tailwinds Voreinstellung stand ungenutzt daneben:** Jedes
  `transition-*` ohne eigene Angabe — die Mehrheit — lief auf `ease-in-out`
  über 150 ms, einer Kurve, die am *Anfang* bremst. Für eine Rückmeldung auf
  einen Finger ist das falsch herum. `--default-transition-timing-function`
  und `--default-transition-duration` stehen jetzt in `@theme`.

**Kopfbereich — es gab keine Choreografie, nur gleichzeitige Starts.**
Auszeichnung, Überschrift und Lead begannen alle bei 0 ms, Beleg bei 60,
Band bei 80. Vier Elemente, die zusammen aufblitzen, lesen sich als ein
Ruck. Jetzt eine Folge: Auszeichnung 0 → H1 Zeile 1 bei 0 und Zeile 2 bei
90 → Lead 300 → Beleg 400 → Kennzahlenband 500.

- **Die H1 stieg als Block.** `.rise-line` lag um *beide* Zeilen; die Maske
  klammerte den ganzen Satz und schob ihn hoch. Jetzt trägt jede Zeile ihre
  eigene Maske und ihren eigenen Einsatz (90 ms Versatz) — das ist der Sinn
  der Klasse, sie heißt nach der Zeile.
- **Das Motiv stand still, während alles davor lief.** Neu `.hero-figure`:
  3,5 % Skalierung über 1,1 s, Ursprung unten, damit der Roller auf seiner
  Standfläche zur Ruhe kommt. **Nur `transform`** — die Aufnahme ist auf
  jeder Breite der LCP-Kandidat, und ein Einblenden über `opacity` zählt
  erst am Ende der Animation als gezeichnet.
- **Gemessen, ob das etwas kostet** (1,6 Mbit/s, CPU vierfach gedrosselt, je
  drei Läufe): mit Bewegung 1044/1068/1040 ms bei 390 px und
  2152/2164/2148 bei 1512, ohne Bewegung 1052/1016/1020 und
  2160/2152/2152. Kein Unterschied außerhalb des Rauschens, CLS 0.

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
| `components/ui/inventory-card.tsx` | Bestandskarte. Bild, Modell und Preis auf einer Zeile, dann **immer dieselben drei Zellen** Tempo / Reichweite / Zulassung mit Haarlinien; fehlt ein Wert, steht ein Strich. „Keine ABE“ in Bernstein plus ausgeschriebene Warnung, die nie eingeklappt wird. |
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

- **KI-Kennzeichnung: erledigt am 02.09.2026** — siehe eigenen Abschnitt
  unten. Offen bleibt der bessere Weg: echte Fotos aus Im Kampfrad 3.
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
- **Es sind acht erzeugte Bilder, nicht vier.** Diese Liste stand bis zum
  02.09.2026 auf `werkstatt-service`, `akku-diagnose`, `scooter-studio` und
  `ergo-tarife`. Dazu kommen `hero-werkstatt` — die Aufnahme über der H1 der
  Startseite — und die drei `scooter-*` vom 06.08.2026. Die vollständige Liste
  ist jetzt Code (`lib/data/generated-images.ts`), keine Notiz. Sie sind
  gekennzeichnet; ersetzen bleibt der bessere Weg.

## KI-Kennzeichnung der Bilder — 02.09.2026

Abgearbeitet. Was dabei herauskam und nicht wieder aufgeweicht werden darf:

- **Acht Bilder, nicht vier.** Der Eintrag oben nannte vier. Die drei
  `scooter-*` vom 06.08. tragen die Herkunft bis heute in ihren eigenen
  Metadaten (`photoshop:Credit="Made with Google AI"`), und `hero-werkstatt`
  ist an den Werkzeugen an der Lochwand und den unlesbaren Plaketten am Lenker
  als erzeugt zu erkennen. Beides stand nirgends. Die Liste ist deshalb jetzt
  `lib/data/generated-images.ts` und keine Zeile in dieser Datei: Ein Bauteil,
  das den Pfad nachschlägt, vergisst kein Motiv, ein Mensch schon.
- **Die Kennzeichnung liegt im Bild** (`GeneratedMark`), nicht in einer
  Fußnote. Art. 50 Abs. 4 EU-KI-VO verlangt die Offenlegung „spätestens zum
  Zeitpunkt der ersten Interaktion oder Exposition"; ein Satz im Impressum
  erfüllt das nicht. Die Kurzform „KI-BILD" steht sichtbar, der volle Wortlaut
  „Symbolbild, mit KI erzeugt" in `title` und `sr-only`.
- **Kein Neon an der Marke.** Die Akzentfarbe markiert drei Dinge —
  Hauptaktion, harte Zahl, ein Wort je Überschrift. Die Herkunft eines Bildes
  ist keines davon. Deckende Tinte statt Transparenz, sonst verschwindet der
  Chip über einer hellen Bildstelle.
- **Am Telefon steht die Marke rechts, 2,75 rem unter der Kopfzeile.** Der
  Streifen zwischen Kopfzeile und Auszeichnungszeile ist der einzige freie:
  Gemessen bei 320 px beginnt die Überschrift bei 207 px und der Fließtext bei
  384, die Bühne endet bei 416 – und sie liegt mit `-z-10` hinter dem Text,
  eine Marke weiter unten wäre von Buchstaben überdeckt statt dezent. Direkt
  unter der Kopfzeile (0,5 rem) las sie sich als Beschriftung des Menüknopfs;
  jetzt liegen 58 px dazwischen. Am Schreibtisch steht sie in der äußersten
  unteren Ecke statt 11 rem darüber auf dem hellen Werkstattboden – dort ist
  nur noch der Auslauf in die Tinte, Silber auf Tinte bleibt lesbar.
- **Bildunterschriften nennen keinen Ort mehr, Alt-Texte keine Person.**
  „Werkstatt Im Kampfrad 3, Neuenstadt am Kocher" unter einem erzeugten Motiv
  ist keine Bildunterschrift, sondern eine Tatsachenbehauptung über den
  eigenen Betrieb (§ 5 UWG). Der Alt-Text auf `/ueber-uns` lautete „Thomas
  Zielke bei der Arbeit" — er ordnete einer namentlich genannten realen Person
  ein erfundenes Gesicht zu, ausgerechnet auf der Seite, die sie vorstellt.
- **Vorschaubilder sind das Siegel, nicht die Motive.** `public/img/og-skope.png`
  (1200 × 630, aus `siegel-skope.png` auf Tinte) ist der Standard in
  `lib/seo.ts` und die `image` der Organisation in `lib/schema.tsx`. Grund: Ein
  og:image wird aus der Seite herausgelöst und steht ohne Bildunterschrift und
  ohne Marke im Bild in Chats und Zeitleisten — genau dort, wo die Offenlegung
  weiterhin gefordert ist und sich nicht mitliefern lässt. Die sechs
  routen-eigenen `image:`/`imageAlt:`-Angaben sind deshalb weg.
- **In den Dateien steht das IPTC-Kennzeichen**
  (`Iptc4xmpExt:DigitalSourceType = trainedAlgorithmicMedia`). Es war bei den
  fünf Dateien vom 14.08. durch eine Optimierung verlorengegangen. Neu
  hineingeschrieben wurde es **verlustfrei**: als APP1-Segment direkt in den
  JPEG-Bytestrom, nicht über ein Neukodieren mit sharp.
- **Nicht gekennzeichnet und das mit Absicht:** `ergo-aushang.jpg` (die eigene
  Preistafel), `siegel-skope.png`, die Gerätefotos, `karte-neuenstadt.png`
  (OpenStreetMap). **Der Erklärfilm stand bis zum 02.09.2026 in dieser Reihe
  und gehört nicht hierher** – hinter seinen Schrifttafeln liegt
  `hero-werkstatt`. Er trägt die Offenlegung jetzt in eigener Formulierung. Eine falsche Kennzeichnung ist genauso
  irreführend wie eine fehlende.
- **Was nicht geht:** Das Logo aus den Motiven entfernen. Es steckt in den
  Pixeln. Solange die Bilder stehen, trägt die Kennzeichnung die Last allein.
- **Die Motive bleiben — Entscheidung des Betreibers vom 02.09.2026.** Der
  Austausch gegen echte Aufnahmen ist vom Tisch; die Kennzeichnung ist damit
  nicht die Zwischenlösung, sondern die Lösung. Was sie nicht abdeckt, bleibt
  bewusst getragen: Der Chip sagt „nicht fotografiert", nicht „diese Werkstatt
  gibt es so nicht". Praktische Folge für jeden künftigen Eingriff — an der
  Kennzeichnung wird nichts gekürzt, gedimmt oder in eine Fußnote verschoben,
  weil es keine zweite Absicherung mehr gibt.

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

- **Versicherungskennzeichen: geklärt am 03.09.2026 – es kommt per Post.**
  Auskunft des Betreibers, deckungsgleich mit der Altseite. Die Aussage
  „sofort in der Werkstatt" stammte aus dem Werkstattaushang und ist auf
  allen Stellen gedreht (Kopf, Kennzahl, Karte, Ablauf ohne Weiche, FAQ,
  Teaser, Kachel der Startseite, Filmunterschrift). **Offen bleibt der
  Aushang selbst:** Das Foto auf /versicherung zeigt weiter „PLAKETTE –
  Sofort Mitnahme". Die Bildunterschrift stellt es richtig; besser ist ein
  neuer Druck.
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
- **Neu kodiert am 02.09.2026, weil er sichtbar unscharf war.** Er lag bei
  **292 kbit/s** für 1280 × 720 (CRF 27) – gemessen 0,9958 SSIM gegen den
  Schnitt; bei Schrifttafeln vor dunklem Grund verschmieren dort die Kanten.
  Jetzt **CRF 20 / 626 kbit/s / 2,7 MB**, SSIM 0,9985. Das Standbild war
  zusätzlich aus der *komprimierten* Fassung gezogen und hatte deren Weichheit
  geerbt; es kommt jetzt aus dem Schnitt (Sekunde 3,6, `-q:v 2`, 80 kB).
  Was damit **nicht** behoben ist: Die Quelle ist 720p, die Fläche bis 1120 px
  breit – auf einem Retina-Schirm sind das 2240 Gerätepixel gegen 1280. Ganz
  scharf wird er erst mit einem 1080p-Export aus dem Schnittprojekt.
- **Er trägt die KI-Offenlegung** („Enthält mit KI erzeugte Bildinhalte",
  `generatedVideoNotice`). Hinter den Schrifttafeln liegt dieselbe erzeugte
  Werkstattaufnahme wie im Kopfbereich, und damit auch im Standbild. Der
  frühere Eintrag „Erklärfilm: bewusst nicht gekennzeichnet" stammt aus der
  Zeit, in der `hero-werkstatt` nicht als erzeugt geführt war. Der Wortlaut ist
  ein anderer als bei den Bildern, weil der Film selbst gebaut ist und nur sein
  Bildmaterial erzeugt.
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

## Gesamtaudit vor dem Livegang — 02.09.2026

Fünf Gutachter (Sicherheit, Code, Design, Werbetext/Conversion, SEO/GEO)
plus eigener Durchgang, danach ein Handy-Sweep über zwölf Routen × neunzehn
Breiten (320 – 2560 px, drei Querformate) gegen den Produktionsbuild auf
Port 4312. Ergebnis: kein Überlauf, keine Konsolenfehler, keine Zielfläche
unter 44 px, keine Schrift unter 11 px. Nichts davon ist committet.

**Sicherheit und Stabilität:**

- **`next.config.ts` setzt jetzt die Sicherheitsheader:** CSP
  (`script-src 'self' 'unsafe-inline'`, `'unsafe-eval'` nur in der
  Entwicklung, `frame-ancestors 'none'`, `form-action 'self'`,
  `upgrade-insecure-requests` in Produktion), X-Frame-Options,
  nosniff, Referrer-Policy, Permissions-Policy, `poweredByHeader: false`.
  `'unsafe-inline'` bleibt, weil Next JSON-LD und Hydrationsskripte inline
  schreibt; ein Nonce-Setup bräuchte Middleware und dynamisches Rendering.
- **`next` 16.2.6 → 16.3.4** wegen sharp/libvips-CVEs;
  `npm audit --omit=dev` ist leer. `motion` ist deinstalliert,
  `green-border.tsx` und `border-beam-panel.tsx` gelöscht – beides ohne
  Aufruf.
- **`lib/notify.ts` liefert einen typisierten `SendResult`**
  (`unconfigured` | `provider`); die Aktion sagt dem Nutzer ehrlich, wenn
  kein Versand eingerichtet ist, und loggt Fehler mit `err.name`. Der
  Places-Abruf hat ein `AbortSignal.timeout(5000)`. `clientKey()` liest
  kein `x-real-ip` mehr (fälschbar), `Object.hasOwn` gegen Prototyp-Slugs
  im Formular, `INQUIRY_TO` wird gegen ein Muster geprüft.

**SEO, die man nicht wieder rückgängig macht:**

- **`title.template` greift nicht auf `app/page.tsx`.** Die Startseite
  trägt deshalb `absolute: true` in `pageMeta`, sonst fehlt „| SKOPE".
- **`openGraph` wird nicht tief zusammengeführt:** `siteName` steht in
  jedem `pageMeta`-Aufruf, nicht nur im Layout.
- **Vorschau-Deployments sind `noindex`** (`isPreview` in `lib/seo.ts`,
  über `VERCEL_ENV`), `robots.ts` sperrt sie ebenfalls.
- **Die Sitemap hat kein `lastmod` mehr.** Die Bauzeit als Datum an allen
  zwölf Adressen sagt Google „alles hat sich geändert" – bei jedem Deploy.
  Das Datum trägt der `WebPage`-Knoten.
- **`unitCode` trägt die UN/CEFACT-Codes, `unitText` das lesbare Wort**
  („Jahr", „Monat"). Telefon im Schema als E.164 (`site.phone.e164`).
- **Alle fünf belegt falschen Aussagen aus dem Faktenaudit sind korrigiert:**
  Teilkasko 69 € im Jahr (49 € nur im Januar), Express „bevorzugt innerhalb
  24 h" überall, „werkstattgeprüft", Marke „Egret", Codes im richtigen Feld.
  Die Preise stehen mit geschütztem Leerzeichen vor „€" – ein `sed` ohne
  das findet sie nicht.

**Text und Conversion:**

- **Kein Neon außerhalb der drei Aufgaben.** „Daten & Bilder" auf der
  Bestandskarte, die `tint-neon`-Karte auf `/reparatur` und die Punkte der
  Marken-Liste waren Neon ohne Aufgabe; jetzt Tinte bzw. `current/40`.
- **Werbewörter sind raus** („ehrlich", „Jetzt anfragen."), die FAQ zur
  Differenzbesteuerung ist durch die Vorsteuerfrage ersetzt (§ 19 heißt:
  keine Vorsteuer). Der Erfolgstext des Formulars nennt, was als Nächstes
  passiert.
- **`noBreak()` in `lib/utils.ts`** setzt in „E-Scooter" den geschützten
  Bindestrich (U+2011); FAQ-Fragen und Zitate laufen darüber, im JSX steht
  `whitespace-nowrap`. Vorher brach „E-/Scooter" in Überschriften um.
- **`inventoryFacts()` liefert `null` statt „0,00 €"**, wenn kein Gerät
  einen Preis hat; Hero und Teaser blenden den Preis dann aus. Wichtig für
  den Shopify-Anschluss, bei dem der Bestand zeitweise leer sein kann.

**Layout:**

- **Die Werkstatt-Sektion passt auf einen Bildschirm** (972 statt 1110 px
  bei 1920 × 1080): Bild `lg:flex-1`, Liste enger, Bearbeitungszeiten als
  dreispaltige `dl` mit Haarlinie, `text-balance` am Wert („Express,
  bevorzugt / innerhalb 24 h" statt „… 24 / h").
- **`Related`-Karten trugen `min-width: auto`:** „Versicherungskennzeichen"
  im Untertitelgrad plus Ring ergab bei 320 px 349 px Mindestbreite – die
  Karte lief aus dem Satz, ohne dass die Seite Überlauf meldete. Jetzt
  `min-w-0` und `[hyphens:auto]`.
- **Adressen zweizeilig** (Kartenkachel, Kontaktblock): Straße, dann
  PLZ und Ort – vorher „Neuenstadt am / Kocher". Der String
  `fullAddress` bleibt einzeilig, weil er ins Schema und in alt-Texte geht.
- **Bestandszeile im Hero ist ein Verweis auf `#bestand`** mit `min-h-11`;
  die Brotkrume der Geräteseite hat dieselben `px-2` wie der Seitenkopf.

**Bewusst nicht gemacht** (Entscheidung oder Betreiberauskunft nötig):
Rate-Limit über Upstash, Nonce-CSP, Kennzahlenband im Teaser (vom Nutzer
so gebaut), 1080p-Export des Films, Öffnungszeiten, `sameAs`-Erweiterung,
alle Punkte aus dem Faktenaudit mit Rückfrage.

## Bestandskarte neu komponiert — 16.09.2026

Auf Ansage („können wir das besser darstellen", mit Aufnahme der Lücke über
„Mehr Daten"). Die Verteilung der freien Höhe auf zwei Abstände vom 15.09. war
Kosmetik: Sie hat ein Loch durch zwei kleinere ersetzt, und das Datenband
schwamm danach frei in der Kartenmitte. Drei Eingriffe, alle gemessen:

- **Die Lücke war kein Abstandsproblem, sondern fehlender Inhalt.** Der
  Zustand steht in den Daten und wurde auf der quadratischen Karte gar nicht
  gezeigt, obwohl die Zeilenkarte am Telefon ihn trägt. Er steht jetzt unter
  dem Preis – die Angabe, die bei einem Einzelstück aus zweiter Hand nach
  Modell und Preis als Nächstes gefragt wird. Die Texte sind 30 bis 90 Zeichen
  lang und schlucken damit genau die Schwankung, die sie verursachen.
  `min-h-[2lh]` hält die Bänder einer Reihe trotzdem auf einer Linie.
- **Die ABE-Warnung liegt auf dem Bild, nicht unter dem Band.** Als Absatz in
  der Karte machte sie zwei der dreizehn Karten höher – und weil `auto-rows-fr`
  alle Karten gleich hoch macht, bekamen die elf übrigen dieselbe Höhe als
  leere Fläche geschenkt: gemessen **68 px** unter dem Zustand, auf jeder
  Karte und jeder Breite. Jetzt ein Bernsteinstreifen über die volle Bildbreite
  am unteren Bildrand, Wortlaut unverändert und ausgeschrieben. Sie ist damit
  nicht kleiner geworden, sondern steht vor dem Preis statt hinter den
  Kennwerten. Gemessen danach: Lücke 20 px bei 1512 (= `pt-5`, also null
  Überschuss), 20–39 px bei 768. Die Bildzählung rutscht auf den Karten mit
  Streifen von `bottom-3` auf `bottom-11`.
- **Das Datenband läuft über die volle Kartenbreite** (`-mx-3.5 px-3.5`,
  ab `sm` `-mx-4`). Die Haarlinien sind damit Kanten der Karte statt drei
  Striche in ihrer Mitte; Warnung, Band und Verweis hängen als **ein** Block
  mit einem einzigen `mt-auto` am Boden. Über der Kante steht, was das Gerät
  ist, darunter, was es kann.

## Finanzierung & Abo — 16.09.2026

Neue Route `/finanzierung`, aus einer Auskunft des Betreibers (Mietkauf-Abo,
Ratenkauf mit Anzahlung, Bankfinanzierung in Planung). Der Tonfall der Vorlage
(„Rundum-Sorglos-Paket", „bleib gespannt", Du-Ansprache) ist nicht übernommen,
die Fakten vollständig.

- **Auf der ganzen Seite steht keine einzige Beispielrate.** Nicht aus
  Vorsicht: § 16 PAngV verlangt bei jeder Werbung mit Zahlen zu einer
  Finanzierung den effektiven Jahreszins und die übrige Pflichtangabenkette.
  Eine erfundene Rate wäre also nicht nur falsch, sie zöge alles Weitere nach
  sich. Stattdessen der Satz, der immer stimmt: Rate, Laufzeit und
  Gesamtbetrag stehen im Angebot, bevor unterschrieben wird.
- **Die Bankfinanzierung steht sichtbar, aber ohne Anfrage.** Ein Knopf an
  einem Angebot, das es noch nicht gibt, ist eine Zusage. Eigene Fläche,
  eigenes Zeichen (Uhr statt Häkchen), kein Ziel. `financingModels` trägt
  dafür `available`.
- **Die Wahl steht in der Adresse** (`?anliegen=finanzierung-mietkauf|
  -ratenkauf`), gelesen über dieselbe Mechanik wie beim Wartungsvertrag.
  Drei neue Anliegen in `lib/data/topics.ts`, eigene Gruppe „Finanzierung".
- **Die offenen Punkte stehen als TODO in `lib/data/financing.ts`**, nicht in
  dieser Datei: ob die Modelle auch für die generalüberholten Einzelstücke
  gelten (die Rauslösesumme ist mit „20 % des Neupreises" angegeben), die
  Vertragsmuster nach §§ 506 ff. BGB, die Erlaubnis nach § 34c Abs. 1 Nr. 2
  GewO für die geplante Kreditvermittlung, die Versicherung im Abo (§ 34d,
  siehe Faktenaudit) und die Frage, ob E-Chopper und E-Trike verkauft oder
  nur finanziert werden.
- **Deshalb kein Finanzierungshinweis an der einzelnen Bestandskarte.** Die
  Zeile steht im Teaser der Startseite unter den beiden Wegen und als dritte
  `Related`-Karte auf `/e-scooter` – als Hinweis auf das Angebot des Betriebs
  belegt, als Zusage an einem bestimmten Gerät nicht.

**Zwei Kopfzeilen-Befunde, die der siebte Navigationspunkt aufgedeckt hat:**

- **Die Aktionsgruppe stand bei 1280 px 53 px über dem Satzspiegel.** Die
  Navigation ist mit „Finanzierung" 805 statt 687 px breit. Der Seitenkopf
  liegt `fixed`, also meldet die Seite dafür **keinen waagerechten Überlauf** –
  man sieht es nur im Bild oder in der Messung (`grp.right` gegen
  `inner.right`). Wer hier einen Punkt ergänzt, misst genau das nach. Die
  Bewertung fällt deshalb zwischen 1280 und 1399 px weg, die volle
  Telefonnummer erst ab 1600 statt ab 1440. Gemessen passt die Gruppe jetzt
  auf 1024 / 1279 / 1280 / 1366 / 1399 / 1400 / 1512 / 1599 / 1600 / 1920.
- **Der Telefon-Symbolknopf im Band 1280–1439 war nie sichtbar.** Seine
  Klasse lautete `lg:hidden min-[1280px]:inline-flex min-[1440px]:hidden`;
  gemessen stand er bei 1280 px auf `display: none`. Tailwind ordnet benannte
  und arbiträre Abfragen nicht in einer gemeinsamen Reihe, `lg:hidden` gewann
  also gegen die spätere Regel. Der Eintrag „Zwischen 1280 und 1439 px gab es
  keinen Telefonverweis" aus der Handy-Qualitätsprüfung war damit **nicht**
  behoben. Alle drei Zustände laufen jetzt über arbiträre Abfragen.
- **`Related` richtet die Spalten nach der Anzahl** (`lg:grid-cols-3` bei
  drei Karten). Zwei Spalten wären bei dreien zwei plus eins.

Gemessen über zwölf Routen × elf Breiten (320 – 1920 px plus Querformat) gegen
den Produktionsbuild: kein Überlauf, keine Konsolenfehler, genau eine H1 je
Route, keine Schrift unter 11 px außer der bekannten Plakettenschrift auf
`/versicherung`.

## Vertragsmuster nachgereicht — 16.09.2026

Der Betreiber hat „Mietkauf- & Abo-Vertrag" und „Ratenkaufvertrag" geschickt,
beide mit SEPA-Basislastschriftmandat (Gläubiger-ID DE07ZZZ00002872498). Damit
ist die Finanzierungsseite nicht mehr nur aus einem Werbetext gebaut. Vier
Angaben waren dort **falsch oder gar nicht** vermerkt:

- **Die Laufzeit ist 24 *oder* 36 Monate**, nicht „zwischen 24 und 36". Der
  Vertrag führt zwei Stufen zur Auswahl, keine freie Spanne. Vier Stellen
  gedreht (Karte, Meta, Schema, zwei FAQ) – jede einzeln angesehen, kein
  Suchen-und-Ersetzen.
- **Die Bonitätsprüfung ist bei beiden Modellen aufschiebende Bedingung**
  (Abo § 2.1, Ratenkauf § 3), nicht nur beim Ratenkauf. Sie steht deshalb
  unter „Für beide Modelle gilt" und nicht mehr als `note` an einer Karte:
  An einer Karte gelesen wäre sie ein Unterschied zwischen den Modellen, und
  das ist sie nicht. Dasselbe gilt für den Einzug zum 1. des Monats.
- **Der Ratenkaufpreis enthält bereits sämtliche Aufschläge für die
  Finanzierung** (§ 2). Die Finanzierung kostet also etwas, und das steht
  jetzt da – als `note` an der Karte und als eigene FAQ. Wer „Kaufpreis
  verteilt" liest, nimmt sonst an, es käme nichts dazu. **Weiterhin keine
  Zahl**: Der Vertrag beziffert den Aufschlag nicht, und mit einer Zahl
  begänne § 16 PAngV.
- **Beim Ratenkauf trägt der Käufer ab der Übergabe Anmeldung, Versicherung,
  Wartung und Reparaturen selbst** (§ 5). Das ist der eigentliche Unterschied
  zum Abo und stand nirgends.

**`FinancingModel` hat dafür ein Feld `excludes`.** Ohne es standen zwei
Karten mit je vier Häkchen nebeneinander, und der Unterschied zwischen den
Modellen las sich als Gleichstand. Die Ausschlüsse stehen in derselben Liste –
`×` im Ring statt Neon-Häkchen, eine Stufe blasser, mit `sr-only`
„Nicht enthalten:" davor. Dieselbe Lösung wie bei den Ausschlüssen des
Wartungsvertrags. Gemessen 320 – 1440 px: beide Karten auf jeder Breite gleich
hoch, kein Überlauf, keine Konsolenfehler, keine Schrift unter 11 px.

**Was die Verträge *nicht* enthalten, steht als TODO 2 und 6 in
`lib/data/financing.ts`** und hält die Schaltung der Route auf:
Widerrufsbelehrung (§ 506 i. V. m. § 495 BGB – ohne sie läuft die Frist nicht
an) und die Pflichtangaben nach Art. 247 EGBGB fehlen in beiden Verträgen;
die Verzugsklauseln gehen über § 498 BGB hinaus; die einjährige
Gewährleistung, die die Seite zusagt, kommt in keinem der beiden Verträge vor;
Bonitätsprüfung und Personalausweisnummer gehören in die Datenschutzerklärung.
Das ist eine Anwaltsfrage, keine Codefrage – hier steht es nur, damit es nicht
wieder aus dem Blick gerät.

## Bestandskarte, dritter Anlauf — 16.09.2026

Auf Ansage („nochmal, du sollst das besser gestalten"), mit Aufnahme derselben
Lücke. Die beiden Versuche davor waren Kosmetik: erst die Leerfläche auf zwei
Abstände verteilt, dann mit einer Zustandszeile gefüllt. Gemessen war beides
falsch begründet.

- **Die Karte war auch ohne `auto-rows-fr` 702 px hoch.** Der Überschuss kam
  nicht aus dem Raster, sondern aus **meinen eigenen zwei `min-h-[2lh]`** an
  Modellname und Zustandszeile: Sie halten vier Textzeilen frei, und eine
  Karte wie „Zamelux E9" füllt davon zwei. Gemessen bei 1512 px 27 px leer
  unter dem Namen und 29 px unter dem Zustand. Die Begründung, die dort stand
  („die Angaben sind 30 bis 90 Zeichen lang und schlucken die Schwankung"),
  war nachweislich falsch: Der Zustand ist auf **allen dreizehn** Karten
  einzeilig.
- **Der Ausgleich gehört ins Bild, nicht in den Text.** Die Bildzone trägt
  jetzt `aspect-square grow` – das Quadrat bleibt die Untergrenze, der
  Überschuss kommt oben drauf. Das Bild ist das einzige Element der Karte,
  das ein paar Pixel mehr verträgt, ohne als Fehler gelesen zu werden: Es
  liegt `object-cover`, die Aufnahmen sind ohnehin hochkant (720 × 960).
  Gemessen 1512 px: Bildhöhe 422 – 445 px, Karte 702 → 674, Abstand unter dem
  Zustand konstant 20 px (= `pt-5`, also null Überschuss) auf jeder der
  dreizehn Karten und auf jeder Breite.
- **`grow`, nicht `flex-1`.** `flex-1` setzt die Basis auf 0, die Höhe wäre
  dann allein der Restraum und `aspect-square` wirkungslos – bei einer Karte
  mit dreizeiligem Namen schrumpfte das Bild.
- **`mt-auto` am Fuß ist weg.** Ein automatischer Rand gewinnt in einer
  Flex-Spalte gegen jedes `grow`; der Rest wäre wieder in den Abstand
  gelaufen statt in die Bildzone.

**Das Datenband entscheidet über zwei oder drei Zellen an der Kartenbreite,
nicht an der Fensterbreite** (`@container` an der Karte, Schwelle
`@[18.75rem]`). Daran war die Zeile unabhängig von der Lücke kaputt: Bei
768 px Fenster ist die Karte 332 px breit und alles passt, bei 1024 px sind es
wegen der dritten Rasterspalte nur 293 – dort brach „bis 20 km" zweizeilig um.
Eine Media Query kann das nicht treffen. Die Schwelle ist gerechnet: Bei
gleich breiten Spalten bestimmt das längste Etikett die Zelle, „REICHWEITE"
misst 76 px, mit Zellenabstand 100, mal drei = 300 px Innenbreite. Darunter
fällt **Tempo** weg – zwölf der dreizehn Geräte fahren 20 km/h, die Zelle
unterscheidet nichts; dieselbe Entscheidung wie auf der Zeilenkarte am
Telefon. Vollständig steht das Tempo auf der Geräteseite.

**Falle dabei:** `hidden` lässt die Zelle `:first-child` bleiben, das
`first:pl-0` in `Fact` greift also weiter an der ausgeblendeten Zelle. Die
Reichweite bekommt den linken Rand deshalb ausdrücklich genommen
(`pl-0 @[18.75rem]:pl-3`).

Gemessen über /e-scooter, / und eine Geräteseite bei 320 – 1512 px: alle
Karten eines Rasters gleich hoch und gleich breit, keine Zelle mehr
zweizeilig, kein Überlauf, keine Konsolenfehler.

## Kennzahlen der Website — 16.09.2026

Hintergrund ist die Vergütung: Abgerechnet wird anteilig an dem, was die
Website einbringt, und dafür braucht es eine Zahl, die beide Seiten ansehen
können. Gebaut ist die kleinste Fassung, die das trägt.

**Was gezählt wird — und was ausdrücklich nicht.** `lib/metrics.ts` schreibt
je Tag einen Redis-Hash mit Summen: `anfrage`, `anfrage:<anliegen>`,
`telefon`, `telefon-quelle:<quelle>`, `quelle:<quelle>`, `seite`,
`seite:<pfad>`. **Keine IP, keine Kennung, kein Cookie, kein Zeitstempel
unter Tagesgenau.** Das ist kein Nebenaspekt, sondern die Eigenschaft, an der
alles hängt: Ein reiner Zähler ist kein Zugriff auf Endgeräte im Sinne des
§ 25 TDDDG und braucht keine Einwilligung. Wer eine Besucher-ID, eine
Verweildauer oder einen Zeitstempel auf die Minute ergänzt, bricht das und
holt sich ein Einwilligungsbanner ins Haus.

- **Speicher ist Upstash Redis über REST** (`UPSTASH_REDIS_REST_URL`,
  `UPSTASH_REDIS_REST_TOKEN`). Weder Datei noch Prozessspeicher: Beide
  überleben auf Vercel den nächsten Aufruf nicht. Ohne die beiden Variablen
  liefert `metricsMode()` `off`, es wird nichts gezählt, und die
  Kennzahlenseite sagt das — dieselbe Regel wie bei `lib/commerce.ts`: Es gibt
  keinen Zustand, in dem eine Zahl wie eine Messung aussieht, ohne eine zu
  sein.
- **Der Telefontipp hängt an einem Zuhörer am Dokument** (`components/
  metrics/counter.tsx`), nicht an den Knöpfen. Die Nummer steht an sieben
  Stellen; ein `onClick` je Knopf macht aus jedem dieser Bauteile eine Client
  Component und vergisst beim achten die Zeile. `sendBeacon`, nicht `fetch`:
  Beim Wechsel in die Telefon-App wird ein `fetch` abgebrochen und die Hälfte
  der Tipps ginge verloren. Der Zuhörer ruft weder `preventDefault` noch
  `stopPropagation` — der Anruf muss auch zustande kommen, wenn das Zählen
  scheitert.
- **Die Herkunft steht im Formular in einem versteckten Feld** und kommt aus
  `lib/source.ts`: einmal je Sitzung aus `utm_source` oder der Verweisadresse
  bestimmt, in `sessionStorage` gehalten (kein Cookie, überlebt den Tab
  nicht). Ohne JavaScript bleibt das Feld leer und der Server trägt
  „unbekannt" ein — die Anfrage geht trotzdem raus.
- **Gezählt wird die abgeschickte, geprüfte Anfrage**, nicht die erfolgreich
  zugestellte Mail. Ein Ausfall des Mail-Providers darf die Kontaktzahl nicht
  senken.
- **`fieldSlug()` ist Pflicht für jedes zusammengesetzte Feld.** Die Anliegen
  heißen „Sicherheits-Checkup (59,99 €)" — mit Klammern und Umlauten fallen
  sie durch den Feldfilter, und der erste Entwurf zählte deshalb stumm nur die
  Summe, nie die Aufteilung. `lib/metrics-view.ts` übersetzt über dieselbe
  Funktion zurück und baut die Karte aus `CONTACT_TOPICS`, nicht von Hand.

**`/kennzahlen`** ist nicht Teil des Auftritts: nicht in der Navigation, nicht
in der Sitemap, `noindex`, in `robots.ts` gesperrt — und **ohne
`METRICS_PASSWORD` gibt es sie gar nicht** (404 statt Passwortmaske; eine
Maske verrät, dass dort etwas liegt). Der Cookie trägt den Hash des Passworts,
nicht das Passwort. Fehlversuche kosten eine halbe Sekunde.

Die Seite zeigt vier Zahlen (Kontakte, Anfragen, Telefontipps, Seitenaufrufe
mit Quote), den Verlauf als zweilagige Säulen über die volle Breite und
darunter zwei Listen — Herkunft und Anliegen. **Unten steht, was die Zahlen
nicht sagen**, und das bleibt dort: Eine Abrechnungsgrundlage ohne ihre
Grenzen ist eine Behauptung. Der größte blinde Fleck ist die abgelesene
Nummer, die von einem anderen Gerät gewählt wird; er verschwindet erst mit
einer eigenen Rufnummer für die Website.

**Ohne Speicher zeigt die Seite Beispielzahlen** aus
`lib/data/metrics-demo.ts` — deterministisch erzeugt, mit echten
Anliegen-Bezeichnungen, und mit einem Warnhinweis in Bernstein über der ersten
Zahl. Nicht in Neon: Der Hinweis ist kein Etikett der Marke, sondern der
Vorbehalt, unter dem alles darunter steht.

**Abschnitt 5 der Datenschutzerklärung ist neu geschrieben.** Dort stand die
Floskel „Ihr Surf-Verhalten kann mit sogenannten Analyseprogrammen ausgewertet
werden" — zu wenig, seit wirklich gezählt wird, und zugleich zu viel, weil es
nach einem Analysedienst klingt, den es nicht gibt. Ändert sich der Zähler,
ändert sich dieser Absatz mit.

**Gemessen:** 404 ohne Passwortvariable, Maske bleibt bei falschem Passwort,
Beacon meldet `{"event":"telefon","source":"direkt"}` beim Tippen auf einen
Telefonverweis (nachgewiesen über ein überschriebenes `navigator.sendBeacon` –
`page.route` von Playwright fängt Beacons **nicht** ab, ein erster Gegentest
sah deshalb fälschlich leer aus). Achtzehn Prüfungen über sechs Routen ×
390/1024/1440 px: kein Überlauf, genau eine H1, keine Konsolenfehler. Alle
übrigen Seiten bleiben statisch, dynamisch sind nur `/kennzahlen` und
`/api/ereignis`.

**Noch nicht gebaut:** die Zuordnung von Umsätzen. Sie hängt an Shopify
(`lib/commerce-shopify.ts`) und wird dort angeschlossen, wenn der Verkaufsweg
steht.

## Echte Werkstattfotos — 20.09.2026

Sieben Telefonaufnahmen des Betreibers. Sie liegen verkleinert unter
`public/img/werkstatt/`, die Rohdateien bleiben lokal (`/PXL_*.jpg` in
`.gitignore`).

- **Die Rohbilder tragen EXIF mit Aufnahmeort, Gerät und Zeitstempel.** Das
  Repository ist öffentlich. `sharp` schreibt ohne `withMetadata()` nichts
  davon in die Ausgabe – wer die Bilder neu erzeugt, lässt das so. Geprüft:
  33 EXIF-Treffer im Rohbild, null in der ausgelieferten Datei.
- **Keine KI-Kennzeichnung.** Diese Bilder sind fotografiert; `GeneratedMark`
  gehört ausschließlich auf die acht erzeugten Motive. Eine falsche
  Kennzeichnung ist genauso irreführend wie eine fehlende.
- **Die Startseite trägt ein erzeugtes Motiv weniger.** In der
  Checkup-Sektion (`workshop.tsx`) lag `werkstatt-service.jpg`; für einen
  Absatz, der aufzählt, was für 59,99 € *tatsächlich* passiert, war ein
  erfundenes Bild die schlechteste Wahl der Seite. Dort steht jetzt
  `reparatur-trittbrett.jpg`.
- **Die Bahn hat gleich hohe, verschieden breite Kacheln.** Fünf Aufnahmen
  sind hochkant, zwei quer. Ein gemeinsames 4/3 hätte den Hochformaten oben
  und unten je ein Fünftel genommen – beim Bürocontainer genau das Schild
  über der Tür. Die Breite kommt über `aspect-ratio` aus `w`/`h` am Eintrag,
  also steht die Bahn vor dem ersten geladenen Bild richtig (CLS 0).
- **Drei Fallen, die dabei zugeschnappt sind:**
  - **Die Bildunterschrift zog die Kachel breit.** Eine Figur ohne
    Breitenangabe im Flex wird so breit wie ihr breitester Inhalt, und der
    Bildkasten darin steht auf `stretch` – sein Seitenverhältnis war damit
    wirkungslos (gemessen 352 statt 312 px auf vier von sieben Kacheln).
    `w-0 min-w-full` an der `figcaption` nimmt sie aus der Mindestbreite.
  - **`snap-start` übergeht den Innenabstand.** Die Bahn rastete beim ersten
    Sichtkontakt selbsttätig um 24 px ein; die erste Kachel stand an der
    Gehäusekante, 24 px links von Überschrift und Lead. `scroll-padding-left`
    muss denselben Wert tragen wie `padding-left`.
  - **Ein `Reveal` je Kachel bleibt beim Wischen aus.** Der Beobachter zählt
    gegen das *Fenster*, die Bahn bewegt sich waagerecht: nach einem Wisch
    ans Ende standen drei Kacheln dauerhaft auf Deckkraft 0. Jetzt ein
    `Reveal` um die ganze Bahn.
- **`components/ui/lane-arrows.tsx`** gibt einer Wischbahn zwei Pfeile ab
  `md`. Grund: Am Telefon hat sie ihre Geste, nach einem Tab ihre
  Pfeiltasten – mit der Maus hat sie nichts, weil `.scroll-x` den Rollbalken
  ausblendet und ein senkrechtes Rad sie nicht bewegt. Die Bahn wird über
  ihre `id` gefunden, nicht über eine Ref: Die Galerien sind Server-Bauteile.
  Der Zustand läuft über `useSyncExternalStore` mit einer **Zeichenkette** als
  Momentaufnahme – ein frisches Objekt je Aufruf wäre bei jedem Rollereignis
  ein neuer Wert und damit eine Endlosschleife.
- **`workshopPhotos()` warnt beim Bauen, wenn keine Datei liegt.** Ein Build
  vor den Bilddateien lieferte `/ueber-uns` ohne die Sektion, und im
  Protokoll stand nichts. Niemand sucht nach etwas, das aussieht, als hätte
  es nie existiert.

## Echter Bestand aus den Kleinanzeigen — 20.09.2026

`lib/inventory.ts` ist keine Platzhalterliste mehr. Quelle ist die
Händlerseite des Betriebs (kleinanzeigen.de/pro/skopegebrauchtwarenhandel),
abgerufen am 20.09.2026: **neun Modelle, dreizehn Geräte** — sieben
E-Scooter, ein E-Chopper (3×), ein E-Dreirad. Preise **249,00 bis 1.779,00 €**
statt vorher 169,99 bis 599,99.

- **Damit sind drei Entscheidungen belegt, die vorher nur Auskunft waren:**
  Es gibt wirklich Chopper (Mangosteen M1-P), es gibt wirklich ein Trike
  (Citycoco COCO CP-3, „E-Dreirad"), und es gibt wirklich Neuware — der
  Xiaomi 6 Ultra und beide 45-km/h-Fahrzeuge sind originalverpackt. Der
  frühere TODO „E-Trike steht auf der schwächeren Quelle, im Zweifel weg" ist
  damit erledigt. **`/e-roller` hat weiterhin keinen Bestand.**
- **`quantity` ist neu.** Dreimal derselbe Chopper und dreimal derselbe
  Xiaomi 6 Ultra stehen in den Kleinanzeigen als je drei Anzeigen. Hier sind
  sie **ein** Eintrag mit Stückzahl: Drei gleichnamige Karten mit demselben
  Bild und demselben Preis liest niemand als Vorrat, sondern als Fehler.
  `inventoryFacts().count` summiert deshalb Stückzahlen (13), `models` zählt
  Einträge (9).
- **`inventoryFacts(items?)` nimmt jetzt eine Liste.** „13 Geräte, ab 249 €"
  über einer Auslage mit sieben E-Scootern ist eine falsche Angabe über
  genau das, was darunter steht. Die Startseite rechnet weiter über alles.
- **Die Geräteseite liegt unter ihrer Fahrzeugart.** `app/e-scooter/[slug]`
  war die einzige Adressform; ein Chopper unter `/e-scooter/mangosteen-m1p`
  widerspricht der Trennung, für die es die Kategorieseiten überhaupt gibt.
  Die Seite steht jetzt als `components/sections/device-page.tsx`, die vier
  Routen sind dünne Dateien mit `listByCategory(<art>)`. Die Art kommt aus
  `item.category`, nicht aus der Adresse — und jede Route prüft sie, sonst
  läge jedes Gerät unter allen vier Adressen (dreifach doppelter Inhalt).
- **`deviceHref()` in `lib/data/vehicles.ts` ist die eine Stelle für die
  Adresse.** Vorher bildeten sie vier Stellen einzeln: Karte, Sitemap,
  Product-Schema, untere Aktionsleiste.
- **`/e-scooter` liest `listByCategory("scooter")`.** Vorher `listProducts()`
  — solange alles E-Scooter waren, fiel das nicht auf.
- **`itemCondition` im Schema kommt aus `condition`.** Fest auf
  `RefurbishedCondition` wäre am Neugerät eine falsche Beschaffenheitsangabe
  in der Suche: Plakette „Neu" auf der Karte, „generalüberholt" im Angebot
  daneben. Dasselbe gilt für den Seitentitel der Geräteseite („neu kaufen"
  statt „gebraucht kaufen").
- **Der Einstiegspreis in der Meta der Startseite kommt aus den Daten.** Er
  stand als „ab 169,99 €" hart im Satz und lag mit dem echten Bestand um 80 €
  daneben.

**Was bewusst NICHT in den Daten steht:** Reichweiten in Kilometern bei
Chopper und Dreirad — die Anzeigen nennen dort nur 30 Ah und 20 Ah, und aus
Amperestunden eine Reichweite zu rechnen hieße, eine Zahl zu erfinden, an der
ein Käufer sein Kaufmotiv festmacht. Dasselbe beim NAVEE UT5 Max, dessen
Anzeige Akku und Motor nur in Worten beschreibt.

**Zwei Widersprüche, die der Abgleich aufgedeckt hat — beide offen:**

- **§ 25a gegen § 19 UStG.** Jede Kleinanzeige nennt „Differenzbesteuerung
  nach § 25a UStG". Impressum und Schema dieser Website führen den Betrieb
  als Kleinunternehmer nach § 19. Beides zusammen geht nicht — wer § 19
  anwendet, weist ohnehin keine Umsatzsteuer aus. Eine der beiden Angaben ist
  falsch und steht öffentlich.
- **45 km/h ist kein Elektrokleinstfahrzeug.** Chopper und Dreirad sind
  Kleinkrafträder (Führerschein AM oder B, Versicherungskennzeichen für
  Kleinkrafträder). Der ERGO-Aushang auf `/versicherung` führt Tarife für
  Elektrokleinstfahrzeuge. Ob die Vermittlung die andere Klasse abdeckt und
  zu welchem Beitrag, ist ungeklärt — deshalb steht an beiden Geräten nur,
  dass es ein anderer Tarif ist, und keine Zahl.

**Bilder:** je sechs aus der Anzeige (`rule=$_57` liefert 1600 px, alles
darüber gibt es nicht), auf 1200 px und rund 120–290 kB gerechnet, ohne
Metadaten. Reihenfolge ist nicht die der Anzeige: Dort steht die Seitenansicht
an vierter Stelle, auf der Karte muss sie die erste sein.

**`auto-rows-fr` gilt erst ab `sm`.** Einspaltig gibt es keinen Nachbarn, an
dem sich etwas ausrichten könnte — `fr` gab jeder Karte trotzdem die Höhe der
größten *sichtbaren*, und weil der Filter über `hidden` arbeitet, wechselte
diese mit jedem Filterklick: gemessen bei 390 px dieselbe Karte ohne Filter
212 px, mit „Bis 250 €" 176 px. Man drückt auf einen Filter und die ganze
Liste wechselt die Proportion, obwohl an den Geräten nichts anders ist.

## Fahrzeug-Unterseiten repariert — 23.09.2026

Auf Ansage („die Fahrzeug-Unterseiten spacken"). `/e-chopper` und `/e-trike`
zeigten ihr Gerät als **34 px breiten schwarzen Streifen** mit einem Zeichen
je Zeile, den Preis daneben im Leeren. Kein Überlauf, kein Konsolenfehler —
deshalb war es durch jede bisherige Prüfung gefallen.

- **Ursache ist `@container` an der Bestandskarte.** Die Klasse setzt
  `container-type: inline-size`, und damit rechnet der Browser die Breite der
  Karte **ohne ihren Inhalt**. Als Flex-Kind mit `flex-basis: auto` bleibt
  davon der Innenabstand übrig: 16 + 16 + 2 px Rahmen = 34. Gemessen bei
  1512 px in einer 456 px breiten Rasterspalte, alle vier Kinder der Karte
  0 px breit.
- **`w-full` steht jetzt an der Karte, nicht an der Aufrufstelle.** Es wurde
  bisher von vier Stellen einzeln mitgegeben; `/e-scooter` und der
  Startseiten-Teaser taten es, die Kategorieseite nicht. Eine Angabe, ohne
  die ein Bauteil zusammenfällt, gehört ins Bauteil. Die redundanten
  `w-full` an den Aufrufern sind weg.
- **Die Kategorieseite trägt jetzt beide Kartenformen** — Zeilenkarte unter
  `sm`, Quadrat darüber — und `auto-rows-fr` erst ab `sm`. Vorher war es die
  quadratische Karte auf jeder Breite und `fr` auch einspaltig; dieselben
  zwei Entscheidungen wie im Bestandsfilter.
- **Der Abschluss handelte von der falschen Gattung.** `CtaBand` stand ohne
  Angaben da und fragte auf `/e-chopper`, „was der **Scooter** macht" — und
  schickte nach `/kontakt`, obwohl eine Sektion höher das eigene
  Suchauftrag-Formular steht (Vorauswahl weg). Jetzt `formHref="#anfrage"`
  und ein Text je Bestandslage: mit Gerät „steht bereit", ohne Gerät nicht.
- Gemessen 320 / 390 / 768 / 1024 / 1512 px über `/e-chopper`, `/e-trike`,
  `/e-roller`, `/e-scooter` und `/`: Karten auf voller Spaltenbreite,
  `/e-scooter` und Startseite unverändert, kein Überlauf, keine
  Konsolenfehler.

## Neues Kopfbild und Porträt — 23.09.2026

Zwei Bilder des Betreibers eingesetzt, beide mit ChatGPT erzeugt.

**Kopfbereich: `hero-fahrzeuge.jpg` statt `hero-werkstatt.jpg`.** Drei
Fahrzeuge im Studio – Chopper, Scooter, Roller – statt einer erfundenen
Werkstatt. Inhaltlich der bessere Grund: Das Motiv zeigt jetzt das Sortiment
und nicht einen Betriebsort, den es so nicht gibt.

- **Die Quelle ist 1672 × 941 und damit zu klein.** Ausgeliefert wird auf
  2400 px hochgerechnet (`lanczos3` plus Unschärfemaske, q92, 4:4:4). Das
  erfindet keine Auflösung, hält aber die vorhandene Kantenzeichnung, statt
  sie in der Quantisierung zu verlieren. Dazu `quality={90}` am `<Image>` –
  Next optimiert ohne Angabe mit 75, und bei den Felgen und Leuchtbändern
  sieht man das.
- **Der Zuschnitt musste umgebaut werden, weil das Seitenverhältnis ein
  anderes ist** (1,78 statt 1,59) **und das Motiv 60 % der Bildbreite
  braucht** (Fahrzeuge von 33 bis 93 %, gemessen über die Kantenenergie je
  Spalte). Der alte Kopfbereich schnitt am Telefon auf 38 % zu – sichtbar
  waren ein Trittbrett und ein halbes Rad.
- **Am Telefon liegt das Bild deshalb `object-contain` als Band am Fuß der
  Bühne**, nicht mehr `object-cover` über die ganze Fläche: bei 390 px
  390 × 220 px, alle drei Fahrzeuge vollständig. Der Text steht darüber auf
  reiner Tinte. Der Deckel `157vw` und der Ausschnitt `74 %` sind damit
  gegenstandslos und weg.
- **`.hero-stage-scrim` läuft erst ab 92 % in die Tinte** statt ab 68. Die
  68 % waren auf ein bildfüllendes Motiv gerechnet; über einem Band, das von
  62 bis 100 % steht, hätten sie genau die Fahrzeuge verschluckt.
- **Am Schreibtisch hängt die Bildfläche an ihrer Breite, nicht an der
  Zonenhöhe** (`w-[74%] aspect-[2400/1351]`, unten rechts verankert). Die
  74 % sind gerechnet, nicht geraten: Die Textspalte endet bei 50 % der
  Containerbreite, die Fahrzeuge beginnen bei 33 % der Bildbreite, also
  muss `1 − 0,67 · W ≥ 0,5` gelten. Vorher hing die Fläche an der Zonenhöhe
  und wurde auf einem 1024 × 900-Fenster 1156 px breit – der Chopper stand
  unter dem Fließtext, gemessener Kontrast 2,8:1.
- **Die weiche Kante links ist eine Maske an der Bildfläche**
  (`mask-composite: intersect`, 16 rem nach rechts, 2 rem nach oben). Sie
  funktioniert nur, weil die Fläche exakt das Seitenverhältnis des Motivs
  trägt – an einer Fläche, die größer ist als das Bild, läge die Maske
  neben der Kante. Vorher stand an der Bildkante eine senkrechte Naht
  mitten in der Sektion.
- **Gemessen** über 320 – 2560 px plus Querformat, je schlechtester
  Textkasten über dem Bild (Buchstaben transparent gesetzt, Kopfzeile
  ausgeblendet): 5,7:1 im ungünstigsten Fall (768 px), am Telefon 15 bis
  19,8:1. Kein Überlauf, keine Konsolenfehler, Sektionshöhen unverändert
  (844 von 844 px bei 390).

**Porträt auf `/ueber-uns`: `person-poloshirt.jpg`.**

- **Es ist erzeugt, und das ist nicht Auslegung.** Die Datei trägt ein
  C2PA-Manifest: `c2pa.created`, `softwareAgent: ChatGPT / gpt-image`,
  `digitalSourceType: trainedAlgorithmicMedia`, dazu
  `c2pa.watermarked.unbound`. Kein bearbeitetes Foto, sondern ein erzeugtes
  Bild mit unsichtbarer Wasserzeichnung.
- **Deshalb steht dort kein Name** – nicht im Dateinamen, nicht im
  Alt-Text, nicht in einer Bildunterschrift. Es ist genau die Stelle, an der
  dieser Fehler am 02.09.2026 schon einmal stand („Thomas Zielke bei der
  Arbeit" unter einem erfundenen Gesicht). Der Chip `KI-BILD` steht im Bild.
- Der Rahmen ist hell statt Tinte (das Motiv ist vor Weiß freigestellt), und
  die Bildfahrt ist weg – sie skaliert auf 110 % und hätte die Schuhe
  abgeschnitten. 1400 × 1749 ist exakt 4:5, `object-cover` schneidet nichts.
- **Offen für den Betreiber:** Ein echtes Foto ersetzt beides in einem
  Schritt – Pfad aus `lib/data/generated-images.ts` nehmen, dann darf der
  Name zurück in den Alt-Text.

**Bildunterschriften der Werkstattbahn sind weg — 23.09.2026, auf Ansage.**
Was zu sehen ist, steht weiterhin im `alt` jeder Aufnahme; unter dem Bild war
es eine zweite, kürzere Fassung derselben Aussage. Mit ihnen fallen drei
Behelfe weg, die es nur ihretwegen gab: das `<figure>` um die Kachel, die
Umgehung seiner Mindestbreite (`w-0 min-w-full`) und der feste Textkasten
(`min-h-[2lh]`), der die ausgefranste Unterkante wieder gerade zog. Die
Kachel ist jetzt selbst das Flex-Kind. Das Feld `caption` ist aus
`lib/data/workshop-photos.ts` entfernt — ein Feld, das niemand liest, läuft
beim nächsten Eingriff auseinander; der Wortlaut steht in der Historie.
Gemessen 390 und 1512 px: alle sieben Kacheln auf einer Unterkante (580 bzw.
684 px), kein Überlauf, kein Bild ohne `alt`.

**Das Fahrzeugmenü im Kopf trägt nur noch die Namen — 23.09.2026, auf
Ansage.** Unter jedem Eintrag stand eine Zeile Erklärung („Der Stehroller für
den täglichen Weg …"): vier Überschriften mit zwölf Zeilen Fließtext in einer
256 px breiten Tafel, die man im Vorbeigehen öffnet. Ein Menü ist eine Liste
von Wegen, kein Text. Jetzt vier Namen im Grundschriftgrad, je 44 px hoch,
Tafel 208 statt 256 px breit. Das Feld `blurb` ist aus `lib/data/vehicles.ts`
und `vehicleNav` entfernt — es hatte keinen zweiten Leser, und die Sätze
stehen ohnehin als `lead` auf den Kategorieseiten.

**Nachgezogen am selben Tag, auf Ansage („größer und etwas mehr Abstand"):**
Namen auf 1,25 rem (Untertitelgrad) statt 1,0625, Zeilen 48 statt 44 px,
2 px Fuge dazwischen, Tafel 240 statt 208 px breit, Innenabstand 8 statt
6 px. Gemessen 240 × 216 px, vier Flächen zu 222 × 48. Der Grad ist **fest,
nicht fluid**: Die Tafel hängt an der Kopfzeile, nicht am Satzspiegel, und
ist nur ab `lg` überhaupt sichtbar – über diesen Bereich ändert sich ihre
Breite nicht, eine `clamp`-Angabe hätte dort nichts zu skalieren.

## Vollbild der Gerätegalerie — 23.09.2026

Auf Ansage („wenn ich auf Bilder vergrößern drücke, spackt es und nimmt das
ganze Display ein, dass ich nicht mehr rauskomme"). Zwei Befunde, beide
gemessen bei 390 × 844 gegen den Produktionsbuild.

- **Man kam wirklich nicht heraus.** Der einzige Weg hinaus war das Kreuz
  oben rechts, und das lag auf 16 px – bei `viewport-fit=cover` also unter
  Statusleiste und Aussparung. Escape gibt es am Telefon nicht, der Zoom ist
  gesperrt, und der dokumentierte „Klick auf den Grund schließt" lief ins
  Leere: Die innere Fläche füllt den ganzen Dialog, `event.target` war also
  nie der Dialog selbst. Gemessen: Tipp an den Rand und Tipp auf das Bild –
  beide Male blieb die Überlagerung offen.
- **„Vermischt" war `bg-ink/95`.** Fünf Prozent Durchsicht reichen, wenn
  darunter silberne Schrift auf Tinte steht: Wortzeichen, Brotkrume,
  Vorschaureihe und die Überschrift der Seite standen lesbar im Bild. Jetzt
  deckende Tinte, auch am `::backdrop`.

Was dabei entschieden wurde:

- **Drei Gesten, die jede Bildansicht hat:** Tipp (unter 10 px Weg) schließt,
  Wisch nach unten (über 80 px, deutlich senkrechter als waagerecht) schließt,
  Wisch quer blättert – dieselben Schwellen wie in der kleinen Galerie. Ein
  Baustein, der an einer Stelle wischen kann, muss es überall können.
- **Knöpfe sind von der Geste ausgenommen** (`event.target.closest("button")`).
  Wer auf den Pfeil tippt, will blättern und nicht schließen.
- **`touch-action: none` an der Vollbildfläche.** Die senkrechte Richtung wird
  hier selbst gebraucht, und es gibt nichts zu scrollen: Der Körper steht
  währenddessen auf `position: fixed`.
- **`h-dvh` statt `h-full`.** Ein modaler Dialog rechnet `100 %` gegen den
  *großen* Darstellungsbereich; in iOS Safari liegt die Bedienleiste darüber
  und die Pfeilreihe am Fuß verschwindet darunter.
- **Aussparungsschutz** am Kreuz (`max(1rem, env(safe-area-inset-top/right))`)
  und an der Pfeilreihe (`max(1.5rem, env(safe-area-inset-bottom))`).

Gemessen danach bei 390 × 844 und 1512 × 900: Wisch links 1/6 → 2/6, Wisch
rechts zurück, Wisch nach unten schließt, Tipp schließt, Kreuz schließt,
Escape schließt – und in jedem der fünf Fälle steht die Seite wieder auf
ihrer alten Höhe (260 → 260 px), `position` des Körpers zurück auf `static`.
Kein Überlauf, keine Konsolenfehler.

**Eine Falle nebenbei:** Ein laufender `next start` auf 4312 liefert nach
einem Neubau unformatierte Seiten – er hält den Build-Manifest vom Start in
der Hand, und die CSS-Bündel haben beim Neubau andere Namen bekommen. Sieht
aus wie ein kaputtes Stylesheet, ist ein alter Prozess. Nach jedem
`npm run build` den Server neu starten.

## Hochformat im Kopfbereich am Telefon — 23.09.2026

Auf Ansage („nimm das fürs handy hero"), mit einer eigenen Aufnahme des
Betreibers. Sie behebt zugleich den schwersten Befund des Gremiums vom selben
Tag.

**Es waren zwei Fehler, und beide hingen am Querformat.** Gemessen bei
390 × 844: Die 16:10-Aufnahme lag als Band von 390 × 220 px in einer 644 px
hohen Bühne — 66 % darüber leere Tinte, die drei Fahrzeuge 108 px hoch
(12,8 % der Bildhöhe), das linke Drittel leere Halle. Und die Bildfläche hing
am Fensterboden, der Text am Fensterkopf: **+100 px Fensterhöhe = +100 px
Bildversatz bei +10 px Textversatz**, über sechs Telefonformate eine Spanne
von 257 px gegen 36 px. Das war das „Rumrutschen", wörtlich.

- **`hero-fahrzeuge-hoch.jpg` ist eine eigene Aufnahme, kein Zuschnitt.**
  941 × 1672 aus ChatGPT (C2PA-Manifest in der Quelldatei), ausgeliefert auf
  1400 px gerechnet (`lanczos3` plus Unschärfemaske, q92, 4:4:4). Ein
  Zuschnitt des Querformats geht nicht: Die drei Fahrzeuge stehen dort
  nebeneinander und brauchen 60 % der Bildbreite. Der Pfad steht in
  `lib/data/generated-images.ts` — die Kennzeichnung ist Pflicht wie bei den
  anderen acht.
- **Gemessen an der Kantenenergie stehen die Fahrzeuge zwischen 34 % und
  79 % der Bildhöhe.** Die oberen 30 % sind dunkle Decke mit zwei
  Leuchtbändern, also der Grund, den Überschrift und Beleg brauchen. Der Text
  steht jetzt *auf* dem Motiv statt daneben auf leerer Tinte.
- **Die Bildfläche hängt an ihrer Breite, nicht an der Fensterhöhe.** Das ist
  der Riegel gegen das Rutschen: `aspect-[941/1672]` plus `bottom-0`. Die
  Höhe folgt allein der Breite, der Werkstattboden steht immer auf derselben
  Linie über dem Kennzahlenband, die gewonnene Strecke wird oben zu Tinte.
  Gemessen nach dem Umbau: Bildmaß bei +100 px Fensterhöhe unverändert
  (390 × 694 → 390 × 693), vorher wuchs es von 644 auf 744.
- **`<picture>` mit Medienabfrage statt zweier `<Image>`.** Bisher trugen
  Telefon- und Schreibtischfläche *dieselbe* Datei mit derselben
  `sizes`-Angabe — deshalb war es eine Anfrage, gleich welche sichtbar war.
  Zwei verschiedene Dateien holt der Browser beide: `hidden` hält ein Bild
  nicht vom Laden ab, und `priority` schreibt ein `<link rel="preload">` in
  den Kopf, das keine CSS-Klasse kennt. Die Kandidaten kommen aus
  `getImageProps`, es wird also nichts an Nexts Optimierung vorbeigebaut.
  **Wo eine Fläche auf einer Breite kein Motiv tragen soll, steht ein
  transparentes Pixel als Datenadresse** (`BLANK`) — ein `<img>` lädt sonst
  immer etwas. Gemessen: genau eine Bildanfrage je Breite (390/430 das
  Hochformat, 768/1512 das Querformat).
- **`images.qualities` in `next.config.ts`.** Next 16 nimmt `quality` am
  `<Image>` nur an, wenn der Wert dort steht, und fällt sonst **stumm** auf
  75 zurück. Gemessen vorher: beide Kopfbilder trugen `quality={90}`,
  ausgeliefert wurde auf jeder Breite `q=75`. Der Eintrag vom 23.09. („214
  statt 138 kB") beschrieb einen Zustand, den der Build nie hatte. Wer an
  einem Grad-Token für Bilder schraubt, prüft die ausgelieferte URL.
- **Der Bühnenverlauf hat einen eigenen Streifen für die Kopfzeile bekommen**
  (88 % bei 0, 62 % bei 4,5 rem, aus bei 8 rem). Grund: Mit dem Hochformat
  reicht die Aufnahme bis an den oberen Rand der Bühne, und je kürzer das
  Fenster, desto weiter oben steht das Motiv darin. Gemessen bei 320 × 568
  lag der grüne Lenkergriff hinter dem Wortzeichen — **1,2:1**. Danach
  8,0:1; bei 360 bis 430 px stand dort ohnehin die dunkle Decke, der Streifen
  kostet dort nichts.
- **Die KI-Marke steht unter 360 px wieder höher** (`bottom-[25%]`). Bei
  320 px ist die Bühne nur rund 412 px hoch, und `bottom-6` setzte sie
  gemessen auf dieselbe Zeile wie „37 Rezensionen bei Google".

**Gemessene Kontraste** (Text ausgeblendet, hellster Punkt im Zeilenkasten,
Weiß darauf): Wortzeichen 8,0 / 19,3 / 19,0 / 18,5:1 und H1 5,0 / 4,6 / 6,8 /
10,0:1 bei 320 / 360 / 390 / 430 px, Google-Zeile überall über 14:1.

**320 × 568 bleibt die bekannte Ausnahme:** Dort läuft die H1 über vier
Zeilen und die letzte Kennzahlenreihe steht unter der Falz.

## Kennzahlen auf dem Bild, Bühne an der Sektion — 24.09.2026

Auf Ansage („handy hero ist immer noch verschoben, das Bild … und ruckelt",
danach „setz die zahlen auf das bild, rutsch das bild runter, sodass alles
stimmig aussieht"). Es war beides dieselbe Ursache.

**Die Bühne endete am Fuß der Bildzone, nicht an der Sektion.** Die Bildzone
ist `flex-1` an einer Sektion mit `min-h-svh`; ändert sich die Fensterhöhe,
wächst die Zone, und die unten verankerte Aufnahme wandert mit. Gemessen bei
390 px Breite: 844 → 924 px Fensterhöhe verschob die Aufnahme um volle 80 px,
während die Überschrift stand. Das ist das „Verschieben", und es war kein
Rest der alten Ladeanimation — die ist seit dem 23.09. weg.

- **Die Bühne hängt jetzt an der Sektion** (`absolute inset-y-0` als
  Geschwister der Bildzone statt Kind). Aufnahme und Kennzahlenband hängen
  damit an derselben Unterkante: Gemessen über 780, 844, 924 und 1200 px
  Fensterhöhe bleibt der Abstand zwischen Bildunterkante und Bandfuß
  konstant bei 40 px. Vorher liefen beide auseinander.
- **Die Zahlen liegen dadurch auf dem Werkstattboden.** Die Aufnahme reicht
  bis an die Unterkante der Sektion; die Fahrzeuge enden bei 79 % der
  Bildhöhe, darunter ist nur noch spiegelnder Boden. Gemessen bei 390 px ist
  die Aufnahme 200 px nach unten gerückt (Oberkante −49 → 151).
- **Ab `sm` ändert sich nichts.** Dort ist die Bühne ein Band fester Höhe am
  oberen Rand, und der obere Rand von Sektion und Bildzone ist derselbe.
  Gemessene Sektionshöhen bei 640, 768, 1024, 1280, 1512, 1920, 2560 und
  3440 px unverändert.

**Der Schleier unter dem Band rechnet in rem vom Fuß, nicht in Prozent.** Der
alte Auslauf (`transparent 92%` → Tinte) war auf eine Bühne gerechnet, die am
Kennzahlenband endete. Die Höhe des Bandes hängt an der Schrift (200 px bei
390, 218 bei 320) und nicht an der Fensterhöhe — ein Prozentwert liefe bei
jeder anderen Fensterhöhe an einer anderen Stelle vorbei. Jetzt volle Deckung
über 13 rem, Übergang bis 18 rem.

- **75 % Tinte sind gemessen.** Ohne Schleier steht Weiß hinter dem Band auf
  1,6:1 und Neon auf 1,2:1 — die hellste Stelle ist eine Spiegelung auf dem
  Reifen. Mit 75 % sind es 6,9 bis 10,0:1 für die Beschriftung und 5,1 bis
  7,5:1 für die Zahlen; der ungünstigste Fall ist 360 × 780, weil dort das
  Vorderrad hinter der ersten Kennzahl steht.
- **88 % waren der erste Versuch und zu viel.** Bei 15:1 ist vom Boden nichts
  mehr zu sehen — dann hätte das Band auch auf reiner Tinte stehen können,
  und genau das sollte weg.

**Die KI-Marke steht unten rechts im Streifen unter der letzten
Kennzahlenzeile.** Gemessen bei 390 px endet die Beschriftung bei 804 px und
die Sektion bei 844 — dort liegen 40 px, in denen nichts steht. Der frühere
Sonderfall unter 360 px (`bottom-[25%]`) ist weg; er war der Behelf gegen
eine Bühne, die am Kennzahlenband endete. Geprüft auf 320, 360, 390, 412,
430 und 390 × 1200: keine Überschneidung mit einer Beschriftung.

99 Prüfungen über elf Routen × neun Formate: kein Überlauf, genau eine H1 je
Route, keine Konsolenfehler, keine Schrift unter 11 px. **320 × 568 bleibt
die bekannte Ausnahme** — dort läuft die H1 vier Zeilen und die letzte
Kennzahlenreihe steht unter der Falz.

## Kopfbereich am Schreibtisch, Karte, Tabelle — 24.09.2026

Sieben Ansagen an einem Stück, alle mit Aufnahme.

**Der Kopfbereich nutzt jetzt die ganze Fläche.** Ansage: „du sollst die
gesamte Fläche nutzen und das Bild größer machen und die Schrift weiter nach
oben setzen."

- **Die Bildfläche hängt nicht mehr am 104-rem-Deckel, sondern am Fenster**
  (`w-[74vw]` statt `w-[74%]` einer auf `max-w-[104rem]` gedeckelten Fläche).
  Gemessen wuchs das Motiv damit von 1231 px auf 1421 (1920), 1894 (2560) und
  2546 px (3440); bei 1512 und darunter ändert sich **nichts** – dort war das
  Fenster ohnehin schmaler als der Deckel.
- **Das ist eine bewusste Ausnahme von der Regel „Motive bindet man an
  `Container`, nicht ans Fenster"** (19.08.2026). Die Regel entstand an einem
  anderen Fall: Damals lag die Aufnahme `contain` und hing an der *Zonenhöhe*,
  klebte deshalb am rechten Fensterrand und ließ 1400 px schwarze Fläche
  zwischen sich und dem Text. Heute hängt sie an ihrer Breite und skaliert
  mit – der Abstand zum Text bleibt anteilig gleich, gleich wie breit das
  Fenster ist. Wer die Fläche wieder deckelt, bekommt auf 2560 px ein Motiv,
  das nur noch die Hälfte der Fläche einnimmt.
- **Ein zwischenzeitlicher Versuch, den Text vertikal zu zentrieren, ist
  zurückgenommen.** Er halbierte zwar die gemessene Lücke zwischen Beleg und
  Kennzahlenband (696 → 369 px bei 2560), schob dafür aber die Überschrift
  auf halbe Fensterhöhe – und ließ oben 300 px leere Tinte stehen. Die
  Beschwerde danach war eindeutig. Die Lücke war nie das Problem, die
  Bildgröße war es.
- **Das Motiv steht 4 vw vom rechten Rand ab und läuft dort weich aus**
  (`right-[4vw]`, Maske `black calc(100% - 4rem), transparent`). Vorher stieß
  es bündig an die Fensterkante, während es links über 16 rem auslief – eine
  harte Kante auf der einen, ein Auslauf auf der anderen Seite. Die 4 rem
  sind gerechnet: Das rechte Fahrzeug endet bei 93 % der Bildbreite, der
  Auslauf beginnt bei rund 95,5 %.
- **Kontrast nachgemessen** (Textcontainer und Kopfzeile ausgeblendet,
  hellster Punkt im Zeilenkasten) über 1280 bis 3440 px: überall 19,9:1 –
  hinter dem Text steht auf jeder Breite reine Tinte. **Achtung bei dieser
  Messung:** Einzelne Elemente auf `visibility: hidden` zu setzen reicht
  nicht. Der Neongrund der Wortmarkierung, die goldenen Sterne und die
  Kürzelkreise bleiben dann in der Stichprobe stehen, und man misst 2:1, wo
  20:1 stehen. Es muss der ganze Textcontainer verschwinden.

**Bestandskarte, Plakette, Tabelle:**

- **Der Kartenfuß ist eine eigene Fläche.** Datenband und „Mehr Daten" lagen
  als flache Liste im selben Grund wie der Text darüber, und die Haarlinien
  des Bands waren die einzige Struktur – zugleich das schwächste Element der
  Karte. Jetzt 3,5 % Silber auf Tinte, bis an die Kartenränder, unten mit dem
  Kartenradius. Die Karte liest sich in drei Zonen: das Gerät, was es ist,
  was es kann. Der Radius ist `calc(var(--radius-lg) - 1px)` – die Fläche
  liegt innerhalb des 1-px-Rahmens, sonst steht an der Rundung ein dunkler
  Sichel.
- **Die Karte antwortet beim Überfahren jetzt sichtbar** (`hover:border-neon/45`
  zusätzlich zur Anhebung).
- **Die Neu-Plakette ist 77 × 36 statt 44 × 24 px**, mit Funke-Zeichen und
  Ring in Tinte. Der Ring ist Pflicht und kein Zierrat: Die Aufnahmen sind
  Telefonfotos vor einer hellen Containerwand, und Neon auf Hellgrau steht
  bei 1,18:1 – ohne dunkle Kante verschwand der Chip auf der oberen
  Bildhälfte. Die Plakette für „reserviert"/„verkauft" ist mitgewachsen:
  Zwei Zustände, die sich ausschließen, dürfen nicht verschieden groß sein.
- **Die Vergleichstabelle auf `/finanzierung` markiert die Zeile unter dem
  Zeiger jetzt in Neon** (`bg-neon/[0.14]`, Neonkante links als innerer
  Schatten, Beschriftung auf volle Tinte). Vorher ging sie von `silver` auf
  `silver-200` – Grau auf Grau, bei der ungeraden Zeile unter drei Prozent
  Unterschied, und ohne Übergang, weil `transition-colors` nur an den Zellen
  stand und nicht an der Beschriftungsspalte. **Kein Verstoß gegen die
  Farbregel:** Neon ist auf hellen Flächen Fläche und nie Schrift, und die
  „drei Aufgaben" gelten der dauerhaften Auszeichnung – ein Zustand, der nur
  existiert, solange ein Zeiger daraufsteht, zeichnet nichts aus. Die Kante
  steht als `box-shadow: inset`, ein Rahmen schöbe die Zeile um zwei Pixel.

**Text und Flächen:**

- **Die Eckdaten auf `/ueber-uns` stehen auf Tinte.** Vorher ein heller
  Kasten mit Haarlinie auf hellem Grund: kein Ton, keine Farbe, keine
  Bewegung. Jetzt die Form der Preisanker-Karte von `/reparatur` – zwei
  Kennzahlenkarten auf einer Website müssen gleich aussehen, sonst sind es
  zwei Bausteine. Die harte Zahl „über 500" steht im Statgrad in Neon; auf
  Silber wäre das mit 1,18:1 verboten, und **das ist der zweite Grund für den
  Flächenwechsel, nicht nur der optische.** Die Zeilen sind gestapelt und
  nicht zweiendig wie im Vorbild: Dort stehen rechts Beträge, hier ganze
  Sätze, und gemessen brach die längste unter ihr eigenes Etikett.
- **Neu `.rule-draw`** – eine Linie, die von links einläuft, scroll-getrieben
  wie `.chain-draw`. Dieselben drei Fallen wie dort: `animation-duration: auto`
  als eigene Zeile, keine `animation-range`-Kurzform (Lightning CSS zieht sie
  falsch zusammen), `transform-origin: left`.
- **„Vier Schritte, keine Überraschungen." heißt jetzt „Vier Schritte. Der
  Preis steht vor der Arbeit."** Der alte Nachsatz war ein Versprechen, kein
  Sachverhalt; die Auszeichnungszeile darüber sagt ohnehin schon, dass ein
  Ablauf folgt. Die neue Fassung trägt die Zusage, die Schritt 03 wörtlich
  einlöst. Gemessen zweizeilig auf 390, 768 und 1512 px.
- **Der Hinweis „Noch kein Modell/Vertrag gewählt …" ist weg**, auf beiden
  Seiten. Er erklärte ein Formular, das direkt darunter steht und sich selbst
  erklärt: Das Anliegen ist dort ein Pflichtfeld mit sichtbarer Beschriftung.
  Ein Satz, der einen leeren Zustand kommentiert, macht aus dem Normalfall
  einen Mangel. `ChosenLine` hat dafür sein `empty`-Prop verloren und gibt
  ohne Wahl `null` zurück; die Zeile *mit* Wahl bleibt – sie ist die
  Rückmeldung auf einen Druck drei Felder weiter oben.

Gemessen: 99 Prüfungen über elf Routen × neun Formate – kein Überlauf, genau
eine H1 je Route, kein Bild ohne `alt`, keine Konsolenfehler, keine Schrift
unter 11 px.

**Die H1 der Startseite ist größer — 24.09.2026, auf Ansage.** `--text-hero`
steigt jetzt mit `6vw + 0,15rem` und ist bei `6,5rem` gedeckelt (vorher
`5,2vw + 0,4rem`, Deckel `5,6rem`). Gemessen 85 → 93 px bei 1512 und 90 →
104 px ab 1693 px.

- **Der Boden bleibt bei 2,125 rem, und der Punkt, an dem der Anstieg ihn
  überholt, bleibt bei rund 530 px.** Das ist die Bedingung, unter der man
  an diesem Token überhaupt drehen darf: Am Telefon hängt an den 34 px der
  ganze Schriftleiter (34 / 26 / 24 / 19), und der ist gemessen, nicht
  gewählt. Wer nur den Anstieg anhebt, verschiebt den Übergang nach links
  und macht die Überschrift auf dem Telefon mit.
- **Der Deckel ist der Satz, nicht ein runder Wert.** „Geprüfte E-Scooter"
  misst 8,9 mal den Schriftgrad; die Überschriftenspalte ist ab 1920 px
  1033 px breit (acht Spalten, vom 104-rem-Deckel des Containers begrenzt).
  Über 116 px bricht die erste Zeile um, 104 lassen zehn Prozent Luft.
- **Die Höhe zahlt die Bildzone, nicht das Kennzahlenband.** Die Sektion
  steht ab `lg` auf `min-h-svh` und die Bildzone auf `flex-1`; gemessen
  liegt die Unterkante der Kennzahlen jetzt bei 744 (1280 × 800), 724
  (1440 × 780) und 734 px (1512 × 790) — also näher an der Falz als vorher,
  aber darüber. Die Bildmaße sind unverändert, weil die Bildfläche an ihrer
  Breite hängt.
- Zwei Zeilen auf jeder Breite von 360 bis 3440 px. **320 × 568 bleibt die
  bekannte Ausnahme** (vier Zeilen, letzte Kennzahlenreihe unter der Falz).
- Kontrast über 1280 bis 3440 px unverändert 19,9:1 — hinter der
  Überschrift steht auf jeder Breite reine Tinte.

**Die ABE-Warnung ist eine Plakette oben rechts — 24.09.2026, in zwei
Runden auf Ansage.** Sie lag als flacher Bernsteinstreifen mit einem Satz im
11-px-Grad am unteren Bildrand und las sich damit wie eine Bildunterschrift —
also wie eine Angabe zum Foto, nicht wie eine Einschränkung des Geräts.

Der erste Anlauf war ein Streifen über die volle Bildbreite mit Warnbake,
Überschrift und Satz. Er war unübersehbar, und genau das war sein Fehler:
71 bis 86 px hoch verdeckte er das untere Viertel der Aufnahme, und auf den
beiden betroffenen Karten war der Warnhinweis das größte Element — größer
als Modellname und Preis zusammen. Ansage danach: „oben rechts und
minimalistischer".

- **Sie steht jetzt gegenüber der Plakette für „Neu" und „Reserviert", in
  derselben Geometrie** — Pille, Ring in Tinte, Zeichen plus Wort —, nur in
  Bernstein und mit dem Warndreieck statt dem Funken. Zwei Plaketten mit
  derselben Aufgabe dürfen nicht verschieden aussehen. Der Ring ist hier
  aus demselben Grund Pflicht wie dort: Die Aufnahmen sind Telefonfotos vor
  einer hellen Containerwand.
- **Gemessen 188 × 20 px auf jeder Breite.** Der engste Fall ist nicht die
  kleinste Fensterbreite, sondern 640 px: Dort ist die Karte zweispaltig und
  das Bild nur 250 px breit. Mit 14 px Grad wären es 224 px gewesen und die
  Plakette hätte fast die ganze Bildbreite eingenommen.
- **Der volle Wortlaut ist nicht verschwunden.** Er steht als `sr-only` an
  der Plakette, in der Zulassungszelle des Datenbands („Keine ABE", in
  Bernstein) und auf der Geräteseite als eigener Absatz mit Begründung und
  erlaubter Nutzung. Was der Eintrag unter „Offene Punkte" verlangt, ist die
  sichtbare Kennzeichnung der beiden Ausnahmen — nicht eine bestimmte Größe
  des Kastens.
- **Der Bildzähler steht wieder auf `bottom-3`.** Sein `bottom-11` war der
  Behelf gegen den Streifen und ist mit ihm weg.
- **Die Zeilenkarte am Telefon trägt die Warnung weiter als Zeile**, jetzt
  mit demselben Zeichen und derselben Fläche: Auf einem 115 px breiten Bild
  ist für eine Plakette kein Platz.
- Gemessen 320 – 1920 px über `/e-scooter` und `/`: Karten eines Rasters
  weiter gleich hoch, kein Überlauf, keine Konsolenfehler, keine Schrift
  unter 11 px.

## Gremium-Restliste abgearbeitet — 23.09.2026

Auf Ansage („arbeite alle die Punkte ab, die du meinst"). Es ist die Liste,
die das Gremium desselben Tages hinterlassen hatte und die bis dahin nur als
Bericht existierte. Gemessen wurde jeweils vorher und nachher gegen den
Produktionsbuild auf Port 4312.

**Rückmeldung und Bewegung:**

- **`.press` lag vollständig in `prefers-reduced-motion: no-preference`.**
  Wer die Bedienungshilfe eingeschaltet hat – viele dauerhaft, wegen
  Reisekrankheit –, drückte auf 36 Schaltflächen ohne jede Antwort. Die
  Einstellung verlangt, *Bewegung* zu vermeiden, nicht Rückmeldung: Bei
  `reduce` trägt jetzt `opacity: 0.68` über 120 ms. Eine Deckkraftänderung
  hat keinen Vektor, dem das Auge folgt, und sie kennt weder Tinte noch
  Silber – ein Farbwechsel müsste beide Flächen kennen.
- **Das Zitatband lief auf der ganzen Seitenlänge**, auch acht
  Bildschirmhöhen unter der Falz. Es hält jetzt an, solange es nicht im Bild
  ist (`IntersectionObserver`, 300 px Vorlauf, damit man das Anhalten nicht
  sieht). Gemessen bei 390 px und vierfach gedrosselter CPU über 40
  Scrollschritte: Stilberechnung 0,033 → 0,015 s, Skriptzeit 0,018 → 0,012 s,
  Layout halbiert.
  - **`Marquee` ist dafür ein Client-Bauteil geworden.** Die Kinder kommen
    weiter fertig vom Server als `children` – dieselbe Regel wie beim
    Bestandsfilter.
  - **Die Pause hängt an `data-offscreen` am Container und wird über
    `group-data-[…]` gelesen, nicht als Klasse an der Spur.** Erster Versuch
    war eine schlichte Klasse `[animation-play-state:paused]`, und sie tat
    nichts: `animation` ist eine Kurzschreibweise und setzt den Zustand auf
    `running` zurück; bei gleicher Spezifität gewinnt die spätere Regel, und
    im gebauten Bündel steht `animate-[marquee…]` dahinter. Nachgesehen mit
    `grep -o "animation-play-state:paused" .next/static/chunks/*.css`.
    Derselbe Fallstrick steht seit jeher am Bauteil – für die *Laufrichtung*.
    `group-hover` funktionierte nur deshalb, weil die Variante einen zweiten
    Klassenselektor mitbringt.

**Untere Aktionsleiste:**

- **Keine Hysterese und eine wandernde Bezugshöhe.** `window.innerHeight`
  ist in iOS Safari keine Konstante – die Adressleiste ändert sie um rund
  15 %, gemessen wanderte die Schwelle bei 390 × 844 zwischen 365 und
  464 px, und zwar während man sich ihr nähert. Jetzt wird die Höhe einmal
  gemerkt (neu nur bei über 25 % Änderung, also Drehen des Geräts), und die
  Schwelle hat zwei Werte: herein bei 55 %, hinaus bei 45 %. Gemessen über
  zwölf Sprünge um die Schwelle: **1 Zustandswechsel statt 9.**

**Galerie:**

- **`setPointerCapture` fehlte.** Eine Wischgeste über 44 px endet
  regelmäßig außerhalb des Rahmens; ohne Fang ging das `pointerup` an das
  Element darunter und die Geste kam nie an. Gemessen mit einem Wisch, der
  160 px weit aus dem Rahmen läuft: vorher nichts, jetzt Bild 1 → 2. Im
  Vollbild noch wichtiger – der Wisch nach unten endet naturgemäß am Rand.
- **Alle sechs Bilder lagen im Baum** (1454 kB, rund 37 MB Textur), und zwar
  vollständig beim Aufruf. Jetzt ein Fenster aus aktivem Bild und beiden
  Nachbarn: **3 statt 6.** Kein Aufblitzen möglich, weil der jeweils nächste
  immer schon steht; das Vollbild rendert ohnehin nur das aktive.
- Aussparungsschutz seitlich im Vollbild (Bild und Pfeilreihe).

**`--header-block` ist neu — und das eine Token für die Kopf*kante*:**

- `--header-h` ist die Höhe der Leiste; der `<header>` trägt darüber hinaus
  `pt-[env(safe-area-inset-top)]`. Vier Stellen rechneten trotzdem gegen
  `--header-h`: `scroll-padding-top`, der Kopfabstand jedes Unterseitenkopfs,
  die Höhe der Menütafel und der `ScrollManager`. Im Browser stimmt das –
  die Aussparung ist dort null, und **genau deshalb fällt es in keiner
  Prüfung auf**. Läuft die Seite vom Startbildschirm als eigenes Fenster,
  landet jedes Sprungziel 59 px zu hoch, also hinter der Kopfzeile.
- **Der `ScrollManager` liest jetzt gar kein Token mehr, sondern misst den
  `<header>`.** `--header-block` ließe sich dort nicht lesen: Eine Custom
  Property kommt als `calc(4.5rem + …)` zurück, `parseFloat` liefert darauf
  `NaN`. Das Element kennt die Antwort ohne zweite Rechnung.
- Wer die Leiste selbst bemisst, nimmt weiter `--header-h` (nur noch die
  Kopfzeile tut das).

**Maße und Abstände:**

- **Die letzten zwei `vh` sind weg** (`device-page.tsx`): Ein Spaltendeckel
  an `vh` folgt der Adressleiste, die Galerie wurde beim Scrollen größer und
  kleiner. Jetzt `svh`.
- **Zwei Wischbahnen hatten feste 24-px-Ränder statt `.gutter`**
  (Gerätebahn im Startseiten-Teaser, Filterzeile der Bestandsseite). Im
  Querformat mit Aussparung brachen sie nicht weit genug aus dem Satzspiegel
  aus *und* standen gleichzeitig links vom Text.
- **`Workshop` → `Pillars` auf der Startseite steht auf `tight`.** Beide auf
  Tinte, also trägt nichts eine Zäsur – 128 px am Telefon und 208 auf 1512
  waren dort kein Absatz, sondern ein Loch. Dieselbe Regel wie bei `Region`.
- **Das Siegel füllte am Telefon die halbe Bildhöhe** (342 px bei 390,
  382 bei 430 – 41 bis 45 %), und zwar auf der Seite, auf der jemand Geräte
  sehen will. Unter `sm` auf 13 rem gedeckelt. Ein Zeichen, das so groß ist
  wie ein Produktfoto, behauptet, wichtiger zu sein als die Ware.
- **`min()` in `sizes` löst Chromium nicht auf.** Gemessen holte
  `min(28rem, calc(100vw - 5rem))` bei 768 px die 1920er-Fassung – der
  Browser fällt still auf `100vw` zurück. Reine Stufen wirken. **Wer hier
  eine `sizes`-Angabe schreibt, prüft die ausgelieferte URL** – dieselbe
  Lehre wie bei `images.qualities`.
- **`Gallery` hat keinen Vorgabewert für `sizes` mehr.** Der alte beschrieb
  ein dreispaltiges Raster, die Galerie steht aber in einer Spalte von
  höchstens 30 rem; der einzige Aufrufer überschrieb ihn ohnehin. Ein
  Vorgabewert, der nicht stimmt, ist ein Angebot an den nächsten Aufrufer,
  nicht nachzurechnen.

**Text:**

- **Fünf FAQ-Auszeichnungszeilen hießen „Häufige Fragen zur Versicherung"**
  und so weiter – das Thema wiederholte die Seite, auf der man steht, und
  die Zeile lief bei 390 px gesperrt über zwei Zeilen. Jetzt überall
  „Häufige Fragen", wie auf der Startseite schon.
- Dazu „Sofort verfügbar · Neuenstadt am Kocher" → „Sofort verfügbar" (der
  Ort steht auf derselben Seite in `Region`) und „Generalüberholt ·
  Skope-Qualitätssiegel" → „Generalüberholt" (beide Hälften stehen im Lead
  zwei Zeilen tiefer, das Siegel ist das Thema der Sektion darunter).
- `<Mark>im Bestand</Mark>` markierte zwei Wörter, davon eine Präposition.
  Die Farbregel erlaubt eines je Überschrift: jetzt `im <Mark>Bestand</Mark>`.
- **`autoCapitalize="words"` am Namensfeld.** iOS steht auf `sentences` und
  macht aus „max mustermann" ein „Max mustermann". Bei den übrigen Feldern
  nicht nötig – Safari schaltet die Großschreibung bei `type="email"` selbst
  ab.

**Bewusst nicht geändert, mit Grund:**

- **`.scroll-x` behält `overscroll-behavior-x: contain`.** Das Gremium will
  es an Bahnen freigeben, die bei `scrollLeft: 0` stehen, damit Safaris
  Zurück-Wisch durchkommt. Der Einwand ist nachvollziehbar, aber die Angabe
  steht aus einem gemessenen Grund da (ohne sie wird aus dem Wischen über
  eine Bahn ein Zurück-Blättern im Verlauf), und die Gegenprobe braucht ein
  echtes iPhone – im Prüfbrowser gibt es die Kantengeste nicht. Eine
  begründete Angabe auf Verdacht zurückzunehmen ist der schlechtere Handel.
- **Der helle Rahmen um das Porträt auf `/ueber-uns`** und **`align="center"`
  auf `/finanzierung`** sind beide dokumentierte Entscheidungen mit
  Begründung an Ort und Stelle.
- **„Werkstatt für Elektrokleinstfahrzeuge" auf `/reparatur`** läuft bei
  390 px weiter zweizeilig. Der Fachbegriff grenzt gegen Fahrrad und
  Motorrad ab und ist die Kategorie, unter der die Seite gefunden werden
  soll; zwei Zeilen sind hier der Preis für Präzision. Bei 320 px bleiben
  drei weitere zweizeilig – das ist die bekannte Ausnahmebreite, auf der
  auch die H1 der Startseite vier Zeilen läuft.

**Gemessen nach dem Durchgang:** 99 Prüfungen (11 Routen × 9 Formate,
320 – 1512 px plus Querformat) – kein waagerechter Überlauf, genau eine H1 je
Route, kein Bild ohne `alt`, keine Konsolenfehler, keine Schrift unter 11 px.
Einziger Treffer unter 44 px ist der Skip-Link (1 × 1 px im Ruhezustand,
200 × 52 im Fokus – das bekannte Messartefakt).

## Das Wandern des Kopfbilds am Telefon — 23.09.2026

Auf Ansage („das Bild startet zu weit oben und wandert dann nach unten").
Nicht der alte Rutschfehler mit der Adressleiste – der ist seit dem Umbau auf
das Hochformat weg (im Kopfbereich steht kein `vh` und kein `dvh` mehr). Es
war die **Ladeanimation**.

- **`.hero-figure` setzt voraus, dass ein Gegenstand in einer Fläche liegt.**
  Sie skaliert 3,5 % über 1,1 s mit Ursprung unten; am Schreibtisch kommt
  damit der freigestellte Roller auf seiner Standfläche zur Ruhe. Am Telefon
  füllt das Motiv die ganze Bühne, und dieselbe Skalierung verschiebt keinen
  Gegenstand, sondern den Bildausschnitt.
- **Gemessen bei 390 px:** Unterkante fest bei 643,8 px, Oberkante von −73,5
  auf −49,2 – die drei Fahrzeuge sinken 24,3 px, die Hälfte davon in den
  ersten 200 ms. Auf dem Tablet dieselbe Sorte Fehler mit 14,5 px.
- **Kleiner machen hilft nicht.** Unter 4 px Versatz bliebe eine Skalierung
  von 0,6 %: keine Bewegung mehr, nur noch eine Compositor-Ebene über dem
  LCP-Element. Einblenden über `opacity` scheidet aus demselben Grund aus wie
  am Schreibtisch – die Aufnahme ist der LCP-Kandidat, und `opacity` zählt
  erst am Ende der Animation als gezeichnet.
- **Die Klasse steht deshalb nur noch an der Fläche ab `lg`.** Unter `lg`
  trägt die Choreografie des Kopfbereichs allein der Text; das Motiv ist dort
  der Grund, auf dem er steht, und kein Gegenstand daneben.
- Gemessen über 320 / 360 / 390 / 430 / 768 / 1512 px: Wanderung 0 px bis
  einschließlich Tablet, am Schreibtisch unverändert 22 px. Sektionshöhen,
  Überlauf und Konsole unverändert.

## Tonkante unter den Kundenstimmen — 23.09.2026

Auf Ansage („entfern diese linie zwischen den bewertungen"). Es war kein
Rahmen, sondern eine **Tonstufe**: Auf `/ueber-uns` stand das Zitatband auf
Silber, `Region` darunter auf Silber-200 — die Kante zwischen beiden Flächen
las sich als waagerechter Strich quer unter den Zitatkarten.

- **Beide stehen jetzt im Standardton.** Damit trennt nichts mehr zwei
  Blöcke, die zusammengehören: was Kunden sagen und wo die Werkstatt liegt.
- **`Region` hat dafür ein `space`-Prop bekommen** und steht auf beiden
  Seiten auf `tight`. Ohne Tonwechsel trägt nichts eine Zäsur, also darf auch
  nicht der volle Abstand beider Sektionen stehen — das wäre kein Absatz,
  sondern ein Loch (das Gremium hatte auf der Startseite 128 px am Telefon
  gemessen). Gemessen danach 46 px am Telefon, 86 px auf 1512.
- Die Zäsur nach oben trägt auf `/ueber-uns` weiter die Kante zum Film auf
  Tinte.
- **Die Haarlinie über der Unterschrift in der Zitatkarte ist ebenfalls weg**
  (`border-t`, auf Nachfrage desselben Tages). Sie stand dort, weil Zitat und
  Unterschrift am Schreibtisch beide linksbündig laufen und die Linie die
  einzige Kante zwischen ihnen war. Auf der Karte ist sie aber der dritte
  waagerechte Strich neben Sternreihe und Kartenkante, und sie trennt zwei
  Teile derselben Aussage: was jemand geschrieben hat und wer es war. Der
  Innenabstand bleibt — ohne Linie ist er der Abstand zwischen Zitat und
  Unterschrift statt der Abstand zu ihr. Der frühere Eintrag unter
  „Kundenstimmen" („Am Schreibtisch bleibt sie") gilt damit nicht mehr.

## Drei Fließtexte entfernt — 23.09.2026

Auf Ansage, alle drei aus demselben Grund: Sie beschrieben, was unmittelbar
darunter zu sehen war.

- **Lead der Werkstattbahn** („Standort, Lager und Werkbank … keine
  Symbolbilder"). Die Herkunft trägt die Überschrift („fotografiert"), den
  Inhalt der `alt` jeder Aufnahme.
- **Lead über dem Erklärfilm** („Was hier passiert, wenn ein Gerät
  hereinkommt"). Er kündigte einen Film an, der sich in 35 Sekunden selbst
  erklärt.
- **Die Textalternative unter dem Film** steht nur noch als `sr-only` im
  Baum. **Ganz streichen geht nicht:** Der Film hat keine Tonspur, für
  jemanden, der ihn nicht sehen kann, gäbe es sonst nichts. Die
  KI-Offenlegung darunter bleibt sichtbar — sie in ein `sr-only` zu schieben
  wäre genau die Fußnote, die Art. 50 Abs. 4 ausschließt.

## Fixpunkt für das Kopfbild am Telefon — 25.09.2026

Auf Ansage („das Handy-Hero-Bild darf sich nicht bewegen, sondern soll einen
Fixpunkt haben"). Der Ladeverlauf war sauber — gemessen über 70 Frames nach
dem Aufruf genau **ein** Wert für Bildkasten und H1, die Choreografie ist seit
dem 23.09. vom Motiv genommen. Was wanderte, hing an der **Fensterhöhe**.

- **Die Aufnahme hing unten, der Text oben.** Die Bühne steht seit dem 24.09.
  an der Sektion, und die ist `min-h-svh`; die Bildfläche war darin
  `bottom-0`. Gemessen bei 390 px über 780 / 844 / 924 / 1000 px Fensterhöhe:
  Bildoberkante 87 → 151 → 231 → 307 px, H1 unverändert bei 148. **220 px
  Versatz gegen 12.** Auf einem Gerät ändert sich `svh` nicht, zwischen zwei
  Geräten aber sehr wohl — und genau das sah man im Vergleich.
- **Sie hängt jetzt oben, an `--hero-head`.** Das ist derselbe Wert, an dem
  der Satzspiegel hängt: Zwischen Überschrift und Fahrzeugen liegt damit auf
  jedem Telefon derselbe Abstand. Gemessen Bildoberkante / H1: 148/148 (390 ×
  844), 149/149 (393 × 852), 156/156 (412 × 915), 157/157 (430 × 932).
- **Der Riegel nach unten ist ein `min()`.** Die Aufnahme ist 1,7768 mal so
  hoch wie breit, über die volle Gehäusebreite also 177,68 vw. Passt sie
  unter `--hero-head` nicht mehr in die Sektion, gewinnt der zweite Term
  `calc(100% - 177.68vw)` und schiebt sie so weit hoch, dass sie genau auf
  der Unterkante aufsitzt. Ohne ihn wären auf einem kurzen Telefon die Räder
  abgeschnitten — gemessen 375 × 667: fester Kopfabstand hätte 131 px
  gekostet, so steht die Aufnahme bei 0,7 px und die Fahrzeuge enden bei 527.
  Im Bereich, in dem beide Terme greifen können (780 – 932 px Höhe), bleibt
  der Rest-Versatz unter 17 px.
- **Die Maske am Fuß gehört dazu** (`linear-gradient(to top, transparent,
  black 4rem)`, ab `sm` aus). Sobald der obere Term gewinnt, endet die
  Aufnahme über der Sektionskante; ohne Auslauf stünde dort eine waagerechte
  Naht in der Tinte.
- **Kontraste nachgemessen** (ganzer Textcontainer und Kopfzeile
  ausgeblendet, hellster Punkt im Zeilenkasten, Weiß darauf): H1 14,0 / 5,3 /
  4,9 / 5,0 / 4,9:1 bei 320 / 360 / 390 / 412 / 430 px, Kennzahlenband überall
  9,9 – 10,1:1.
- **390 × 1200 ist der eine Fall, in dem das Band nicht mehr auf dem Bild
  steht.** Dort endet die Aufnahme bei 853 und das Band beginnt bei 1000 —
  147 px Tinte dazwischen, vom Schleier getragen. Das ist kein Telefonformat,
  sondern eine Prüfbreite; der Fixpunkt ist der teurere und richtige Handel.

## Zwei Aufnahmen im Sicherheits-Checkup — 25.09.2026

Auf Ansage („füg das Bild ein bei ‚was bei 59,99 € passiert‘"), mit der
Aufnahme des durchgeschmorten Steckverbinders.

- **Die Sektion trägt jetzt zwei echte Aufnahmen**, `reparatur-trittbrett`
  und `reparatur-stecker`. Der Grund ist inhaltlich: Der Absatz zählt auf,
  was geprüft wird — Bremsen, Akku, Elektronik, Verschleißteile. Das
  geöffnete Trittbrett zeigt den Zugang, der verkohlte Steckverbinder den
  Befund. Einzeln belegt jede nur eine Hälfte des Satzes.
- **Die Anordnung folgt der Spaltenform, nicht der Fensterbreite.** Am
  Telefon ist die Spalte breit und flach: zwei Hochformate nebeneinander,
  gemessen je 165 × 206 px — zusammen 206 px statt der 428, die das eine
  4/5-Bild vorher brauchte. Ab `lg` ist die Spalte schmal und hoch und wird
  von der Textspalte bemessen: dort untereinander, je 608 × 408 px bei
  1512 px (`auto-rows-fr` an einer Fläche, die `flex-1` ist).
- **Die beiden Pfade stehen im Bauteil, nicht in `workshop-photos.ts`.** Jene
  Liste ist die Bahn auf `/ueber-uns` und wird zur Bauzeit gegen das
  Dateisystem geprüft — fehlt eine Datei, fällt sie dort still heraus. Hier
  wäre das falsch: Die Sektion hat einen festen Platz für zwei Motive, und
  eine Lücke darin ist ein Fehler, kein Rückfall. Die Beschreibungen sind
  wortgleich mit den Einträgen dort.
- **Kein `GeneratedMark`** — beide sind fotografiert.

## Lead des Bestands-Teasers entfernt — 25.09.2026

Auf Ansage. „Jeder Scooter ist ein Einzelstück und läuft vor dem Verkauf
durch dieselbe Werkstatt …" sagte, was die Karten darunter selbst tragen
(Zustand, Siegel, Gewährleistung), und die Prüfung ist das Thema von
`Workshop` eine Sektion tiefer. Am Telefon waren es vier Zeilen Fließtext
zwischen Überschrift und erster Kachel.
