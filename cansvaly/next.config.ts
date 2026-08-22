import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '*.app.github.dev',
        'bookish-space-pancake-gx5x7q494vw63pvv7-3000.app.github.dev',
      ],
    },
  },
};

export default nextConfig;
