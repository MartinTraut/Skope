/* Woche 1 des Contentplans SKOPE.
   Jede Zahl ist entweder aus dem Repo belegt (lib/data/services.ts,
   insurance.ts, plans.ts, testimonials.ts, site.ts) oder steht als
   Annahme sichtbar auf der Folie. Nichts aus lib/inventory.ts. */

export const HASH = {
  kern: "#escooter #escootergebraucht #elektrokleinstfahrzeug #refurbished",
  ort: "#neuenstadtamkocher #heilbronn #neckarsulm #badfriedrichshall #moeckmuehl #hohenlohe",
  werkstatt: "#escooterwerkstatt #reparierenstattwegwerfen #werkstatt #diagnose",
  familie: "#familie #erstesfahrzeug #verkehrssicherheit #eltern",
  camper: "#camping #wohnmobil #vanlife #faltbar",
  geld: "#spritpreise #pendeln #arbeitsweg #sparen",
};

export const week = [
  /* ---------------------------------------------------------------- MONTAG */
  {
    id: "mo-regeln",
    day: "Montag",
    pillar: "Wissen",
    format: "Karussell",
    goal: "Speichern & Teilen. Der Post, den Eltern ihrem Kind schicken.",
    audience: "Eltern, die für ihr Kind kaufen",
    hook: "Darf mein Kind damit überhaupt fahren?",
    caption: `Die häufigste Frage, die bei uns im Laden gestellt wird – meistens von Eltern, nicht von den Kindern.

Sechs Regeln, die für jeden E-Scooter auf öffentlichen Wegen gelten. Danach weiß man, worauf man beim Kauf achtet: Betriebserlaubnis, Kennzeichen, und dass nachträgliches Tunen beides kostet.

Speicher dir den Beitrag, bevor du das nächste Angebot anschaust.

📍 SKOPE · Im Kampfrad 3, 74196 Neuenstadt am Kocher`,
    tags: [HASH.kern, HASH.familie, HASH.ort],
    slides: [
      { kind: "hook", kicker: "Recht & Regeln",
        head: ["Darf mein Kind", "damit überhaupt", "fahren?"],
        sub: "Sechs Regeln für den E-Scooter auf öffentlichen Wegen – ohne Paragraphendeutsch." },
      { kind: "point", n: "01", title: "Ab 14 Jahren",
        body: "Für den E-Scooter gibt es keine Führerscheinpflicht. Das Mindestalter liegt bei 14 Jahren.",
        stat: { v: "14", l: "Mindestalter in Jahren" } },
      { kind: "point", n: "02", title: "Ohne Kennzeichen geht nichts",
        body: "Das Versicherungskennzeichen gilt jeweils für eine Saison und muss am Gerät sein, bevor es auf den Radweg darf.",
        stat: { v: "ab 42 €", l: "Haftpflicht, volle Saison 2026/27" } },
      { kind: "point", n: "03", title: "20 km/h ist die Grenze",
        body: "Bauartbedingte Höchstgeschwindigkeit. Wer nachträglich tunt, verliert die Betriebserlaubnis – und mit ihr den Versicherungsschutz.",
        stat: { v: "20 km/h", l: "mehr ist keine Zulassung wert" } },
      { kind: "point", n: "04", title: "Radweg vor Fahrbahn",
        body: "Gibt es einen Radweg, gehört der Scooter dorthin. Der Gehweg ist tabu, und mitfahren darf niemand – auch nicht kurz." },
      { kind: "point", n: "05", title: "Alkohol zählt wie beim Auto",
        body: "0,5 Promille. In der Probezeit und unter 21 Jahren gilt 0,0. Der E-Scooter ist rechtlich ein Kraftfahrzeug." },
      { kind: "point", n: "06", title: "Die Betriebserlaubnis prüfen",
        body: "Sie liegt dem Gerät als Papier bei. Fehlt sie, gibt es kein Kennzeichen – und ein Import ohne ABE bleibt Privatgelände." },
      { kind: "cta", head: ["Das gehen wir", "am Gerät durch."],
        body: "Vor jedem Kauf: Betriebserlaubnis, Kennzeichen und Regeln gemeinsam angesehen. Danach fährt das Gerät legal." },
    ],
  },

  /* -------------------------------------------------------------- DIENSTAG */
  {
    id: "di-akku",
    day: "Dienstag",
    pillar: "Werkstatt",
    format: "Reel",
    goal: "Watchtime & Vertrauen. Zeigen, dass gemessen wird statt geraten.",
    audience: "Alle – Kauf- und Reparaturinteressierte",
    hook: "Der Akku sagt dir nicht die Wahrheit.",
    caption: `Die Restanzeige am Display zeigt die Spannung, nicht die Kapazität. Ein Akku kann 100 % anzeigen und nach acht Kilometern leer sein.

Deshalb messen wir vor jedem Verkauf und bei jeder Diagnose die tatsächliche Restkapazität. Der vollständige Sicherheits-Checkup kostet 59,99 € und prüft sechs Positionen.

Was war dein kürzester \u201evoller\u201c Akku? Schreib's in die Kommentare.`,
    tags: [HASH.kern, HASH.werkstatt, HASH.ort],
    reel: {
      laenge: "22–28 Sekunden, hochkant 9:16, ohne Sprache – Text im Bild",
      hookText: "Der Akku sagt dir nicht die Wahrheit.",
      szenen: [
        { t: "0:00–0:02", bild: "Display des Scooters, Akkuanzeige voll. Ganz nah, Hand hält den Lenker.", text: "100 %." },
        { t: "0:02–0:05", bild: "Schnitt: derselbe Scooter, Display nach acht Kilometern. Anzeige unten.", text: "Nach 8 km." },
        { t: "0:05–0:10", bild: "Werkstatt: Akku ausgebaut auf der Bank, Messgerät wird angeschlossen.", text: "Die Anzeige zeigt Spannung. Nicht Kapazität." },
        { t: "0:10–0:16", bild: "Nah auf das Display des Messgeräts, Zahl läuft hoch und steht.", text: "Gemessen wird, was wirklich drin ist." },
        { t: "0:16–0:22", bild: "Hände legen den Akku zurück, Gerät wird zugeklappt, Scooter steht fertig.", text: "Sicherheits-Checkup: 59,99 € · sechs Positionen" },
        { t: "0:22–0:26", bild: "Ruhiger Schluss: Scooter frontal, Logo unten eingeblendet.", text: "SKOPE · Im Kampfrad 3, Neuenstadt" },
      ],
      technik: "Handy reicht. Stativ oder feste Auflage, kein Zoomen. Licht von vorn, nicht von hinten. Vertonung: ruhiger Trend-Sound aus der Instagram-Bibliothek, leise – der Text trägt.",
      cover: true,
    },
    slides: [
      { kind: "cover", kicker: "Werkstatt",
        head: ["Der Akku", "sagt dir nicht", "die Wahrheit."],
        sub: "Warum 100 % auf dem Display nichts bedeuten." },
    ],
  },

  /* -------------------------------------------------------------- MITTWOCH */
  {
    id: "mi-kosten",
    day: "Mittwoch",
    pillar: "Rechnung",
    format: "Karussell",
    goal: "Reichweite über Nutzwert. Die Zahl, die man weitererzählt.",
    audience: "Pendler, Preisbewusste",
    hook: "100 km für 53 Cent.",
    caption: `Der Arbeitsweg ist der ehrlichste Rechner: Ein E-Scooter zieht rund 1,5 kWh auf 100 Kilometer. Bei 35 Cent je Kilowattstunde sind das 53 Cent.

Wir haben die Rechnung offengelegt, inklusive dem, was nicht drinsteht – Anschaffung, Verschleiß, Versicherung. Die Annahmen stehen auf den Folien, damit jeder mit seinen eigenen Zahlen nachrechnen kann.

Wie weit ist dein Arbeitsweg?

📍 SKOPE · Im Kampfrad 3, 74196 Neuenstadt am Kocher`,
    tags: [HASH.kern, HASH.geld, HASH.ort],
    slides: [
      { kind: "hook", kicker: "Die Rechnung",
        head: ["100 Kilometer", "für 53 Cent."],
        sub: "Was der Arbeitsweg mit dem E-Scooter wirklich kostet – mit offener Rechnung." },
      { kind: "compare", title: "Auf 100 Kilometer",
        left: { v: "0,53 €", l: "E-Scooter" },
        right: { v: "12,60 €", l: "Auto, Benziner" },
        note: "Annahme: 1,5 kWh je 100 km bei 0,35 €/kWh · 7,0 l je 100 km bei 1,80 €/l. Eigene Werte einsetzen – die Größenordnung bleibt." },
      { kind: "point", n: "01", title: "Wo die Zahl herkommt",
        body: "Ein 36-Volt-Akku mit 10 Ah fasst rund 0,36 kWh. Das reicht bei den meisten Geräten für 20 bis 25 Kilometer – vier Ladungen auf 100 km.",
        stat: { v: "1,5 kWh", l: "Strom je 100 Kilometer" } },
      { kind: "point", n: "02", title: "Was nicht drinsteht",
        body: "Verschleiß und Pflicht kommen dazu: Bremsbeläge ab 15 €, Reifenwechsel ab 25 € – und das Versicherungskennzeichen jede Saison.",
        stat: { v: "ab 42 €", l: "Haftpflicht je Saison" } },
      { kind: "point", n: "03", title: "Der größte Posten ist der Kauf",
        body: "Und genau dort spart ein aufbereitetes Gerät am meisten: geprüft, gemessen und mit einem Jahr Gewährleistung statt Neupreis.",
        stat: { v: "1 Jahr", l: "Gewährleistung auf jedes Gerät" } },
      { kind: "cta", head: ["Rechne deinen", "Weg durch."],
        body: "Sag uns, wie weit du fährst und wie oft. Wir sagen dir, welches Gerät dafür reicht – und welches zu groß wäre." },
    ],
  },

  /* ---------------------------------------------------------- DONNERSTAG */
  {
    id: "do-stimme",
    day: "Donnerstag",
    pillar: "Beweis",
    format: "Einzelbild",
    goal: "Vertrauen. Läuft auf ein Speichern hinaus, nicht auf Reichweite.",
    audience: "Alle, die schon mal auf dem Profil waren",
    hook: "Auch nach dem Kauf war Thomas immer für uns da.",
    caption: `Zwei Geräte, eine Familie, und die Betreuung hörte nicht an der Ladentür auf. Das ist eine von 37 Rezensionen im Google-Profil.

Wir verkaufen keine Sendungen aus einem Lager, sondern Einzelstücke aus der eigenen Werkstatt. Wer hier kauft, weiß hinterher, wen er anruft.

📍 SKOPE · Im Kampfrad 3, 74196 Neuenstadt am Kocher`,
    tags: [HASH.kern, HASH.ort],
    slides: [
      { kind: "quote",
        quote: "Wir haben dort 2 E-Scooter gekauft. Die Beratung war sehr nett. Auch nach dem Kauf war Thomas immer für uns da.",
        author: "Rezension im Google-Profil · Käufer",
        stat: { v: "5,0", l: "aus 37 Rezensionen" } },
    ],
  },

  /* -------------------------------------------------------------- FREITAG */
  {
    id: "fr-cta",
    day: "Freitag",
    pillar: "CTA",
    format: "Karussell",
    goal: "Anfragen. Der einzige Tag, an dem direkt gefragt wird.",
    audience: "Alle, die die Woche über mitgelesen haben",
    hook: "Wochenende. Zeit für einen Termin.",
    caption: `Wir arbeiten nach Vereinbarung – das heißt: kurz schreiben oder anrufen, dann steht das Gerät bereit und es wartet niemand.

Was ein Termin bei uns beantwortet: welches Gerät zu deiner Strecke passt, was eine Reparatur kosten würde, und ob sich das Kennzeichen für diese Saison noch lohnt.

Anfrage über die Website oder eine Nachricht hier – beides landet an derselben Stelle.

📍 Im Kampfrad 3, 74196 Neuenstadt am Kocher`,
    tags: [HASH.kern, HASH.ort, HASH.werkstatt],
    slides: [
      { kind: "hook", kicker: "Termin",
        head: ["Wochenende.", "Zeit für einen", "Termin."],
        sub: "Drei Sätze genügen, dann steht das Gerät bereit." },
      { kind: "point", n: "01", title: "Schreiben statt warten",
        body: "Marke, Modell und was das Gerät machen soll. Mehr brauchen wir für die erste Einschätzung nicht." },
      { kind: "point", n: "02", title: "Der Preis steht vorher fest",
        body: "Vor jeder Arbeit ein Kostenvoranschlag. Es wird nichts getauscht, was nicht freigegeben ist.",
        stat: { v: "59,99 €", l: "vollständige Diagnose, sechs Positionen" } },
      { kind: "point", n: "03", title: "Auch ohne Kauf",
        body: "Altgeräte nehmen wir kostenlos zurück – auch solche, die nicht bei uns gekauft wurden. Akkus gehen den vorgeschriebenen Weg." },
      { kind: "cta", head: ["Jetzt anfragen."],
        body: "Nach Vereinbarung, damit niemand vor verschlossener Tür steht. Anfrage über die Website oder direkt per Nachricht." },
    ],
  },

  /* -------------------------------------------------------------- SAMSTAG */
  {
    id: "sa-camper",
    day: "Samstag",
    pillar: "Zielgruppe",
    format: "Reel",
    goal: "Neue Reichweite in einer Nische, die kaum bedient wird.",
    audience: "Camper, Wohnmobil, ältere Paare",
    hook: "Passt der in die Heckgarage?",
    caption: `Die Frage kommt jedes Frühjahr: Passt so ein Scooter ins Wohnmobil – und trägt ihn meine Frau alleine die Stufe hoch?

Worauf es dabei ankommt, ist nicht die Reichweite, sondern Klappmaß und Gewicht. Beides messen wir am Gerät, bevor es mitgeht.

Wo steht ihr dieses Jahr?`,
    tags: [HASH.kern, HASH.camper, HASH.ort],
    reel: {
      laenge: "18–24 Sekunden, hochkant 9:16, ohne Sprache",
      hookText: "Passt der in die Heckgarage?",
      szenen: [
        { t: "0:00–0:03", bild: "Scooter aufgeklappt neben einem Maßband auf dem Boden, Draufsicht.", text: "Passt der in die Heckgarage?" },
        { t: "0:03–0:07", bild: "Eine Bewegung: Klappmechanik lösen, Lenker legt sich um. Nah, eine Einstellung.", text: "Ein Griff." },
        { t: "0:07–0:12", bild: "Maßband am zusammengeklappten Gerät, Länge und Höhe sichtbar.", text: "Klappmaß messen wir am Gerät." },
        { t: "0:12–0:17", bild: "Gerät wird einhändig angehoben, Personenwaage darunter oder Kofferwaage am Lenker.", text: "Und das Gewicht. Das ist die Frage, die wirklich zählt." },
        { t: "0:17–0:22", bild: "Scooter steht gefaltet, daneben ein Koffer als Größenvergleich. Logo eingeblendet.", text: "Wir messen vor dem Kauf. SKOPE · Neuenstadt" },
      ],
      technik: "Alles aus einer Höhe, Kamera auf einem Stuhl. Kein Schwenk. Wichtig: Maßband und Waage müssen lesbar sein – lieber einen Moment länger draufhalten.",
      cover: true,
    },
    slides: [
      { kind: "cover", kicker: "Unterwegs",
        head: ["Passt der in die", "Heckgarage?"],
        sub: "Klappmaß und Gewicht – die beiden Zahlen, die beim Camper zählen." },
    ],
  },

  /* -------------------------------------------------------------- SONNTAG */
  {
    id: "so-haltung",
    day: "Sonntag",
    pillar: "Haltung",
    format: "Einzelbild",
    goal: "Bindung. Der Post, unter dem diskutiert wird.",
    audience: "Bestandsfollower",
    hook: "Ein defekter E-Scooter ist kein Sperrmüll.",
    caption: `Motoren, Akkus und Rahmen sind Rohstoffe und Ersatzteile. Deshalb nehmen wir Altgeräte kostenlos zurück – auch die, die nicht bei uns gekauft wurden.

Was daraus noch brauchbar ist, geht zurück in die Werkstatt. Der Rest geht den vorgeschriebenen Weg: Akkus getrennt, Aluminium in den Kreislauf.

Ehrliche Frage in die Runde: Wie viele Geräte stehen bei euch im Keller, die seit Jahren nicht mehr laufen?`,
    tags: [HASH.kern, HASH.werkstatt, HASH.ort],
    slides: [
      { kind: "single", kicker: "Haltung",
        head: ["Ein defekter", "E-Scooter ist", "kein Sperrmüll."],
        sub: "Kostenlose Rücknahme, auch für Geräte, die nicht bei uns gekauft wurden." },
    ],
  },
];

/* Stories laufen neben den Beiträgen, ein bis zwei am Tag. Die Grafik ist
   nur der Untergrund – der Sticker (Umfrage, Quiz, Frage) wird in der
   Instagram-App daraufgesetzt, in die freigelassene untere Hälfte. */
export const stories = [
  { id: "st-01", day: "Montag", typ: "Umfrage",
    sticker: "Umfrage · Antworten: „Ja, wusste ich“ / „Nein, echt jetzt?“",
    kind: "story", kicker: "Umfrage",
    head: ["Wusstest du,", "dass Tunen", "die Zulassung", "kostet?"],
    hinweis: "Danach die Auflösung als zweite Story: Wer die bauartbedingte Höchstgeschwindigkeit verändert, verliert Betriebserlaubnis und Versicherungsschutz. Verweis auf den Montagsbeitrag." },
  { id: "st-02", day: "Dienstag", typ: "Quiz",
    sticker: "Quiz · „Wie viel Strom zieht ein E-Scooter auf 100 km?“ — 0,5 kWh / 1,5 kWh / 5 kWh (richtig: 1,5)",
    kind: "story", kicker: "Quiz",
    head: ["Wie viel Strom", "zieht er auf", "100 Kilometer?"],
    hinweis: "Auflösung mit dem Hinweis, dass die volle Rechnung am Mittwoch im Feed steht. Das zieht die Story-Zuschauer in den Beitrag." },
  { id: "st-03", day: "Mittwoch", typ: "Einblick",
    sticker: "Kein Sticker – reine Werkstattaufnahme mit dieser Grafik als erste Story davor",
    kind: "story", kicker: "Werkstatt",
    head: ["Heute auf", "der Bank."],
    hinweis: "Danach zwei bis drei echte Aufnahmen vom laufenden Auftrag: zerlegtes Gerät, Messgerät, fertiger Zustand. Keine Kundennamen, keine Kennzeichen im Bild." },
  { id: "st-04", day: "Donnerstag", typ: "Fragesticker",
    sticker: "Frage-Sticker · „Was wolltest du über E-Scooter schon immer wissen?“",
    kind: "story", kicker: "Fragen",
    head: ["Frag uns", "irgendwas", "über Scooter."],
    hinweis: "Die Antworten sind das Material für die nächsten Wochen. Jede Antwort als eigene Story, die beste Frage wird ein Karussell." },
  { id: "st-05", day: "Freitag", typ: "CTA",
    sticker: "Link-Sticker auf die Anfrageseite",
    kind: "story", kicker: "Termin",
    head: ["Termin fürs", "Wochenende?"],
    hinweis: "Link-Sticker direkt auf /kontakt#anfrage. Dazu eine zweite Story mit der Adresse und dem Standort-Sticker Neuenstadt am Kocher." },
  { id: "st-06", day: "Samstag", typ: "Persönlich",
    sticker: "Kein Sticker",
    kind: "story", kicker: "Hinter der Werkstatt",
    head: ["Samstag.", "Aufräumtag."],
    hinweis: "Eine ehrliche Aufnahme: volle Werkbank, sortierte Teile, Kaffeebecher. Menschen folgen Menschen – diese Story darf unperfekt sein." },
];
