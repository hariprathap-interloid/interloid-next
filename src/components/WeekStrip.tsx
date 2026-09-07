import SectionHeading from "./SectionHeading";
import { WEEK } from "@/content/site";

/* "A normal week, working with us" — prototype2-archive's `.week` / `.day`.

   Five cards, and five does not divide into a 2/3/4 grid cleanly, which is why
   this is `lg:grid-cols-5` — a single row of five narrow columns, read as a
   timeline left to right. Mon → Anytime is a SEQUENCE; wrapping it onto two
   rows would put Friday under Monday and break the one thing the block is
   communicating.

   Friday is the only highlighted card (`hi` in site.ts). The archive marks it
   too: the demo is the ceremony the rest of the week is built around, so the
   row has a destination rather than five equal beats. */
export default function WeekStrip() {
  return (
    <section
      id="week"
      className="relative overflow-hidden border-t border-border bg-secondary py-32"
    >
      <div
        className="pointer-events-none absolute bottom-0 left-0 size-[520px] -translate-x-1/3 translate-y-1/3 rounded-full bg-brand/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Direct, by default"
          icon="clock"
          accent="working with us."
          lead="No account managers relaying messages, no monthly steering decks. This is what the communication actually looks like."
        >
          A normal week,
        </SectionHeading>

        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {WEEK.map((d, i) => (
            /* Wrapper reveals, card carries the state classes — the split from
               WorkCard's note. Nothing here is stateful yet, but the next
               person to add a hover would hit the same collision. */
            <li
              key={d.tag}
              data-reveal
              style={{ "--delay": `${i * 80}ms` } as React.CSSProperties}
              className="h-full"
            >
              <div
                className={`flex h-full flex-col rounded-[1.25rem] border p-6 transition-[border-color,box-shadow] duration-300 ease-out ${
                  d.hi
                    ? "border-accent/40 bg-card shadow-md ring-1 ring-accent/15"
                    : "border-border bg-card shadow-sm hover:border-accent/30 hover:shadow-md"
                }`}
              >
                <span
                  className={`mb-3 inline-flex w-fit rounded-full px-2.5 py-[3px] text-[11px] font-bold uppercase tracking-[0.08em] ${
                    d.hi
                      ? "bg-accent/12 text-accent-strong ring-1 ring-accent/25"
                      : "bg-background text-muted-foreground ring-1 ring-border"
                  }`}
                >
                  {d.tag}
                </span>
                <h3 className="mb-2 font-display text-[17px] font-bold leading-[1.4] tracking-[-0.015em] text-foreground">
                  {d.title}
                </h3>
                <p className="text-[15px] leading-[1.65] text-muted-foreground">
                  {d.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
