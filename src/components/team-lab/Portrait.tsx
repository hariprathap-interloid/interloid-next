import Icon from "../Icon";
import { HUE } from "@/content/site";
import type { Member } from "./shared";

/* The shared portrait block for round-2 lab variants — photo, LinkedIn chip,
   and (optionally) a caption scrim with name + role. Every seat now carries
   committed placeholder art (`/team/ph-*.svg`), so unlike round 1 the
   variants are judged on the thing the user actually asked for: how the
   PHOTOGRAPHS behave. */
export function LinkedInChip({ m, size = 10 }: { m: Member; size?: 9 | 10 }) {
  if (!m.linkedin) return null;
  return (
    <a
      href={m.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${m.name ?? m.role} on LinkedIn`}
      className={`absolute right-3 top-3 grid place-items-center rounded-full bg-white/95 text-[#0A66C2] shadow-md ring-1 ring-black/5 backdrop-blur-sm transition-[background-color,color] duration-300 hover:bg-[#0A66C2] hover:text-white ${
        size === 10 ? "size-10" : "size-9"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden="true">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM10 9h3.8v1.7h.05a4.2 4.2 0 0 1 3.75-2c4 0 4.75 2.6 4.75 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2.05 1.4-2.05 2.8V21h-4z" />
      </svg>
    </a>
  );
}

export function Portrait({
  m,
  caption = true,
  className = "",
}: {
  m: Member;
  /** Caption scrim (name + role over the photo's foot). Off when a variant
   *  places the text outside the frame. */
  caption?: boolean;
  /** MUST include the box's own positioning and size — `relative aspect-…`
   *  or `absolute inset-0`. The first version hardcoded `relative` here, and
   *  a caller passing `absolute inset-0` produced BOTH utilities on one node:
   *  whichever wins stylesheet order, the caller's intent loses, and in the
   *  flip variant the root collapsed to zero height — every front face
   *  rendered blank while the harness's img COUNT still passed. Positioning
   *  belongs to whoever owns the layout; this component only owns the
   *  clipping and the contents. */
  className: string;
}) {
  const h = HUE[m.hue];
  return (
    <div className={`overflow-hidden ${className}`}>
      {m.img ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={`/team/${m.img}`}
          alt={m.name ?? m.role}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <div className={`absolute inset-0 grid place-items-center ${h.soft}`}>
          <span className={`opacity-30 ${h.text}`} aria-hidden="true">
            <Icon name={m.k} className="size-16" />
          </span>
        </div>
      )}
      {caption && (
        <>
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 via-ink/35 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="font-display text-[15px] font-bold leading-[1.3] text-white">
              {m.name ?? "Named in your proposal"}
            </p>
            <p className="mt-0.5 text-[12px] font-semibold text-white/80">{m.role}</p>
          </div>
        </>
      )}
      <LinkedInChip m={m} size={9} />
    </div>
  );
}
