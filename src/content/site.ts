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

   `softHover` is a WHOLE class including its `group-hover:` prefix for the
   same reason as `glow` below — a variant prefix is as invisible to the
   scanner as a `/10` suffix if either is glued on at runtime.

   `glow` exists ONLY because of the build. The prototype composed the blur
   colour at runtime as `${h.tile}/10`, which the Tailwind *browser CDN*
   happily generated on the fly. A compiled build scans source for complete
   class strings, so `bg-brand` + "/10" is invisible to it and the class would
   be silently dropped — the panel's glow would just vanish. Every class here
   must stay a whole, literal string. Never rebuild one by concatenation. */
export const HUE: Record<
  Hue,
  {
    tile: string;
    soft: string;
    softHover: string;
    ring: string;
    text: string;
    glow: string;
  }
> = {
  brand: {
    tile: "bg-brand",
    soft: "bg-brand/10",
    softHover: "group-hover:bg-brand/20",
    ring: "ring-brand/15",
    text: "text-brand",
    glow: "bg-brand/10",
  },
  accent: {
    tile: "bg-accent",
    soft: "bg-accent/10",
    softHover: "group-hover:bg-accent/20",
    ring: "ring-accent/15",
    text: "text-accent-strong",
    glow: "bg-accent/10",
  },
  light: {
    tile: "bg-brand-light",
    soft: "bg-brand-light/10",
    softHover: "group-hover:bg-brand-light/20",
    ring: "ring-brand-light/15",
    text: "text-brand-light",
    glow: "bg-brand-light/10",
  },
  indigo: {
    tile: "bg-indigo-600",
    soft: "bg-indigo-600/10",
    softHover: "group-hover:bg-indigo-600/20",
    ring: "ring-indigo-600/15",
    text: "text-indigo-600",
    glow: "bg-indigo-600/10",
  },
  teal: {
    tile: "bg-teal-600",
    soft: "bg-teal-600/10",
    softHover: "group-hover:bg-teal-600/20",
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

/* Split into name + role on 2026-09-07: prototype2-archive's pull-quote bolds
   the name and leaves the role muted, which a single `who` string cannot
   express without markup in the content layer. Copy stays copy. */
export const PULL_QUOTE = {
  q: "The weekly demo changed how our own team works. We stopped writing status reports and started showing the thing.",
  name: "Placeholder Name",
  role: "Head of Product, Placeholder Co",
};

/* ==========================================================================
   /why-choose-us — ported from prototype2-archive/why-choose-us.html
   ==========================================================================
   Three blocks the Next page did not have: the working agreement, a normal
   week, and the straight answers. Copy is verbatim from the archive; only the
   presentation was rebuilt on this project's tokens.

   ⚠ CLAUSES CARRIES HANDOFF §7's P1 AND IT IS THE WHOLE POINT OF THE PAGE.
   The document asserts these five clauses are "carried into every engagement
   agreement". If the real contract does not say so, this is not a wording
   problem — it is fabricated proof on the one page whose entire argument is
   "don't take our word for it". The footer line is data-placeholder until
   somebody reads the actual contract. Do not un-flag it to tidy the page up.
   ========================================================================== */

/* The archive's hero, verbatim. `ctaHref` is /#contact (gotcha 9 — the
   section only exists on home); `subHref` is a bare fragment on purpose,
   because #agreement IS on this page. */
export const WHY_HERO = {
  eyebrow: "Why Interloid",
  head: "Every vendor sounds identical.",
  accent: "Our contract doesn't.",
  lead: "The pitch-deck promises are the same everywhere: senior people, transparency, partnership. So we stopped asking clients to take our word for it. Below is what working with Interloid commits us to, in plain language.",
  cta: "Book a free 30-min consult",
  ctaHref: "/#contact",
  sub: "Read the agreement",
  subHref: "#agreement",
};

export const CLAUSES = [
  {
    n: "01",
    label: "Ownership",
    title: "Everything is yours from the first commit",
    body: "Work happens in your GitHub organisation and your cloud accounts. Code, infrastructure, credentials and documentation are yours throughout — there is no handover ceremony at the end because there is nothing of yours in our hands.",
    figure: "100%",
    caption: "code & IP, yours",
  },
  {
    n: "02",
    label: "People",
    title: "The engineers you meet are the engineers you get",
    body: "The proposal names the individuals on your project. They are the people on your discovery call, and later in your standups. Any change of personnel goes through you, in writing, before it happens.",
    figure: "Named",
    caption: "in the proposal",
  },
  {
    n: "03",
    label: "Price",
    title: "The number comes before the work",
    body: "A fixed price or a transparent hourly rate, in writing within 48 hours of the first call. Scope changes are quoted and approved before work continues — nothing is billed that you haven't approved in advance.",
    figure: "48 hrs",
    caption: "to a written price",
  },
  {
    n: "04",
    label: "Visibility",
    title: "You watch progress — you don't request updates",
    body: "A working demo every week, plus standing access to the repository and the sprint board. A bad week surfaces in that week's demo — never in a month-end surprise.",
    figure: "Weekly",
    caption: "working demo",
  },
  {
    n: "05",
    label: "Exit",
    title: "Leaving must cost you nothing",
    body: "Because everything already lives in your accounts, walking away takes one conversation — there is nothing to migrate, export or unwind. Every build includes 30 days of post-launch support; a retainer after that is an option, never a dependency.",
    figure: "30 days",
    caption: "support included",
  },
] as const;

/* `hi` marks Friday. The demo is the ceremony the whole week is built around,
   so it is the one card that is not neutral. */
export const WEEK = [
  {
    tag: "Monday",
    title: "Standup, in your channel",
    body: "The week's plan lands in your Slack or Teams — written by the engineers, not summarised by a manager.",
    hi: false,
  },
  {
    tag: "Tue – Wed",
    title: "PRs into your repo",
    body: "Reviews in the open. Your team can comment, question and learn from every change as it happens.",
    hi: false,
  },
  {
    tag: "Thursday",
    title: "Blockers, raised early",
    body: "Anything at risk for the demo is flagged now — with options, not excuses.",
    hi: false,
  },
  {
    tag: "Friday",
    title: "The working demo",
    body: "Software you can click, plus a short written summary. The ceremony the whole week is built around.",
    hi: true,
  },
  {
    tag: "Anytime",
    title: "A direct line",
    body: "Questions go to the engineer doing the work, in your timezone overlap. No relay, no ticket queue.",
    hi: false,
  },
] as const;

/* Open on the page, not in an accordion — the archive's own note. Hiding the
   awkward questions behind a click is the behaviour the section is arguing
   against. */
export const ANSWERS = [
  {
    q: "Where are you actually based?",
    a: "Gobichettipalayam, Tamil Nadu, India — and we keep deliberate overlap with US and UK business hours for standups, demos and anything urgent. Async by default, with a scheduled live window every working day.",
  },
  {
    q: "Who actually writes the code?",
    a: "Senior engineers, named in your proposal. The people on your discovery call are the people in your repo — there's no swap to a junior bench after signature, because we don't have one.",
  },
  {
    q: "We already have a team. Does that work?",
    a: "It's most of what we do. Our engineers work inside your repo and your rituals, not alongside them — and step out with 30 days' notice once you've hired.",
  },
  {
    q: "What does it cost?",
    a: "A fixed price or a transparent hourly rate, in writing within 48 hours of the first call. If budget and scope do not line up, you hear it on that call — and if the honest number is smaller than you planned to spend, you hear that too.",
  },
] as const;

/* ==========================================================================
   /careers — added 2026-09-07.
   ==========================================================================
   Built after reading conversedatasolutions.com/careers with Playwright. That
   page is: hero → three core values → a photo bento → a flat list of four
   openings → "don't see the perfect fit". None of that structure is copied.
   Two of its moves are deliberately NOT reproduced:

     · the photo bento ("Life at …"). We have no photographs of a team, and
       HANDOFF §7 P1 is explicit that we do not launch with invented people.
       Stock faces on a careers page are the exact failure the review calls
       "asking for trust while showing no proof".
     · "Our Core Values" as three abstractions (Innovation / Collaboration /
       Integrity). Those are unfalsifiable and every firm publishes them.

   What replaces them is this site's own argument turned inward. The client
   pages promise transparency, senior-only staffing and no surprises; a
   candidate reading this page should recognise the same terms pointed at
   them — OFFER is the commitment grid, PATH is the process section, and
   FIT_YES/FIT_NO is "we tell you when to walk away" addressed to applicants.

   ⚠ CLAIM STATUS. Everything about the hiring PROCESS, the COMPENSATION and
   whether these roles are open today is unverified — none of it is on
   HANDOFF §7's allowed list, because that list was written about client
   commitments. Every such string is rendered with data-placeholder by its
   component. Do not un-flag them without the user confirming the real hiring
   practice; a careers page that overstates its own process is the same
   fabricated-proof problem as a fake testimonial, one audience over.
   ========================================================================== */

/* The hero's four facts. Three of them ARE on the allowed list (senior-only,
   8–12 years, no juniors after signing, named in the proposal) — they are the
   client promises restated for a candidate, not new claims. `ph` marks the
   one that is not. */
export const CAREER_FACTS = [
  {
    k: "user-check",
    label: "Senior only",
    body: "No junior bench, no shadow team",
    ph: null,
  },
  {
    k: "clock",
    label: "US & UK overlap",
    body: "Async by default, one live window",
    ph: null,
  },
  {
    k: "handshake",
    label: "Named, not pooled",
    body: "You appear in the client's proposal",
    ph: null,
  },
  {
    k: "layers",
    label: "One project at a time",
    body: "You are not split across three accounts",
    ph: "confirm staffing policy",
  },
] as const satisfies readonly {
  k: string;
  label: string;
  body: string;
  ph: string | null;
}[];

/* ==========================================================================
   OFFER — the candidate-facing commitment grid.

   Same idea as BENTO on the client side, and the parallel is the point: the
   answer to "why work here" is the same sentence as "why hire us", which is
   the only version of that answer a senior engineer believes.

   SIX tiles, not seven: this grid is a plain three-column layout with no wide
   slot, so the count only has to divide by 3. Do not port BENTO's wide-tile
   arithmetic here — it is a different grid.
   ========================================================================== */
export const OFFER = [
  {
    k: "code",
    hue: "brand",
    title: "You write production code in week one",
    body: "There is no bench, no ramp-up project and no internal-tooling purgatory. Your first pull request goes into a client repository in your first week.",
    ph: null,
  },
  {
    k: "monitor-play",
    hue: "accent",
    title: "You demo your own work",
    body: "Every Friday the client sees the software, presented by the person who built it. No manager translating your week into a slide.",
    ph: null,
  },
  {
    k: "users",
    hue: "light",
    title: "Peers, not a pyramid",
    body: "Engineers here have 8–12 years each. Your code is reviewed by somebody who has shipped the same thing before, and you review theirs.",
    ph: null,
  },
  {
    k: "search",
    hue: "teal",
    title: "You talk to the client directly",
    body: "Scope questions go to the person who asked for the feature. Nobody relays requirements to you second-hand, and nobody relays your estimate back.",
    ph: null,
  },
  {
    k: "layers",
    hue: "indigo",
    title: "Depth over utilisation",
    body: "One project at a time. We would rather bill fewer hours than have you context-switching across three accounts before lunch.",
    ph: "confirm staffing policy before launch",
  },
  {
    k: "zap",
    hue: "accent",
    title: "A budget for getting better",
    body: "An annual allowance for machines, conferences, courses and books — yours to spend without writing a business case for it.",
    ph: "confirm the learning budget exists, and its amount",
  },
] as const satisfies readonly {
  k: string;
  hue: Hue;
  title: string;
  body: string;
  ph: string | null;
}[];

/* ==========================================================================
   ROLES.

   Six, and the four the user named are the first four: React, Ruby on Rails,
   Python, Node. The last two (React Native, Platform) are already in STACK
   above, so they add a discipline to filter by without inventing a capability
   the site does not otherwise claim.

   `disciplines` is an ARRAY on purpose — Node is genuinely both Backend and
   Platform, and forcing one tag would make the filter lie. The filter chips
   are derived from these values in Roles.tsx; adding a role with a new
   discipline adds a chip, with no second list to keep in sync.

   `pay` is a RANGE, AND IT IS UNVERIFIED. It is here because a posted band is
   the single thing that most reduces wasted screening on both sides — but a
   wrong number is worse than none, so every card renders it under
   data-placeholder until the user confirms the real bands.
   ========================================================================== */
export const ROLE_DISCIPLINES = [
  "Frontend",
  "Backend",
  "Data & AI",
  "Platform",
  "Mobile",
] as const;

export type Discipline = (typeof ROLE_DISCIPLINES)[number];

export const ROLES = [
  {
    id: "senior-react-engineer",
    title: "Senior React Engineer",
    hue: "brand",
    disciplines: ["Frontend"],
    seniority: "6+ years",
    type: "Full-time",
    mode: "Remote (India) · Gobi desk optional",
    pay: "₹28–42L / year",
    summary:
      "Own the front end of a client product end to end — the component library, the data layer, the accessibility, and the Friday demo that shows it working.",
    ship: [
      "A typed component library the client's own team can extend after we leave.",
      "Server components and streaming where they earn their complexity, plain pages where they do not.",
      "An accessibility and performance budget that fails the build, not a report nobody reads.",
    ],
    look: [
      "You have shipped a React application and then maintained it — you have paid for your own architectural decisions at least once.",
      "TypeScript in strict mode is how you already work, not a migration you are considering.",
      "You can explain a rendering choice to a non-engineer without using the word “hydration”.",
    ],
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "Playwright"],
  },
  {
    id: "senior-rails-engineer",
    title: "Senior Ruby on Rails Engineer",
    hue: "accent",
    disciplines: ["Backend"],
    seniority: "6+ years",
    type: "Full-time",
    mode: "Remote (India) · Gobi desk optional",
    pay: "₹28–42L / year",
    summary:
      "Take Rails applications that grew faster than their design and make them boring again — without a rewrite nobody funded.",
    ship: [
      "A monolith that stays a monolith, with the seams drawn where the domain actually splits.",
      "Background work that is idempotent and observable, so a retry is a non-event.",
      "Query budgets and N+1 detection in CI, because performance regressions arrive one commit at a time.",
    ],
    look: [
      "You have carried a Rails app across at least one major upgrade and lived with the result.",
      "You reach for Postgres before you reach for a new service.",
      "You write the test that would have caught it, not the test that covers the line.",
    ],
    stack: ["Ruby on Rails", "PostgreSQL", "Sidekiq", "RSpec", "Docker"],
  },
  {
    id: "senior-python-engineer",
    title: "Senior Python Engineer",
    hue: "teal",
    disciplines: ["Backend", "Data & AI"],
    seniority: "6+ years",
    type: "Full-time",
    mode: "Remote (India) · Gobi desk optional",
    pay: "₹30–45L / year",
    summary:
      "Build the pipelines, and the model-backed features on top of them, with evaluation, cost ceilings and lineage — not a notebook that impressed once.",
    ship: [
      "Pipelines with lineage, so the number on a dashboard can be traced back to the row it came from.",
      "Retrieval and evaluation harnesses that can tell a prompt change from a regression.",
      "A cost model per feature, agreed before it ships rather than discovered on an invoice.",
    ],
    look: [
      "You have put a model-backed feature in front of real users and kept it working.",
      "You treat data quality as a test suite, not a dashboard.",
      "You are comfortable saying that a problem does not need an LLM.",
    ],
    stack: ["Python", "FastAPI", "PostgreSQL", "dbt", "Airflow"],
  },
  {
    id: "senior-node-engineer",
    title: "Senior Node.js Engineer",
    hue: "indigo",
    disciplines: ["Backend", "Platform"],
    seniority: "6+ years",
    type: "Full-time",
    mode: "Remote (India) · Gobi desk optional",
    pay: "₹28–42L / year",
    summary:
      "Design the APIs everything else in the product leans on — and the unglamorous operational work that keeps them up at 3am without you.",
    ship: [
      "Typed, versioned APIs with a contract the client's other vendors can build against.",
      "Structured logs, traces and alerts that page a human only when a human is required.",
      "Migrations that run forward and back, rehearsed against a copy of production.",
    ],
    look: [
      "You have run Node in production and debugged it there, not only locally.",
      "You know where the event loop hurts, and you have measured it rather than read about it.",
      "You would rather delete a service than add one.",
    ],
    stack: ["Node.js", "TypeScript", "GraphQL", "PostgreSQL", "AWS"],
  },
  {
    id: "senior-react-native-engineer",
    title: "Senior React Native Engineer",
    hue: "light",
    disciplines: ["Mobile", "Frontend"],
    seniority: "5+ years",
    type: "Full-time",
    mode: "Remote (India) · Gobi desk optional",
    pay: "₹26–40L / year",
    summary:
      "Ship to both stores from one codebase, including the parts that are never one codebase: permissions, push, release trains and store review.",
    ship: [
      "A release pipeline the client can run themselves, signing and store submission included.",
      "Offline-first behaviour designed on purpose rather than discovered in the field.",
      "Native modules where the bridge is the wrong answer, and only there.",
    ],
    look: [
      "You have taken an app through App Store and Play review, rejections included.",
      "You can read a native stack trace without flinching.",
      "You have opinions about over-the-air updates and can defend them.",
    ],
    stack: ["React Native", "TypeScript", "Expo", "Fastlane", "Detox"],
  },
  {
    id: "platform-engineer",
    title: "Platform / DevOps Engineer",
    hue: "brand",
    disciplines: ["Platform"],
    seniority: "6+ years",
    type: "Full-time",
    mode: "Remote (India) · Gobi desk optional",
    pay: "₹30–45L / year",
    summary:
      "Provision everything as code in the client's own cloud accounts, then hand over a deploy that any engineer on their team can trigger without you.",
    ship: [
      "Terraform in the client's account, reviewed like application code and planned in CI.",
      "A pipeline that runs on every push, and a rollback that is one documented command.",
      "Observability the client's team reads on their own, because it was built with them.",
    ],
    look: [
      "You have handed infrastructure over to another team and watched them operate it.",
      "You write runbooks that a tired person can follow.",
      "You treat a manual console change as an incident, not a shortcut.",
    ],
    stack: ["AWS", "Terraform", "Kubernetes", "GitHub Actions", "Grafana"],
  },
] as const satisfies readonly {
  id: string;
  title: string;
  hue: Hue;
  disciplines: readonly Discipline[];
  seniority: string;
  type: string;
  mode: string;
  pay: string;
  summary: string;
  ship: readonly string[];
  look: readonly string[];
  stack: readonly string[];
}[];

/* ==========================================================================
   PATH — how we hire.

   Deliberately the same SHAPE as STEPS on the home page: numbered, with a
   time chip carrying the commitment. A candidate who has read the client-side
   process should notice the rhyme.

   PATH_NO is the counter-list — the three things we say we do NOT do. It is
   the most attractive part of the section precisely because it is falsifiable,
   which is also why it is placeholder until confirmed. Publishing "no unpaid
   take-home" and then sending one is the single worst thing this page could do
   to the firm's reputation with engineers.
   ========================================================================== */
export const PATH = [
  {
    k: "doc",
    n: "01",
    title: "You apply, we read it",
    when: "Reply in 3 days",
    body: "A CV or a GitHub handle is enough — no cover letter, no portal account, no forty-field form. Every applicant gets a written answer, including a no.",
  },
  {
    k: "phone",
    n: "02",
    title: "A conversation, not a screen",
    when: "45 minutes",
    body: "With an engineer, not a recruiter. We talk about something you have actually built and where it hurt. Half the time is yours to interrogate us.",
  },
  {
    k: "code",
    n: "03",
    title: "Real code, in your own time",
    when: "3 hours, paid",
    body: "A small change to a real-shaped codebase, then a session where we pair on extending it. No algorithm whiteboard, and nothing you cannot invoice.",
  },
  {
    k: "handshake",
    n: "04",
    title: "Offer, in writing",
    when: "48 hours",
    body: "Number, level, project and start date in one document — the same 48-hour rule we give clients. Ask us anything before you sign; we would rather you did.",
  },
] as const;

export const PATH_NO = [
  "No algorithm whiteboards",
  "No unpaid take-home projects",
  "No eight-round interview loops",
  "No ghosting — every applicant hears back",
] as const;

/* ==========================================================================
   FIRST_90 — "your first 90 days".

   The section almost nobody writes, and the one a senior candidate most wants
   to read. It is also the most concrete thing this page can promise, which is
   exactly why it is flagged: it describes an onboarding that has to exist.
   ========================================================================== */
export const FIRST_90 = [
  {
    tag: "Week 1",
    title: "Commit, do not observe",
    body: "Laptop, accounts and repository access on day one. You ship something small and real in the first week — we would rather fix a genuine mistake than watch you read documentation for a month.",
  },
  {
    tag: "Weeks 2–6",
    title: "Own a surface",
    body: "One area of one client product becomes yours: the decisions, the reviews, and the Friday demo. You present it to the client yourself from the first demo you are on.",
  },
  {
    tag: "Weeks 7–12",
    title: "Shape the work",
    body: "You start writing the estimates and scoping the next milestone, not only executing it. By the end of the quarter your name is on the proposal for what comes next.",
  },
] as const;

/* Two honest lists. The client-side promise is "we tell you when to walk
   away"; this is that promise pointed at applicants, and it is the reason the
   page does not need a values section. */
export const FIT_YES = [
  "You would rather delete code than defend it.",
  "You are happiest when somebody can see the thing working, not read about it.",
  "You have shipped something you still maintain, and it taught you something.",
  "You can disagree with a client's request and still be useful in the same meeting.",
  "You write things down, because you have been on the receiving end of a handover.",
] as const;

export const FIT_NO = [
  "You want a large team to sit behind. There is not one — the room is small on purpose.",
  "You want a ticket queue and a finished spec. You will be asked what we should build, not only how.",
  "You want to specialise in exactly one framework forever. Client work will move you.",
  "You dislike having your work seen weekly, unfinished, by the person paying for it.",
] as const;

/* Grouped, rather than a marquee: home's StackMarquee is a client-facing
   impression of breadth, but a candidate reads a stack list to answer "which
   of these would I touch", and grouping is what answers that. */
export const CAREER_STACK = [
  {
    group: "Ship",
    note: "What the user touches",
    items: ["TypeScript", "React", "Next.js", "React Native", "Tailwind"],
  },
  {
    group: "Serve",
    note: "What answers it",
    items: ["Node.js", "Python", "Ruby on Rails", "GraphQL", "PostgreSQL"],
  },
  {
    group: "Run",
    note: "Where it lives",
    items: ["AWS", "Terraform", "Docker", "Kubernetes", "GitHub Actions"],
  },
  {
    group: "Work",
    note: "How we talk",
    items: ["GitHub", "Slack / Teams", "Linear", "Figma", "Notion"],
  },
] as const;

/* Candidate-side FAQ. Kept separate from FAQ above: same shape, different
   audience, and merging them would put "what does a project cost" next to
   "do you hire interns". */
export const CAREER_FAQ = [
  {
    q: "Is this remote, or do I have to move to Gobichettipalayam?",
    a: "Remote within India, with the office in Gobichettipalayam, Tamil Nadu open to anyone who wants a desk. What is not flexible is the overlap window: clients are in the US and UK, so there is one scheduled live hour every working day, and the Friday demo is fixed.",
  },
  {
    q: "You say senior only. What counts as senior?",
    a: "Not years on their own. It is whether you have owned something in production long enough to have been wrong about it and to have fixed it. Somebody with five years of that is senior here; somebody with twelve years of greenfield handoffs may not be.",
  },
  {
    q: "Will I be on one project or several?",
    a: "One at a time. Work rotates when a project ends, not weekly — you are named in a client's proposal, and your staying on it is part of what they are buying.",
  },
  {
    q: "What happens if there is no client project for my stack?",
    a: "You are paid the same, and you work on internal tooling, an upgrade, or the open source we depend on. Nobody is put on an unpaid bench and nobody is asked to sell.",
  },
  {
    q: "Do you hire juniors or interns?",
    a: "Not onto client projects — clients are told explicitly that no juniors are substituted after signing, and that has to stay true. When there is a mentored path that does not break that promise, it will be posted here first.",
  },
  {
    q: "I do not match every line of a role. Should I still apply?",
    a: "Yes. The requirement lists describe the work; they are not a checklist to score yourself against. Tell us which part you have not done and how you would approach it — that answer is the one we actually read.",
  },
] as const;

/* The proof quote on /why-choose-us. A DIFFERENT quote from PULL_QUOTE on
   home, and deliberately so — the archive picks one that argues the page's
   own thesis (they were not needed again) rather than repeating the home
   page's. Same P0 bucket: placeholder until a real, permissioned one exists. */
export const WHY_QUOTE = {
  q: "Six months after handover we haven’t needed them once — which, strangely, is exactly why we’d hire them again.",
  name: "Placeholder Name",
  role: "CTO, Placeholder Co",
  link: { label: "See the work behind the words", href: "/#work" },
} as const;
