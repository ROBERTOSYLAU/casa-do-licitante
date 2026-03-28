import { NextRequest, NextResponse } from 'next/server';
import { fetchPncpBids, fetchComprasnetBids } from '@casa/gov-apis';
import type { SearchFilters } from '@casa/domain';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const filters: SearchFilters = {
    keyword: searchParams.get('keyword') ?? undefined,
    uf: searchParams.get('uf') ?? undefined,
    modalidade: searchParams.get('modalidade') ?? undefined,
    dataInicial: searchParams.get('dataInicial') ?? undefined,
    source: (searchParams.get('source') as SearchFilters['source']) ?? 'pncp',
  };

  try {
    const results =
      filters.source === 'comprasnet'
        ? await fetchComprasnetBids(filters)
        : await fetchPncpBids(filters);

    return NextResponse.json(results);
  } catch (err) {
    console.error('[GET /api/licitacoes]', err);
    return NextResponse.json(
      { error: 'Falha ao buscar licitações' },
      { status: 502 },
    );
  }
}
