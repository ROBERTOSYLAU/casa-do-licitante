import PecasJuridicas from '@/components/juridico/PecasJuridicas';

export const metadata = { title: 'Jurídico | Casa do Licitante' };

export default function JuridicoPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <PecasJuridicas />
    </div>
  );
}
