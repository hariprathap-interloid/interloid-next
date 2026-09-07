"use client";

import { useState } from "react";
import Icon from "./Icon";
import SectionHeading from "./SectionHeading";
import { HUE, ROLES } from "@/content/site";

/* ==========================================================================
   OPEN ROLES — the filterable, expandable list.

   The reference page renders four openings as a flat stack of rows: title,
   three grey chips, "Apply Now". Everything a senior engineer actually wants
   before applying — what they would ship, what is expected, what it pays — is
   behind a click into a form. That is the thing to beat, and beating it is not
   a styling exercise: the whole job description lives ON this page, one
   disclosure away, so a candidate can read all six roles without navigating.

   ── TWO GOTCHAS ARE LOAD-BEARING HERE ────────────────────────────────────

   1. FILTERING MUST NOT UNMOUNT A CARD. Reveal.tsx observes [data-reveal]
      ONCE, on mount. A card created later by a filter change would never be
      observed, so it would sit at `opacity: 0` forever — a filter that makes
      results vanish is a spectacular way to fail. So every role is always
      mounted and non-matching ones are hidden with `hidden` on an INNER
      wrapper. `display: none` also takes them out of the a11y tree and the tab
      order, which is what a filter should do anyway.

   2. THE data-reveal ELEMENT'S className NEVER CHANGES. React owns className
      and rewrites the whole attribute on any state change, wiping the `is-in`
      that Reveal.tsx added directly to the DOM (see Faq.tsx's note — a card
      that expanded but turned invisible). Hence three elements per role:
        <li data-reveal>  static class, reveals
          <div>           toggles `hidden` for the filter
            <article>     carries every open/closed and hover class
      Do not collapse these back into one.

   ⚠ Whether these roles are open, and what they pay, is unverified — the
   list and every band are data-placeholder. See site.ts's ROLES banner.
   ========================================================================== */

const ALL = "All roles";

/* Derived from the data, not a second hand-kept list: a role with a new
   discipline grows a chip on its own, in order of first appearance in ROLES.

   Computed once at MODULE scope, not in a useMemo. ROLES is a frozen module
   constant, so this depends on nothing that can change between renders — and
   `useMemo(disciplineChips, [])` is a lint error under react-hooks anyway
   (the first argument has to be an inline function expression). */
const CHIPS = (() => {
  const seen: string[] = [];
  for (const r of ROLES) {
    for (const d of r.disciplines) if (!seen.includes(d)) seen.push(d);
  }
  return [ALL, ...seen];
})();

export default function Roles() {
  const [filter, setFilter] = useState<string>(ALL);
  const [open, setOpen] = useState<string | null>(null);

  const matches = (r: (typeof ROLES)[number]) =>
    filter === ALL || (r.disciplines as readonly string[]).includes(filter);
  const count = ROLES.filter(matches).length;

  return (
    <section
      id="openings"
      className="relative overflow-hidden border-t border-border bg-background py-32"
    >
      <div
        className="pointer-events-none absolute left-0 top-1/3 size-[520px] -translate-x-1/3 rounded-full bg-accent/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Open roles"
          icon="search"
          accent="not a teaser."
          lead="The whole job description is on this page — what you would ship, what we look for, the stack and the band. Nothing is behind a form, because a form is a strange thing to ask for before you have told somebody what the job is."
        >
          Six roles, whole,
        </SectionHeading>

        {/* ---- filter -------------------------------------------------------
            A toolbar of toggle buttons, not a <select>: six options is under
            the threshold where a menu helps, and buttons keep the whole set
            visible so a candidate can see we hire outside their discipline.
            aria-pressed carries the state; the count below is a live region so
            a screen-reader user hears the result of pressing one. */}
        <div
          role="group"
          aria-label="Filter roles by discipline"
          className="mb-4 flex flex-wrap gap-2"
        >
          {CHIPS.map((c) => {
            const on = filter === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-200 ${
                  on
                    ? "border-transparent bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "border-border bg-card text-muted-foreground hover:border-accent/40 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="mb-10 text-sm text-muted-foreground">
          Showing {count} {count === 1 ? "role" : "roles"}
          {filter === ALL ? "" : ` in ${filter}`}.
        </p>

        <ul className="flex flex-col">
          {ROLES.map((r, i) => {
            const h = HUE[r.hue];
            const isOpen = open === r.id;
            const shown = matches(r);
            return (
              /* 1 — reveals. Static className, forever. */
              <li
                key={r.id}
                data-reveal
                style={{ "--delay": `${i * 70}ms` } as React.CSSProperties}
              >
                {/* 2 — filtered. `hidden`, not unmounted (see banner). The
                    bottom padding lives here so a hidden row contributes no
                    gap; a `gap` on the <ul> would space the empties too. */}
                <div className={shown ? "pb-5" : "hidden"}>
                  {/* 3 — stateful. Every class that changes is on this node. */}
                  <article
                    className={`overflow-hidden rounded-[1.5rem] border bg-card transition-[border-color,box-shadow] duration-300 ease-out ${
                      isOpen
                        ? "border-accent/40 shadow-lg ring-1 ring-accent/10"
                        : "border-border shadow-sm hover:border-accent/30 hover:shadow-md"
                    }`}
                  >
                    <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          {r.disciplines.map((d) => (
                            <span
                              key={d}
                              className={`rounded-full px-2.5 py-[3px] text-[11px] font-bold uppercase tracking-[0.08em] ring-1 ${h.soft} ${h.ring} ${h.text}`}
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-display text-2xl font-bold leading-[1.25] tracking-[-0.02em] text-foreground">
                          {r.title}
                        </h3>
                        <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-muted-strong">
                          {r.summary}
                        </p>

                        {/* The meta row. The band is the reason this row
                            exists: a posted number is the single biggest
                            reducer of wasted screening on both sides — and the
                            single worst thing to get wrong, hence the flag. */}
                        <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground">
                          <li className="flex items-center gap-1.5">
                            <Icon
                              name="user-check"
                              className="size-4 text-accent-strong"
                            />
                            {r.seniority}
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Icon
                              name="clock"
                              className="size-4 text-accent-strong"
                            />
                            {r.type}
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Icon
                              name="layers"
                              className="size-4 text-accent-strong"
                            />
                            {r.mode}
                          </li>
                          <li
                            className="flex items-center gap-1.5 font-semibold text-foreground"
                            data-placeholder="P1: confirm the real salary band"
                          >
                            <Icon
                              name="receipt"
                              className="size-4 text-accent-strong"
                            />
                            {r.pay}
                          </li>
                        </ul>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={`role-${r.id}`}
                          onClick={() => setOpen(isOpen ? null : r.id)}
                          className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:border-accent/40"
                        >
                          {isOpen ? "Hide details" : "Read the whole role"}
                          <span
                            className={`transition-transform duration-300 ${
                              isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
                            }`}
                          >
                            <Icon name="chevron" className="size-4" />
                          </span>
                        </button>
                        <a
                          href={`mailto:hello@interloid.com?subject=${encodeURIComponent(
                            `Application — ${r.title}`,
                          )}`}
                          className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-brand-light active:scale-95"
                        >
                          Apply
                          <span className="transition-transform group-hover:translate-x-1">
                            <Icon name="arrow" className="size-4" />
                          </span>
                        </a>
                      </div>
                    </div>

                    {/* grid-rows 0fr → 1fr, the same disclosure Faq uses:
                        it animates to the content's real height, where a
                        max-height needs a magic number that is wrong for
                        every panel. `invisible` is on the row as well as the
                        height — a zero-height panel still keeps its links in
                        the tab order otherwise (HANDOFF §5.4). */}
                    <div
                      id={`role-${r.id}`}
                      role="region"
                      aria-label={`${r.title} — full description`}
                      className={`grid transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)] ${
                        isOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-border px-6 pb-8 pt-8 sm:px-8">
                          <div className="grid gap-8 lg:grid-cols-2">
                            <div>
                              <h4 className="mb-4 flex items-center gap-2 font-display text-[13px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                                <Icon
                                  name="rocket"
                                  className="size-4 text-accent-strong"
                                />
                                What you would ship
                              </h4>
                              <ul className="space-y-3">
                                {r.ship.map((s) => (
                                  <li
                                    key={s}
                                    className="flex gap-3 text-[15px] leading-[1.7] text-muted-strong"
                                  >
                                    <span
                                      className={`mt-[7px] size-1.5 shrink-0 rounded-full ${h.tile}`}
                                      aria-hidden="true"
                                    />
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="mb-4 flex items-center gap-2 font-display text-[13px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                                <Icon
                                  name="search"
                                  className="size-4 text-accent-strong"
                                />
                                What we look for
                              </h4>
                              <ul className="space-y-3">
                                {r.look.map((s) => (
                                  <li
                                    key={s}
                                    className="flex gap-3 text-[15px] leading-[1.7] text-muted-strong"
                                  >
                                    <span className="mt-0.5 shrink-0 text-accent-strong">
                                      <Icon name="check" className="size-4" />
                                    </span>
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-hairline pt-6">
                            <span className="mr-1 text-[13px] font-semibold text-muted-foreground">
                              Stack
                            </span>
                            {r.stack.map((s) => (
                              <span
                                key={s}
                                className="rounded-full bg-muted px-3 py-1.5 text-[13px] font-medium text-muted-strong"
                              >
                                {s}
                              </span>
                            ))}
                          </div>

                          {/* The line the reference page's "Apply Now" button
                              cannot say, because it opens a form instead. */}
                          <p className="mt-6 text-[13px] leading-[1.7] text-muted-foreground">
                            Not a match on every line? Apply anyway and tell us
                            which line — that answer is the one we read first.
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Unreachable with the data as it stands — every discipline chip is
            derived from a role, so no chip can select zero. It is here because
            the chips are derived and the roles are not: delete a role and this
            is what stands between a candidate and an empty page. */}
        {count === 0 && (
          <p className="rounded-[1.5rem] border border-dashed border-border p-10 text-center text-muted-foreground">
            Nothing open in {filter} right now.{" "}
            <button
              type="button"
              onClick={() => setFilter(ALL)}
              className="font-semibold text-primary underline underline-offset-4"
            >
              Show every role
            </button>
            .
          </p>
        )}
      </div>
    </section>
  );
}
