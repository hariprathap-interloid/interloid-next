import SectionHeading from "./SectionHeading";
import { PULL_QUOTE, QUOTES } from "@/content/site";

/* DS §8.3 — client feedback, converted from prototype/ (hand-CSS → tokens).

   ⚠ EVERY QUOTE HERE IS A PLACEHOLDER AND MUST NOT SHIP AS-IS.
   HANDOFF §7 P0: this is the same bucket as the case studies. A testimonials
   block showing "Placeholder Name · VP Product, Placeholder Co" is worse than
   having no testimonials — an empty space reads as an early company, a visibly
   fake quote reads as a company that fabricates proof, which is precisely the
   review's core finding. The section exists so the design is settled and the
   real quotes can be dropped in; it is flagged so it cannot ship by accident.

   Card design is prototype 1's `.quote`: a large quote mark, the quote at
   17px/1.7, and the attribution pinned to the bottom (mt-auto) with a
   gradient initials avatar so cards of different lengths still line up. */
export default function Testimonials() {
  return (
    <section
      id="feedback"
      className="relative overflow-hidden border-t border-border bg-background py-32"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Client feedback"
          icon="quote"
          accent="work with us."
        >
          What it&rsquo;s like to
        </SectionHeading>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {QUOTES.map((q, i) => (
            <figure
              key={i}
              data-reveal
              style={{ "--delay": `${i * 100}ms` } as React.CSSProperties}
              data-placeholder="P0 TRUST: collect 2-3 real testimonials with written permission"
              className="flex h-full flex-col rounded-3xl border border-border bg-card p-8 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <span className="mb-4 text-faint" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-8">
                  <path d="M9.5 4C6.5 6 5 8.7 5 12v8h7v-8H8.3c0-2.4.9-4.2 2.7-5.4L9.5 4Zm9 0c-3 2-4.5 4.7-4.5 8v8h7v-8h-3.7c0-2.4.9-4.2 2.7-5.4L18.5 4Z" />
                </svg>
              </span>
              <blockquote className="mb-8 text-[17px] leading-[1.7] text-foreground">
                {q.q}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3.5">
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-accent font-display text-[15px] font-bold text-white"
                  aria-hidden="true"
                >
                  {q.i}
                </span>
                <span>
                  <strong className="block text-[15px] font-semibold text-foreground">
                    {q.n}
                  </strong>
                  <span className="text-[13px] text-muted-foreground">{q.r}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* The pull-quote, from prototype2-archive. One line, given room —
            it does a different job from the card grid: the grid is evidence,
            this is a single sentence you are meant to remember. */}
        <figure
          data-reveal
          style={{ "--delay": "300ms" } as React.CSSProperties}
          data-placeholder="P0 TRUST: replace with a real, permissioned quote"
          className="mx-auto mt-20 max-w-3xl text-center"
        >
          <span
            className="mx-auto mb-6 block font-display text-6xl leading-none text-faint"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <blockquote className="font-display text-2xl font-medium leading-snug tracking-tight text-foreground md:text-3xl">
            {PULL_QUOTE.q}
          </blockquote>
          <figcaption className="mt-6 text-sm text-muted-foreground">
            {PULL_QUOTE.who}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
