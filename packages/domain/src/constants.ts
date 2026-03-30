// ---------------------------------------------------------------------------
// Domain constants — migrated from horizons-src/src/data/filters.js
// ---------------------------------------------------------------------------

export const UF_LIST = [
  { nome: 'Acre', sigla: 'AC' },
  { nome: 'Alagoas', sigla: 'AL' },
  { nome: 'Amapá', sigla: 'AP' },
  { nome: 'Amazonas', sigla: 'AM' },
  { nome: 'Bahia', sigla: 'BA' },
  { nome: 'Ceará', sigla: 'CE' },
  { nome: 'Distrito Federal', sigla: 'DF' },
  { nome: 'Espírito Santo', sigla: 'ES' },
  { nome: 'Goiás', sigla: 'GO' },
  { nome: 'Maranhão', sigla: 'MA' },
  { nome: 'Mato Grosso', sigla: 'MT' },
  { nome: 'Mato Grosso do Sul', sigla: 'MS' },
  { nome: 'Minas Gerais', sigla: 'MG' },
  { nome: 'Pará', sigla: 'PA' },
  { nome: 'Paraíba', sigla: 'PB' },
  { nome: 'Paraná', sigla: 'PR' },
  { nome: 'Pernambuco', sigla: 'PE' },
  { nome: 'Piauí', sigla: 'PI' },
  { nome: 'Rio de Janeiro', sigla: 'RJ' },
  { nome: 'Rio Grande do Norte', sigla: 'RN' },
  { nome: 'Rio Grande do Sul', sigla: 'RS' },
  { nome: 'Rondônia', sigla: 'RO' },
  { nome: 'Roraima', sigla: 'RR' },
  { nome: 'Santa Catarina', sigla: 'SC' },
  { nome: 'São Paulo', sigla: 'SP' },
  { nome: 'Sergipe', sigla: 'SE' },
  { nome: 'Tocantins', sigla: 'TO' },
] as const;

export type UfSigla = (typeof UF_LIST)[number]['sigla'];

export const MODALIDADE_LIST = [
  { id: 'pregao_eletronico', label: 'Pregão Eletrônico' },
  { id: 'pregao_presencial', label: 'Pregão Presencial' },
  { id: 'concorrencia', label: 'Concorrência' },
  { id: 'tomada_preco', label: 'Tomada de Preço' },
  { id: 'convite', label: 'Convite' },
  { id: 'leilao', label: 'Leilão' },
  { id: 'dispensa', label: 'Dispensa de Licitação' },
  { id: 'inexigibilidade', label: 'Inexigibilidade' },
  { id: 'rdc', label: 'RDC' },
  { id: 'credenciamento', label: 'Credenciamento' },
] as const;

export const SOURCE_LIST = [
  { id: 'ambos', label: 'Todas as fontes' },
  { id: 'pncp', label: 'PNCP' },
  { id: 'comprasnet', label: 'ComprasNet' },
] as const;

/** BullMQ queue names — sem dois-pontos (BullMQ não permite) */
export const QUEUE = {
  INGEST_PNCP: 'ingest-pncp',
  INGEST_COMPRASNET: 'ingest-comprasnet',
  VALIDATE_CNPJ: 'validate-cnpj',
  VALIDATE_CERTIDOES: 'validate-certidoes',
  VALIDATE_SANCOES: 'validate-sancoes',
  ALERT_MATCH: 'alert-match',
  ALERT_DELIVER: 'alert-deliver',
  ALERT_DEADLINES: 'alert-deadlines',
  DOCS_EXTRACT: 'docs-extract',
} as const;
