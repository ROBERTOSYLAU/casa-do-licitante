import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Building2, CalendarDays, Hash, Landmark, MapPin, ShieldCheck, Sparkles, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatBRL } from '@/lib/utils';
import { getCanonicalLicitacaoDetail } from '@/app/api/licitacoes/_lib/canonical';

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
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getCanonicalLicitacaoDetail(decodeURIComponent(id));

  if (!detail) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link href="/licitacoes">
        <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para licitações
        </Button>
      </Link>

      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge>{detail.source?.toUpperCase?.() || 'FONTE'}</Badge>
          <Badge variant="secondary">{detail.status}</Badge>
          <Badge variant="secondary">{formatModalidade(detail.modalidade)}</Badge>
        </div>

        <h1 className="max-w-5xl text-3xl font-bold leading-tight text-white">{detail.objeto}</h1>
        <p className="mt-3 max-w-3xl text-white/70">{detail.resumo}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/50">Órgão</p>
            <div className="mt-2 flex items-start gap-2 text-white">
              <Building2 className="mt-0.5 h-4 w-4 text-blue-300" />
              <span>{detail.orgaoNome}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/50">Localidade</p>
            <div className="mt-2 flex items-start gap-2 text-white">
              <MapPin className="mt-0.5 h-4 w-4 text-emerald-300" />
              <span>{detail.municipio ? `${detail.municipio}/${detail.uf}` : detail.uf}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/50">Valor estimado</p>
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
            <CardTitle>Identificação e contexto</CardTitle>
            <CardDescription>
              Dados essenciais para confirmar se o clique levou para a oportunidade correta.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-white/80">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 font-medium text-white">
                <Hash className="h-4 w-4 text-cyan-300" />
                Número e identificação
              </div>
              <p>ID interno: {detail.id}</p>
              <p>ID da fonte: {detail.sourceId}</p>
              {detail.orgaoUasg && <p>UASG: {detail.orgaoUasg}</p>}
              <p>Portal/Fonte: {detail.source?.toUpperCase?.() || '-'}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 font-medium text-white">
                <CalendarDays className="h-4 w-4 text-emerald-300" />
                Datas principais
              </div>
              <p>Abertura: {formatDateBR(detail.dataAbertura)}</p>
              <p>Encerramento / disputa: {formatDateBR(detail.dataEncerramentoPropostas)}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 font-medium text-white">
                <Landmark className="h-4 w-4 text-blue-300" />
                Classificação da oportunidade
              </div>
              <p>Modalidade: {formatModalidade(detail.modalidade)}</p>
              <p>Status: {detail.status}</p>
              <p>UF: {detail.uf}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leitura executiva</CardTitle>
            <CardDescription>
              Visão rápida para ajudar a triagem e a decisão de acompanhamento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-white/80">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 font-medium text-white">
                <Sparkles className="h-4 w-4 text-emerald-300" />
                Próximos passos recomendados
              </div>
              <ul className="list-disc space-y-2 pl-5">
                <li>Confirmar aderência do objeto ao portfólio da empresa.</li>
                <li>Validar prazo, localidade e complexidade operacional.</li>
                <li>Checar exigências, documentos e risco antes de seguir para disputa.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2 font-medium text-white">
                <ShieldCheck className="h-4 w-4 text-yellow-300" />
                Observação
              </div>
              <p>
                Esta tela ainda está em evolução. O objetivo agora é garantir clique correto, leitura de identificação e contexto suficiente para triagem operacional.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
