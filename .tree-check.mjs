/* Variant F (tech tree) — the overlap / interaction assertion.
   Run: node .tree-check.mjs   (server must be on :3231) */
import { createRequire } from "module";
const req = createRequire("c:/Users/Hariprathap/Desktop/interloid/next-js/package.json");
const { chromium } = req("playwright");

const URL = "http://localhost:3231/preview-scratch-tree";
const SHOTS = "c:/Users/Hariprathap/Desktop/interloid/next-js/.shots";
import fs from "fs";
fs.mkdirSync(SHOTS, { recursive: true });

const SEL = "[data-tree-leaf], [data-tree-rung], .eco-node";

function inter(a, b) {
  const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return ox > 0.5 && oy > 0.5 ? { ox, oy } : null;
}

async function boxes(page) {
  return page.evaluate((SEL) => {
    const stage = document.querySelector(".eco-stage");
    const sr = stage.getBoundingClientRect();
    const out = [];
    document.querySelectorAll(SEL).forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      out.push({
        kind: el.matches(".eco-node")
          ? "service"
          : el.hasAttribute("data-tree-rung")
            ? "rung"
            : "leaf",
        name:
          el.getAttribute("aria-label") ||
          el.querySelector("[role=img]")?.getAttribute("aria-label") ||
          el.textContent.trim().slice(0, 34),
        left: r.left - sr.left,
        top: r.top - sr.top,
        right: r.right - sr.left,
        bottom: r.bottom - sr.top,
        w: r.width,
        h: r.height,
      });
    });
    // the service label pills, which paint outside their button's box
    document.querySelectorAll(".eco-node > span:nth-child(2)").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 1) return;
      out.push({
        kind: "svclabel",
        name: el.textContent.trim(),
        left: r.left - sr.left,
        top: r.top - sr.top,
        right: r.right - sr.left,
        bottom: r.bottom - sr.top,
        w: r.width,
        h: r.height,
      });
    });
    const core = document.querySelector(".eco-stage .size-\\[116px\\]");
    const cr = core.getBoundingClientRect();
    return {
      stage: { w: sr.width, h: sr.height },
      core: {
        cx: cr.left + cr.width / 2 - sr.left,
        cy: cr.top + cr.height / 2 - sr.top,
        r: cr.width / 2,
        left: cr.left - sr.left,
        top: cr.top - sr.top,
        right: cr.right - sr.left,
        bottom: cr.bottom - sr.top,
      },
      boxes: out,
    };
  }, SEL);
}

function check(label, data) {
  const bad = [];
  const B = data.boxes;
  for (let i = 0; i < B.length; i++)
    for (let j = i + 1; j < B.length; j++) {
      const o = inter(B[i], B[j]);
      if (o)
        bad.push(
          `${B[i].kind}:${B[i].name} × ${B[j].kind}:${B[j].name}  (${o.ox.toFixed(1)}×${o.oy.toFixed(1)}px)`,
        );
    }
  // core: circle vs box
  const c = data.core;
  const coreHits = [];
  for (const b of B) {
    const nx = Math.max(b.left, Math.min(c.cx, b.right));
    const ny = Math.max(b.top, Math.min(c.cy, b.bottom));
    const d = Math.hypot(nx - c.cx, ny - c.cy);
    if (d < c.r - 0.5) coreHits.push(`${b.kind}:${b.name} (d=${d.toFixed(1)} r=${c.r})`);
  }
  // out of stage
  const spill = B.filter(
    (b) => b.left < -0.5 || b.top < -0.5 || b.right > data.stage.w + 0.5 || b.bottom > data.stage.h + 0.5,
  ).map((b) => `${b.kind}:${b.name} [${b.left.toFixed(1)},${b.top.toFixed(1)},${b.right.toFixed(1)},${b.bottom.toFixed(1)}]`);

  // tightest gaps, for information
  let minGap = Infinity, pair = "";
  for (let i = 0; i < B.length; i++)
    for (let j = i + 1; j < B.length; j++) {
      const a = B[i], b = B[j];
      const gx = Math.max(a.left - b.right, b.left - a.right);
      const gy = Math.max(a.top - b.bottom, b.top - a.bottom);
      const g = Math.max(gx, gy);
      if (g >= 0 && g < minGap) { minGap = g; pair = `${a.kind}:${a.name} ↔ ${b.kind}:${b.name}`; }
    }

  console.log(
    `\n[${label}] boxes=${B.length}  overlaps=${bad.length}  coreHits=${coreHits.length}  spill=${spill.length}  tightest=${minGap.toFixed(1)}px (${pair})`,
  );
  bad.slice(0, 12).forEach((x) => console.log("   OVERLAP " + x));
  coreHits.forEach((x) => console.log("   CORE    " + x));
  spill.forEach((x) => console.log("   SPILL   " + x));
  return bad.length + coreHits.length + spill.length;
}

const browser = await chromium.launch();
let fails = 0;

for (const width of [1440, 1920, 1024]) {
  const page = await browser.newPage({ viewport: { width, height: 1100 } });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  const doc = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  const overflow = doc.sw > doc.cw + 1;
  console.log(`\n===== ${width}px  scrollWidth=${doc.sw} clientWidth=${doc.cw} ${overflow ? "HORIZONTAL OVERFLOW" : "ok"}`);
  if (overflow) fails++;

  // resting state
  fails += check(`${width} rest`, await boxes(page));
  if (width === 1440) await page.screenshot({ path: `${SHOTS}/tree-rest-1440.png`, fullPage: false });

  // hover every service
  const nodes = await page.$$(".eco-stage .eco-node");
  console.log(`   service nodes: ${nodes.length}`);
  for (let i = 0; i < nodes.length; i++) {
    await nodes[i].hover();
    await page.waitForTimeout(500);
    const sel = await page.evaluate(() =>
      [...document.querySelectorAll(".eco-stage .eco-node")].findIndex(
        (n) => n.getAttribute("aria-selected") === "true",
      ),
    );
    if (sel !== i) { console.log(`   HOVER FAIL: expected ${i}, got ${sel}`); fails++; }
    fails += check(`${width} open#${i}`, await boxes(page));
    if (width === 1440 && (i === 0 || i === 2))
      await page.screenshot({ path: `${SHOTS}/tree-open-${i === 0 ? "web" : "backend"}-1440.png` });
  }

  // keyboard: focus first node then ArrowRight round the ring
  await page.evaluate(() => document.querySelector(".eco-stage .eco-node").focus());
  await page.waitForTimeout(250);
  for (let i = 0; i < 6; i++) {
    const sel = await page.evaluate(() =>
      [...document.querySelectorAll(".eco-stage .eco-node")].findIndex(
        (n) => n.getAttribute("aria-selected") === "true",
      ),
    );
    const focused = await page.evaluate(() =>
      [...document.querySelectorAll(".eco-stage .eco-node")].indexOf(document.activeElement),
    );
    if (sel !== i % 6 || focused !== i % 6) {
      console.log(`   KEYBOARD FAIL step ${i}: selected=${sel} focused=${focused}`);
      fails++;
    }
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(320);
  }
  console.log(`   keyboard: walked all six with ArrowRight`);
  await page.close();
}

// below lg: list only, no stage
const m = await browser.newPage({ viewport: { width: 900, height: 1000 } });
await m.goto(URL, { waitUntil: "networkidle" });
const small = await m.evaluate(() => ({
  stage: getComputedStyle(document.querySelector(".eco-stage")).display,
  listItems: document.querySelectorAll("ul.lg\\:hidden > li").length,
  sw: document.documentElement.scrollWidth,
  cw: document.documentElement.clientWidth,
}));
console.log(`\n===== 900px  stage display=${small.stage}  list items=${small.listItems}  overflow=${small.sw > small.cw + 1}`);
if (small.stage !== "none" || small.listItems !== 6) fails++;
await m.close();

await browser.close();
console.log(`\n==================  TOTAL FAILURES: ${fails}  ==================`);
process.exit(fails ? 1 : 0);
