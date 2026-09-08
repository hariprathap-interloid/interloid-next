import Icon from "../Icon";
import SectionHeading from "../SectionHeading";
import { HUE } from "@/content/site";
import { TEAM, TEAM_OPEN } from "@/content/about";
import { LinkedInChip } from "./Portrait";
import type { Heading } from "./shared";

/* ==========================================================================
   VARIANT — "SLIDE". The photograph is the card; detail slides up over it.
   ==========================================================================
   At rest: nothing but the photograph and a name. On hover or keyboard
   focus, a hue panel slides up from the foot carrying the role, what they
   own, and the LinkedIn chip. Maximum photo, detail on demand.

   ── THE PANEL TRANSLATES, THE CARD DOES NOT ─────────────────────────────
   `translate-y-full → translate-y-0` on a panel that is absolutely
   positioned inside the card. The card's own box is untouched, so the
   hover-geometry loop cannot start (WorkCard.tsx). This is the same
   distinction the tilt variant relies on: a child may move, the hit-tested
   element may not.

   ── focus-within, BECAUSE THE PANEL HOLDS A LINK ────────────────────────
   A hover-only reveal hides a focusable anchor from keyboard users while
   leaving it in the tab order — focus would land on something invisible.
   `group-focus-within` brings the panel up whenever anything inside is
   focused, so tabbing through the grid opens each panel in turn.

   Reduced motion: the panel is simply always visible (no transform, no
   transition) — the information is never the thing being removed.

   Server component, zero JS. */
export default function VariantSlide({ heading }: { heading: Heading }) {
  return (
    <section className="relative overflow-hidden border-t border-border bg-secondary py-20">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .tlab-slide { transform: none !important; transition: none !important; }
        }
      `}</style>

      <div
        className="pointer-events-none absolute right-0 top-1/4 size-[480px] translate-x-1/3 rounded-full bg-accent/10 blur-[120px]"
        aria-hidden="true"
      />
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

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => {
            const h = HUE[m.hue];
            return (
              <li key={m.role}>
                <article className="group relative aspect-[4/5] overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/team/${m.img}`}
                    alt={m.name ?? m.role}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover"
                  />
                  {/* Resting caption — name only, over a soft foot scrim. */}
                  <div
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-4 pt-10 transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0"
                    aria-hidden="true"
                  >
                    <p className="font-display text-[15px] font-bold leading-[1.3] text-white">
                      {m.name ?? "Named in your proposal"}
                    </p>
                  </div>

                  {/* The panel. Slides over the photo's foot. */}
                  <div
                    className={`tlab-slide absolute inset-x-0 bottom-0 translate-y-full p-5 transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0 ${h.tile}`}
                  >
                    <p className="font-display text-[15px] font-bold leading-[1.3] text-white">
                      {m.name ?? "Named in your proposal"}
                    </p>
                    <p className="mt-0.5 text-[12px] font-semibold text-white/80">{m.role}</p>
                    <p className="mt-2 text-[12px] leading-[1.55] text-white/75">{m.owns}</p>
                    {m.linkedin && (
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-white underline underline-offset-4"
                      >
                        LinkedIn
                        <Icon name="arrow" className="size-3" />
                      </a>
                    )}
                  </div>
                  <LinkedInChip m={m} size={9} />
                </article>
              </li>
            );
          })}
          <li>
            <a
              href={TEAM_OPEN.href}
              className="group flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-dashed border-border bg-background p-6 text-center transition-colors duration-300 hover:border-accent/50 hover:bg-card"
            >
              <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-strong ring-1 ring-border transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                <Icon name="users" className="size-6" />
              </span>
              <span className="font-display text-[15px] font-bold text-foreground">
                {TEAM_OPEN.title}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary">
                {TEAM_OPEN.cta}
                <Icon name="arrow" className="size-3" />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
