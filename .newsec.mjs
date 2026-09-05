import { chromium } from "playwright";
const b = await chromium.launch({args:["--use-gl=swiftshader","--enable-unsafe-swiftshader"]});
const p = await b.newPage({viewport:{width:1440,height:900}});
const errs=[]; p.on("console",m=>m.type()==="error"&&errs.push(m.text())); p.on("pageerror",e=>errs.push(e.message));
await p.goto("http://localhost:3000",{waitUntil:"networkidle"});
await p.waitForTimeout(2500);

const s = await p.evaluate(()=>({
  sections: [...document.querySelectorAll("main > section")].map(s=>s.id),
  h2s: [...document.querySelectorAll("h2")].map(h=>h.textContent.trim().replace(/\s+/g," ")),
  placeholders: document.querySelectorAll("[data-placeholder]").length,
  pageH: document.body.scrollHeight,
  entityLeak: document.body.innerText.includes("&rsquo;") || document.body.innerText.includes("&mdash;"),
}));
console.log("sections:", s.sections.join(" > "));
console.log("placeholders:", s.placeholders, "| page height:", s.pageH, "| raw-entity leak:", s.entityLeak);
console.log("h2s:"); s.h2s.forEach(h=>console.log("   ", h));

// FAQ accordion behaviour
await p.evaluate(()=>document.querySelector("#faq").scrollIntoView({block:"start"}));
await p.waitForTimeout(600);
const q0 = "#faq button[aria-controls='faq-a-0']";
const before = await p.evaluate(()=>document.querySelector("#faq-a-0").getBoundingClientRect().height);
await p.click(q0); await p.waitForTimeout(600);
const after = await p.evaluate(()=>({
  h: document.querySelector("#faq-a-0").getBoundingClientRect().height,
  expanded: document.querySelector("button[aria-controls='faq-a-0']").getAttribute("aria-expanded"),
  vis: getComputedStyle(document.querySelector("#faq-a-0")).visibility,
}));
console.log(`faq: closed h=${Math.round(before)} -> open h=${Math.round(after.h)} aria-expanded=${after.expanded} visibility=${after.vis}`);
await p.screenshot({path:"shots/faq.png"});
await p.evaluate(()=>document.querySelector("#feedback").scrollIntoView({block:"start"}));
await p.waitForTimeout(700);
await p.screenshot({path:"shots/feedback.png"});
await p.evaluate(()=>document.querySelector("#contact").scrollIntoView({block:"start"}));
await p.waitForTimeout(700);
await p.screenshot({path:"shots/cta.png"});
console.log(errs.length?"CONSOLE ERRORS: "+errs.join(" | "):"no console errors");
await b.close();
