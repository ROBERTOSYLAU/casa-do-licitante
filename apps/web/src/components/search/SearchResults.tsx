import Link from 'next/link';
import { MapPin, Building, Tag, Calendar, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatBRL } from '@/lib/utils';
import type { LicitacaoSearchResult } from '@casa/domain';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  results: LicitacaoSearchResult[];
}

function formatModalidade(value: string) {
  return value.replaceAll('_', ' ');
}

export default function SearchResults({ results }: Props) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm">
        {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
      </p>

      {results.map((licitacao) => {
        const detailQuery = new URLSearchParams({
          source: licitacao.source,
          sourceId: licitacao.sourceId,
          objeto: licitacao.objeto,
          orgaoNome: licitacao.orgaoNome,
          uf: licitacao.uf,
          municipio: licitacao.municipio || '',
          modalidade: licitacao.modalidade,
          status: licitacao.status,
          dataAbertura: licitacao.dataAbertura || '',
          dataEncerramentoPropostas: licitacao.dataEncerramentoPropostas || '',
          valorEstimado: licitacao.valorEstimado != null ? String(licitacao.valorEstimado) : '',
        }).toString();

        return (
          <Link key={licitacao.id} href={`/licitacoes/${licitacao.id}?${detailQuery}`}>
            <Card className="border-white/10 bg-white/5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:border-blue-400/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge>{licitacao.source.toUpperCase()}</Badge>
                      <Badge variant="secondary">{licitacao.status}</Badge>
                    </div>

                    <h3 className="text-lg font-semibold text-white leading-snug mb-2 line-clamp-2">
                      {licitacao.objeto}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-sm text-white/70">
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {licitacao.orgaoNome}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {licitacao.municipio ? `${licitacao.municipio}/${licitacao.uf}` : licitacao.uf}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        {formatModalidade(licitacao.modalidade)}
                      </span>
                      {licitacao.dataAbertura && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(parseISO(licitacao.dataAbertura), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-emerald-400 font-bold text-lg">
                      {licitacao.valorEstimado != null ? formatBRL(licitacao.valorEstimado) : 'Sob consulta'}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-300">
                      Abrir detalhe <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
