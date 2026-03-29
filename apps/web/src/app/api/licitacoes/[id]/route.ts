import { NextRequest, NextResponse } from 'next/server';

function sourceFromId(id: string) {
  if (id.startsWith('pncp-')) return 'pncp';
  if (id.startsWith('comprasnet-')) return 'comprasnet';
  return 'desconhecida';
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = req.nextUrl;

  const detail = {
    id,
    source: searchParams.get('source') ?? sourceFromId(id),
    sourceId: searchParams.get('sourceId') ?? id,
    objeto: searchParams.get('objeto') ?? 'Licitação sem título informado',
    orgaoNome: searchParams.get('orgaoNome') ?? 'Órgão não informado',
    uf: searchParams.get('uf') ?? '-',
    municipio: searchParams.get('municipio') ?? '',
    modalidade: searchParams.get('modalidade') ?? 'outro',
    status: searchParams.get('status') ?? 'aberta',
    dataAbertura: searchParams.get('dataAbertura') ?? null,
    dataEncerramentoPropostas: searchParams.get('dataEncerramentoPropostas') ?? null,
    valorEstimado: searchParams.get('valorEstimado') ? Number(searchParams.get('valorEstimado')) : null,
    resumo:
      'Detalhe montado a partir da busca atual, pronto para evoluir depois para leitura canônica do banco e enriquecimento com itens, edital e histórico.',
    itens: [],
    editais: [],
    timeline: [
      {
        titulo: 'Registro encontrado',
        descricao: 'Oportunidade localizada nas fontes governamentais integradas.',
      },
      {
        titulo: 'Análise inicial',
        descricao: 'Use esta tela para validar órgão, modalidade, datas e potencial comercial antes de acompanhar.',
      },
    ],
  };

  return NextResponse.json(detail);
}
