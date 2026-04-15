import type { Job } from 'bullmq';
import { prisma } from '../db.js';
import { fetchComprasnetBids } from '@casa/gov-apis';
import type { IngestJobPayload } from '@casa/domain';

function toBigIntOrUndefined(value?: number) {
  return value != null ? BigInt(value) : undefined;
}

export async function handleIngestComprasnet(job: Job<IngestJobPayload>) {
  const { dataInicial, dataFinal } = job.data;
  const syncLog = await prisma.syncLog.create({
    data: { source: 'comprasnet', jobId: job.id, startedAt: new Date(), status: 'running' },
  });

  let fetched = 0;
  let upserted = 0;

  try {
    const results = await fetchComprasnetBids({
      dataInicial,
      dataFinal,
      source: 'comprasnet',
      periodoTipo: 'publicacao',
    });
    fetched = results.length;

    for (const r of results) {
      await prisma.rawComprasnetRecord.upsert({
        where: { sourceId: r.sourceId },
        create: { sourceId: r.sourceId, payload: r as object },
        update: { payload: r as object },
      });

      await prisma.licitacao.upsert({
        where: { source_sourceId: { source: 'comprasnet', sourceId: r.sourceId } },
        create: {
          source: 'comprasnet',
          sourceId: r.sourceId,
          modalidade: mapModalidade(r.modalidade),
          status: r.status,
          orgaoNome: r.orgaoNome,
          orgaoUasg: r.orgaoUasg,
          orgaoUf: r.uf,
          orgaoMunicipio: r.municipio,
          objeto: r.objeto,
          valorEstimado: toBigIntOrUndefined(r.valorEstimado),
          dataPublicacao: r.dataAbertura ? new Date(r.dataAbertura) : undefined,
          dataAbertura: r.dataAbertura ? new Date(r.dataAbertura) : undefined,
          dataEncerramentoPropostas: r.dataEncerramentoPropostas
            ? new Date(r.dataEncerramentoPropostas)
            : undefined,
        },
        update: {
          status: r.status,
          valorEstimado: toBigIntOrUndefined(r.valorEstimado),
          sourceSyncedAt: new Date(),
          dataPublicacao: r.dataAbertura ? new Date(r.dataAbertura) : undefined,
          dataAbertura: r.dataAbertura ? new Date(r.dataAbertura) : undefined,
          dataEncerramentoPropostas: r.dataEncerramentoPropostas
            ? new Date(r.dataEncerramentoPropostas)
            : undefined,
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
    tomada_preco: 'tomada_preco',
    convite: 'convite',
    dispensa: 'dispensa',
    inexigibilidade: 'inexigibilidade',
    credenciamento: 'credenciamento',
    leilao: 'leilao',
    concurso: 'concurso',
    rdc: 'rdc',
  };
  return (map[m] ?? 'outro') as
    | 'pregao_eletronico'
    | 'pregao_presencial'
    | 'concorrencia'
    | 'tomada_preco'
    | 'convite'
    | 'dispensa'
    | 'inexigibilidade'
    | 'credenciamento'
    | 'leilao'
    | 'concurso'
    | 'rdc'
    | 'outro';
}
