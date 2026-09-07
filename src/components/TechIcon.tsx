/* ==========================================================================
   TECH MARKS — brand icons for the stack, added 2026-09-08 on request
   ("use the icons for the technology, not words").

   ── WHY THIS IS NOT Icon.tsx ─────────────────────────────────────────────
   Icon.tsx is Lucide: one visual language, 24×24, `fill="none"`,
   `stroke="currentColor"`, stroke-width 2, and it inherits the surrounding
   text colour. These are the opposite on every count — they are FILLED,
   they carry their own brand colour, and each one has its own construction.
   Mixing them into Icon.tsx would mean a component whose props mean different
   things depending on the name, and every future caller getting it wrong once.

   This does not break CLAUDE.md's "inline Lucide only" rule, which exists to
   keep EMOJI out of the interface — the live site uses emoji as iconography
   and the review names it the most visible unpolish. A product's own mark is
   not emoji, and there is no Lucide glyph that means "Ruby on Rails".

   ── ACCURACY, AND ITS LIMIT ──────────────────────────────────────────────
   These are hand-authored from the published marks, not copied from an icon
   package — there is none installed and adding one for eight glyphs is not
   worth a dependency. Three are exact by construction (React's three orbits,
   Node's hexagon, TypeScript's monogram square). Postgres and Docker are
   NOT their real marks: an elephant and a whale do not survive being drawn at
   16px by hand, so they are drawn as what they are — a database cylinder and
   stacked containers — in the brand colour. If a real logo set ever arrives,
   those two are the ones to replace first.

   Colours are the official brand hexes and are LITERAL, in both themes. A
   brand mark that changes colour with the page theme is no longer the brand
   mark; these sit on a light chip in both themes for that reason (see the
   `bg-white` on the chip in Roles.tsx). `currentColor` appears nowhere here.
   ========================================================================== */

type Mark = { label: string; color: string; body: React.ReactNode };

const MARKS: Record<string, Mark> = {
  /* Three orbits at 0/60/120° plus the nucleus — the mark's real
     construction, so this one is exact rather than an impression. */
  react: {
    label: "React",
    color: "#61DAFB",
    body: (
      <>
        <circle cx="12" cy="12" r="2.05" fill="currentColor" />
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          transform="translate(12 12)"
        >
          <ellipse rx="10" ry="3.85" />
          <ellipse rx="10" ry="3.85" transform="rotate(60)" />
          <ellipse rx="10" ry="3.85" transform="rotate(120)" />
        </g>
      </>
    ),
  },
  /* Node's mark is a hexagon, flat-top rotated to point-top. */
  node: {
    label: "Node.js",
    color: "#5FA04E",
    body: (
      <>
        <path
          d="M12 1.6 21.4 7v10L12 22.4 2.6 17V7L12 1.6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M9.1 9.2v4.9c0 .9-.5 1.4-1.3 1.4-.7 0-1.2-.4-1.4-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M17.4 10.4c-.3-.8-1-1.2-2.1-1.2-1.3 0-2.1.6-2.1 1.5 0 2 4.4 1 4.4 3.1 0 1-.9 1.6-2.3 1.6-1.2 0-2-.4-2.3-1.3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </>
    ),
  },
  /* Ruby: the faceted gem — a trapezoid crown over a point, with the facet
     lines that make it read as cut rather than as a plain polygon. */
  ruby: {
    label: "Ruby on Rails",
    color: "#CC342D",
    body: (
      <>
        <path
          d="M6 4h12l4 5-10 11L2 9l4-5Z"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M6 4 8.6 9 12 20 15.4 9 18 4M2 9h20M8.6 9h6.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  /* Python's two interlocking bodies. FIRST ATTEMPT WAS REDRAWN: it was one
     hand-written path per body and rendered as an unreadable dark blob at
     20px — the interlock, which is the whole recognisable part, did not read.
     This version is FOUR RECTANGLES, two per body: a head across the top and
     a body descending on the left, mirrored for the yellow half. Simple
     geometry beats an approximate trace at this size, and it is exact enough
     that the silhouette is right.

     The yellow is hardcoded rather than derived: this is the one mark with
     TWO brand colours, and `color` on the <svg> can only carry one. */
  python: {
    label: "Python",
    color: "#3776AB",
    body: (
      <>
        <rect x="12" y="10" width="10" height="8" rx="3" fill="#FFD43B" />
        <rect x="6" y="14" width="12" height="8" rx="3" fill="#FFD43B" />
        <circle cx="15.2" cy="18.6" r="1" fill="#0B3A5E" />
        <rect x="6" y="2" width="12" height="8" rx="3" fill="currentColor" />
        <rect x="2" y="6" width="10" height="8" rx="3" fill="currentColor" />
        <circle cx="8.8" cy="5.4" r="1" fill="#fff" />
      </>
    ),
  },
  /* TypeScript's mark IS a monogram in a rounded square — so the letters are
     the logo here, not a fallback for one. */
  typescript: {
    label: "TypeScript",
    color: "#3178C6",
    body: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="3" fill="currentColor" />
        <text
          x="12"
          y="16.6"
          textAnchor="middle"
          fill="#fff"
          fontSize="10.5"
          fontWeight="700"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          TS
        </text>
      </>
    ),
  },
  /* Tailwind's double wave. */
  tailwind: {
    label: "Tailwind CSS",
    color: "#06B6D4",
    body: (
      <path
        d="M12 6c-2.7 0-4.3 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.8.2 1.3.8 2 1.5 1 1.1 2.2 2.4 4.7 2.4 2.7 0 4.3-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.8-.2-1.3-.8-2-1.5C15.7 7.3 14.5 6 12 6Zm-5 6c-2.7 0-4.3 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.8.2 1.3.8 2 1.5 1 1.1 2.2 2.4 4.7 2.4 2.7 0 4.3-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.8-.2-1.3-.8-2-1.5-1-1.1-2.2-2.4-4.7-2.4Z"
        fill="currentColor"
      />
    ),
  },
  /* Git's mark: the rotated square with a commit line through it. THE FIRST
     VERSION WAS WRONG — a malformed arc that drew as a dot with a hook and
     did not read as Git at all. This is the real construction: a diamond, a
     diagonal from the bottom-left node to the top-right one, and a branch off
     its middle to a third node. */
  git: {
    label: "Git",
    color: "#F05032",
    body: (
      <>
        <path
          d="M12 1.8 22.2 12 12 22.2 1.8 12Z"
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M7.8 15.2 14.2 8.8M11 12l3.6 3.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="7.6" cy="15.4" r="1.7" fill="currentColor" />
        <circle cx="14.4" cy="8.6" r="1.7" fill="currentColor" />
        <circle cx="14.9" cy="15.9" r="1.7" fill="currentColor" />
      </>
    ),
  },
  /* NOT the elephant — see the banner. A database cylinder in Postgres blue. */
  postgres: {
    label: "PostgreSQL",
    color: "#4169E1",
    body: (
      <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <ellipse cx="12" cy="6" rx="7.5" ry="3" />
        <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
        <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
      </g>
    ),
  },
  /* NOT the whale — see the banner. Stacked containers in Docker blue. */
  docker: {
    label: "Docker",
    color: "#2496ED",
    body: (
      <g fill="currentColor">
        <rect x="3" y="12" width="4" height="4" rx="0.6" />
        <rect x="8" y="12" width="4" height="4" rx="0.6" />
        <rect x="13" y="12" width="4" height="4" rx="0.6" />
        <rect x="8" y="7" width="4" height="4" rx="0.6" />
        <rect x="13" y="7" width="4" height="4" rx="0.6" />
        <path
          d="M2 16.5h16c2.5 0 4-1.4 4.3-3.3-1-.6-2.3-.6-3.4-.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </g>
    ),
  },
};

export type TechName = keyof typeof MARKS;

/* Icon-only, so it MUST carry its own accessible name — `role="img"` plus a
   <title>, which is what a screen reader announces. `title` on the wrapper is
   the sighted equivalent: a hover tooltip, so nobody has to guess a mark they
   do not recognise. An icon-only chip without both of these is just a
   decoration that happens to mean something. */
export default function TechIcon({
  name,
  className = "size-5",
}: {
  name: string;
  className?: string;
}) {
  const m = MARKS[name];
  if (!m) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ color: m.color }}
      role="img"
      /* aria-label, NOT aria-labelledby pointing at the <title>. The same mark
         appears in several role cards (`git` is in all four), and an id-based
         reference would mean duplicate ids in the document — invalid, and the
         reference resolves to whichever came first. The <title> stays because
         it is what browsers show as a hover tooltip. */
      aria-label={m.label}
    >
      <title>{m.label}</title>
      {m.body}
    </svg>
  );
}

export function techLabel(name: string) {
  return MARKS[name]?.label ?? name;
}
