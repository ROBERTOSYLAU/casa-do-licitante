import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cnpj = req.nextUrl.searchParams.get('cnpj');
  if (!cnpj || !/^\d{14}$/.test(cnpj)) {
    return NextResponse.json({ error: 'CNPJ inválido' }, { status: 400 });
  }
  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      next: { revalidate: 86400 }, // cache 24h — CNPJ data rarely changes
    });
    const data = await res.json() as Record<string, unknown>;
    if (!res.ok) {
      const msg = (data.message as string) ?? (data.error as string) ?? 'CNPJ não encontrado ou erro na Receita Federal';
      console.error(`[CNPJ] BrasilAPI ${res.status} para ${cnpj}:`, msg);
      return NextResponse.json({ error: msg }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error(`[CNPJ] Falha ao consultar BrasilAPI para ${cnpj}:`, err);
    return NextResponse.json({ error: 'Erro ao consultar BrasilAPI' }, { status: 502 });
  }
}
