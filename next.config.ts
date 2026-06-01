import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/assets/:path*",
        destination: "/archives/assets/:path*",
      },
    ];
  },
};

export default nextConfig;
