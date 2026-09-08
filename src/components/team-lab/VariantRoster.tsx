"use client";

import { useState } from "react";
import Icon from "../Icon";
import SectionHeading from "../SectionHeading";
import { HUE } from "@/content/site";
import { TEAM, TEAM_OPEN } from "@/content/about";
import { LinkedInChip } from "./Portrait";
import type { Heading } from "./shared";

/* ==========================================================================
   VARIANT — "ROSTER". A list, not a grid: rows that expand on hover.
   ==========================================================================
   The only option here that is not a card wall. Each person is a ROW —
   circular portrait, name, role, LinkedIn — and the active row expands to
   show what they own, with the portrait growing from a thumbnail to a plate.
   Reads like a credits list or a cast sheet.

   Why it is worth judging against seven grids: a list scales to twenty people
   without becoming wallpaper, it reads perfectly on a phone with no layout
   change at all, and the eye can scan ROLES down a single column — which is
   what a client is actually doing. The cost is that no single photograph is
   ever large.

   ── EXPANSION IS grid-template-rows, NOT max-height ─────────────────────
   Faq.tsx's rule: `0fr → 1fr` animates to the content's real height, where a
   max-height needs a magic number that is wrong for every row. And the ROW
   grows, which is layout — but the row is not the hover target's own box in
   the sense that matters: the pointer sits on the row it is expanding, and
   expansion pushes the rows BELOW it, never the hovered row's top edge. A
   pointer resting mid-row stays inside it. (This is the one variant where
   that reasoning had to be made explicitly rather than avoided.)

   Active is state, set by pointer-enter AND focus AND click, so the keyboard
   path is identical. */
export default function VariantRoster({ heading }: { heading: Heading }) {
  const [active, setActive] = useState(0);

  return (
    <section className="relative overflow-hidden border-t border-border bg-background py-20">
      <div
        className="pointer-events-none absolute left-0 top-1/4 size-[480px] -translate-x-1/3 rounded-full bg-brand/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="The team"
          icon="users"
          accent={heading.accent}
          lead={heading.lead}
          className="mb-12 max-w-2xl"
        >
          {heading.head}
        </SectionHeading>

        <ul className="overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-sm">
          {TEAM.map((m, i) => {
            const h = HUE[m.hue];
            const on = active === i;
            return (
              <li key={m.role} className="border-b border-hairline last:border-0">
                <div
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group relative"
                >
                  <button
                    type="button"
                    aria-expanded={on}
                    onClick={() => setActive(i)}
                    className="flex w-full items-center gap-5 px-6 py-5 text-left transition-colors duration-300 hover:bg-secondary"
                  >
                    {/* The portrait grows from thumb to plate — width and
                        height on a CHILD, inside a row whose own top edge
                        never moves. */}
                    <span
                      className={`relative shrink-0 overflow-hidden rounded-full ring-2 transition-[width,height] duration-500 ease-out ${
                        on ? "size-20 " + h.ring : "size-12 ring-border"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/team/${m.img}`}
                        alt={m.name ?? m.role}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover"
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[17px] font-bold leading-[1.3] tracking-[-0.015em] text-foreground">
                        {m.name ?? "Named in your proposal"}
                      </span>
                      <span className={`mt-0.5 block text-[13px] font-semibold ${h.text}`}>
                        {m.role}
                      </span>
                    </span>

                    <span
                      className={`hidden shrink-0 text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 sm:block ${
                        on ? h.text : "text-muted-foreground"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </button>

                  {/* 0fr → 1fr, the Faq.tsx disclosure. `invisible` on the
                      collapsed row keeps its content out of the a11y tree. */}
                  <div
                    className={`grid px-6 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                      on ? "visible grid-rows-[1fr] pb-5" : "invisible grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-wrap items-center gap-4 pl-[100px]">
                        <p className="min-w-[240px] flex-1 text-[14px] leading-[1.7] text-muted-strong">
                          {m.owns}
                        </p>
                        <span className="relative">
                          <LinkedInChip m={m} size={10} />
                          {!m.linkedin && (
                            <span className="text-[12px] text-muted-foreground">
                              LinkedIn arrives with the name.
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}

          <li className="border-t border-border bg-secondary">
            <a
              href={TEAM_OPEN.href}
              className="group flex items-center gap-5 px-6 py-5 transition-colors duration-300 hover:bg-card"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-muted text-muted-strong ring-1 ring-border transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                <Icon name="users" className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block font-display text-[17px] font-bold leading-[1.3] text-foreground">
                  {TEAM_OPEN.title}
                </span>
                <span className="mt-0.5 block text-[13px] text-muted-foreground">
                  {TEAM_OPEN.body}
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-primary">
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
