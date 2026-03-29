import type { NextAuthConfig } from 'next-auth';
import type { UserRole } from '@casa/db';

// Edge-safe auth config — no Prisma, no bcryptjs, no Node-only APIs.
// Used by middleware (runs on Edge runtime).
// Full config with adapter + providers lives in auth.ts (server-only).
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: UserRole }).role;
        token.organizationId = (user as { organizationId: string }).organizationId;
      }
      return token;
    },
    session({ session, token }) {
      const sessionUser = session.user as typeof session.user & {
        id: string;
        role?: UserRole;
        organizationId?: string;
      };
      sessionUser.id = token.id as string;
      sessionUser.role = token.role as UserRole;
      sessionUser.organizationId = token.organizationId as string;
      return session;
    },
  },
  providers: [], // Populated in auth.ts with Credentials (and Google when added)
};
