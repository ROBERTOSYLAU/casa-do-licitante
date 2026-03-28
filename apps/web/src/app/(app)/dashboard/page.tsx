import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-white/60">
        Resumo de licitações ativas, contratos próximos ao vencimento e
        certidões a vencer.
      </p>
      {/* TODO: metrics cards, deadline calendar, recent alerts */}
    </div>
  );
}
