import { chromium } from "playwright";
const b = await chromium.launch({args:["--use-gl=swiftshader","--enable-unsafe-swiftshader"]});
for (const t of ["light","dark"]) {
  const p = await b.newPage({viewport:{width:1440,height:900}});
  await p.addInitScript((x)=>{try{localStorage.setItem("interloid-theme",x)}catch{}}, t);
  await p.goto("http://localhost:3000",{waitUntil:"networkidle"});
  await p.waitForTimeout(2000);
  /* fullPage captures by scrolling itself, which races the reveal observer and
     leaves lower sections at opacity 0. Reveals are verified separately in
     .rev.mjs (28/28 after a real scroll, matching the prototype exactly), so
     force them on here purely to make the screenshot representative. */
  await p.evaluate(() => {
    document.querySelectorAll("[data-reveal],[data-rail]").forEach((el) => el.classList.add("is-in"));
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(1200);
  await p.screenshot({path:`shots/full-${t}.png`, fullPage:true});
  console.log(t, "height", await p.evaluate(()=>document.body.scrollHeight));
  await p.close();
}
await b.close();
