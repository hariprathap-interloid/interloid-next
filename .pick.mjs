/* Select a design on /service-variants. The page shows ONE diagram at a time
   now, so every harness that used to address `#preview-{v}` directly has to
   ask for it first. Variant names are unchanged - "tree", or
   "constellation-circle" - and split back into the two controls here. */
export async function pick(page, variant) {
  const circle = variant.endsWith("-circle");
  const layout = circle ? variant.slice(0, -"-circle".length) : variant;
  await page.click(`[data-choice="${layout}"]`);
  await page.click(`[data-choice="${circle ? "circle" : "pill"}"]`);
  /* the swapped-in Map mounts, measures (columns reads its own layout) and
     settles its transitions */
  await page.waitForSelector(`#preview-${variant} .eco-stage`);
  await page.waitForTimeout(700);
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
