import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contratos' };

export default function ContratosPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Contratos</h1>
      <p className="text-white/60">
        Gestão de contratos, aditamentos e alertas de vencimento.
      </p>
      {/* TODO: contracts table with expiry badges */}
    </div>
  );
}
