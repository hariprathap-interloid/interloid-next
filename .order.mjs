/* THE ARRIVAL ORDER of an opening branch.

   Reported from a screenshot: bare lines and floating beads with no icons at
   the ends of them. A screenshot shows ONE frame, and the defect was about
   which things exist in the frames before a branch has settled — so this
   samples the whole opening and counts, at each moment, the nodes that have
   appeared, the edges that have finished drawing, and the beads on screen.

   TWO RULES, and both were broken:

     · a bead never outnumbers the drawn edges. `.eco-train` was held back by
       a TRANSITION, and a transition needs a change to fire — these <g>s
       MOUNT when a branch opens, so they rendered at full opacity instantly.
       It is an animation now, which is the only thing that runs on mount.
     · an edge never finishes before the node it points at has appeared. Every
       level used to lead its own node by 60-70ms, so there was always a
       window with a line pointing at nothing.

   The six beads at t=0 are the resting core spokes and are SUPPOSED to be
   there — the reader was already watching them before the hover. That is why
   the rule is "no more beads than drawn edges" and not "no beads yet". */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://localhost:3000";

const fails = [];
const ok = (n, c) => { console.log((c ? "PASS  " : "FAIL  ") + n); if (!c) fails.push(n); };

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 1200 } });
await p.goto(BASE + "/services", { waitUntil: "networkidle" });
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 60));
  }
});
await p.locator("#technologies .eco-stage").scrollIntoViewIfNeeded();
await p.waitForTimeout(2200);
await p.locator("#technologies .eco-stage").hover({ position: { x: 4, y: 4 } });
await p.waitForTimeout(400);

const sample = () =>
  p.evaluate(() => {
    const sec = document.querySelector("#technologies");
    const panel = sec.querySelector('.eco-branch[data-open="true"]');
    const nodes = panel ? [...panel.querySelectorAll(".eco-grow")] : [];
    const shown = nodes.filter((n) => +getComputedStyle(n).opacity > 0.5).length;
    const lines = [
      ...sec.querySelectorAll(".eco-stage svg line, .eco-stage svg path"),
    ].filter(
      (l) => l.classList.contains("stroke-accent") && !l.classList.contains("eco-dot"),
    );
    const drawn = lines.filter((l) => {
      const cs = getComputedStyle(l);
      return +cs.opacity > 0.1 && parseFloat(cs.strokeDashoffset) < 0.05;
    }).length;
    const beads = [...sec.querySelectorAll(".eco-train")].filter(
      (g) => +getComputedStyle(g).opacity > 0.1,
    ).length;
    return { nodes: shown, drawn, beads };
  });

const t0 = Date.now();
p.hover("#constellation-circle-svc-2");
const rows = [];
for (let i = 0; i < 15; i++) {
  rows.push({ t: Date.now() - t0, ...(await sample()) });
  await p.waitForTimeout(120);
}
await b.close();

console.log("\n t(ms)  nodes  edgesDrawn  beads");
for (const r of rows)
  console.log(
    String(r.t).padStart(6), String(r.nodes).padStart(6),
    String(r.drawn).padStart(11), String(r.beads).padStart(6),
  );
console.log("");

const ahead = rows.filter((r) => r.beads > r.drawn);
ok(`no frame has more beads than drawn edges (${ahead.length} bad)`, ahead.length === 0);

const settled = rows[rows.length - 1];
ok(`the branch is fully in by ${settled.t}ms (${settled.nodes} nodes, ${settled.drawn} edges, ${settled.beads} beads)`,
   settled.nodes > 10 && settled.beads > 10);

/* the beads must be LAST: the frame they arrive in must already have every
   node and every edge the settled frame has */
const arrival = rows.find((r) => r.beads > 6);
ok(`beads arrive only after the diagram (${arrival ? arrival.t : "never"}ms)`,
   !!arrival && arrival.nodes === settled.nodes && arrival.drawn === settled.drawn);

console.log(fails.length ? `\n${fails.length} FAILURES` : "\nALL GREEN");
process.exit(fails.length ? 1 : 0);
