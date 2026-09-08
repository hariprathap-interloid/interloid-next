import Icon from "../Icon";
import SectionHeading from "../SectionHeading";
import { HUE } from "@/content/site";
import { TEAM, TEAM_OPEN } from "@/content/about";
import type { Heading } from "./shared";

/* ==========================================================================
   VARIANT — "BADGE". The reference card, rebuilt in this site's language.
   ==========================================================================
   Reference 5 (Converse's own) done properly: photo on top, a circular
   LinkedIn badge straddling the seam, name and role centred beneath. The
   value of having it in the lab is that it makes the comparison honest —
   judge the others against the thing that prompted the request, not against
   a memory of it.

   What is NOT copied: their card is flat white with a grey badge and no hue.
   Here the badge carries the person's hue ring, the seam has a hue hairline,
   and the card uses this site's radius, border and shadow tokens. Same
   anatomy, different design system.

   ── THE BADGE STRADDLES THE SEAM WITHOUT BREAKING THE CLIP ──────────────
   The photo needs `overflow-hidden` for its rounded top; a badge that
   overlaps the seam therefore CANNOT live inside it. It sits on the card,
   positioned from the photo's bottom edge — `top-[calc(…)]` would couple it
   to the aspect ratio, so instead the caption block gets `pt-8` and the badge
   is anchored to the caption's top with `-translate-y-1/2`. Change the
   aspect ratio and nothing moves.

   Server component. Hover: the photo lifts its wash, the badge fills. */
export default function VariantBadge({ heading }: { heading: Heading }) {
  return (
    <section className="relative overflow-hidden border-t border-border bg-background py-20">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The team"
          icon="users"
          accent={heading.accent}
          lead={heading.lead}
          className="mb-16 max-w-2xl"
        >
          {heading.head}
        </SectionHeading>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => {
            const h = HUE[m.hue];
            return (
              <li key={m.role}>
                <article className="group overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-lg">
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/team/${m.img}`}
                      alt={m.name ?? m.role}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/5] w-full object-cover"
                    />
                    <div
                      className="absolute inset-0 bg-ink/10 transition-opacity duration-500 group-hover:opacity-0"
                      aria-hidden="true"
                    />
                  </div>
                  {/* The seam hairline, in the person's hue. */}
                  <div className={`h-[3px] w-full ${h.tile}`} aria-hidden="true" />

                  <div className="relative px-5 pb-6 pt-8 text-center">
                    {/* Anchored to the caption's top edge, not to the photo's
                        height — see the banner. */}
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                      {m.linkedin ? (
                        <a
                          href={m.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${m.name ?? m.role} on LinkedIn`}
                          className={`grid size-11 place-items-center rounded-full bg-card text-[#0A66C2] shadow-md ring-2 transition-[background-color,color] duration-300 hover:bg-[#0A66C2] hover:text-white ${h.ring}`}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden="true">
                            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM10 9h3.8v1.7h.05a4.2 4.2 0 0 1 3.75-2c4 0 4.75 2.6 4.75 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2.05 1.4-2.05 2.8V21h-4z" />
                          </svg>
                        </a>
                      ) : (
                        /* No URL yet — a neutral disc keeps the seam's rhythm
                           without pretending to be a link. */
                        <span
                          className={`grid size-11 place-items-center rounded-full bg-card text-muted-foreground shadow-md ring-2 ${h.ring}`}
                          aria-hidden="true"
                        >
                          <Icon name={m.k} className="size-5" />
                        </span>
                      )}
                    </span>

                    <h3 className="font-display text-[17px] font-bold leading-[1.3] tracking-[-0.015em] text-foreground">
                      {m.name ?? "Named in your proposal"}
                    </h3>
                    <p className={`mt-1 text-[13px] font-semibold ${h.text}`}>{m.role}</p>
                  </div>
                </article>
              </li>
            );
          })}
          <li>
            <a
              href={TEAM_OPEN.href}
              className="group flex h-full flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-dashed border-border bg-secondary p-6 text-center transition-colors duration-300 hover:border-accent/50 hover:bg-card"
            >
              <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-strong ring-1 ring-border transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                <Icon name="users" className="size-6" />
              </span>
              <span className="font-display text-[16px] font-bold text-foreground">
                {TEAM_OPEN.title}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
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
