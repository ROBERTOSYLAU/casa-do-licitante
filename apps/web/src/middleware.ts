import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

const APP_ROUTES = /^\/(dashboard|licitacoes|contratos|fornecedores|ferramentas|alertas)(\/|$)/;

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  if (APP_ROUTES.test(nextUrl.pathname) && !isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (nextUrl.pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/health|api/auth).*)'],
};
