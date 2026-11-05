import type { NextConfig } from "next";
import { SLUG_REDIRECTS } from "./src/lib/slugs";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return SLUG_REDIRECTS;
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
