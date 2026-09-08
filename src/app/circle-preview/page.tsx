import type { Metadata } from "next";
import EcosystemSection from "@/components/service/EcosystemSection";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Ecosystem — circular nodes | Interloid",
  robots: { index: false, follow: false },
};

/* ==========================================================================
   /circle-preview — the same five layouts, with LEVEL 2 AS A CIRCLE.
   ==========================================================================
   A copy of /final-preview with one thing changed, so the two pages are a
   controlled comparison: identical layouts, identical data, and the only
   difference is whether a group is a lozenge or a disc.

   The user drew this: a round node with the group name wrapped inside it,
   rather than a pill with the name on one line. The argument for it is that
   it makes the hierarchy one family of shapes - core, service, group,
   technology, four discs at four sizes - where a pill reads as a caption that
   happens to be sitting there. The argument against is that a fixed circle
   cannot grow to fit "Containers & orchestration", so the longest labels wrap
   to three lines and sit tight.

   It costs one prop. `circles` puts `.eco-circles` on the wrapper and the
   rule in globals.css restyles every group label in every variant at once -
   no layout was rewritten for this page, which is the only reason a fair
   comparison is possible at all.

   Also fixed here, and on /final-preview, because they were real defects
   rather than preferences:
     · the tree's twigs left a point floating 20 units above the group label
       instead of its actual top edge, so the fan looked unattached
     · the tree's trunk was a 9px grey stroke - a constant-width pole. It is
       now a filled, tapered shape in the brand tone: a trunk narrows, and a
       stroke cannot
     · the tree's own group label still used the 10% tint, so connectors drew
       through it exactly as the other variants used to

   Not linked, noindex. Delete it with the losing variants.
   ========================================================================== */
const SHORTLIST = [
  {
    v: "constellation" as const,
    title: "D · Connected constellation",
    note: "The resting picture is your screenshot. Opening a service draws the whole tree — core → service → group → technology — with every edge stopping at the node it meets.",
  },
  {
    v: "tree" as const,
    title: "F · Tech tree",
    note: "Trunk, branches, twigs, leaves. Every one of the 62 marks is on screen at once; the open service lights its branch and the other five fall back.",
  },
  {
    v: "dendrogram" as const,
    title: "G · Great circle",
    note: "The whole hierarchy on concentric arcs, each wedge sized by how many technologies that service actually has. The labels sit along their own spokes, so nothing crosses anything.",
  },
  {
    v: "columns" as const,
    title: "H · Flow columns",
    note: "The non-circular one. Four columns joined by bezier links, and the only layout where every node at every level carries a readable name.",
  },
  {
    v: "bloom" as const,
    title: "A · Radial bloom",
    note: "The closest to the reference wheel. The services never move; the neighbours recede and the open branch borrows their angle.",
  },
];

export default function CirclePreview() {
  return (
    <>
      <Reveal />
      <Nav />
      <main id="main">
        <header className="border-b border-border bg-secondary pb-16 pt-40">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-accent-strong">
              Circular nodes · not linked, not indexed
            </p>
            <h1 className="max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-[-0.025em] text-foreground md:text-5xl">
              The same five, with every level{" "}
              <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
                a circle.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-[1.5] text-muted-foreground">
              Group labels are opaque now, so no connector runs through one, and
              every technology is a circular node rather than a badge — the same
              shape language as the core. Try each with the mouse, then with the
              keyboard (Tab to a service, then the arrow keys).
            </p>
          </div>
        </header>

        {SHORTLIST.map(({ v, title, note }) => (
          <div key={v}>
            <div className="mx-auto max-w-7xl px-6 pt-24">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-foreground">
                {title}
              </h2>
              <p className="mt-2 max-w-3xl text-[15px] leading-[1.7] text-muted-foreground">
                {note}
              </p>
            </div>
            {/* `idPrefix` is per-variant because they all mount at once and
                would otherwise share element ids — five tablists claiming the
                same `#svc-0` is invalid and breaks every aria-controls here. */}
            <EcosystemSection
              variant={`${v}-circle` as const}
              idPrefix={v}
              heading={false}
              id={`preview-${v}`}
            />
          </div>
        ))}
      </main>
      <Footer />
    </>
  );
}
