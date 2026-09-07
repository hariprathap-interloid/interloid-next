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
import Services from "@/components/Services";
import StackMarquee from "@/components/StackMarquee";
import Testimonials from "@/components/Testimonials";
import Work from "@/components/Work";

/* The full page, section order per PROTOTYPE3-BRIEF §2's ledger.
   Only Nav, Services, Advantage, HeroStage, Reveal and PlaceholderToggle are
   Client Components; everything else ships as HTML with no JavaScript. */
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
        <Services />
        <StackMarquee />
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
