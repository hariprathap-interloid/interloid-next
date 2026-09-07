import Icon from "./Icon";
import { CAREER_FACTS, TERMS } from "@/content/site";

/* /careers hero.

   Same skeleton as /why-choose-us' — bg-secondary, blurred orbs, badge → H1 →
   lead — so the sub-pages read as one site.

   ── REWRITTEN 2026-09-08 ─────────────────────────────────────────────────
   The senior version sold autonomy to people who already have options. These
   roles are the opposite offer: no experience required, and a real cost in
   hours and years. So the hero stops selling and starts disclosing — the four
   facts under it are location, who it is for, the training, and the money,
   which are the four things that decide whether the rest of the page is worth
   anybody's time.

   ONE BUTTON NOW, not two. The senior version had a second ("how the hiring
   works") because a senior engineer often wants the process before the roles.
   A fresher wants the roles. DS §9 allows one primary per view and this page
   has one thing to do.

   `data-placeholder` on two of the four facts comes from site.ts, not from
   here — the hours and the money are the unconfirmed ones. */
export default function CareersHero() {
  return (
    <section
      id="careers-top"
      className="relative overflow-hidden bg-secondary pb-24 pt-40"
    >
      {/* Radially masked so the grid fades before the section edge instead of
          tiling into a hard cut. `var(--border)`, not a literal, so the dots
          survive the dark theme (where the token is white at 10%). */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--border)_1.5px,transparent_1.5px)] bg-[size:26px_26px] [-webkit-mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_10%,transparent_100%)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_10%,transparent_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 right-0 size-[520px] translate-x-1/4 rounded-full bg-brand/15 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 size-[400px] -translate-x-1/3 translate-y-1/3 rounded-full bg-accent/15 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div
            data-reveal
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium leading-[1.5] shadow-sm"
          >
            <span className="text-accent-strong">
              <Icon name="users" className="size-4" />
            </span>
            <span className="text-muted-foreground">Careers at Interloid</span>
            <span
              className="ml-1 flex items-center gap-1.5 rounded-full bg-teal-600/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-teal-600"
              data-placeholder="P1: confirm roles are open before publishing"
            >
              <span
                className="size-1.5 rounded-full bg-teal-600"
                aria-hidden="true"
              />
              4 trainee roles
            </span>
          </div>

          <h1
            data-reveal
            style={{ "--delay": "100ms" } as React.CSSProperties}
            className="font-display text-4xl font-medium leading-[1.1] tracking-[-0.025em] text-foreground md:text-5xl lg:text-[3.5rem]"
          >
            Learn to build software{" "}
            <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
              on real projects.
            </span>
          </h1>

          <p
            data-reveal
            style={{ "--delay": "200ms" } as React.CSSProperties}
            className="mt-6 max-w-2xl text-lg leading-[1.5] text-muted-foreground"
          >
            Four trainee roles for freshers, on site in {TERMS.location}. Six
            months of training, then real client work — and every term of it is
            on this page rather than in a conversation you have to get to first.
          </p>

          <div
            data-reveal
            style={{ "--delay": "300ms" } as React.CSSProperties}
            className="mt-10"
          >
            <a
              href="#openings"
              className="group inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-[17px] font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-brand-light hover:shadow-primary/40 active:scale-95"
            >
              See the four roles
              <span className="transition-transform group-hover:translate-x-1">
                <Icon name="arrow" className="size-5" />
              </span>
            </a>
          </div>
        </div>

        {/* Full width, not the copy column: a band of facts under the fold
            line, not part of the paragraph. */}
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAREER_FACTS.map((f, i) => (
            <li
              key={f.label}
              data-reveal
              style={{ "--delay": `${380 + i * 70}ms` } as React.CSSProperties}
              className="h-full"
            >
              <div
                className="flex h-full items-start gap-3 rounded-[1.25rem] border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm"
                {...(f.ph ? { "data-placeholder": f.ph } : {})}
              >
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/15">
                  <Icon name={f.k} className="size-[18px]" />
                </span>
                <span>
                  <span className="block font-display text-[15px] font-bold leading-[1.4] tracking-[-0.015em] text-foreground">
                    {f.label}
                  </span>
                  <span className="mt-1 block text-[13px] leading-[1.6] text-muted-foreground">
                    {f.body}
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
