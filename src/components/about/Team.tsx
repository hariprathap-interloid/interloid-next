import Icon from "../Icon";
import SectionHeading from "../SectionHeading";
import { HUE } from "@/content/site";
import { TEAM, TEAM_HEADING, TEAM_OPEN } from "@/content/about";

/* ==========================================================================
   THE TEAM — photo-first portrait cards.
   ==========================================================================
   REBUILT 2026-09-08 (third pass) on the user's correction: "the primary is
   to show image and LinkedIn and name and role." The previous card led with
   the ROLE because every seat is nameless today — a hierarchy chosen for the
   placeholder era. That was backwards: the design must be chosen for the
   FINISHED state and merely survive the placeholder one, not the reverse.

   The card is now exactly the four primaries, top to bottom:

     1. PORTRAIT   — dominant, 4:5, fills its frame
     2. LINKEDIN   — a chip on the portrait's top-right corner
     3. NAME       — display type, the headline of the text block
     4. ROLE       — under the name, in the person's hue

   `owns` (what the person is responsible for) is OFF the card face now — it
   made the card read as a directory entry instead of a person. It stays in
   content/about.ts because the /team lab variants and any future detail
   surface still use it; deleting data to simplify a card is how content gets
   re-invented later.

   ── THE NULL FIELDS STILL SWITCH EVERYTHING (unchanged contract) ─────────
   `name`, `img`, `linkedin` — independent, all null today:
     no img       → the portrait frame renders a hue plate with the initials
                    (if a name exists) or the discipline glyph. The FRAME is
                    still portrait-sized, so filling in photographs later
                    changes pixels, not layout.
     no name      → "Named in your proposal" stands in the name slot — the
                    promise the People section already makes.
     no linkedin  → no chip. Never a dead link, never a disabled-looking
                    button that invites a click.

   ⚠ Photographs must be OF THESE PEOPLE, WITH PERMISSION — not stock, not
   scraped. A stock portrait under a real colleague's job title is worse than
   no photograph, and the colleague is the first person who will notice.

   HOVER — colour and light only, nothing moves (WorkCard.tsx): the portrait
   wash clears, the hue bar's fill completes inside its FIXED 5px track (the
   flex-child version of that bar grew the card 2px on hover and the harness
   caught it — do not regress it), border warms, shadow grows. */

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (
    parts.length > 1
      ? parts[0][0] + parts[parts.length - 1][0]
      : name.slice(0, 2)
  ).toUpperCase();
}

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
      <div
        className="pointer-events-none absolute bottom-0 left-0 size-[420px] -translate-x-1/3 translate-y-1/4 rounded-full bg-accent/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow={TEAM_HEADING.eyebrow}
          icon="users"
          accent={TEAM_HEADING.accent}
          lead={TEAM_HEADING.lead}
          className="mb-16 max-w-2xl"
        >
          {TEAM_HEADING.head}
        </SectionHeading>

        <ul
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          data-placeholder="P1: confirm which of these seats exist, and add real permissioned photographs"
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
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-sm transition-[border-color,box-shadow] duration-300 ease-out hover:border-accent/40 hover:shadow-lg">
                  {/* ── 1. THE PORTRAIT — the card IS the photograph ────── */}
                  <div className="relative aspect-[4/5] overflow-hidden" data-portrait>
                    {m.img ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/team/${m.img}`}
                          alt={m.name ?? m.role}
                          loading="lazy"
                          decoding="async"
                          className="size-full object-cover"
                        />
                        <div
                          className="absolute inset-0 bg-ink/10 transition-opacity duration-500 ease-out group-hover:opacity-0"
                          aria-hidden="true"
                        />
                      </>
                    ) : (
                      <>
                        <div
                          className={`absolute inset-0 opacity-80 transition-opacity duration-500 ease-out group-hover:opacity-100 ${h.soft}`}
                          aria-hidden="true"
                        />
                        <div
                          className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--border)_1.5px,transparent_1.5px)] bg-[size:20px_20px] [-webkit-mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,#000_10%,transparent_100%)] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,#000_10%,transparent_100%)]"
                          aria-hidden="true"
                        />
                        <div className="absolute inset-0 grid place-items-center">
                          {m.name ? (
                            <span
                              className={`font-display text-[44px] font-bold tracking-[-0.02em] opacity-70 ${h.text}`}
                              aria-hidden="true"
                            >
                              {initials(m.name)}
                            </span>
                          ) : (
                            <span className={`opacity-30 ${h.text}`} aria-hidden="true">
                              <Icon name={m.k} className="size-16" />
                            </span>
                          )}
                        </div>
                      </>
                    )}

                    {/* ── 2. LINKEDIN — on the portrait, top-right ──────── */}
                    {m.linkedin && (
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${m.name ?? m.role} on LinkedIn`}
                        className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/95 text-[#0A66C2] shadow-md ring-1 ring-black/5 backdrop-blur-sm transition-[background-color,color] duration-300 hover:bg-[#0A66C2] hover:text-white"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden="true">
                          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM10 9h3.8v1.7h.05a4.2 4.2 0 0 1 3.75-2c4 0 4.75 2.6 4.75 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2.05 1.4-2.05 2.8V21h-4z" />
                        </svg>
                      </a>
                    )}
                  </div>

                  {/* The per-person hue bar. FIXED 5px track, fill grows
                      inside it — the in-flow version changed the card's box
                      on hover and the harness caught it. */}
                  <div className="relative h-[5px] w-full bg-hairline" aria-hidden="true">
                    <span
                      className={`absolute inset-x-0 bottom-0 h-[3px] transition-[height] duration-300 ease-out group-hover:h-[5px] ${h.tile}`}
                    />
                  </div>

                  {/* ── 3. NAME, then 4. ROLE — nothing else ────────────── */}
                  <div className="flex flex-1 flex-col p-5">
                    {m.name ? (
                      <h3 className="font-display text-lg font-bold leading-[1.3] tracking-[-0.015em] text-foreground">
                        {m.name}
                      </h3>
                    ) : (
                      <h3 className="inline-flex items-center gap-1.5 font-display text-[15px] font-semibold leading-[1.3] text-muted-foreground">
                        <Icon name="doc" className="size-3.5 text-accent-strong" />
                        Named in your proposal
                      </h3>
                    )}
                    <p className={`mt-1 text-[14px] font-semibold ${h.text}`}>{m.role}</p>
                  </div>
                </article>
              </li>
            );
          })}

          {/* The open seat — a different object: dashed, on the page ground,
              a gap in the roster rather than an eighth colleague. Also the
              only route from /about to /careers. */}
          <li
            data-reveal
            style={{ "--delay": `${TEAM.length * 70}ms` } as React.CSSProperties}
            className="h-full"
          >
            <a
              href={TEAM_OPEN.href}
              className="group flex h-full flex-col items-center justify-center gap-4 rounded-[1.25rem] border border-dashed border-border bg-background p-6 text-center transition-[border-color,background-color] duration-300 ease-out hover:border-accent/50 hover:bg-card"
            >
              <span className="grid size-14 place-items-center rounded-full bg-muted text-muted-strong ring-1 ring-border transition-[background-color,color] duration-300 ease-out group-hover:bg-accent group-hover:text-white">
                <Icon name="users" className="size-7" />
              </span>
              <span>
                <span className="block font-display text-[17px] font-bold leading-[1.3] tracking-[-0.015em] text-foreground">
                  {TEAM_OPEN.title}
                </span>
                <span className="mt-2 block text-[14px] leading-[1.65] text-muted-strong">
                  {TEAM_OPEN.body}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                {TEAM_OPEN.cta}
                <Icon name="arrow" className="size-3.5" />
              </span>
            </a>
          </li>
        </ul>

        {/* The line for the team — the only copy on the site addressed to the
            people who work here rather than to the market. */}
        <p
          data-reveal
          style={{ "--delay": `${(TEAM.length + 1) * 70}ms` } as React.CSSProperties}
          className="mx-auto mt-10 max-w-2xl text-center text-[15px] leading-[1.8] text-muted-foreground"
        >
          {TEAM_HEADING.note}
        </p>
      </div>
    </section>
  );
}
