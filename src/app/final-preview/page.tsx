import type { Metadata } from "next";
import EcosystemSection from "@/components/service/EcosystemSection";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Ecosystem — final shortlist | Interloid",
  robots: { index: false, follow: false },
};

/* ==========================================================================
   /final-preview — the five layouts still in the running.
   ==========================================================================
   /preview holds all eight, including the three that were only ever built to
   be compared against. This page is the shortlist the user named, with the
   two design defects they reported fixed across every one of them:

     "the lines look struck out"   The group pill's ground was `h.soft`, a 10%
                                   tint, so a connector drawn beneath it showed
                                   straight through the label. Every pill is now
                                   opaque `bg-card`, hue kept in the ring and
                                   the text. One change, every variant.

     "badge not looks good"        A technology was a 36px rounded-square chip.
                                   It is now a 40px CIRCLE with a ring and a
                                   lifted shadow — the same object language as
                                   the Interloid core and the service tiles, so
                                   all three levels read as one family at three
                                   sizes rather than as three unrelated shapes.

   Edges also gained a real trim (geometry.ts `trim`): a connector now stops at
   the radius of the node at each end instead of running to its centre and
   relying on something opaque being painted over it.

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

export default function FinalPreview() {
  return (
    <>
      <Reveal />
      <Nav />
      <main id="main">
        <header className="border-b border-border bg-secondary pb-16 pt-40">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-accent-strong">
              Final shortlist · not linked, not indexed
            </p>
            <h1 className="max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-[-0.025em] text-foreground md:text-5xl">
              Five layouts, with the lines{" "}
              <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
                joined properly.
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
              variant={v}
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
