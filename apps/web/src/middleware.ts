import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

const { auth } = NextAuth(authConfig);

const APP_ROUTES = /^\/(dashboard|licitacoes|contratos|fornecedores|ferramentas|alertas)(\/|$)/;

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Protected routes — redirect unauthenticated users to /login
  if (APP_ROUTES.test(nextUrl.pathname) && !isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  // /login — redirect authenticated users to /dashboard
  if (nextUrl.pathname === '/login' && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', nextUrl.origin));
  }

  // All other routes (marketing, /api/*, public pages) — pass through
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/health|api/auth).*)'],
};
