/* Erzeugt social/index.html aus week1.mjs. Die Seite ist Werkzeug, kein
   Beitrag: Sie zeigt jede Folie, lädt sie herunter, hält den Beitragstext
   zum Kopieren bereit und enthält für die Reels das Drehbuch. */
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { week, stories } from "./week1.mjs";

const ROOT = process.argv[2];
const esc = (s) => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const attr = (s) => esc(s).replace(/"/g,"&quot;");

const files = (dir, prefix) =>
  existsSync(`${ROOT}/${dir}`)
    ? readdirSync(`${ROOT}/${dir}`).filter(f => f.endsWith(".png") && f.startsWith(prefix)).sort()
    : [];


/* Die drei Karussells vom 11.09. liegen schon im Ordner. Sie sind nicht
   Teil der Woche, sondern Vorrat: immer gültig, jederzeit nachschiebbar,
   wenn ein Tag ausfällt. */
const evergreen = [
  { dir: "kauf", titel: "Fünf Dinge, die vor dem Kauf geprüft gehören", nutzen: "Ersatz für einen Montag (Wissen)" },
  { dir: "reparatur", titel: "Defekt heißt selten Totalschaden", nutzen: "Ersatz für einen Dienstag (Werkstatt)" },
  { dir: "versicherung", titel: "Ab 6 km/h ist die Haftpflicht Pflicht", nutzen: "Ersatz für einen Mittwoch, saisonal stark im Februar/März" },
];
function evergreenCard(d) {
  const imgs = files(d.dir, d.dir).map(f => `${d.dir}/${f}`);
  const thumbs = imgs.map((src,i)=>`<figure class="th"><img src="${attr(src)}" alt="Folie ${i+1}" loading="lazy" onclick="zoom(this.src)">
    <figcaption>Folie ${i+1}<a href="${attr(src)}" download>laden</a></figcaption></figure>`).join("");
  return `<article class="post"><header><div><span class="tag alt">Vorrat</span><span class="tag alt">Karussell</span></div>
    <h3>${esc(d.titel)}</h3><p class="goal">${esc(d.nutzen)}</p></header>
    <div class="thumbs">${thumbs}</div>
    <div class="tools"><button class="dl" data-files="${attr(imgs.join("|"))}">${imgs.length>1?`Alle ${imgs.length} Bilder laden`:"Bild laden"}</button></div>
    <p class="muted" style="margin-top:14px;font-size:14.5px">Beitragstext steht in <code>BEITRAGSTEXTE.md</code>.</p></article>`;
}

function postCard(p) {
  const imgs = files(`woche-01/${p.id}`, p.id).map(f => `woche-01/${p.id}/${f}`);
  const cap = `${p.caption}\n\n${p.tags.join(" ")}`;
  const thumbs = imgs.map((src, i) => `
    <figure class="th">
      <img src="${attr(src)}" alt="Folie ${i+1}" loading="lazy" onclick="zoom(this.src)">
      <figcaption>${imgs.length>1?`Folie ${i+1}`:"Bild"}
        <a href="${attr(src)}" download>laden</a></figcaption>
    </figure>`).join("");

  const reel = p.reel ? `
    <div class="block">
      <h4>Drehbuch <span class="muted">· ${esc(p.reel.laenge)}</span></h4>
      <div class="scroll-x"><table class="szenen">
        <thead><tr><th>Zeit</th><th>Bild</th><th>Text im Bild</th></tr></thead>
        <tbody>${p.reel.szenen.map(s=>`<tr><td class="t">${esc(s.t)}</td><td>${esc(s.bild)}</td><td class="ov">${esc(s.text)}</td></tr>`).join("")}</tbody>
      </table></div>
      <p class="tech"><strong>Aufnahme:</strong> ${esc(p.reel.technik)}</p>
      <button class="copy" data-copy="${attr(p.reel.szenen.map(s=>`${s.t}  ${s.bild}\nText: ${s.text}`).join("\n\n"))}">Drehbuch kopieren</button>
    </div>` : "";

  return `
  <article class="post" id="${attr(p.id)}">
    <header>
      <div>
        <span class="tag">${esc(p.day)}</span>
        <span class="tag alt">${esc(p.pillar)}</span>
        <span class="tag alt">${esc(p.format)}</span>
      </div>
      <h3>${esc(p.hook)}</h3>
      <p class="goal"><strong>Ziel:</strong> ${esc(p.goal)} &nbsp;·&nbsp; <strong>Für:</strong> ${esc(p.audience)}</p>
    </header>
    <div class="thumbs">${thumbs}</div>
    <div class="tools">
      <button class="dl" data-files="${attr(imgs.join("|"))}">${imgs.length>1?`Alle ${imgs.length} Bilder laden`:"Bild laden"}</button>
      <button class="copy" data-copy="${attr(cap)}">Beitragstext + Hashtags kopieren</button>
    </div>
    <div class="block">
      <h4>Beitragstext</h4>
      <pre class="cap">${esc(p.caption)}</pre>
      <p class="tags">${esc(p.tags.join(" "))}</p>
    </div>
    ${reel}
  </article>`;
}

function storyCard(s) {
  const src = `woche-01/stories/${s.id}.png`;
  return `
  <article class="story">
    <img src="${attr(src)}" alt="Story ${esc(s.day)}" loading="lazy" onclick="zoom(this.src)">
    <div>
      <div><span class="tag">${esc(s.day)}</span><span class="tag alt">${esc(s.typ)}</span></div>
      <h4>${esc(s.head.join(" "))}</h4>
      <p class="sticker"><strong>Sticker:</strong> ${esc(s.sticker)}</p>
      <p class="muted">${esc(s.hinweis)}</p>
      <a class="btn" href="${attr(src)}" download>Bild laden</a>
    </div>
  </article>`;
}

const HTML = `<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SKOPE · Contentplan Woche 1</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@600;700&family=Inter:wght@400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--ink:#08090b;--neon:#9ef605;--pap:#eef1f4;--line:rgba(238,241,244,.14)}
body{background:var(--ink);color:var(--pap);font:400 16px/1.6 Inter,system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;padding:0 0 120px}
.wrap{max-width:1180px;margin:0 auto;padding:0 32px}
h1,h2,h3,h4{font-family:'Instrument Sans',sans-serif;letter-spacing:-.02em}
header.top{padding:72px 0 48px;border-bottom:1px solid var(--line);margin-bottom:56px}
h1{font-size:clamp(2.2rem,3vw + 1rem,3.4rem);font-weight:700;line-height:1.05}
h1 em{font-style:normal;color:var(--neon)}
.lead{margin-top:20px;font-size:1.0625rem;color:rgba(238,241,244,.7);max-width:62ch}
h2{font-size:clamp(1.5rem,1.6vw + .9rem,2.1rem);font-weight:700;margin:72px 0 8px}
.h2sub{color:rgba(238,241,244,.55);margin-bottom:32px;max-width:62ch}
.post{border:1px solid var(--line);border-radius:20px;padding:28px;margin-bottom:28px;background:rgba(238,241,244,.02)}
.post h3{font-size:1.75rem;font-weight:700;margin:14px 0 6px;line-height:1.15}
.tag{display:inline-block;font:600 12px/1 'Instrument Sans',sans-serif;letter-spacing:.14em;
  text-transform:uppercase;background:var(--neon);color:var(--ink);padding:7px 12px;border-radius:99px;margin-right:8px}
.tag.alt{background:transparent;color:rgba(238,241,244,.6);border:1px solid var(--line)}
.goal{font-size:.9375rem;color:rgba(238,241,244,.6)}
.thumbs{display:flex;gap:14px;overflow-x:auto;padding:24px 0 8px;scroll-snap-type:x proximity}
.th{flex:0 0 168px;scroll-snap-align:start}
.th img{width:100%;border-radius:10px;border:1px solid var(--line);cursor:zoom-in;display:block;background:#000}
.th figcaption{font-size:12px;color:rgba(238,241,244,.45);margin-top:8px;display:flex;justify-content:space-between}
.th a{color:var(--neon);text-decoration:none;border-bottom:1px solid currentColor}
.tools{display:flex;gap:12px;flex-wrap:wrap;margin:12px 0 4px}
button,.btn{font:600 14px/1 'Instrument Sans',sans-serif;padding:14px 20px;border-radius:99px;cursor:pointer;
  border:1px solid var(--line);background:transparent;color:var(--pap);transition:.2s ease}
button:hover,.btn:hover{border-color:var(--neon);color:var(--neon)}
button.dl{background:var(--neon);color:var(--ink);border-color:var(--neon)}
button.dl:hover{filter:brightness(1.1);color:var(--ink)}
.btn{display:inline-block;text-decoration:none;margin-top:14px}
.block{margin-top:24px;padding-top:24px;border-top:1px solid var(--line)}
.block h4{font-size:.8125rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;
  color:rgba(238,241,244,.5);margin-bottom:14px}
pre.cap{font:400 15px/1.65 Inter,sans-serif;white-space:pre-wrap;color:rgba(238,241,244,.85);max-width:70ch}
.tags{margin-top:14px;font-size:14px;color:var(--neon);opacity:.75;max-width:70ch}
.muted{color:rgba(238,241,244,.5)}
.scroll-x{overflow-x:auto;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}
table.szenen{width:100%;min-width:520px;border-collapse:collapse;font-size:14.5px}
.szenen th{text-align:left;font:600 11px/1 'Instrument Sans',sans-serif;letter-spacing:.12em;
  text-transform:uppercase;color:rgba(238,241,244,.45);padding:0 14px 12px 0;border-bottom:1px solid var(--line)}
.szenen td{padding:14px 14px 14px 0;border-bottom:1px solid var(--line);vertical-align:top;color:rgba(238,241,244,.78)}
.szenen td.t{white-space:nowrap;font-variant-numeric:tabular-nums;color:var(--neon);font-weight:600}
.szenen td.ov{color:var(--pap);font-weight:500}
.tech{margin-top:16px;font-size:14.5px;color:rgba(238,241,244,.6);max-width:70ch}
.tech strong,.sticker strong{color:var(--pap)}
.story{display:grid;grid-template-columns:132px 1fr;gap:24px;align-items:start;
  border:1px solid var(--line);border-radius:20px;padding:22px;margin-bottom:16px;background:rgba(238,241,244,.02)}
.story img{width:100%;border-radius:10px;border:1px solid var(--line);cursor:zoom-in;display:block}
.story h4{font-size:1.25rem;font-weight:700;margin:12px 0 10px}
.sticker{font-size:14.5px;color:rgba(238,241,244,.75);margin-bottom:8px}
.story p.muted{font-size:14.5px}
.note{border-left:2px solid var(--neon);padding:4px 0 4px 20px;margin:28px 0;color:rgba(238,241,244,.7);max-width:66ch}
ul.check{list-style:none;max-width:66ch}
ul.check li{padding:12px 0 12px 32px;border-bottom:1px solid var(--line);position:relative;color:rgba(238,241,244,.78)}
ul.check li::before{content:"";position:absolute;left:0;top:19px;width:14px;height:2px;background:var(--neon)}
#lb{position:fixed;inset:0;background:rgba(8,9,11,.94);display:none;align-items:center;justify-content:center;
  z-index:99;cursor:zoom-out;padding:40px}
#lb img{max-width:100%;max-height:100%;border-radius:12px}
#toast{position:fixed;left:50%;bottom:32px;transform:translateX(-50%) translateY(140%);background:var(--neon);
  color:var(--ink);font:600 14px 'Instrument Sans',sans-serif;padding:14px 24px;border-radius:99px;
  transition:transform .25s cubic-bezier(.22,1,.36,1);z-index:100}
#toast.on{transform:translateX(-50%) translateY(0)}
@media(max-width:700px){.wrap{padding:0 20px}.story{grid-template-columns:1fr}.story img{max-width:180px}}
</style></head><body>
<div class="wrap">
<header class="top">
  <h1>Contentplan <em>Woche 1</em></h1>
  <p class="lead">Sieben Beiträge, sechs Stories, zwei Reel-Drehbücher. Alle Bilder liegen
  fertig als PNG in <code>woche-01/</code> und sind hier einzeln oder gesammelt zu laden.
  Die Strategie dahinter steht in <strong>PLAN.md</strong>.</p>
  <p class="lead">Format Feed 1080 × 1350 (4:5), Story und Reel-Titelbild 1080 × 1920 (9:16),
  gerendert in doppelter Auflösung. Bei den 9:16-Bildern ist die untere Hälfte frei —
  dorthin gehört der Sticker aus der Instagram-App.</p>
</header>

<div class="note"><strong>Vor dem ersten Posten:</strong> Die Rechtsangaben im Montagsbeitrag
und die Bewertung „5,0 aus 37“ sind nicht aus dem Repo belegt, sondern allgemeiner Stand
bzw. Stand vom 18.08.2026. Beides einmal gegenlesen — Abschnitt 8 in PLAN.md.</div>

<h2>Die sieben Beiträge</h2>
<p class="h2sub">Reihenfolge ist die Woche. Freitag ist der einzige Tag, an dem direkt
gefragt wird — das ist Absicht und keine Lücke.</p>
${week.map(postCard).join("")}

<h2>Stories</h2>
<p class="h2sub">Die Grafik ist nur der Untergrund. Der Sticker – Umfrage, Quiz, Frage,
Link – wird in der App daraufgesetzt, in die freie untere Hälfte.</p>
${stories.map(storyCard).join("")}

<h2>Vorrat</h2>
<p class="h2sub">Drei Karussells ohne Verfallsdatum. Sie springen ein, wenn ein Tag
ausfällt oder eine Aufnahme nicht rechtzeitig fertig wird – dann fehlt kein Beitrag,
nur ein Thema.</p>
${evergreen.map(evergreenCard).join("")}

<h2>Vor jedem Posten</h2>
<ul class="check">
  <li>Bild geladen und im Vorschau-Programm angesehen — nicht nur hier im Browser.</li>
  <li>Beitragstext kopiert, erste Zeile prüfen: Sie ist die einzige, die ohne „mehr“ zu sehen ist.</li>
  <li>Standort gesetzt: Neuenstadt am Kocher. Ohne Standort verliert ein lokaler Beitrag seine halbe Wirkung.</li>
  <li>Bei Reels: Titelbild aus <code>woche-01/</code> hochladen, nicht das automatisch gewählte Einzelbild.</li>
  <li>Nach 24 Stunden in die Insights schauen: Speicherungen und Geteilt, nicht Likes.</li>
</ul>
</div>

<div id="lb" onclick="this.style.display='none'"><img alt=""></div>
<div id="toast">Kopiert</div>
<script>
function zoom(src){const lb=document.getElementById('lb');lb.querySelector('img').src=src;lb.style.display='flex'}
function toast(t){const el=document.getElementById('toast');el.textContent=t;el.classList.add('on');
  clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),1800)}
/* Zwischenablage: navigator.clipboard verlangt einen sicheren Kontext und
   fehlt beim Aufruf über file://. Deshalb der alte Weg als Rückfall. */
function copy(text){
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(()=>toast('Kopiert'));return}
  const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.left='-9999px';
  document.body.appendChild(ta);ta.select();
  try{document.execCommand('copy');toast('Kopiert')}catch(e){toast('Kopieren ging nicht – Text markieren')}
  ta.remove()}
document.addEventListener('click',e=>{
  const c=e.target.closest('button.copy');if(c){copy(c.dataset.copy);return}
  const d=e.target.closest('button.dl');if(!d)return;
  /* Mehrere Downloads hintereinander: Browser verwerfen gleichzeitige
     Klicks auf denselben Ursprung, deshalb 250 ms Abstand. */
  const list=d.dataset.files.split('|').filter(Boolean);
  list.forEach((src,i)=>setTimeout(()=>{
    const a=document.createElement('a');a.href=src;a.download=src.split('/').pop();
    document.body.appendChild(a);a.click();a.remove()},i*250));
  toast(list.length+' Bilder werden geladen')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.getElementById('lb').style.display='none'});
</script></body></html>`;

writeFileSync(`${ROOT}/index.html`, HTML);
console.log("index.html:", (HTML.length/1024).toFixed(1), "kB ·", week.length, "Beiträge,", stories.length, "Stories");
