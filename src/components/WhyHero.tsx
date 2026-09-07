import Icon from "./Icon";
import { WHY_HERO } from "@/content/site";

/* /why-choose-us hero — prototype2-archive's left-aligned hero, rebuilt on the
   CareersHero skeleton so the two sub-pages read as one site: bg-secondary,
   masked backdrop texture, orb, badge → H1 → lead → actions, reveal delays at
   0/100/200/300.

   The texture is the archive's LINE grid rather than careers' dot grid — the
   page argues "this is a document", and ruled lines are the closest thing a
   backdrop has to ruled paper. `var(--border)` for the line colour, not a
   literal, so it survives the dark theme.

   The H1 is two BLOCK spans because the archive breaks the two sentences —
   the silhouette is part of the design (DS §3.3). The gradient is applied to
   one whole span, never split across children (HANDOFF §5.13: background-clip
   paints on the parent, inline-block children render as nothing).

   One filled button only (DS §9: max one primary per view). "Read the
   agreement" is the archive's `tlink--down` — a plain link whose arrow points
   at the very next section, so it stays typographic, not a competing pill. */
export default function WhyHero() {
  return (
    <section className="relative overflow-hidden bg-secondary pb-28 pt-40">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:32px_32px] [-webkit-mask-image:radial-gradient(ellipse_70%_60%_at_40%_35%,#000_10%,transparent_100%)] [mask-image:radial-gradient(ellipse_70%_60%_at_40%_35%,#000_10%,transparent_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 right-0 size-[560px] translate-x-1/4 rounded-full bg-brand/15 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div
            data-reveal
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium leading-[1.5] shadow-sm"
          >
            <span className="text-accent-strong">
              <Icon name="doc" className="size-4" />
            </span>
            <span className="text-muted-foreground">{WHY_HERO.eyebrow}</span>
          </div>

          <h1
            data-reveal
            style={{ "--delay": "100ms" } as React.CSSProperties}
            className="font-display text-4xl font-medium leading-[1.1] tracking-[-0.025em] text-foreground md:text-5xl lg:text-[3.5rem]"
          >
            <span className="block">{WHY_HERO.head}</span>
            <span className="block bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
              {WHY_HERO.accent}
            </span>
          </h1>

          <p
            data-reveal
            style={{ "--delay": "200ms" } as React.CSSProperties}
            className="mt-6 max-w-2xl text-lg leading-[1.5] text-muted-foreground"
          >
            {WHY_HERO.lead}
          </p>

          <div
            data-reveal
            style={{ "--delay": "300ms" } as React.CSSProperties}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href={WHY_HERO.ctaHref}
              className="group inline-flex h-14 items-center gap-2 rounded-full bg-primary px-8 text-[17px] font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-brand-light hover:shadow-primary/40 active:scale-95"
            >
              {WHY_HERO.cta}
              <span className="transition-transform group-hover:translate-x-1">
                <Icon name="arrow" className="size-5" />
              </span>
            </a>
            <a
              href={WHY_HERO.subHref}
              className="group inline-flex h-14 items-center gap-2 px-2 text-[17px] font-semibold text-foreground transition-colors hover:text-accent-strong"
            >
              {WHY_HERO.sub}
              <span className="transition-transform group-hover:translate-y-1">
                <Icon name="arrow-down" className="size-5" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
