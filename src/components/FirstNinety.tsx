import Icon from "./Icon";
import SectionHeading from "./SectionHeading";
import { FIRST_90 } from "@/content/site";

/* "Your first 90 days" — the section almost no careers page writes.

   It is the most concrete answer available to the question a senior candidate
   is actually asking, which is not "what are your values" but "what will the
   first three months of my life look like". The reference page answers it with
   a photo grid captioned "A collaborative, fast-paced, and incredibly
   rewarding environment"; this answers it with three dated commitments.

   Three cards in a row read as a SEQUENCE, so they get a connecting rail —
   the same idea as Process's connector reduced to its simplest honest form: a
   static gradient hairline behind the row, drawn from the first card's centre
   to the last. It is `hidden lg:block` because in the stacked layout the cards
   are already vertically adjacent and a rail through them would cross their
   text (HANDOFF §5.7 in miniature).

   ⚠ This describes an onboarding that has to exist. Flagged until confirmed. */
export default function FirstNinety() {
  return (
    <section
      id="first-90"
      className="relative overflow-hidden border-t border-border bg-background py-32"
    >
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 size-[520px] translate-y-1/3 rounded-full bg-brand/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Onboarding"
          icon="rocket"
          accent="described in advance."
          lead="Not a promise that you will be “supported” — three dated milestones you can hold your manager to at the end of each one."
        >
          Your first 90 days,
        </SectionHeading>

        <div className="relative" data-placeholder="P1: confirm this onboarding exists as described">
          {/* The rail. Behind the cards (`-z-0` would fall behind the section's
              own background; z-0 here with the cards at z-10 is what actually
              stacks).

              BOTH INSETS ARE DERIVED, NOT EYEBALLED. The first version used
              12.5%/87.5% and measured wrong in both axes — the rail overhung
              each end node by 43px and ran 13px below their centres. Same
              lesson as HANDOFF §5.7: a rail placed by guess is a rail through
              the wrong place at some width.

                x — three columns with a 1.5rem gap, so one column is
                    (100% - 3rem) / 3 and the first node (the cards are
                    lg:items-center) sits at half of that: (100% - 3rem) / 6.
                    Correct at every width, which a percentage is not.
                y — 1px card border + 2rem of p-8 + half of the size-14 node
                    = 1 + 32 + 28 = 61px from the top of the grid. */}
          <div
            className="pointer-events-none absolute left-[calc((100%-3rem)/6)] right-[calc((100%-3rem)/6)] top-[61px] hidden h-px bg-gradient-to-r from-brand/10 via-accent/40 to-brand/10 lg:block"
            aria-hidden="true"
          />

          <ol className="relative z-10 grid gap-6 lg:grid-cols-3">
            {FIRST_90.map((p, i) => (
              <li
                key={p.tag}
                data-reveal
                style={{ "--delay": `${i * 120}ms` } as React.CSSProperties}
                className="h-full"
              >
                <div className="group flex h-full flex-col items-start rounded-[1.5rem] border border-border bg-card p-8 shadow-sm transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg lg:items-center lg:text-center">
                  {/* The node the rail passes through. `border-4 border-card`
                      is what punches the rail out behind it — the same trick
                      Process uses on its 80px node. */}
                  <span className="mb-6 grid size-14 shrink-0 place-items-center rounded-full border-4 border-card bg-accent/10 text-accent-strong shadow-[0_0_0_1px_var(--border)] transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    <Icon
                      name={i === 0 ? "zap" : i === 1 ? "key-round" : "layers"}
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
      </div>
    </section>
  );
}
