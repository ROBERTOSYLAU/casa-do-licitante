import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Fornecedores' };

export default function FornecedoresPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Fornecedores</h1>
      <p className="text-white/60">
        Perfis por CNPJ, certidões, SICAF e checklist de habilitação.
      </p>
      {/* TODO: CNPJ search + fornecedor cards */}
    </div>
  );
}
