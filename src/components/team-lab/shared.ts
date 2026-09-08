import type { TEAM, TEAM_HEADING_VARIANTS } from "@/content/about";

/* Shared bits for the /team lab variants — deliberately tiny. Each variant is
   meant to be a self-contained candidate that can be deleted without a trace,
   so the only things allowed in here are the pieces every variant would
   otherwise copy verbatim. */

export type Member = (typeof TEAM)[number];
export type Heading = (typeof TEAM_HEADING_VARIANTS)[number];

/* Initials from a full name — same rule as the production Team.tsx: first
   letter of the first and last words, so "Siva Selvan" → SS; a single name
   gives its first two letters. Only reached when a member has a name but no
   photograph. */
export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (
    parts.length > 1
      ? parts[0][0] + parts[parts.length - 1][0]
      : name.slice(0, 2)
  ).toUpperCase();
}
