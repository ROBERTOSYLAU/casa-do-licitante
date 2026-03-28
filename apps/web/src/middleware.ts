import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;

  const isAppRoute = /^\/(dashboard|licitacoes|contratos|fornecedores|ferramentas|alertas)(\/|$)/.test(
    nextUrl.pathname,
  );

  if (isAppRoute && !session) {
    const loginUrl = new URL('/login', nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login page
  if (nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  // Skip Next.js internals, static files, and public API endpoints
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/health|api/auth).*)'],
};
