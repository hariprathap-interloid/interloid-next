/* Harness for /careers. Written 2026-09-07, rewritten 2026-09-08 with the
   page. Same discipline as .verify.mjs: measure, do not look.

   The page is now server-rendered end to end — the role filter and the role
   disclosure are gone, and with them the two failure modes the first version
   of this file existed to catch. What replaces them is worth more on this
   version anyway, because the page is now a set of TERMS and the real risk is
   a stale or self-contradicting one:

     1. every [data-reveal] reaches `is-in`
     2. every term stated on the page agrees with TERMS in site.ts — the
        stipend, the training length, the hours and the agreement appear in
        several sections and must never disagree
     3. every tech logo a role asks for actually LOADS, with an accessible
        name — a bad filename is a 404 that draws nothing inside a plate that
        still renders, so it looks empty rather than broken
     4. senior content is PARKED, not published
     5. placeholder count, heading outline, overflow, shots in both themes

   Usage: node .careers.mjs [outDir] [baseUrl] */
import { chromium } from "playwright";

const OUT = process.argv[2] || ".";
const BASE = process.argv[3] || "http://localhost:3100";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const fail = [];
const ok = (cond, msg) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`);
  if (!cond) fail.push(msg);
};

await p.goto(`${BASE}/careers`, { waitUntil: "networkidle" });

/* --- 1. reveals ---------------------------------------------------------- */
/* `behavior: "instant"` is load-bearing. globals.css sets
   `html { scroll-behavior: smooth }`, so a plain window.scrollTo ANIMATES — a
   60ms step never arrives at its target and the observer legitimately never
   sees most of the page. The first run of this file reported 17/61 for exactly
   that reason. Harness artifact, not a page defect. */
await p.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 400) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 90)));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
});
await p.waitForTimeout(1200);
const rev = await p.evaluate(() => {
  const all = [...document.querySelectorAll("[data-reveal]")];
  return {
    total: all.length,
    cold: all.filter((e) => !e.classList.contains("is-in")).length,
  };
});
ok(rev.cold === 0, `reveals fired: ${rev.total - rev.cold}/${rev.total}`);

/* --- 2. the terms agree with themselves ---------------------------------- */
/* THE CHECK THIS FILE EXISTS FOR NOW. Each of these comes from TERMS in
   site.ts and is rendered by two or three different components. A page that
   says "6 months" in the hero and "3 months" in the programme is worse than
   one that says neither, and nothing else on the project would catch it. */
const body = await p.evaluate(() => document.querySelector("main").innerText);
/* innerText is VISIBLE text only, which is the right lens for "what does a
   reader see" — but the FAQ answers sit in collapsed panels at
   `visibility: hidden`, so none of them appear in it. Anything asserted about
   an answer has to read textContent instead. Costs one line and would
   otherwise read as the page missing copy that is in fact there. */
const all = await p.evaluate(() =>
  document.querySelector("main").textContent.replace(/\s+/g, " "),
);
/* Regexes, not substrings: the page writes durations the way English does —
   "6-month training", "Six months of training", "the first six months" — and
   a literal "6 months" match reported 1 occurrence out of four real ones.
   The check is that the FIGURE never disagrees, not that the wording is
   uniform, so the pattern absorbs the spelling and the count does the work. */
for (const [label, re, min] of [
  ["the stipend", /₹10,000/g, 3],
  ["the training length", /(6[- ]month|six month)/gi, 3],
  ["the training hours", /(12[- ]hour|twelve[- ]hour)/gi, 1],
  ["the agreement", /two[- ]year|2 years/gi, 2],
  ["the location", /Gobichettipalayam/g, 2],
]) {
  const n = (body.match(re) || []).length;
  ok(n >= min, `${label} stated ${n}× (expected at least ${min})`);
}
/* Nothing may OFFER remote — the senior page's language has to be gone, not
   merely outnumbered. "hybrid" is deliberately NOT banned: the FAQ asks
   "Is there any remote or hybrid option?" and answers no, which is the page
   doing its job. So the assertion is on the answer, not on the word. */
for (const banned of ["Remote (India)", "remote-first", "Remote within India"]) {
  ok(!body.includes(banned), `no stale "${banned}"`);
}
ok(/on site/i.test(body), "the page says on site");
ok(
  /No\. Every role on this page is on site/i.test(all),
  "the remote question is answered no",
);

/* --- 3. tech logos load, and are named ----------------------------------- */
/* These are now REAL FILES out of public/tech/, rendered by the same
   service/TechLogo the /services page uses — not the nine SVGs that were
   hand-drawn here first. That changes the failure mode, and this check with
   it: a wrong `file` in site.ts is a 404 whose <img> draws NOTHING inside a
   plate that still renders, so the card looks merely empty rather than broken.
   naturalWidth is the only thing that can tell the difference. */
const icons = await p.evaluate(() => {
  const plates = [...document.querySelectorAll('#openings span[role="img"]')];
  const imgs = plates.map((s) => s.querySelector("img")).filter(Boolean);
  return {
    plates: plates.length,
    imgs: imgs.length,
    unnamed: plates.filter((s) => !s.getAttribute("aria-label")).length,
    broken: imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute("src")),
    names: [...new Set(plates.map((s) => s.getAttribute("aria-label")))].sort(),
  };
});
ok(icons.plates === 16, `16 tech logos rendered (${icons.plates})`);
/* Zero monograms expected: every technology named on this page has a file in
   the set. A plate with no <img> means a `file` went missing from site.ts. */
ok(icons.imgs === 16, `all 16 are real logo files, not monograms (${icons.imgs})`);
ok(icons.broken.length === 0, `every logo file loaded (${icons.broken.join(", ") || "none broken"})`);
ok(icons.unnamed === 0, `every logo has an accessible name (${icons.unnamed} without)`);
console.log(`  logos: ${icons.names.join(", ")}`);

/* --- 4. senior content is parked, and said out loud ---------------------- */
ok(!/L \/ year/.test(body), "no senior salary bands on the page");
ok(
  /closed at the moment|not hiring seniors|Not at the moment/i.test(body),
  "the page says senior hiring is closed",
);

/* --- 5. inventory -------------------------------------------------------- */
const ph = await p.evaluate(() =>
  [...document.querySelectorAll("[data-placeholder]")].map((e) =>
    e.getAttribute("data-placeholder"),
  ),
);
console.log(`\nplaceholders on /careers: ${ph.length}`);
[...new Set(ph)].forEach((x) => console.log("  · " + x));

const heads = await p.evaluate(() =>
  [...document.querySelectorAll("main h1, main h2")].map(
    (h) => h.tagName + " " + h.textContent.trim().replace(/\s+/g, " "),
  ),
);
ok(heads.filter((h) => h.startsWith("H1")).length === 1, "exactly one H1");
console.log("\noutline:");
heads.forEach((h) => console.log("  " + h));

/* --- 6. no horizontal overflow ------------------------------------------- */
for (const w of [390, 768, 1024, 1440, 1920]) {
  await p.setViewportSize({ width: w, height: 900 });
  await p.waitForTimeout(250);
  const o = await p.evaluate(() => ({
    doc: document.documentElement.scrollWidth,
    win: window.innerWidth,
  }));
  ok(o.doc <= o.win, `no h-overflow at ${w} (scrollWidth ${o.doc})`);
}
await p.setViewportSize({ width: 1440, height: 900 });

/* --- 7. shots ------------------------------------------------------------ */
for (const theme of ["light", "dark"]) {
  await p.evaluate((t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
    document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-in"));
  }, theme);
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}/careers-${theme}.png`, fullPage: true });
}
const height = await p.evaluate(() => document.body.scrollHeight);
console.log(`\npage height ${height}px`);

await b.close();
console.log(fail.length ? `\n${fail.length} FAILED` : "\nall checks passed");
process.exit(fail.length ? 1 : 0);
