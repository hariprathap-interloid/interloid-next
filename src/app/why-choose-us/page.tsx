import type { Metadata } from "next";
import Answers from "@/components/Answers";
import Clauses from "@/components/Clauses";
import CommitmentTile from "@/components/CommitmentTile";
import CtaAnchor from "@/components/CtaAnchor";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import PullQuote from "@/components/PullQuote";
import Reveal from "@/components/Reveal";
import WeekStrip from "@/components/WeekStrip";
import WhyHero from "@/components/WhyHero";
import { BENTO, COMMITMENTS_EXTRA, WHY_QUOTE } from "@/content/site";

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

   ── PORTED FROM prototype2-archive/why-choose-us.html, 2026-09-07 ─────────
   The page was the commitment grid and nothing else. It now carries the
   archive's full argument, rebuilt on this project's tokens rather than its
   CSS: the working agreement (Clauses), a normal week (WeekStrip), the
   straight answers (Answers), and the dark slab to close on.

   Every `kicker` in the archive ("Why Interloid", "The commitments", "Direct,
   by default", "No sales call required") is a BADGE here, on request — which
   also means each block opens the way every block on the home page opens, so
   the two pages read as one site rather than two prototypes.

   The closing slab is the home CTA component with different words, not a
   second slab. Everything it needs is a prop and every prop defaults to home's
   copy — see CtaAnchor's note on why it was parameterised instead of split.

   ⚠ HANDOFF §7 P1 is still open on this page's premise: the five commitments
   are asserted to be "carried into every engagement agreement". That must be
   VERIFIED against the real contract before launch, or the page becomes
   fabricated proof — the review flags it explicitly. Both claim lines (here
   and in the agreement's foot) are marked data-placeholder until then. */
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
        <WhyHero />
        <Clauses />
        <WeekStrip />

        {/* The archive's proof band: one quote, then a route to the work. It
            lands here, between the promises and the answers, because that is
            where a reader has just been told a lot and has not been shown
            anything. Same component as home's pull-quote, different words. */}
        <PullQuote
          quote={WHY_QUOTE.q}
          name={WHY_QUOTE.name}
          role={WHY_QUOTE.role}
          link={WHY_QUOTE.link}
        />

        <Answers />

        {/* `id="contact"` would collide with nothing on this page, but the nav
            and footer both point at `/#contact` on HOME — so this slab gets
            its own id and the links stay unambiguous. */}
        <CtaAnchor
          id="hold-us"
          eyebrow="Hold us to it"
          headline="Hold us"
          accent="to all of it."
          lead={
            "Book 30 minutes and test every clause on this page against your project. " +
            "If the honest answer is “don’t hire us,” that is the answer you’ll get."
          }
          meta={[
            "No obligation",
            "No sales pressure",
            "Written price in 48 hours",
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
