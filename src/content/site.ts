/* ==========================================================================
   Content — lifted from prototype3/script.js, where these arrays were written
   specifically to become `.map()` calls (TAILWIND-MAP §4). Editing copy means
   editing this file; no component changes.

   Claims allowed as fact, per HANDOFF §7 plus the 2026-09-06 confirmation:
   free 30-min consult · 48-hr written proposal · weekly working demo ·
   30 days post-launch support · 30-day notice · 100% code/IP ownership ·
   $25k–$90k build range · 8–12 week first version (14–20 larger) ·
   engineers with 8–12 years each · no juniors substituted after signing.
   Anything NOT on that list stays data-placeholder — see CASES and QUOTES.
   ========================================================================== */

export type Hue = "brand" | "accent" | "light" | "indigo" | "teal";

/* DS §2.3: one hue per category, reused wherever that category appears.

   `glow` exists ONLY because of the build. The prototype composed the blur
   colour at runtime as `${h.tile}/10`, which the Tailwind *browser CDN*
   happily generated on the fly. A compiled build scans source for complete
   class strings, so `bg-brand` + "/10" is invisible to it and the class would
   be silently dropped — the panel's glow would just vanish. Every class here
   must stay a whole, literal string. Never rebuild one by concatenation. */
export const HUE: Record<
  Hue,
  { tile: string; soft: string; ring: string; text: string; glow: string }
> = {
  brand: {
    tile: "bg-brand",
    soft: "bg-brand/10",
    ring: "ring-brand/15",
    text: "text-brand",
    glow: "bg-brand/10",
  },
  accent: {
    tile: "bg-accent",
    soft: "bg-accent/10",
    ring: "ring-accent/15",
    text: "text-accent-strong",
    glow: "bg-accent/10",
  },
  light: {
    tile: "bg-brand-light",
    soft: "bg-brand-light/10",
    ring: "ring-brand-light/15",
    text: "text-brand-light",
    glow: "bg-brand-light/10",
  },
  indigo: {
    tile: "bg-indigo-600",
    soft: "bg-indigo-600/10",
    ring: "ring-indigo-600/15",
    text: "text-indigo-600",
    glow: "bg-indigo-600/10",
  },
  teal: {
    tile: "bg-teal-600",
    soft: "bg-teal-600/10",
    ring: "ring-teal-600/15",
    text: "text-teal-600",
    glow: "bg-teal-600/10",
  },
};

export const SERVICES = [
  {
    k: "code",
    name: "Product engineering",
    hue: "brand",
    body: "Web and mobile products built to be handed over — typed, tested, documented, and deployed on infrastructure you control.",
    tags: ["React / Next.js", "TypeScript", "Node / Python", "Postgres"],
  },
  {
    k: "chart",
    name: "Data & analytics",
    hue: "teal",
    body: "Pipelines, warehouses and dashboards that answer the question you actually asked, with the lineage to prove the number.",
    tags: ["Pipelines", "Warehousing", "Dashboards", "Data quality"],
  },
  {
    k: "cloud",
    name: "Cloud & DevOps",
    hue: "light",
    body: "Provisioned as code in your own cloud accounts. CI that runs on every push and a deploy any engineer on your team can trigger.",
    tags: ["AWS", "Terraform", "CI/CD", "Observability"],
  },
  {
    k: "sparkle",
    name: "AI integration",
    hue: "indigo",
    body: "LLM features wired into real workflows — with evaluation, guardrails and a cost model, not a demo that impresses once.",
    tags: ["Retrieval", "Evaluation", "Guardrails", "Cost control"],
  },
  {
    k: "users",
    name: "Team augmentation",
    hue: "accent",
    body: "Senior engineers embedded in your team and your standups. Same people throughout, 30-day notice either way.",
    tags: ["Embedded", "Senior only", "Your process", "30-day notice"],
  },
] as const satisfies readonly {
  k: string;
  name: string;
  hue: Hue;
  body: string;
  tags: readonly string[];
}[];

export const STACK = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "PostgreSQL",
  "AWS",
  "Terraform",
  "Docker",
  "Kubernetes",
  "React Native",
  "GraphQL",
];

/* ==========================================================================
   COMMITMENTS — the "Why Interloid" tiles.

   Rebuilt 2026-09-07 from prototype 1's `why` array (script.js), which is the
   design reference for this section. The three-tile home split of 2026-09-06
   is reverted: the home section now carries the full set of SEVEN, and
   /why-choose-us renders the same list rather than a longer one.

   THE COUNT IS LOAD-BEARING. Three columns, and every row must fill.
   7 tiles = 5 singles + 2 double-width = 9 slots = three full rows:

       [ wide (0) .......... ][ 1 ]
       [ 2 ][ 3 ][ 4 ]
       [ 5 ][ wide (6) .......... ]

   The wide tiles are the FIRST and LAST entries, and Advantage derives that
   from the array length — do not hard-code indices there. Changing the count
   changes the arithmetic: at 5 tiles it is one wide (2+1+1+1+1 = 6 = two
   rows), at 7 it is two. Any other count leaves a visible hole.

   Every claim is on HANDOFF §7's allowed list. */
export const BENTO = [
  {
    k: "key-round",
    hue: "brand",
    span: "",
    title: "You own 100% of the code",
    body: "Every repo, every credential, every architecture decision transfers to you. No proprietary framework, no licence, no hostage situation. It’s in the contract, not just on this page.",
  },
  {
    k: "receipt",
    hue: "indigo",
    span: "",
    title: "Fixed price or transparent hourly",
    body: "You know the number before we start. Scope changes are quoted, never surprise-invoiced.",
  },
  {
    k: "user-check",
    hue: "light",
    span: "",
    title: "Senior engineers only",
    body: "The people on your call are the people writing the code. No bait-and-switch to juniors after signing.",
  },
  {
    k: "split",
    hue: "teal",
    span: "",
    title: "We tell you when to walk away",
    body: "If your project doesn’t need us, or needs someone else, we say so on the first call.",
  },
  {
    k: "phone",
    hue: "accent",
    span: "",
    title: "Small team, direct line",
    body: "You talk to the engineer building your feature — not an account manager relaying messages to a pod.",
  },
  {
    k: "monitor-play",
    hue: "accent",
    span: "",
    title: "A working demo every week",
    body: "Not a status report. Software you can click, every week, from week one.",
  },
  {
    k: "buoy",
    hue: "teal",
    span: "",
    title: "30 days of post-launch support",
    body: "Included. We stay on after go-live, because that is when real usage finds things.",
  },
] as const satisfies readonly {
  k: string;
  hue: Hue;
  span: string;
  title: string;
  body: string;
}[];

/* Kept as an empty-by-design alias: the two commitments that were split out on
   2026-09-06 are back in BENTO above, and /why-choose-us imports this so the
   split can be re-made later without touching that page again. */
export const COMMITMENTS_EXTRA = [] as const satisfies readonly {
  k: string;
  hue: Hue;
  span: string;
  title: string;
  body: string;
}[];

/* ==========================================================================
   HOW WE WORK — the four steps.

   Replaced 2026-09-07 with prototype 1's `process` array verbatim (its
   script.js), which is the approved reference for this section. What changed
   and why it matters:

   TITLES ARE NOW PHRASES, NOT LABELS. "Consult / Proposal / Build / Handover"
   were nouns naming a stage; "Discovery call / Written proposal / Build in the
   open / Launch & handover" say what actually happens. "Build in the open" in
   particular is a claim, where "Build" was a category.

   THE `when` CHIP CARRIES THE COMMITMENT. "Day 0 / Within 48h / Weekly /
   +30 days" described a schedule. "30 minutes / 48 hours / Weekly demos /
   30-day support" names the thing being promised, and each one is already on
   HANDOFF §7's allowed list — they restate commitments the Why Interloid
   section makes, rather than introducing new claims. The chip upper-cases in
   CSS; store it sentence case. ========================================== */
export const STEPS = [
  {
    k: "search",
    n: "01",
    title: "Discovery call",
    when: "30 minutes",
    body: "A free, no-pressure call. We assess feasibility, rough timeline and budget — and tell you if you don’t need us.",
  },
  {
    k: "doc",
    n: "02",
    title: "Written proposal",
    when: "48 hours",
    body: "Scope, milestones and a fixed price or transparent hourly rate. In writing, so you can compare it against anyone else.",
  },
  {
    k: "code",
    n: "03",
    title: "Build in the open",
    when: "Weekly demos",
    body: "Short sprints with a working demo every week. You have access to the repo and the board from day one.",
  },
  {
    k: "rocket",
    n: "04",
    title: "Launch & handover",
    when: "30-day support",
    body: "We ship it, document it and hand over the keys. 30 days of support included, then a retainer only if you want one.",
  },
];

/* HANDOFF §7 makes three real, anonymised case studies a P0 launch blocker.
   Every card carries data-placeholder. Do not un-flag these. */
export const CASES = [
  {
    sector: "Logistics",
    hue: "brand",
    title: "Case study one",
    body: "What the problem was, what shipped, and the one number that moved.",
  },
  {
    sector: "Fintech",
    hue: "teal",
    title: "Case study two",
    body: "What the problem was, what shipped, and the one number that moved.",
  },
  {
    sector: "Health",
    hue: "indigo",
    title: "Case study three",
    body: "What the problem was, what shipped, and the one number that moved.",
  },
] as const satisfies readonly {
  sector: string;
  hue: Hue;
  title: string;
  body: string;
}[];

/* ==========================================================================
   FAQ — lifted from prototype/script.js.

   CONFIRMED AS FACT by the user 2026-09-06. These four were previously
   unverifiable and would have needed data-placeholder:
     · $25k–$90k per full build, monthly per engineer for augmentation
     · 8–12 weeks to a focused first version, 14–20 for larger platforms
     · senior engineers with 8–12 years of experience each
     · no juniors swapped in after signing

   That confirmation also closes HANDOFF §7's open P1 on pricing — the site now
   publishes a range rather than claiming transparency without one. Do not
   soften these back to qualitative language without asking; they are load-
   bearing answers to the questions that actually block a booking. */
export const FAQ = [
  {
    q: "What does a typical project cost?",
    a: "Most full builds land between $25k and $90k depending on scope. Staff augmentation runs monthly per engineer. We give you a fixed number in writing within 48 hours of the first call — and we’ll tell you upfront if your budget and scope don’t match.",
  },
  {
    q: "How long until we launch?",
    a: "A focused first version is typically 8–12 weeks. Larger platforms run 14–20. We work in short sprints with a working demo every week, so you see progress rather than waiting for a reveal.",
  },
  {
    q: "Who actually writes the code?",
    a: "Senior engineers with 8–12 years of experience each. The people on your discovery call are the people on your project. We don’t swap in juniors after the contract is signed.",
  },
  {
    q: "What happens if we want to leave?",
    a: "You take everything. All code, infrastructure, documentation and credentials are yours throughout — not handed over at the end. There is no notice period on ownership and nothing is licensed back to you.",
  },
  {
    q: "You’re in India — how does that work across timezones?",
    a: "We keep deliberate overlap with US and UK business hours for standups, demos and anything urgent. Async by default, with a guaranteed live window every working day.",
  },
  {
    q: "Can you work with our existing team and codebase?",
    a: "Yes — that’s most of our staff-augmentation work. We join your repo, your board and your review process rather than running a parallel track.",
  },
];

/* ==========================================================================
   TESTIMONIALS — §8.3.

   STILL PLACEHOLDER, and deliberately so. Every card and the pull-quote carry
   data-placeholder. A testimonials block with visible "Placeholder Name" is
   worse than no testimonials at all: an empty space reads as an early company,
   a fake quote reads as a company that fabricates proof. The quotes themselves
   are plausible drafts of what a real client might say — they are here to hold
   the design, not to ship. Replace with real, permissioned quotes before
   launch (HANDOFF §7 P0, same bucket as the case studies). */
export const QUOTES = [
  {
    q: "They pushed back on half our original scope and were right about all of it. We shipped smaller and sooner than we planned.",
    n: "Placeholder Name",
    r: "VP Product, Placeholder Co",
    i: "PN",
  },
  {
    q: "The handover was the most complete I have received from any vendor. Our team picked it up without a single follow-up call.",
    n: "Placeholder Name",
    r: "CTO, Placeholder Co",
    i: "PN",
  },
  {
    q: "Weekly demos meant no surprises. We knew exactly where we were the entire build.",
    n: "Placeholder Name",
    r: "Founder, Placeholder Co",
    i: "PN",
  },
];

export const PULL_QUOTE = {
  q: "The weekly demo changed how our own team works. We stopped writing status reports and started showing the thing.",
  who: "Placeholder Name · Head of Product, Placeholder Co",
};
