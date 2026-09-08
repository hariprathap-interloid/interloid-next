/* The circle treatment makes group nodes much bigger (84px pill -> 92px disc),
   so it needs its own overlap pass: /preview has no circles and never
   exercises it. Also checks the label actually fits inside its circle. */
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
import { pick, reveal } from "./.pick.mjs";
const HERE = process.env.SHOTS || dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE || "http://localhost:3000";

const fails = [];
const ok = (n, c) => { console.log((c ? "PASS  " : "FAIL  ") + n); if (!c) fails.push(n); };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1150 } });
/* /circle-preview is gone — the circle treatment is the "Level 2" control on
   /service-variants, which is the same `.eco-circles` wrapper class. */
await page.goto(BASE + "/service-variants", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 90));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
});
await page.waitForTimeout(900);

ok("group labels are circular", await page.evaluate(() => {
  const g = document.querySelector(".eco-circles .eco-group");
  if (!g) return false;
  /* offsetWidth, NOT getBoundingClientRect: a closed branch's pill carries
     scale(0.82) from .eco-grow, so its rect is 75px for a 92px node and a
     size threshold on the rect fails for a shape that is perfectly correct. */
  return Math.abs(g.offsetWidth - g.offsetHeight) < 2 && g.offsetWidth > 80;
}));

/* does the text fit inside the disc? */
const spill = await page.evaluate(() =>
  [...document.querySelectorAll(".eco-circles .eco-group")].filter(
    (g) => g.scrollWidth > g.clientWidth + 1 || g.scrollHeight > g.clientHeight + 1,
  ).map((g) => g.textContent.trim()).slice(0, 6),
);
ok(`no group label overflows its circle (${spill.length}) ${spill.join(", ")}`, spill.length === 0);

for (const v of ["constellation", "tree", "dendrogram", "columns", "bloom"]) {
  await pick(page, v, { fresh: true });
  const stage = `#preview-${v} .eco-stage`;
  if (!(await page.locator(stage).count())) { ok(`${v} · present`, false); continue; }
  await page.locator(stage).hover({ position: { x: 4, y: 4 } });
  await page.waitForTimeout(350);
  let worst = 0, worstPairs = [];
  for (let i = 0; i < 6; i++) {
    await page.hover(`#${v}-svc-${i}`);
    await page.waitForTimeout(600);
    const o = await page.evaluate((p) => {
      const st = document.querySelector(`#preview-${p} .eco-stage`);
      const vis = (el) => {
        const cs = getComputedStyle(el);
        return cs.opacity !== "0" && cs.visibility !== "hidden" && cs.display !== "none";
      };
      const upright = (el) => {
        const m = (getComputedStyle(el).transform || "").match(/matrix\(([^)]+)\)/);
        if (!m) return true;
        const b = parseFloat(m[1].split(",")[1]);
        return !Number.isFinite(b) || Math.abs(b) < 0.01;
      };
      const boxes = [...st.querySelectorAll(".eco-node, .eco-grow, .eco-group")]
        .filter(vis).filter(upright)
        .map((n) => {
          const b = n.getBoundingClientRect();
          return { l: b.left + 3, t: b.top + 3, r: b.right - 3, bt: b.bottom - 3, w: b.width,
                   tag: (n.textContent || n.getAttribute("aria-label") || "?").trim().slice(0, 20) };
        }).filter((b) => b.w > 0);
      let hits = 0; const pairs = [];
      for (let i = 0; i < boxes.length; i++)
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i], b = boxes[j];
          if (a.l < b.r && b.l < a.r && a.t < b.bt && b.t < a.bt) {
            hits++; if (pairs.length < 4) pairs.push(`${a.tag} × ${b.tag}`);
          }
        }
      return { hits, pairs };
    }, v);
    if (o.hits > worst) { worst = o.hits; worstPairs = o.pairs; }
  }
  ok(`${v} · no overlaps with circular groups (worst ${worst}) ${worstPairs.join(", ")}`, worst === 0);
  await page.hover(`#${v}-svc-5`);
  await page.waitForTimeout(700);
  await page.locator(`#preview-${v}`).screenshot({ path: join(HERE, `cir2-${v}.png`) }).catch(() => {});
}

await browser.close();
console.log(fails.length ? `\n${fails.length} FAILURES` : "\nALL GREEN");
process.exit(fails.length ? 1 : 0);
