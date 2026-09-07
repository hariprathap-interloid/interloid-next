/* DS §11.2. ONLY links that resolve — HANDOFF §7 flags 20 dead links in the
   live site's footer as a P0 ("fabricated navigation"). The Industries and
   Resources columns are deliberately absent rather than stubbed. The four
   links that do not resolve yet carry data-placeholder so the toggle counts
   them; they are not hidden. */
const SERVICE_LINKS = [
  "Product engineering",
  "Data & analytics",
  "Cloud & DevOps",
  "AI integration",
  "Team augmentation",
];

const COMPANY_LINKS = [
  { href: "/why-choose-us", label: "Why Interloid" },
  { href: "/#process", label: "How we work" },
  { href: "/#work", label: "Selected work" },
  { href: "/#contact", label: "Contact" },
  { href: "/about", label: "About us", placeholder: "page not built yet" },
  { href: "/careers", label: "Careers", placeholder: "page not built yet" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-deep py-20 text-ink-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <div className="mb-5 flex items-center gap-2.5">
              <span
                className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent text-white"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                >
                  <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                  <path d="m2 17 10 5 10-5" />
                  <path d="m2 12 10 5 10-5" />
                </svg>
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                Interloid
              </span>
            </div>
            <p className="text-sm leading-relaxed text-ink-foreground/70">
              Senior product engineering. Defined problems to deployed software
              — in your accounts, on your repos.
            </p>
          </div>

          <div>
            <h3 className="mb-6 font-semibold text-white">Services</h3>
            <ul className="space-y-4 text-sm">
              {SERVICE_LINKS.map((l) => (
                <li key={l}>
                  <a href="/#services" className="transition-colors hover:text-white">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 font-semibold text-white">Company</h3>
            <ul className="space-y-4 text-sm">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="transition-colors hover:text-white"
                    {...(l.placeholder
                      ? { "data-placeholder": l.placeholder }
                      : {})}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 font-semibold text-white">Where we are</h3>
            <address
              className="text-sm not-italic leading-relaxed text-ink-foreground/70"
              data-placeholder="confirm address + phone"
            >
              Gobichettipalayam
              <br />
              Tamil Nadu, India
            </address>
            {/* §7 P1: the live site's meta says "Based in US & UK" while the
                only address is Tamil Nadu. This is the honest framing and
                still needs the user's confirmation. */}
            <p
              className="mt-4 text-sm text-ink-foreground/70"
              data-placeholder="P1: confirm geography framing"
            >
              India-based · US &amp; UK overlap hours
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-ink-foreground/60 md:flex-row">
          <p>© 2026 Interloid Technologies Private Limited. All rights reserved.</p>
          <div className="flex gap-6">
            <a
              href="#"
              className="transition-colors hover:text-white"
              data-placeholder="P0 LEGAL: page 404s today"
            >
              Privacy policy
            </a>
            <a
              href="#"
              className="transition-colors hover:text-white"
              data-placeholder="P0 LEGAL: page missing"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
