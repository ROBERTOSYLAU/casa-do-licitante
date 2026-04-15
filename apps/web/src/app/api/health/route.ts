import { prisma } from '@casa/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: Record<string, 'ok' | 'error'> = {};

  // Database check
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'ok';
  } catch {
    checks.database = 'error';
  }

  try {
    const redisUrl = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
    const { Redis } = await import('ioredis');
    const redis = new Redis(redisUrl, { maxRetriesPerRequest: 1, lazyConnect: true });
    await redis.connect();
    await redis.ping();
    await redis.quit();
    checks.redis = 'ok';
  } catch {
    checks.redis = 'error';
  }

  try {
    const hasComprasnetKey = Boolean(process.env['COMPRASNET_API_KEY']);
    checks.comprasnetApiKey = hasComprasnetKey ? 'ok' : 'error';
  } catch {
    checks.comprasnetApiKey = 'error';
  }

  const healthy = Object.values(checks).every((v) => v === 'ok');

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 },
  );
}
