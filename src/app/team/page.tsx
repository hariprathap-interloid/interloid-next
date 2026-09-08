import type { Metadata } from "next";
import TeamLab from "@/components/team-lab/TeamLab";

export const metadata: Metadata = {
  title: "LAB — team section variants",
  /* A lab must never be indexed: it shows four half-truths at once and
     none of them is the site. The route is also linked from nowhere. */
  robots: { index: false, follow: false },
};

/* /team — the team-section lab. See TeamLab.tsx's banner for the full
   contract: four variants × four headings, winner promoted into /about's
   Team.tsx + TEAM_HEADING, then this route and the team-lab folder are
   DELETED. A lab that outlives its decision is a second implementation. */
export default function TeamLabPage() {
  return <TeamLab />;
}
