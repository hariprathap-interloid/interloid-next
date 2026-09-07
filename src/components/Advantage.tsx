import CommitmentTile from "./CommitmentTile";
import SectionHeading from "./SectionHeading";
import { BENTO } from "@/content/site";

/* DS §8.2 glass bento on the tinted surface, rebuilt to prototype 1's `.tile`.

   A SERVER component: the cursor spotlight lives in CommitmentTile, which is
   the only part that needs the client. Everything here is static markup and
   ships as HTML.

   Rebuilt 2026-09-07 to prototype 1's full seven-commitment set. The wide
   tiles are FIRST and LAST — see the count note in content/site.ts for why
   that is the only arrangement that fills three rows. `wide` is derived from
   the array length rather than hard-coded, so a 5-tile set falls back to
   prototype 1's original single wide tile without an edit here.

   `lg:auto-rows-[18rem]` is prototype 1's 18rem, not prototype3's 300px. */
export default function Advantage() {
  const last = BENTO.length - 1;

  return (
    <section
      id="advantage"
      className="relative overflow-hidden bg-secondary py-32"
    >
      <div
        className="pointer-events-none absolute bottom-0 left-0 size-[600px] -translate-x-1/3 translate-y-1/3 rounded-full bg-brand/15 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-1/4 size-[420px] translate-x-1/3 rounded-full bg-accent/15 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Why Interloid"
          icon="star"
          accent="put in writing."
          lead="We commit to these in the contract, not just on the website."
        >
          Commitments we
        </SectionHeading>

        <div className="grid gap-6 md:grid-cols-2 lg:auto-rows-[18rem] lg:grid-cols-3">
          {BENTO.map((b, i) => (
            <CommitmentTile
              key={b.title}
              item={b}
              index={i}
              /* 7 tiles: wide at both ends = 9 slots = three full rows.
                 5 tiles: only the first is wide, prototype 1's arrangement. */
              wide={i === 0 || (BENTO.length % 3 === 1 && i === last)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
