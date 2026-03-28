import type { Metadata } from 'next';
import ToolsGrid from '@/components/tools/ToolsGrid';

export const metadata: Metadata = { title: 'Ferramentas' };

export default function FerramentasPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Ferramentas</h1>
      <p className="text-white/60 mb-8">
        Utilitários para consulta de CNPJ, CEP, conversão de moedas e mais.
      </p>
      <ToolsGrid />
    </div>
  );
}
