import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Replicate puede tardar hasta 60s en cold start
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
