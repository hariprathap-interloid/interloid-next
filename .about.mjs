/* Harness for /about. Same discipline as .careers.mjs: measure, do not look.

   The checks are chosen for what THIS page can get wrong, which is not what
   the others can. Every other page risks a layout defect; this one risks
   saying something untrue. An About page is the easiest place on a website to
   write fiction without noticing — a founding year, a headcount, a team of
   people who do not exist — and HANDOFF §7 blocked the route for two days for
   exactly that reason. So section 2 below is the reason this file exists, and
   the structural passes come after it.

   Usage: node .about.mjs [outDir] [baseUrl] */
import { chromium } from "playwright";

const OUT = process.argv[2] || ".";
const BASE = process.argv[3] || "http://localhost:3100";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const fail = [];
const ok = (c, m) => {
  console.log(`${c ? "PASS" : "FAIL"}  ${m}`);
  if (!c) fail.push(m);
};

await p.goto(`${BASE}/about`, { waitUntil: "networkidle" });

/* --- 1. reveals ---------------------------------------------------------- */
/* `behavior: "instant"` is load-bearing. globals.css sets
   `html { scroll-behavior: smooth }`, so a stepped scrollTo ANIMATES, never
   arrives at its target, and the observer legitimately never sees most of the
   page. The careers harness reported 17/61 for exactly this reason. */
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
  return { total: all.length, cold: all.filter((e) => !e.classList.contains("is-in")).length };
});
ok(rev.cold === 0, `reveals fired: ${rev.total - rev.cold}/${rev.total}`);

/* --- 2. NO INVENTED PEOPLE, NO UNVERIFIABLE COMPANY FACTS ---------------- */
/* THE CHECK THIS FILE EXISTS FOR. The reference About page carries sixteen
   named colleagues with photographs; this one must carry none, and must not
   have quietly grown a founding year, a headcount or a client count either.
   Those four are the standard furniture of an About page and all four are
   unverifiable from here. */
const all = await p.evaluate(() =>
  document.querySelector("main").textContent.replace(/\s+/g, " "),
);
const imgs = await p.evaluate(() =>
  [...document.querySelectorAll("main img")].map((i) => i.getAttribute("src")),
);
ok(imgs.length === 0, `no photographs (${imgs.length} <img> in main)`);
for (const [label, re] of [
  ["a founding year", /\b(founded|established|since)\b[^.]{0,20}\b(19|20)\d{2}/i],
  ["a headcount", /\b\d+\+?\s*(engineers|employees|people|team members|specialists)\b/i],
  ["a client count", /\b\d+\+?\s*(clients|customers|projects delivered|companies)\b/i],
  ["an award or certification", /\b(award[- ]winning|certified partner|iso \d)/i],
]) {
  ok(!re.test(all), `no ${label} asserted`);
}

/* The things it SHOULD say, counted so a rewrite cannot quietly drop them. */
for (const [label, re, min] of [
  ["the location", /Gobichettipalayam/g, 2],
  ["the legal entity", /Interloid Technologies Private Limited/g, 1],
  ["the seniority claim", /8[–-]12 years/g, 1],
]) {
  const n = (all.match(re) || []).length;
  ok(n >= min, `${label} stated ${n}x (expected at least ${min})`);
}

/* The admission is the whole point of the People section. If a later edit
   tidies it away, the page silently becomes a team page with no team. */
ok(
  /Why there are no photographs here/i.test(all),
  "the missing-team-page gap is stated out loud",
);

/* --- 2b. the roster is nameless, and says so ----------------------------- */
/* The roster was added on request after the constraint was flagged twice, and
   it is built so that ONE field per card switches it from the honest state to
   the finished one. Until that field is filled the slot must read as the
   promise the page already makes, not as a blank and certainly not as an
   invented person.

   Counted, not merely present: seven seats with six chips would mean somebody
   half-filled the list, which is the state most likely to ship by accident. */
const seats = await p.evaluate(() => document.querySelectorAll("#team ul li article").length);
const named = (all.match(/Named in your proposal/g) || []).length;
ok(seats > 0, `roster renders ${seats} seats`);
ok(
  named === seats,
  `every seat is nameless and says why (${named} chips for ${seats} seats)`,
);
/* The open seat is the eighth card and must point at /careers — it is the
   only route from /about to the hiring page. */
ok(
  await p.evaluate(() => !!document.querySelector('#team a[href="/careers"]')),
  "the open seat links to /careers",
);

/* --- 3. hover moves nothing --------------------------------------------- */
/* WorkCard.tsx's rule, asserted on the RECT and not on the class list — a
   class check would pass `hover:p-9` or `hover:mt-1`, which re-enter the same
   loop: the element moves out from under the pointer, `:hover` drops, it moves
   back, and it oscillates at frame rate. `translate`/`scale`/`transform` are
   read separately because Tailwind v4 compiles the first two to STANDALONE
   properties rather than to `transform`. */
for (const [sel, name] of [
  ["#shape ul li > div", "shape card"],
  ["#people ol li > div", "people row"],
  ["#team ul li > article", "roster card"],
  ["#place ul li > div", "place card"],
]) {
  const el = p.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(250);
  const read = () =>
    el.evaluate((e) => {
      const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      const tile = e.querySelector("span");
      return {
        box: [r.x, r.y, r.width, r.height].map((n) => +n.toFixed(2)).join(","),
        geom: `${cs.translate}|${cs.scale}|${cs.transform}`,
        sig: `${cs.backgroundColor}|${cs.borderTopColor}|${cs.boxShadow}|${
          tile ? getComputedStyle(tile).backgroundColor : ""
        }`,
      };
    });
  const rest = await read();
  await el.hover();
  await p.waitForTimeout(700);
  const hot = await read();
  ok(rest.box === hot.box, `${name}: box unchanged on hover (${hot.box})`);
  ok(hot.geom === "none|none|none", `${name}: no translate/scale/transform`);
  ok(rest.sig !== hot.sig, `${name}: hover signature fires`);
  await p.mouse.move(4, 4);
  await p.waitForTimeout(500);
}

/* --- 4. the sticky aside is actually sticky ------------------------------ */
/* `<body class="overflow-x-hidden">` used to make body a scroll container,
   which makes EVERY `position: sticky` on the site inert — found and fixed
   during the /services build (`overflow-x-clip` now, TAILWIND-MAP §4c). This
   is the only sticky element on /about, so it is the canary for a regression
   that would otherwise be invisible. */
const sticky = await p.evaluate(() => {
  const el = document.querySelector("#origin aside > div");
  return {
    pos: getComputedStyle(el).position,
    bodyOverflowX: getComputedStyle(document.body).overflowX,
  };
});
ok(sticky.pos === "sticky", `origin aside is position:sticky (${sticky.pos})`);
ok(
  sticky.bodyOverflowX !== "hidden",
  `body is not a scroll container (overflow-x: ${sticky.bodyOverflowX})`,
);

/* --- 5. structure and inventory ----------------------------------------- */
const heads = await p.evaluate(() =>
  [...document.querySelectorAll("main h1, main h2")].map(
    (h) => h.tagName + " " + h.textContent.trim().replace(/\s+/g, " "),
  ),
);
ok(heads.filter((h) => h.startsWith("H1")).length === 1, "exactly one H1");
console.log("\noutline:");
heads.forEach((h) => console.log("  " + h));

const ph = await p.evaluate(() =>
  [...document.querySelectorAll("[data-placeholder]")].map((e) =>
    e.getAttribute("data-placeholder"),
  ),
);
console.log(`\nplaceholders on /about: ${ph.length}`);
[...new Set(ph)].forEach((x) => console.log("  - " + x));

/* --- 6. hero height and overflow ---------------------------------------- */
/* Both directions, the lesson from the careers hero: it must fill a tall
   screen AND must never be forced taller than its own content on a short one,
   which is how a `min-h-screen` hero normally breaks a laptop. */
for (const [w, h, floor, label] of [
  [1440, 900, 0.85, "laptop"],
  [2560, 1440, 0.8, "24-inch"],
]) {
  await p.setViewportSize({ width: w, height: h });
  await p.waitForTimeout(300);
  const hero = await p.evaluate(() =>
    Math.round(document.querySelector("#about-top").getBoundingClientRect().height),
  );
  ok(hero / h >= floor, `hero fills ${((hero / h) * 100).toFixed(0)}% of ${label} ${w}x${h}`);
}
for (const w of [390, 768, 1024, 1440, 1920, 2560]) {
  await p.setViewportSize({ width: w, height: 900 });
  await p.waitForTimeout(250);
  const o = await p.evaluate(() => ({
    doc: document.documentElement.scrollWidth,
    win: window.innerWidth,
  }));
  ok(o.doc <= o.win, `no h-overflow at ${w} (scrollWidth ${o.doc})`);
}
await p.setViewportSize({ width: 1440, height: 900 });

/* --- 7. shots ----------------------------------------------------------- */
for (const theme of ["light", "dark"]) {
  await p.evaluate((t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
    document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-in"));
  }, theme);
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}/about-${theme}.png`, fullPage: true });
}
console.log(`\npage height ${await p.evaluate(() => document.body.scrollHeight)}px`);

await b.close();
console.log(fail.length ? `\n${fail.length} FAILED` : "\nall checks passed");
process.exit(fail.length ? 1 : 0);
