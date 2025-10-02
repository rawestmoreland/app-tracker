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
      {
        protocol: 'https',
        hostname: 'pub-ca11f01127864e4e91912c74f726069c.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'tailwindcss.com',
      },
      {
        protocol: 'https',
        hostname: 'wellfound.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/terms-of-service',
        destination: '/tos.html',
      },
      {
        source: '/privacy-policy',
        destination: '/privacy.html',
      },
      {
        source: '/cookie-policy',
        destination: '/cookie-policy.html',
      },
    ];
  },
};

export default nextConfig;
