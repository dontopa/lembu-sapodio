/* Belajar Bersama Sapo — permainan pendidikan untuk kanak-kanak 4 tahun.
   Vanilla JS, tiada build step. Data disimpan dalam localStorage peranti. */
(() => {
"use strict";
const D = window.DATA;
const KEY = "sapo-belajar-v1";
const LEVELS = 3, PER_ROUND = 5;
const app = document.getElementById("app");
const fx = document.getElementById("fx");

/* ---------- util ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ymd = d => { const z = n => String(n).padStart(2, "0"); return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`; };
const today = () => ymd(new Date());
const daysAgo = n => { const d = new Date(); d.setDate(d.getDate() - n); return ymd(d); };
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- state ---------- */
const defaults = () => ({ v: 1, profiles: [], cur: null, set: { voice: true, sfx: true, rate: 0.85, limit: 20 } });
let S;
try { S = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || "{}")); S.set = Object.assign(defaults().set, S.set); }
catch (e) { S = defaults(); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storan penuh / disekat */ } };
const P = () => S.profiles.find(p => p.id === S.cur);
const newProfile = (name, av) => ({
  id: "p" + Date.now().toString(36), name, av, created: today(),
  prog: {}, stickers: [], ans: {}, items: {}, days: {}, bonus: {}, streak: 0, lastDay: null
});
const prog = (p, g) => (p.prog[g] = p.prog[g] || Array(LEVELS).fill(0));
const unlocked = (p, g, l) => l === 0 || prog(p, g)[l - 1] > 0;

/* ---------- bunyi ---------- */
let ac = null;
function audio() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (ac && ac.state === "suspended") ac.resume(); return ac; }
function tone(freqs, step = 0.12, type = "sine", vol = 0.18) {
  if (!S.set.sfx) return; const c = audio(); if (!c) return;
  freqs.forEach((f, i) => {
    const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + i * step;
    o.type = type; o.frequency.value = f; o.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + step * 2.2);
    o.start(t); o.stop(t + step * 2.4);
  });
}
const sfx = {
  tap: () => tone([520], 0.05, "triangle", 0.1),
  ok: () => tone([660, 880, 1175], 0.09),
  no: () => tone([330, 262], 0.14, "triangle", 0.08),
  flip: () => tone([740], 0.04, "triangle", 0.08),
  win: () => tone([523, 659, 784, 1047, 784, 1047], 0.13, "square", 0.07)
};

/* ---------- suara (Web Speech API) ---------- */
let voice = null;
function pickVoice() {
  if (!("speechSynthesis" in window)) return;
  const vs = speechSynthesis.getVoices();
  voice = vs.find(v => /^ms([-_]|$)/i.test(v.lang)) || vs.find(v => /^id([-_]|$)/i.test(v.lang)) || null;
}
if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function say(text) {
  if (!S.set.voice || !("speechSynthesis" in window) || !text) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = voice ? voice.lang : "ms-MY"; if (voice) u.voice = voice;
  u.rate = S.set.rate; u.pitch = 1.15;
  speechSynthesis.speak(u);
}
const speakMs = t => Math.min(6000, 900 + t.length * 55 / S.set.rate);

/* ---------- konfeti ---------- */
function confetti(n = 40) {
  const cols = ["#FFB547", "#FF5C8A", "#3DBE6E", "#7FD3FF", "#8E24AA", "#FDD835"];
  for (let i = 0; i < n; i++) {
    const el = document.createElement("i");
    el.style.left = Math.random() * 100 + "vw"; el.style.background = pick(cols);
    el.style.animationDuration = 1.4 + Math.random() * 1.6 + "s"; el.style.animationDelay = Math.random() * 0.3 + "s";
    fx.appendChild(el); setTimeout(() => el.remove(), 3500);
  }
}

/* ---------- maskot Sapo ---------- */
function sapo(mood = "happy", cls = "bob") {
  const eyes = mood === "sleep"
    ? `<path d="M68 92q10 8 20 0M112 92q10 8 20 0" stroke="#3B2A1A" stroke-width="5" fill="none" stroke-linecap="round"/>`
    : `<circle cx="78" cy="92" r="10" fill="#3B2A1A"/><circle cx="122" cy="92" r="10" fill="#3B2A1A"/><circle cx="81" cy="88" r="3.5" fill="#fff"/><circle cx="125" cy="88" r="3.5" fill="#fff"/>`;
  const mouth = mood === "sleep" ? `<ellipse cx="100" cy="160" rx="6" ry="4" fill="#3B2A1A"/>`
    : `<path d="M84 156q16 14 32 0" stroke="#3B2A1A" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  return `<svg class="sapo ${cls}" viewBox="0 0 200 210" role="img" aria-label="Sapo si lembu" data-sapo>
  <path d="M66 46q-10-26 6-34q2 16 10 24z M134 46q10-26-6-34q-2 16-10 24z" fill="#FFF1D0" stroke="#3B2A1A" stroke-width="4" stroke-linejoin="round"/>
  <ellipse cx="34" cy="78" rx="30" ry="14" transform="rotate(-25 34 78)" fill="#F7D4B0" stroke="#3B2A1A" stroke-width="4"/>
  <ellipse cx="166" cy="78" rx="30" ry="14" transform="rotate(25 166 78)" fill="#F7D4B0" stroke="#3B2A1A" stroke-width="4"/>
  <ellipse cx="100" cy="104" rx="64" ry="68" fill="#fff" stroke="#3B2A1A" stroke-width="5"/>
  <path d="M52 60q18-26 46-20q-6 22-24 28q-14 4-22-8z" fill="#B0703A"/>
  <path d="M140 118q16-6 20 10q-6 16-20 8z" fill="#B0703A"/>
  ${eyes}
  <circle cx="60" cy="118" r="9" fill="#FFB4B4" opacity=".7"/><circle cx="140" cy="118" r="9" fill="#FFB4B4" opacity=".7"/>
  <ellipse cx="100" cy="148" rx="46" ry="30" fill="#FFC2B4" stroke="#3B2A1A" stroke-width="5"/>
  <ellipse cx="84" cy="142" rx="6" ry="8" fill="#3B2A1A"/><ellipse cx="116" cy="142" rx="6" ry="8" fill="#3B2A1A"/>
  ${mouth}
</svg>`;
}

/* ---------- bentuk SVG ---------- */
function star(cx, cy, R, r) { let p = []; for (let i = 0; i < 10; i++) { const a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r : R; p.push((cx + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1)); } return p.join(" "); }
const SHAPE = {
  "bulatan": `<circle cx="50" cy="50" r="42"/>`,
  "segi empat sama": `<rect x="10" y="10" width="80" height="80" rx="5"/>`,
  "segi tiga": `<polygon points="50,8 94,90 6,90"/>`,
  "segi empat tepat": `<rect x="3" y="26" width="94" height="48" rx="5"/>`,
  "bintang": `<polygon points="${star(50, 53, 46, 19)}"/>`,
  "hati": `<path d="M50 90C12 62 2 36 22 20c14-10 26-2 28 10c2-12 14-20 28-10c20 16 10 42-28 70z"/>`,
  "bujur": `<ellipse cx="50" cy="50" rx="46" ry="30"/>`
};
const SHAPE_COLS = ["#E53935", "#1E88E5", "#FDD835", "#43A047", "#FB8C00", "#8E24AA", "#F48FB1"];
const shapeSvg = (id, c) => `<svg viewBox="0 0 100 100"><g fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="4" stroke-linejoin="round">${SHAPE[id]}</g></svg>`;

/* ---------- pemilihan adaptif: lebih kerap item yang selalu salah ---------- */
let lastKey = null;
function pickAdaptive(g, list, keyOf) {
  const st = (P().items[g] || {});
  const w = list.map(x => { const [ok, bad] = st[keyOf(x)] || [0, 0]; return keyOf(x) === lastKey ? 0.15 : 1 + 2.5 * bad / (ok + bad + 1); });
  let t = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < list.length; i++) { t -= w[i]; if (t <= 0) return list[i]; }
  return list[list.length - 1];
}
const others = (list, not, n, eq = (a, b) => a === b) => shuffle(list.filter(x => !eq(x, not))).slice(0, n);

/* ---------- permainan ---------- */
const GAMES = [
  { id: "kira", nama: "Kira", e: "🔢", bg: "#FFD6A5", skill: "Nombor & membilang",
    lv: ["1 – 3", "1 – 5", "1 – 10"],
    gen(l) {
      const max = [3, 5, 10][l], obj = pick(D.bendaKira);
      const nums = Array.from({ length: max }, (_, i) => i + 1);
      const n = pickAdaptive("kira", nums, x => String(x));
      const opts = shuffle([n, ...others(nums, n, 2)]);
      const items = Array.from({ length: n }, () => `<span class="it">${obj.e}</span>`);
      const rows = n > 5 ? `<div class="tenrow">${items.slice(0, 5).join("")}</div><div class="tenrow">${items.slice(5).join("")}</div>` : items.join("");
      const count = nums.slice(0, n).map(x => D.nombor[x]).join(", ");
      return {
        key: String(n), q: `Berapa banyak ${obj.n}?`, say: `Berapa banyak ${obj.n}? Jom kira.`,
        prompt: rows, opts: opts.map(x => ({ html: x, ok: x === n, label: D.nombor[x] })),
        after: `${count}. ${cap(D.nombor[n])} ${obj.n}!`, anim: "count"
      };
    } },
  { id: "warna", nama: "Warna", e: "🎨", bg: "#FFADAD", skill: "Mengenal warna",
    lv: ["4 warna", "7 warna", "Warna benda"],
    gen(l) {
      const blob = w => `<div class="blob" style="background:${w.c}"></div>`;
      if (l < 2) {
        const pool = D.warna.slice(0, l ? 7 : 4);
        const t = pickAdaptive("warna", pool, x => x.id);
        const opts = shuffle([t, ...others(pool, t, l ? 3 : 2)]);
        return { key: t.id, q: `Mana warna ${t.id}?`, say: `Mana warna ${t.id}?`, prompt: "🎨",
          opts: opts.map(w => ({ html: blob(w), ok: w === t, label: w.id })), after: `Ini warna ${t.id}.` };
      }
      const b = pickAdaptive("warna", D.warnaBenda, x => x.w);
      const right = D.warna.find(w => w.id === b.w);
      const opts = shuffle([right, ...others(D.warna, right, 2)]);
      return { key: b.w, q: `Apa warna ${b.n}?`, say: `Apa warna ${b.n}?`, prompt: `<span style="font-size:1.6em">${b.e}</span>`,
        opts: opts.map(w => ({ html: blob(w), ok: w === right, label: w.id })), after: `${cap(b.n)} warna ${b.w}.` };
    } },
  { id: "bentuk", nama: "Bentuk", e: "🔺", bg: "#CAFFBF", skill: "Mengenal bentuk",
    lv: ["3 bentuk", "5 bentuk", "7 bentuk"],
    gen(l) {
      const pool = D.bentuk.slice(0, [3, 5, 7][l]);
      const t = pickAdaptive("bentuk", pool, x => x.id);
      const opts = shuffle([t, ...others(pool, t, l === 2 ? 3 : 2)]);
      const cols = shuffle(SHAPE_COLS);
      return { key: t.id, q: `Mana ${t.id}?`, say: `Mana ${t.id}?`, prompt: "🔍",
        opts: opts.map((s, i) => ({ html: shapeSvg(s.id, cols[i]), ok: s === t, label: s.id })), after: `Ini ${t.id}.` };
    } },
  { id: "huruf", nama: "Huruf", e: "🔤", bg: "#9BF6FF", skill: "Huruf A–Z & bunyi awal",
    lv: ["A – H", "I – Q", "R – Z"],
    gen(l) {
      const pool = D.huruf.slice([0, 8, 17][l], [8, 17, 26][l]);
      const t = pickAdaptive("huruf", pool, x => x[0]);
      const opts = shuffle([t, ...others(pool, t, 2)]);
      return { key: t[0], q: `${cap(t[1])} — mana huruf ${t[0]}?`, say: `${cap(t[1])} bermula dengan huruf ${t[0]}. Mana huruf ${t[0]}?`,
        prompt: `<span style="font-size:1.5em">${t[2]}</span>`,
        opts: opts.map(x => ({ html: `<span class="letter">${x[0]}</span>`, ok: x === t, label: "huruf " + x[0] })),
        after: `${t[0]} untuk ${t[1]}!` };
    } },
  { id: "haiwan", nama: "Haiwan", e: "🐘", bg: "#BDB2FF", skill: "Haiwan & persekitaran",
    lv: ["Ladang", "Hutan", "Laut"],
    gen(l) {
      const pool = D.haiwan[l];
      const t = pickAdaptive("haiwan", pool, x => x.n);
      const opts = shuffle([t, ...others(pool, t, 2)]);
      return { key: t.n, q: `Mana ${t.n}?`, say: `Mana ${t.n}?`, prompt: ["🚜", "🌴", "🌊"][l],
        opts: opts.map(a => ({ html: a.e, ok: a === t, label: a.n })), after: t.f };
    } },
  { id: "saiz", nama: "Besar Kecil", e: "🐘🐭", bg: "#FFC6FF", skill: "Perbandingan (saiz & kuantiti)",
    lv: ["Besar / kecil", "3 saiz", "Banyak / sedikit"],
    gen(l) {
      const o = pick(D.bendaSaiz);
      if (l < 2) {
        const sizes = l ? [1, 0.68, 0.4] : [1, 0.42];
        const want = pickAdaptive("saiz", ["besar", "kecil"], x => x);
        const target = want === "besar" ? 1 : sizes[sizes.length - 1];
        const opts = shuffle(sizes);
        const word = l ? (want === "besar" ? "paling besar" : "paling kecil") : want;
        return { key: want, q: `Mana yang ${word}?`, say: `Mana ${o.n} yang ${word}?`, prompt: o.e,
          opts: opts.map(s => ({ html: `<span style="font-size:${s}em">${o.e}</span>`, ok: s === target, label: `${o.n} saiz ${s}` })),
          after: `${cap(o.n)} ini ${word}!`, n: sizes.length };
      }
      const want = pickAdaptive("saiz", ["banyak", "sedikit"], x => x);
      let a = 1 + rnd(3), b = a + 2 + rnd(4); if (rnd(2)) [a, b] = [b, a];
      const target = want === "banyak" ? Math.max(a, b) : Math.min(a, b);
      const f = pick(D.bendaKira);
      return { key: want, q: `Mana yang ${want}?`, say: `Mana ${f.n} yang ${want}?`, prompt: f.e,
        opts: [a, b].map(x => ({ html: `<span class="grp">${f.e.repeat(x)}</span>`, ok: x === target, label: `${x} ${f.n}` })),
        after: `Yang ini lebih ${want}!`, n: 2 };
    } },
  { id: "corak", nama: "Corak", e: "🍎🍌", bg: "#FDFFB6", skill: "Corak & urutan",
    lv: ["AB AB", "AAB / ABB", "ABC"],
    gen(l) {
      const items = shuffle(D.bendaCorak);
      const [A, B, C] = items;
      const kind = l === 0 ? "AB" : l === 1 ? pick(["AAB", "ABB"]) : "ABC";
      const unit = [...kind].map(ch => ({ A, B, C })[ch]);
      const len = unit.length + 1 + rnd(unit.length + 1);
      const seq = Array.from({ length: len }, (_, i) => unit[i % unit.length]);
      const ans = unit[len % unit.length];
      const pool = [...new Set([...unit, items[3]])];
      const opts = shuffle([ans, ...others(pool, ans, 2)]);
      return { key: l === 1 ? "AAB/ABB" : kind, q: "Apa yang seterusnya?", say: "Lihat corak ini. Apa yang seterusnya?",
        prompt: seq.map(x => `<span class="it">${x}</span>`).join("") + `<span class="slot">?</span>`,
        opts: opts.map(x => ({ html: x, ok: x === ans, label: x })), after: "Betul! Coraknya berulang." };
    } },
  { id: "memori", nama: "Padan Kad", e: "🃏", bg: "#A0E7E5", skill: "Ingatan & tumpuan",
    lv: ["3 pasang", "4 pasang", "6 pasang"], memory: true }
];
const G = id => GAMES.find(g => g.id === id);

/* ---------- statistik ---------- */
function record(g, key, ok) {
  const p = P(); if (!p) return;
  const a = (p.ans[g] = p.ans[g] || { ok: 0, bad: 0 }); ok ? a.ok++ : a.bad++;
  if (key != null) { const it = (p.items[g] = p.items[g] || {}); const v = (it[key] = it[key] || [0, 0]); v[ok ? 0 : 1]++; }
  save();
}
const totalStars = p => GAMES.reduce((s, g) => s + prog(p, g.id).reduce((a, b) => a + b, 0), 0);
const levelsDone = p => GAMES.reduce((s, g) => s + prog(p, g.id).filter(x => x > 0).length, 0);
const secToday = p => p.days[today()] || 0;
const limitSec = p => S.set.limit ? (S.set.limit + (p.bonus[today()] || 0)) * 60 : Infinity;
const overLimit = () => { const p = P(); return p && secToday(p) >= limitSec(p); };

function recommend(p) {
  // permainan yang ada tahap belum selesai & paling sedikit bintang; jika semua selesai, ketepatan terendah
  let best = null, score = Infinity;
  for (const g of GAMES) {
    const pr = prog(p, g.id);
    const done = pr.filter(x => x > 0).length;
    const a = p.ans[g.id] || { ok: 0, bad: 0 };
    const acc = (a.ok + 1) / (a.ok + a.bad + 2);
    const s = done < LEVELS ? done + acc : 10 + acc;
    if (s < score) { score = s; best = g.id; }
  }
  return best;
}

/* ---------- masa main & had harian ---------- */
let screen = "";
const timedScreens = new Set(["home", "levels", "play", "result", "book"]);
setInterval(() => {
  const p = P();
  if (!p || document.visibilityState !== "visible" || !timedScreens.has(screen)) return;
  const t = today();
  if (p.lastDay !== t) { p.streak = p.lastDay === daysAgo(1) ? (p.streak || 0) + 1 : 1; p.lastDay = t; }
  p.days[t] = (p.days[t] || 0) + 1;
  if (p.days[t] % 10 === 0) save();
  if ((screen === "home" || screen === "levels" || screen === "book") && overLimit()) go("rest");
}, 1000);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") { save(); if ("speechSynthesis" in window) speechSynthesis.cancel(); } });

/* ---------- router ---------- */
let timers = [];
const later = (fn, ms) => timers.push(setTimeout(fn, ms));
function go(name, arg) {
  timers.forEach(clearTimeout); timers = [];
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  screen = name;
  (R[name] || R.home)(arg);
  app.scrollTop = 0;
}
function bindSapo() { $$("[data-sapo]").forEach(s => s.addEventListener("click", () => { s.classList.remove("jump"); void s.offsetWidth; s.classList.add("jump"); tone([392, 330], 0.12, "triangle", 0.12); say("Moo! Saya Sapo!"); })); }
const on = (sel, fn) => $$(sel).forEach(el => el.addEventListener("click", e => { sfx.tap(); fn(el, e); }));

const R = {};

/* --- profil --- */
R.profiles = () => {
  if (!S.profiles.length) return go("newProfile");
  app.innerHTML = `<section class="screen">
    <div class="center" style="margin-top:4vh">${sapo()}<h1>Siapa nak main?</h1></div>
    <div class="profiles">
      ${S.profiles.map(p => `<button class="pcard" data-id="${p.id}"><div class="av">${p.av}</div>${esc(p.name)}<div class="muted" style="font-size:16px">⭐ ${totalStars(p)}</div></button>`).join("")}
      <button class="pcard" data-new><div class="av">➕</div>Tambah</button>
    </div></section>`;
  bindSapo();
  on("[data-id]", el => { audio(); S.cur = el.dataset.id; save(); go(overLimit() ? "rest" : "home"); });
  on("[data-new]", () => go("newProfile"));
};

R.newProfile = () => {
  let av = D.avatar[0];
  app.innerHTML = `<section class="screen center">
    <div class="bar">${S.profiles.length ? `<button class="ibtn" data-back aria-label="Kembali">⬅️</button>` : ""}</div>
    ${sapo("happy", "bob")}
    <h1>Hai! Siapa nama kamu?</h1>
    <p class="muted" style="font-size:18px">Ibu bapa: taip nama anak & pilih gambar.</p>
    <input class="field" id="nm" maxlength="16" placeholder="Nama" autocomplete="off">
    <div class="avpick">${D.avatar.map((a, i) => `<button data-av="${a}" class="${i ? "" : "on"}" aria-label="Avatar ${a}">${a}</button>`).join("")}</div>
    <div class="row" style="margin-top:10px"><button class="big green" data-go>Jom mula! ▶</button></div>
  </section>`;
  bindSapo();
  on("[data-back]", () => go("profiles"));
  on("[data-av]", el => { av = el.dataset.av; $$("[data-av]").forEach(b => b.classList.toggle("on", b === el)); });
  on("[data-go]", () => {
    audio();
    const p = newProfile(($("#nm").value || "").trim() || "Adik", av);
    S.profiles.push(p); S.cur = p.id; save(); go("home");
  });
};

/* --- rumah --- */
R.home = () => {
  const p = P(); if (!p) return go("profiles");
  const rec = recommend(p);
  app.innerHTML = `<section class="screen">
    <div class="bar">
      <button class="ibtn" data-prof aria-label="Tukar pemain">${p.av}</button>
      <span class="chip">⭐ ${totalStars(p)}</span>
      <div class="sp"></div>
      <button class="ibtn" data-book aria-label="Buku pelekat">📒</button>
      <button class="ibtn sm" data-parent aria-label="Zon ibu bapa">🔒</button>
    </div>
    <div class="hello">${sapo("happy", "bob")}<div class="bubble">Hai ${esc(p.name)}! Jom belajar sambil bermain!</div></div>
    <div class="grid">
      ${GAMES.map(g => { const pr = prog(p, g.id); return `<button class="gcard" data-g="${g.id}" style="background:${g.bg}">
        ${g.id === rec ? `<span class="tag">Cuba ini!</span>` : ""}
        <div class="ge">${g.e}</div><div class="gn">${g.nama}</div>
        <div class="pips">${pr.map(s => `<i class="${s ? "on" : ""}"></i>`).join("")}<b>⭐ ${pr.reduce((a, b) => a + b, 0)}</b></div></button>`; }).join("")}
    </div></section>`;
  bindSapo();
  say(`Hai ${p.name}! Pilih satu permainan.`);
  on("[data-g]", el => go("levels", el.dataset.g));
  on("[data-book]", () => go("book"));
  on("[data-prof]", () => go("profiles"));
  on("[data-parent]", () => go("gate"));
};

/* --- pilih tahap --- */
R.levels = gid => {
  const p = P(), g = G(gid), pr = prog(p, gid);
  const next = pr.findIndex(s => s === 0);
  app.innerHTML = `<section class="screen center" style="background:${g.bg}22">
    <div class="bar"><button class="ibtn" data-back aria-label="Rumah">🏠</button><div class="sp"></div></div>
    <div style="font-size:72px">${g.e}</div><h1>${g.nama}</h1>
    <div class="levels">${pr.map((s, l) => { const un = unlocked(p, gid, l);
      return `<button class="lvl ${un ? "" : "locked"} ${l === next ? "next" : ""}" data-l="${l}" ${un ? "" : "disabled"} aria-label="Tahap ${l + 1}">
        ${un ? l + 1 : "🔒"}<small>${s ? "⭐".repeat(s) : un ? g.lv[l] : ""}</small></button>`; }).join("")}</div>
  </section>`;
  say(`${g.nama}. Pilih tahap.`);
  on("[data-back]", () => go("home"));
  on("[data-l]", el => go("play", { g: gid, l: +el.dataset.l }));
};

/* --- main --- */
let run = null;
R.play = ({ g, l }) => {
  if (overLimit()) return go("rest");
  run = { g, l, i: 0, mistakes: 0 };
  lastKey = null;
  G(g).memory ? memory() : question();
};

function gameBar(total, i) {
  return `<div class="bar">
    <button class="ibtn" data-quit aria-label="Berhenti">✖️</button>
    <div class="dots">${Array.from({ length: total }, (_, k) => `<i class="${k < i ? "done" : k === i ? "now" : ""}"></i>`).join("")}</div>
    <button class="ibtn" data-say aria-label="Dengar lagi">🔊</button></div>`;
}

function question() {
  const g = G(run.g), q = g.gen(run.l);
  run.q = q; run.qm = 0; run.lock = false; run.rec = false;
  lastKey = q.key;
  const n = q.n || q.opts.length;
  app.innerHTML = `<section class="screen" style="background:${g.bg}33">
    ${gameBar(PER_ROUND, run.i)}
    <div class="stage">
      <div class="prompt"><div class="q">${esc(q.q)}</div>${q.prompt}</div>
      <div class="opts n${n}" style="--n:${n}">
        ${q.opts.map((o, k) => `<button class="opt" data-k="${k}" aria-label="${esc(o.label)}">${o.html}</button>`).join("")}
      </div>
    </div></section>`;
  say(q.say);
  $("[data-quit]").onclick = () => go("levels", run.g);
  $("[data-say]").onclick = () => say(q.say);
  $(".prompt").onclick = () => say(q.say);
  $$("[data-k]").forEach(b => b.addEventListener("click", () => answer(b, q.opts[+b.dataset.k])));
}

function answer(btn, o) {
  if (run.lock) return;
  const q = run.q;
  if (!run.rec) { record(run.g, q.key, o.ok); run.rec = true; }
  if (o.ok) {
    run.lock = true; btn.classList.add("ok"); sfx.ok(); confetti(14);
    const line = `${pick(D.pujian)} ${q.after || ""}`;
    say(line);
    let wait = speakMs(line);
    if (q.anim === "count") {
      const its = $$(".prompt .it");
      its.forEach((el, k) => later(() => { its.forEach(x => x.classList.remove("hl")); el.classList.add("hl"); }, 700 + k * 520));
      wait = Math.max(wait, 900 + its.length * 520 + 600);
    }
    later(() => { run.i++; run.i >= PER_ROUND ? finish() : question(); }, S.set.voice ? wait : 1100);
  } else {
    btn.classList.add("no"); sfx.no(); run.mistakes++; run.qm++;
    say(pick(D.cubaLagi));
    if (run.qm >= 2) { const k = q.opts.findIndex(x => x.ok); $(`[data-k="${k}"]`).classList.add("hint"); }
  }
}

/* --- padan kad --- */
function memory() {
  const g = G(run.g), pairs = [3, 4, 6][run.l];
  const set = shuffle(D.bendaMemori).slice(0, pairs);
  const cards = shuffle([...set, ...set]);
  const cols = cards.length === 6 ? 3 : 4;
  let open = [], got = 0, busy = false;
  app.innerHTML = `<section class="screen" style="background:${g.bg}33">
    ${gameBar(pairs, 0)}
    <div class="stage">
      <div class="prompt" style="min-height:0"><div class="q">Cari pasangan yang sama!</div></div>
      <div class="mem" style="--c:${cols}">${cards.map((c, k) => `<button class="card" data-c="${k}" aria-label="Kad ${k + 1}"><div class="in"><div class="b">🐮</div><div class="f">${c.e}</div></div></button>`).join("")}</div>
    </div></section>`;
  const intro = "Cari dua kad yang sama.";
  say(intro);
  $("[data-quit]").onclick = () => go("levels", run.g);
  $("[data-say]").onclick = () => say(intro);
  const dots = $$(".dots i");
  $$("[data-c]").forEach(el => el.addEventListener("click", () => {
    if (busy || el.classList.contains("up")) return;
    const c = cards[+el.dataset.c];
    el.classList.add("up"); sfx.flip(); say(c.n); open.push([el, c]);
    if (open.length < 2) return;
    const [[e1, c1], [e2, c2]] = open; open = [];
    if (c1 === c2) {
      record("memori", null, true);
      later(() => { e1.classList.add("got"); e2.classList.add("got"); sfx.ok(); confetti(10);
        dots[got].classList.remove("now"); dots[got].classList.add("done"); got++;
        if (dots[got]) dots[got].classList.add("now");
        if (got === pairs) later(finish, 1200); }, 350);
    } else {
      record("memori", null, false); run.mistakes++; busy = true;
      later(() => { e1.classList.remove("up"); e2.classList.remove("up"); busy = false; }, 1000);
    }
  }));
  dots[0].classList.add("now");
}

/* --- tamat pusingan --- */
let last = null;
function finish() {
  const p = P(), g = G(run.g), pr = prog(p, run.g), m = run.mistakes;
  const pairs = g.memory ? [3, 4, 6][run.l] : 0;
  const stars = g.memory ? (m <= Math.ceil(pairs / 2) ? 3 : m <= pairs * 1.5 ? 2 : 1) : (m === 0 ? 3 : m <= 2 ? 2 : 1);
  const first = pr[run.l] === 0;
  pr[run.l] = Math.max(pr[run.l], stars);
  let sticker = null;
  if (first) {
    const left = D.pelekat.filter(s => !p.stickers.includes(s));
    if (left.length) { sticker = pick(left); p.stickers.push(sticker); }
  }
  save();
  last = { g: run.g, l: run.l, stars, sticker };
  go("result");
}

R.result = () => {
  const { g, l, stars, sticker } = last, gm = G(g);
  const hasNext = l < LEVELS - 1;
  app.innerHTML = `<section class="screen"><div class="result">
    ${sapo("happy", "jump")}
    <h1>${pick(D.pujian)}</h1>
    <div class="bigstars">${[0, 1, 2].map(k => `<span class="${k < stars ? "" : "off"}" style="animation-delay:${0.2 + k * 0.25}s">⭐</span>`).join("")}</div>
    ${sticker ? `<div class="sticker"><b>${sticker}</b>Pelekat baru!</div>` : ""}
    <div class="row">
      <button class="big alt" data-again aria-label="Main lagi">🔁</button>
      ${hasNext ? `<button class="big green" data-next>Tahap ${l + 2} ▶</button>` : `<button class="big green" data-home>🏠</button>`}
    </div>
    <button class="big alt" data-menu style="min-height:56px;font-size:20px">${gm.e} ${gm.nama}</button>
  </div></section>`;
  sfx.win(); confetti(70);
  say(`${pick(D.pujian)} Kamu dapat ${D.nombor[stars]} bintang!${sticker ? " Kamu dapat pelekat baru!" : ""}`);
  bindSapo();
  on("[data-again]", () => go("play", { g, l }));
  on("[data-next]", () => go("play", { g, l: l + 1 }));
  on("[data-home]", () => go("home"));
  on("[data-menu]", () => go("levels", g));
};

/* --- buku pelekat --- */
R.book = () => {
  const p = P();
  app.innerHTML = `<section class="screen">
    <div class="bar"><button class="ibtn" data-back aria-label="Rumah">🏠</button><div class="sp"></div><span class="chip">📒 ${p.stickers.length} / ${D.pelekat.length}</span></div>
    <h1 class="center">Buku Pelekat ${esc(p.name)}</h1>
    <p class="center muted" style="font-size:18px">Habiskan tahap baru untuk dapat pelekat!</p>
    <div class="book">${D.pelekat.map(s => p.stickers.includes(s) ? `<div>${s}</div>` : `<div class="off">?</div>`).join("")}</div>
  </section>`;
  say(`Kamu ada ${p.stickers.length} pelekat!`);
  on("[data-back]", () => go("home"));
};

/* --- masa rehat --- */
R.rest = () => {
  app.innerHTML = `<section class="screen"><div class="rest">
    <div class="zz">💤</div>${sapo("sleep", "")}
    <h1>Masa rehat!</h1>
    <p class="muted" style="font-size:22px;max-width:480px">Sapo nak tidur sekejap. Jom main di luar, minum air, atau baca buku dengan ibu ayah!</p>
    <button class="big alt" data-parent style="font-size:18px;min-height:56px">🔒 Ibu bapa</button>
  </div></section>`;
  say("Masa rehat! Sapo nak tidur sekejap. Jom main di luar, atau baca buku dengan ibu ayah.");
  on("[data-parent]", () => go("gate"));
};

/* --- pintu ibu bapa --- */
R.gate = () => {
  const a = 3 + rnd(7), b = 3 + rnd(7);
  let v = "";
  const back = P() ? (overLimit() ? "rest" : "home") : "profiles";
  app.innerHTML = `<section class="screen center parent">
    <div class="bar"><button class="ibtn" data-back aria-label="Kembali">⬅️</button></div>
    <h2>Untuk ibu bapa sahaja</h2>
    <p class="muted">Jawab untuk teruskan: <b>${a} + ${b} = ?</b></p>
    <div class="gatev" id="gv">&nbsp;</div>
    <div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0, "✔️"].map(k => `<button data-key="${k}">${k}</button>`).join("")}</div>
  </section>`;
  on("[data-back]", () => go(back));
  on("[data-key]", el => {
    const k = el.dataset.key;
    if (k === "⌫") v = v.slice(0, -1);
    else if (k === "✔️") { if (+v === a + b) return go("parent"); v = ""; el.closest(".screen").querySelector(".keypad").classList.add("no"); setTimeout(() => go("gate"), 400); return; }
    else if (v.length < 3) v += k;
    $("#gv").textContent = v || " ";
  });
};

/* --- zon ibu bapa --- */
let installEvt = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; });

R.parent = () => {
  const p = P();
  if (!p) return go("profiles");
  const acc = (g) => { const a = p.ans[g] || { ok: 0, bad: 0 }; const t = a.ok + a.bad; return t ? Math.round(a.ok / t * 100) : null; };
  const all = Object.values(p.ans).reduce((s, a) => ({ ok: s.ok + a.ok, bad: s.bad + a.bad }), { ok: 0, bad: 0 });
  const allAcc = all.ok + all.bad ? Math.round(all.ok / (all.ok + all.bad) * 100) + "%" : "–";
  const week = Array.from({ length: 7 }, (_, k) => { const d = daysAgo(6 - k); return { d, s: p.days[d] || 0 }; });
  const maxS = Math.max(600, ...week.map(w => w.s));
  const dn = ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"];
  const weekMin = Math.round(week.reduce((a, w) => a + w.s, 0) / 60);
  const weak = [];
  for (const g of GAMES) for (const [k, [ok, bad]] of Object.entries(p.items[g.id] || {})) if (bad > 0) weak.push({ g, k, r: ok / (ok + bad), n: ok + bad });
  weak.sort((x, y) => x.r - y.r || y.n - x.n);
  const label = (g, k) => g.id === "kira" ? `nombor ${k}` : g.id === "huruf" ? `huruf ${k}` : g.id === "warna" ? `warna ${k}` : g.id === "corak" ? `corak ${k}` : k;
  const vname = !("speechSynthesis" in window) ? "Pelayar ini tiada sokongan suara." :
    voice ? `${voice.name} (${voice.lang})${/^id/i.test(voice.lang) ? " — suara Bahasa Indonesia digunakan kerana tiada suara Bahasa Melayu" : ""}` :
    "Tiada suara Melayu/Indonesia ditemui. Pasang di Tetapan peranti › Teks-ke-pertuturan.";
  const sw = (id, v) => `<button class="sw ${v ? "on" : ""}" data-sw="${id}" aria-pressed="${v}" aria-label="${id}"></button>`;

  app.innerHTML = `<section class="screen parent">
    <div class="bar"><button class="ibtn" data-back aria-label="Kembali">⬅️</button><div class="sp"></div><b style="font-size:20px">Zon Ibu Bapa</b><div class="sp"></div><span style="font-size:34px">${p.av}</span></div>
    <h2 style="margin-top:6px">${esc(p.name)} — kemajuan</h2>
    <div class="kpis">
      <div class="kpi"><b>⭐ ${totalStars(p)}</b><span>bintang daripada ${GAMES.length * LEVELS * 3}</span></div>
      <div class="kpi"><b>${levelsDone(p)}/${GAMES.length * LEVELS}</b><span>tahap selesai</span></div>
      <div class="kpi"><b>📒 ${p.stickers.length}</b><span>pelekat</span></div>
      <div class="kpi"><b>${allAcc}</b><span>jawapan betul cubaan pertama</span></div>
      <div class="kpi"><b>${Math.round(secToday(p) / 60)} min</b><span>main hari ini${S.set.limit ? ` (had ${S.set.limit + (p.bonus[today()] || 0)})` : ""}</span></div>
      <div class="kpi"><b>🔥 ${p.lastDay === today() || p.lastDay === daysAgo(1) ? p.streak || 0 : 0}</b><span>hari berturut-turut</span></div>
    </div>

    <h2>Masa main 7 hari (${weekMin} min)</h2>
    <div class="panel"><div class="week">${week.map(w => `<div class="d ${w.d === today() ? "today" : ""}"><span>${Math.round(w.s / 60)}</span><i style="height:${Math.round(w.s / maxS * 90)}%"></i><span>${dn[new Date(w.d + "T12:00").getDay()]}</span></div>`).join("")}</div></div>

    <h2>Penguasaan kemahiran</h2>
    <div class="panel">${GAMES.map(g => { const a = acc(g.id), pr = prog(p, g.id);
      return `<div class="skill"><span>${g.e} ${g.skill}</span><div class="tr"><i style="width:${a ?? 0}%"></i></div><span class="v">${a == null ? "–" : a + "%"}</span></div>
      <div class="small" style="margin:-4px 0 6px">Tahap ${pr.filter(x => x).length}/3 · ${pr.map((s, l) => `${g.lv[l]}: ${s ? "⭐".repeat(s) : "–"}`).join(" · ")}</div>`; }).join("")}
    </div>

    <h2>Perlu latihan lagi</h2>
    <div class="panel">${weak.length ? `<div class="weak">${weak.slice(0, 10).map(w => `<span>${w.g.e} ${esc(label(w.g, w.k))} · ${Math.round(w.r * 100)}%</span>`).join("")}</div>
      <p class="small" style="margin-top:8px">Permainan akan tunjuk item ini lebih kerap secara automatik.</p>` : `<p class="small">Belum ada data — atau semuanya betul! 🎉</p>`}</div>

    <h2>Tetapan</h2>
    <div class="panel">
      <div class="set"><span>Suara arahan</span>${sw("voice", S.set.voice)}</div>
      <div class="set"><span>Kesan bunyi</span>${sw("sfx", S.set.sfx)}</div>
      <div class="set"><span>Kelajuan suara</span><select data-sel="rate">${[[0.7, "Perlahan"], [0.85, "Sederhana"], [1, "Biasa"]].map(([v, t]) => `<option value="${v}" ${S.set.rate == v ? "selected" : ""}>${t}</option>`).join("")}</select></div>
      <div class="set"><span>Had masa sehari</span><select data-sel="limit">${[[0, "Tiada had"], [10, "10 minit"], [15, "15 minit"], [20, "20 minit"], [30, "30 minit"], [45, "45 minit"], [60, "60 minit"]].map(([v, t]) => `<option value="${v}" ${S.set.limit == v ? "selected" : ""}>${t}</option>`).join("")}</select></div>
      <div class="set"><span>Beri masa tambahan hari ini</span><button class="pbtn" data-bonus>+15 minit</button></div>
      <p class="small" style="margin-top:8px">Suara: ${esc(vname)}</p>
    </div>

    <h2>Pemain</h2>
    <div class="panel">
      ${S.profiles.map(x => `<div class="set"><span>${x.av} ${esc(x.name)} ${x.id === p.id ? "<b>(aktif)</b>" : ""}</span>${x.id === p.id ? "" : `<button class="pbtn" data-switch="${x.id}">Tukar</button>`}</div>`).join("")}
      <div class="set"><button class="pbtn" data-add>➕ Tambah pemain</button><button class="pbtn danger" data-del>Padam ${esc(p.name)}</button></div>
    </div>

    <h2>Data</h2>
    <div class="panel">
      <div class="set"><span>Simpan salinan kemajuan (fail JSON)</span><button class="pbtn" data-export>Eksport</button></div>
      <div class="set"><span>Pulihkan dari fail</span><button class="pbtn" data-import>Import</button><input type="file" id="imp" accept="application/json,.json" hidden></div>
      <div class="set"><span>Set semula kemajuan ${esc(p.name)}</span><button class="pbtn danger" data-reset>Set semula</button></div>
      ${installEvt ? `<div class="set"><span>Pasang sebagai aplikasi</span><button class="pbtn" data-install>Pasang</button></div>` : ""}
      <p class="small" style="margin-top:8px">Semua data disimpan dalam peranti ini sahaja. Tiada akaun, tiada iklan, tiada data dihantar keluar.</p>
    </div>

    <h2>Tip untuk ibu bapa</h2>
    <div class="panel"><ul class="tips">
      <li><b>Main bersama.</b> Kanak-kanak belajar lebih banyak bila ibu bapa duduk sekali, sebut jawapan dan berbual tentangnya.</li>
      <li><b>Sesi pendek.</b> 10–20 minit sekali duduk sudah cukup. Jumlah skrin untuk umur 2–5 tahun: tidak lebih 1 jam sehari.</li>
      <li><b>Bawa ke dunia sebenar.</b> Selepas main "Warna", cari benda merah di rumah. Selepas "Kira", kira anak tangga bersama.</li>
      <li><b>Puji usaha, bukan hasil.</b> "Kamu cuba sampai dapat!" lebih baik daripada "Kamu pandai".</li>
      <li><b>Elak skrin</b> sejam sebelum tidur dan semasa makan.</li>
    </ul></div>
    <p class="small center" style="margin:16px 0">Belajar Bersama Sapo · v1</p>
  </section>`;

  const rerender = () => { save(); go("parent"); };
  on("[data-back]", () => go(overLimit() ? "rest" : "home"));
  on("[data-sw]", el => { S.set[el.dataset.sw] = !S.set[el.dataset.sw]; rerender(); });
  $$("[data-sel]").forEach(el => el.addEventListener("change", () => { S.set[el.dataset.sel] = +el.value; rerender(); if (el.dataset.sel === "rate") say("Ini kelajuan suara baharu."); }));
  on("[data-bonus]", () => { p.bonus[today()] = (p.bonus[today()] || 0) + 15; rerender(); });
  on("[data-switch]", el => { S.cur = el.dataset.switch; rerender(); });
  on("[data-add]", () => go("newProfile"));
  on("[data-del]", () => { if (!confirm(`Padam ${p.name} dan semua kemajuannya?`)) return; S.profiles = S.profiles.filter(x => x.id !== p.id); S.cur = S.profiles[0]?.id || null; save(); go("profiles"); });
  on("[data-reset]", () => { if (!confirm(`Set semula semua kemajuan ${p.name}?`)) return; Object.assign(p, newProfile(p.name, p.av), { id: p.id }); rerender(); });
  on("[data-export]", () => {
    const blob = new Blob([JSON.stringify(S, null, 1)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `sapo-belajar-${today()}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  on("[data-import]", () => $("#imp").click());
  $("#imp").addEventListener("change", async e => {
    const f = e.target.files[0]; if (!f) return;
    try { const d = JSON.parse(await f.text()); if (!Array.isArray(d.profiles)) throw 0; S = Object.assign(defaults(), d); S.set = Object.assign(defaults().set, d.set); save(); alert("Data dipulihkan."); go("profiles"); }
    catch (err) { alert("Fail tidak sah."); }
  });
  on("[data-install]", async () => { installEvt.prompt(); await installEvt.userChoice; installEvt = null; rerender(); });
};

/* ---------- mula ---------- */
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
go("profiles");
})();
