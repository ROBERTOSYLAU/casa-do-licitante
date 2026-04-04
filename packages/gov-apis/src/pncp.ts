import type { LicitacaoSearchResult, SearchFilters } from '@casa/domain';

const BASE = 'https://pncp.gov.br/api/consulta/v1';

const MODALIDADE_MAP: Record<string, number> = {
  pregao_eletronico: 6,
  pregao_presencial: 7,
  concorrencia: 4,
  dispensa: 8,
  inexigibilidade: 9,
  credenciamento: 12,
  leilao: 1,
  concurso: 3,
};

// Modalidades padrão quando nenhuma é selecionada
const DEFAULT_MODALIDADES = [4, 6, 7, 8, 9];

interface PncpLicitacao {
  numeroControlePNCP: string;
  objetoCompra: string;
  orgaoEntidade: { razaoSocial: string; cnpj: string };
  unidadeOrgao?: { codigoUnidade?: string; municipioNome?: string; ufSigla?: string };
  modalidadeNome: string;
  modalidadeId: number;
  situacaoCompraNome: string;
  valorTotalEstimado?: number;
  dataPublicacaoPncp: string;
  dataAberturaProposta?: string;
  dataEncerramentoProposta?: string;
}

interface PncpResponse {
  data: PncpLicitacao[];
  totalRegistros?: number;
  totalPaginas?: number;
}

function toApiDate(iso: string): string {
  return iso.replace(/-/g, '');
}

function normalizePncpModalidade(nome: string): string {
  const lower = nome.toLowerCase();
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

function normalizePncpStatus(situacao: string): LicitacaoSearchResult['status'] {
  const s = situacao.toLowerCase();
  if (s.includes('divulgada') || s.includes('aberta') || s.includes('publicada')) return 'aberta';
  if (s.includes('suspensa')) return 'suspensa';
  if (s.includes('homolog')) return 'homologada';
  if (s.includes('deserta')) return 'deserta';
  if (s.includes('fracassada')) return 'fracassada';
  if (s.includes('revogada')) return 'revogada';
  if (s.includes('anulada')) return 'anulada';
  return 'aberta';
}

function normalizeUasg(value?: string) {
  const uasg = (value ?? '').trim();
  if (!uasg || uasg === '0' || uasg === '1') return undefined;
  return uasg;
}

function getDateWindow(filters: SearchFilters) {
  const today = new Date();
  const plusThirty = new Date(Date.now() + 30 * 86400000);

  const dataInicial = filters.dataInicial ?? today.toISOString().slice(0, 10);
  const dataFinal = filters.dataFinal ?? filters.dataInicial ?? plusThirty.toISOString().slice(0, 10);

  return {
    dataInicial: toApiDate(dataInicial),
    dataFinal: toApiDate(dataFinal),
  };
}

async function fetchByModalidade(modalidade: number, filters: SearchFilters): Promise<LicitacaoSearchResult[]> {
  const { dataInicial, dataFinal } = getDateWindow(filters);

  const params = new URLSearchParams({
    pagina: String(filters.page ?? 1),
    tamanhoPagina: '50',
    dataInicial,
    dataFinal,
    codigoModalidadeContratacao: String(modalidade),
  });

  if (filters.uf) params.set('ufSigla', filters.uf);

  const res = await fetch(`${BASE}/contratacoes/publicacao?${params.toString()}`);
  if (!res.ok || res.status === 204) {
    if (res.status !== 204) {
      console.error(`[PNCP] HTTP ${res.status} modalidade=${modalidade}`, await res.text().catch(() => ''));
    }
    return [];
  }

  const text = await res.text();
  if (!text) return [];
  const body = JSON.parse(text) as PncpResponse;
  const items = body.data ?? [];
  const keywordTerms = filters.keyword?.toLowerCase().split(';').map((k: string) => k.trim()).filter(Boolean) ?? [];

  return items
    .filter((l) => {
      if (keywordTerms.length === 0) return true;
      const obj = l.objetoCompra.toLowerCase();
      return keywordTerms.every((term: string) => obj.includes(term));
    })
    .filter((l) => !filters.modalidade || normalizePncpModalidade(l.modalidadeNome) === filters.modalidade)
    .map((l) => ({
      id: `pncp-${l.numeroControlePNCP}`,
      source: 'pncp' as const,
      sourceId: l.numeroControlePNCP,
      objeto: l.objetoCompra,
      orgaoNome: l.orgaoEntidade.razaoSocial,
      orgaoUasg: normalizeUasg(l.unidadeOrgao?.codigoUnidade),
      uf: l.unidadeOrgao?.ufSigla ?? '',
      municipio: l.unidadeOrgao?.municipioNome,
      modalidade: normalizePncpModalidade(l.modalidadeNome),
      status: normalizePncpStatus(l.situacaoCompraNome),
      valorEstimado: l.valorTotalEstimado != null ? Math.round(l.valorTotalEstimado * 100) : undefined,
      dataAbertura: l.dataAberturaProposta ?? l.dataPublicacaoPncp,
      dataEncerramentoPropostas: l.dataEncerramentoProposta,
    }));
}

export async function fetchPncpBids(filters: SearchFilters): Promise<LicitacaoSearchResult[]> {
  const mapped = filters.modalidade ? MODALIDADE_MAP[filters.modalidade] : undefined;
  const modalidades: number[] = mapped !== undefined ? [mapped] : DEFAULT_MODALIDADES;

  const results = await Promise.all(modalidades.map((m) => fetchByModalidade(m, filters)));

  return results
    .flat()
    .sort((a, b) => (b.dataAbertura ?? '').localeCompare(a.dataAbertura ?? ''))
    .slice(0, 80);
}
