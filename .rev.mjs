import { chromium } from "playwright";
const b = await chromium.launch({args:["--use-gl=swiftshader","--enable-unsafe-swiftshader"]});
for (const [label,url] of [["next","http://localhost:3000"],["proto","http://localhost:4500/index.html"]]) {
  const p = await b.newPage({viewport:{width:1440,height:900}});
  await p.goto(url,{waitUntil:"networkidle"});
  await p.waitForTimeout(1500);
  const before = await p.evaluate(()=>({total:document.querySelectorAll("[data-reveal],[data-rail]").length, on:document.querySelectorAll("[data-reveal].is-in,[data-rail].is-in").length}));
  await p.evaluate(async () => {
    for (let y=0; y<document.body.scrollHeight; y+=400){ window.scrollTo(0,y); await new Promise(r=>setTimeout(r,150)); }
  });
  await p.waitForTimeout(1200);
  const after = await p.evaluate(()=>({total:document.querySelectorAll("[data-reveal],[data-rail]").length, on:document.querySelectorAll("[data-reveal].is-in,[data-rail].is-in").length}));
  console.log(`${label}: before ${before.on}/${before.total}  after scroll ${after.on}/${after.total}`);
  await p.close();
}
await b.close();
