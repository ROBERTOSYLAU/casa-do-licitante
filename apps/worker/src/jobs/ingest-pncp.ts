/**
 * ingest:pncp job — fetches yesterday's publications from PNCP and upserts
 * into the canonical licitacoes table.
 *
 * Pattern: fetch raw → store in raw_pncp_records → normalize → upsert canonical
 * Idempotent: uses upsert on (source, sourceId)
 */
import type { Job } from 'bullmq';
import { prisma } from '@casa/db';
import { fetchPncpBids } from '@casa/gov-apis';
import type { IngestJobPayload } from '@casa/domain';

export async function handleIngestPncp(job: Job<IngestJobPayload>) {
  const { dataInicial, dataFinal } = job.data;
  const syncLog = await prisma.syncLog.create({
    data: { source: 'pncp', jobId: job.id, startedAt: new Date(), status: 'running' },
  });

  let fetched = 0;
  let upserted = 0;

  try {
    const results = await fetchPncpBids({ dataInicial, dataFinal, source: 'pncp' });
    fetched = results.length;

    for (const r of results) {
      // Store raw record first (immutable audit trail)
      await prisma.rawPncpRecord.upsert({
        where: { sourceId: r.sourceId },
        create: { sourceId: r.sourceId, payload: r as object },
        update: { payload: r as object },
      });

      // Upsert canonical record
      await prisma.licitacao.upsert({
        where: { source_sourceId: { source: 'pncp', sourceId: r.sourceId } },
        create: {
          source: 'pncp',
          sourceId: r.sourceId,
          modalidade: mapModalidade(r.modalidade),
          status: r.status,
          orgaoNome: r.orgaoNome,
          orgaoUasg: r.orgaoUasg,
          orgaoUf: r.uf,
          orgaoMunicipio: r.municipio,
          objeto: r.objeto,
          valorEstimado: r.valorEstimado,
          dataAbertura: r.dataAbertura ? new Date(r.dataAbertura) : undefined,
          dataEncerramentoPropostas: r.dataEncerramentoPropostas
            ? new Date(r.dataEncerramentoPropostas)
            : undefined,
        },
        update: {
          status: r.status,
          valorEstimado: r.valorEstimado,
          sourceSyncedAt: new Date(),
        },
      });
      upserted++;
    }

    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        finishedAt: new Date(),
        recordsFetched: fetched,
        recordsUpserted: upserted,
        status: 'success',
      },
    });
  } catch (err) {
    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        finishedAt: new Date(),
        recordsFetched: fetched,
        recordsUpserted: upserted,
        status: 'failed',
        errorDetail: String(err),
      },
    });
    throw err;
  }
}

function mapModalidade(m: string) {
  const map: Record<string, string> = {
    pregao_eletronico: 'pregao_eletronico',
    pregao_presencial: 'pregao_presencial',
    concorrencia: 'concorrencia',
    dispensa: 'dispensa',
    inexigibilidade: 'inexigibilidade',
    credenciamento: 'credenciamento',
  };
  return (map[m] ?? 'outro') as 'pregao_eletronico' | 'outro';
}
