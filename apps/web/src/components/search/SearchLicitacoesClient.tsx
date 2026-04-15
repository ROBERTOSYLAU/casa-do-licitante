'use client';

import { useEffect, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import type { LicitacaoSearchResult, SearchFilters } from '@casa/domain';

const DEFAULT_FILTERS: SearchFilters = { source: 'comprasnet', periodoTipo: 'publicacao' };

export default function SearchLicitacoesClient() {
  const [results, setResults] = useState<LicitacaoSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastFilters, setLastFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  async function handleSearch(filters: SearchFilters) {
    setLoading(true);
    setResults([]);
    setHasSearched(true);
    setLastFilters(filters);

    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.set('keyword', filters.keyword);
      if (filters.uf) params.set('uf', filters.uf);
      if (filters.modalidade) params.set('modalidade', filters.modalidade);
      if (filters.periodoTipo) params.set('periodoTipo', filters.periodoTipo);
      if (filters.dataInicial) params.set('dataInicial', filters.dataInicial);
      if (filters.dataFinal) params.set('dataFinal', filters.dataFinal);
      if (filters.source) params.set('source', filters.source);

      const res = await fetch(`/api/licitacoes?${params.toString()}`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data: LicitacaoSearchResult[] = await res.json();
      setResults(data);

      if (data.length === 0) {
        toast.info('Nenhum resultado encontrado', {
          description: 'Tente ampliar a busca removendo filtros ou usando uma palavra-chave mais genérica.',
        });
      }
    } catch (err) {
      toast.error('Erro na busca', {
        description: err instanceof Error ? err.message : 'Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleSearch(DEFAULT_FILTERS);
  }, []);

  return (
    <div className="space-y-8">
      <SearchForm onSearch={handleSearch} isLoading={loading} />

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/75">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-emerald-300" />
          <div>
            <div className="font-medium text-white">Pesquisa orientada à decisão</div>
            <p className="mt-1 text-sm text-white/65">
              Comece com filtros leves e refine aos poucos. Em consultas muito específicas, o retorno pode ser vazio mesmo com a API funcionando corretamente.
            </p>
          </div>
        </div>
      </div>

      <div>
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-white/60">
            <Search className="mb-4 h-12 w-12 animate-pulse" />
            <p>Buscando oportunidades...</p>
          </div>
        )}

        {!loading && results.length > 0 && <SearchResults results={results} />}

        {!loading && hasSearched && results.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/35 p-10 text-center">
            <h3 className="text-xl font-semibold text-white">Nenhuma oportunidade encontrada</h3>
            <p className="mt-3 text-white/65">
              Relaxe os filtros, troque a fonte ou use uma palavra-chave mais ampla para encontrar mais resultados.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm text-white/70">
              {lastFilters.keyword && <span className="rounded-full bg-white/5 px-3 py-1">trocar palavra-chave</span>}
              {lastFilters.uf && <span className="rounded-full bg-white/5 px-3 py-1">remover UF</span>}
              {lastFilters.modalidade && <span className="rounded-full bg-white/5 px-3 py-1">remover modalidade</span>}
              {lastFilters.dataInicial && <span className="rounded-full bg-white/5 px-3 py-1">remover data</span>}
              <span className="rounded-full bg-white/5 px-3 py-1">testar ambas as fontes</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
