// NextAuth v5 — handlers will be configured in auth.ts at the project root
// when credentials + Google provider are set up.
export const dynamic = 'force-dynamic';

// Placeholder: wire up once @auth/prisma-adapter is configured
export async function GET() {
  return new Response('NextAuth not yet configured', { status: 501 });
}
export async function POST() {
  return new Response('NextAuth not yet configured', { status: 501 });
}
