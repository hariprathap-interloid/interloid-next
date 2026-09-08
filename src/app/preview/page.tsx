import type { Metadata } from "next";
import EcosystemSection from "@/components/service/EcosystemSection";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Ecosystem layouts — preview | Interloid",
  /* Internal comparison page. `noindex` because it is a decision aid, not a
     page anyone should arrive at from a search result — and because it shows
     the same content three times, which is exactly what a search engine
     penalises. */
  robots: { index: false, follow: false },
};

/* ==========================================================================
   /preview — every ecosystem layout, one after another, to choose from.
   ==========================================================================
   They are all REAL components on the REAL data, not mockups: whichever wins
   is already built and only needs its name passed to EcosystemSection on
   /services. The losers can then be deleted along with the `variant` prop.

   Each gets its own `idPrefix` because they all mount on this page at once
   and would otherwise share element ids — eight tablists all claiming
   `#svc-0` is invalid HTML and breaks every aria-controls on the page.

   This page is not linked from the nav and is noindex. It exists to be looked
   at and then removed; delete the route along with the losing variants. */
export default function Preview() {
  return (
    <>
      <Reveal />
      <Nav />
      <main id="main">
        <header className="border-b border-border bg-secondary pb-16 pt-40">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-accent-strong">
              Internal preview · not linked, not indexed
            </p>
            <h1 className="max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-[-0.025em] text-foreground md:text-5xl">
              Eight ecosystem layouts,{" "}
              <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
                same data, same styling.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-[1.5] text-muted-foreground">
              Only the layout differs, so the comparison is about layout rather
              than decoration. Try each one with the mouse, then with the
              keyboard (Tab to a service, then arrow keys), then at a narrow
              window. The one on /services today is B.
            </p>
          </div>
        </header>

        {[
          {
            v: "branch" as const,
            title: "B · Branch tree  —  SHIPPING ON /services",
            note: "The wheel picks, a card explains. The only layout that shows every technology NAME without a hover, and the only one whose nodes never move under your cursor. Unanimous pick of the design, frontend and accessibility reviews.",
          },
          {
            v: "constellation" as const,
            title: "D · Connected constellation",
            note: "Your first screenshot as the resting state. Opening a service draws real edges core → service → group → technology, so level 3 is joined to its parent instead of floating near it. Bigger marks.",
          },
          {
            v: "bloom" as const,
            title: "A · Radial bloom",
            note: "Closest to the reference. The wheel never moves; the neighbours recede and the open branch borrows their angle. Level 3 sits on an outer arc with no edges — the thing the constellation variant fixes.",
          },
          {
            v: "magnify" as const,
            title: "E · Magnify",
            note: "Hovering a service turns it into a circle larger than the Interloid core, and the three levels connect out of it. The map zooms its attention without changing the page.",
          },
          {
            v: "tree" as const,
            title: "F · Tech tree",
            note: "Your tree references. Trunk = Interloid, branches = the six services, twigs = the groups, leaves = every technology mark. Nothing is hidden: the whole stack is visible at once.",
          },
          {
            v: "dendrogram" as const,
            title: "G · Great circle",
            note: "A radial dendrogram — all 6 services, 20 groups and 62 marks on concentric arcs simultaneously, each wedge sized by how much it actually contains. Completeness is the promise; the risk is density.",
          },
          {
            v: "columns" as const,
            title: "H · Flow columns",
            note: "The deliberately non-circular answer. Four columns — core, services, groups, technologies — joined by bezier links, with a readable name on every single node.",
          },
          {
            v: "shells" as const,
            title: "C · Orbit shells",
            note: "The wheel turns so the open service always points right and the other five compress opposite. Every branch is the same shape, at the cost of moving all six nodes on every selection.",
          },
        ].map(({ v, title, note }) => (
          <div key={v}>
            <div className="mx-auto max-w-7xl px-6 pt-24">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-foreground">
                {title}
              </h2>
              <p className="mt-2 max-w-3xl text-[15px] leading-[1.7] text-muted-foreground">
                {note}
              </p>
            </div>
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
