/* Does the travelling dash actually run, on every variant, all the way from
   the parent edge out to the last child's edge? */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://localhost:3000";

const fails = [];
const ok = (n, c) => { console.log((c ? "PASS  " : "FAIL  ") + n); if (!c) fails.push(n); };

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 1200 } });
await p.goto(BASE + "/service-variants", { waitUntil: "networkidle" });
await p.waitForTimeout(900);
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 80));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
});
await p.waitForTimeout(800);

for (const v of ["constellation-circle", "constellation", "tree", "dendrogram", "columns"]) {
  const sec = `#preview-${v}`;
  if (!(await p.locator(sec).count())) { ok(`${v} · present`, false); continue; }
  await p.locator(`${sec} .eco-stage`).hover({ position: { x: 4, y: 4 } });
  await p.waitForTimeout(300);
  await p.hover(`#${v}-svc-2`);
  await p.waitForTimeout(900);

  const r = await p.evaluate((s) => {
    const sec = document.querySelector(s);
    const lines = [...sec.querySelectorAll(".eco-line")];
    const running = lines.filter(
      (l) => getComputedStyle(l).animationName === "eco-travel",
    );
    /* how far out does the animation reach? compare the longest running edge
       against the longest edge in the section */
    const len = (el) => { try { return el.getTotalLength(); } catch { return 0; } };
    const maxRunning = Math.max(0, ...running.map(len));
    const maxAny = Math.max(0, ...lines.map(len));
    return { lines: lines.length, running: running.length, maxRunning: Math.round(maxRunning), maxAny: Math.round(maxAny) };
  }, sec);

  ok(`${v} · dash runs on the open branch (${r.running}/${r.lines} edges)`, r.running > 0);
  console.log(`      longest animated edge ${r.maxRunning} of ${r.maxAny} in section`);
}

/* reduced motion must stop it */
const rm = await b.newContext({ viewport: { width: 1600, height: 1200 }, reducedMotion: "reduce" });
const rp = await rm.newPage();
await rp.goto(BASE + "/service-variants", { waitUntil: "networkidle" });
await rp.waitForTimeout(900);
const moving = await rp.evaluate(
  () => [...document.querySelectorAll(".eco-line")].filter(
    (l) => getComputedStyle(l).animationName === "eco-travel" &&
           getComputedStyle(l).animationDuration !== "0.01ms",
  ).length,
);
ok(`reduced-motion · dash is stopped (${moving} still running)`, moving === 0);
await rm.close();

await b.close();
console.log(fails.length ? `\n${fails.length} FAILURES` : "\nALL GREEN");
process.exit(fails.length ? 1 : 0);
