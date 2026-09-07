/* ==========================================================================
   SERVICE PAGE CONTENT — added 2026-09-08.
   ==========================================================================
   Copy for /services. Split out of site.ts because it is a page's worth of
   content with its own shape, and because the components in
   `src/components/service/` are written against these TYPES rather than
   against one page's data: a second service page later is a second object
   here plus a route, with no component changes. site.ts remains the home /
   why-choose-us / careers content.

   ── WHERE THE CONTENT CAME FROM ──────────────────────────────────────────
   The five capabilities are home's retired "What we build" section, which
   was five names with one line each. That is the starting point, not the
   destination: each one now has to answer what the client actually asks —
   what it is, what it fixes, what lands in their repo — because a service
   page that only names capabilities is a slower version of the home section
   it replaced. Structure informed by SERVICE-PAGE-RESEARCH.md (repo root).

   ⚠ CLAIMS. Everything stated as fact below is on HANDOFF §7's allowed list:
     free 30-min consult · 48-hr written proposal · weekly working demo ·
     30 days post-launch support · 30-day notice · 100% code/IP ownership ·
     $25k–$90k build range · 8–12 weeks to a first version (14–20 larger) ·
     engineers with 8–12 years each · no juniors substituted after signing ·
     named in the proposal · work in the client's own accounts.
   There is deliberately NO client count, NO logo wall and NO named customer
   here — the reference pages lean on all three and it is the first thing
   that reads as marketing. Nothing on this page needs a data-placeholder,
   and it should stay that way: if a new line needs one, it probably needs
   the user's confirmation more than it needs to ship.
   ========================================================================== */

import type { Hue } from "./site";

/* The page's spine. A visitor is one of exactly two buyers and the whole
   page follows the one they pick — see components/service/ModeContext.tsx. */
export type ServiceMode = "build" | "extend";

export type Capability = {
  k: string;
  /** Icon name in Icon.tsx. */
  icon: string;
  name: string;
  hue: Hue;
  /** Diagram key in components/service/Diagrams.tsx. */
  figure: string;
  /** Imperative headline: neutral clause + ONE gradient clause (DS §1.2.4). */
  head: string;
  accent: string;
  body: string;
  /** "What lands in your repo" — artifacts, never adjectives. */
  deliver: readonly string[];
  /** TechIcon keys. Optional on purpose: for team augmentation the stack is
      the client's, so naming ours would be a lie dressed as a credential. */
  tech?: readonly string[];
};

export type ModeDetail = {
  key: ServiceMode;
  icon: string;
  /** Switch label — the visitor's own sentence, not a product name. */
  label: string;
  /** One line under the switch label. */
  hint: string;
  /** Hero: the gradient clause and lead change with the mode. */
  heroAccent: string;
  heroLead: string;
  cta: string;
  /** Engagement panel. */
  title: string;
  who: string;
  terms: readonly string[];
  figure: string;
  caption: string;
};

/* ── HERO ──────────────────────────────────────────────────────────────── */
export const SERVICE_HERO = {
  eyebrow: "Engineering services",
  /* The neutral clause is constant; the gradient clause comes from the mode,
     so the headline answers the visitor's own question the moment they pick. */
  head: "Senior engineers who",
  lead: "Two ways to work with us, one standard of engineering. Tell us which you are and the rest of this page answers you.",
} as const;

/* ── MODES ─────────────────────────────────────────────────────────────── */
export const SERVICE_MODES = [
  {
    key: "build",
    icon: "rocket",
    label: "Build it with us",
    hint: "An idea, a requirement or a stalled roadmap, and no team free to ship it",
    heroAccent: "build the thing you can't staff.",
    heroLead:
      "You have a product to ship and nobody free to ship it. We take it from a written scope to production in your own accounts — fixed price, a working demo every week, and everything yours from the first commit.",
    cta: "Start a project",
    title: "We build it. You own it, throughout.",
    who: "Best when the work is a defined slice — a first version, a rebuild, a platform your team has no capacity to start.",
    terms: [
      "A fixed price or a transparent hourly rate, in writing within 48 hours of the first call.",
      "A focused first version in 8–12 weeks; larger platforms run 14–20.",
      "A working demo every week from week one — software you can click, not a status report.",
      "Your GitHub organisation and your cloud accounts from the first commit. There is no handover ceremony because nothing of yours is ever in our hands.",
      "30 days of post-launch support included; a retainer after that is an option, never a dependency.",
    ],
    figure: "$25k–$90k",
    caption: "typical full build",
  },
  {
    key: "extend",
    icon: "users",
    label: "Extend our team",
    hint: "A team and a roadmap already running, short on senior capacity",
    heroAccent: "join the team you already have.",
    heroLead:
      "You have engineers and a roadmap moving slower than the market. Ours join your repo, your board and your standups on contract — senior only, named in the proposal, out again with 30 days' notice.",
    cta: "Add engineers to our team",
    title: "Our seniors, inside your process.",
    who: "Best when the roadmap is yours, the context is yours, and what is missing is experienced hands who need no ramp-up.",
    terms: [
      "Engineers with 8–12 years each, named in the proposal before you commit.",
      "No juniors substituted after signing — the people you meet are the people you get.",
      "Your repo, your board, your review process and your rituals. Not a parallel track that reports in.",
      "Deliberate overlap with US and UK business hours: async by default, one scheduled live window every working day.",
      "30-day notice either way, so the moment you have hired, we step out cleanly.",
    ],
    figure: "Monthly",
    caption: "per engineer, transparent",
  },
] as const satisfies readonly ModeDetail[];

/* ── THE PROBLEM ───────────────────────────────────────────────────────────
   The client's own sentence first, our answer on disclosure. Four is the
   right number: it is the count at which a reader recognises themselves in
   one without scanning a list. `to` names the capability the answer belongs
   to, so the link label is derived rather than hand-kept. */
export const SERVICE_PROBLEMS = [
  {
    q: "We keep planning features we never ship.",
    a: "Planning is not the bottleneck — the absence of a shipped slice is. We take one defined piece of the roadmap to production, then the next. You see a working demo every week, so momentum is visible instead of asserted.",
    to: "product",
  },
  {
    q: "Every release breaks something else.",
    a: "That is an architecture problem wearing a testing costume. We stabilise the foundations: boring architecture, tests that gate the deploy, and observability that pages a human before your customers notice.",
    to: "cloud",
  },
  {
    q: "Nobody trusts the number on the dashboard.",
    a: "Two reports disagree because the metric was defined twice. We define it once, centrally, and give every figure lineage back to the row it came from — so the argument moves from “is this right?” to “what do we do about it?”",
    to: "data",
  },
  {
    q: "Our AI demo impressed everyone and shipped to nobody.",
    a: "Demos die in review because nobody can prove they work. We build the other way round — start from the workflow, add retrieval and guardrails, and wrap it in an evaluation harness so “does it work?” has a measured answer and a cost per use.",
    to: "ai",
  },
  {
    q: "Hiring senior engineers is taking quarters, not weeks.",
    a: "Embed ours while you hire. Senior engineers join your standups, your repo and your review process, and leave with 30 days' notice the moment your own hire starts. No bench, and no juniors billed as seniors.",
    to: "team",
  },
] as const satisfies readonly { q: string; a: string; to: string }[];

/* ── CAPABILITIES ──────────────────────────────────────────────────────────
   Five, each with a mechanism diagram (Diagrams.tsx) rather than an
   illustration. The headline names the outcome or the pain — never the
   capability, which is already the label above it. */
/* ANNOTATED, not `as const satisfies` like the arrays around it. `tech` is
   optional and the team-augmentation entry omits it, so under `as const` the
   element type becomes a union in which one member has no `tech` at all and
   `c.tech` stops type-checking at the call site. Annotating gives every entry
   the same `Capability` type — which is also what the components want, since
   they are written against the type rather than against this page's data. */
export const CAPABILITIES: readonly Capability[] = [
  {
    k: "product",
    icon: "code",
    name: "Product engineering",
    hue: "brand",
    figure: "slice",
    head: "Ship the roadmap,",
    accent: "not the status report.",
    body: "Web and mobile products taken from a written scope to production — typed, tested, documented, and running on infrastructure you control. We build one thin slice all the way to real users first, because that is the only version of “on track” a stakeholder can verify.",
    deliver: [
      "A typed, tested codebase in your GitHub organisation from the first commit.",
      "One vertical slice in production early, then the next — never a big-bang reveal.",
      "Documentation written for the team that inherits it, because they will.",
    ],
    tech: ["react", "typescript", "node", "postgres"],
  },
  {
    k: "data",
    icon: "chart",
    name: "Data & analytics",
    hue: "teal",
    figure: "lineage",
    head: "Trust the number",
    accent: "before you argue about it.",
    body: "Pipelines, warehouses and dashboards that answer the question you actually asked. Every metric is defined once and every figure carries lineage back to its source row, so a disagreement about the data ends in a link rather than a meeting.",
    deliver: [
      "Pipelines with lineage — any figure traceable to the row it came from.",
      "Metrics defined once, centrally: the same answer in every report and every query.",
      "Data-quality checks that fail loudly in CI, not quietly in a board pack.",
    ],
    tech: ["python", "postgres", "docker"],
  },
  {
    k: "cloud",
    icon: "cloud",
    name: "Cloud & DevOps",
    hue: "light",
    figure: "deploy",
    head: "A deploy your own team",
    accent: "can run without us.",
    body: "Provisioned as code in your own cloud accounts, reviewed like application code and planned in CI. The measure of the work is not that it runs — it is that your engineers can deploy, roll back and debug it on a Friday afternoon with us switched off.",
    deliver: [
      "Terraform in your account, reviewed like application code and planned on every push.",
      "A rollback that is one documented command, rehearsed before it is needed.",
      "Observability your team reads on their own, because it was built with them.",
    ],
    tech: ["docker", "git", "python"],
  },
  {
    k: "ai",
    icon: "sparkle",
    name: "AI integration",
    hue: "indigo",
    figure: "retrieval",
    head: "AI that survives",
    accent: "contact with review.",
    body: "Model-backed features wired into a real workflow, with retrieval over your own data, guardrails on both ends, and an evaluation harness that can tell a prompt change from a regression. We will also tell you when a problem does not need a model.",
    deliver: [
      "Retrieval over your documents and data, with an evaluation harness so “does it work?” has a measured answer.",
      "Guardrails and moderation on inputs and outputs, agreed before launch rather than after an incident.",
      "A cost ceiling per feature, modelled up front instead of discovered on an invoice.",
    ],
    tech: ["python", "node", "postgres"],
  },
  {
    k: "team",
    icon: "users",
    name: "Team augmentation",
    hue: "accent",
    figure: "merge",
    head: "Senior hands,",
    accent: "inside your process.",
    body: "Engineers with 8–12 years each, working in your repository and your rituals rather than alongside them. Named in the proposal, the same people throughout, and gone with 30 days' notice the day your own hire starts.",
    deliver: [
      "Named engineers, not a pool — no juniors substituted after signing.",
      "Your board, your branch strategy, your review process. We adopt them; we do not import ours.",
      "A clean exit: 30-day notice either way, with nothing of yours in our hands.",
    ],
  },
];

/* ── APPROACH ──────────────────────────────────────────────────────────────
   How we take a problem apart. Deliberately NOT the four engagement steps
   from home's Process section — that is the calendar, this is the method,
   and repeating home's ledger here would waste the section. The `mode` note
   on each is what changes when the engineers are inside your team instead. */
export const SERVICE_PRINCIPLES = [
  {
    n: "01",
    icon: "search",
    title: "Start from the decision, not the technology",
    body: "The first call establishes what has to become true for this to have been worth doing. If the honest answer is a spreadsheet, a config change or a different vendor, you hear that instead of a proposal.",
    build: "You get scope shaped around that outcome — and a written no if it does not need us.",
    extend: "Your team keeps the roadmap; our engineers arrive already knowing what it is for.",
  },
  {
    n: "02",
    icon: "rocket",
    title: "One thin slice, all the way to production",
    body: "The first milestone crosses every layer the product will ever have — interface, service, data, deploy — rather than finishing one layer at a time. Integration risk arrives in week two, when it is cheap.",
    build: "Something real is in production long before the build is finished.",
    extend: "Our first pull request goes into your repo in the first week, not the first month.",
  },
  {
    n: "03",
    icon: "shield",
    title: "Boring architecture, tested at the seams",
    body: "We reach for Postgres before a new service and delete a component before adding one. Tests concentrate where systems actually break — the boundaries — so the suite stays worth running.",
    build: "A stack your team can staff for, not one only we can maintain.",
    extend: "Reviews that raise the floor of the codebase your team already owns.",
  },
  {
    n: "04",
    icon: "monitor-play",
    title: "The demo is the status report",
    body: "Every week you get software you can click and a short written note. A bad week shows up in that week's demo, with options attached — never in a month-end surprise.",
    build: "Weekly demos from week one, for the length of the engagement.",
    extend: "Our engineers present their own work in your ceremonies, in your words.",
  },
  {
    n: "05",
    icon: "key-round",
    title: "Handover is a deliverable, not an event",
    body: "Everything lives in your accounts from day one, so leaving costs you nothing at any point. Runbooks are written for a tired person at 3am, and the last week of an engagement is not the first time anyone reads them.",
    build: "100% code and IP ownership throughout, plus 30 days of post-launch support.",
    extend: "30-day notice either way, and no knowledge that walks out with us.",
  },
] as const satisfies readonly {
  n: string;
  icon: string;
  title: string;
  body: string;
  build: string;
  extend: string;
}[];

/* ── WHY INTERLOID ─────────────────────────────────────────────────────────
   The five terms that differ from the market, as figures. Every one is on
   the allowed list, and each restates a commitment made elsewhere on the
   site rather than introducing a new one. */
export const SERVICE_TERMS = [
  { figure: "100%", caption: "code and IP yours, from the first commit" },
  { figure: "48 hrs", caption: "from first call to a written price" },
  { figure: "Weekly", caption: "working demo, for the whole engagement" },
  { figure: "8–12 yrs", caption: "experience per engineer, no juniors swapped in" },
  { figure: "30 days", caption: "notice either way — and post-launch support included" },
] as const satisfies readonly { figure: string; caption: string }[];

/* ── HOW TO START ──────────────────────────────────────────────────────────
   Three lines under the closing CTA. The consult, the proposal and the
   honest-no are the three things that remove the hesitation at that point in
   the page; all three are allowed claims. */
export const SERVICE_START = [
  "A free 30-minute call, no obligation",
  "A written scope and price in 48 hours",
  "An honest no if you don't need us",
] as const;
