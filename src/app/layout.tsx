import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

/* Body face. Self-hosted by next/font — no <link>, no render-blocking request
   to fonts.googleapis.com, and no first-paint layout shift. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* Display face. Satoshi is a Fontshare font, so there is no next/font/google
   loader for it — the four weights are vendored into src/fonts/ and loaded
   locally. This is what removes api.fontshare.com from the critical path.

   There is NO 600. Satoshi ships 300/400/500/700/900; the page asks for
   font-semibold in a handful of places (all mobile-menu links) and CSS font
   matching resolves those up to 700. Invisible at that size — HANDOFF §5.23.
   Do not invent a 600 by faking it here. */
const satoshi = localFont({
  variable: "--font-satoshi",
  display: "swap",
  src: [
    { path: "../fonts/Satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Satoshi-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/Satoshi-900.woff2", weight: "900", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Interloid — Senior product engineering",
  description:
    "Interloid is a senior product-engineering team. Defined problems to deployed software, in your accounts, on your repos.",
};

/* Resolved before first paint so a stored dark preference does not flash light.
   HANDOFF §5.19: script.js owns the `.dark` class and the WebGL stage only
   OBSERVES it — two owners is a race. This inline script is the earliest of
   those writers and must stay ahead of the stylesheet.

   suppressHydrationWarning on <html> is required, not optional: this script
   mutates the class attribute before React hydrates, so the server markup and
   the client DOM legitimately disagree on it. */
const themeScript = `(function(){try{var t=localStorage.getItem("interloid-theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${satoshi.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="overflow-x-hidden bg-background font-sans text-muted-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
