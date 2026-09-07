import type { Metadata } from "next";
import CandidateOffer from "@/components/CandidateOffer";
import CareerFaq from "@/components/CareerFaq";
import CareerStack from "@/components/CareerStack";
import CareersHero from "@/components/CareersHero";
import CtaAnchor from "@/components/CtaAnchor";
import FirstNinety from "@/components/FirstNinety";
import FitCheck from "@/components/FitCheck";
import Footer from "@/components/Footer";
import HiringPath from "@/components/HiringPath";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Roles from "@/components/Roles";

export const metadata: Metadata = {
  title: "Careers — senior engineers, hired in the open | Interloid",
  description:
    "Open roles at Interloid for senior React, Ruby on Rails, Python, Node.js, React Native and platform engineers. The whole job description, the hiring process and the salary band on one page.",
};

/* ==========================================================================
   /careers — built 2026-09-07.
   ==========================================================================
   This closes half of HANDOFF §7's P1 "About/Careers pages are linked but do
   not exist". Careers is the half that can be built honestly right now:
   /about cannot, because it needs real people and the review is explicit that
   we do not launch with invented ones. Nothing on this page claims a person
   exists.

   ── HOW IT RELATES TO THE REFERENCE ──────────────────────────────────────
   conversedatasolutions.com/careers was read with Playwright before any of
   this was written. Its structure — hero, three core values, a photo bento,
   a flat list of four openings, a "don't see the perfect fit" slab — is
   documented in site.ts's careers banner along with the two parts we
   deliberately do not reproduce (the invented photography and the
   unfalsifiable values triad). No copy, class or layout is taken from it.

   What this page does instead is turn this site's own client-facing argument
   inward, section by section:

     CareersHero    the promise, plus the four facts that decide whether a
                    senior engineer keeps reading at all
     CandidateOffer the commitment grid — /why-choose-us for applicants
     CareerStack    the tools, grouped by layer rather than scrolled past
     Roles          six roles with the WHOLE description on the page, filtered
                    by discipline, nothing behind a form
     HiringPath     the process section, pointed at hiring, with the
                    counter-list of what we will not do to you
     FirstNinety    the section nobody writes: what months one to three are
     FitCheck       "we tell you when to walk away", addressed to candidates
     CareerFaq      the awkward questions, before the first call
     CtaAnchor      the open application

   ── SECTION GROUNDS ALTERNATE ────────────────────────────────────────────
   secondary → background → secondary → background → secondary → background →
   secondary → background, then the CTA's light band. Each section owns its
   own ground and its own `border-t`; changing one here means changing it in
   the component, not wrapping it.

   ⚠ CLAIM STATUS — READ BEFORE PUBLISHING. The roles, the salary bands, the
   interview timings, the "four things that will never happen", the learning
   budget and the 90-day onboarding are ALL unverified and all carry
   data-placeholder. HANDOFF §7's allowed-claims list covers client
   commitments; it says nothing about how this company hires, so none of it
   transfers. `npm run verify` counts these. A careers page that overstates
   its own process is the same fabricated-proof failure as a fake
   testimonial — aimed at the audience most likely to publish the correction.
   ========================================================================== */
export default function Careers() {
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
        <CareersHero />
        <CandidateOffer />
        <CareerStack />
        <Roles />
        <HiringPath />
        <FirstNinety />
        <FitCheck />
        <CareerFaq />

        {/* The open application. Same slab as home's, different words — every
            prop defaults to home's copy, so this is a parameterisation and not
            a second component (see CtaAnchor's note).

            `id="apply"`, not "contact": the nav and footer both point at
            `/#contact` on HOME, and a duplicate id here would make those
            links ambiguous depending on which page you were on. */}
        <CtaAnchor
          id="apply"
          eyebrow="Open application"
          headline="None of the six"
          accent="is quite you?"
          lead="Send the thing you are proudest of having built and one line on what you want to do next. If there is nothing for you now we will say so — and we will say when there might be."
          cta="Send an open application"
          href="mailto:hello@interloid.com?subject=Open%20application"
          meta={[
            "A written answer either way",
            "No portal, no account",
            "Read by an engineer",
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
