"use client";

import { useCallback, useState } from "react";
import Icon from "../Icon";
import Reveal from "../Reveal";
import { TEAM_HEADING_VARIANTS } from "@/content/about";
import VariantArch from "./VariantArch";
import VariantBadge from "./VariantBadge";
import VariantDeck from "./VariantDeck";
import VariantEditorial from "./VariantEditorial";
import VariantFlip from "./VariantFlip";
import VariantMosaic from "./VariantMosaic";
import VariantRoster from "./VariantRoster";
import VariantSlide from "./VariantSlide";
import VariantStage from "./VariantStage";
import VariantTilt from "./VariantTilt";

/* ==========================================================================
   /team — THE TEAM-SECTION LAB. A decision artifact, not a page.
   ==========================================================================
   Requested 2026-09-08: the team section matters most to the user, so this
   route holds animated candidates side by side, crossed with four heading
   options, so design and copy can be judged independently.

   ── ROUND 3, same day. 10 candidates. ───────────────────────────────────
   Round 1 was rejected in full (role-first, deleted). Round 2 produced four
   photo-first options and the user picked FOCUS STAGE as the front-runner,
   then asked for more to compare it against. Six were added from five
   reference screenshots the user supplied — Deck, Arch, Slide, Roster, Badge,
   Editorial — so the shortlist now spans card wall, overlap, wave, list and
   editorial grid. Focus stage is first in the tab order and mounts by
   default: everything else is the challenger.

   ── ROUND 2 NOTE (kept) ──────────────────────────────────────────────────
   Round 1 (Constellation/Orbit/Spotlight/Credits) led every card with the
   ROLE and a glyph, because every seat was nameless — and the user's verdict
   was that all four missed the point: "the primary is to show image and
   LinkedIn and name and role." Round 2 is built photo-first on the committed
   placeholder portraits (/team/ph-*.svg), so what is being judged is how the
   PHOTOGRAPHS behave. The round-1 components are deleted, not parked — a
   rejected candidate kept in the tree is a second implementation.

   This is the same ritual as the repo-root HTML labs (motion-path-lab,
   spotlight-lab, why-interloid-lab): build the candidates, let the user pick,
   promote the winner, DELETE the lab. It lives as a route rather than a flat
   file because the candidates need the real tokens, the real content arrays
   and (for V1) the real three dependency — a CDN mock-up would re-open every
   gotcha the port already closed.

   ── WHAT PROMOTION MEANS, MECHANICALLY ───────────────────────────────────
   The winner's component replaces the body of `about/Team.tsx` (keeping the
   production banner's rules: placeholder flags, the three null fields, the
   note to the team). The winning heading's fields overwrite TEAM_HEADING in
   content/about.ts. Then this folder, the /team route, TEAM_HEADING_VARIANTS
   and `.teamlab.mjs` are all deleted. A lab that outlives its decision
   becomes a second implementation to keep in sync — the reason the archive
   directories in this repo are marked DO NOT EXTEND.

   ── WHY THE VARIANTS ARE MOUNTED ONE AT A TIME ───────────────────────────
   Not a long scrolling page of all four: V1 owns a WebGL context and V4 runs
   two infinite marquees, and stacking them would judge the variants by how
   they interfere. Switching unmounts the previous variant completely — which
   also proves each one's cleanup path every time the user changes tabs, a
   free test the HTML labs never had.

   The lab deliberately has NO Nav and NO Footer: it is not part of the site,
   must not look like it, and must never be reachable-looking enough to ship
   by accident. The route is noindex (page.tsx) and linked from nowhere. */

const VARIANTS = [
  /* Focus stage FIRST — the user's stated favourite, so it is the default
     mount and the thing every other option is compared against. */
  {
    key: "stage",
    name: "Focus stage",
    tech: "state + crossfade",
    judge:
      "FAVOURITE SO FAR. One person huge, the rest as a rail. Check: does it survive 12+ seats, and is one big photo worth six small ones?",
    Comp: VariantStage,
  },
  {
    key: "deck",
    name: "Deck",
    tech: "state + filter",
    judge:
      "Overlapping hand of cards; the active one lifts clear and gains colour. Check: does the overlap still read at 1024px, and does grayscale flatter or flatten your real photos?",
    Comp: VariantDeck,
  },
  {
    key: "arch",
    name: "Arch",
    tech: "CSS, zero JS",
    judge:
      "Curved photo panels on hue grounds, staggered into a wave. Best at unifying MIXED photography. Check: the curve eats the bottom of the frame — do your photos have headroom there?",
    Comp: VariantArch,
  },
  {
    key: "slide",
    name: "Slide",
    tech: "CSS, zero JS",
    judge:
      "Photo only at rest; a hue panel slides up with role, ownership and LinkedIn. Check: is hiding the role behind hover acceptable for a buyer who is scanning?",
    Comp: VariantSlide,
  },
  {
    key: "roster",
    name: "Roster",
    tech: "state + disclosure",
    judge:
      "A LIST, not a grid — rows that expand. The only option that scales to 20 people and reads identically on a phone. Check: is never showing a large photo a real loss?",
    Comp: VariantRoster,
  },
  {
    key: "badge",
    name: "Badge",
    tech: "CSS, zero JS",
    judge:
      "The reference card rebuilt in our tokens — badge on the seam, centred caption. Here so the comparison is honest. Check: does anything above actually beat it?",
    Comp: VariantBadge,
  },
  {
    key: "editorial",
    name: "Editorial",
    tech: "CSS, zero JS",
    judge:
      "No cards at all: hairline grid, grayscale, tiny type, its own two-column masthead. The one that ages best. Check: too cold for a page about pride in the team?",
    Comp: VariantEditorial,
  },
  {
    key: "tilt",
    name: "Tilt & shine",
    tech: "CSS 3D + vars",
    judge:
      "Portraits lean toward the cursor with a tracking shine. Check: premium or gimmick after the tenth hover?",
    Comp: VariantTilt,
  },
  {
    key: "flip",
    name: "Flip",
    tech: "CSS 3D",
    judge:
      "Photo in front, dossier on the back. Check: is the back worth hiding the face for?",
    Comp: VariantFlip,
  },
  {
    key: "mosaic",
    name: "Mosaic",
    tech: "CSS, zero JS",
    judge:
      "Photo bento with a slow idle drift — the only one whose motion works on a phone. Check: alive, or restless?",
    Comp: VariantMosaic,
  },
] as const;

export default function TeamLab() {
  const [v, setV] = useState(0);
  const [hd, setHd] = useState(0);
  const { Comp } = VARIANTS[v];

  /* The lab has no Nav, so it carries its own theme switch — same class,
     same storage key, same single-owner rule (the stage OBSERVES `.dark`;
     this button is the only writer on this page). */
  const toggleTheme = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("interloid-theme", next ? "dark" : "light");
    } catch {}
  }, []);

  return (
    <div className="min-h-svh bg-background">
      {/* ── the bench ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-foreground px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-background">
              Lab
            </span>
            <div>
              <p className="font-display text-[15px] font-bold leading-tight text-foreground">
                Team section — 10 photo-first variants × 4 headings
              </p>
              <p className="text-[12px] text-muted-foreground">
                Not linked from the site · noindex · winner gets promoted into{" "}
                <a href="/about#team" className="underline underline-offset-2">
                  /about
                </a>
                , then this route is deleted
              </p>
            </div>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            {/* variant tabs */}
            <div
              role="group"
              aria-label="Design variant"
              className="flex rounded-full border border-border bg-background p-1"
            >
              {VARIANTS.map((x, i) => (
                <button
                  key={x.key}
                  type="button"
                  aria-pressed={v === i}
                  onClick={() => setV(i)}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-200 ${
                    v === i
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {x.name}
                </button>
              ))}
            </div>

            {/* heading picker */}
            <div
              role="group"
              aria-label="Heading option"
              className="flex rounded-full border border-border bg-background p-1"
            >
              {TEAM_HEADING_VARIANTS.map((x, i) => (
                <button
                  key={x.key}
                  type="button"
                  aria-pressed={hd === i}
                  title={`${x.head} ${x.accent}`}
                  onClick={() => setHd(i)}
                  className={`rounded-full px-3 py-1.5 text-[13px] font-semibold uppercase transition-colors duration-200 ${
                    hd === i
                      ? "bg-accent text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {x.key}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="grid size-9 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted"
              aria-label="Toggle theme"
            >
              <Icon name="sparkle" className="size-4" />
            </button>
          </div>
        </div>

        {/* what to judge, per variant */}
        <div className="border-t border-hairline bg-secondary/60">
          <p className="mx-auto max-w-7xl px-6 py-2.5 text-[13px] leading-[1.6] text-muted-foreground">
            <span className="mr-2 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-muted-strong">
              {VARIANTS[v].tech}
            </span>
            {VARIANTS[v].judge}
          </p>
        </div>
      </header>

      {/* ── the candidate, mounted alone ──────────────────────────────── */}
      {/* Reveal, KEYED BY VARIANT — a bug the first screenshots caught. Three
          variants use SectionHeading, whose elements carry `data-reveal`, and
          globals.css holds every [data-reveal] at opacity 0 until Reveal's
          observer marks it. The lab did not mount Reveal at all, so those
          headings rendered INVISIBLE — while the harness's textContent check
          passed, because textContent does not care about opacity (it asserts
          computed opacity now).

          The key is what makes it work across switches: Reveal queries
          [data-reveal] ONCE, on mount, so a variant mounted later would never
          be observed. Remounting Reveal alongside each variant re-runs that
          query against the new DOM. */}
      <Reveal key={v} />
      <main>
        <Comp heading={TEAM_HEADING_VARIANTS[hd]} />
      </main>

      {/* ── the judging notes ─────────────────────────────────────────── */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h2 className="font-display text-[15px] font-bold text-foreground">
            Before picking, check each variant against all of these
          </h2>
          <ul className="mt-4 grid gap-x-10 gap-y-2 text-[13px] leading-[1.7] text-muted-foreground sm:grid-cols-2">
            <li>· Both themes — the toggle is in the bench.</li>
            <li>· OS reduced-motion on: every variant must still be complete and readable.</li>
            <li>· Hover a card and rest the cursor on its edge — nothing may move or flicker.</li>
            <li>· The nameless state is today&rsquo;s state: does it still look finished?</li>
            <li>· Imagine 12 seats, then 20 — which survives the roster growing?</li>
            <li>· Squint: which one still says &ldquo;these are real people&rdquo; at a glance?</li>
            <li>· Picture YOUR photos in it — mixed lighting, different rooms, phone shots.</li>
            <li>· Keyboard only: tab to the orbit nodes and the open-seat links.</li>
          </ul>
          <p className="mt-6 text-[13px] text-muted-foreground">
            All four render the same content from{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[12px]">
              content/about.ts
            </code>{" "}
            — TEAM, TEAM_OPEN, and the heading options in TEAM_HEADING_VARIANTS.
            Photographs, names and LinkedIn drop into every variant the same way.
          </p>
        </div>
      </footer>
    </div>
  );
}
