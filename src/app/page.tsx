import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";

/* Sections 02-08 (services, stack marquee, advantage bento, process, work,
   CTA anchor, footer) are still to port from prototype3/index.html — see
   HANDOFF §6 item 4. Nav + hero go first on purpose: they front-load the only
   order-dependent risk in the port, which is the WebGL mark against the
   FCP 364ms budget (§4a). */
export default function Home() {
  return (
    <>
      <Reveal />
      <Nav />
      <main id="main">
        <Hero />
      </main>
    </>
  );
}
