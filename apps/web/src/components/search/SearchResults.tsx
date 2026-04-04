'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { MapPin, Building, Calendar, Clock, Hash, ArrowUpRight, Landmark, LayoutGrid, Plus, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatBRL } from '@/lib/utils';
import type { LicitacaoSearchResult } from '@casa/domain';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useCallback } from 'react';
import type { FunilCard } from '@/components/funil/FunilKanban';

interface Props {
  results: LicitacaoSearchResult[];
}

function formatModalidade(value: string) {
  const map: Record<string, string> = {
    pregao_eletronico: 'Pregão Eletrônico',
    pregao_presencial: 'Pregão Presencial',
    concorrencia: 'Concorrência',
    dispensa: 'Dispensa',
    inexigibilidade: 'Inexigibilidade',
    leilao: 'Leilão',
    credenciamento: 'Credenciamento',
    concurso: 'Concurso',
    tomada_preco: 'Tomada de Preço',
    convite: 'Convite',
    rdc: 'RDC',
    outro: 'Outro',
  };
  return map[value] ?? value.replaceAll('_', ' ');
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

function ModalidadeBadge({ modalidade }: { modalidade: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/55">
      {formatModalidade(modalidade)}
    </span>
  );
}

function AddToFunilButton({ licitacao }: { licitacao: LicitacaoSearchResult }) {
  const [added, setAdded] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const cards: FunilCard[] = JSON.parse(localStorage.getItem('casa-funil-v1') ?? '[]');
      return cards.some((c) => c.id === licitacao.id);
    } catch { return false; }
  });

  const handleAdd = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (added) return;
    try {
      const cards: FunilCard[] = JSON.parse(localStorage.getItem('casa-funil-v1') ?? '[]');
      const newCard: FunilCard = {
        id: licitacao.id,
        stage: 'prospeccao',
        objeto: licitacao.objeto,
        orgaoNome: licitacao.orgaoNome,
        uf: licitacao.uf,
        modalidade: licitacao.modalidade,
        valorEstimado: licitacao.valorEstimado,
        dataAbertura: licitacao.dataAbertura,
        source: licitacao.source,
        sourceId: licitacao.sourceId,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('casa-funil-v1', JSON.stringify([...cards, newCard]));
      setAdded(true);
    } catch { /* ignore */ }
  }, [added, licitacao]);

  return (
    <button
      onClick={handleAdd}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
        added
          ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300 cursor-default'
          : 'border-white/15 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/25'
      }`}
      disabled={added}
      title={added ? 'Já está no funil' : 'Adicionar ao Funil'}
    >
      {added ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      {added ? 'No funil' : 'Funil'}
    </button>
  );
}

export default function SearchResults({ results }: Props) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-white/60 text-sm">
          <span className="font-semibold text-white">{results.length}</span>{' '}
          resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
        </p>
        <div className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
          <LayoutGrid className="h-3.5 w-3.5" />
          Clique em um resultado para ver detalhes completos
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
          <Card key={licitacao.id} className="border-white/10 bg-white/5 transition-all duration-200 hover:bg-white/8 hover:border-blue-400/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
            <CardContent className="p-5">
              {/* Badges */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <SourceBadge source={licitacao.source} />
                <StatusBadge status={licitacao.status} />
                <ModalidadeBadge modalidade={licitacao.modalidade} />
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                  {/* Objeto */}
                  <h3 className="text-base font-semibold text-white leading-snug mb-3 line-clamp-2">
                    {licitacao.objeto}
                  </h3>

                  {/* Meta */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm text-white/60 sm:grid-cols-2 xl:grid-cols-3">
                    <span className="flex items-center gap-1.5 truncate">
                      <Building className="h-3.5 w-3.5 shrink-0 text-white/35" />
                      <span className="truncate">{licitacao.orgaoNome}</span>
                    </span>

                    {licitacao.orgaoUasg && (
                      <span className="flex items-center gap-1.5">
                        <Landmark className="h-3.5 w-3.5 shrink-0 text-white/35" />
                        UASG {licitacao.orgaoUasg}
                      </span>
                    )}

                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-white/35" />
                      {licitacao.municipio ? `${licitacao.municipio} / ${licitacao.uf}` : licitacao.uf}
                    </span>

                    <span className="flex items-center gap-1.5 sm:col-span-2 xl:col-span-1">
                      <Hash className="h-3.5 w-3.5 shrink-0 text-white/35" />
                      <span className="truncate font-mono text-xs">{licitacao.sourceId}</span>
                    </span>

                    {dataAbertura && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-white/35" />
                        Abertura: <span className="text-white/80">{dataAbertura}</span>
                      </span>
                    )}

                    {dataDisputa && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 shrink-0 text-white/35" />
                        Encerra: <span className="text-white/80">{dataDisputa}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Valor + Ações */}
                <div className="flex flex-row items-center justify-between lg:flex-col lg:min-w-[160px] lg:text-right lg:items-end gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-white/35">Valor estimado</p>
                    <p className="mt-1 text-lg font-bold text-emerald-400">
                      {licitacao.valorEstimado != null ? formatBRL(licitacao.valorEstimado) : 'Sob consulta'}
                    </p>
                  </div>
                  <div className="flex flex-col lg:items-end gap-2">
                    <AddToFunilButton licitacao={licitacao} />
                    <div className="flex flex-row items-center gap-2 mt-1">
                      <Link href={detailPath}>
                        <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-500/20 transition">
                          Detalhes
                        </span>
                      </Link>
                      {licitacao.link && (
                        <a href={licitacao.link} target="_blank" rel="noopener noreferrer" title="Abrir no portal oficial">
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition">
                            Acessar <ArrowUpRight className="h-3.5 w-3.5" />
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
