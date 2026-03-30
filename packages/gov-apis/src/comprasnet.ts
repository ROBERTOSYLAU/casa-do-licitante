/**
 * ComprasGov connector — dadosabertos.compras.gov.br
 * Contratações Lei 14.133/2021 + legado 8.666
 * Base: https://dadosabertos.compras.gov.br  (public, no auth)
 */
import type { LicitacaoSearchResult, SearchFilters } from '@casa/domain';

const BASE = 'https://dadosabertos.compras.gov.br';

// codigoModalidade no dadosabertos (diferente do PNCP)
// 1=Licitação, 2=Contratação Direta, 3=Convênio, 4=Credenciamento, 5=Pregão, 6=Outros
// Usar 1,2,5,6 para cobrir os principais casos
const DEFAULT_MODALIDADES_COMPRAS = [1, 2, 5, 6];

interface ComprasGovItem {
  numeroControlePNCP?: string;
  objetoCompra?: string;
  orgaoEntidadeRazaoSocial?: string;
  unidadeOrgaoCodigoUnidade?: string;
  unidadeOrgaoUfSigla?: string;
  unidadeOrgaoMunicipioNome?: string;
  modalidadeNome?: string;
  situacaoCompraNomePncp?: string;
  valorTotalEstimado?: number;
  dataPublicacaoPncp?: string;
  dataAberturaPropostaPncp?: string;
  dataEncerramentoPropostaPncp?: string;
  idCompra?: string;
}

interface ComprasGovResponse {
  resultado: ComprasGovItem[];
  totalRegistros?: number;
}

function normalizeStatus(situacao?: string): LicitacaoSearchResult['status'] {
  const s = (situacao ?? '').toLowerCase();
  if (s.includes('divulgada') || s.includes('aberta') || s.includes('publicada')) return 'aberta';
  if (s.includes('suspensa')) return 'suspensa';
  if (s.includes('homolog')) return 'homologada';
  if (s.includes('deserta')) return 'deserta';
  if (s.includes('fracassada')) return 'fracassada';
  if (s.includes('revogada')) return 'revogada';
  if (s.includes('anulada')) return 'anulada';
  return 'aberta';
}

function normalizeModalidade(nome?: string): string {
  const lower = (nome ?? '').toLowerCase();
  if (lower.includes('pregão eletrônico') || lower.includes('pregao eletronico')) return 'pregao_eletronico';
  if (lower.includes('pregão presencial') || lower.includes('pregao presencial')) return 'pregao_presencial';
  if (lower.includes('concorrência') || lower.includes('concorrencia')) return 'concorrencia';
  if (lower.includes('dispensa')) return 'dispensa';
  if (lower.includes('inexigibilidade')) return 'inexigibilidade';
  if (lower.includes('credenciamento')) return 'credenciamento';
  if (lower.includes('leilão') || lower.includes('leilao')) return 'leilao';
  return 'outro';
}

async function fetchByCodigoModalidade(
  codigoModalidade: number,
  filters: SearchFilters,
): Promise<LicitacaoSearchResult[]> {
  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

  const params = new URLSearchParams({
    pagina: String(filters.page ?? 1),
    tamanhoPagina: '20',
    dataPublicacaoPncpInicial: filters.dataInicial ?? sevenDaysAgo,
    dataPublicacaoPncpFinal: filters.dataFinal ?? today,
    codigoModalidade: String(codigoModalidade),
  });

  if (filters.uf) params.set('unidadeOrgaoUfSigla', filters.uf);

  const res = await fetch(
    `${BASE}/modulo-contratacoes/1_consultarContratacoes_PNCP_14133?${params.toString()}`,
  );

  if (!res.ok) return [];

  const body = (await res.json()) as ComprasGovResponse;
  const items = body.resultado ?? [];

  const keyword = filters.keyword?.toLowerCase();

  return items
    .filter((l) => !keyword || (l.objetoCompra ?? '').toLowerCase().includes(keyword))
    .map((l) => ({
      id: `comprasnet-${l.numeroControlePNCP ?? l.idCompra}`,
      source: 'comprasnet' as const,
      sourceId: l.numeroControlePNCP ?? l.idCompra ?? '',
      objeto: l.objetoCompra ?? '',
      orgaoNome: l.orgaoEntidadeRazaoSocial ?? '',
      orgaoUasg: l.unidadeOrgaoCodigoUnidade,
      uf: l.unidadeOrgaoUfSigla ?? '',
      municipio: l.unidadeOrgaoMunicipioNome,
      modalidade: normalizeModalidade(l.modalidadeNome),
      status: normalizeStatus(l.situacaoCompraNomePncp),
      valorEstimado:
        l.valorTotalEstimado != null
          ? Math.round(l.valorTotalEstimado * 100)
          : undefined,
      dataAbertura: l.dataAberturaPropostaPncp ?? l.dataPublicacaoPncp ?? '',
      dataEncerramentoPropostas: l.dataEncerramentoPropostaPncp,
    }));
}

export async function fetchComprasnetBids(
  filters: SearchFilters,
): Promise<LicitacaoSearchResult[]> {
  const results = await Promise.all(
    DEFAULT_MODALIDADES_COMPRAS.map((m) => fetchByCodigoModalidade(m, filters)),
  );

  return results.flat().slice(0, 50);
}
