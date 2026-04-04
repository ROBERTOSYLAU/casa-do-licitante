import { NextRequest, NextResponse } from 'next/server';
import { fetchPncpBids, fetchComprasnetBids } from '@casa/gov-apis';

export const dynamic = 'force-dynamic';

// Agrega dados de licitações para a página de análise
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const uf = searchParams.get('uf') ?? undefined;

  try {
    // Busca as últimas licitações (30 dias) de todas as modalidades
    const [pncp, comprasnet] = await Promise.all([
      fetchPncpBids({ source: 'pncp', uf }),
      fetchComprasnetBids({ source: 'comprasnet', uf }),
    ]);

    const all = [...pncp, ...comprasnet];

    // Agrupa por modalidade
    const byModalidade: Record<string, { count: number; valor: number }> = {};
    for (const l of all) {
      if (!byModalidade[l.modalidade]) byModalidade[l.modalidade] = { count: 0, valor: 0 };
      byModalidade[l.modalidade].count++;
      byModalidade[l.modalidade].valor += l.valorEstimado ?? 0;
    }

    // Agrupa por UF
    const byUf: Record<string, { count: number; valor: number }> = {};
    for (const l of all) {
      const key = l.uf || 'N/D';
      if (!byUf[key]) byUf[key] = { count: 0, valor: 0 };
      byUf[key].count++;
      byUf[key].valor += l.valorEstimado ?? 0;
    }

    // Agrupa por fonte
    const bySource: Record<string, number> = { pncp: pncp.length, comprasnet: comprasnet.length };

    // Agrupa por status
    const byStatus: Record<string, number> = {};
    for (const l of all) {
      byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;
    }

    const totalValor = all.reduce((s, l) => s + (l.valorEstimado ?? 0), 0);

    return NextResponse.json({
      totalLicitacoes: all.length,
      totalValor,
      byModalidade,
      byUf,
      bySource,
      byStatus,
    });
  } catch (err) {
    console.error('[GET /api/analise]', err);
    return NextResponse.json({ error: 'Falha ao agregar dados' }, { status: 502 });
  }
}
