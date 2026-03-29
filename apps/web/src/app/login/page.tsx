import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const metadata = { title: 'Entrar' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  if (session) redirect('/dashboard');

  const { callbackUrl, error } = await searchParams;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.28)] lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
            <Sparkles className="h-3.5 w-3.5" />
            Plataforma comercial para licitações
          </div>

          <h1 className="mt-6 text-5xl font-bold leading-tight text-white">
            Transforme busca pública em <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">decisão comercial</span>.
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-white/72 leading-8">
            Acompanhe oportunidades, refine filtros, acelere análise de editais e opere sua inteligência comercial em um único painel.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/55">Fontes integradas</p>
              <div className="mt-2 text-3xl font-bold">02</div>
              <p className="mt-2 text-sm text-white/65">PNCP e ComprasNet ativos no MVP.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/55">Proposta de valor</p>
              <div className="mt-2 text-3xl font-bold">+ foco</div>
              <p className="mt-2 text-sm text-white/65">Menos ruído, mais decisão sobre o que vale perseguir.</p>
            </div>
          </div>
        </section>

        <section className="w-full rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold text-white">Entrar na plataforma</h1>
            <p className="mt-2 text-sm text-white/60">Acesse o painel da Casa do Licitante.</p>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-700/60 bg-red-950/50 px-4 py-3 text-sm text-red-200">
              {error === 'CredentialsSignin'
                ? 'Email ou senha incorretos.'
                : 'Ocorreu um erro. Tente novamente.'}
            </div>
          )}

          <form
            action={async (formData: FormData) => {
              'use server';
              await signIn('credentials', {
                email: formData.get('email'),
                password: formData.get('password'),
                redirectTo: callbackUrl ?? '/dashboard',
              });
            }}
            className="mt-8 space-y-5"
          >
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm text-white/75">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="h-12 w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="voce@empresa.com.br"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm text-white/75">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="h-12 w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite sua senha"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-sm font-semibold text-white transition hover:from-emerald-400 hover:to-blue-400"
            >
              Entrar no painel
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
