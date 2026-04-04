import AnaliseMercado from '@/components/analise/AnaliseMercado';

export const metadata = { title: 'Análise de Mercado | Casa do Licitante' };

export default function AnalisePage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <AnaliseMercado />
    </div>
  );
}
