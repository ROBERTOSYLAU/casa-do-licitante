'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Search, SlidersHorizontal, Sparkles, Trash2 } from 'lucide-react';
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

const QUICK_KEYWORDS = ['serviço', 'material', 'medicamento', 'manutenção', 'aquisição'];

export default function SearchForm({ onSearch, isLoading }: Props) {
  const [date, setDate] = useState<Date | undefined>();
  const [uf, setUf] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [source, setSource] = useState<DataSourceFilter>('pncp');
  const [keyword, setKeyword] = useState('');

  const activeFilters = useMemo(() => {
    const filters: string[] = [];
    if (keyword.trim()) filters.push(`Palavra-chave: ${keyword.trim()}`);
    if (uf) filters.push(`UF: ${uf}`);
    if (modalidade) {
      const mod = MODALIDADE_LIST.find((m) => m.id === modalidade)?.label ?? modalidade;
      filters.push(`Modalidade: ${mod}`);
    }
    if (date) filters.push(`Abertura: ${format(date, 'dd/MM/yyyy')}`);
    if (source && source !== 'ambos') {
      const src = SOURCE_LIST.find((s) => s.id === source)?.label ?? source;
      filters.push(`Fonte: ${src}`);
    }
    return filters;
  }, [keyword, uf, modalidade, date, source]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSearch({
      keyword: keyword.trim() || undefined,
      uf: uf || undefined,
      modalidade: modalidade || undefined,
      dataInicial: date ? format(date, 'yyyy-MM-dd') : undefined,
      source,
    });
  }

  function handleClear() {
    setDate(undefined);
    setUf('');
    setModalidade('');
    setSource('pncp');
    setKeyword('');
    onSearch({ source: 'pncp' });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
              <Sparkles className="h-3.5 w-3.5" />
              Motor de triagem de oportunidades
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white">Pesquisa de licitações com leitura operacional</h1>
            <p className="mt-3 max-w-3xl text-white/70">
              Combine fonte, estado, modalidade, data e palavra-chave para reduzir ruído e encontrar oportunidades com mais precisão.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            Dica: comece com <strong className="text-white">PNCP</strong> e filtros leves. Depois refine a pesquisa.
          </div>
        </div>
      </section>

      <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
        <CardContent className="p-6">
          <form id="search-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-wrap gap-3">
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="xl:col-span-2">
                <Label htmlFor="keyword" className="text-white/80">Palavra-chave</Label>
                <Input
                  id="keyword"
                  name="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Ex: material, serviço, medicamento, manutenção..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {QUICK_KEYWORDS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setKeyword(item)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75 transition hover:bg-white/10 hover:text-white"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-white/80">UF</Label>
                <Select onValueChange={setUf} value={uf}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Todos os estados" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-slate-700 max-h-72">
                    {UF_LIST.map((u) => (
                      <SelectItem key={u.sigla} value={u.sigla}>
                        {u.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/80">Modalidade</Label>
                <Select onValueChange={setModalidade} value={modalidade}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Todas as modalidades" />
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

              <div>
                <Label className="block text-white/80 mb-2">Data de abertura</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal bg-white/10 border-white/20 hover:bg-white/20 text-white hover:text-white',
                        !date && 'text-white/50',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP', { locale: ptBR }) : 'Qualquer data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[320px] p-2 bg-slate-800 border-slate-700 text-white">
                    <Calendar mode="single" selected={date} onSelect={setDate} locale={ptBR} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="mb-3 text-sm font-medium text-white">Filtros aplicados</div>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter) => (
                    <span key={filter} className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                      {filter}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
