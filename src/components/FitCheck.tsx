import Icon from "./Icon";
import SectionHeading from "./SectionHeading";
import { FIT_NO, FIT_YES } from "@/content/site";

/* "Read this before you apply" — the two honest lists.

   This is the page's version of the commitment the home page makes to clients:
   "we tell you when to walk away". Turning it on candidates is the reason
   /careers does not need a values section — a list of the people who should
   NOT apply says more about how a place works than any adjective, and it is
   the only claim on a careers page that costs the company something to make.

   ── IT MATTERS MORE ON THE FRESHER PAGE (2026-09-08) ─────────────────────
   The right-hand list now names the three things somebody could sign a
   two-year agreement without having properly registered: it is on site with no
   remote option, it is two years, and year one is ₹10,000 a month. A candidate
   who withdraws at this section has cost everybody nothing. One who withdraws
   in month three has cost themselves a year and us a training place. This is
   the cheapest possible place for that decision, which is why the section is
   BEFORE the FAQ rather than tucked after it.

   The two columns are NOT symmetric objects. The left one is the invitation
   and is styled like every other card on the site; the right one sits on the
   page ground with a dashed border, because it is a warning and should not
   look like a second sales pitch. Same weight of type, different object.

   ⚠ The right-hand list RESTATES TERMS (₹10,000, two years, on site), so
   unlike the 2026-09-07 version it is not claim-free — it is flagged, and it
   must be corrected in the same pass as TERMS in site.ts if any of them
   change. The left-hand list is dispositions only and needs no flag. */
export default function FitCheck() {
  return (
    <section
      id="fit"
      className="relative overflow-hidden border-t border-border bg-secondary py-28"
    >
      <div
        className="pointer-events-none absolute left-0 top-0 size-[480px] -translate-x-1/3 -translate-y-1/4 rounded-full bg-brand/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Before you apply"
          icon="split"
          accent="talk you out of it."
          lead="We tell clients on the first call when they should hire somebody else. It would be strange to be less honest with somebody about to give us two years."
          className="max-w-2xl"
        >
          The part where we try to
        </SectionHeading>

        <div className="grid gap-6 lg:grid-cols-2">
          <div data-reveal className="h-full">
            <div className="flex h-full flex-col rounded-[1.5rem] border border-border bg-card p-8 shadow-sm sm:p-10">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-teal-600/10 text-teal-600 ring-1 ring-teal-600/15">
                  <Icon name="check" className="size-5" />
                </span>
                <h3 className="font-display text-xl font-bold leading-[1.35] tracking-[-0.02em] text-foreground">
                  You will do well here if…
                </h3>
              </div>
              <ul className="space-y-4">
                {FIT_YES.map((f) => (
                  <li
                    key={f}
                    className="flex gap-3 text-[15px] leading-[1.7] text-muted-strong"
                  >
                    <span className="mt-0.5 shrink-0 text-teal-600">
                      <Icon name="check" className="size-4" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            data-reveal
            style={{ "--delay": "120ms" } as React.CSSProperties}
            className="h-full"
          >
            <div className="flex h-full flex-col rounded-[1.5rem] border border-dashed border-border bg-background p-8 sm:p-10">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-muted text-muted-strong ring-1 ring-border">
                  <Icon name="split" className="size-5" />
                </span>
                <h3 className="font-display text-xl font-bold leading-[1.35] tracking-[-0.02em] text-foreground">
                  You will not, if…
                </h3>
              </div>
              <ul
                className="space-y-4"
                data-placeholder="P1: these restate the terms — keep in step with TERMS"
              >
                {FIT_NO.map((f) => (
                  <li
                    key={f}
                    className="flex gap-3 text-[15px] leading-[1.7] text-muted-strong"
                  >
                    {/* An em-dash rule, not a cross. A cross reads as "wrong
                        person"; these are preferences, and several of them are
                        perfectly reasonable things to want elsewhere. */}
                    <span
                      className="mt-[13px] h-px w-3 shrink-0 bg-muted-foreground"
                      aria-hidden="true"
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t border-border pt-6 text-[13px] leading-[1.7] text-muted-foreground">
                None of these are character flaws — they describe a different
                job, and there are good ones. Deciding here costs you five
                minutes. Deciding in month three costs you a year.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
