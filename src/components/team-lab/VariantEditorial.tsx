import Icon from "../Icon";
import { TEAM, TEAM_OPEN } from "@/content/about";
import { LinkedInChip } from "./Portrait";
import type { Heading } from "./shared";

/* ==========================================================================
   VARIANT — "EDITORIAL". Grayscale grid, hairline rules, tiny type.
   ==========================================================================
   From reference 4 (the studio site): no cards at all. Photographs sit
   directly on the page ground, separated by hairlines, captioned in small
   type. Colour arrives only on hover. The most restrained option and the one
   that ages best — it is a magazine contents page, not a component.

   ── NO CARDS MEANS THE GRID LINES ARE THE DESIGN ────────────────────────
   Borders are drawn per cell (`border-l` + `border-t`) with the first column
   and row suppressed via `[&:nth-child(4n+1)]:border-l-0` — a real grid rule
   rather than `divide-*`, which cannot express "except at the edges" and
   breaks entirely when the row count changes.

   ── WHY THE HEADING IS DIFFERENT HERE ───────────────────────────────────
   It does not use SectionHeading: this variant's whole argument is that the
   section is typographic, so it sets its own two-column masthead — heading
   left, lead right — the way an editorial spread would. If it wins, that
   masthead is the part to port, not just the grid.

   Server component. Hover: grayscale lifts, the caption's rule warms.
   Grayscale is also the honest choice for MIXED photography — the set of
   photos a small office has were taken in different rooms on different
   phones, and desaturating them is the cheapest way to make them a set. */
export default function VariantEditorial({ heading }: { heading: Heading }) {
  return (
    <section className="relative border-t border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* The masthead. */}
        <div className="mb-14 grid gap-6 border-b border-border pb-10 lg:grid-cols-12">
          <h2 className="font-display text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground lg:col-span-7 lg:text-5xl">
            {heading.head}{" "}
            <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
              {heading.accent}
            </span>
          </h2>
          <p className="text-[15px] leading-[1.75] text-muted-foreground lg:col-span-5 lg:pt-2">
            {heading.lead}
          </p>
        </div>

        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <li
              key={m.role}
              className="group border-border p-4 [&:nth-child(2n+1)]:border-l-0 lg:[&:nth-child(2n+1)]:border-l lg:[&:nth-child(4n+1)]:border-l-0 border-l border-t sm:p-6"
            >
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/team/${m.img}`}
                  alt={m.name ?? m.role}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                />
                <LinkedInChip m={m} size={9} />
              </div>
              <p className="mt-4 font-display text-[15px] font-bold leading-[1.3] tracking-[-0.015em] text-foreground">
                {m.name ?? "Named in your proposal"}
              </p>
              <p className="mt-0.5 text-[12px] uppercase tracking-[0.08em] text-muted-foreground">
                {m.role}
              </p>
              {/* The warming rule — the only colour at rest. */}
              <span
                className="mt-3 block h-px w-8 bg-border transition-[background-color,width] duration-500 group-hover:w-16 group-hover:bg-accent"
                aria-hidden="true"
              />
            </li>
          ))}
          <li className="border-l border-t border-border p-4 [&:nth-child(2n+1)]:border-l-0 lg:[&:nth-child(2n+1)]:border-l lg:[&:nth-child(4n+1)]:border-l-0 sm:p-6">
            <a href={TEAM_OPEN.href} className="group block">
              <span className="grid aspect-[4/5] w-full place-items-center border border-dashed border-border transition-colors duration-300 group-hover:border-accent/50">
                <Icon name="users" className="size-10 text-muted-strong transition-colors group-hover:text-accent" />
              </span>
              <span className="mt-4 block font-display text-[15px] font-bold leading-[1.3] text-foreground">
                {TEAM_OPEN.title}
              </span>
              <span className="mt-0.5 block text-[12px] uppercase tracking-[0.08em] text-primary">
                {TEAM_OPEN.cta}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
