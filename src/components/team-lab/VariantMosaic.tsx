import Icon from "../Icon";
import SectionHeading from "../SectionHeading";
import { TEAM, TEAM_OPEN } from "@/content/about";
import { Portrait } from "./Portrait";
import type { Heading } from "./shared";

/* ==========================================================================
   LAB ROUND 2, VARIANT 4 — "MOSAIC". A photo bento with a gentle idle drift.
   ==========================================================================
   The founder's portrait at 2×2, everyone else at 1×1 — the same bento
   arithmetic as /careers' LifeHere (2×2 + fills), so the two pages would
   rhyme. Each tile drifts vertically a few pixels on its own phase, which
   makes the wall feel alive without a single hover requirement — the only
   round-2 variant whose motion works on a phone.

   ── IDLE MOTION IS NOT HOVER MOTION ──────────────────────────────────────
   The tiles DO translate — but on a clock, not on :hover, so there is no
   feedback loop to enter: the animation never reads the pointer, and hover
   feedback stays colour-only (scrim lightens, border warms). A pointer parked
   on a drifting edge sees hover blink at worst, with 6px amplitude over 7s;
   nothing oscillates at frame rate because nothing about hover changes
   geometry. Server component — zero JS.

   Reduced motion parks the drift entirely (whole-component media block).

   ── THE BENTO ARITHMETIC ─────────────────────────────────────────────────
   lg is a 4-col grid with `auto-rows`: founder 2×2 + six 1×1 + open seat 1×1
   = 4+6+1 = 11 cells ... which does NOT fill three rows of four. The founder
   spans rows 1-2 col 1-2; six singles fill the remaining 4 cells of rows 1-2
   and 2 of row 3; the open seat joins row 3 → row 3 holds 3 of 4 cells, so
   the LAST CELL IS A DELIBERATE GAP — it reads as breathing room at the end
   of the wall, not as a hole mid-grid, because it is the final cell. Add a
   seat and it fills; this is the one bento here that tolerates growth. */
const DRIFT = ["tlab-d1", "tlab-d2", "tlab-d3"] as const;

export default function VariantMosaic({ heading }: { heading: Heading }) {
  return (
    <section className="relative overflow-hidden border-t border-border bg-background py-20">
      <style>{`
        @keyframes tlab-drift { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        .tlab-d1 { animation: tlab-drift 7s ease-in-out infinite; }
        .tlab-d2 { animation: tlab-drift 8.5s ease-in-out 1.2s infinite; }
        .tlab-d3 { animation: tlab-drift 7.8s ease-in-out 2.3s infinite; }
        @media (prefers-reduced-motion: reduce) { .tlab-d1,.tlab-d2,.tlab-d3 { animation: none; } }
      `}</style>

      <div
        className="pointer-events-none absolute left-1/4 top-0 size-[480px] -translate-y-1/3 rounded-full bg-accent/10 blur-[120px]"
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

        <ul className="grid auto-rows-[180px] gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[200px]">
          {TEAM.map((m, i) => (
            <li
              key={m.role}
              className={`${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""} ${DRIFT[i % 3]}`}
            >
              <div className="group relative h-full overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-lg">
                <Portrait m={m} className="absolute inset-0" />
                {/* hover: the scrim thins so the photo comes forward —
                    colour only. */}
                <div
                  className="pointer-events-none absolute inset-0 bg-ink/10 transition-opacity duration-500 group-hover:opacity-0"
                  aria-hidden="true"
                />
              </div>
            </li>
          ))}
          <li className={DRIFT[1]}>
            <a
              href={TEAM_OPEN.href}
              className="group flex h-full flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-dashed border-border bg-secondary p-5 text-center transition-colors duration-300 hover:border-accent/50 hover:bg-card"
            >
              <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-strong ring-1 ring-border transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                <Icon name="users" className="size-6" />
              </span>
              <span className="font-display text-[14px] font-bold leading-[1.35] text-foreground">
                {TEAM_OPEN.title}
              </span>
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary">
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
