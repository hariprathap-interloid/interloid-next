import SectionHeading from "./SectionHeading";
import { CLAUSES } from "@/content/site";

/* The working agreement, ported from prototype2-archive's `.doc` / `.clause`.

   ── IT IS SHAPED LIKE A DOCUMENT ON PURPOSE ───────────────────────────────
   This is the one block on the site that is not a card grid, and that is the
   argument rather than a style choice: the page's claim is "we put it in the
   contract", so the block is built to look like the contract — one bordered
   sheet, a titled head, numbered clauses divided by rules, and a foot with the
   legal entity on it. Five separate rounded cards would have said "five
   features". A sheet says "one document".

   Each clause is `clause id | body | figure`, and the figure is the number a
   skimmer takes away (100%, 48 hrs, 30 days). At `lg` it sits in its own
   column on the right; below that it drops under the prose rather than
   shrinking, because a 48px numeral in a squeezed column stops being a figure
   and becomes an orphan.

   ⚠ The foot line is HANDOFF §7 P1 and is flagged. See the note over CLAUSES
   in site.ts before touching it. */
export default function Clauses() {
  return (
    <section
      id="agreement"
      className="relative overflow-hidden border-t border-border bg-background py-32"
    >
      <div
        className="pointer-events-none absolute right-0 top-0 size-[520px] -translate-y-1/3 translate-x-1/3 rounded-full bg-accent/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The commitments"
          icon="doc"
          accent="in plain language."
          lead="Five clauses that shape every engagement. The contract version says the same things with more commas."
        >
          The working agreement,
        </SectionHeading>

        <div
          data-reveal
          className="mx-auto max-w-[56rem] overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-sm"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border bg-secondary px-6 py-5 sm:px-8">
            <h3 className="font-display text-[17px] font-bold tracking-[-0.015em] text-foreground">
              Working agreement &mdash; summary of terms
            </h3>
            <span className="text-[13px] text-muted-foreground">
              Applies to every engagement
            </span>
          </div>

          {CLAUSES.map((c) => (
            <article
              key={c.n}
              /* `last:border-b-0` rather than a divider utility on the parent:
                 the head and foot are also bordered, and a `divide-y` would
                 have doubled up against both. */
              className="grid gap-x-8 gap-y-4 border-b border-border px-6 py-8 last:border-b-0 sm:px-8 lg:grid-cols-[9rem_1fr_9rem]"
            >
              <span className="flex flex-col gap-0.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Clause {c.n}
                </span>
                <span className="font-display text-[15px] font-bold text-accent-strong">
                  {c.label}
                </span>
              </span>

              <div>
                <h4 className="mb-2 font-display text-lg font-bold leading-[1.4] tracking-[-0.015em] text-foreground">
                  {c.title}
                </h4>
                <p className="leading-[1.7] text-muted-foreground">{c.body}</p>
              </div>

              {/* aria-hidden: the figure restates the prose beside it, so a
                  screen reader would hear "48 hrs to a written price" twice. */}
              <div
                className="flex flex-col gap-0.5 lg:items-end lg:text-right"
                aria-hidden="true"
              >
                <strong className="font-display text-2xl font-bold leading-none tracking-[-0.02em] text-foreground">
                  {c.figure}
                </strong>
                <span className="text-[13px] text-muted-foreground">
                  {c.caption}
                </span>
              </div>
            </article>
          ))}

          <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-border bg-secondary px-6 py-5 text-[13px] text-muted-foreground sm:px-8">
            <span data-placeholder="P1: verify the engagement contract actually carries these clauses">
              <strong className="font-semibold text-foreground">
                Interloid Technologies Private Limited
              </strong>{" "}
              &mdash; these clauses are carried into every engagement agreement.
            </span>
            <span>India-based &middot; US &amp; UK overlap hours</span>
          </div>
        </div>
      </div>
    </section>
  );
}
