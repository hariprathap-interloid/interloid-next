import Icon from "./Icon";
import SectionHeading from "./SectionHeading";
import { CASES, HUE } from "@/content/site";

/* DS §8.3 article cards. EVERY card is a placeholder — HANDOFF §7 makes three
   real, anonymised case studies a P0 launch blocker, and the hero's "See the
   proof" CTA now points here, which makes that P0 a hero-level promise.
   Do not un-flag these. Server Component. */
export default function Work() {
  return (
    <section
      id="work"
      className="relative overflow-hidden border-t border-border bg-background pb-8 pt-32"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Selected work"
          accent="handed over."
          className="max-w-2xl"
        >
          Shipped, then
        </SectionHeading>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c, i) => {
            const h = HUE[c.hue];
            return (
              <article
                key={c.title}
                data-reveal
                style={{ "--delay": `${i * 100}ms` } as React.CSSProperties}
                data-placeholder="P0 TRUST: needs a real, anonymised case study"
                className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`relative mb-5 grid h-48 place-items-center overflow-hidden rounded-2xl ${h.soft}`}
                >
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--border)_1.5px,transparent_1.5px)] bg-[size:20px_20px] opacity-40"
                    aria-hidden="true"
                  />
                  <span
                    className={`relative grid size-16 place-items-center rounded-2xl bg-card shadow-md ${h.text}`}
                  >
                    <Icon name="layers" className="size-8" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-4 pb-4">
                  <span
                    className={`mb-3 text-xs font-semibold uppercase tracking-wide ${h.text}`}
                  >
                    {c.sector}
                  </span>
                  <h3 className="mb-3 font-display text-xl font-bold text-foreground">
                    {c.title}
                  </h3>
                  <p className="mb-6 leading-relaxed text-muted-foreground">
                    {c.body}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    Placeholder
                    <span className="transition-transform group-hover:translate-x-1">
                      <Icon name="arrow" className="size-4" />
                    </span>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
