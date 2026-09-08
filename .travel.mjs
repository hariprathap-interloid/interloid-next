/* THE FLOW. Three beads ride every edge, continuously, from the moment the
   diagram reveals - no hover required and no rest between hops.

   Two things here cannot be checked by looking. Whether the loop is SEAMLESS
   is a question about the dash period: it has to be exactly 1/3 of the
   normalised path, or the pattern leaves a short run at the end of the edge
   that stutters once a cycle. And whether the flow is CONTINUOUS is a
   question about how many beads sit on an edge at each phase of the cycle -
   a screenshot only ever shows one phase. Both are measured below. */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
import { pick, reveal } from "./.pick.mjs";
const BASE = process.env.BASE || "http://localhost:3000";

const fails = [];
const ok = (n, c) => { console.log((c ? "PASS  " : "FAIL  ") + n); if (!c) fails.push(n); };

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 1200 } });
await p.goto(BASE + "/service-variants", { waitUntil: "networkidle" });
await p.waitForTimeout(900);
await reveal(p);
/* past the 1.15s + 0.4s entrance on `.eco-train` */
await p.waitForTimeout(2100);

const VARIANTS = ["constellation-circle", "constellation", "tree", "dendrogram", "columns"];

for (const v of VARIANTS) {
  /* One diagram is mounted at a time now — ask the switcher for this one,
     `fresh` because the first check below reads the RESTING state and the
     previous iteration ended on a hover. */
  await pick(p, v, { fresh: true });
  const sec = `#preview-${v}`;
  if (!(await p.locator(sec).count())) { ok(`${v} · present`, false); continue; }

  /* ---- IDLE. Nothing hovered: the six core→service links must already be
     running and visible, which is the whole point of the change. Read before
     any pointer goes near the stage. */
  const idle = await p.evaluate((s) => {
    const dots = [...document.querySelector(s).querySelectorAll(".eco-dot")];
    const live = dots.filter((d) => {
      const cs = getComputedStyle(d);
      return cs.animationName === "eco-travel" && cs.display !== "none";
    });
    /* the reveal gate lives on the <g>, so opacity has to be read there */
    const shown = live.filter((d) => +getComputedStyle(d.parentElement).opacity > 0.9);
    return { live: live.length, shown: shown.length };
  }, sec);
  ok(`${v} · flows with nothing hovered (${idle.shown / 3} edges)`, idle.shown >= 18);

  /* ---- THE PATTERN. Even entries of the dash list are beads, odd ones gaps.
     The sum IS the period and it must be exactly 1/3: at any other value the
     pattern does not tile the path a whole number of times, and the seam
     shows as a stutter. `linear` for the same reason - the pattern restarts
     three times per traversal and an eased curve would show every restart. */
  const pat = await p.evaluate((s) => {
    const el = document.querySelector(s + " .eco-dot");
    const cs = getComputedStyle(el);
    const parts = cs.strokeDasharray.split(/[\s,]+/).filter(Boolean).map(parseFloat);
    return {
      beads: parts.filter((_, i) => i % 2 === 0).length,
      period: +parts.reduce((a, x) => a + x, 0).toFixed(4),
      ease: cs.animationTimingFunction,
      dur: cs.animationDuration,
      delays: [...new Set([...document.querySelectorAll(s + " .eco-dot")]
        .map((d) => getComputedStyle(d).animationDelay))],
    };
  }, sec);
  ok(`${v} · one bead per period, period = 1/3 (${pat.period})`,
     pat.beads === 1 && Math.abs(pat.period - 1 / 3) < 0.001);
  ok(`${v} · linear, so the seam does not stutter (${pat.ease})`, pat.ease === "linear");
  ok(`${v} · one phase for the whole diagram (${pat.delays.join()})`, pat.delays.length === 1);

  /* ---- CONTINUITY. Step through a whole cycle and work out where every dash
     lands. Three must be on the path at EVERY phase - that is what "never
     empties" means, and it is the claim a screenshot cannot support. */
  const counts = [];
  for (let t = 0; t <= 800; t += 80) {
    counts.push(await p.evaluate(({ s, t }) => {
      for (const a of document.getAnimations())
        if (a.animationName === "eco-travel") { a.pause(); a.currentTime = t; }
      const el = document.querySelector(s + " .eco-dot");
      const cs = getComputedStyle(el);
      const dash = cs.strokeDasharray.split(/[\s,]+/).filter(Boolean).map(parseFloat);
      const off = parseFloat(cs.strokeDashoffset);
      const period = dash.reduce((a, x) => a + x, 0);
      let at = 0, n = 0;
      /* the pattern repeats along the whole path, so walk every repeat */
      for (let k = 0; at - off + k * period <= 1 + period; k++) {
        const sPos = at - off + k * period;
        if (sPos >= 0 && sPos <= 1) n++;
        if (k > 20) break;
      }
      return n;
    }, { s: sec, t }));
  }
  await p.evaluate(() => { for (const a of document.getAnimations()) a.play(); });
  /* THREE, except at the seam, where it is four. That is not a glitch and it
     is the whole mechanism: at offset 1/3 a bead sits at s=0 and another at
     s=1 in the same frame, so the one leaving the far end is replaced by the
     one entering the near end. Across the diagram that same instant puts a
     bead at the end of a parent edge and at the start of its child - the
     handoff. Never fewer than three is the claim; exactly three is not. */
  ok(`${v} · never empties across a cycle (${counts.join("/")} beads)`,
     counts.every((n) => n >= 3));

  /* ---- THE BEAD. A ring, not a blob: three widths on one geometry, the
     narrowest painted in the page background to punch the hole, and only the
     widest blurred - filtering the ring fogs the edge it exists to draw. */
  const bead = await p.evaluate((s) => {
    const g = document.querySelector(s + " .eco-train");
    return [...g.querySelectorAll(".eco-dot")].map((d) => ({
      w: +d.getAttribute("stroke-width"),
      blur: /drop-shadow/.test(getComputedStyle(d).filter),
      stroke: getComputedStyle(d).stroke,
    }));
  }, sec);
  const bg = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
  ok(`${v} · ring is 3 widths, widest first (${bead.map((l) => l.w).join(" > ")})`,
     bead.length === 3 && bead[0].w > bead[1].w && bead[1].w > bead[2].w);
  ok(`${v} · only the widest layer is blurred`,
     bead[0].blur && !bead[1].blur && !bead[2].blur);
  ok(`${v} · the hole is the page background`, bead[2].stroke === bg);

  /* ---- ON HOVER the branch joins the flow, without the spokes stopping. */
  await p.locator(`${sec} .eco-stage`).hover({ position: { x: 4, y: 4 } });
  await p.waitForTimeout(250);
  await p.hover(`#${v}-svc-2`);
  await p.waitForTimeout(800);
  const open = await p.evaluate((s) => document.querySelector(s)
    .querySelectorAll(".eco-train").length, sec);
  ok(`${v} · branch joins on hover (${idle.live / 3} → ${open} edges)`, open > idle.live / 3);
  await p.mouse.move(10, 10);
  await p.waitForTimeout(200);
}

/* reduced motion must stop it */
const rm = await b.newContext({ viewport: { width: 1600, height: 1200 }, reducedMotion: "reduce" });
const rp = await rm.newPage();
await rp.goto(BASE + "/service-variants", { waitUntil: "networkidle" });
await rp.waitForTimeout(900);
const moving = await rp.evaluate(
  () => [...document.querySelectorAll(".eco-dot")].filter(
    (l) => getComputedStyle(l).animationName === "eco-travel" &&
           getComputedStyle(l).display !== "none",
  ).length,
);
ok(`reduced-motion · flow is removed (${moving} still running)`, moving === 0);
await rm.close();

await b.close();
console.log(fails.length ? `\n${fails.length} FAILURES` : "\nALL GREEN");
process.exit(fails.length ? 1 : 0);
