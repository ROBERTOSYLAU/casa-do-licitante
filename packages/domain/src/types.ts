// ---------------------------------------------------------------------------
// Core domain types shared between web and worker
// ---------------------------------------------------------------------------

// -- Enums --

export type LicitacaoStatus =
  | 'aberta'
  | 'suspensa'
  | 'homologada'
  | 'deserta'
  | 'fracassada'
  | 'revogada'
  | 'anulada'
  | 'contrato';

export type Modalidade =
  | 'pregao_eletronico'
  | 'pregao_presencial'
  | 'concorrencia'
  | 'tomada_preco'
  | 'convite'
  | 'concurso'
  | 'leilao'
  | 'dispensa'
  | 'inexigibilidade'
  | 'rdc'
  | 'credenciamento'
  | 'outro';

export type DataSource = 'pncp' | 'comprasnet';

export type UserRole = 'admin' | 'analyst' | 'viewer';

export type PlanSlug = 'observador' | 'executor' | 'estrategico';

export type Porte = 'me' | 'epp' | 'medio' | 'grande';

export type AlertChannel = 'email' | 'webhook' | 'whatsapp';

export type AlertDigest = 'realtime' | 'daily' | 'weekly';

// -- Search --

export interface SearchFilters {
  keyword?: string;
  uf?: string;
  municipio?: string;
  modalidade?: string;
  dataInicial?: string; // ISO date yyyy-MM-dd
  dataFinal?: string;
  valorMin?: number; // centavos
  valorMax?: number; // centavos
  source?: DataSource;
  page?: number;
}

export interface LicitacaoSearchResult {
  id: string;
  source: DataSource;
  sourceId: string;
  objeto: string;
  orgaoNome: string;
  orgaoUasg?: string;
  uf: string;
  municipio?: string;
  modalidade: string;
  status: LicitacaoStatus;
  /** Integer centavos */
  valorEstimado?: number;
  dataAbertura?: string;
  dataEncerramentoPropostas?: string;
}

// -- Licitacao detail --

export interface LicitacaoItem {
  numeroItem: number;
  descricao: string;
  catmat?: string;
  catser?: string;
  quantidade?: number;
  /** Integer centavos */
  valorUnitarioEstimado?: number;
}

// -- Worker job payloads --

export interface IngestJobPayload {
  source: DataSource;
  dataInicial: string;
  dataFinal: string;
}

export interface AlertMatchJobPayload {
  licitacaoId: string;
}

export interface AlertDeliverJobPayload {
  subscriptionId: string;
  licitacaoId: string;
  channels: AlertChannel[];
}
