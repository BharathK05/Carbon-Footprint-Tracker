import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel deployment configuration
  reactStrictMode: true,
  
  // Image optimization
  images: {
    unoptimized: false,
  },

  // Headers for API security
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [];
  },

  // Rewrites
  async rewrites() {
    return [];
  },

  // Environment variables
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
};

export default nextConfig;
