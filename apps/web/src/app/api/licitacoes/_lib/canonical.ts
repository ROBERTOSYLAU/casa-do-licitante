import { prisma } from '@casa/db';
import type { Prisma } from '@casa/db';
import type { SearchFilters } from '@casa/domain';
import { mapCanonicalLicitacaoToSearchResult, mapCanonicalDetail } from '@/lib/licitacoes';

function normalizePage(page?: number | null) {
  if (!page || Number.isNaN(page) || page < 1) return 1;
  return Math.floor(page);
}

function endOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

function buildWhere(filters: SearchFilters): Prisma.LicitacaoWhereInput {
  const where: Prisma.LicitacaoWhereInput = {};

  if (filters.keyword) {
    where.objeto = { contains: filters.keyword, mode: 'insensitive' };
  }

  if (filters.uf) {
    where.orgaoUf = filters.uf;
  }

  if (filters.modalidade) {
    where.modalidade = filters.modalidade as never;
  }

  if (filters.source && filters.source !== 'ambos') {
    where.source = filters.source;
  }

  if (filters.dataInicial || filters.dataFinal) {
    const field = filters.periodoTipo === 'publicacao' ? 'dataPublicacao' : 'dataAbertura';
    const range: Prisma.DateTimeNullableFilter<'Licitacao'> = {};

    if (filters.dataInicial) {
      range.gte = new Date(`${filters.dataInicial}T00:00:00.000Z`);
    }

    if (filters.dataFinal) {
      range.lte = endOfDay(new Date(`${filters.dataFinal}T00:00:00.000Z`));
    }

    where[field] = range;
  }

  return where;
}

export async function searchCanonicalLicitacoes(filters: SearchFilters) {
  const page = normalizePage(filters.page);
  const take = 80;
  const skip = (page - 1) * take;

  const licitacoes = await prisma.licitacao.findMany({
    where: buildWhere(filters),
    orderBy: [
      { dataAbertura: 'desc' },
      { createdAt: 'desc' },
    ],
    take,
    skip,
  });

  return licitacoes.map(mapCanonicalLicitacaoToSearchResult);
}

export async function getCanonicalLicitacaoDetail(id: string) {
  const licitacao = await prisma.licitacao.findFirst({
    where: {
      OR: [{ id }, { sourceId: id }],
    },
    include: {
      items: {
        orderBy: { numeroItem: 'asc' },
      },
      editais: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return licitacao ? mapCanonicalDetail(licitacao) : null;
}
