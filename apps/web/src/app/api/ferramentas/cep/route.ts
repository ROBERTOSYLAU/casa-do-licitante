import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cep = req.nextUrl.searchParams.get('cep');
  if (!cep || !/^\d{8}$/.test(cep)) {
    return NextResponse.json({ error: 'CEP inválido' }, { status: 400 });
  }
  try {
    const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`, {
      next: { revalidate: 604800 }, // cache 7 days
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
