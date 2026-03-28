import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

// Use only the edge-safe config — no Prisma, no bcryptjs.
// Route protection logic lives in authConfig.callbacks.authorized.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/health|api/auth).*)'],
};
