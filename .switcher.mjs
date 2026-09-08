/* /service-variants is one page with a control, not eight stacked diagrams.
   Four things about that are worth asserting, and three of them are traps
   this codebase has already fallen into once.

   · THE REVEAL TRAP. Reveal.tsx observes every [data-reveal] once on mount and
     unobserves on the first hit. If a switch remounted the wrapper it would
     never be observed again and the diagram would be invisible for good -
     silently, because nothing errors. Checked after every switch.
   · STICKY. `overflow-x-hidden` on <body> made the whole site's sticky
     elements inert for months (TAILWIND-MAP §4c). The control is the only
     sticky thing on this page; measure that it actually pins.
   · ROVING TABINDEX. A radiogroup is one tab stop. Eight would put the
     diagram nine tabs below the heading.
   · ONE AT A TIME, which is the whole reason for the page. */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
import { pick, reveal } from "./.pick.mjs";
const BASE = process.env.BASE || "http://localhost:3000";

const fails = [];
const ok = (n, c) => { console.log((c ? "PASS  " : "FAIL  ") + n); if (!c) fails.push(n); };

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 1150 } });
await p.goto(BASE + "/service-variants", { waitUntil: "networkidle" });
await p.waitForTimeout(800);
await reveal(p);

/* ---- the catalogue is complete ---------------------------------------- */
const LAYOUTS = ["constellation", "branch", "tree", "dendrogram", "columns",
                 "bloom", "magnify", "shells"];
const chips = await p.$$eval('[role="radio"][data-choice]',
  (els) => els.map((e) => e.dataset.choice));
ok(`all eight designs offered (${chips.filter((c) => LAYOUTS.includes(c)).length})`,
   LAYOUTS.every((l) => chips.includes(l)));
ok(`level-2 shape is its own control`, chips.includes("circle") && chips.includes("pill"));

/* ---- one tab stop per group ------------------------------------------- */
const stops = await p.$$eval('[role="radiogroup"]', (gs) =>
  gs.map((g) => [...g.querySelectorAll('[role="radio"]')]
    .filter((r) => r.tabIndex === 0).length));
ok(`roving tabindex — one stop per group (${stops.join()})`,
   stops.length === 3 && stops.every((n) => n === 1));

/* ---- arrow keys move the selection ------------------------------------ */
await p.click('[data-choice="constellation"]');
await p.waitForTimeout(300);
await p.focus('[data-choice="constellation"]');
await p.keyboard.press("ArrowRight");
await p.waitForTimeout(700);
ok(`arrow key moves to the next design`,
   (await p.getAttribute('[data-choice="branch"]', "aria-checked")) === "true");

/* ---- one diagram at a time, and it survives the switch ---------------- */
for (const v of ["constellation-circle", "tree", "columns", "shells", "branch"]) {
  await pick(p, v);
  const r = await p.evaluate((v) => {
    const stages = document.querySelectorAll(".eco-stage");
    const sec = document.querySelector(`#preview-${v}`);
    /* the wrapper around the DIAGRAM, not the first [data-reveal] in the
       section — that one is the instruction paragraph, and reading it
       reported "revealed" for a diagram that had gone blank */
    const wrap = sec?.querySelector(".eco-stage")?.closest("[data-reveal]");
    const line = sec?.querySelector(".eco-line");
    return {
      stages: stages.length,
      revealed: !!wrap?.classList.contains("is-in"),
      /* the reveal trap shows up HERE: an unobserved wrapper leaves every
         connector at dashoffset 1, i.e. drawn to zero length */
      drawn: line
        ? parseFloat(getComputedStyle(line).strokeDashoffset) < 0.01
        : null,
    };
  }, v);
  ok(`${v} · exactly one diagram mounted (${r.stages})`, r.stages === 1);
  ok(`${v} · wrapper kept its reveal across the switch`, r.revealed);
  ok(`${v} · connectors are drawn, not left at zero length`, r.drawn === true);
}

/* ---- the flow control, which is what decides this now ------------------
   It used to be a per-design constant and `branch` was pinned still. That was
   wrong: whether a design is better with the beads or without them is the
   question this page exists to answer, so it cannot be answered in the
   catalogue on the design's behalf. The control is authoritative and survives
   a design change, because comparing two layouts is only fair if the beads
   are the same on both. */
const beads = () => p.$$eval(".eco-train",
  (gs) => gs.filter((g) => getComputedStyle(g).display !== "none").length);

await pick(p, "constellation-circle");
await p.click('[data-choice="with"]');
await p.waitForTimeout(1800);
const on = await beads();
ok(`with dots — the flow runs (${on} trains)`, on >= 6);

await p.click('[data-choice="without"]');
await p.waitForTimeout(700);
const off = await beads();
ok(`without dots — the flow is gone (${off} trains)`, off === 0);

/* and the choice holds across a design change, or the comparison is not one */
await pick(p, "tree");
ok(`without dots survives a design change (${await beads()} trains)`,
   (await beads()) === 0);
await p.click('[data-choice="with"]');
await p.waitForTimeout(1800);
ok(`with dots comes back (${await beads()} trains)`, (await beads()) >= 6);

/* ---- the control pins ------------------------------------------------- */
await pick(p, "tree");
const y = async () =>
  Math.round((await p.locator('[role="radiogroup"]').first().boundingBox()).y);
await p.evaluate(() => window.scrollBy({ top: 900, behavior: "instant" }));
await p.waitForTimeout(300);
const pinned = await y();
await p.evaluate(() => window.scrollBy({ top: 700, behavior: "instant" }));
await p.waitForTimeout(300);
const still = await y();
/* TWO readings after it has already reached its offset. Comparing a pinned
   position against the RESTING one only proves the page scrolled. */
ok(`the control stays pinned while the diagram scrolls (${pinned} → ${still})`,
   Math.abs(still - pinned) < 5 && still > 0 && still < 200);

await b.close();
console.log(fails.length ? `\n${fails.length} FAILURES` : "\nALL GREEN");
process.exit(fails.length ? 1 : 0);
