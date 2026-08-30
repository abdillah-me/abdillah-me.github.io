import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves plain files, so emit a fully static site into `out/`.
  output: "export",
  // Trailing slashes make every route a directory with an index.html, which is
  // what a static file server needs to resolve /work without a rewrite rule.
  trailingSlash: true,
  // No image optimization server exists on Pages.
  images: { unoptimized: true },
};

export default nextConfig;
