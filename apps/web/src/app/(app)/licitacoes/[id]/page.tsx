import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Building2, CalendarDays, Landmark, MapPin, Sparkles, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatBRL } from '@/lib/utils';

export const metadata: Metadata = { title: 'Detalhes da Licitação' };

function formatModalidade(value?: string) {
  if (!value) return '-';
  return value.replaceAll('_', ' ');
}

function formatDateBR(value?: string | null) {
  if (!value) return '-';
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return dt.toLocaleString('pt-BR');
}

export default async function LicitacaoDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const qp = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string') qp.set(key, value);
  }

  const detailUrl = `/api/licitacoes/${id}?${qp.toString()}`;
  const res = await fetch(detailUrl, { cache: 'no-store' });
  const detail = await res.json();

  return (
    <div className="space-y-6">
      <Link href="/licitacoes">
        <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para licitações
        </Button>
      </Link>

      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge>{detail.source?.toUpperCase?.() || 'FONTE'}</Badge>
          <Badge variant="secondary">{detail.status}</Badge>
          <Badge variant="secondary">{formatModalidade(detail.modalidade)}</Badge>
        </div>

        <h1 className="text-3xl font-bold text-white leading-tight max-w-5xl">{detail.objeto}</h1>
        <p className="mt-3 text-white/70 max-w-3xl">{detail.resumo}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs uppercase tracking-[0.18em]">Órgão</p>
            <div className="mt-2 flex items-start gap-2 text-white">
              <Building2 className="mt-0.5 h-4 w-4 text-blue-300" />
              <span>{detail.orgaoNome}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs uppercase tracking-[0.18em]">Localidade</p>
            <div className="mt-2 flex items-start gap-2 text-white">
              <MapPin className="mt-0.5 h-4 w-4 text-emerald-300" />
              <span>{detail.municipio ? `${detail.municipio}/${detail.uf}` : detail.uf}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs uppercase tracking-[0.18em]">Abertura</p>
            <div className="mt-2 flex items-start gap-2 text-white">
              <CalendarDays className="mt-0.5 h-4 w-4 text-cyan-300" />
              <span>{formatDateBR(detail.dataAbertura)}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/50 text-xs uppercase tracking-[0.18em]">Valor estimado</p>
            <div className="mt-2 flex items-start gap-2 text-white">
              <WalletCards className="mt-0.5 h-4 w-4 text-yellow-300" />
              <span>{detail.valorEstimado != null ? formatBRL(detail.valorEstimado) : 'Sob consulta'}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Leitura executiva</CardTitle>
            <CardDescription>
              Visão rápida para decidir se a oportunidade merece acompanhamento ativo.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-white/80">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-white font-medium mb-2">
                <Landmark className="h-4 w-4 text-blue-300" />
                Identificação da oportunidade
              </div>
              <p>ID interno: {detail.id}</p>
              <p>ID da fonte: {detail.sourceId}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-white font-medium mb-2">
                <Sparkles className="h-4 w-4 text-emerald-300" />
                Próximos passos recomendados
              </div>
              <ul className="list-disc pl-5 space-y-2">
                <li>Confirmar aderência do objeto ao portfólio da empresa.</li>
                <li>Validar prazo de abertura/encerramento para operação comercial.</li>
                <li>Checar exigências técnicas, habilitação e anexos antes do acompanhamento.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Linha do tempo inicial</CardTitle>
            <CardDescription>
              Esta área já prepara o terreno para futura integração com banco e enriquecimento automático.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(detail.timeline || []).map((step: { titulo: string; descricao: string }, index: number) => (
              <div key={step.titulo + index} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Etapa {index + 1}</p>
                <h3 className="mt-2 font-semibold text-white">{step.titulo}</h3>
                <p className="mt-1 text-sm text-white/70">{step.descricao}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
