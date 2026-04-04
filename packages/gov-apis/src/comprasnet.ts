/**
 * ComprasGov connector — dadosabertos.compras.gov.br
 * Contratações Lei 14.133/2021 + legado 8.666
 * Base: https://dadosabertos.compras.gov.br  (public, no auth)
 */
import type { LicitacaoSearchResult, SearchFilters } from '@casa/domain';

const BASE = 'https://dadosabertos.compras.gov.br';

// codigoModalidade no dadosabertos — validados empiricamente (outros retornam 0 registros)
// 3=Concorrência, 5=Pregão, 6=Dispensa, 7=Inexigibilidade
const DEFAULT_MODALIDADES_COMPRAS = [3, 5, 6, 7];

// Mapeamento modalidade domínio → codigoModalidade ComprasNet
const MODALIDADE_MAP_COMPRAS: Record<string, number> = {
  pregao_eletronico: 5,
  pregao_presencial: 5, // mesma categoria na API
  concorrencia:      3,
  dispensa:          6,
  inexigibilidade:   7,
};

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
  // API retorna "Pregão - Eletrônico" e "Pregão - Presencial" (com hífen)
  if (lower.includes('pregão') || lower.includes('pregao')) {
    if (lower.includes('presencial')) return 'pregao_presencial';
    return 'pregao_eletronico';
  }
  if (lower.includes('concorrência') || lower.includes('concorrencia')) return 'concorrencia';
  if (lower.includes('dispensa')) return 'dispensa';
  if (lower.includes('inexigibilidade')) return 'inexigibilidade';
  if (lower.includes('credenciamento')) return 'credenciamento';
  if (lower.includes('leilão') || lower.includes('leilao')) return 'leilao';
  if (lower.includes('concurso')) return 'concurso';
  return 'outro';
}

async function fetchByCodigoModalidade(
  codigoModalidade: number,
  filters: SearchFilters,
): Promise<LicitacaoSearchResult[]> {
  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  const params = new URLSearchParams({
    pagina: String(filters.page ?? 1),
    tamanhoPagina: '20',
    dataPublicacaoPncpInicial: filters.dataInicial ?? thirtyDaysAgo,
    dataPublicacaoPncpFinal: filters.dataFinal ?? today,
    codigoModalidade: String(codigoModalidade),
  });

  if (filters.uf) params.set('unidadeOrgaoUfSigla', filters.uf);

  const res = await fetch(
    `${BASE}/modulo-contratacoes/1_consultarContratacoes_PNCP_14133?${params.toString()}`,
  );

  if (!res.ok) {
    console.error(`[ComprasNet] HTTP ${res.status} codigoModalidade=${codigoModalidade}`, await res.text().catch(() => ''));
    return [];
  }

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
  const mapped = filters.modalidade !== undefined ? MODALIDADE_MAP_COMPRAS[filters.modalidade] : undefined;
  const modalidades: number[] = mapped !== undefined ? [mapped] : DEFAULT_MODALIDADES_COMPRAS;

  const results = await Promise.all(
    modalidades.map((m) => fetchByCodigoModalidade(m, filters)),
  );

  return results.flat().slice(0, 50);
}
