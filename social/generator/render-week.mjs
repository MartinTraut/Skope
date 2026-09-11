import { chromium } from "playwright";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { week, stories } from "./week1.mjs";

const P = JSON.parse(readFileSync(new URL("./logo-paths.json", import.meta.url)));
const OUT = process.argv[2];

const FLIP = "translate(0,2508) scale(0.1,-0.1)";
const lockup = (h) => `<svg viewBox="99 555 2323 1160" fill="none" style="height:${h}px;width:auto">
  <g transform="${FLIP}"><path d="${P.SCOOTER_METAL}" fill="currentColor"/><path d="${P.TYPE_METAL}" fill="currentColor"/>
  <path d="${P.SCOOTER_NEON}" fill="#9ef605"/><path d="${P.TYPE_NEON}" fill="#9ef605"/></g></svg>`;
const wordmark = (h) => `<svg viewBox="99 1372 2323 343" fill="none" style="height:${h}px;width:auto">
  <g transform="${FLIP}"><path d="${P.TYPE_METAL}" fill="currentColor"/><path d="${P.TYPE_NEON}" fill="#9ef605"/></g></svg>`;

/* Zwei Formate: Feed 4:5 (das höchste, das Instagram ungeschnitten zeigt)
   und Story/Reel 9:16. Bei 9:16 bleiben oben 260 und unten 420 px frei –
   dort liegen in der App Profilzeile, Sticker und Antwortleiste. */
const SIZE = { post: [1080, 1350], story: [1080, 1920] };

const css = (W, H, pad) => `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@600;700&family=Inter:wght@400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;background:#08090b;color:#eef1f4;
  font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden}
.slide{position:relative;width:${W}px;height:${H}px;display:flex;flex-direction:column;padding:${pad};overflow:hidden}
.glow{position:absolute;inset:auto -280px auto auto;top:-320px;width:900px;height:900px;
  background:radial-gradient(circle,rgba(158,246,5,.20),rgba(158,246,5,.05) 45%,transparent 70%);pointer-events:none}
.top{display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1}
.kicker{font-family:'Instrument Sans',sans-serif;font-weight:600;font-size:24px;letter-spacing:.18em;
  text-transform:uppercase;color:rgba(238,241,244,.55)}
.rule{height:2px;width:56px;background:#9ef605;margin-right:20px;display:inline-block;vertical-align:middle}
.body{flex:1;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:1}
h1{font-family:'Instrument Sans',sans-serif;font-weight:700;letter-spacing:-.03em;font-size:118px;line-height:1.02}
h2{font-family:'Instrument Sans',sans-serif;font-weight:700;letter-spacing:-.025em;font-size:82px;line-height:1.05}
.sub{margin-top:40px;font-size:34px;line-height:1.45;color:rgba(238,241,244,.72);max-width:20ch}
p.txt{margin-top:32px;font-size:36px;line-height:1.5;color:rgba(238,241,244,.78);max-width:22ch}
.num{font-family:'Instrument Sans',sans-serif;font-weight:700;font-size:30px;letter-spacing:.12em;color:#9ef605;margin-bottom:28px}
.stat{margin-top:56px;padding-top:36px;border-top:1px solid rgba(238,241,244,.18)}
.stat .v{font-family:'Instrument Sans',sans-serif;font-weight:700;font-size:92px;letter-spacing:-.02em;
  color:#9ef605;line-height:1;font-variant-numeric:tabular-nums}
.stat .l{margin-top:14px;font-size:28px;color:rgba(238,241,244,.6)}
.foot{display:flex;align-items:flex-end;justify-content:space-between;position:relative;z-index:1}
.addr{font-size:26px;line-height:1.4;color:rgba(238,241,244,.45)}
.swipe{display:flex;align-items:center;gap:14px;font-family:'Instrument Sans',sans-serif;font-weight:600;
  font-size:26px;letter-spacing:.1em;text-transform:uppercase;color:#9ef605}
.dots{display:flex;gap:10px}
.dot{width:10px;height:10px;border-radius:99px;background:rgba(238,241,244,.25)}
.dot.on{background:#9ef605}
.ctabtn{margin-top:56px;display:inline-flex;align-items:center;gap:16px;align-self:flex-start;background:#9ef605;
  color:#08090b;font-family:'Instrument Sans',sans-serif;font-weight:700;font-size:34px;padding:26px 44px;border-radius:999px}
/* Vergleich: zwei Werte auf einer Waagerechten, dazwischen eine Haarlinie.
   Die Annahme steht unter den Zahlen und nicht in der Bildunterschrift –
   eine Zahl ohne ihre Rechnung ist eine Behauptung. */
.cmp{display:grid;grid-template-columns:1fr 1px 1fr;gap:0 48px;margin-top:56px;align-items:end}
.cmp .line{background:rgba(238,241,244,.18);align-self:stretch}
.cmp .v{font-family:'Instrument Sans',sans-serif;font-weight:700;font-size:104px;line-height:1;
  letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.cmp .a .v{color:#9ef605}
.cmp .b .v{color:rgba(238,241,244,.55)}
.cmp .l{margin-top:16px;font-size:30px;color:rgba(238,241,244,.6)}
.note{margin-top:56px;padding-top:28px;border-top:1px solid rgba(238,241,244,.14);
  font-size:24px;line-height:1.45;color:rgba(238,241,244,.45);max-width:34ch}
/* Zitat: das goldene Anführungszeichen wie auf der Website, nicht neon –
   Neon markiert Aktion und harte Zahl, ein Zitat ist keines von beiden. */
.mark{font-family:'Instrument Sans',sans-serif;font-weight:700;font-size:180px;line-height:.6;
  color:#d8b45a;height:96px}
blockquote{margin-top:48px;font-family:'Instrument Sans',sans-serif;font-weight:600;font-size:58px;
  line-height:1.22;letter-spacing:-.02em;max-width:19ch}
.by{margin-top:44px;font-size:28px;color:rgba(238,241,244,.55)}
/* 9:16: Der Text sitzt im oberen Drittel, darunter bleibt die Fläche für
   Sticker und Antwortleiste frei. */
.story .body{flex:0 0 auto;margin-top:120px}
.story h1{font-size:104px}
.story .sub{font-size:32px;max-width:18ch;margin-top:36px}
.story .spacer{flex:1}
`;

const dots = (i, n) => n < 2 ? "" :
  `<div class="dots">${Array.from({length:n},(_,k)=>`<span class="dot${k===i?" on":""}"></span>`).join("")}</div>`;
/* Wie noBreak() in lib/utils.ts: der Bindestrich in "E-Scooter" ist ein
   geschützter (U+2011), sonst steht auf der Folie "E-" allein am Zeilenende. */
const fix = (t) => String(t).replace(/E-Scooter/g, "E\u2011Scooter");
const lines = (t, a) => `<${t}>${a.map(l=>`<span style="display:block">${fix(l)}</span>`).join("")}</${t}>`;

function slideHtml(s, i, n, label) {
  const story = s.kind === "story" || s.kind === "cover";
  let top, body, foot;

  if (s.kind === "hook" || s.kind === "cover" || s.kind === "story" || s.kind === "single") {
    top = `<div class="top">${lockup(74)}${s.kicker?`<span class="kicker">${s.kicker}</span>`:""}</div>`;
    body = `<div class="body">${lines("h1", s.head)}${s.sub?`<div class="sub">${fix(s.sub)}</div>`:""}</div>`;
    foot = s.kind === "hook"
      ? `<div class="foot"><span class="swipe">Wischen &rarr;</span>${dots(i,n)}</div>`
      : `<div class="foot"><span class="addr">SKOPE &middot; Im Kampfrad 3<br>74196 Neuenstadt am Kocher</span></div>`;
    if (story) body = `<div class="spacer" style="flex:0 0 40px"></div>` + body + `<div class="spacer"></div>`;
  } else if (s.kind === "cta") {
    top = `<div class="top">${lockup(74)}</div>`;
    body = `<div class="body">${lines("h2", s.head)}<p class="txt">${fix(s.body)}</p>
      <span class="ctabtn">skopegebrauchtwarenhandel.com</span></div>`;
    foot = `<div class="foot"><span class="addr">SKOPE &middot; Im Kampfrad 3<br>74196 Neuenstadt am Kocher</span>${dots(i,n)}</div>`;
  } else if (s.kind === "compare") {
    top = `<div class="top"><span class="kicker"><span class="rule"></span>${label}</span>${wordmark(30)}</div>`;
    body = `<div class="body">${lines("h2",[s.title])}
      <div class="cmp"><div class="a"><div class="v">${s.left.v}</div><div class="l">${fix(s.left.l)}</div></div>
      <div class="line"></div>
      <div class="b"><div class="v">${s.right.v}</div><div class="l">${fix(s.right.l)}</div></div></div>
      <div class="note">${fix(s.note)}</div></div>`;
    foot = `<div class="foot"><span class="addr">skopegebrauchtwarenhandel.com</span>${dots(i,n)}</div>`;
  } else if (s.kind === "quote") {
    top = `<div class="top">${lockup(74)}<span class="kicker">Kundenstimme</span></div>`;
    body = `<div class="body"><div class="mark">&bdquo;</div><blockquote>${fix(s.quote)}</blockquote>
      <div class="by">${fix(s.author)}</div>
      ${s.stat?`<div class="stat"><div class="v">${s.stat.v}</div><div class="l">${fix(s.stat.l)}</div></div>`:""}</div>`;
    foot = `<div class="foot"><span class="addr">SKOPE &middot; Im Kampfrad 3<br>74196 Neuenstadt am Kocher</span></div>`;
  } else {
    top = `<div class="top"><span class="kicker"><span class="rule"></span>${label}</span>${wordmark(30)}</div>`;
    body = `<div class="body"><div class="num">${s.n}</div>${lines("h2",[s.title])}<p class="txt">${fix(s.body)}</p>
      ${s.stat?`<div class="stat"><div class="v">${s.stat.v}</div><div class="l">${fix(s.stat.l)}</div></div>`:""}</div>`;
    foot = `<div class="foot"><span class="addr">skopegebrauchtwarenhandel.com</span>${dots(i,n)}</div>`;
  }
  return { story, html: `<div class="slide${story?" story":""}"><div class="glow"></div>${top}${body}${foot}</div>` };
}

const page = (s, i, n, label) => {
  const { story, html } = slideHtml(s, i, n, label);
  const [W, H] = story ? SIZE.story : SIZE.post;
  const pad = story ? "180px 88px 300px" : "96px 88px 88px";
  return { W, H, doc: `<!doctype html><meta charset="utf-8"><style>${css(W,H,pad)}</style>${html}` };
};

mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
let count = 0;

async function shoot(dir, base, s, i, n, label) {
  mkdirSync(`${OUT}/${dir}`, { recursive: true });
  const { W, H, doc } = page(s, i, n, label);
  const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  writeFileSync(`${OUT}/${dir}/${base}.html`, doc);
  await p.setContent(doc, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(120);
  await p.screenshot({ path: `${OUT}/${dir}/${base}.png` });
  await p.close();
  count++;
}

for (const post of week) {
  const n = post.slides.length;
  for (let i = 0; i < n; i++) {
    const base = n > 1 ? `${post.id}-${String(i+1).padStart(2,"0")}` : post.id;
    await shoot(post.id, base, post.slides[i], i, n, post.pillar);
  }
  console.log("fertig:", post.id, n);
}
for (const st of stories) await shoot("stories", st.id, st, 0, 1, "Story");
console.log("fertig: stories", stories.length, "· gesamt", count, "Bilder");
await b.close();
