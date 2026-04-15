import type { SearchFilters, LicitacaoSearchResult } from '@casa/domain';

const CASA_API_URL = process.env.CASA_API_URL || 'http://casa-api:3001';

export async function fetchBancoBids(
  filters: SearchFilters
): Promise<LicitacaoSearchResult[]> {
  const params = new URLSearchParams();

  if (filters.keyword)      params.set('q',          filters.keyword);
  if (filters.uf)           params.set('uf',         filters.uf);
  if (filters.municipio)    params.set('municipio',  filters.municipio);
  if (filters.modalidade)   params.set('modalidade', filters.modalidade);
  if (filters.dataInicial)  params.set('dataInicio', filters.dataInicial);
  if (filters.dataFinal)    params.set('dataFim',    filters.dataFinal);
  if (filters.valorMin)     params.set('valorMin',   String(filters.valorMin / 100));
  if (filters.valorMax)     params.set('valorMax',   String(filters.valorMax / 100));

  params.set('limit', '50');
  params.set('page',  String(filters.page ?? 1));

  const url = `${CASA_API_URL}/licitacoes?${params.toString()}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      console.error('[banco] Erro na resposta:', res.status);
      return [];
    }

    const json = await res.json() as {
      meta: { total: number; page: number; totalPages: number };
      data: Array<{
        id: number;
        orgao: string;
        objeto: string;
        valor: number;
        data: string | null;
        link: string;
        uf: string | null;
        municipio: string | null;
        modalidade: string | null;
        criado_em: string;
      }>;
    };

    return (json.data ?? []).map((item) => ({
      id:          `banco-${item.id}`,
      source:      'banco' as const,
      sourceId:    String(item.id),
      objeto:      item.objeto || 'Sem descrio',
      orgaoNome:   item.orgao  || 'rgo no informado',
      uf:          item.uf     || '',
      municipio:   item.municipio || '',
      modalidade:  item.modalidade || '',
      status:      'aberta' as const,
      valorEstimado: item.valor ? Math.round(item.valor * 100) : undefined,
      dataAbertura:  item.data  ? item.data.substring(0, 10) : undefined,
      link:          item.link  || undefined,
    }));
  } catch (err) {
    console.error('[banco] Erro ao buscar dados:', err);
    return [];
  }
}
