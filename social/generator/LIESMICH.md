# Generator

Die Bilder werden nicht von Hand gesetzt, sondern gerendert. Wer eine Zahl,
eine Überschrift oder einen ganzen Beitrag ändert, ändert sie in
`week1.mjs` – nirgends sonst.

```bash
# einmalig, falls Playwright fehlt:
npm i playwright && npx playwright install chromium

# Bilder neu bauen (Woche 1)
node generator/render-week.mjs woche-01

# Bedienseite neu bauen
node generator/build-index.mjs .
```

- `week1.mjs` — die Inhalte: sieben Beiträge, sechs Stories, zwei Drehbücher.
- `slides.mjs` — die drei Karussells aus dem Vorrat (`kauf/`, `reparatur/`,
  `versicherung/`), gebaut mit `render-posts.mjs`.
- `render-week.mjs` — Satz und Aufnahme. Zwei Formate: Feed 1080 × 1350,
  Story und Reel-Titelbild 1080 × 1920, beide in doppelter Auflösung.
- `build-index.mjs` — erzeugt `index.html` aus denselben Daten. Deshalb kann
  die Bedienseite nicht von den Bildern abweichen.
- `logo-paths.json` — die vier Pfade des Wortzeichens aus
  `components/brand/logo.tsx`. Das Logo ist nicht nachgezeichnet.

**Für Woche 2:** `week1.mjs` nach `week2.mjs` kopieren, Inhalte ersetzen, in
`render-week.mjs` und `build-index.mjs` den Import umstellen und in einen
Ordner `woche-02` rendern. Das Gerüst der nächsten vier Wochen steht in
`../PLAN.md`, Abschnitt 9.
