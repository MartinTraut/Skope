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
