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
    const data: unknown = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Erro ao consultar BrasilAPI' }, { status: 502 });
  }
}
