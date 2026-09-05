"use client";

import { useRef, useState } from "react";
import Icon from "./Icon";
import SectionHeading from "./SectionHeading";
import { HUE, SERVICES } from "@/content/site";

/* DS §5.2 archetype: split 5/7 selector + L4 feature panel.

   A real ARIA tablist with a ROVING TABINDEX — only the selected tab is in the
   tab order, and Arrow keys move between them. That is what a tablist owes a
   keyboard user; a list of focusable buttons is not the same thing.

   Client because of the selection state. In the prototype this re-rendered
   both panes with innerHTML on every click; here React swaps only what
   changed, and the tab buttons keep their DOM identity — so focus survives the
   arrow-key move without having to be restored by hand. */
export default function Services() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const delta: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    if (!(e.key in delta)) return;
    e.preventDefault();
    const next = (active + delta[e.key] + SERVICES.length) % SERVICES.length;
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  const s = SERVICES[active];
  const h = HUE[s.hue];

  return (
    <section id="services" className="relative overflow-hidden bg-background py-24">
      <div
        className="pointer-events-none absolute right-0 top-0 size-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="What we build"
          accent="work that matters."
          lead="Five capabilities, one team. You get the same senior engineers from the first call to handover."
        >
          Engineering capacity for the
        </SectionHeading>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          {/* §8.6 selector rows */}
          <div
            className="lg:col-span-5"
            role="tablist"
            aria-orientation="vertical"
            aria-label="Capabilities"
          >
            <div className="flex flex-col gap-2" onKeyDown={onKeyDown}>
              {SERVICES.map((item, i) => {
                const on = i === active;
                const hue = HUE[item.hue];
                return (
                  <button
                    key={item.k}
                    ref={(el) => {
                      tabsRef.current[i] = el;
                    }}
                    role="tab"
                    id={`tab-${i}`}
                    aria-selected={on}
                    aria-controls="panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                      on
                        ? "border-border bg-card shadow-[0_15px_40px_-15px_rgba(31,93,160,.20)]"
                        : "border-transparent hover:border-border hover:bg-card/60"
                    }`}
                  >
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-full transition-colors ${
                        on
                          ? `${hue.tile} text-white`
                          : `${hue.soft} ${hue.text}`
                      }`}
                    >
                      <Icon name={item.k} className="size-5" />
                    </span>
                    <span
                      className={`font-display text-base font-bold ${
                        on
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </span>
                    <span
                      className={`ml-auto transition-transform group-hover:translate-x-1 ${
                        on ? hue.text : "text-faint"
                      }`}
                    >
                      <Icon name="arrow" className="size-5" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* §8.4 L4 feature panel */}
          <div className="lg:col-span-7">
            <div
              id="panel"
              role="tabpanel"
              aria-labelledby={`tab-${active}`}
              className="relative overflow-hidden rounded-4xl bg-card p-8 shadow-[0_30px_80px_-15px_rgba(15,23,42,.12)] ring-1 ring-foreground/5 sm:p-12"
            >
              {/* h.glow is a whole class string. The prototype built this as
                  `${h.tile}/10`, which only worked because the browser CDN
                  generated classes at runtime — a compiled build would drop it
                  silently. See the note in content/site.ts. */}
              <div
                className={`pointer-events-none absolute right-0 top-0 size-64 -translate-y-1/3 translate-x-1/3 rounded-full blur-[80px] ${h.glow}`}
                aria-hidden="true"
              />
              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-4">
                  <span
                    className={`grid size-14 shrink-0 place-items-center rounded-2xl text-white shadow-lg ${h.tile}`}
                  >
                    <Icon name={s.k} className="size-7" />
                  </span>
                  <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                    {s.name}
                  </h3>
                </div>
                <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
                <div className="mb-10 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-muted px-3.5 py-1.5 text-sm font-medium text-foreground ring-1 ring-border"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-brand-light hover:shadow-primary/40"
                >
                  Book a call
                  <span className="transition-transform group-hover:translate-x-1">
                    <Icon name="arrow" className="size-4" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
