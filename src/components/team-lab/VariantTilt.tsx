"use client";

import { useEffect, useRef } from "react";
import Icon from "../Icon";
import SectionHeading from "../SectionHeading";
import { TEAM, TEAM_OPEN } from "@/content/about";
import { Portrait } from "./Portrait";
import type { Heading } from "./shared";

/* ==========================================================================
   LAB ROUND 2, VARIANT 1 — "TILT & SHINE". 3D cursor tilt on the portrait.
   ==========================================================================
   The portrait leans toward the cursor (max ±7°) and a shine tracks across
   the glass — the closest a flat card gets to being an object you are holding.
   No WebGL: `perspective()` + two custom properties.

   ── WHY THIS DOES NOT RE-ENTER THE HOVER-GEOMETRY LOOP ───────────────────
   The site's rule (WorkCard.tsx) bans geometry ON THE HOVERED ELEMENT, whose
   rendered box is what :hover hit-tests. Here the <li> is the hovered,
   hit-tested element and it NEVER transforms; the rotation is applied to an
   inner [data-tilt] child. A child leaning inside a stationary hit box cannot
   push itself out from under the pointer. (`overflow-hidden` is deliberately
   NOT on the li — the lean must be free to break the frame; the card inside
   clips its own corners.)

   ── ONE LISTENER, DIRECT STYLE WRITES ────────────────────────────────────
   pointermove on the GRID, RAF-throttled, writing --rx/--ry/--mx/--my on the
   card under the pointer and resetting the previous one. No React state per
   move — sixty state updates a second is how a tilt effect becomes a
   perf bug. Cleanup removes listener + RAF (TAILWIND-MAP §4).

   Reduced motion: the effect never attaches — the grid is a plain photo grid,
   whole-component (CLAUDE.md §7). */
export default function VariantTilt({ heading }: { heading: Heading }) {
  const gridRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf: number | null = null;
    let ev: PointerEvent | null = null;
    let last: HTMLElement | null = null;

    const reset = (el: HTMLElement) => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--shine", "0");
    };

    const paint = () => {
      raf = null;
      if (!ev) return;
      const card = (ev.target as HTMLElement).closest<HTMLElement>("[data-tilt]");
      if (last && last !== card) reset(last);
      last = card;
      if (!card) return;
      const r = card.getBoundingClientRect();
      const nx = (ev.clientX - r.left) / r.width - 0.5;
      const ny = (ev.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--rx", `${(-ny * 7).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${(nx * 9).toFixed(2)}deg`);
      card.style.setProperty("--mx", `${((nx + 0.5) * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${((ny + 0.5) * 100).toFixed(1)}%`);
      card.style.setProperty("--shine", "1");
    };
    const onMove = (e: PointerEvent) => {
      ev = e;
      if (raf === null) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      if (last) reset(last);
      last = null;
    };
    grid.addEventListener("pointermove", onMove);
    grid.addEventListener("pointerleave", onLeave);
    return () => {
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerleave", onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative overflow-hidden border-t border-border bg-secondary py-20">
      <div
        className="pointer-events-none absolute right-0 top-0 size-[480px] translate-x-1/3 -translate-y-1/4 rounded-full bg-brand/10 blur-[120px]"
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

        <ul ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: "900px" }}>
          {TEAM.map((m) => (
            <li key={m.role} className="h-full">
              <div
                data-tilt
                className="relative h-full transition-transform duration-300 ease-out will-change-transform"
                style={{
                  transform:
                    "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="relative overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl">
                  <Portrait m={m} className="relative aspect-[4/5]" />
                  {/* The shine — a soft light that rides --mx/--my. Sits over
                      the photo, under the caption scrim's text. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                    style={{
                      opacity: "var(--shine, 0)",
                      background:
                        "radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,.28), transparent 65%)",
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
          <li className="h-full">
            <a
              href={TEAM_OPEN.href}
              className="group flex h-full min-h-[280px] flex-col items-center justify-center gap-4 rounded-[1.25rem] border border-dashed border-border bg-background p-6 text-center transition-colors duration-300 hover:border-accent/50 hover:bg-card"
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
