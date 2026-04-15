import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typedRoutes: true,
  outputFileTracingRoot: __dirname,
  transpilePackages: ['@casa/db', '@casa/domain', '@casa/gov-apis'],
  // Prevent Next.js from bundling Prisma — keeps node:child_process server-side only
  serverExternalPackages: ['@prisma/client', '.prisma/client'],
};

export default nextConfig;
