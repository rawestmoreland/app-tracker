import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
    ],
  },
};

export default nextConfig;
