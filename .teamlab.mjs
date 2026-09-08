/* Harness for the /team lab — ROUND 2 (round 1 was rejected in full and its
   variants deleted; this file was rewritten with them). Still a decision
   artifact: DELETE with the lab when the winner is promoted.

   What round 2 checks, per variant:
     Tilt   — hovering off-centre rotates the INNER child while the outer li's
              box stays identical (the WorkCard rule, which tilt effects break
              by default); reduced motion never attaches the effect
     Flip   — hover flips the inner face; the hovered li itself never
              transforms; the back carries the LinkedIn slot
     Stage  — selecting a thumbnail changes the featured person
     Mosaic — tiles drift on a clock; reduced motion parks them
   Plus, for all: photo-first is REAL (every card shows a portrait image from
   /team/ph-*.svg), one variant mounted at a time, headings visible, heading
   picker works, zero console errors. */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3100";
const b = await chromium.launch();
const fail = [];
const ok = (c, m) => {
  console.log(`${c ? "PASS" : "FAIL"}  ${m}`);
  if (!c) fail.push(m);
};

const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
p.on("pageerror", (e) => errors.push(String(e)));

await p.goto(`${BASE}/team`, { waitUntil: "networkidle" });
await p.waitForTimeout(900);

/* Derived from the bench, not hardcoded — the variant list has changed three
   times in a day and a stale array silently skips the new ones. */
const tabs = await p.evaluate(() =>
  [...document.querySelectorAll('[aria-label="Design variant"] button')].map((b) =>
    b.textContent.trim(),
  ),
);
console.log(`variants on the bench: ${tabs.length}
`);
ok(tabs.length >= 8, `bench offers ${tabs.length} variants`);

/* --- 1. every variant mounts alone, photo-first, heading visible --------- */
for (const name of tabs) {
  await p.getByRole("button", { name, exact: true }).click();
  await p.waitForTimeout(800);
  const st = await p.evaluate(() => {
    const imgs = [...document.querySelectorAll("main img")].map((i) =>
      i.getAttribute("src"),
    );
    const h = document.querySelector("main h2");
    return {
      sections: document.querySelectorAll("main section").length,
      imgs: imgs.length,
      allPh: imgs.every((s) => /^\/team\/ph-\d\.svg$/.test(s)),
      hOpacity: h ? getComputedStyle(h).opacity : null,
    };
  });
  ok(st.sections === 1, `${name}: exactly one variant mounted (${st.sections})`);
  /* >=7 — Stage renders the featured portrait AND its own thumb. */
  ok(st.imgs >= 7, `${name}: photo-first for real (${st.imgs} portraits)`);
  /* PAINTED, not merely present. The flip variant once rendered every front
     face blank — a positioning collision collapsed the portrait box to zero
     height — while this img COUNT sailed through. Pixels or it did not
     happen: the first visible portrait must occupy real area. */
  const painted = await p.evaluate(() => {
    const img = [...document.querySelectorAll("main img")].find(
      (i) => i.getBoundingClientRect().height > 0,
    );
    if (!img) return null;
    const r = img.getBoundingClientRect();
    return Math.round(Math.min(r.width, r.height));
  });
  /* >40, not >100. The Roster variant is a LIST — its portraits are 48px
     thumbnails that grow to 80px when a row expands, and that is the design,
     not a defect. The check exists to catch a COLLAPSED box (the flip bug,
     which measured 0), so the threshold only has to be clearly above zero. */
  ok(
    painted !== null && painted > 40,
    `${name}: portraits actually paint (${painted}px min dimension)`,
  );
  ok(st.allPh, `${name}: every portrait is placeholder art, never stock`);
  ok(st.hOpacity === "1", `${name}: heading visible (opacity ${st.hOpacity})`);
}

/* --- 2. Tilt: inner leans, outer box does not move ----------------------- */
await p.getByRole("button", { name: "Tilt & shine", exact: true }).click();
await p.waitForTimeout(700);
{
  const li = p.locator("main ul > li").first();
  /* behavior:"instant" or the read races html's scroll-behavior:smooth —
     the same harness artifact .careers.mjs documents. Third time it has
     bitten a harness on this project. */
  await li.evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" }));
  await p.waitForTimeout(350);
  const rect = await li.evaluate((e) => {
    const r = e.getBoundingClientRect();
    return { x: r.x, y: r.y, box: `${r.x},${r.y},${r.width},${r.height}` };
  });
  /* Hover a corner, where the rotation is largest. */
  await p.mouse.move(rect.x + 25, rect.y + 25);
  await p.waitForTimeout(400);
  const after = await li.evaluate((e) => {
    const r = e.getBoundingClientRect();
    const inner = e.querySelector("[data-tilt]");
    return {
      box: `${r.x},${r.y},${r.width},${r.height}`,
      innerTransform: getComputedStyle(inner).transform,
      liTransform: getComputedStyle(e).transform,
    };
  });
  ok(rect.box === after.box, `tilt: outer li box unchanged (${after.box})`);
  ok(after.liTransform === "none", "tilt: the hovered element itself never transforms");
  ok(
    after.innerTransform !== "none" && after.innerTransform.includes("matrix3d"),
    `tilt: inner child leans (${after.innerTransform.slice(0, 28)}...)`,
  );
  await p.mouse.move(4, 4);
}

/* --- 3. Flip: inner rotates on hover, outer stays ------------------------ */
await p.getByRole("button", { name: "Flip", exact: true }).click();
await p.waitForTimeout(700);
{
  const li = p.locator("main .tlab-flipwrap").first();
  /* behavior:"instant" or the read races html's scroll-behavior:smooth —
     the same harness artifact .careers.mjs documents. Third time it has
     bitten a harness on this project. */
  await li.evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" }));
  await p.waitForTimeout(350);
  const rest = await li.evaluate((e) => {
    const r = e.getBoundingClientRect();
    return {
      box: `${r.width},${r.height}`,
      flip: getComputedStyle(e.querySelector("[data-flip]")).transform,
    };
  });
  await li.hover();
  await p.waitForTimeout(900);
  const hot = await li.evaluate((e) => {
    const r = e.getBoundingClientRect();
    return {
      box: `${r.width},${r.height}`,
      flip: getComputedStyle(e.querySelector("[data-flip]")).transform,
      liT: getComputedStyle(e).transform,
      backHasSlot: !!e.querySelector(".tlab-back a, .tlab-back p"),
    };
  });
  ok(rest.box === hot.box, `flip: outer box unchanged (${hot.box})`);
  ok(hot.liT === "none", "flip: the hovered element itself never transforms");
  ok(rest.flip !== hot.flip, "flip: inner face rotates on hover");
  ok(hot.backHasSlot, "flip: the back carries the LinkedIn slot");
  await p.mouse.move(4, 4);
}

/* --- 4. Stage: selecting a thumb swaps the featured person --------------- */
await p.getByRole("button", { name: "Focus stage", exact: true }).click();
await p.waitForTimeout(700);
{
  const featured = () =>
    p.evaluate(
      () => document.querySelector("main [aria-live] p")?.textContent?.trim() ?? "",
    );
  const before = await featured();
  /* nth(3): a different seat's thumb; its featured pane shows a different
     ROLE line even while every name is the same placeholder. Compare the
     role, which is the second <p>. */
  const roleOf = () =>
    p.evaluate(
      () =>
        [...document.querySelectorAll("main [aria-live] p")][1]?.textContent?.trim() ??
        "",
    );
  const roleBefore = await roleOf();
  await p.locator("main button[aria-pressed]").nth(3).click();
  await p.waitForTimeout(600);
  const roleAfter = await roleOf();
  ok(
    roleBefore !== roleAfter,
    `stage: featuring a thumb swaps the stage ("${roleBefore}" -> "${roleAfter}")`,
  );
  void before;
}

/* --- 5. Mosaic drifts; reduced motion parks everything ------------------- */
await p.getByRole("button", { name: "Mosaic", exact: true }).click();
await p.waitForTimeout(600);
{
  const anim = await p.evaluate(
    () => getComputedStyle(document.querySelector("main ul > li")).animationName,
  );
  ok(anim !== "none", `mosaic: tiles drift on a clock (${anim})`);
}

const pr = await b.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await pr.goto(`${BASE}/team`, { waitUntil: "networkidle" });
await pr.waitForTimeout(700);
{
  /* Select Tilt explicitly. This block used to rely on it being the DEFAULT
     mount; when Focus stage became the default (the user's front-runner leads
     the tab order) the [data-tilt] query found nothing and the harness threw
     rather than failing a check. Never assume which variant is first. */
  await pr.getByRole("button", { name: "Tilt & shine", exact: true }).click();
  await pr.waitForTimeout(700);
  const li = pr.locator("main ul > li").first();
  const r = await li.evaluate((e) => {
    const bb = e.getBoundingClientRect();
    return { x: bb.x, y: bb.y };
  });
  await pr.mouse.move(r.x + 25, r.y + 25);
  await pr.waitForTimeout(400);
  const t = await li.evaluate(
    (e) => getComputedStyle(e.querySelector("[data-tilt]")).transform,
  );
  /* The inline transform is ALWAYS present — with the vars unset it computes
     to the identity matrix, not to "none". What reduced motion guarantees is
     that it never LEANS: no listener attaches, so no matrix3d ever appears. */
  ok(
    t === "none" || t === "matrix(1, 0, 0, 1, 0, 0)",
    `reduced motion: tilt never leans (${t})`,
  );
  await pr.getByRole("button", { name: "Mosaic", exact: true }).click();
  await pr.waitForTimeout(600);
  const anim = await pr.evaluate(
    () => getComputedStyle(document.querySelector("main ul > li")).animationName,
  );
  ok(anim === "none", `reduced motion: mosaic drift parked (${anim})`);
}
await pr.close();

/* --- 6. heading picker and console --------------------------------------- */
await p.getByRole("button", { name: "b", exact: true }).click();
await p.waitForTimeout(400);
const h = await p.evaluate(() => document.querySelector("main h2")?.textContent?.trim());
ok(/credits/i.test(h ?? ""), `heading picker still works (${h})`);
ok(
  errors.length === 0,
  `zero console errors (${errors.length}${errors.length ? ": " + errors[0] : ""})`,
);

await b.close();
console.log(fail.length ? `\n${fail.length} FAILED` : "\nall checks passed");
process.exit(fail.length ? 1 : 0);
