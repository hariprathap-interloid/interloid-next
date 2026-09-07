import Icon from "./Icon";
import SectionHeading from "./SectionHeading";
import { HUE, OFFER } from "@/content/site";

/* "What you get, in writing" — the candidate-side commitment grid.

   This is where the Converse careers page has "Our Core Values": three
   abstractions (Innovation, Collaboration, Integrity) that no reader can check
   and no company would ever disclaim. The replacement is the move the rest of
   this site already makes — a falsifiable commitment per tile, each one the
   inward-facing twin of a client promise:

       client: "a working demo every week"  →  "you demo your own work"
       client: "senior engineers only"      →  "peers, not a pyramid"
       client: "small team, direct line"    →  "you talk to the client"

   A candidate who has read the client pages should recognise every one. That
   symmetry is the argument: the terms are the same in both directions, which
   is the only version of "why work here" a senior engineer believes.

   Classes come whole out of HUE — never `bg-${hue}/10` (CLAUDE.md gotcha 1:
   a concatenated class is silently dropped by the compiled build). */
export default function CandidateOffer() {
  return (
    <section
      id="offer"
      className="relative overflow-hidden border-t border-border bg-background py-32"
    >
      <div
        className="pointer-events-none absolute right-0 top-1/4 size-[520px] translate-x-1/3 rounded-full bg-brand/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The offer"
          icon="handshake"
          accent="not a values poster."
          lead="Every line below is checkable, and you are invited to check it in the interview. That is the same standard we hold ourselves to with clients — there is no reason it should be lower for the people doing the work."
        >
          Six things you can hold us to,
        </SectionHeading>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {OFFER.map((o, i) => {
            const h = HUE[o.hue];
            return (
              /* Wrapper reveals, card carries the hover classes — the split
                 Faq.tsx documents. Nothing here is stateful today, but the
                 next hover added to this card would hit the same collision. */
              <div
                key={o.title}
                data-reveal
                style={{ "--delay": `${i * 80}ms` } as React.CSSProperties}
                className="h-full"
              >
                <article
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border bg-card p-8 shadow-sm transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg"
                  {...(o.ph ? { "data-placeholder": o.ph } : {})}
                >
                  {/* The tile's own glow, whole-string out of HUE. It sits
                      under the content and only warms on hover, so the resting
                      grid stays quiet and the pointer picks one out. */}
                  <div
                    className={`pointer-events-none absolute -right-16 -top-16 size-40 rounded-full opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-100 ${h.glow}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`relative mb-6 grid size-12 place-items-center rounded-2xl ring-1 transition-colors duration-300 ${h.soft} ${h.softHover} ${h.ring} ${h.text}`}
                  >
                    <Icon name={o.k} className="size-6" />
                  </span>
                  <h3 className="relative mb-3 font-display text-xl font-bold leading-[1.35] tracking-[-0.02em] text-foreground">
                    {o.title}
                  </h3>
                  <p className="relative text-[15px] leading-[1.7] text-muted-strong">
                    {o.body}
                  </p>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
