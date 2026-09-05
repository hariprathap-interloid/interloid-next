/* FCP / LCP against HANDOFF §8's budget: the live interloid.com measures
   FCP 364ms with 37 requests, and the review says do not regress it.
   Run against `npm start` (production), never `next dev`. */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const browser = await chromium.launch({
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});

const runs = [];
for (let i = 0; i < 5; i++) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const reqs = [];
  page.on("request", (r) => reqs.push(r.url()));

  await page.goto(BASE, { waitUntil: "load" });
  const paints = await page.evaluate(
    () =>
      new Promise((res) => {
        const out = {};
        performance.getEntriesByType("paint").forEach((e) => {
          out[e.name] = Math.round(e.startTime);
        });
        new PerformanceObserver((l) => {
          const es = l.getEntries();
          out.lcp = Math.round(es[es.length - 1].startTime);
        }).observe({ type: "largest-contentful-paint", buffered: true });
        setTimeout(() => res(out), 600);
      }),
  );
  // how many requests before the stage boots vs after
  const beforeStage = reqs.filter((u) => !/logo-points|three/.test(u)).length;
  await page.waitForTimeout(3000);
  const total = reqs.length;
  runs.push({ ...paints, beforeStage, total });
  await ctx.close();
}
await browser.close();

const med = (k) => {
  const v = runs.map((r) => r[k]).filter((n) => typeof n === "number").sort((a, b) => a - b);
  return v[Math.floor(v.length / 2)];
};
console.log("runs:", JSON.stringify(runs));
console.log("");
console.log(`FCP  median ${med("first-contentful-paint")}ms   (budget 364ms)`);
console.log(`LCP  median ${med("lcp")}ms`);
console.log(`requests before stage boot: ${med("beforeStage")}   total after: ${med("total")}   (live site: 37)`);
