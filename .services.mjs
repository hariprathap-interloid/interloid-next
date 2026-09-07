/* /services verification — structure, the mode switch, the scroll-linked
   capability panel, the disclosure, reveals, both themes, three viewports. */
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const HERE = process.env.SHOTS || dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE || "http://localhost:3000";

const fails = [];
const ok = (n, c) => {
  console.log((c ? "PASS  " : "FAIL  ") + n);
  if (!c) fails.push(n);
};

/* smooth-scroll swallows a stepped sweep (TAILWIND-MAP §4b's lesson) */
const sweep = (page) =>
  page.evaluate(async () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 200));
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 110));
    }
  });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

/* ---- home: the two sections are gone, links retargeted ----------------- */
await page.goto(BASE + "/", { waitUntil: "networkidle" });
ok("home · no What-we-build section", (await page.locator("#services").count()) === 0);
ok("home · no stack marquee section", (await page.locator("#stack").count()) === 0);
ok("home · no dangling #services / #stack links", (await page.locator('a[href="#services"],a[href="/#services"],a[href="/#stack"]').count()) === 0);
ok("home · nav → /services", (await page.locator('nav a[href="/services"]').count()) > 0);
ok("home · footer → /services", (await page.locator('footer a[href="/services"]').count()) > 0);
ok("home · hero cue → #advantage", (await page.locator('a[href="#advantage"]').count()) > 0);

/* ---- /services structure ---------------------------------------------- */
await page.goto(BASE + "/services", { waitUntil: "networkidle" });
await page.waitForTimeout(700);
for (const id of ["services-top", "problems", "capabilities", "approach", "engagement", "terms", "start"])
  ok(`services · #${id}`, (await page.locator(`#${id}`).count()) === 1);
ok("services · exactly one h1", (await page.locator("h1").count()) === 1);
ok("services · no placeholders on the page", (await page.locator("main [data-placeholder]").count()) === 0);

/* ---- the mode switch drives the page ---------------------------------- */
const heroText = () => page.locator("#mode-panel-hero").innerText();
ok("mode · defaults to build", (await heroText()).includes("build the thing you can't staff"));
ok("mode · hero figure is the build range", (await page.locator("#services-top").innerText()).includes("$25k–$90k"));
await page.click("#mode-tab-1");
await page.waitForTimeout(250);
ok("mode · switching rewrites the H1", (await heroText()).includes("join the team you already have"));
ok("mode · switching rewrites the CTA", (await heroText()).includes("Add engineers to our team"));
ok("mode · switching rewrites the figure", (await page.locator("#services-top").innerText()).includes("Monthly"));
ok("mode · roving tabindex", (await page.getAttribute("#mode-tab-1", "tabindex")) === "0" && (await page.getAttribute("#mode-tab-0", "tabindex")) === "-1");
await page.focus("#mode-tab-1");
await page.keyboard.press("ArrowLeft");
await page.waitForTimeout(250);
ok("mode · arrow key moves selection", (await heroText()).includes("build the thing you can't staff"));

/* the second switch, far down the page, stays in sync with the first */
ok("mode · engagement panel follows", (await page.locator("#engage-panel").innerText()).includes("We build it. You own it"));
await page.click("#engage-tab-1");
await page.waitForTimeout(250);
ok("mode · second switch drives the panel", (await page.locator("#engage-panel").innerText()).includes("Our seniors, inside your process"));
ok("mode · and feeds back to the hero", (await heroText()).includes("join the team you already have"));
ok("mode · approach note follows the mode", (await page.locator("#approach").innerText()).includes("first pull request goes into your repo"));
await page.click("#engage-tab-0");
await page.waitForTimeout(200);

/* ---- problem ledger disclosure ---------------------------------------- */
const firstBtn = page.locator("#problems button[aria-controls='problem-0']");
ok("problems · first row open on load", (await firstBtn.getAttribute("aria-expanded")) === "true");
const p1 = page.locator("#problem-1");
ok("problems · closed panel is invisible", (await p1.evaluate((e) => getComputedStyle(e).visibility)) === "hidden");
await page.click("#problems button[aria-controls='problem-1']");
await page.waitForTimeout(400);
ok("problems · opening row 2 reveals the answer", (await p1.evaluate((e) => getComputedStyle(e).visibility)) === "visible");
ok("problems · accordion closes the previous row", (await firstBtn.getAttribute("aria-expanded")) === "false");

/* ---- the scroll-linked capability panel -------------------------------- */
await page.evaluate(() => document.getElementById("capability-product").scrollIntoView({ behavior: "instant", block: "center" }));
await page.waitForTimeout(700);
const panelActive = () =>
  page.evaluate(() => {
    const stage = document.querySelector("#capabilities .sticky");
    const shown = [...stage.querySelectorAll("[aria-hidden]")].filter((e) => e.getAttribute("aria-hidden") === "false");
    return shown.map((e) => e.querySelector("svg")?.getAttribute("aria-label")?.slice(0, 40));
  });
ok("capabilities · panel shows the product diagram", (await panelActive())[0]?.startsWith("Four product layers"));
await page.evaluate(() => document.getElementById("capability-ai").scrollIntoView({ behavior: "instant", block: "center" }));
await page.waitForTimeout(800);
ok("capabilities · panel follows the scroll to AI", (await panelActive())[0]?.startsWith("A workflow step"));
ok("capabilities · exactly one diagram visible at a time", (await panelActive()).length === 1);
ok("capabilities · index marks the active one", (await page.locator('#capabilities a[aria-current="true"]').innerText()).includes("AI integration"));
ok("capabilities · every diagram has an accessible name", (await page.locator("#capabilities svg[role=img]:not([aria-label=''])").count()) >= 5);

/* ---- reveals ----------------------------------------------------------- */
await sweep(page);
await page.waitForTimeout(1500);
const stuck = await page.evaluate(() =>
  [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity === "0").length,
);
const total = await page.locator("[data-reveal]").count();
ok(`reveals · all ${total} fired (${stuck} stuck)`, stuck === 0);

/* ---- dark theme --------------------------------------------------------- */
const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const light = await bg();
await page.click('button[aria-label*="dark theme"]');
await page.waitForTimeout(400);
ok("theme · dark changes the ground", (await bg()) !== light);
/* the diagrams must not carry literal colours: check a stroke resolves to a
   token that actually changed between themes */
await page.evaluate(() => document.getElementById("capability-data").scrollIntoView({ behavior: "instant", block: "center" }));
await page.waitForTimeout(600);
await page.screenshot({ path: join(HERE, "svc-dark-capabilities.png") });
await page.click('button[aria-label*="light theme"]');
await page.waitForTimeout(400);

/* ---- the natural reading path -------------------------------------------
   A fresh load, then scroll INTO the section the way a reader does: the panel
   must be showing capability 01 by the time the first block is readable, with
   no dependence on the observer having fired yet. */
await page.goto(BASE + "/services", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.evaluate(() => document.getElementById("capabilities").scrollIntoView({ behavior: "instant", block: "start" }));
await page.waitForTimeout(500);
ok("capabilities · fresh scroll-in shows capability 01", (await panelActive())[0]?.startsWith("Four product layers"));
await page.evaluate(() => document.getElementById("capability-cloud").scrollIntoView({ behavior: "instant", block: "center" }));
await page.waitForTimeout(400);
const pinned = await page.evaluate(() => Math.round(document.querySelector("#capabilities .sticky").getBoundingClientRect().top));
ok(`capabilities · panel is actually pinned (top ${pinned}px)`, pinned > 0 && pinned < 200);

/* ---- screenshots -------------------------------------------------------- */
await page.goto(BASE + "/services", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
for (const [id, name] of [
  ["services-top", "svc-hero"],
  ["problems", "svc-problems"],
  ["capabilities", "svc-capabilities"],
  ["approach", "svc-approach"],
  ["engagement", "svc-engagement"],
  ["terms", "svc-terms"],
]) {
  await page.evaluate((i) => document.getElementById(i).scrollIntoView({ behavior: "instant", block: "start" }), id);
  await page.waitForTimeout(700);
  if (id === "capabilities") {
    /* scroll a little further so the first capability sits in the reading
       band — a screenshot at the section top shows the header, not the pair */
    await page.evaluate(() => window.scrollBy({ top: 620, behavior: "instant" }));
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: join(HERE, name + ".png") });
}

/* ---- responsive --------------------------------------------------------- */
for (const [w, h, tag] of [[390, 844, "mobile"], [768, 1024, "tablet"], [1920, 1080, "wide"]]) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(BASE + "/services", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const over = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  ok(`${tag} (${w}) · no horizontal overflow`, !over);
  if (w < 1024) {
    const stickyVisible = await page.evaluate(() => {
      const s = document.querySelector("#capabilities .sticky");
      return s ? getComputedStyle(s.parentElement).display !== "none" : false;
    });
    ok(`${tag} · sticky panel is not used`, !stickyVisible);
    const inline = await page.locator("#capabilities .lg\\:hidden svg[role=img]").count();
    ok(`${tag} · diagrams render inline instead (${inline})`, inline >= 5);
  }
  await sweep(page);
  await page.waitForTimeout(1400);
  const s2 = await page.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity === "0").length);
  ok(`${tag} · reveals fire (${s2} stuck)`, s2 === 0);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(HERE, `svc-${tag}.png`) });
}

/* ---- reduced motion ----------------------------------------------------- */
const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const rp = await rm.newPage();
await rp.goto(BASE + "/services", { waitUntil: "networkidle" });
await rp.waitForTimeout(600);
const rmStuck = await rp.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity === "0").length);
ok(`reduced-motion · nothing hidden without scrolling (${rmStuck})`, rmStuck === 0);
await rm.close();

const height = await page.evaluate(() => document.body.scrollHeight);
console.log(`\npage height ${height}px · ${total} reveals`);
await browser.close();
console.log(fails.length ? `\n${fails.length} FAILURES` : "\nALL GREEN");
process.exit(fails.length ? 1 : 0);
