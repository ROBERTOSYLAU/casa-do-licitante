import MinhaEmpresaClient from '@/components/empresa/MinhaEmpresaClient';

export const metadata = { title: 'Minha Empresa | Casa do Licitante' };

export default function MinhaEmpresaPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <MinhaEmpresaClient />
    </div>
  );
}
