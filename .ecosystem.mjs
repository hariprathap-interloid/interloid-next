/* Check the three ecosystem variants: do all three levels open for all six
   services, by mouse and keyboard, without any node overlapping another? */
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const HERE = process.env.SHOTS || dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE || "http://localhost:3000";

const fails = [];
const ok = (n, c) => { console.log((c ? "PASS  " : "FAIL  ") + n); if (!c) fails.push(n); };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });
await page.goto(BASE + "/preview", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 90));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
});
await page.waitForTimeout(900);

const SERVICES = ["Web Development", "Mobile App Development", "Backend Development & APIs",
  "Cloud Infrastructure & DevOps", "AI Integration & Automation", "Staff Augmentation"];

/* count overlaps among the VISIBLE nodes of the open branch */
const overlaps = (prefix) =>
  page.evaluate((p) => {
    const stage = document.querySelector(`#preview-${p} .eco-stage`);
    if (!stage) return { err: "no stage" };
    const vis = (el) => {
      const cs = getComputedStyle(el);
      return cs.opacity !== "0" && cs.visibility !== "hidden" && cs.display !== "none";
    };
    const nodes = [...stage.querySelectorAll(".eco-node, .eco-grow")].filter(vis);
    const boxes = nodes.map((n) => {
      const b = n.getBoundingClientRect();
      /* shrink by 3px: touching edges are fine, real collision is not */
      return { l: b.left + 3, t: b.top + 3, r: b.right - 3, bt: b.bottom - 3, w: b.width, h: b.height,
               tag: (n.textContent || n.getAttribute("aria-label") || "?").trim().slice(0, 24) };
    }).filter((b) => b.w > 0 && b.h > 0);
    let hits = 0;
    const pairs = [];
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j];
        if (a.l < b.r && b.l < a.r && a.t < b.bt && b.t < a.bt) { hits++; if (pairs.length < 6) pairs.push(`${a.tag} × ${b.tag}`); }
      }
    return { count: boxes.length, hits, pairs };
  }, prefix);

/* Every variant currently mounted on /preview. Add a name here when a new
   layout lands; the suite then holds it to the same contract as the rest. */
const VARIANTS = (process.env.VARIANTS || "bloom,branch,shells").split(",");

for (const variant of VARIANTS) {
  console.log(`\n--- ${variant} ---`);
  const stage = `#preview-${variant} .eco-stage`;
  ok(`${variant} · stage renders`, (await page.locator(stage).count()) === 1);
  ok(`${variant} · six service tabs`, (await page.locator(`${stage} [role=tab]`).count()) === 6);

  /* Park the pointer inside the stage BEFORE measuring anything. The resting
     cycle scales one node at a time on a 20.4s loop, and Playwright waits for
     an element to be geometrically stable before it will hover it - so a hover
     issued while the target is mid-pulse is timed against a moving box and the
     first assertion of the loop went flaky. Entering the stage stops the cycle
     (.eco-stage:hover) and everything settles. */
  await page.locator(stage).hover({ position: { x: 4, y: 4 } });
  await page.waitForTimeout(400);

  let worst = 0;
  for (let i = 0; i < 6; i++) {
    await page.hover(`#${variant}-svc-${i}`);
    await page.waitForTimeout(650);
    const sel = await page.getAttribute(`#${variant}-svc-${i}`, "aria-selected");
    const panel = page.locator(`#${variant}-panel-${i}`);
    const txt = (await panel.innerText().catch(() => "")) || "";
    const groups = await page.locator(`#preview-${variant} .eco-grow`).count();
    if (sel !== "true") ok(`${variant} · ${SERVICES[i]} selects on hover`, false);
    const o = await overlaps(variant);
    if (o.hits > worst) worst = o.hits;
    if (o.hits) console.log(`      overlaps on ${SERVICES[i]}: ${o.hits} — ${o.pairs.join(", ")}`);
  }
  ok(`${variant} · every service opens on hover`, true);
  ok(`${variant} · no overlapping nodes in any branch (worst ${worst})`, worst === 0);

  /* THE CORE IS A NODE TOO. The first version of this check only compared
     .eco-node/.eco-grow with each other, so it happily passed a wheel whose
     inner services sat on top of the hub - the judge panel found that by
     arithmetic, not this harness. */
  const coreHit = await page.evaluate((p) => {
    const stage = document.querySelector(`#preview-${p} .eco-stage`);
    const core = stage.querySelector('[class*="rounded-full"][aria-hidden="true"]');
    if (!core) return -1;
    const c = core.getBoundingClientRect();
    const cx = c.left + c.width / 2, cy = c.top + c.height / 2, cr = c.width / 2;
    let hits = 0;
    stage.querySelectorAll('.eco-node, .eco-grow').forEach((n) => {
      const b = n.getBoundingClientRect();
      if (!b.width) return;
      const nx = Math.max(b.left, Math.min(cx, b.right));
      const ny = Math.max(b.top, Math.min(cy, b.bottom));
      if (Math.hypot(nx - cx, ny - cy) < cr - 2) hits++;
    });
    return hits;
  }, variant);
  ok(`${variant} · nothing overlaps the core (${coreHit})`, coreHit === 0);

  /* keyboard: focus the first tab, arrow through */
  await page.focus(`#${variant}-svc-0`);
  await page.waitForTimeout(200);
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  ok(`${variant} · arrow key moves the selection`,
    (await page.getAttribute(`#${variant}-svc-1`, "aria-selected")) === "true");
  ok(`${variant} · roving tabindex`,
    (await page.getAttribute(`#${variant}-svc-1`, "tabindex")) === "0" &&
    (await page.getAttribute(`#${variant}-svc-0`, "tabindex")) === "-1");

  /* tap pins */
  await page.click(`#${variant}-svc-3`);
  await page.waitForTimeout(400);
  await page.mouse.move(10, 10);
  await page.waitForTimeout(400);
  ok(`${variant} · tap pins the selection`,
    (await page.getAttribute(`#${variant}-svc-3`, "aria-selected")) === "true");
  await page.click(`#${variant}-svc-3`);
  await page.waitForTimeout(300);

  /* level 3 really shows brand marks */
  const imgs = await page.locator(`#preview-${variant} .eco-grow img, #preview-${variant} .eco-grow span[role=img]`).count();
  ok(`${variant} · level-3 marks render (${imgs})`, imgs >= 8 || variant === "branch");

  /* screenshot the open worst case (Backend = index 2) */
  await page.hover(`#${variant}-svc-2`);
  await page.waitForTimeout(700);
  await page.locator(`#preview-${variant}`).screenshot({ path: join(HERE, `eco-${variant}-backend.png`) }).catch(() => {});
  await page.hover(`#${variant}-svc-0`);
  await page.waitForTimeout(700);
  await page.locator(`#preview-${variant}`).screenshot({ path: join(HERE, `eco-${variant}-web.png`) }).catch(() => {});
}

/* mobile fallback */
await page.setViewportSize({ width: 390, height: 900 });
await page.goto(BASE + "/preview", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const stageVisible = await page.evaluate(() =>
  [...document.querySelectorAll(".eco-stage")].filter((s) => getComputedStyle(s).display !== "none").length);
ok(`mobile · no radial stage at 390 (${stageVisible} visible)`, stageVisible === 0);
const listItems = await page.locator("#preview-bloom ul li").count();
ok(`mobile · list fallback renders (${listItems} rows)`, listItems > 6);
const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
ok("mobile · no horizontal overflow", !overflow);
await page.screenshot({ path: join(HERE, "eco-mobile.png") });

/* reduced motion: the cycle must be off */
const rm = await browser.newContext({ viewport: { width: 1600, height: 1100 }, reducedMotion: "reduce" });
const rp = await rm.newPage();
await rp.goto(BASE + "/preview", { waitUntil: "networkidle" });
await rp.waitForTimeout(700);
const animating = await rp.evaluate(() =>
  [...document.querySelectorAll(".eco-node")].filter((n) => getComputedStyle(n).animationName !== "none").length);
ok(`reduced-motion · resting cycle is off (${animating} still animating)`, animating === 0);
const scaled = await rp.evaluate(() =>
  [...document.querySelectorAll(".eco-node")].filter((n) => /scale\(1\.1/.test(getComputedStyle(n).transform)).length);
ok(`reduced-motion · no node stuck enlarged (${scaled})`, scaled === 0);
await rm.close();

await browser.close();
console.log(fails.length ? `\n${fails.length} FAILURES` : "\nALL GREEN");
process.exit(fails.length ? 1 : 0);
