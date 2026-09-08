"use client";

import { useState } from "react";
import Icon from "../Icon";
import SectionHeading from "../SectionHeading";
import { TEAM, TEAM_OPEN } from "@/content/about";
import { LinkedInChip } from "./Portrait";
import type { Heading } from "./shared";

/* ==========================================================================
   VARIANT — "DECK". Overlapping cards, one raised, grayscale until chosen.
   ==========================================================================
   From reference 1 (the support-team row): cards overlap slightly, the active
   one lifts clear of its neighbours and gains colour, and its caption plate
   turns dark. Reads as a hand of cards rather than a grid — the most
   "designed" of the photo-first options.

   ── STAGGER IS PLACEMENT, NOT HOVER ─────────────────────────────────────
   The vertical offsets are FIXED per index (a shallow arc, centre highest),
   set at render. Hover only changes filter, z-index and the caption's colour
   — never position — so the site's hover-geometry rule holds: the hovered
   element's own box never moves (WorkCard.tsx).

   ACTIVE IS STATE, not :hover-only. Pointer-enter sets it, but so does focus
   and click, so a keyboard user gets the same behaviour. Grayscale is the
   resting state and colour the active one — the reference's trick, and it
   makes a wall of unfamiliar faces read as one object.

   `-ml-6` overlap only from `lg`; below that the cards stack normally. */
const LIFT = ["lg:mt-10", "lg:mt-5", "lg:mt-0", "lg:mt-5", "lg:mt-10", "lg:mt-14", "lg:mt-16"];

export default function VariantDeck({ heading }: { heading: Heading }) {
  const [active, setActive] = useState(2);

  return (
    <section className="relative overflow-hidden border-t border-border bg-background py-20">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The team"
          icon="users"
          accent={heading.accent}
          lead={heading.lead}
          className="mb-14 max-w-2xl text-center [&]:mx-auto"
        >
          {heading.head}
        </SectionHeading>

        <ul className="flex flex-col items-center gap-4 lg:flex-row lg:justify-center lg:gap-0">
          {TEAM.map((m, i) => {
            const on = active === i;
            return (
              <li
                key={m.role}
                className={`w-full max-w-[260px] ${LIFT[i]} lg:-ml-6 lg:first:ml-0`}
                style={{ zIndex: on ? 30 : 10 }}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(i)}
                  className={`group relative block w-full overflow-hidden rounded-[1.25rem] border text-left transition-[box-shadow,border-color] duration-300 ${
                    on
                      ? "border-transparent shadow-2xl ring-1 ring-border"
                      : "border-border shadow-sm"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/team/${m.img}`}
                    alt={m.name ?? m.role}
                    loading="lazy"
                    decoding="async"
                    className={`aspect-[4/5] w-full object-cover transition-[filter] duration-500 ${
                      on ? "grayscale-0" : "grayscale"
                    }`}
                  />
                  {/* The caption plate — light when resting, ink when active,
                      which is the reference's strongest single move. */}
                  <span
                    className={`absolute inset-x-0 bottom-0 block px-4 py-3 backdrop-blur-sm transition-colors duration-300 ${
                      on ? "bg-ink/90" : "bg-card/85"
                    }`}
                  >
                    <span
                      className={`block font-display text-[14px] font-bold leading-[1.3] ${
                        on ? "text-white" : "text-foreground"
                      }`}
                    >
                      {m.name ?? "Named in your proposal"}
                    </span>
                    <span
                      className={`mt-0.5 block text-[12px] ${
                        on ? "text-white/75" : "text-muted-foreground"
                      }`}
                    >
                      {m.role}
                    </span>
                  </span>
                  <LinkedInChip m={m} size={9} />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 text-center">
          <a
            href={TEAM_OPEN.href}
            className="inline-flex items-center gap-2 rounded-full border border-dashed border-border bg-card px-6 py-3 text-[14px] font-semibold text-foreground transition-colors duration-300 hover:border-accent/50 hover:text-primary"
          >
            <Icon name="users" className="size-4 text-accent-strong" />
            {TEAM_OPEN.title} — {TEAM_OPEN.cta}
            <Icon name="arrow" className="size-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
