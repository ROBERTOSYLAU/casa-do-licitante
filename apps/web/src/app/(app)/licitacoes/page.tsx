import type { Metadata } from 'next';
import SearchLicitacoesClient from '@/components/search/SearchLicitacoesClient';

export const metadata: Metadata = { title: 'Pesquisa de Licitações' };

export default function LicitacoesPage() {
  return (
    <div className="space-y-8">
      <SearchLicitacoesClient />
    </div>
  );
}
