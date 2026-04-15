import type { Licitacao, LicitacaoItem, Edital, DataSource, LicitacaoStatus } from '@casa/db';
import type { LicitacaoSearchResult } from '@casa/domain';

type CanonicalLicitacao = Licitacao & {
  items?: LicitacaoItem[];
  editais?: Edital[];
};

export function bigIntToNumber(value: bigint | null | undefined) {
  return value != null ? Number(value) : undefined;
}

export function mapCanonicalLicitacaoToSearchResult(
  licitacao: Pick<
    CanonicalLicitacao,
    | 'id'
    | 'source'
    | 'sourceId'
    | 'objeto'
    | 'orgaoNome'
    | 'orgaoUasg'
    | 'orgaoUf'
    | 'orgaoMunicipio'
    | 'modalidade'
    | 'status'
    | 'valorEstimado'
    | 'dataAbertura'
    | 'dataEncerramentoPropostas'
  >,
): LicitacaoSearchResult {
  return {
    id: licitacao.id,
    source: licitacao.source as DataSource,
    sourceId: licitacao.sourceId,
    objeto: licitacao.objeto,
    orgaoNome: licitacao.orgaoNome,
    orgaoUasg: licitacao.orgaoUasg ?? undefined,
    uf: licitacao.orgaoUf,
    municipio: licitacao.orgaoMunicipio ?? undefined,
    modalidade: licitacao.modalidade,
    status: licitacao.status as LicitacaoStatus,
    valorEstimado: bigIntToNumber(licitacao.valorEstimado),
    dataAbertura: licitacao.dataAbertura?.toISOString(),
    dataEncerramentoPropostas: licitacao.dataEncerramentoPropostas?.toISOString(),
  };
}

export function mapCanonicalDetail(licitacao: CanonicalLicitacao) {
  return {
    id: licitacao.id,
    source: licitacao.source,
    sourceId: licitacao.sourceId,
    objeto: licitacao.objeto,
    orgaoNome: licitacao.orgaoNome,
    orgaoUasg: licitacao.orgaoUasg ?? '',
    uf: licitacao.orgaoUf,
    municipio: licitacao.orgaoMunicipio ?? '',
    modalidade: licitacao.modalidade,
    status: licitacao.status,
    dataAbertura: licitacao.dataAbertura?.toISOString() ?? null,
    dataEncerramentoPropostas: licitacao.dataEncerramentoPropostas?.toISOString() ?? null,
    valorEstimado: bigIntToNumber(licitacao.valorEstimado) ?? null,
    resumo:
      'Detalhe carregado da base canônica da plataforma, com contexto persistido para evolução de análise, acompanhamento e operação.',
    itens: (licitacao.items ?? []).map((item) => ({
      numeroItem: item.numeroItem,
      descricao: item.descricao,
      catmat: item.catmat ?? undefined,
      catser: item.catser ?? undefined,
      quantidade: item.quantidade != null ? Number(item.quantidade) : undefined,
      valorUnitarioEstimado: bigIntToNumber(item.valorUnitarioEstimado),
    })),
    editais: (licitacao.editais ?? []).map((edital) => ({
      id: edital.id,
      filename: edital.filename,
      urlR2: edital.urlR2,
      extractedAt: edital.extractedAt?.toISOString() ?? null,
    })),
    timeline: [
      {
        titulo: 'Registro canônico carregado',
        descricao: 'A oportunidade foi lida da base persistida da plataforma.',
      },
      {
        titulo: 'Pronta para acompanhamento',
        descricao: 'Use este detalhe para triagem, watchlist, funil e evolução operacional.',
      },
    ],
  };
}
