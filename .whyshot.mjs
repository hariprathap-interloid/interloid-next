import { chromium } from "playwright";
const b = await chromium.launch({args:["--use-gl=swiftshader","--enable-unsafe-swiftshader"]});
const errs=[];
for (const [name,url,sel] of [["advantage","http://localhost:3000","#advantage"],["whypage","http://localhost:3000/why-choose-us",null]]) {
  const p = await b.newPage({viewport:{width:1440,height:900}});
  p.on("console",m=>m.type()==="error"&&errs.push(`${name}: ${m.text()}`));
  p.on("pageerror",e=>errs.push(`${name}: ${e.message}`));
  await p.goto(url,{waitUntil:"networkidle"});
  await p.waitForTimeout(2000);
  await p.evaluate(()=>document.querySelectorAll("[data-reveal],[data-rail]").forEach(e=>e.classList.add("is-in")));
  await p.waitForTimeout(500);
  if (sel) { await p.evaluate(s=>window.scrollTo(0,document.querySelector(s).offsetTop),sel); await p.waitForTimeout(500); }
  const m = await p.evaluate(()=>({
    tiles: document.querySelectorAll("#advantage article, main article").length,
    plate: (()=>{const e=document.querySelector("article > div:nth-child(2)");return e?Math.round(e.getBoundingClientRect().height):0})(),
    h1: document.querySelectorAll("h1").length,
    ph: document.querySelectorAll("[data-placeholder]").length,
  }));
  console.log(name, JSON.stringify(m));
  await p.screenshot({path:`shots/${name}.png`, fullPage: name==="whypage"});
  await p.close();
}
console.log(errs.length?"ERRORS: "+errs.join(" | "):"no console errors");
await b.close();
