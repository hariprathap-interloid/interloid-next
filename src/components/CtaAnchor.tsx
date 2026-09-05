/* DS §11.1 — a light section wrapping a dark rounded slab.

   The 24 drifting particles use a seeded LCG so the layout is identical on
   every load and screenshot diffs stay meaningful. Because it is deterministic
   it runs at BUILD time in this Server Component rather than in the browser:
   same output, zero client JS. The prototype skipped them under
   prefers-reduced-motion; here globals.css's reduced-motion block already
   kills the animation, so the markup can render unconditionally. */
function particles() {
  let seed = 7;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  return Array.from({ length: 24 }, () => {
    const size = 1 + rnd() * 3;
    const dur = 8 + rnd() * 10;
    return {
      width: `${size.toFixed(1)}px`,
      height: `${size.toFixed(1)}px`,
      left: `${(rnd() * 100).toFixed(1)}%`,
      top: `${(rnd() * 100).toFixed(1)}%`,
      opacity: Number((0.1 + rnd() * 0.2).toFixed(2)),
      animation: `orb ${dur.toFixed(1)}s ease-in-out ${(rnd() * 5).toFixed(1)}s infinite`,
    };
  });
}

export default function CtaAnchor() {
  return (
    <section id="contact" className="relative bg-background px-4 pb-24 pt-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-4xl bg-ink px-6 py-12 text-center shadow-2xl sm:px-16 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-brand/40 via-ink to-ink"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-full max-w-[800px] -translate-x-1/2 rounded-t-full bg-accent/25 blur-[120px]"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {particles().map((p, i) => (
              <span key={i} className="absolute rounded-full bg-white" style={p} />
            ))}
          </div>

          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              <span className="text-sm font-medium text-ink-foreground">
                Free 30-minute consult · written proposal in 48 hours
              </span>
            </div>

            <h2 className="mb-8 font-display text-4xl font-medium leading-tight tracking-tight text-white md:text-5xl lg:text-7xl">
              Ready to turn a plan
              <br />
              <span className="bg-gradient-to-r from-accent to-brand-light bg-clip-text text-transparent">
                into working software?
              </span>
            </h2>

            {/* `on-dark` swaps the focus ring for the dark-ground variant.
                HANDOFF §5.2: a component's own box-shadow out-cascades the
                global ring, so the ring is COMPOSED into the shadow, never
                replacing it. */}
            <a
              href="mailto:hello@interloid.com"
              className="on-dark group inline-flex h-14 items-center gap-2 rounded-full border border-white/10 bg-accent px-10 text-lg font-bold text-white shadow-[0_0_40px_-10px_var(--accent)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-10px_var(--accent)] active:scale-95"
            >
              Book a free 30-min consult
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>

            {/* §10.1's conversational form is still unbuilt — this is a bare
                mailto. HANDOFF §6 item 5. */}
            <p className="mt-6 text-sm text-ink-foreground/70">
              Or email{" "}
              <a
                href="mailto:hello@interloid.com"
                className="on-dark text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                data-placeholder="confirm real address"
              >
                hello@interloid.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
