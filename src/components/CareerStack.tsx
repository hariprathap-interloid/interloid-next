import SectionHeading from "./SectionHeading";
import { CAREER_STACK } from "@/content/site";

/* "The stack you would actually touch."

   Home has StackMarquee for this — a scrolling ribbon of twelve names. That is
   the right object for a client, where the message is breadth and the reader
   is not auditing it. It is the wrong object for a candidate, who reads a
   stack list to answer one question: which of these would be on MY screen.
   A moving strip cannot be scanned for a specific word, so this is a static
   grid grouped by layer instead.

   Four groups, four columns, and the group names are verbs — Ship / Serve /
   Run / Work — because the layer a tool belongs to is more useful to a
   candidate than its category noun. The last group is the one most careers
   pages omit and most engineers care about: what the day looks like in
   writing, not what the runtime is.

   Nothing here is flagged. Every name in the first three groups is already in
   STACK or in a ROLE above; the fourth is tooling the site already describes
   using (repo access, a shared channel, a sprint board). */
export default function CareerStack() {
  return (
    <section
      id="career-stack"
      className="relative overflow-hidden border-t border-border bg-secondary py-32"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The tools"
          icon="layers"
          accent="not a logo wall."
          lead="Grouped by where it sits, so you can find the layer you want to work at instead of counting badges."
        >
          What is actually on your screen,
        </SectionHeading>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CAREER_STACK.map((g, i) => (
            <div
              key={g.group}
              data-reveal
              style={{ "--delay": `${i * 90}ms` } as React.CSSProperties}
              className="h-full"
            >
              <div className="flex h-full flex-col rounded-[1.5rem] border border-border bg-card p-7 shadow-sm transition-[border-color,box-shadow] duration-300 ease-out hover:border-accent/30 hover:shadow-md">
                <h3 className="font-display text-lg font-bold leading-[1.4] tracking-[-0.015em] text-foreground">
                  {g.group}
                </h3>
                <p className="mb-5 mt-1 text-[13px] text-muted-foreground">
                  {g.note}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((t) => (
                    <li
                      key={t}
                      className="rounded-full bg-background px-3 py-1.5 text-[13px] font-medium text-muted-strong ring-1 ring-border"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <p
          data-reveal
          style={{ "--delay": "400ms" } as React.CSSProperties}
          className="mt-8 max-w-3xl text-[15px] leading-[1.7] text-muted-foreground"
        >
          Everything runs in the client&rsquo;s own GitHub organisation and
          their own cloud accounts — which means you learn their systems, not a
          private framework of ours, and everything you write stays legible to
          the next engineer who opens it.
        </p>
      </div>
    </section>
  );
}
