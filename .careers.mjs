/* Ad-hoc harness for /careers, 2026-09-07. Same discipline as .verify.mjs:
   measure, do not look. Checks the three things that can silently break on
   this page and would not show in a screenshot:

     1. every [data-reveal] actually reaches `is-in` (the filter must not be
        able to strand a card at opacity 0)
     2. the discipline filter hides and re-shows the right rows, and re-shown
        rows are still visible (opacity 1) — the Reveal-vs-React-className bug
     3. the role disclosure expands, and a collapsed panel is out of the tab
        order

   Plus the placeholder count and full-page shots in both themes. */
import { chromium } from "playwright";

const OUT = process.argv[2] || ".";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const fail = [];
const ok = (cond, msg) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`);
  if (!cond) fail.push(msg);
};

await p.goto("http://localhost:3100/careers", { waitUntil: "networkidle" });

/* --- 1. reveals ---------------------------------------------------------- */
/* `behavior: "instant"` is load-bearing. globals.css sets
   `html { scroll-behavior: smooth }`, so a plain window.scrollTo ANIMATES —
   a 60ms step never arrives at its target, the sweep glides through a
   fraction of the page, and the observer legitimately never sees most of it.
   First run of this file reported 17/61 reveals for exactly that reason.
   That is a harness artifact, not a page defect. */
await p.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 400) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 90)));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
});
await p.waitForTimeout(1200);
const reveals = await p.evaluate(() => {
  const all = [...document.querySelectorAll("[data-reveal]")];
  const cold = all.filter((e) => !e.classList.contains("is-in"));
  return { total: all.length, cold: cold.length };
});
ok(reveals.cold === 0, `reveals fired: ${reveals.total - reveals.cold}/${reveals.total}`);

/* --- 2. filter ----------------------------------------------------------- */
const ROW = "#openings > div > ul > li";
const roleCount = await p.locator(ROW).count();
ok(roleCount === 6, `six roles rendered (${roleCount})`);

await p.getByRole("button", { name: "Platform", exact: true }).click();
await p.waitForTimeout(200);
const shownPlatform = await p.evaluate(() =>
  [...document.querySelectorAll("#openings > div > ul > li h3")]
    .filter((h) => h.offsetParent !== null)
    .map((h) => h.textContent.trim()),
);
ok(
  shownPlatform.length === 2 &&
    shownPlatform.includes("Senior Node.js Engineer") &&
    shownPlatform.includes("Platform / DevOps Engineer"),
  `Platform filter → ${JSON.stringify(shownPlatform)}`,
);
const live = await p.locator("#openings p[aria-live]").textContent();
ok(/2 roles in Platform/.test(live), `live count reads "${live.trim()}"`);

await p.getByRole("button", { name: "All roles", exact: true }).click();
await p.waitForTimeout(500);
/* THE bug this file exists for: a row hidden and re-shown must still be
   visible, i.e. it must not have lost `is-in` to a React className rewrite. */
const restored = await p.evaluate(() => {
  const lis = [...document.querySelectorAll("#openings > div > ul > li")];
  return lis
    .map((li) => ({
      t: li.querySelector("h3")?.textContent.trim(),
      o: Number(getComputedStyle(li).opacity),
      shown: li.querySelector("h3")?.offsetParent !== null,
    }))
    .filter((r) => !r.shown || r.o < 0.99);
});
ok(restored.length === 0, `all six visible + opaque after re-show (${JSON.stringify(restored)})`);

/* --- 3. disclosure ------------------------------------------------------- */
const btn = p.getByRole("button", { name: /Read the whole role/ }).first();
const panel = p.locator("#role-senior-react-engineer");
ok((await panel.evaluate((e) => e.getBoundingClientRect().height)) < 2, "panel starts collapsed");
/* `visibility: hidden`, not merely zero height — a zero-height panel still
   leaves its content in the accessibility tree (HANDOFF §5.4). This panel has
   no focusable children today, so the tab-order half of that rule is moot;
   the a11y-tree half is not, and this is what enforces it. */
const vis = await panel.evaluate((e) => getComputedStyle(e).visibility);
ok(vis === "hidden", `collapsed panel visibility: ${vis}`);
await btn.click();
await p.waitForTimeout(500);
const h = await panel.evaluate((e) => e.getBoundingClientRect().height);
ok(h > 200, `panel expands to ${Math.round(h)}px`);
ok(
  (await p.locator("#openings article").first().getAttribute("class")).includes("border-accent/40"),
  "open card takes its open border",
);
/* The card that opened must still be visible — Faq.tsx's original defect. */
const opacityAfter = await p
  .locator(ROW)
  .first()
  .evaluate((e) => Number(getComputedStyle(e).opacity));
ok(opacityAfter > 0.99, `opened card opacity ${opacityAfter}`);
await btn.click();
await p.waitForTimeout(400);

/* --- 4. placeholders + headings ------------------------------------------ */
const ph = await p.evaluate(() =>
  [...document.querySelectorAll("[data-placeholder]")].map((e) =>
    e.getAttribute("data-placeholder"),
  ),
);
console.log(`\nplaceholders on /careers: ${ph.length}`);
ph.forEach((x) => console.log("  · " + x));

const heads = await p.evaluate(() =>
  [...document.querySelectorAll("main h1, main h2")].map(
    (h) => h.tagName + " " + h.textContent.trim().replace(/\s+/g, " "),
  ),
);
ok(heads.filter((h) => h.startsWith("H1")).length === 1, "exactly one H1");
console.log("\noutline:");
heads.forEach((h) => console.log("  " + h));

/* --- 5. shots ------------------------------------------------------------ */
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
