import type { Metadata } from "next";
import CommitmentTile from "@/components/CommitmentTile";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { BENTO, COMMITMENTS_EXTRA } from "@/content/site";

export const metadata: Metadata = {
  title: "Why Interloid — the commitments we put in writing",
  description:
    "The terms Interloid puts in the engagement agreement: 100% code ownership, fixed price or transparent hourly, senior engineers only, a working demo every week, and 30 days of post-launch support.",
};

/* /why-choose-us — the standalone page for the commitment set.

   The 2026-09-06 home/page split was reverted on 2026-09-07: home now carries
   the full set, and this page renders the SAME list (BENTO plus the
   now-empty COMMITMENTS_EXTRA, kept so the split can be re-made without
   touching this file). It is still linked from the nav and the footer.

   ⚠ HANDOFF §7 P1 is still open on this page's premise: the five commitments
   are asserted to be "carried into every engagement agreement". That must be
   VERIFIED against the real contract before launch, or the page becomes
   fabricated proof — the review flags it explicitly. The claim line below is
   marked data-placeholder until then. */
export default function WhyChooseUs() {
  const all = [...BENTO, ...COMMITMENTS_EXTRA];

  return (
    <>
      <Reveal />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-200 focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:font-semibold focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <section className="relative overflow-hidden bg-secondary pb-32 pt-40">
          <div
            className="pointer-events-none absolute bottom-0 left-0 size-[600px] -translate-x-1/3 translate-y-1/3 rounded-full bg-brand/15 blur-[120px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-0 top-1/4 size-[420px] translate-x-1/3 rounded-full bg-accent/15 blur-[120px]"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="mb-16 max-w-2xl">
              <div
                data-reveal
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium leading-[1.5] shadow-sm"
              >
                <span className="text-accent-strong">
                  <Icon name="star" className="size-4" />
                </span>
                <span className="text-muted-foreground">Why Interloid</span>
              </div>
              {/* h1, not h2 — this is the page's own title. Same metrics as
                  the section H2 elsewhere; the level changes, not the size. */}
              <h1
                data-reveal
                style={{ "--delay": "100ms" } as React.CSSProperties}
                className="font-display text-4xl font-medium leading-[1.1] tracking-[-0.025em] text-foreground md:text-5xl lg:text-[3.5rem]"
              >
                Commitments we{" "}
                <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
                  put in writing.
                </span>
              </h1>
              <p
                data-reveal
                style={{ "--delay": "200ms" } as React.CSSProperties}
                data-placeholder="P1: verify against the real engagement agreement before launch"
                className="mt-6 text-lg leading-[1.5] text-muted-foreground"
              >
                Every commitment, carried into every engagement agreement —
                not just written on a website.
              </p>
            </div>

            {/* Five tiles: 2 + 1 + 1 + 1 = the wide tile plus four singles
                fills two rows of three exactly, which is the arrangement
                prototype 1's grid was designed around. */}
            <div className="grid gap-6 md:grid-cols-2 lg:auto-rows-[18rem] lg:grid-cols-3">
              {all.map((c, i) => (
                <CommitmentTile
                  key={c.title}
                  item={c}
                  index={i}
                  wide={
                    i === 0 || (all.length % 3 === 1 && i === all.length - 1)
                  }
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
