import Icon from "./Icon";
import SectionHeading from "./SectionHeading";
import TechIcon from "./TechIcon";
import { HUE, ROLES, TERMS } from "@/content/site";

/* ==========================================================================
   OPEN ROLES — four trainee positions.

   ── REWRITTEN 2026-09-08, AND IT IS NOW A SERVER COMPONENT ───────────────
   The senior version was a client component: a discipline filter over six
   roles, plus a disclosure that opened the full job description in place.
   Both are gone, and both for the same reason — four roles do not need them.
   A filter over four items is a control that costs a click and saves nothing,
   and once the terms live in PROGRAMME there is no per-role description long
   enough to be worth hiding. Removing `useState` removed the whole client
   bundle for this section, and with it every one of the Reveal-vs-React
   `className` hazards the old banner had to warn about. Simpler page, less
   JavaScript, same information.

   ── THE STACK IS ICONS, NOT WORDS ────────────────────────────────────────
   On request. `tech` in site.ts holds TechIcon keys, and each mark carries its
   own accessible name and a hover tooltip — see TechIcon.tsx, which is also
   where the note lives about why brand marks are not in Icon.tsx.

   The chips are `bg-white` in BOTH themes, deliberately: brand colours are
   fixed hexes, and several of them (Node's green, Postgres blue) fall below
   readable contrast on the dark card. A constant light plate is what keeps a
   mark looking like itself in either theme.

   NO SALARY ON THE CARD. Every role here has identical terms, so they live in
   TERMS and are stated once, in PROGRAMME. Repeating them per card would be
   four places to correct instead of one — and these are the numbers most
   likely to change.

   ⚠ Whether these four are open is unverified; the grid is data-placeholder.
   ========================================================================== */
export default function Roles() {
  return (
    <section
      id="openings"
      className="relative overflow-hidden border-t border-border bg-background py-28"
    >
      <div
        className="pointer-events-none absolute left-0 top-1/3 size-[460px] -translate-x-1/3 rounded-full bg-accent/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Open roles"
          icon="search"
          accent="one stack each."
          lead={`Four trainee positions, ${TERMS.mode.toLowerCase()} in ${TERMS.location}. You pick the stack you want to learn; the terms are the same for all four.`}
        >
          Four ways in,
        </SectionHeading>

        <ul
          className="grid gap-6 md:grid-cols-2"
          data-placeholder="P1: confirm these four roles are open before publishing"
        >
          {ROLES.map((r, i) => {
            const h = HUE[r.hue];
            return (
              <li
                key={r.id}
                data-reveal
                style={{ "--delay": `${i * 80}ms` } as React.CSSProperties}
                className="h-full"
              >
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border bg-card p-8 shadow-sm transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg">
                  {/* Whole class string out of HUE — never `bg-${hue}/10`
                      (CLAUDE.md gotcha 1: a concatenated class is dropped
                      silently by the compiled build). */}
                  <div
                    className={`pointer-events-none absolute -right-16 -top-16 size-40 rounded-full opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-100 ${h.glow}`}
                    aria-hidden="true"
                  />

                  <span
                    className={`relative mb-4 w-fit rounded-full px-2.5 py-[3px] text-[11px] font-bold uppercase tracking-[0.08em] ring-1 ${h.soft} ${h.ring} ${h.text}`}
                  >
                    {r.track}
                  </span>

                  <h3 className="relative mb-3 font-display text-xl font-bold leading-[1.35] tracking-[-0.02em] text-foreground">
                    {r.title}
                  </h3>
                  <p className="relative mb-6 text-[15px] leading-[1.7] text-muted-strong">
                    {r.summary}
                  </p>

                  <ul className="relative mb-6 space-y-2.5">
                    {r.look.map((l) => (
                      <li
                        key={l}
                        className="flex gap-2.5 text-[14px] leading-[1.6] text-muted-foreground"
                      >
                        <span className="mt-0.5 shrink-0 text-accent-strong">
                          <Icon name="check" className="size-4" />
                        </span>
                        {l}
                      </li>
                    ))}
                  </ul>

                  {/* mt-auto pins this row to the bottom of every card, so the
                      marks line up across a row whose summaries differ in
                      length. Without it the grid reads as ragged. */}
                  <div className="relative mt-auto flex items-center justify-between gap-4 border-t border-hairline pt-6">
                    <ul className="flex items-center gap-2">
                      {r.tech.map((t) => (
                        <li
                          key={t}
                          className="grid size-9 place-items-center rounded-xl bg-white ring-1 ring-border"
                        >
                          <TechIcon name={t} className="size-5" />
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`mailto:hello@interloid.com?subject=${encodeURIComponent(
                        `Application — ${r.title}`,
                      )}`}
                      className="group/btn inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-brand-light active:scale-95"
                    >
                      Apply
                      <span className="transition-transform group-hover/btn:translate-x-1">
                        <Icon name="arrow" className="size-4" />
                      </span>
                    </a>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        {/* SENIOR HIRING, STATED RATHER THAN IMPLIED. The senior set is parked
            in site.ts as SENIOR_ROLES and rendered nowhere — this line is what
            replaces it. Saying "not right now" is worth more than silence: a
            senior reader who finds only trainee roles otherwise concludes we
            do not employ seniors, which contradicts every client page. */}
        <p
          data-reveal
          style={{ "--delay": "360ms" } as React.CSSProperties}
          className="mt-8 flex flex-wrap items-center gap-2 rounded-[1.25rem] border border-dashed border-border px-6 py-5 text-[15px] leading-[1.7] text-muted-foreground"
        >
          <span className="text-accent-strong">
            <Icon name="clock" className="size-4" />
          </span>
          Hiring experienced or senior engineers is closed at the moment. When
          it reopens it will be posted here first —{" "}
          <a
            href="mailto:hello@interloid.com?subject=Tell%20me%20when%20senior%20roles%20open"
            className="font-semibold text-primary underline underline-offset-4"
          >
            {/* The full stop lives INSIDE the anchor's line, not on its own.
                JSX turns a newline between `</a>` and `.` into a space, which
                renders as "tell you when ." — visible at any size. */}
            ask us to tell you when
          </a>
          {"."}
        </p>
      </div>
    </section>
  );
}
