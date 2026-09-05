/* The eyebrow badge + two-tone H2 + optional lead, repeated identically by
   Services, Advantage, Process and Selected Work. In the prototype this was
   four hand-copied blocks; here it is one component, which is exactly the
   argument for porting before the a11y pass — a fix lands once, not four
   times.

   DS §1.2 rule 4 / §3.3: neutral clause + ONE gradient clause, always. The
   gradient is applied to a single inline span, never split across word spans —
   HANDOFF §5.13: background-clip paints on the parent, so inline-block
   children fall outside the clip and render as nothing.

   Note the H2 is font-medium (500), not bold. DS §3.2: at this size the scale
   carries the weight, not the stroke. That restraint is signature — the hero
   H1 is the only font-black on the page. */
export default function SectionHeading({
  eyebrow,
  lead,
  accent,
  children,
  className = "max-w-3xl",
}: {
  eyebrow: string;
  /** The neutral clause. */
  children: React.ReactNode;
  /** The single gradient clause. */
  accent: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={`mb-16 ${className}`}>
      <div
        data-reveal
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2"
      >
        <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </span>
      </div>
      <h2
        data-reveal
        style={{ "--delay": "100ms" } as React.CSSProperties}
        className="font-display text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
      >
        {children}{" "}
        <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
          {accent}
        </span>
      </h2>
      {lead && (
        <p
          data-reveal
          style={{ "--delay": "200ms" } as React.CSSProperties}
          className="mt-6 text-lg text-muted-foreground"
        >
          {lead}
        </p>
      )}
    </div>
  );
}
