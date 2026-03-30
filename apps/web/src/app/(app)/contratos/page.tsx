import type { Metadata } from 'next';
import { CalendarClock, Construction } from 'lucide-react';

export const metadata: Metadata = { title: 'Contratos' };

export default function ContratosPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
          Em breve
        </div>
        <h1 className="mt-4 text-3xl font-bold text-white">Contratos</h1>
        <p className="mt-3 max-w-2xl text-white/70">
          Gestão de contratos, aditamentos e alertas de vencimento.
        </p>
      </section>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 flex flex-col items-center justify-center text-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/10">
          <Construction className="h-7 w-7 text-blue-300" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Módulo em desenvolvimento</h2>
          <p className="mt-2 text-white/55 max-w-md">
            Em breve você poderá gerenciar contratos, acompanhar aditamentos e receber alertas automáticos de vencimento.
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white/60">
          <CalendarClock className="h-4 w-4 text-blue-300" />
          Previsto para próxima versão
        </div>
      </div>
    </div>
  );
}
