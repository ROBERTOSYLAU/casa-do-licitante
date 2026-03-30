/**
 * PNCP connector — Portal Nacional de Contratações Públicas
 * Base: https://pncp.gov.br/api/pncp/v1  (public, no auth required)
 *
 * All values normalised to domain types.
 * Money → integer centavos.
 */
import type { LicitacaoSearchResult, SearchFilters } from '@casa/domain';

const BASE = 'https://pncp.gov.br/api/v1';

interface PncpLicitacao {
  numeroControlePNCP: string;
  objeto: string;
  orgaoEntidade: { razaoSocial: string; cnpj: string };
  unidadeOrgao?: { codigo?: string; municipioNome?: string; uf?: string };
  modalidade: { nome: string; id: number };
  situacaoCompraNome: string;
  valorTotalEstimado?: number;
  dataPublicacaoPNCP: string;
  dataAberturaProposta?: string;
  dataEncerramentoProposta?: string;
}

interface PncpResponse {
  data: PncpLicitacao[];
  totalRegistros: number;
  totalPaginas: number;
}

function normalizePncpModalidade(nome: string): string {
  const lower = nome.toLowerCase();
  if (lower.includes('pregão eletrônico') || lower.includes('pregao eletronico'))
    return 'pregao_eletronico';
  if (lower.includes('pregão presencial')) return 'pregao_presencial';
  if (lower.includes('concorrência')) return 'concorrencia';
  if (lower.includes('dispensa')) return 'dispensa';
  if (lower.includes('inexigibilidade')) return 'inexigibilidade';
  if (lower.includes('credenciamento')) return 'credenciamento';
  return 'outro';
}

function normalizePncpStatus(situacao: string): LicitacaoSearchResult['status'] {
  const s = situacao.toLowerCase();
  if (s.includes('aberta') || s.includes('publicada') || s.includes('divulgada'))
    return 'aberta';
  if (s.includes('suspensa')) return 'suspensa';
  if (s.includes('homolog')) return 'homologada';
  if (s.includes('deserta')) return 'deserta';
  if (s.includes('fracassada')) return 'fracassada';
  if (s.includes('revogada')) return 'revogada';
  if (s.includes('anulada')) return 'anulada';
  return 'aberta';
}

export async function fetchPncpBids(
  filters: SearchFilters,
): Promise<LicitacaoSearchResult[]> {
  const today = new Date().toISOString().slice(0, 10);
  const params = new URLSearchParams({
    pagina: String(filters.page ?? 1),
    tamanhoPagina: '20',
    dataInicial: filters.dataInicial ?? today,
    dataFinal: filters.dataFinal ?? today,
  });

  if (filters.keyword) params.set('termo', filters.keyword);
  if (filters.uf) params.set('uf', filters.uf);

  const res = await fetch(
    `${BASE}/contratacoes/publicacao?${params.toString()}`,
    { cache: 'no-store' },
  );

  if (!res.ok) {
    throw new Error(`PNCP responded ${res.status}: ${await res.text()}`);
  }

  const body = (await res.json()) as PncpResponse;
  const items = body.data ?? [];

  return items.map((l) => ({
    id: `pncp-${l.numeroControlePNCP}`,
    source: 'pncp' as const,
    sourceId: l.numeroControlePNCP,
    objeto: l.objeto,
    orgaoNome: l.orgaoEntidade.razaoSocial,
    orgaoUasg: l.unidadeOrgao?.codigo,
    uf: l.unidadeOrgao?.uf ?? '',
    municipio: l.unidadeOrgao?.municipioNome,
    modalidade: normalizePncpModalidade(l.modalidade.nome),
    status: normalizePncpStatus(l.situacaoCompraNome),
    valorEstimado:
      l.valorTotalEstimado != null
        ? Math.round(l.valorTotalEstimado * 100)
        : undefined,
    dataAbertura: l.dataAberturaProposta ?? l.dataPublicacaoPNCP,
    dataEncerramentoPropostas: l.dataEncerramentoProposta,
  }));
}
