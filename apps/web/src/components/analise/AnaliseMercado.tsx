'use client';

import { useEffect, useState } from 'react';
import { BarChart3, RefreshCw, TrendingUp, FileText, MapPin, Layers } from 'lucide-react';
import { formatBRL } from '@/lib/utils';
import { UF_LIST } from '@casa/domain';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AnaliseData {
  totalLicitacoes: number;
  totalValor: number;
  byModalidade: Record<string, { count: number; valor: number }>;
  byUf: Record<string, { count: number; valor: number }>;
  bySource: Record<string, number>;
  byStatus: Record<string, number>;
}

const MODALIDADE_LABELS: Record<string, string> = {
  pregao_eletronico: 'Pregão Eletrônico',
  pregao_presencial: 'Pregão Presencial',
  concorrencia: 'Concorrência',
  dispensa: 'Dispensa',
  inexigibilidade: 'Inexigibilidade',
  leilao: 'Leilão',
  credenciamento: 'Credenciamento',
  concurso: 'Concurso',
  outro: 'Outros',
};

const STATUS_COLORS: Record<string, string> = {
  aberta: 'bg-emerald-500',
  suspensa: 'bg-yellow-500',
  homologada: 'bg-blue-500',
  deserta: 'bg-slate-500',
  fracassada: 'bg-red-500',
  revogada: 'bg-orange-500',
  anulada: 'bg-red-700',
};

// Barra horizontal simples
function HBar({ label, count, max, valor, color = 'bg-blue-500' }: {
  label: string; count: number; max: number; valor?: number; color?: string;
}) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/80 truncate max-w-[180px]">{label}</span>
        <span className="text-white/50 ml-2 shrink-0">{count}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      {valor != null && valor > 0 && (
        <p className="text-xs text-white/40">{formatBRL(valor)}</p>
      )}
    </div>
  );
}

// Card KPI
function KpiCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub?: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className={`inline-flex rounded-xl p-2.5 ${color} mb-4`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="text-xs uppercase tracking-widest text-white/40">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/50">{sub}</p>}
    </div>
  );
}

export default function AnaliseMercado() {
  const [data, setData] = useState<AnaliseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uf, setUf] = useState('');
  const [error, setError] = useState('');

  async function load(ufFilter?: string) {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (ufFilter) params.set('uf', ufFilter);
      const res = await fetch(`/api/analise?${params}`);
      if (!res.ok) throw new Error('Erro ao carregar dados');
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(uf || undefined); }, [uf]);

  const modalidades = data
    ? Object.entries(data.byModalidade).sort((a, b) => b[1].count - a[1].count)
    : [];
  const ufs = data
    ? Object.entries(data.byUf).sort((a, b) => b[1].count - a[1].count).slice(0, 10)
    : [];
  const maxMod = modalidades[0]?.[1].count ?? 1;
  const maxUf = ufs[0]?.[1].count ?? 1;
  const statusEntries = data
    ? Object.entries(data.byStatus).sort((a, b) => b[1] - a[1])
    : [];
  const totalStatus = statusEntries.reduce((s, [, n]) => s + n, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-200 mb-4">
            <BarChart3 className="h-3.5 w-3.5" />
            Análise em tempo real
          </div>
          <h1 className="text-3xl font-bold text-white">Análise de Mercado</h1>
          <p className="mt-2 text-white/60">
            Dados dos últimos 30 dias de licitações públicas — PNCP e ComprasNet.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select onValueChange={setUf} value={uf}>
            <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Todos os estados" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 text-white border-slate-700 max-h-72">
              {UF_LIST.map((u) => (
                <SelectItem key={u.sigla} value={u.sigla}>{u.sigla} — {u.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            onClick={() => load(uf || undefined)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/10 transition disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-900/20 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="flex items-center justify-center h-64 text-white/40 text-sm">
          <RefreshCw className="h-6 w-6 animate-spin mr-3" />
          Carregando dados de mercado...
        </div>
      )}

      {data && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KpiCard
              label="Licitações encontradas"
              value={data.totalLicitacoes.toLocaleString('pt-BR')}
              sub="últimos 30 dias"
              icon={FileText}
              color="bg-blue-600"
            />
            <KpiCard
              label="Valor total estimado"
              value={formatBRL(data.totalValor)}
              sub="soma dos valores"
              icon={TrendingUp}
              color="bg-emerald-600"
            />
            <KpiCard
              label="Fontes"
              value={`${data.bySource.pncp ?? 0} PNCP / ${data.bySource.comprasnet ?? 0} CNet`}
              sub="por portal"
              icon={Layers}
              color="bg-violet-600"
            />
            <KpiCard
              label="Estados com resultados"
              value={Object.keys(data.byUf).length.toString()}
              sub="UFs representadas"
              icon={MapPin}
              color="bg-orange-600"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {/* Por Modalidade */}
            <div className="xl:col-span-1 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                Por Modalidade
              </h2>
              <div className="space-y-4">
                {modalidades.length === 0 && (
                  <p className="text-sm text-white/40">Sem dados</p>
                )}
                {modalidades.map(([key, val]) => (
                  <HBar
                    key={key}
                    label={MODALIDADE_LABELS[key] ?? key}
                    count={val.count}
                    max={maxMod}
                    valor={val.valor}
                    color="bg-blue-500"
                  />
                ))}
              </div>
            </div>

            {/* Por UF */}
            <div className="xl:col-span-1 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                Por Estado (top 10)
              </h2>
              <div className="space-y-4">
                {ufs.length === 0 && (
                  <p className="text-sm text-white/40">Sem dados</p>
                )}
                {ufs.map(([key, val]) => (
                  <HBar
                    key={key}
                    label={key}
                    count={val.count}
                    max={maxUf}
                    valor={val.valor}
                    color="bg-emerald-500"
                  />
                ))}
              </div>
            </div>

            {/* Por Status + Fonte */}
            <div className="xl:col-span-1 space-y-6">
              {/* Status */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-base font-semibold text-white mb-5">Por Situação</h2>
                <div className="space-y-3">
                  {statusEntries.map(([status, count]) => {
                    const pct = totalStatus > 0 ? Math.round((count / totalStatus) * 100) : 0;
                    return (
                      <div key={status} className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${STATUS_COLORS[status] ?? 'bg-slate-500'}`} />
                        <span className="text-sm text-white/70 capitalize flex-1">{status}</span>
                        <span className="text-xs text-white/40">{count}</span>
                        <span className="text-xs text-white/30 w-8 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fonte */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-base font-semibold text-white mb-5">Por Fonte</h2>
                <div className="space-y-4">
                  <HBar label="PNCP" count={data.bySource.pncp ?? 0} max={data.totalLicitacoes} color="bg-blue-500" />
                  <HBar label="ComprasNet" count={data.bySource.comprasnet ?? 0} max={data.totalLicitacoes} color="bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/25 text-center">
            Dados agregados em tempo real via APIs públicas do PNCP e ComprasNet. Período padrão: últimos 30 dias.
          </p>
        </>
      )}
    </div>
  );
}
