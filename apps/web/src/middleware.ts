import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const APP_ROUTES = /^\/(dashboard|licitacoes|contratos|fornecedores|ferramentas|alertas|analise|minha-empresa|juridico)(\/|$)/;

// next-auth v5 mudou o nome do cookie: authjs.session-token (http) ou __Secure-authjs.session-token (https)
const COOKIE_NAME = process.env.NEXTAUTH_URL?.startsWith('https')
  ? '__Secure-authjs.session-token'
  : 'authjs.session-token';

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: COOKIE_NAME,
    salt: COOKIE_NAME,
  });

  const isLoggedIn = !!token;

  if (APP_ROUTES.test(nextUrl.pathname) && !isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (nextUrl.pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/health|api/auth).*)'],
};
