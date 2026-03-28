/**
 * Worker entry point — starts all BullMQ workers and cron schedulers.
 * Managed by PM2 as the `worker` process.
 */
import { Worker } from 'bullmq';
import { redis, queues } from './queues/index.js';
import { handleIngestPncp } from './jobs/ingest-pncp.js';
import { QUEUE } from '@casa/domain';

console.log('[worker] Starting Casa do Licitante worker...');

// ── Ingestion workers ────────────────────────────────────────────────────────

const pncpWorker = new Worker(QUEUE.INGEST_PNCP, handleIngestPncp, {
  connection: redis,
  concurrency: 2,
});

pncpWorker.on('completed', (job) =>
  console.log(`[ingest:pncp] job ${job.id} completed`),
);
pncpWorker.on('failed', (job, err) =>
  console.error(`[ingest:pncp] job ${job?.id} failed:`, err.message),
);

// ── Cron schedulers ──────────────────────────────────────────────────────────

async function scheduleCrons() {
  const today = new Date().toISOString().slice(0, 10);

  // PNCP every 15 minutes
  await queues.ingestPncp.upsertJobScheduler(
    'pncp-cron',
    { pattern: '*/15 * * * *' },
    {
      name: QUEUE.INGEST_PNCP,
      data: { source: 'pncp', dataInicial: today, dataFinal: today },
    },
  );

  // ComprasNet every 30 minutes
  await queues.ingestComprasnet.upsertJobScheduler(
    'comprasnet-cron',
    { pattern: '*/30 * * * *' },
    {
      name: QUEUE.INGEST_COMPRASNET,
      data: { source: 'comprasnet', dataInicial: today, dataFinal: today },
    },
  );

  console.log('[worker] Cron schedulers registered.');
}

scheduleCrons().catch(console.error);

// ── Graceful shutdown ────────────────────────────────────────────────────────

async function shutdown() {
  console.log('[worker] Shutting down...');
  await pncpWorker.close();
  await redis.quit();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
