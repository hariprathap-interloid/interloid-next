"use client";

import { useState } from "react";
import Icon from "./Icon";
import { FAQ } from "@/content/site";

/* "Questions we get every week." Converted from prototype/'s accordion.

   This is the single most valuable unblocked section on the page. The review's
   core finding is that the site asks for trust while showing no proof; an FAQ
   is proof-by-transparency — the only kind that needs nobody's permission.
   Prototype 1's subhead says exactly why it works.

   The open/close animation is grid-template-rows 0fr -> 1fr, not max-height.
   max-height needs a magic number that is wrong for every answer; 0fr->1fr
   animates to the content's real height and stays correct if the copy changes.

   `visibility` is on the row too, not just height: a collapsed panel that is
   only zero-height still keeps its text in the accessibility tree and (with
   any focusable content) in the tab order — the same trap as HANDOFF §5.4.

   The button carries an INSET focus ring: the item clips overflow to round its
   corners, which would crop an outward ring (HANDOFF §5.5). */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative overflow-hidden border-t border-border bg-secondary py-32"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* max-w-3xl, not 2xl: at 2xl the H2 orphaned "week." onto its own
            line. The intro keeps its own narrower measure below. */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2
            data-reveal
            className="font-display text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
          >
            Questions we get{" "}
            <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
              every week.
            </span>
          </h2>
          <p
            data-reveal
            style={{ "--delay": "80ms" } as React.CSSProperties}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            The answers most agencies make you sit through a sales call to hear.
          </p>
        </div>

        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                data-reveal
                style={{ "--delay": `${i * 60}ms` } as React.CSSProperties}
                className={`overflow-hidden rounded-2xl border bg-card transition-all duration-300 ${
                  isOpen
                    ? "border-border shadow-md"
                    : "border-hairline hover:border-border hover:shadow-sm"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 rounded-2xl p-6 text-left font-display text-[17px] font-semibold text-foreground focus-visible:shadow-[inset_0_0_0_2px_var(--ring)]"
                  >
                    {f.q}
                    <span
                      className={`shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <Icon name="chevron" className="size-5" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={`grid transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)] ${
                    isOpen
                      ? "visible grid-rows-[1fr]"
                      : "invisible grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 leading-[1.7] text-muted-foreground">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
