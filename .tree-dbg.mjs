import { createRequire } from "module";
const req = createRequire("c:/Users/Hariprathap/Desktop/interloid/next-js/package.json");
const { chromium } = req("playwright");
const b = await chromium.launch();
for (const url of ["http://localhost:3231/preview-scratch-tree", "http://localhost:3231/preview"]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1100 } });
  p.on("response", r => { if (r.status() >= 400) console.log(url, "FAILED", r.status(), r.url()); });
  p.on("pageerror", e => console.log(url, "PAGEERROR", e.message.slice(0,400)));
  await p.goto(url, { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  console.log(url, "react:", await p.evaluate(() => {
    const el = document.querySelector(".eco-stage .eco-node");
    return el ? (Object.keys(el).filter(k=>k.startsWith("__react")).join(",") || "NONE") : "no node";
  }));
  await p.close();
}
await b.close();
