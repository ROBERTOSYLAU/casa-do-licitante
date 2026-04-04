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
    dataFinal: searchParams.get('dataFinal') ?? undefined,
    source: (searchParams.get('source') as SearchFilters['source']) ?? 'ambos' as const,
  };

  try {
    let results;
    if (filters.source === 'comprasnet') {
      results = await fetchComprasnetBids(filters);
    } else if (filters.source === 'pncp') {
      results = await fetchPncpBids(filters);
    } else {
      // 'ambos' — fetch both in parallel, merge and sort by dataAbertura desc
      const [pncp, comprasnet] = await Promise.all([
        fetchPncpBids(filters),
        fetchComprasnetBids(filters),
      ]);
      results = [...pncp, ...comprasnet]
        .sort((a, b) => (b.dataAbertura ?? '').localeCompare(a.dataAbertura ?? ''))
        .slice(0, 80);
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error('[GET /api/licitacoes]', err);
    return NextResponse.json(
      { error: 'Falha ao buscar licitações' },
      { status: 502 },
    );
  }
}
