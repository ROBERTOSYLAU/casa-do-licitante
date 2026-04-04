'use client';

import { useState } from 'react';
import { Scale, Copy, Check, Search, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';

type TipoPeca = 'impugnacao' | 'esclarecimento' | 'recurso' | 'contrarrazao' | 'intencao_recurso';

interface Peca {
  id: string;
  tipo: TipoPeca;
  titulo: string;
  descricao: string;
  modelo: string;
  lei: string;
}

const TIPO_META: Record<TipoPeca, { label: string; color: string; bg: string }> = {
  impugnacao:       { label: 'Impugnação',         color: 'text-red-300',     bg: 'bg-red-900/20 border-red-500/20' },
  esclarecimento:   { label: 'Esclarecimento',      color: 'text-blue-300',    bg: 'bg-blue-900/20 border-blue-500/20' },
  recurso:          { label: 'Recurso',              color: 'text-yellow-300',  bg: 'bg-yellow-900/20 border-yellow-500/20' },
  contrarrazao:     { label: 'Contrarrazão',         color: 'text-orange-300',  bg: 'bg-orange-900/20 border-orange-500/20' },
  intencao_recurso: { label: 'Intenção de Recurso',  color: 'text-violet-300',  bg: 'bg-violet-900/20 border-violet-500/20' },
};

const TIPOS: TipoPeca[] = ['impugnacao', 'esclarecimento', 'recurso', 'contrarrazao', 'intencao_recurso'];

const PECAS: Peca[] = [
  {
    id: '1',
    tipo: 'impugnacao',
    titulo: 'Impugnação de Edital — Exigência Restritiva',
    descricao: 'Modelo para impugnar cláusula do edital que restringe a competitividade ao exigir característica de produto específico.',
    lei: 'Art. 164, Lei 14.133/2021',
    modelo: `[CIDADE], [DATA].

Ao Pregoeiro(a) responsável pelo
[NÚMERO DO PREGÃO] — [NOME DO ÓRGÃO]

ASSUNTO: IMPUGNAÇÃO AO EDITAL

[NOME DA EMPRESA], inscrita no CNPJ sob o nº [CNPJ], com sede em [ENDEREÇO], neste ato representada por [REPRESENTANTE LEGAL], vem respeitosamente à presença de Vossa Senhoria apresentar IMPUGNAÇÃO ao edital do pregão eletrônico nº [NÚMERO], pelos fundamentos a seguir expostos.

I — DOS FATOS

O edital em referência, em seu item [X], exige [DESCRIÇÃO DA EXIGÊNCIA], o que restringe indevidamente a participação de fornecedores que oferecem produtos equivalentes em qualidade e funcionalidade.

II — DO DIREITO

A exigência contraria o art. 9º da Lei 14.133/2021, que veda especificações técnicas e descrições que frustrem o caráter competitivo da licitação, bem como o art. 41, § 1º, da mesma lei.

Nesse sentido, o Tribunal de Contas da União, por meio do Acórdão [X/ANO], decidiu que exigências que restringem a competitividade sem justificativa técnica fundamentada são ilegais.

III — DO PEDIDO

Ante o exposto, requer-se:

a) O acatamento desta impugnação;
b) A retificação do edital, eliminando a cláusula restritiva do item [X];
c) A reabertura do prazo para envio de propostas, caso o edital seja alterado.

[NOME DO REPRESENTANTE LEGAL]
[CARGO] — [NOME DA EMPRESA]
CNPJ: [CNPJ]`,
  },
  {
    id: '2',
    tipo: 'esclarecimento',
    titulo: 'Pedido de Esclarecimento — Especificações Técnicas',
    descricao: 'Modelo para solicitar esclarecimentos sobre especificações técnicas do edital antes da apresentação de propostas.',
    lei: 'Art. 164, Lei 14.133/2021',
    modelo: `[CIDADE], [DATA].

Ao Pregoeiro(a) responsável pelo
[NÚMERO DO PREGÃO] — [NOME DO ÓRGÃO]

ASSUNTO: PEDIDO DE ESCLARECIMENTO

[NOME DA EMPRESA], inscrita no CNPJ sob o nº [CNPJ], vem solicitar esclarecimento referente ao Pregão Eletrônico nº [NÚMERO]:

QUESTIONAMENTO 1:
Em relação ao item [X] do edital/termo de referência, que estabelece "[TEXTO DO EDITAL]", questiona-se:

[PERGUNTA OBJETIVA]

Fundamento: A clareza nas especificações é essencial para a elaboração de proposta competitiva e fiel ao objeto licitado, conforme art. 9º, I, da Lei 14.133/2021.

QUESTIONAMENTO 2:
[SEGUNDO QUESTIONAMENTO, SE HOUVER]

Aguardamos esclarecimentos para adequada formulação de proposta.

[NOME DO REPRESENTANTE LEGAL]
[CARGO] — [NOME DA EMPRESA]
CNPJ: [CNPJ]`,
  },
  {
    id: '3',
    tipo: 'intencao_recurso',
    titulo: 'Intenção de Recurso — Pregão Eletrônico',
    descricao: 'Manifestação motivada de intenção de recurso após a fase de lances do pregão.',
    lei: 'Art. 165, Lei 14.133/2021',
    modelo: `[CIDADE], [DATA].

Ao Pregoeiro(a) responsável pelo
Pregão Eletrônico nº [NÚMERO] — [NOME DO ÓRGÃO]

ASSUNTO: INTENÇÃO DE RECURSO

[NOME DA EMPRESA], inscrita no CNPJ sob o nº [CNPJ], por meio de seu representante credenciado [NOME DO REPRESENTANTE], vem manifestar INTENÇÃO DE RECURSO contra a decisão do Pregoeiro que [DESCLASSIFICOU A PROPOSTA / HABILITOU A EMPRESA X / JULGOU O RESULTADO], pelos seguintes motivos SUMÁRIOS:

1. [PRIMEIRO MOTIVO RESUMIDO — a fundamentação completa seguirá nas razões de recurso]

2. [SEGUNDO MOTIVO RESUMIDO, SE HOUVER]

Requer-se a abertura do prazo recursal de 3 (três) dias úteis para apresentação das razões completas, conforme art. 165, § 1º, da Lei nº 14.133/2021.

[NOME DO REPRESENTANTE]
[NOME DA EMPRESA]
CNPJ: [CNPJ]`,
  },
  {
    id: '4',
    tipo: 'recurso',
    titulo: 'Razões de Recurso — Desclassificação de Proposta',
    descricao: 'Modelo de razões de recurso contra decisão que desclassificou proposta por alegada inexequibilidade.',
    lei: 'Art. 165, Lei 14.133/2021',
    modelo: `[CIDADE], [DATA].

À Autoridade Superior do
Pregão Eletrônico nº [NÚMERO] — [NOME DO ÓRGÃO]

RAZÕES DE RECURSO

[NOME DA EMPRESA], inscrita no CNPJ sob o nº [CNPJ], com sede em [ENDEREÇO], vem, nos termos do art. 165 da Lei nº 14.133/2021, apresentar RAZÕES DE RECURSO contra a decisão que desclassificou sua proposta, pelos fundamentos a seguir:

I — SÍNTESE DA DECISÃO RECORRIDA

Em [DATA DA SESSÃO], o Pregoeiro desclassificou a proposta da Recorrente sob o fundamento de que o valor ofertado de R$ [VALOR] seria inexequível, sem, contudo, solicitar as planilhas de composição de custos, como exige o art. 59, § 3º, da Lei 14.133/2021.

II — DAS RAZÕES

A desclassificação é nula, pois:

a) O pregoeiro desclassificou sem abrir prazo para apresentação de justificativas, em violação ao art. 59, § 3º, da Lei 14.133/2021;

b) O preço ofertado é exequível, conforme demonstra a Planilha de Composição de Custos em anexo;

c) O valor encontra respaldo no [REFERÊNCIA DE MERCADO — SICRO, SINAPI, pesquisa de preços].

III — DO PEDIDO

Requer-se:

a) O conhecimento e provimento deste recurso;
b) A reclassificação da proposta da Recorrente;
c) A continuidade do certame com a participação desta empresa.

[NOME DO REPRESENTANTE LEGAL]
[CARGO] — [NOME DA EMPRESA]
CNPJ: [CNPJ]`,
  },
  {
    id: '5',
    tipo: 'contrarrazao',
    titulo: 'Contrarrazões de Recurso',
    descricao: 'Modelo de contrarrazões para contrapor recurso interposto por concorrente.',
    lei: 'Art. 165, §§ 2º e 3º, Lei 14.133/2021',
    modelo: `[CIDADE], [DATA].

À Autoridade Superior do
Pregão Eletrônico nº [NÚMERO] — [NOME DO ÓRGÃO]

CONTRARRAZÕES DE RECURSO

[NOME DA EMPRESA CONTRARRAZOADANTE], inscrita no CNPJ sob o nº [CNPJ], vencedora do certame em referência, vem apresentar CONTRARRAZÕES ao recurso interposto por [NOME DA RECORRENTE], nos termos do art. 165, § 3º, da Lei 14.133/2021.

I — DA INTEMPESTIVIDADE / AUSÊNCIA DE MOTIVAÇÃO

[SE APLICÁVEL] O recurso deve ser liminarmente rejeitado por [INTEMPESTIVIDADE / AUSÊNCIA DE MOTIVAÇÃO NA INTENÇÃO DE RECURSO].

II — DO MÉRITO

O recurso não merece provimento.

A Recorrente alega [RESUMO DAS ALEGAÇÕES], porém tais argumentos carecem de fundamento legal e fático, pelos seguintes motivos:

a) [PRIMEIRA CONTRARRAZÃO];
b) [SEGUNDA CONTRARRAZÃO].

Ademais, a decisão do Pregoeiro encontra-se devidamente fundamentada e em conformidade com o edital e com a legislação aplicável.

III — DO PEDIDO

Requer-se o desprovimento do recurso, mantendo-se integralmente a decisão do Pregoeiro.

[NOME DO REPRESENTANTE LEGAL]
[CARGO] — [NOME DA EMPRESA]
CNPJ: [CNPJ]`,
  },
  {
    id: '6',
    tipo: 'esclarecimento',
    titulo: 'Pedido de Esclarecimento — Habilitação Jurídica',
    descricao: 'Modelo para solicitar esclarecimento sobre os documentos de habilitação jurídica exigidos no edital.',
    lei: 'Art. 66, Lei 14.133/2021',
    modelo: `[CIDADE], [DATA].

Ao Pregoeiro(a) responsável pelo
[NÚMERO DO PREGÃO] — [NOME DO ÓRGÃO]

ASSUNTO: PEDIDO DE ESCLARECIMENTO — HABILITAÇÃO JURÍDICA

[NOME DA EMPRESA], inscrita no CNPJ sob o nº [CNPJ], solicita esclarecimento sobre os requisitos de habilitação jurídica do Pregão Eletrônico nº [NÚMERO]:

QUESTIONAMENTO:
O item [X] do edital exige "[TRANSCRIÇÃO DO REQUISITO]". Questiona-se se [EMPRESA DO TIPO X — ex: sociedade limitada unipessoal / cooperativa / MEI] está desobrigada de apresentar [DOCUMENTO X], tendo em vista [FUNDAMENTO LEGAL].

Fundamento: O art. 66 da Lei 14.133/2021 elenca taxativamente os documentos de habilitação jurídica exigíveis, não sendo admitida exigência de documentos além dos previstos em lei.

Aguardamos esclarecimento até o prazo legal para formulação de proposta.

[NOME DO REPRESENTANTE LEGAL]
[CARGO] — [NOME DA EMPRESA]
CNPJ: [CNPJ]`,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white transition"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copiado!' : 'Copiar modelo'}
    </button>
  );
}

function PecaCard({ peca }: { peca: Peca }) {
  const [expanded, setExpanded] = useState(false);
  const meta = TIPO_META[peca.tipo];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${meta.bg} ${meta.color}`}>
                {meta.label}
              </span>
              <span className="text-xs text-white/35">{peca.lei}</span>
            </div>
            <h3 className="text-base font-semibold text-white">{peca.titulo}</h3>
            <p className="mt-1 text-sm text-white/55">{peca.descricao}</p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <CopyButton text={peca.modelo} />
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/3 px-3 py-1.5 text-xs text-white/45 hover:bg-white/8 transition"
            >
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {expanded ? 'Fechar' : 'Ver modelo'}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/10 bg-slate-900/60 p-5">
          <pre className="text-xs text-white/75 whitespace-pre-wrap leading-relaxed font-mono">
            {peca.modelo}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function PecasJuridicas() {
  const [busca, setBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<TipoPeca | ''>('');

  const filtradas = PECAS.filter(p => {
    const matchTipo = !tipoFiltro || p.tipo === tipoFiltro;
    const matchBusca = !busca || p.titulo.toLowerCase().includes(busca.toLowerCase()) || p.descricao.toLowerCase().includes(busca.toLowerCase());
    return matchTipo && matchBusca;
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-400/20 bg-slate-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-200 mb-4">
          <Scale className="h-3.5 w-3.5" />
          Biblioteca jurídica
        </div>
        <h1 className="text-3xl font-bold text-white">Peças Jurídicas</h1>
        <p className="mt-2 text-white/60">
          Modelos de impugnações, esclarecimentos, recursos e contrarrazões para licitações públicas. Baseados na Lei 14.133/2021.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar modelos..."
            className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/30"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTipoFiltro('')}
            className={`rounded-full border px-3 py-2 text-xs transition ${!tipoFiltro ? 'bg-white/15 border-white/30 text-white' : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10'}`}
          >
            Todos
          </button>
          {TIPOS.map(t => (
            <button
              key={t}
              onClick={() => setTipoFiltro(tipoFiltro === t ? '' : t)}
              className={`rounded-full border px-3 py-2 text-xs transition ${
                tipoFiltro === t
                  ? `${TIPO_META[t].bg} ${TIPO_META[t].color} border-current`
                  : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {TIPO_META[t].label}
            </button>
          ))}
        </div>
      </div>

      {/* Resultado */}
      <p className="text-sm text-white/40">
        {filtradas.length} modelo{filtradas.length !== 1 ? 's' : ''} encontrado{filtradas.length !== 1 ? 's' : ''}
      </p>

      <div className="space-y-4">
        {filtradas.map(peca => <PecaCard key={peca.id} peca={peca} />)}
        {filtradas.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center">
            <FileText className="mx-auto mb-3 h-8 w-8 text-white/20" />
            <p className="text-white/40 text-sm">Nenhum modelo encontrado para os filtros aplicados.</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-yellow-500/15 bg-yellow-900/10 p-5">
        <p className="text-xs text-yellow-200/70 leading-relaxed">
          <strong className="text-yellow-200">Aviso legal:</strong> Os modelos acima são ponto de partida e devem ser adaptados às particularidades de cada caso. Recomenda-se sempre a revisão por advogado especializado antes de qualquer submissão. A Casa do Licitante não se responsabiliza pelo uso inadequado dos modelos.
        </p>
      </div>
    </div>
  );
}
