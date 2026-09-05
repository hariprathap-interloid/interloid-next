import { chromium } from "playwright";
const b = await chromium.launch({args:["--use-gl=swiftshader","--enable-unsafe-swiftshader"]});
for (const t of ["light","dark"]) {
  const p = await b.newPage({viewport:{width:1440,height:900}});
  await p.addInitScript((x)=>{try{localStorage.setItem("interloid-theme",x)}catch{}},t);
  await p.goto("http://localhost:3000",{waitUntil:"networkidle"});
  await p.waitForTimeout(2000);
  await p.evaluate(()=>document.querySelectorAll("[data-reveal],[data-rail]").forEach(e=>e.classList.add("is-in")));
  // open the first FAQ so the panel is visible in the shot
  await p.evaluate(()=>document.querySelector("button[aria-controls='faq-a-0']")?.click());
  await p.waitForTimeout(500);
  const h2 = await p.evaluate(()=>{const h=document.querySelector("#faq h2");return Math.round(h.getBoundingClientRect().height/ (parseFloat(getComputedStyle(h).fontSize)*1.25));});
  console.log(t, "faq h2 lines:", h2);
  // scroll AFTER the click: opening a panel changes layout above the fold
  await p.waitForTimeout(400);
  await p.evaluate(()=>window.scrollTo(0, document.querySelector("#faq").offsetTop));
  await p.waitForTimeout(600);
  await p.screenshot({path:`shots/faq-${t}.png`});
  await p.close();
}
await b.close();
