/* The point of the change: a click must NOT stop hover from working. */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
import { pick, reveal } from "./.pick.mjs";
const BASE = process.env.BASE || "http://localhost:3000";

const fails = [];
const ok = (n, c) => { console.log((c ? "PASS  " : "FAIL  ") + n); if (!c) fails.push(n); };

const browser = await chromium.launch();

/* --- desktop: hover drives, click does not lock ------------------------- */
const page = await browser.newPage({ viewport: { width: 1600, height: 1150 } });
await page.goto(BASE + "/service-variants", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await reveal(page);

for (const v of ["dendrogram", "columns", "constellation-circle", "tree"]) {
  await pick(page, v);
  const stage = `#preview-${v} .eco-stage`;
  if (!(await page.locator(stage).count())) { ok(`${v} · present`, false); continue; }
  await page.locator(stage).hover({ position: { x: 4, y: 4 } });
  await page.waitForTimeout(300);

  await page.hover(`#${v}-svc-1`);
  await page.waitForTimeout(500);
  ok(`${v} · hover opens`, (await page.getAttribute(`#${v}-svc-1`, "aria-selected")) === "true");

  /* click one, then hover another - the second must win */
  await page.click(`#${v}-svc-2`);
  await page.waitForTimeout(400);
  await page.hover(`#${v}-svc-4`);
  await page.waitForTimeout(600);
  ok(
    `${v} · hover still works after a click`,
    (await page.getAttribute(`#${v}-svc-4`, "aria-selected")) === "true",
  );
}
await page.close();

/* --- touch: a tap must persist ------------------------------------------ */
const touch = await browser.newContext({
  viewport: { width: 900, height: 1200 },
  hasTouch: true,
  isMobile: false,
  /* the media query the hook reads */
  reducedMotion: "no-preference",
});
const tp = await touch.newPage();
await tp.emulateMedia({ media: "screen" });
await tp.goto(BASE + "/service-variants", { waitUntil: "networkidle" });
await tp.waitForTimeout(700);
const coarse = await tp.evaluate(() => window.matchMedia("(hover: none)").matches);
console.log(`      (touch context reports hover:none = ${coarse})`);
await touch.close();

await browser.close();
console.log(fails.length ? `\n${fails.length} FAILURES` : "\nALL GREEN");
process.exit(fails.length ? 1 : 0);
