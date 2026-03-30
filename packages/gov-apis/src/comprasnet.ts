/**
 * ComprasNet connector (legacy federal — UASG-based)
 * Base: https://compras.dados.gov.br  (public, no auth)
 *
 * API v1 does not provide valorEstimado, so valorEstimado will be undefined.
 */
import type { LicitacaoSearchResult, SearchFilters } from '@casa/domain';

const BASE = 'https://compras.dados.gov.br';

interface ComprasnetLicitacao {
  uasg: string;
  numero_licitacao: string;
  ano_licitacao: string;
  objeto: string;
  nome_uasg: string;
  data_publicacao: string;
  municipio_uasg: string;
  uf_uasg: string;
}

interface ComprasnetResponse {
  _embedded: { licitacoes: ComprasnetLicitacao[] };
}

export async function fetchComprasnetBids(
  filters: SearchFilters,
): Promise<LicitacaoSearchResult[]> {
  const today = new Date().toISOString().slice(0, 10);
  const params = new URLSearchParams({
    data_publicacao: filters.dataInicial ?? today,
  });

  if (filters.keyword) params.set('descricao_objeto', filters.keyword);

  const res = await fetch(
    `${BASE}/licitacoes/v1/licitacoes.json?${params.toString()}`,
    { cache: 'no-store' },
  );

  if (!res.ok) {
    throw new Error(`ComprasNet responded ${res.status}`);
  }

  const body = (await res.json()) as ComprasnetResponse;
  const items = body._embedded?.licitacoes ?? [];

  return items.map((l) => ({
    id: `comprasnet-${l.uasg}-${l.numero_licitacao}-${l.ano_licitacao}`,
    source: 'comprasnet' as const,
    sourceId: `${l.numero_licitacao}/${l.ano_licitacao}`,
    objeto: l.objeto,
    orgaoNome: l.nome_uasg,
    orgaoUasg: l.uasg,
    uf: l.uf_uasg,
    municipio: l.municipio_uasg,
    modalidade: 'pregao_eletronico', // API v1 only exposes pregão
    status: 'aberta' as const,
    valorEstimado: undefined,
    dataAbertura: l.data_publicacao,
  }));
}
