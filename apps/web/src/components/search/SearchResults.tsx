'use client';

import Link from 'next/link';
import { MapPin, Building, Tag, Calendar, Clock, Hash, ArrowUpRight, Landmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    aberta:      'bg-green-500/20 text-green-300 border-green-500/30',
    suspensa:    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    homologada:  'bg-blue-500/20 text-blue-300 border-blue-500/30',
    deserta:     'bg-slate-500/20 text-slate-300 border-slate-500/30',
    fracassada:  'bg-red-500/20 text-red-300 border-red-500/30',
    revogada:    'bg-orange-500/20 text-orange-300 border-orange-500/30',
    anulada:     'bg-red-600/20 text-red-400 border-red-600/30',
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

        const dataAbertura   = safeDate(licitacao.dataAbertura);
        const dataDisputa    = safeDate(licitacao.dataEncerramentoPropostas);

        return (
          <Link key={licitacao.id} href={`/licitacoes/${licitacao.id}?${detailQuery}`}>
            <Card className="border-white/10 bg-white/5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:border-blue-400/30">
              <CardContent className="p-5">

                {/* ── Header row ─────────────────────────────────── */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <SourceBadge source={licitacao.source} />
                  <StatusBadge status={licitacao.status} />
                  <span className="text-white/40 text-xs font-medium uppercase tracking-wide">
                    {formatModalidade(licitacao.modalidade)}
                  </span>
                </div>

                {/* ── Title ──────────────────────────────────────── */}
                <h3 className="text-base font-semibold text-white leading-snug mb-3 line-clamp-2">
                  {licitacao.objeto}
                </h3>

                {/* ── Metadata grid ──────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5 text-sm text-white/65 mb-4">
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

                  <span className="flex items-center gap-1.5">
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

                {/* ── Footer row ─────────────────────────────────── */}
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold text-lg">
                    {licitacao.valorEstimado != null ? formatBRL(licitacao.valorEstimado) : 'Valor sob consulta'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-300">
                    Ver detalhe <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
