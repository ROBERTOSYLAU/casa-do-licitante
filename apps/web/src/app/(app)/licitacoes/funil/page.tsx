import FunilKanban from '@/components/funil/FunilKanban';

export const metadata = { title: 'Funil de Licitações | Casa do Licitante' };

export default function FunilPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <FunilKanban />
    </div>
  );
}
