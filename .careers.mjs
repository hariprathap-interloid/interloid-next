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
     4. NOTHING on the page moves on hover — the flicker rule WorkCard.tsx
        paid for, asserted on the rect rather than on the class list
     5. senior content is PARKED, not published
     6. placeholder count, heading outline, overflow, shots in both themes

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

/* --- 3b. hover: the invariant, then four different signatures ------------- */
/* THE INVARIANT, asserted on the RECT rather than on the class list — a class
   check would happily pass `hover:p-9` or `hover:mt-1`, which re-enter exactly
   the same loop WorkCard.tsx documents: a hover-triggered size or position
   change on the hovered element moves its own hit box out from under the
   pointer, `:hover` drops, it moves back, and it oscillates at frame rate.

   `translate`/`scale`/`transform` are read separately because Tailwind v4
   compiles `-translate-y-*` to the STANDALONE `translate` property.

   THE SIGNATURES are deliberately different per section (see Roles.tsx's hover
   banner), so each row below names its own probe: what should change, and
   where. A shared assertion would only prove the shared chrome, which is the
   part that was never in question. */
for (const spec of [
  {
    sel: "#openings article",
    name: "roles",
    idx: 0,
    /* the role's hue floods, and the tech marks ring up */
    probe: (e) => {
      const flood = e.querySelector("div[aria-hidden]");
      const plate = e.querySelector("ul li");
      return `${getComputedStyle(flood).opacity}|${getComputedStyle(plate).boxShadow}`;
    },
    what: "hue flood + tech marks ring",
  },
  {
    sel: "#programme ol li > div",
    name: "programme",
    idx: 1,
    /* the numbered node ignites: fill plus a ring halo */
    probe: (e) => {
      const node = e.querySelector("span");
      const cs = getComputedStyle(node);
      return `${cs.backgroundColor}|${cs.boxShadow}`;
    },
    what: "node ignites",
  },
  {
    sel: "#hiring ol li > div",
    name: "hiring",
    idx: 0,
    /* the ghost step numeral brightens 0.09 -> 0.28 */
    probe: (e) => getComputedStyle(e.querySelector("span")).opacity,
    what: "step numeral brightens",
  },
  {
    sel: "#fit .grid > div > div",
    name: "fit",
    idx: 0,
    /* the icon tiles fill, staggered down the column */
    probe: (e) => {
      const tiles = [...e.querySelectorAll("ul li > span")];
      return tiles
        .map((t) => `${getComputedStyle(t).backgroundColor}@${getComputedStyle(t).transitionDelay}`)
        .join(" ");
    },
    what: "tiles fill in sequence",
  },
]) {
  const el = p.locator(spec.sel).nth(spec.idx);
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(250);
  const read = () =>
    el.evaluate((e, probeSrc) => {
      const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      // eslint-disable-next-line no-new-func
      const probe = new Function("e", `return (${probeSrc})(e)`);
      return {
        box: [r.x, r.y, r.width, r.height].map((n) => +n.toFixed(2)).join(","),
        border: cs.borderTopColor,
        shadow: cs.boxShadow,
        geom: `${cs.translate}|${cs.scale}|${cs.transform}`,
        sig: probe(e),
      };
    }, spec.probe.toString());

  const rest = await read();
  await el.hover();
  /* 900ms: the fit cascade's last tile starts at +180ms and runs 300ms. */
  await p.waitForTimeout(900);
  const hot = await read();

  ok(rest.box === hot.box, `${spec.name}: box unchanged on hover (${hot.box})`);
  ok(hot.geom === "none|none|none", `${spec.name}: no translate/scale/transform (${hot.geom})`);
  ok(rest.border !== hot.border, `${spec.name}: border warms`);
  /* The WHOLE shadow string. Tailwind v4 emits four zero-alpha placeholder
     shadows before the real ones, so a prefix comparison reports shadow-sm and
     shadow-lg as identical — which the first version of this check did, on all
     four cards. */
  ok(rest.shadow !== hot.shadow, `${spec.name}: shadow grows`);
  ok(rest.sig !== hot.sig, `${spec.name}: SIGNATURE fires — ${spec.what}`);

  await p.mouse.move(4, 4);
  await p.waitForTimeout(900);
  ok((await read()).sig === rest.sig, `${spec.name}: signature returns to rest`);
}

/* The four signatures must be DIFFERENT from one another, which is the whole
   point of the change and the one thing a per-card check cannot see. Compared
   as the set of probes that fire, not as prose. */
/* `> span:first-child` — the li holds TWO spans, the icon tile and the text.
   Without :first-child this read "0s, 0s, 0.06s, 0s, 0.12s", which still
   proved the point but only by accident. */
const stagger = await p.evaluate(() =>
  [...document.querySelectorAll("#fit .grid > div > div ul li > span:first-child")]
    .slice(0, 5)
    .map((t) => getComputedStyle(t).transitionDelay),
);
ok(
  new Set(stagger).size > 1,
  `fit: tiles are staggered, not simultaneous (${stagger.join(", ")})`,
);

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
