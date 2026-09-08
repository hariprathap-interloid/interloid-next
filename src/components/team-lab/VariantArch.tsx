import Icon from "../Icon";
import SectionHeading from "../SectionHeading";
import { HUE } from "@/content/site";
import { TEAM, TEAM_OPEN } from "@/content/about";
import { LinkedInChip } from "./Portrait";
import type { Heading } from "./shared";

/* ==========================================================================
   VARIANT — "ARCH". Curved photo panels on hue grounds, staggered.
   ==========================================================================
   From reference 2: each portrait sits on a coloured panel whose bottom edge
   is a soft curve, and alternate cards drop a little so the row reads as a
   wave rather than a ruler. Warmest of the options, and the one that survives
   inconsistent photography best — the hue ground and the arch unify shots
   taken on different days with different backgrounds, which is exactly the
   set of photographs a small office actually has.

   ── THE CURVE IS A MASK, NOT AN IMAGE ───────────────────────────────────
   `border-radius: 50% / 0 0 22% 22%`-style curvature via an oversized
   `rounded-b-[100%]` on the panel with `overflow-hidden`. No SVG clip-path:
   clip-path on a transformed ancestor prints artefacts in Safari, and a
   border-radius is composited.

   Server component, zero JS. Hover is colour only — the panel's hue deepens
   and the photo lifts its wash — so the site's geometry rule is satisfied by
   construction. The stagger is fixed placement, not motion.

   ⚠ THE ARCH EATS THE BOTTOM OF THE PHOTO. Fine for the placeholder art;
   with real portraits, chins land near that curve. If this variant wins, the
   photographs need headroom at the bottom of the frame or `object-position`
   nudged up per person. */
export default function VariantArch({ heading }: { heading: Heading }) {
  return (
    <section className="relative overflow-hidden border-t border-border bg-secondary py-20">
      <div
        className="pointer-events-none absolute left-1/2 top-0 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[130px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The team"
          icon="users"
          accent={heading.accent}
          lead={heading.lead}
          className="mb-16 max-w-2xl"
        >
          {heading.head}
        </SectionHeading>

        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m, i) => {
            const h = HUE[m.hue];
            return (
              <li key={m.role} className={i % 2 ? "lg:mt-12" : ""}>
                <figure className="group text-center">
                  {/* The panel. `rounded-b-[100%]` on an overflow-hidden box
                      is what bends the foot of the photo. */}
                  <div
                    className={`relative overflow-hidden rounded-t-[1.5rem] rounded-b-[100%] transition-colors duration-500 ${h.soft}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/team/${m.img}`}
                      alt={m.name ?? m.role}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/5] w-full object-cover mix-blend-multiply transition-[filter,opacity] duration-500 group-hover:brightness-105"
                    />
                    <LinkedInChip m={m} size={9} />
                  </div>
                  <figcaption className="mt-5">
                    <p className="font-display text-[17px] font-bold leading-[1.3] tracking-[-0.015em] text-foreground">
                      {m.name ?? "Named in your proposal"}
                    </p>
                    <p className={`mt-1 text-[13px] font-semibold ${h.text}`}>{m.role}</p>
                  </figcaption>
                </figure>
              </li>
            );
          })}
          <li className="lg:mt-12">
            <a
              href={TEAM_OPEN.href}
              className="group block text-center"
            >
              <span className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-t-[1.5rem] rounded-b-[100%] border border-dashed border-border bg-background transition-colors duration-300 group-hover:border-accent/50">
                <Icon name="users" className="size-10 text-muted-strong transition-colors group-hover:text-accent" />
              </span>
              <span className="mt-5 block font-display text-[17px] font-bold leading-[1.3] text-foreground">
                {TEAM_OPEN.title}
              </span>
              <span className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
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
