import Icon from "./Icon";
import { CAREER_FACTS } from "@/content/site";

/* /careers hero.

   Same skeleton as /why-choose-us' hero — bg-secondary, two blurred orbs,
   badge → H1 → lead — so the two sub-pages read as one site. Two things are
   deliberately different, and both are the page doing a job the other pages
   do not have:

     1. TWO buttons. Every other hero on this site has one, because a client
        has one next action (book the call). A candidate has two genuinely
        different ones: read the roles, or read how the hiring works — and a
        senior engineer very often wants the second first. The second button
        is a plain link, not a second filled button; DS §9 allows exactly one
        primary per view.

     2. The FACT STRIP under the buttons. This is prototype 1's `.cta__meta`
        idea moved to the top of the page: the four objections a senior
        candidate has before they will read a role list at all. Three of the
        four are on HANDOFF §7's allowed list already; the fourth carries its
        own data-placeholder from site.ts.

   NOT here, on purpose: a headcount ("30+ engineers"), a Glassdoor score, or
   a photo of a team. We have none of those and inventing them is the exact
   failure the review names. */
export default function CareersHero() {
  return (
    <section
      id="careers-top"
      className="relative overflow-hidden bg-secondary pb-28 pt-40"
    >
      {/* Dot grid, radially masked so it fades before the section edge rather
          than tiling into a hard cut — same reasoning as Faq's backdrop, and
          the same `var(--border)` rather than a literal so it survives dark. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--border)_1.5px,transparent_1.5px)] bg-[size:26px_26px] [-webkit-mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_10%,transparent_100%)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_10%,transparent_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 right-0 size-[560px] translate-x-1/4 rounded-full bg-brand/15 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 size-[420px] -translate-x-1/3 translate-y-1/3 rounded-full bg-accent/15 blur-[120px]"
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
            <span className="text-muted-foreground">
              Careers at Interloid
            </span>
            {/* The live dot is a status light, not decoration: it says the
                list below is current. It is placeholder-flagged with the
                roles themselves — if nothing is actually open, this dot is a
                lie before a single role is read. */}
            <span
              className="ml-1 flex items-center gap-1.5 rounded-full bg-teal-600/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-teal-600"
              data-placeholder="P1: confirm roles are open before publishing"
            >
              <span
                className="size-1.5 rounded-full bg-teal-600"
                aria-hidden="true"
              />
              6 open
            </span>
          </div>

          <h1
            data-reveal
            style={{ "--delay": "100ms" } as React.CSSProperties}
            className="font-display text-4xl font-medium leading-[1.1] tracking-[-0.025em] text-foreground md:text-5xl lg:text-[3.5rem]"
          >
            We hire the same way{" "}
            <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
              we ship.
            </span>
          </h1>

          <p
            data-reveal
            style={{ "--delay": "200ms" } as React.CSSProperties}
            className="mt-6 max-w-2xl text-lg leading-[1.5] text-muted-foreground"
          >
            In the open, on a clock, with the number written down before you
            commit to anything. This page tells you what the work is, what the
            process costs you in hours, and who should not apply — before you
            spend an evening on a CV.
          </p>

          <div
            data-reveal
            style={{ "--delay": "300ms" } as React.CSSProperties}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#openings"
              className="group inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-[17px] font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-brand-light hover:shadow-primary/40 active:scale-95"
            >
              See the six open roles
              <span className="transition-transform group-hover:translate-x-1">
                <Icon name="arrow" className="size-5" />
              </span>
            </a>
            <a
              href="#hiring"
              className="inline-flex h-14 items-center gap-2 rounded-full border border-border bg-card px-8 text-[17px] font-semibold text-foreground shadow-sm transition-all hover:border-accent/40 hover:shadow-md active:scale-95"
            >
              <Icon name="clock" className="size-5 text-accent-strong" />
              How the hiring works
            </a>
          </div>
        </div>

        {/* The strip spans the full width rather than the copy column: it is a
            band of facts under the fold-line, not part of the paragraph. */}
        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAREER_FACTS.map((f, i) => (
            <li
              key={f.label}
              data-reveal
              style={{ "--delay": `${400 + i * 80}ms` } as React.CSSProperties}
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
