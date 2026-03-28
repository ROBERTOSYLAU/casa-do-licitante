import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { QUEUE } from '@casa/domain';

const redisUrl = process.env['REDIS_URL'] ?? 'redis://localhost:6379';

export const redis = new IORedis(redisUrl, { maxRetriesPerRequest: null });

function makeQueue(name: string) {
  return new Queue(name, { connection: redis });
}

export const queues = {
  ingestPncp: makeQueue(QUEUE.INGEST_PNCP),
  ingestComprasnet: makeQueue(QUEUE.INGEST_COMPRASNET),
  validateCnpj: makeQueue(QUEUE.VALIDATE_CNPJ),
  validateCertidoes: makeQueue(QUEUE.VALIDATE_CERTIDOES),
  validateSancoes: makeQueue(QUEUE.VALIDATE_SANCOES),
  alertMatch: makeQueue(QUEUE.ALERT_MATCH),
  alertDeliver: makeQueue(QUEUE.ALERT_DELIVER),
  alertDeadlines: makeQueue(QUEUE.ALERT_DEADLINES),
  docsExtract: makeQueue(QUEUE.DOCS_EXTRACT),
};
