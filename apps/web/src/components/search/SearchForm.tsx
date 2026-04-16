'use client';

import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { addDays, endOfMonth, format, startOfMonth, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Search, SlidersHorizontal, Sparkles, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UF_LIST, MODALIDADE_LIST, SOURCE_LIST } from '@casa/domain';
import type { SearchFilters, DataSourceFilter } from '@casa/domain';

interface Props {
  onSearch: (filters: SearchFilters) => void;
  isLoading: boolean;
}

const QUICK_KEYWORDS = ['serviço', 'material', 'medicamento', 'manutenção', 'aquisição', 'obra', 'consultoria'];

const DATE_SHORTCUTS = [
  { label: 'Hoje', getDates: () => { const t = startOfToday(); return { from: t, to: t }; } },
  { label: 'Próx. 7d', getDates: () => ({ from: startOfToday(), to: addDays(startOfToday(), 7) }) },
  { label: 'Próx. 30d', getDates: () => ({ from: startOfToday(), to: addDays(startOfToday(), 30) }) },
  { label: 'Esse mês', getDates: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
] as const;

function formatRange(range: DateRange): string {
  if (!range.from) return 'Selecione o período';
  if (!range.to || range.from.getTime() === range.to.getTime()) {
    return format(range.from, 'dd/MM/yyyy');
  }
  return `${format(range.from, 'dd/MM/yyyy')} → ${format(range.to, 'dd/MM/yyyy')}`;
}

export default function SearchForm({ onSearch, isLoading }: Props) {
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [uf, setUf] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [source, setSource] = useState<DataSourceFilter>('comprasnet');
  const [keyword, setKeyword] = useState('');
  const [periodoTipo, setPeriodoTipo] = useState<'abertura' | 'publicacao'>('publicacao');

  function applyShortcut(shortcut: typeof DATE_SHORTCUTS[number]) {
    setDateRange(shortcut.getDates());
    setCalendarOpen(false);
  }

  const activeFilters = useMemo(() => {
    const filters: Array<{ key: string; label: string; onRemove: () => void }> = [];
    if (keyword.trim()) filters.push({ key: 'keyword', label: `"${keyword.trim()}"`, onRemove: () => setKeyword('') });
    if (uf) filters.push({ key: 'uf', label: `UF: ${uf}`, onRemove: () => setUf('') });
    if (modalidade) {
      const mod = MODALIDADE_LIST.find((m) => m.id === modalidade)?.label ?? modalidade;
      filters.push({ key: 'modalidade', label: mod, onRemove: () => setModalidade('') });
    }
    if (dateRange.from) {
      filters.push({
        key: 'dateRange',
        label: formatRange(dateRange),
        onRemove: () => setDateRange({ from: undefined }),
      });
    }
    if (source && source !== 'ambos') {
      const src = SOURCE_LIST.find((s) => s.id === source)?.label ?? source;
      filters.push({ key: 'source', label: `Fonte: ${src}`, onRemove: () => setSource('comprasnet') });
    }
    return filters;
  }, [keyword, uf, modalidade, dateRange, source]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSearch({
      keyword: keyword.trim() || undefined,
      uf: uf || undefined,
      modalidade: modalidade || undefined,
      periodoTipo,
      dataInicial: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
      dataFinal: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      source,
    });
  }

  function handleClear() {
    setDateRange({ from: undefined });
    setUf('');
    setModalidade('');
    setSource('comprasnet');
    setKeyword('');
    setPeriodoTipo('publicacao');
    onSearch({ source: 'comprasnet', periodoTipo: 'publicacao' });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
              <Sparkles className="h-3.5 w-3.5" />
              Motor de busca de oportunidades
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white">Pesquisa de Licitações</h1>
            <p className="mt-3 max-w-3xl text-white/70">
              Busque em ComprasNet, PNCP e outras fontes. Combine filtros para encontrar oportunidades com precisão.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            <SlidersHorizontal className="inline mr-1.5 h-4 w-4 text-emerald-400" />
            Dica: clique e arraste no calendário para selecionar o período
          </div>
        </div>
      </section>

      <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
        <CardContent className="p-6">
          <form id="search-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Fonte — ComprasNet (padrão) | PNCP | Todas as fontes */}
            <div className="flex flex-wrap gap-2">
              {SOURCE_LIST.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSource(s.id as DataSourceFilter)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm transition-all duration-200',
                    source === s.id
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_8px_30px_rgba(16,185,129,0.25)]'
                      : 'bg-white/5 border-white/15 text-white/75 hover:bg-white/10 hover:text-white',
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Keyword + UF + Modalidade */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="xl:col-span-2">
                <Label htmlFor="keyword" className="text-white/80">Palavra-chave</Label>
                <Input
                  id="keyword"
                  name="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Ex: material, serviço, medicamento..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 mt-1"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {QUICK_KEYWORDS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setKeyword(item)}
                      className={cn(
                        'rounded-full border px-2.5 py-1 text-xs transition hover:bg-white/10 hover:text-white',
                        keyword === item
                          ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
                          : 'border-white/10 bg-white/5 text-white/65'
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white/80">Estado (UF)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-white/10 border-white/20 text-white mt-1 hover:bg-white/20 hover:text-white font-normal">
                      {uf ? `UF: ${uf}` : 'Todos os estados'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[340px] p-4 bg-slate-800 border-slate-700 shadow-2xl z-[100]">
                    <div className="text-sm text-white/70 mb-3 font-medium">Escolha o Estado</div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setUf('')}
                        className={cn('rounded px-2.5 py-1.5 text-xs font-semibold border transition-all', uf === '' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10')}
                      >
                        TODOS
                      </button>
                      {UF_LIST.map((u) => (
                        <button
                          key={u.sigla}
                          type="button"
                          onClick={() => setUf(u.sigla)}
                          className={cn('rounded px-2.5 py-1.5 text-xs font-semibold border transition-all min-w-[36px]', uf === u.sigla ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10')}
                        >
                          {u.sigla}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-white/80">Modalidade</Label>
                <Select onValueChange={setModalidade} value={modalidade}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-slate-700 max-h-72">
                    {MODALIDADE_LIST.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Período — tipo + atalhos + calendário range único */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Select onValueChange={(v: 'abertura' | 'publicacao') => setPeriodoTipo(v)} value={periodoTipo}>
                  <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white shadow-sm">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white z-[100]">
                    <SelectItem value="publicacao">Data de publicação</SelectItem>
                    <SelectItem value="abertura">Data de abertura</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap items-center gap-1.5">
                  {DATE_SHORTCUTS.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => applyShortcut(s)}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/65 transition hover:bg-emerald-500/20 hover:border-emerald-400/30 hover:text-emerald-200"
                    >
                      {s.label}
                    </button>
                  ))}
                  {dateRange.from && (
                    <button
                      type="button"
                      onClick={() => setDateRange({ from: undefined })}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/40 transition hover:text-white/70"
                    >
                      Limpar datas
                    </button>
                  )}
                </div>
              </div>

              {/* Calendário único com seleção de intervalo (range) */}
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'w-full max-w-sm justify-start text-left font-normal bg-white/10 border-white/20 hover:bg-white/20 text-white hover:text-white',
                      !dateRange.from && 'text-white/45',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    {dateRange.from ? formatRange(dateRange) : 'Selecione o período'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-3 bg-slate-800 border-slate-700 text-white z-[100] shadow-2xl"
                  align="start"
                >
                  <p className="mb-2 text-xs text-white/50 text-center">
                    Clique na data inicial · depois na data final
                  </p>
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange(range ?? { from: undefined });
                      // Fecha automaticamente ao completar o range
                      if (range?.from && range?.to) {
                        setTimeout(() => setCalendarOpen(false), 200);
                      }
                    }}
                    locale={ptBR}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Filtros ativos */}
            {activeFilters.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="mb-2 text-xs uppercase tracking-widest text-white/40 font-medium">Filtros ativos</div>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((f) => (
                    <span
                      key={f.key}
                      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200"
                    >
                      {f.label}
                      <button
                        type="button"
                        onClick={f.onRemove}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-emerald-500/30 transition"
                        aria-label={`Remover filtro ${f.label}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/45 transition hover:text-white/70"
                  >
                    Limpar tudo
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8"
              >
                <Search className="mr-2 h-4 w-4" />
                {isLoading ? 'Buscando...' : 'Buscar oportunidades'}
              </Button>
              <Button type="button" variant="outline" onClick={handleClear} className="border-white/20 text-white/80 hover:bg-white/10">
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar filtros
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
