"use client";

import { useState } from "react";
import Icon from "../Icon";
import SectionHeading from "../SectionHeading";
import { HUE } from "@/content/site";
import { TEAM, TEAM_OPEN } from "@/content/about";
import { LinkedInChip, Portrait } from "./Portrait";
import type { Heading } from "./shared";

/* ==========================================================================
   LAB ROUND 2, VARIANT 3 — "FOCUS STAGE". One portrait large, the rest wait.
   ==========================================================================
   A portfolio treatment: the featured person's photograph is near full-column
   height, with their name, role and LinkedIn beside it at reading size, and
   the rest of the team as a thumbnail rail. Hovering OR clicking a thumbnail
   features that person. The pitch: every seat gets a moment of being the
   biggest thing on the page, which is the "make the team feel seen" brief
   taken literally.

   ── CROSSFADE VIA key, NOT VIA A TRANSITION LIBRARY ──────────────────────
   The featured pane re-mounts under a changing `key`, and a tiny local
   keyframe fades the new one in. Re-mounting is the point: it guarantees the
   old portrait cannot linger half-swapped, and the animation is one CSS rule
   instead of state machinery. Reduced motion kills the keyframe — the swap
   still happens, instantly (reduced motion, not reduced function).

   ── HOVER-TO-FEATURE IS POINTER-ONLY SUGAR ───────────────────────────────
   The thumbnails are BUTTONS: click and Enter both feature, `aria-pressed`
   carries state, so hover is an accelerator rather than the mechanism —
   keyboard users lose nothing. The featured pane is aria-live polite so the
   swap is announced.

   Nothing here hover-moves: thumbs signal with ring + opacity only. */
export default function VariantStage({ heading }: { heading: Heading }) {
  const [sel, setSel] = useState(0);
  const m = TEAM[sel];
  const h = HUE[m.hue];

  return (
    <section className="relative overflow-hidden border-t border-border bg-secondary py-20">
      <style>{`
        @keyframes tlab-fade { from { opacity: 0 } to { opacity: 1 } }
        .tlab-fade { animation: tlab-fade .45s ease-out; }
        @media (prefers-reduced-motion: reduce) { .tlab-fade { animation: none; } }
      `}</style>

      <div
        className="pointer-events-none absolute bottom-0 right-0 size-[480px] translate-x-1/3 translate-y-1/4 rounded-full bg-brand/10 blur-[120px]"
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

        <div className="grid gap-10 lg:grid-cols-12">
          {/* ── the stage ─────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <div key={sel} className="tlab-fade" aria-live="polite">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-lg">
                <Portrait m={m} caption={false} className="relative aspect-[4/5] sm:aspect-[16/13]" />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 via-ink/35 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7">
                  <div>
                    <p className="font-display text-2xl font-bold leading-[1.2] tracking-[-0.02em] text-white">
                      {m.name ?? "Named in your proposal"}
                    </p>
                    <p className="mt-1 text-[15px] font-semibold text-white/85">{m.role}</p>
                    <p className="mt-3 max-w-md text-[13px] leading-[1.6] text-white/70">
                      {m.owns}
                    </p>
                  </div>
                </div>
                <LinkedInChip m={m} size={10} />
              </div>
            </div>
          </div>

          {/* ── the rail ──────────────────────────────────────────────── */}
          <div className="lg:col-span-5">
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3">
              {TEAM.map((t, i) => {
                const th = HUE[t.hue];
                const on = sel === i;
                return (
                  <li key={t.role}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setSel(i)}
                      onPointerEnter={() => setSel(i)}
                      className={`group relative block w-full overflow-hidden rounded-xl border transition-[border-color,opacity,box-shadow] duration-300 ${
                        on
                          ? "border-transparent opacity-100 ring-2 ring-accent shadow-md"
                          : "border-border opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Portrait m={t} caption={false} className="relative aspect-square" />
                      <span
                        className={`absolute inset-x-0 bottom-0 h-[3px] ${th.tile} ${on ? "" : "opacity-0"} transition-opacity duration-300`}
                        aria-hidden="true"
                      />
                      <span className="sr-only">{t.role}</span>
                    </button>
                  </li>
                );
              })}
              <li>
                <a
                  href={TEAM_OPEN.href}
                  className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background p-3 text-center transition-colors duration-300 hover:border-accent/50 hover:bg-card"
                >
                  <Icon name="users" className="size-6 text-muted-strong transition-colors group-hover:text-accent" />
                  <span className="text-[11px] font-semibold leading-[1.3] text-muted-foreground">
                    4 open seats
                  </span>
                </a>
              </li>
            </ul>
            <p className="mt-5 text-[13px] leading-[1.7] text-muted-foreground">
              {h.text && ""}
              Hover or click a face to bring them to the stage. The open seats
              lead to <a href={TEAM_OPEN.href} className="font-semibold text-primary">/careers</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
