import Icon from "./Icon";
import SectionHeading from "./SectionHeading";
import { STEPS } from "@/content/site";

/* DS §8.9. The connector draws itself on reveal ([data-rail]), and a ghost
   numeral sits behind each node.

   HANDOFF §5.7: a full-height centred rail draws straight through centred
   text, so the rail is offset — left-[39px] stacked, top-[44px] horizontal —
   to run through the NODES rather than the copy. Server Component. */
export default function Process() {
  return (
    <section
      id="process"
      className="relative overflow-hidden border-t border-border bg-background py-32"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Badge converted to prototype 1's form (icon + sentence case).
            The headline stays "code you own" rather than prototype 1's
            "production": production is table stakes, ownership is the
            differentiator. Intro line is prototype 1's — the current section
            had none, and it earns its place by naming the two things a buyer
            actually worries about. */}
        <SectionHeading
          eyebrow="How we work"
          icon="clock"
          accent="code you own."
          lead="Every step is timeboxed and written down. You always know what happens next and what it costs."
        >
          From first call to
        </SectionHeading>

        <div className="relative mt-20">
          <div
            className="absolute left-[39px] top-0 hidden h-full w-[2px] bg-border max-lg:block lg:left-[5%] lg:right-[5%] lg:top-[44px] lg:block lg:h-[2px] lg:w-auto"
            aria-hidden="true"
          />
          <div
            data-rail
            className="absolute left-[39px] top-0 hidden h-full w-[2px] bg-gradient-to-b from-brand via-accent to-brand-light max-lg:block lg:left-[5%] lg:right-[5%] lg:top-[44px] lg:block lg:h-[2px] lg:w-auto lg:bg-gradient-to-r"
            aria-hidden="true"
          />
          <ol className="relative z-10 flex flex-col justify-between gap-12 lg:flex-row lg:gap-6">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                data-reveal
                style={{ "--delay": `${i * 120}ms` } as React.CSSProperties}
                className="group relative flex w-full flex-row items-start lg:w-1/4 lg:flex-col lg:items-center"
              >
                <div className="relative flex shrink-0 items-center justify-center">
                  <div className="relative z-10 grid size-[80px] place-items-center rounded-full border-4 border-card bg-card shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_-5px_rgba(31,93,160,.35)]">
                    <div className="grid size-14 place-items-center rounded-full bg-brand/10 text-brand ring-1 ring-brand/15">
                      <Icon name={s.k} className="size-6" />
                    </div>
                  </div>
                  <div
                    className="pointer-events-none absolute -right-4 -top-6 z-0 select-none font-display text-[60px] font-bold text-faint/40 transition-colors group-hover:text-primary/10 lg:-right-8 lg:-top-8 lg:text-[80px]"
                    aria-hidden="true"
                  >
                    {s.n}
                  </div>
                </div>
                <div className="ml-8 flex flex-col items-start pt-2 text-left lg:ml-0 lg:mt-10 lg:items-center lg:text-center">
                  <span /* `.step__time`: Inter (NOT mono), .1875rem/.625rem padding,
                     .08em tracking, on the page ground rather than muted. */
                  className="mb-2 rounded-full bg-background px-2.5 py-[3px] text-[11px] font-bold uppercase tracking-[0.08em] text-accent-strong ring-1 ring-border">
                    {s.when}
                  </span>
                  <h3 /* `.h-card`: 1.25rem/700/1.25 at every width — it does not step up. */
                  className="mb-3 font-display text-xl font-bold leading-[1.5] tracking-[-0.025em] text-foreground transition-colors group-hover:text-primary">
                    {s.title}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground lg:text-sm xl:text-base">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
