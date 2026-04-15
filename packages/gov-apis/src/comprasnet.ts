import type { LicitacaoSearchResult, SearchFilters } from '@casa/domain';

const BASE = 'https://dadosabertos.compras.gov.br';

function getComprasnetHeaders() {
  const apiKey = process.env['COMPRASNET_API_KEY'];
  return apiKey ? { 'chave-api-dados': apiKey } : undefined;
}

// codigoModalidade da API dadosabertos.compras.gov.br (distinto do PNCP)
// Referência: Manual API Compras.gov.br v2.0 (Fev/2026) — seção 10.5
// 3=Concorrência, 5=Pregão Eletrônico, 6=Dispensa Eletrônica, 7=Inexigibilidade
const DEFAULT_MODALIDADES_COMPRAS = [3, 5, 6, 7];

const MODALIDADE_COMPRA_MAP: Record<string, number[]> = {
    pregao_eletronico: [5],
    pregao_presencial: [5],
    concorrencia: [3],
    tomada_preco: [3],
    convite: [3],
    dispensa: [6],
    inexigibilidade: [7],
    credenciamento: [7],
    leilao: [3],
    rdc: [3],
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

function getDateWindow(filters: SearchFilters) {
    const today = new Date();
    const plusThirty = new Date(Date.now() + 30 * 86400000);

  if (filters.periodoTipo === 'abertura') {
        // Para busca por abertura, expande janela de publicação para cobrir licitações
      // publicadas antes mas com abertura no período desejado
      const dtFinal = filters.dataFinal ? new Date(filters.dataFinal) : plusThirty;
        const dtInicial = filters.dataInicial
          ? new Date(filters.dataInicial + 'T00:00:00')
                : new Date(dtFinal.getTime() - 60 * 86400000);
        return {
                dataInicial: dtInicial.toISOString().slice(0, 10),
                dataFinal: dtFinal.toISOString().slice(0, 10),
        };
  }

  return {
        dataInicial: filters.dataInicial ?? today.toISOString().slice(0, 10),
        dataFinal: filters.dataFinal ?? filters.dataInicial ?? plusThirty.toISOString().slice(0, 10),
  };
}

async function fetchByCodigoModalidade(codigoModalidade: number, filters: SearchFilters): Promise<LicitacaoSearchResult[]> {
    const { dataInicial, dataFinal } = getDateWindow(filters);
    const params = new URLSearchParams({
          pagina: String(filters.page ?? 1),
          tamanhoPagina: '50',
          dataPublicacaoPncpInicial: dataInicial,
          dataPublicacaoPncpFinal: dataFinal,
          codigoModalidade: String(codigoModalidade),
    });

  if (filters.uf) params.set('unidadeOrgaoUfSigla', filters.uf);

  const res = await fetch(`${BASE}/modulo-contratacoes/1_consultarContratacoes_PNCP_14133?${params.toString()}`, {
    headers: getComprasnetHeaders(),
  });
    if (!res.ok) {
          console.error(`[ComprasNet] HTTP ${res.status} codigoModalidade=${codigoModalidade}`, await res.text().catch(() => ''));
          return [];
    }

  const body = (await res.json()) as ComprasGovResponse;
    const items = body.resultado ?? [];

  const keywordTerms = filters.keyword?.toLowerCase().split(';').map((k: string) => k.trim()).filter(Boolean) ?? [];

  return items
      .filter((l) => {
              if (keywordTerms.length === 0) return true;
              const obj = (l.objetoCompra ?? '').toLowerCase();
              return keywordTerms.every((term: string) => obj.includes(term));
      })
      .filter((l) => !filters.modalidade || normalizeModalidade(l.modalidadeNome) === filters.modalidade)
      .filter((l) => {
              if (filters.periodoTipo === 'abertura' && (filters.dataInicial || filters.dataFinal)) {
                        const abert = l.dataAberturaPropostaPncp;
                        if (!abert) return false;
                        const abertDate = abert.slice(0, 10);
                        if (filters.dataInicial && abertDate < filters.dataInicial) return false;
                        if (filters.dataFinal && abertDate > filters.dataFinal) return false;
              }
              return true;
      })
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
              valorEstimado: l.valorTotalEstimado != null ? Math.round(l.valorTotalEstimado * 100) : undefined,
              dataAbertura: l.dataAberturaPropostaPncp ?? l.dataPublicacaoPncp ?? '',
              dataEncerramentoPropostas: l.dataEncerramentoPropostaPncp,
              link: l.idCompra
                ? `https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-web/public/compras/acompanhamento-compra?compra=${l.idCompra}`
                        : (l.numeroControlePNCP
                                       ? `https://pncp.gov.br/app/editais/${l.numeroControlePNCP}`
                                       : undefined),
      }));
}

export async function fetchComprasnetBids(filters: SearchFilters): Promise<LicitacaoSearchResult[]> {
    const modalidades = filters.modalidade
      ? MODALIDADE_COMPRA_MAP[filters.modalidade] ?? DEFAULT_MODALIDADES_COMPRAS
          : DEFAULT_MODALIDADES_COMPRAS;

  const results = await Promise.all(modalidades.map((m) => fetchByCodigoModalidade(m, filters)));
    return results
      .flat()
      .sort((a, b) => (b.dataAbertura ?? '').localeCompare(a.dataAbertura ?? ''))
      .slice(0, 80);
}
