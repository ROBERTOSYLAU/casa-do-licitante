import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

const APP_ROUTES = /^\/(dashboard|licitacoes|contratos|fornecedores|ferramentas|alertas)(\/|$)/;

export default NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAppRoute = APP_ROUTES.test(nextUrl.pathname);

      if (isAppRoute && !isLoggedIn) return false; // redireciona para /login automaticamente

      if (nextUrl.pathname === '/login' && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl.origin));
      }

      return true;
    },
  },
}).auth;

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/health|api/auth).*)'],
};
