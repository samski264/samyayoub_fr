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
  // Static media (images + clips) is content-stable, so cache it aggressively.
  // This guarantees each file is fetched once and reused for every repeated
  // instance in the marquees, instead of revalidating on each re-display
  // (the default for /public is `max-age=0`).
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/video/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
