'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { MapPin, Building, Calendar, Clock, Hash, ArrowUpRight, Landmark, LayoutGrid } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatBRL } from '@/lib/utils';
import type { LicitacaoSearchResult } from '@casa/domain';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  results: LicitacaoSearchResult[];
}

function formatModalidade(value: string) {
  return value.replaceAll('_', ' ');
}

function safeDate(value?: string | null, fmt = 'dd/MM/yyyy HH:mm') {
  if (!value) return null;
  try {
    const dt = parseISO(value);
    if (!isValid(dt)) return value;
    return format(dt, fmt, { locale: ptBR });
  } catch {
    return value;
  }
}

function SourceBadge({ source }: { source: string }) {
  const map: Record<string, string> = {
    pncp: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    comprasnet: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${map[source] ?? 'bg-white/10 text-white/70 border-white/20'}`}>
      {source === 'pncp' ? 'PNCP' : source === 'comprasnet' ? 'ComprasNet' : source.toUpperCase()}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    aberta: 'bg-green-500/20 text-green-300 border-green-500/30',
    suspensa: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    homologada: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    deserta: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    fracassada: 'bg-red-500/20 text-red-300 border-red-500/30',
    revogada: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    anulada: 'bg-red-600/20 text-red-400 border-red-600/30',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${map[status] ?? 'bg-white/10 text-white/70 border-white/20'}`}>
      {status}
    </span>
  );
}

export default function SearchResults({ results }: Props) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-white/60 text-sm">
          {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
        </p>
        <div className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
          <LayoutGrid className="h-3.5 w-3.5" />
          leitura de triagem operacional
        </div>
      </div>

      {results.map((licitacao) => {
        const detailQuery = new URLSearchParams({
          source: licitacao.source,
          sourceId: licitacao.sourceId,
          objeto: licitacao.objeto,
          orgaoNome: licitacao.orgaoNome,
          orgaoUasg: licitacao.orgaoUasg || '',
          uf: licitacao.uf,
          municipio: licitacao.municipio || '',
          modalidade: licitacao.modalidade,
          status: licitacao.status,
          dataAbertura: licitacao.dataAbertura || '',
          dataEncerramentoPropostas: licitacao.dataEncerramentoPropostas || '',
          valorEstimado: licitacao.valorEstimado != null ? String(licitacao.valorEstimado) : '',
        }).toString();

        const dataAbertura = safeDate(licitacao.dataAbertura);
        const dataDisputa = safeDate(licitacao.dataEncerramentoPropostas);
        const detailPath = `/licitacoes/${encodeURIComponent(licitacao.id)}?${detailQuery}` as Route;

        return (
          <Link key={licitacao.id} href={detailPath}>
            <Card className="border-white/10 bg-white/5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:border-blue-400/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
              <CardContent className="p-5">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <SourceBadge source={licitacao.source} />
                  <StatusBadge status={licitacao.status} />
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-white/55">
                    {formatModalidade(licitacao.modalidade)}
                  </span>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
                  <div>
                    <h3 className="text-base font-semibold text-white leading-snug mb-3 line-clamp-2">
                      {licitacao.objeto}
                    </h3>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-white/65 sm:grid-cols-2 xl:grid-cols-3">
                      <span className="flex items-center gap-1.5 truncate">
                        <Building className="h-3.5 w-3.5 shrink-0 text-white/40" />
                        <span className="truncate">{licitacao.orgaoNome}</span>
                      </span>

                      {licitacao.orgaoUasg && (
                        <span className="flex items-center gap-1.5">
                          <Landmark className="h-3.5 w-3.5 shrink-0 text-white/40" />
                          UASG {licitacao.orgaoUasg}
                        </span>
                      )}

                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-white/40" />
                        {licitacao.municipio ? `${licitacao.municipio} / ${licitacao.uf}` : licitacao.uf}
                      </span>

                      <span className="flex items-center gap-1.5 sm:col-span-2 xl:col-span-1">
                        <Hash className="h-3.5 w-3.5 shrink-0 text-white/40" />
                        <span className="truncate font-mono text-xs">{licitacao.sourceId}</span>
                      </span>

                      {dataAbertura && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-white/40" />
                          Abertura: {dataAbertura}
                        </span>
                      )}

                      {dataDisputa && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-white/40" />
                          Disputa: {dataDisputa}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="lg:min-w-[180px] lg:text-right">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/40">Valor estimado</p>
                    <p className="mt-2 text-xl font-bold text-emerald-400">
                      {licitacao.valorEstimado != null ? formatBRL(licitacao.valorEstimado) : 'Sob consulta'}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300">
                      Ver detalhes <ArrowUpRight className="h-4 w-4" />
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
