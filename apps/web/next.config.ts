import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  transpilePackages: ['@casa/db', '@casa/domain', '@casa/gov-apis'],
};

export default nextConfig;
