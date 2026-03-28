import { NextRequest, NextResponse } from 'next/server';

// TODO: replace with Prisma lookup once DB is seeded by workers
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return NextResponse.json({ error: `Licitação ${id} not found` }, { status: 404 });
}
