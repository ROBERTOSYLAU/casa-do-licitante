import type { Metadata } from 'next';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, Bell, Building2, CalendarClock, FileSearch, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = { title: 'Dashboard' };

const kpis = [
  { label: 'Oportunidades monitoradas', value: '128', detail: 'Janela operacional dos últimos 30 dias' },
  { label: 'Alertas relevantes', value: '19', detail: 'Correspondência com filtros e perfil da empresa' },
  { label: 'Contratos sensíveis', value: '7', detail: 'Vencimentos ou renovações em atenção' },
  { label: 'Fontes integradas', value: '2', detail: 'PNCP e ComprasNet ativos no MVP' },
];

const quickActions: { href: '/licitacoes' | '/ferramentas' | '/contratos' | '/fornecedores'; label: string; icon: LucideIcon }[] = [
  { href: '/licitacoes', label: 'Pesquisar licitações', icon: FileSearch },
  { href: '/ferramentas', label: 'Abrir ferramentas úteis', icon: ShieldCheck },
  { href: '/contratos', label: 'Mapear contratos', icon: CalendarClock },
  { href: '/fornecedores', label: 'Consultar fornecedores', icon: Building2 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Painel operacional
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white">Seu centro de controle comercial para licitações</h1>
            <p className="mt-3 max-w-3xl text-white/70">
              Acompanhe oportunidades, valide urgências do pipeline e tome decisão rápida sobre o que vale perseguir.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
            <div className="flex items-center gap-2 text-white">
              <Bell className="h-4 w-4 text-blue-300" />
              3 alertas prontos para análise hoje
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/55">{item.label}</p>
            <div className="mt-2 text-3xl font-bold text-white">{item.value}</div>
            <p className="mt-2 text-sm text-white/60">{item.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">Ações rápidas</h2>
          <p className="mt-2 text-white/65">
            Atalhos para os fluxos que trazem valor direto no beta privado.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {quickActions.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="group rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition hover:border-blue-400/30 hover:bg-slate-900/80">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-blue-300" />
                  <ArrowUpRight className="h-4 w-4 text-white/35 transition group-hover:text-blue-300" />
                </div>
                <div className="mt-4 text-white font-medium">{label}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">Prioridades do dia</h2>
          <div className="mt-5 space-y-4 text-white/75 text-sm">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <strong className="text-white">Revisar oportunidades abertas</strong>
              <p className="mt-1">Concentre esforço nas licitações com aderência direta ao portfólio e prazo curto.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <strong className="text-white">Validar contratos sensíveis</strong>
              <p className="mt-1">Acompanhe vencimentos e renovações antes que virem risco operacional.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <strong className="text-white">Blindar a rotina de ingestão</strong>
              <p className="mt-1">O MVP online precisa de consistência entre busca, detalhe e dado persistido.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
