"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/* DS §6.1 morphing pill: width (max-w-7xl→6xl), surface (transparent→glass)
   and radius (0→rounded-full) animate together over 300ms.

   HANDOFF §4: 8 links, desktop pill at `xl:` (1280px); below that the mobile
   menu. `/careers` was built 2026-09-07 and its flag is gone; `/about` still
   does not exist and 404s — kept honest with data-placeholder rather than
   removed, so the placeholder toggle still counts it (§7 P1). */
const LINKS = [
  { href: "/#home", label: "Home" },
  /* Both sections moved off home to /services 2026-09-08; Stack keeps its
     fragment because StackMarquee kept `id="stack"` on the new page. */
  { href: "/services", label: "Services" },
  { href: "/services#stack", label: "Stack" },
  { href: "/why-choose-us", label: "Commitments" },
  { href: "/#process", label: "Process" },
  { href: "/#work", label: "Work" },
  { href: "/about", label: "About us", placeholder: "page not built yet" },
  { href: "/careers", label: "Careers" },
] as const;

/* THEME AS EXTERNAL STATE.
   `.dark` on <html> is not React's to own: the inline script in layout.tsx
   writes it before hydration, and HeroStage reads it too. Mirroring it into
   useState meant a setState inside an effect — which the react-hooks lint
   correctly rejects, because that is a cascading render on every mount.
   useSyncExternalStore is the right shape: React subscribes to the DOM.

   getServerSnapshot returns false because the page is light-first; the inline
   script corrects it before first paint, and useSyncExternalStore re-reads
   after hydration without a mismatch warning. */
const subscribeTheme = (onChange: () => void) => {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => obs.disconnect();
};
const getTheme = () => document.documentElement.classList.contains("dark");
const getServerTheme = () => false;

const REST = "max-w-7xl px-0 border-transparent";
const PILL =
  "max-w-6xl px-6 py-2 bg-card/80 backdrop-blur-lg shadow-lg border-border rounded-full";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dark = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  const [current, setCurrent] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* ---- scroll -------------------------------------------------------------
     Passive listener, and it must be removed on unmount: without a cleanup,
     hot reload stacks a fresh listener on every edit (TAILWIND-MAP §4). This
     is a failure mode the static prototype could not have. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Writing the class IS the state update — the store above picks it up.
     HeroStage observes the same class rather than owning it; two owners is a
     race (HANDOFF §5.19). */
  const toggleTheme = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("interloid-theme", next ? "dark" : "light");
    } catch {}
  }, []);

  /* ---- scrollspy ----------------------------------------------------------
     Marks the nav link whose section is in the reading band. rootMargin
     "-45% 0px -50%" leaves a thin strip across the middle of the viewport, so
     a section counts as current only while it is actually being read.

     threshold 0, never a fraction — HANDOFF §5.6: a tall element cannot reach
     a fractional threshold of a shrunken root at 400% zoom, and every section
     here is taller than the strip. */
  useEffect(() => {
    /* Links are "/#id" now so they work from any page; the scrollspy only
       cares about the fragment, and only on a page that actually has it. */
    const targets = LINKS.map((l) =>
      l.href.includes("#") ? document.querySelector("#" + l.href.split("#")[1]) : null,
    ).filter(Boolean) as Element[];
    if (!targets.length) return;

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(`/#${e.target.id}`);
        });
      },
      { threshold: 0, rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => spy.observe(t));
    return () => spy.disconnect();
  }, []);

  /* ---- mobile menu: outside click, Escape, and breakpoint ---------------- */
  useEffect(() => {
    if (!open) return;

    const onDocClick = (e: MouseEvent) => {
      const path = e.composedPath();
      if (
        menuRef.current &&
        toggleRef.current &&
        !path.includes(menuRef.current) &&
        !path.includes(toggleRef.current)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    /* 1280, not the prototype's 1024. The desktop pill appears at `xl:`
       (1280px), so between 1024 and 1279 the mobile menu is still the ONLY
       navigation — closing it at 1024 shut the menu on a viewport that has no
       other nav. Fixed in the port. */
    const mq = window.matchMedia("(min-width: 1280px)");
    const onBreak = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };

    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onBreak);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onBreak);
    };
  }, [open]);

  const linkClass = (href: string) =>
    `nav-link rounded-full px-4 py-2 text-sm transition-all hover:bg-card hover:text-primary ${
      current === href
        ? "bg-card text-primary font-semibold shadow-sm"
        : "font-medium text-muted-foreground"
    }`;

  return (
    <>
      <nav
        id="nav"
        aria-label="Primary"
        className={`fixed left-0 right-0 top-0 z-50 flex justify-center px-4 transition-[padding] duration-300 ease-in-out ${
          scrolled ? "py-3" : "py-6"
        }`}
      >
        <div
          className={`relative flex w-full items-center justify-between gap-6 border transition-all duration-300 ease-in-out ${
            scrolled ? PILL : REST
          }`}
        >
          <a
            href="/"
            className="flex shrink-0 items-center gap-2.5 rounded-full"
            aria-label="Interloid home"
          >
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
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Interloid
            </span>
          </a>

          {/* §6.2 a pill inside a pill */}
          <div className="hidden items-center gap-1 rounded-full border border-white/40 bg-card/80 px-3 py-2 p-1 shadow-sm backdrop-blur-sm xl:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={linkClass(l.href)}
                aria-current={current === l.href ? "true" : undefined}
                {...("placeholder" in l
                  ? { "data-placeholder": l.placeholder }
                  : {})}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Two SVGs toggled by class, never innerHTML — HANDOFF §5.3:
                replacing a button's contents detaches the click's original
                target. React keeps the node stable, but rendering both and
                hiding one means the bug cannot come back by refactor. */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={dark}
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
              className="grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-muted"
            >
              <svg
                data-icon="moon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`size-5 ${dark ? "hidden" : ""}`}
                aria-hidden="true"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
              <svg
                data-icon="sun"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`size-5 ${dark ? "" : "hidden"}`}
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            </button>

            {/* "/#contact", not "#contact": a bare fragment is a no-op on any
                page without that section, i.e. everything except home. */}
            <a
              href="/#contact"
              className="hidden rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-brand-light hover:shadow-primary/40 active:scale-95 xl:inline-flex"
            >
              Let&apos;s talk
            </a>

            <button
              ref={toggleRef}
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobileMenu"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((o) => !o);
              }}
              className="grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-muted xl:hidden"
            >
              <svg
                data-icon="menu"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={`size-6 ${open ? "hidden" : ""}`}
                aria-hidden="true"
              >
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
              <svg
                data-icon="close"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={`size-6 ${open ? "" : "hidden"}`}
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* HANDOFF §5.4: a closed menu hidden only with opacity/pointer-events
          keeps its links in the tab order. `invisible` is load-bearing. */}
      <div
        ref={menuRef}
        id="mobileMenu"
        className={`fixed left-4 right-4 top-24 z-40 origin-top rounded-3xl border border-border bg-card p-6 shadow-2xl transition-all duration-300 ease-in-out xl:hidden ${
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-2 py-3.5 font-display text-lg font-semibold text-foreground transition-colors hover:text-primary"
              {...("placeholder" in l
                ? { "data-placeholder": l.placeholder }
                : {})}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/#contact"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25"
          >
            Book a free 30-min consult
          </a>
        </nav>
      </div>
    </>
  );
}
