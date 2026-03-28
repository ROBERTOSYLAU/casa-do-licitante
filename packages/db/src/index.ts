import { PrismaClient } from './generated/prisma/index.js';

// Singleton pattern — prevents multiple Prisma instances in dev hot reload
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env['NODE_ENV'] === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { PrismaClient };
// Re-export generated types for convenience
export * from './generated/prisma/index.js';
