import Link from 'next/link';
import { MapPin, Building, Tag, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatBRL } from '@/lib/utils';
import type { LicitacaoSearchResult } from '@casa/domain';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  results: LicitacaoSearchResult[];
}

export default function SearchResults({ results }: Props) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm">
        {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado
        {results.length !== 1 ? 's' : ''}
      </p>
      {results.map((licitacao) => (
        <Link key={licitacao.id} href={`/licitacoes/${licitacao.id}`}>
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate mb-2">
                    {licitacao.objeto}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-white/70">
                    <span className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {licitacao.orgaoNome}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {licitacao.uf}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      {licitacao.modalidade}
                    </span>
                    {licitacao.dataAbertura && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(parseISO(licitacao.dataAbertura), 'dd/MM/yyyy', {
                          locale: ptBR,
                        })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-green-400 font-bold text-lg">
                    {licitacao.valorEstimado != null
                      ? formatBRL(licitacao.valorEstimado)
                      : 'Sob consulta'}
                  </p>
                  <Badge
                    variant={licitacao.status === 'aberta' ? 'default' : 'secondary'}
                    className="mt-1"
                  >
                    {licitacao.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
