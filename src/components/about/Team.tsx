import Icon from "../Icon";
import SectionHeading from "../SectionHeading";
import { HUE } from "@/content/site";
import { TEAM, TEAM_OPEN } from "@/content/about";

/* ==========================================================================
   THE ROSTER — this site's answer to the reference page's "Meet the Squad".
   ==========================================================================
   Requested directly on 2026-09-08, after the constraint had been flagged
   twice. CLAUDE.md §8: flag once, then build and mark it. This is the build.

   ── ROLE-FIRST, NOT NAME-FIRST, AND THAT IS THE DESIGN ───────────────────
   The reference card is photograph → name → job title: the person is the
   headline and the role is the caption. This one inverts it. The ROLE is the
   headline, `owns` is the substance, and the name is a single line underneath.

   That is not a workaround for having no names. It is the more useful
   hierarchy for a buyer, who is asking "is there someone here who owns
   mobile?" long before they are asking anyone's name — and it is the same
   inversion the /careers summary strip made when it went figure-over-label.
   It also means the section reads correctly in both states: filling the names
   in later changes one line per card and nothing else.

   ── `name: null` RENDERS AS THE PROMISE, NOT AS A BLANK ──────────────────
   Every seat is nameless today, and the slot says "Named in your proposal" —
   which is true, and is the commitment the section three above already makes.
   The alternative was to invent seven people; see content/about.ts's TEAM
   banner for why that is worse here than the placeholder testimonials already
   in the codebase. When real names land in the content file the chip
   disappears on its own.

   ── NO PHOTOGRAPHS, AND NO PLACEHOLDER FOR ONE EITHER ────────────────────
   There is no grey avatar circle and no silhouette. An empty photo frame
   advertises the absence and looks broken; a discipline glyph on a hue plate
   is a deliberate design that happens not to need a face. The hue is the same
   categorical system as everywhere else on the site (DS §2.3, one hue per
   category, reused wherever that category appears).

   HOVER SIGNATURE — a left edge bar grows top to bottom. Distinct from every
   other section on the site (careers: hue flood / node ignite / numeral
   brighten / cascade; about: tile fill / row light / ground warm) and, like
   all of them, it animates a child rather than the card: `height` on an
   absolutely-positioned span cannot alter the card's own bounds, so it cannot
   re-enter the flicker loop WorkCard.tsx documents. */
export default function Team() {
  return (
    <section
      id="team"
      className="relative overflow-hidden border-t border-border bg-secondary py-28"
    >
      <div
        className="pointer-events-none absolute right-0 top-1/4 size-[520px] translate-x-1/3 rounded-full bg-brand/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The roster"
          icon="users"
          accent="and what each of them owns."
          lead="The seats, mapped to the work we actually publish on the services page. The names are in your proposal rather than on this page — the section above says why."
          className="mb-16 max-w-2xl"
        >
          Who is in the room,
        </SectionHeading>

        <ul
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          data-placeholder="P1: confirm which of these seats actually exist — a roster is a headcount claim"
        >
          {TEAM.map((m, i) => {
            const h = HUE[m.hue];
            return (
              <li
                key={m.role}
                data-reveal
                style={{ "--delay": `${i * 70}ms` } as React.CSSProperties}
                className="h-full"
              >
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-border bg-card p-6 shadow-sm transition-[border-color,box-shadow] duration-300 ease-out hover:border-accent/40 hover:shadow-lg">
                  {/* The signature. `h-0 → h-full` on an absolutely
                      positioned child — the card's own box never changes. */}
                  <span
                    className={`pointer-events-none absolute bottom-0 left-0 top-0 my-auto h-0 w-[3px] transition-[height] duration-500 ease-out group-hover:h-full ${h.tile}`}
                    aria-hidden="true"
                  />

                  {/* Whole class strings out of HUE — never built by
                      concatenation (CLAUDE.md gotcha 1). */}
                  <span
                    className={`mb-5 grid size-12 place-items-center rounded-2xl ring-1 transition-[background-color,color] duration-300 ease-out group-hover:text-white ${h.soft} ${h.ring} ${h.text} ${h.solidHover}`}
                  >
                    <Icon name={m.k} className="size-6" />
                  </span>

                  <h3 className="mb-2 font-display text-[17px] font-bold leading-[1.35] tracking-[-0.015em] text-foreground">
                    {m.role}
                  </h3>
                  <p className="mb-5 text-[14px] leading-[1.65] text-muted-strong">
                    {m.owns}
                  </p>

                  {/* mt-auto keeps the name line on the baseline across a row
                      whose `owns` copy differs in length. */}
                  <p className="mt-auto border-t border-hairline pt-4 text-[13px] leading-[1.5]">
                    {m.name ? (
                      <span className="font-semibold text-foreground">{m.name}</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <Icon name="doc" className="size-3.5 text-accent-strong" />
                        Named in your proposal
                      </span>
                    )}
                  </p>
                </article>
              </li>
            );
          })}

          {/* The eighth card, and it is a different OBJECT: dashed, on the
              page ground rather than a card surface, so it reads as a gap in
              the roster rather than as an eighth colleague. */}
          <li
            data-reveal
            style={{ "--delay": `${TEAM.length * 70}ms` } as React.CSSProperties}
            className="h-full"
          >
            <a
              href={TEAM_OPEN.href}
              className="group flex h-full flex-col rounded-[1.25rem] border border-dashed border-border bg-background p-6 transition-[border-color,background-color] duration-300 ease-out hover:border-accent/50 hover:bg-card"
            >
              <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-muted text-muted-strong ring-1 ring-border transition-[background-color,color] duration-300 ease-out group-hover:bg-accent group-hover:text-white">
                <Icon name="users" className="size-6" />
              </span>
              <h3 className="mb-2 font-display text-[17px] font-bold leading-[1.35] tracking-[-0.015em] text-foreground">
                {TEAM_OPEN.title}
              </h3>
              <p className="mb-5 text-[14px] leading-[1.65] text-muted-strong">
                {TEAM_OPEN.body}
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 border-t border-hairline pt-4 text-[13px] font-semibold text-primary">
                {TEAM_OPEN.cta}
                <Icon name="arrow" className="size-3.5" />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
