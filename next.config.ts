// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  crossOrigin: "anonymous",
  // If you need remote images, configure:
  // images: { remotePatterns: [{ protocol: "https", hostname: "example.com" }] },
};

export default nextConfig;
