import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/auth/login", destination: "/login", permanent: false },
      { source: "/auth/signup", destination: "/signup", permanent: false },
    ];
  },
  /** Proxy /api/* to the Express backend (set BACKEND_URL in .env.local, e.g. http://127.0.0.1:4001). */
  async rewrites() {
    const backend = process.env.BACKEND_URL;
    if (!backend) return [];
    const origin = backend.replace(/\/$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${origin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
