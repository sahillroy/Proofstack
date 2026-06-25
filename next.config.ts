import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.githubusercontent.com",
      },
    ],
  },
  // Required for PostHog to work correctly with Next.js App Router
  async rewrites() {
    return [
      {
        source: "/ingest/:path*",
        destination: "https://app.posthog.com/:path*",
      },
    ]
  },
}

export default nextConfig
