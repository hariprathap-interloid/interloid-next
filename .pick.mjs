/* Select a design on /service-variants. The page shows ONE diagram at a time
   now, so every harness that used to address `#preview-{v}` directly has to
   ask for it first. Variant names are unchanged - "tree", or
   "constellation-circle" - and split back into the two controls here. */
export async function pick(page, variant, { fresh = false } = {}) {
  const circle = variant.endsWith("-circle");
  const layout = circle ? variant.slice(0, -"-circle".length) : variant;
  if (fresh) {
    /* CHANGING THE SHAPE ALONE DOES NOT REMOUNT THE MAP - same component,
       only the wrapper class differs - so a service left open by an earlier
       check is still open, and a check that wants to read the RESTING state
       reads an open branch instead. (The persistence is right: comparing
       pill against circle on the same open service is the point of having
       the two controls separate.) Routing through another layout forces the
       remount, and the selection resets with it. */
    await page.click(`[data-choice="${layout === "tree" ? "columns" : "tree"}"]`);
    await page.waitForTimeout(300);
  }
  await page.click(`[data-choice="${layout}"]`);
  await page.click(`[data-choice="${circle ? "circle" : "pill"}"]`);
  /* The swapped-in Map mounts, measures (columns reads its own layout) and
     settles. 1800 because the beads now animate IN at 1.15s + 0.4s — they
     wait for the diagram to finish arriving — so anything that reads them
     has to be past that. See `.eco-train` in globals.css. */
  await page.waitForSelector(`#preview-${variant} .eco-stage`);
  /* PUT THE STAGE BELOW THE BAR, not merely on screen. The control is sticky
     OVER the diagram it drives, so a node under it cannot be hovered —
     Playwright reports "radiogroup intercepts pointer events" and a reader
     hits the same wall. `block: "center"` is not enough on its own: it aligns
     to the viewport, which knows nothing about the bar. Measure the bar and
     clear it. */
  await page.evaluate((v) => {
    const st = document.querySelector(`#preview-${v} .eco-stage`);
    if (!st) return;
    const bar = document.querySelector(".sticky");
    const clear = bar ? bar.getBoundingClientRect().bottom : 0;
    window.scrollBy({
      top: st.getBoundingClientRect().top - clear - 24,
      behavior: "instant",
    });
  }, variant);
  await page.waitForTimeout(1800);
}

/** Scroll the whole page once so Reveal.tsx fires. The [data-reveal] wrapper
    survives every later switch, so this only ever needs doing at load. */
export async function reveal(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(900);
}
