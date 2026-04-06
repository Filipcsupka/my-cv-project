import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",       // Static HTML export — served by nginx, zero Node.js at runtime
  trailingSlash: true,    // Needed for nginx to serve index.html in subdirs
  images: {
    unoptimized: true,    // Required for static export (no Next.js image server)
  },
};

export default nextConfig;
