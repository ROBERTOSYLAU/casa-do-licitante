import AlertasClient from '@/components/alertas/AlertasClient';

export const metadata = { title: 'Alertas | Casa do Licitante' };

export default function AlertasPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <AlertasClient />
    </div>
  );
}
