"use client";

import { useState } from "react";
import CapabilityShowcase from "./CapabilityShowcase";
import TechStacks from "./TechStacks";

/* The two sections that share one piece of state: which service's stack is
   selected. A reader working through the capabilities can follow "the whole
   stack" from any block and land on THAT service's tab in #technologies,
   rather than on whichever tab was last open.

   It exists only to own that number. Both children are already Client
   Components, so this adds no boundary the page did not already have, and
   keeping the state here rather than in a context means the two sections stay
   independently usable on a future per-service page. */
export default function CapabilitiesAndStacks() {
  const [stackTab, setStackTab] = useState(0);

  return (
    <>
      <CapabilityShowcase onStackLink={setStackTab} />
      <TechStacks active={stackTab} onChange={setStackTab} />
    </>
  );
}
