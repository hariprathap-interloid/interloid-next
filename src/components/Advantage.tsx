"use client";

import Icon from "./Icon";
import SectionHeading from "./SectionHeading";
import { BENTO, HUE } from "@/content/site";

/* DS §8.2 glass bento tiles on the tinted surface, with the §14.3 cursor
   spotlight. Only HANDOFF §7's allowed numeric claims appear as fact.

   Client only for the spotlight. The handler is on each card via React's
   synthetic events, so there is nothing to add or remove on mount and no
   cleanup to forget — the whole class of listener-stacking bug the prototype's
   manual addEventListener invited simply cannot occur here.

   The spotlight writes CSS custom properties rather than animating anything:
   HANDOFF §5.14, a keyframe that touches `transform` replaces the whole
   property and would cancel the hover lift. */
export default function Advantage() {
  const spot = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      id="advantage"
      className="relative overflow-hidden bg-secondary px-6 py-32"
    >
      <div
        className="pointer-events-none absolute bottom-0 left-0 size-[600px] -translate-x-1/3 translate-y-1/3 rounded-full bg-brand/15 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-1/4 size-[420px] translate-x-1/3 rounded-full bg-accent/15 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Structure, badge form and the five tiles are unchanged — those were
            settled in phase 1. Only the headline and intro take prototype 1's
            copy: "the things agencies won't put in writing" names the enemy,
            where "commitments we put in writing" only describes us. */}
        <SectionHeading
          eyebrow="Why Interloid"
          accent={"won’t put in writing."}
          lead="We commit to these in the contract, not just on the website."
        >
          The things agencies
        </SectionHeading>

        <div className="grid gap-6 md:grid-cols-2 lg:auto-rows-[300px] lg:grid-cols-3">
          {BENTO.map((b, i) => {
            const h = HUE[b.hue];
            return (
              <article
                key={b.title}
                data-reveal
                style={{ "--delay": `${i * 100}ms` } as React.CSSProperties}
                onPointerMove={spot}
                className={`group relative overflow-hidden rounded-3xl border border-border bg-card/70 p-8 shadow-sm backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${b.span}`}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(40,157,190,.14), transparent 60%)",
                  }}
                  aria-hidden="true"
                />
                <div className="relative z-10 flex h-full flex-col">
                  <span
                    className={`mb-6 grid size-14 place-items-center rounded-2xl ring-1 transition-transform duration-500 group-hover:scale-110 ${h.soft} ${h.text} ${h.ring}`}
                  >
                    <Icon name={b.k} className="size-7" />
                  </span>
                  <h3 className="mb-3 font-display text-xl font-bold text-foreground lg:text-2xl">
                    {b.title}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {b.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
