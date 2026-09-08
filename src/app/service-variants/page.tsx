import type { Metadata } from "next";
import EcosystemSection, {
  type EcosystemVariant,
} from "@/components/service/EcosystemSection";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Ecosystem variants — how each would ship | Interloid",
  robots: { index: false, follow: false },
};

/* ==========================================================================
   /service-variants — the shortlist, named, as each would appear on /services.
   ==========================================================================
   The earlier pages were a laboratory: eight layouts in a row, to find out
   which ones were worth keeping. This one is the shortlist the user named,
   presented the way the decision actually has to be made — each option with
   the name it would be referred to by, what it costs, and what it is good at,
   rendered in the section chrome it would really ship in.

   Every one of these is one string away from production: `variant` on the
   EcosystemSection in CapabilitiesAndStacks.tsx. Nothing else changes.

   ── WHAT CHANGED FOR THIS PAGE ───────────────────────────────────────────
   · `-circle` became a variant SUFFIX, so "Connected constellation - circle"
     is one name rather than a layout plus a flag someone has to remember.
   · Hover drives everything. Clicking used to pin, and a pinned selection
     ignores later hovers, so one stray click made Great circle and Flow
     columns feel dead. Pinning is now touch-only, where there is no hover to
     lose.
   · The Tech tree is back to its older look — solid trunk, square marks — on
     request. Its twig alignment stays fixed; that was a defect, not a taste.

   Not linked, noindex. Delete it once the choice is made.
   ========================================================================== */

type Sample = {
  v: EcosystemVariant;
  name: string;
  best: string;
  cost: string;
};

const SAMPLES: Sample[] = [
  {
    v: "constellation-circle",
    name: "Connected constellation — circle",
    best: "Every level is a disc, and every disc is joined to its parent by a drawn edge. The hierarchy is legible without reading a word — which is the whole job of this section.",
    cost: "One service at a time. A visitor who wants to compare two stacks has to open each in turn.",
  },
  {
    v: "constellation",
    name: "Connected constellation — pill",
    best: "The same layout with lozenge group labels. Longer names sit on one line, so nothing wraps to three.",
    cost: "The group reads as a caption rather than as a node, which weakens the family resemblance the circle version has.",
  },
  {
    v: "tree",
    name: "Tech tree",
    best: "Nothing is hidden: all six branches and all 62 marks are on screen at once, and the open service lights its own branch. The best answer to “what do you actually work with”.",
    cost: "It is tall, and at rest it is busy. The marks are small enough that they read as texture until you look closely.",
  },
  {
    v: "dendrogram",
    name: "Great circle",
    best: "The whole hierarchy at once, with each wedge sized by how many technologies that service really has — so the picture is honest about where the depth is. Opens on hover.",
    cost: "The densest of them all. It needs its full height, and on a small laptop it is the first to feel cramped.",
  },
  {
    v: "columns",
    name: "Flow columns",
    best: "The only layout where every node at every level carries a readable name, and the one that survives a long label without wrapping. Opens on hover.",
    cost: "It is a diagram plus a panel rather than one object; it gives up the ecosystem feeling the wheel has.",
  },
];

export default function ServiceVariants() {
  return (
    <>
      <Reveal />
      <Nav />
      <main id="main">
        <header className="border-b border-border bg-secondary pb-16 pt-40">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-accent-strong">
              Variants · not linked, not indexed
            </p>
            <h1 className="max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-[-0.025em] text-foreground md:text-5xl">
              Five ways to ship it,{" "}
              <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
                each one line away.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-[1.5] text-muted-foreground">
              Each option below is rendered in the section chrome it would
              really ship in, with its name, what it is good at, and what it
              costs. Everything opens on hover; a tap is only needed on touch.
            </p>

            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SAMPLES.map((s) => (
                <li key={s.v}>
                  <a
                    href={`#preview-${s.v}`}
                    className="group flex items-center justify-between gap-3 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-accent/40"
                  >
                    {s.name}
                    <span className="text-accent-strong transition-transform group-hover:translate-x-1">
                      <Icon name="arrow" className="size-4" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </header>

        {SAMPLES.map((s) => (
          <div key={s.v}>
            <div className="mx-auto max-w-7xl px-6 pt-24">
              <div className="flex flex-col gap-2 border-l-2 border-accent/40 pl-5">
                <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-foreground">
                  {s.name}
                </h2>
                <p className="max-w-3xl text-[15px] leading-[1.7] text-muted-strong">
                  <span className="font-semibold text-foreground">Good at — </span>
                  {s.best}
                </p>
                <p className="max-w-3xl text-[15px] leading-[1.7] text-muted-foreground">
                  <span className="font-semibold text-foreground">Costs — </span>
                  {s.cost}
                </p>
                {/* The literal one-line change, so the choice is concrete. */}
                <p className="mt-1 font-mono text-[12px] text-muted-foreground">
                  &lt;EcosystemSection variant=&quot;{s.v}&quot; /&gt;
                </p>
              </div>
            </div>
            {/* `idPrefix` per variant: they all mount at once and would
                otherwise share element ids, which is invalid and breaks every
                aria-controls on the page. */}
            <EcosystemSection
              variant={s.v}
              idPrefix={s.v}
              heading={false}
              id={`preview-${s.v}`}
            />
          </div>
        ))}
      </main>
      <Footer />
    </>
  );
}
