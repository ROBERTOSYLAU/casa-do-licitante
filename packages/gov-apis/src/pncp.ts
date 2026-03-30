/**
 * PNCP connector — Portal Nacional de Contratações Públicas
 * Base: https://pncp.gov.br/api/consulta/v1  (public, no auth required)
 *
 * Docs: https://pncp.gov.br/pncp-consulta/swagger-ui/index.html
 * Datas no formato yyyyMMdd (sem hifens)
 * tamanhoPagina mínimo: 10
 */
import type { LicitacaoSearchResult, SearchFilters } from '@casa/domain';

const BASE = 'https://pncp.gov.br/api/consulta/v1';

// Mapeamento modalidade domínio → codigoModalidadeContratacao PNCP
const MODALIDADE_MAP: Record<string, number> = {
  pregao_eletronico:  6,
  pregao_presencial:  7,
  concorrencia:       4,
  dispensa:           8,
  inexigibilidade:    9,
  credenciamento:     12,
  leilao:             1,
  concurso:           3,
};

// Modalidades padrão quando nenhuma é selecionada (as mais comuns)
const DEFAULT_MODALIDADES = [6, 7, 8, 9];

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
  if (lower.includes('pregão eletrônico') || lower.includes('pregao eletronico')) return 'pregao_eletronico';
  if (lower.includes('pregão presencial') || lower.includes('pregao presencial')) return 'pregao_presencial';
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

async function fetchByModalidade(
  modalidade: number,
  filters: SearchFilters,
): Promise<LicitacaoSearchResult[]> {
  const today = new Date().toISOString().slice(0, 10);
  const dataInicial = toApiDate(filters.dataInicial ?? today);
  const dataFinal = toApiDate(filters.dataFinal ?? today);

  const params = new URLSearchParams({
    pagina: String(filters.page ?? 1),
    tamanhoPagina: '20',
    dataInicial,
    dataFinal,
    codigoModalidadeContratacao: String(modalidade),
  });

  if (filters.uf) params.set('ufSigla', filters.uf);

  const res = await fetch(`${BASE}/contratacoes/publicacao?${params.toString()}`);
  if (!res.ok) return [];

  const body = (await res.json()) as PncpResponse;
  const items = body.data ?? [];

  const keyword = filters.keyword?.toLowerCase();

  return items
    .filter((l) => !keyword || l.objetoCompra.toLowerCase().includes(keyword))
    .map((l) => ({
      id: `pncp-${l.numeroControlePNCP}`,
      source: 'pncp' as const,
      sourceId: l.numeroControlePNCP,
      objeto: l.objetoCompra,
      orgaoNome: l.orgaoEntidade.razaoSocial,
      orgaoUasg: l.unidadeOrgao?.codigoUnidade,
      uf: l.unidadeOrgao?.ufSigla ?? '',
      municipio: l.unidadeOrgao?.municipioNome,
      modalidade: normalizePncpModalidade(l.modalidadeNome),
      status: normalizePncpStatus(l.situacaoCompraNome),
      valorEstimado:
        l.valorTotalEstimado != null
          ? Math.round(l.valorTotalEstimado * 100)
          : undefined,
      dataAbertura: l.dataAberturaProposta ?? l.dataPublicacaoPncp,
      dataEncerramentoPropostas: l.dataEncerramentoProposta,
    }));
}

export async function fetchPncpBids(
  filters: SearchFilters,
): Promise<LicitacaoSearchResult[]> {
  const modalidades =
    filters.modalidade && MODALIDADE_MAP[filters.modalidade]
      ? [MODALIDADE_MAP[filters.modalidade]]
      : DEFAULT_MODALIDADES;

  const results = await Promise.all(
    modalidades.map((m) => fetchByModalidade(m, filters)),
  );

  return results.flat().slice(0, 50);
}
