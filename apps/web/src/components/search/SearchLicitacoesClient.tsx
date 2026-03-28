'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import type { LicitacaoSearchResult, SearchFilters } from '@casa/domain';

export default function SearchLicitacoesClient() {
  const [results, setResults] = useState<LicitacaoSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(filters: SearchFilters) {
    setLoading(true);
    setResults([]);
    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.set('keyword', filters.keyword);
      if (filters.uf) params.set('uf', filters.uf);
      if (filters.modalidade) params.set('modalidade', filters.modalidade);
      if (filters.dataInicial) params.set('dataInicial', filters.dataInicial);
      if (filters.source) params.set('source', filters.source);

      const res = await fetch(`/api/licitacoes?${params.toString()}`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data: LicitacaoSearchResult[] = await res.json();
      setResults(data);

      if (data.length === 0) {
        toast.info('Nenhum resultado encontrado', {
          description: 'Tente alterar os filtros.',
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

  return (
    <div>
      <SearchForm onSearch={handleSearch} isLoading={loading} />
      <div className="mt-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-white/60">
            <Search className="w-12 h-12 animate-pulse mb-4" />
            <p>Buscando oportunidades...</p>
          </div>
        )}
        {!loading && <SearchResults results={results} />}
      </div>
    </div>
  );
}
