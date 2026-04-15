import { NextRequest, NextResponse } from 'next/server';
import type { SearchFilters } from '@casa/domain';
import { searchCanonicalLicitacoes } from './_lib/canonical';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const filters: SearchFilters = {
    keyword: searchParams.get('keyword') ?? undefined,
    uf: searchParams.get('uf') ?? undefined,
    modalidade: searchParams.get('modalidade') ?? undefined,
    periodoTipo: (searchParams.get('periodoTipo') as SearchFilters['periodoTipo']) ?? undefined,
    dataInicial: searchParams.get('dataInicial') ?? undefined,
    dataFinal: searchParams.get('dataFinal') ?? undefined,
    source: (searchParams.get('source') as SearchFilters['source']) ?? ('ambos' as const),
  };

  try {
    const results = await searchCanonicalLicitacoes(filters);

    return NextResponse.json(results);
  } catch (err) {
    console.error('[GET /api/licitacoes]', err);
    return NextResponse.json(
      { error: 'Falha ao buscar licitações' },
      { status: 502 },
    );
  }
}
