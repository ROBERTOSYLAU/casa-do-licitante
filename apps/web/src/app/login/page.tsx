import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Casa do Licitante</h1>
          <p className="text-slate-400 text-sm mt-1">Acesse sua conta</p>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm rounded-md px-4 py-3">
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
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="block text-sm text-slate-300 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="voce@empresa.com.br"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-slate-300 mb-1">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md py-2 text-sm transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
