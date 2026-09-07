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
   /preview — the three ecosystem layouts, one after another, to choose from.
   ==========================================================================
   All three are REAL components with the REAL data, not mockups: whichever
   wins is already built and only needs its name passed to EcosystemSection on
   /services. The losing two can then be deleted along with the `variant` prop.

   Each gets its own `idPrefix` because all three mount on this page at once
   and they would otherwise share element ids — three tablists all claiming
   `#svc-0` is invalid HTML and breaks every aria-controls on the page.

   This page is not linked from the nav. It exists to be looked at and then
   removed; delete the route with the two losing variants.
   ========================================================================== */
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
              Three ecosystem layouts,{" "}
              <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
                same data, same styling.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-[1.5] text-muted-foreground">
              Only the layout differs, so the comparison is about layout rather
              than decoration. Try each one with the mouse, then with the
              keyboard (Tab to a service, then arrow keys), then at a narrow
              window. The one on /services today is A.
            </p>
          </div>
        </header>

        {[
          {
            v: "bloom" as const,
            title: "A · Radial bloom",
            note: "Closest to the reference. The wheel never moves; the neighbours recede and the open branch borrows their angle. Technology names are on hover only — at this radius there is no room for forty labels.",
          },
          {
            v: "branch" as const,
            title: "B · Branch tree",
            note: "The wheel becomes a picker and the subtree unfolds as a readable tree beside it. The only variant that can show every technology NAME without a hover. Less of an “ecosystem”, more of a diagram plus a panel.",
          },
          {
            v: "shells" as const,
            title: "C · Orbit shells",
            note: "The wheel turns so the open service always points right, and the other five compress opposite. Every branch is the same shape, which makes it learnable — at the cost of moving all six nodes on every hover.",
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
