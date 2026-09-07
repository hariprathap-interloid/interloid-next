import Advantage from "@/components/Advantage";
import CtaAnchor from "@/components/CtaAnchor";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import PlaceholderToggle from "@/components/PlaceholderToggle";
import Process from "@/components/Process";
import PullQuote from "@/components/PullQuote";
import Reveal from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";
import Work from "@/components/Work";

/* The full page, section order per PROTOTYPE3-BRIEF §2's ledger, MINUS two
   sections moved to /services on 2026-09-08 at the user's request: "What we
   build" (Services, now ServiceExplorer there) and "Technologies we work in"
   (StackMarquee, rendered there unchanged). Home now runs Hero straight into
   Why Interloid.
   Only Nav, Advantage, HeroStage, Reveal and PlaceholderToggle are Client
   Components; everything else ships as HTML with no JavaScript. */
export default function Home() {
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
        <Hero />
        <Advantage />
        <Process />
        <Work />
        <Testimonials />
        <PullQuote />
        <Faq />
        <CtaAnchor />
      </main>
      <Footer />
      <PlaceholderToggle />
    </>
  );
}
