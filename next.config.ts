import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all https hosts (adjust to restrict for security/perf)
      },
    ],
  },
};

export default nextConfig;
