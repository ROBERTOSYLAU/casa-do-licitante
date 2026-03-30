'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

export default function SearchForm({ onSearch, isLoading }: Props) {
  const [date, setDate] = useState<Date | undefined>();
  const [uf, setUf] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [source, setSource] = useState<DataSourceFilter>('ambos');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSearch({
      keyword: (fd.get('keyword') as string) || undefined,
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
    setSource('ambos');
    (document.getElementById('search-form') as HTMLFormElement)?.reset();
    onSearch({ source: 'ambos' });
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold text-white">
          <SlidersHorizontal className="mr-3 text-green-400" />
          Pesquisa Avançada de Licitações
        </CardTitle>
        <CardDescription className="text-white/70">
          Utilize os filtros abaixo para encontrar oportunidades em todo o Brasil.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="search-form" onSubmit={handleSubmit}>
          {/* Portal selector */}
          <div className="flex flex-wrap gap-3 mb-6">
            {SOURCE_LIST.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSource(s.id as DataSourceFilter)}
                className={cn(
                  'rounded-full border-2 px-4 py-2 text-sm transition-all duration-200',
                  source === s.id
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <Label htmlFor="keyword" className="text-white/80">
                Palavra-chave
              </Label>
              <Input
                id="keyword"
                name="keyword"
                placeholder="Ex: notebook, construção..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            <div>
              <Label className="text-white/80">UF</Label>
              <Select onValueChange={setUf} value={uf}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Selecione o estado" />
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
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white border-slate-700">
                  {MODALIDADE_LIST.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-white/80 mb-2">Data de Abertura</Label>
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
                    {date ? format(date, 'PPP', { locale: ptBR }) : 'Escolha uma data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700 text-white">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8"
            >
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? 'Buscando...' : 'Buscar'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="border-white/20 text-white/80 hover:bg-white/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
