import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  /* The repo root above this folder carries its own package-lock.json (the
     Playwright tooling for prototype3/), which Turbopack otherwise tries to
     adopt as the workspace root. Pin it here so builds are deterministic. */
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
