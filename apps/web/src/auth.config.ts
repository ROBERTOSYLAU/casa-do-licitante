import type { NextAuthConfig } from 'next-auth';
import type { UserRole } from '@casa/db';

// Edge-safe auth config — no Prisma, no bcryptjs, no Node-only APIs.
// Used by middleware (runs on Edge runtime).
// Full config with adapter + providers lives in auth.ts (server-only).
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAppRoute =
        /^\/(dashboard|licitacoes|contratos|fornecedores|ferramentas|alertas)(\/|$)/.test(
          nextUrl.pathname,
        );

      if (isAppRoute && !isLoggedIn) {
        const loginUrl = new URL('/login', nextUrl.origin);
        loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
        return Response.redirect(loginUrl);
      }

      if (nextUrl.pathname === '/login' && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl.origin));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: UserRole }).role;
        token.organizationId = (user as { organizationId: string }).organizationId;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      (session.user as Record<string, unknown>).role = token.role;
      (session.user as Record<string, unknown>).organizationId = token.organizationId;
      return session;
    },
  },
  providers: [], // Populated in auth.ts with Credentials (and Google when added)
} satisfies NextAuthConfig;
