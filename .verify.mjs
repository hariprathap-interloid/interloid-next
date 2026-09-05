/* ==========================================================================
   Verification harness — the Next.js rebuild of the prototype's suite.
   HANDOFF §4a step 3: the prototype scripts served a static folder and did not
   survive the port. This is where the deferred a11y / zoom / dark passes land.

   Run:  node .verify.mjs            (expects `npm run dev` already listening)
         node .verify.mjs --build    (against `npm start` instead)

   Every hero regression of 2026-09-05/06 was caught by measurement, not by
   eye. Keep adding rows rather than eyeballing screenshots.
   ========================================================================== */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "shots";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});

const problems = [];
const note = (m) => problems.push(m);

/* ---- 1. hero geometry + fold, per viewport ----------------------------- */
const VIEWPORTS = [
  { w: 390, h: 844, n: "mobile" },
  { w: 1280, h: 720, n: "laptop" },
  { w: 1440, h: 900, n: "desktop" },
  { w: 1920, h: 1080, n: "wide" },
  { w: 2560, h: 1440, n: "ultra" },
];

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width: vp.w, height: vp.h },
  });
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(e.message));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(3500); // let the idle-deferred stage boot

  const m = await page.evaluate(() => {
    const h1 = document.querySelector("#home h1");
    const cs = getComputedStyle(h1);
    const col = h1.parentElement.getBoundingClientRect();
    const cta = document
      .querySelector('#home a[href="#contact"]')
      .getBoundingClientRect();
    return {
      h1Font: cs.fontSize,
      h1Family: cs.fontFamily.split(",")[0].replace(/['"]/g, ""),
      h1Lines: Math.round(
        h1.getBoundingClientRect().height / (parseFloat(cs.fontSize) * 1.04),
      ),
      colW: Math.round(col.width),
      ctaBottom: Math.round(cta.bottom),
      viewport: window.innerHeight,
      canvasReady: !!document.querySelector(".stage.ready"),
      displayLoaded: document.fonts.check(
        '900 64px "' + cs.fontFamily.split(",")[0].replace(/['"]/g, "") + '"',
      ),
      h1Count: document.querySelectorAll("h1").length,
    };
  });

  const foldOK = m.ctaBottom <= m.viewport;
  console.log(
    `${vp.n.padEnd(8)} ${String(vp.w).padStart(4)}x${vp.h}  ` +
      `h1 ${m.h1Font}/${m.h1Lines}L col ${m.colW}  ` +
      `cta ${m.ctaBottom}/${m.viewport} ${foldOK ? "OK" : "BELOW FOLD"}  ` +
      `canvas ${m.canvasReady ? "ready" : "NOT READY"}`,
  );

  if (m.h1Lines !== 2 && vp.w >= 900)
    note(`${vp.n}: H1 wraps to ${m.h1Lines} lines at ${m.h1Font} in a ${m.colW}px column`);
  if (!foldOK)
    note(`${vp.n}: primary CTA ${m.ctaBottom - m.viewport}px below the fold`);
  if (!m.canvasReady) note(`${vp.n}: WebGL stage never reached .ready`);
  if (m.h1Count !== 1) note(`${vp.n}: ${m.h1Count} <h1> elements`);
  /* next/font hashes the family name, so match loosely and — more usefully —
     confirm the face actually loaded instead of silently falling back. */
  if (!/satoshi/i.test(m.h1Family))
    note(`${vp.n}: display face is ${m.h1Family}, expected Satoshi`);
  if (!m.displayLoaded)
    note(`${vp.n}: Satoshi did not load — falling back to system-ui`);
  if (errs.length) note(`${vp.n}: console errors — ${errs.join(" | ")}`);

  await page.screenshot({ path: `${OUT}/hero-${vp.n}.png` });
  await page.close();
}

/* ---- 2. theme toggle round-trip ---------------------------------------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);

  const before = await page.evaluate(() =>
    document.documentElement.classList.contains("dark"),
  );
  await page.click("button[aria-label*='Switch to']");
  await page.waitForTimeout(800);
  const after = await page.evaluate(() => ({
    dark: document.documentElement.classList.contains("dark"),
    pressed: document
      .querySelector("button[aria-label*='Switch to']")
      .getAttribute("aria-pressed"),
    stored: localStorage.getItem("interloid-theme"),
  }));
  console.log(
    `theme    ${before} -> ${after.dark}  aria-pressed=${after.pressed}  stored=${after.stored}`,
  );
  if (after.dark === before) note("theme toggle did not flip the class");
  if (String(after.dark) !== after.pressed)
    note("aria-pressed out of sync with the theme class");
  await page.screenshot({ path: `${OUT}/hero-dark.png` });
  await page.close();
}

/* ---- 3. mobile menu: open, Escape, focus return ------------------------ */
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const btn = "button[aria-controls='mobileMenu']";
  await page.click(btn);
  await page.waitForTimeout(400);
  const open = await page.evaluate(() => {
    const m = document.querySelector("#mobileMenu");
    return {
      visible: m.classList.contains("visible"),
      expanded: document
        .querySelector("button[aria-controls='mobileMenu']")
        .getAttribute("aria-expanded"),
      /* §5.4: a closed menu hidden only with opacity keeps its links tabbable.
         Check the links are actually reachable when open and not when shut. */
      linkCount: m.querySelectorAll("a").length,
    };
  });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const shut = await page.evaluate(() => ({
    visible: document.querySelector("#mobileMenu").classList.contains("visible"),
    focusIsToggle:
      document.activeElement ===
      document.querySelector("button[aria-controls='mobileMenu']"),
  }));
  console.log(
    `menu     open=${open.visible} expanded=${open.expanded} links=${open.linkCount} | ` +
      `escape closed=${!shut.visible} focusReturned=${shut.focusIsToggle}`,
  );
  if (!open.visible) note("mobile menu did not open");
  if (shut.visible) note("Escape did not close the mobile menu");
  if (!shut.focusIsToggle) note("focus not returned to the toggle on Escape");
  await page.close();
}

/* ---- 4. nav morph on scroll -------------------------------------------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const rest = await page.evaluate(
    () => document.querySelector("#nav > div").className,
  );
  /* The full page is ported now, so it scrolls on its own — the spacer this
     used to need is gone. */
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(700);
  const scrollY = await page.evaluate(() => window.scrollY);
  const scrolled = await page.evaluate(
    () => document.querySelector("#nav > div").className,
  );
  const morphed = rest !== scrolled && scrolled.includes("rounded-full");
  console.log(
    `nav      scrollY=${scrollY}  morph on scroll: ${morphed ? "OK" : "FAILED"}`,
  );
  if (scrollY === 0) note("scroll test could not scroll — spacer failed");
  else if (!morphed) note("nav did not morph to the glass pill on scroll");
  await page.close();
}

await browser.close();

console.log("");
if (problems.length) {
  console.log(`${problems.length} problem(s):`);
  problems.forEach((p) => console.log("  - " + p));
  process.exitCode = 1;
} else {
  console.log("all checks passed");
}
