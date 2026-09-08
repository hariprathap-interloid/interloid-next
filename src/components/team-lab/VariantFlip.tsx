"use client";

import Icon from "../Icon";
import SectionHeading from "../SectionHeading";
import { HUE } from "@/content/site";
import { TEAM, TEAM_OPEN } from "@/content/about";
import { LinkedInChip, Portrait } from "./Portrait";
import type { Heading } from "./shared";

/* ==========================================================================
   LAB ROUND 2, VARIANT 2 — "FLIP". Portrait front, dossier back.
   ==========================================================================
   The front is NOTHING but the photograph with a caption scrim — the purest
   photo-first card possible. Hovering (or keyboard-focusing anything inside)
   flips it to the back: role, what they own, and the LinkedIn chip at
   comfortable size. The reference site's own About uses flip cards for its
   "Why We Exist" row, so the idiom is native to this design language.

   ── GEOMETRY: OUTER STILL, INNER ROTATES ─────────────────────────────────
   The hovered <li> never transforms — the rotation lives on an inner
   [data-flip] child inside a perspective container, so the hit box is
   stationary (WorkCard.tsx's rule, same reasoning as the tilt variant).

   ── focus-within IS THE ACCESSIBILITY HALF ───────────────────────────────
   The back holds a link. A hover-only flip would make that link reachable by
   pointer and invisible to a keyboard — so the flip also triggers on
   `:focus-within`, and the LinkedIn anchor is in the tab order whichever face
   is showing (backface-visibility hides pixels, not focusability, which for
   once is what we want).

   Reduced motion: the transition is removed, so the flip is an instant state
   change — reduced MOTION, not reduced information (CLAUDE.md §7). */
export default function VariantFlip({ heading }: { heading: Heading }) {
  return (
    <section className="relative overflow-hidden border-t border-border bg-background py-20">
      <style>{`
        .tlab-flip { transform-style: preserve-3d; transition: transform .65s cubic-bezier(.2,.8,.25,1); }
        .tlab-flipwrap:hover .tlab-flip, .tlab-flipwrap:focus-within .tlab-flip { transform: rotateY(180deg); }
        .tlab-face { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .tlab-back { transform: rotateY(180deg); }
        @media (prefers-reduced-motion: reduce) { .tlab-flip { transition: none; } }
      `}</style>

      <div
        className="pointer-events-none absolute left-0 top-1/3 size-[480px] -translate-x-1/3 rounded-full bg-accent/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The team"
          icon="users"
          accent={heading.accent}
          lead={heading.lead}
          className="mb-12 max-w-2xl"
        >
          {heading.head}
        </SectionHeading>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => {
            const h = HUE[m.hue];
            return (
              <li key={m.role} className="tlab-flipwrap h-full" style={{ perspective: "1100px" }}>
                <div data-flip className="tlab-flip relative aspect-[4/5]">
                  {/* front — the photograph, whole */}
                  <div className="tlab-face absolute inset-0 overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-sm">
                    <Portrait m={m} className="absolute inset-0" />
                  </div>
                  {/* back — the dossier */}
                  <div
                    className={`tlab-face tlab-back absolute inset-0 flex flex-col overflow-hidden rounded-[1.25rem] border border-border p-6 shadow-sm ${h.soft}`}
                  >
                    <span className={`mb-4 grid size-11 place-items-center rounded-2xl bg-card ring-1 ${h.ring} ${h.text}`}>
                      <Icon name={m.k} className="size-5" />
                    </span>
                    <h3 className="font-display text-[17px] font-bold leading-[1.3] text-foreground">
                      {m.name ?? "Named in your proposal"}
                    </h3>
                    <p className={`mt-1 text-[13px] font-semibold ${h.text}`}>{m.role}</p>
                    <p className="mt-3 text-[13px] leading-[1.65] text-muted-strong">{m.owns}</p>
                    <div className="relative mt-auto h-10">
                      <LinkedInChip m={m} size={10} />
                      {!m.linkedin && (
                        <p className="pt-3 text-[12px] text-muted-foreground">
                          LinkedIn arrives with the name.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          <li className="h-full">
            <a
              href={TEAM_OPEN.href}
              className="group flex aspect-[4/5] flex-col items-center justify-center gap-4 rounded-[1.25rem] border border-dashed border-border bg-secondary p-6 text-center transition-colors duration-300 hover:border-accent/50 hover:bg-card"
            >
              <span className="grid size-14 place-items-center rounded-full bg-muted text-muted-strong ring-1 ring-border transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                <Icon name="users" className="size-7" />
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
