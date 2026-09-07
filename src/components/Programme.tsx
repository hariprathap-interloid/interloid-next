import Icon from "./Icon";
import SectionHeading from "./SectionHeading";
import { PROGRAMME, PROGRAMME_META } from "@/content/site";

/* ==========================================================================
   THE PROGRAMME — the two years, in order.

   Replaces THREE sections from the 2026-09-07 page (the six commitment tiles,
   the grouped stack grid, and "your first 90 days"), which is most of how the
   page got shorter. For a senior hire the interesting question was what the
   company promises; for somebody signing a two-year agreement out of college
   it is what the two years actually contain, in sequence — so a timeline says
   more here than nine tiles did.

   It keeps FirstNinety's rail, including the arithmetic that took two
   measurements to get right:

     x — three columns with a 1.5rem gap, so one column is (100% - 3rem) / 3
         and the first node (cards are lg:items-center) sits at half of that.
         The first version used 12.5% and overhung each end node by 43px.
     y — 1px card border + 2rem of p-8 + half of the size-14 node = 61px.

   `hidden lg:block`: stacked, the cards are already adjacent and a rail
   through them crosses their text (HANDOFF §5.7 in miniature).

   THE HARD PART IS FIRST, ON PURPOSE. Twelve-hour days are the single fact
   most likely to make somebody withdraw, and the cheapest place for them to do
   that is here rather than in month two. Every phase carries its own
   data-placeholder because none of these terms is confirmed — see site.ts's
   TERMS banner, and the note there about the working-hours exposure. */
export default function Programme() {
  return (
    <section
      id="programme"
      className="relative overflow-hidden border-t border-border bg-background py-28"
    >
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 size-[460px] translate-y-1/3 rounded-full bg-brand/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The programme"
          icon="rocket"
          accent="written down before you start."
          lead="Six months of training, then real client work, on a two-year agreement. Here is the whole of it — including the part that will put some people off."
        >
          Two years,
        </SectionHeading>

        <div className="relative">
          <div
            className="pointer-events-none absolute left-[calc((100%-3rem)/6)] right-[calc((100%-3rem)/6)] top-[61px] hidden h-px bg-gradient-to-r from-brand/10 via-accent/40 to-brand/10 lg:block"
            aria-hidden="true"
          />

          <ol className="relative z-10 grid gap-6 lg:grid-cols-3">
            {PROGRAMME.map((p, i) => (
              <li
                key={p.tag}
                data-reveal
                style={{ "--delay": `${i * 120}ms` } as React.CSSProperties}
                className="h-full"
              >
                <div
                  className="group flex h-full flex-col items-start rounded-[1.5rem] border border-border bg-card p-8 shadow-sm transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg lg:items-center lg:text-center"
                  {...(p.ph ? { "data-placeholder": p.ph } : {})}
                >
                  {/* `border-4 border-card` punches the rail out behind the
                      node — the same trick Process uses on its 80px node. */}
                  <span className="mb-6 grid size-14 shrink-0 place-items-center rounded-full border-4 border-card bg-accent/10 text-accent-strong shadow-[0_0_0_1px_var(--border)] transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    <Icon
                      name={i === 0 ? "zap" : i === 1 ? "code" : "user-check"}
                      className="size-6"
                    />
                  </span>
                  <span className="mb-3 rounded-full bg-background px-2.5 py-[3px] text-[11px] font-bold uppercase tracking-[0.08em] text-accent-strong ring-1 ring-border">
                    {p.tag}
                  </span>
                  <h3 className="mb-3 font-display text-xl font-bold leading-[1.35] tracking-[-0.02em] text-foreground">
                    {p.title}
                  </h3>
                  <p className="text-[15px] leading-[1.7] text-muted-strong">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* The plain facts, on one line. This is the block a parent reads, so
            it is unstyled to within an inch of its life on purpose — no card,
            no gradient, just four ticks. */}
        <ul
          data-reveal
          style={{ "--delay": "400ms" } as React.CSSProperties}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-[1.25rem] border border-border bg-secondary px-6 py-5"
        >
          {PROGRAMME_META.map((m) => (
            <li
              key={m.label}
              className="flex items-center gap-2 text-[15px] font-medium text-foreground"
              {...(m.ph ? { "data-placeholder": m.ph } : {})}
            >
              <span className="text-teal-600" aria-hidden="true">
                <Icon name={m.k} className="size-4" />
              </span>
              {m.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
