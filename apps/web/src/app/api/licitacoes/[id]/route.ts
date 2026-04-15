import { NextRequest, NextResponse } from 'next/server';
import { getCanonicalLicitacaoDetail } from '../_lib/canonical';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const detail = await getCanonicalLicitacaoDetail(id);

  if (!detail) {
    return NextResponse.json({ error: 'Licitação não encontrada' }, { status: 404 });
  }

  return NextResponse.json(detail);
}
