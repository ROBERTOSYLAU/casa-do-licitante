-- Expand monetary columns from INT4 to BIGINT to support large public bidding values.
ALTER TABLE "Licitacao"
  ALTER COLUMN "valorEstimado" TYPE BIGINT;

ALTER TABLE "LicitacaoItem"
  ALTER COLUMN "valorUnitarioEstimado" TYPE BIGINT;

ALTER TABLE "Contrato"
  ALTER COLUMN "valorGlobal" TYPE BIGINT;

ALTER TABLE "Aditamento"
  ALTER COLUMN "valorAcrescimo" TYPE BIGINT;

ALTER TABLE "AlertSubscription"
  ALTER COLUMN "valorMin" TYPE BIGINT,
  ALTER COLUMN "valorMax" TYPE BIGINT;
