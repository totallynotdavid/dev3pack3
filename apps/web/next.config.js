/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    optimizePackageImports: ["lucide-react", "lodash-es"],
  },
  images: {
    remotePatterns: [
      {
        // Allow all hostnames in development (restrict in production)
        hostname: "*",
      },
    ],
  },
  typedRoutes: false,

  // Used in the Dockerfile
  output:
    process.env.NEXT_OUTPUT === "standalone"
      ? "standalone"
      : process.env.NEXT_OUTPUT === "export"
        ? "export"
        : undefined,

  // Cache headers for static assets and API routes
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    return [
      // In development, prevent aggressive caching of dynamic chunks
      ...(isDev
        ? [
            {
              source: "/_next/static/chunks/:path*",
              headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
            },
          ]
        : []),
      {
        // Public folder assets - cache for 1 month (logos, favicons, etc.)
        source: "/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|webmanifest)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=31536000",
          },
        ],
      },
      {
        // OG Image API - cache for 1 day
        source: "/api/og",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
};

export default config;
