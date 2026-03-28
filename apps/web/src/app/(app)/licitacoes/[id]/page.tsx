import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Detalhes da Licitação' };

export default async function LicitacaoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // TODO: fetch from /api/licitacoes/[id] once DB is seeded
  return (
    <div>
      <Link href="/licitacoes">
        <Button variant="outline" className="mb-6 text-white border-white/30 hover:bg-white/10">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Licitação #{id}</h1>
      <p className="text-white/60">
        Detalhes completos, itens, editais e linha do tempo da licitação.
      </p>
      {/* TODO: licitacao detail card, items table, edital download */}
    </div>
  );
}
