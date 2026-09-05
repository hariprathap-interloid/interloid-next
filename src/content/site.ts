/* ==========================================================================
   Content — lifted from prototype3/script.js, where these arrays were written
   specifically to become `.map()` calls (TAILWIND-MAP §4). Editing copy means
   editing this file; no component changes.

   Only HANDOFF §7's six allowed numeric claims appear as fact anywhere here:
   free 30-min consult · 48-hr written proposal · weekly working demo ·
   30 days post-launch support · 30-day notice · 100% code/IP ownership.
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

export const BENTO = [
  {
    k: "clock",
    hue: "brand",
    span: "lg:col-span-2",
    title: "A written proposal in 48 hours",
    body: "Scope, price, and a delivery date in writing two working days after the consult. If we can’t commit to it, we tell you then — not three weeks in.",
  },
  {
    k: "repeat",
    hue: "accent",
    span: "",
    title: "A working demo every week",
    body: "Not a status report. Software you can click, every week, from week one.",
  },
  {
    k: "key",
    hue: "indigo",
    span: "",
    title: "You own 100% of the code",
    body: "Your repos, your cloud accounts, your IP — from the first commit, not at handover.",
  },
  {
    k: "shield",
    hue: "teal",
    span: "",
    title: "30 days of post-launch support",
    body: "Included. We stay on after go-live, because that is when real usage finds things.",
  },
  {
    k: "doc",
    hue: "light",
    span: "",
    title: "30-day notice, either direction",
    body: "No lock-in, no minimum term. If it isn’t working, you leave with everything.",
  },
] as const satisfies readonly {
  k: string;
  hue: Hue;
  span: string;
  title: string;
  body: string;
}[];

export const STEPS = [
  {
    k: "search",
    n: "01",
    title: "Consult",
    when: "Day 0",
    body: "A free 30-minute call. You describe the problem; we tell you whether we are the right team for it.",
  },
  {
    k: "doc",
    n: "02",
    title: "Proposal",
    when: "Within 48h",
    body: "Scope, price, timeline and assumptions in writing. Fixed price or transparent hourly — your choice.",
  },
  {
    k: "code",
    n: "03",
    title: "Build",
    when: "Weekly",
    body: "Two-week cycles with a working demo every week, in your repos and your accounts from commit one.",
  },
  {
    k: "rocket",
    n: "04",
    title: "Handover",
    when: "+30 days",
    body: "Documentation, a walkthrough with your team, and 30 days of support after go-live.",
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
