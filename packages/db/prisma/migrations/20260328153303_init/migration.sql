-- CreateEnum
CREATE TYPE "DataSource" AS ENUM ('pncp', 'comprasnet');

-- CreateEnum
CREATE TYPE "LicitacaoStatus" AS ENUM ('aberta', 'suspensa', 'homologada', 'deserta', 'fracassada', 'revogada', 'anulada', 'contrato');

-- CreateEnum
CREATE TYPE "ModalidadeEnum" AS ENUM ('pregao_eletronico', 'pregao_presencial', 'concorrencia', 'tomada_preco', 'convite', 'concurso', 'leilao', 'dispensa', 'inexigibilidade', 'rdc', 'credenciamento', 'outro');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'analyst', 'viewer');

-- CreateEnum
CREATE TYPE "PlanSlug" AS ENUM ('observador', 'executor', 'estrategico');

-- CreateEnum
CREATE TYPE "OrgStatus" AS ENUM ('ativa', 'suspensa', 'cancelada');

-- CreateEnum
CREATE TYPE "Porte" AS ENUM ('me', 'epp', 'medio', 'grande');

-- CreateEnum
CREATE TYPE "CertidaoTipo" AS ENUM ('cnd_federal', 'fgts', 'trabalhista', 'estadual', 'municipal');

-- CreateEnum
CREATE TYPE "CertidaoStatus" AS ENUM ('valida', 'vencida', 'pendente', 'irregular');

-- CreateEnum
CREATE TYPE "SancaoFonte" AS ENUM ('ceis', 'cnep');

-- CreateEnum
CREATE TYPE "AlertChannel" AS ENUM ('email', 'webhook', 'whatsapp');

-- CreateEnum
CREATE TYPE "AlertDigest" AS ENUM ('realtime', 'daily', 'weekly');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('running', 'success', 'partial', 'failed');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT,
    "nome" TEXT NOT NULL,
    "plano" "PlanSlug" NOT NULL DEFAULT 'observador',
    "status" "OrgStatus" NOT NULL DEFAULT 'ativa',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "hashedPassword" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'viewer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Licitacao" (
    "id" TEXT NOT NULL,
    "source" "DataSource" NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modalidade" "ModalidadeEnum" NOT NULL,
    "status" "LicitacaoStatus" NOT NULL DEFAULT 'aberta',
    "orgaoUasg" TEXT,
    "orgaoCnpj" TEXT,
    "orgaoNome" TEXT NOT NULL,
    "orgaoUf" TEXT NOT NULL,
    "orgaoMunicipio" TEXT,
    "objeto" TEXT NOT NULL,
    "valorEstimado" INTEGER,
    "dataPublicacao" TIMESTAMP(3),
    "dataAbertura" TIMESTAMP(3),
    "dataEncerramentoPropostas" TIMESTAMP(3),
    "dataSessaoPublica" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Licitacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicitacaoItem" (
    "id" TEXT NOT NULL,
    "licitacaoId" TEXT NOT NULL,
    "numeroItem" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "catmat" TEXT,
    "catser" TEXT,
    "quantidade" DECIMAL(65,30),
    "valorUnitarioEstimado" INTEGER,

    CONSTRAINT "LicitacaoItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edital" (
    "id" TEXT NOT NULL,
    "licitacaoId" TEXT NOT NULL,
    "urlR2" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "textExtracted" TEXT,
    "extractedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Edital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contrato" (
    "id" TEXT NOT NULL,
    "licitacaoId" TEXT,
    "contratanteUasg" TEXT,
    "contratanteCnpj" TEXT,
    "contratanteNome" TEXT NOT NULL,
    "contratadoCnpj" TEXT NOT NULL,
    "contratadoNome" TEXT NOT NULL,
    "vigenciaInicio" TIMESTAMP(3) NOT NULL,
    "vigenciaFim" TIMESTAMP(3) NOT NULL,
    "valorGlobal" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aditamento" (
    "id" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "valorAcrescimo" INTEGER NOT NULL DEFAULT 0,
    "novaVigenciaFim" TIMESTAMP(3),
    "dataAssinatura" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Aditamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fornecedor" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "nomeFantasia" TEXT,
    "porte" "Porte" NOT NULL DEFAULT 'medio',
    "situacaoCadastral" TEXT,
    "dataAbertura" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certidao" (
    "id" TEXT NOT NULL,
    "fornecedorId" TEXT NOT NULL,
    "tipo" "CertidaoTipo" NOT NULL,
    "dataEmissao" TIMESTAMP(3),
    "dataValidade" TIMESTAMP(3),
    "status" "CertidaoStatus" NOT NULL DEFAULT 'pendente',
    "arquivoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certidao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sancao" (
    "id" TEXT NOT NULL,
    "fornecedorId" TEXT NOT NULL,
    "fonte" "SancaoFonte" NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "motivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sancao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertSubscription" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "keywords" TEXT[],
    "uasgs" TEXT[],
    "ufs" TEXT[],
    "valorMin" INTEGER,
    "valorMax" INTEGER,
    "channels" "AlertChannel"[],
    "digest" "AlertDigest" NOT NULL DEFAULT 'realtime',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlertSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchedLicitacao" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "licitacaoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchedLicitacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertMatch" (
    "id" TEXT NOT NULL,
    "licitacaoId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "source" "DataSource" NOT NULL,
    "jobId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3),
    "recordsFetched" INTEGER NOT NULL DEFAULT 0,
    "recordsUpserted" INTEGER NOT NULL DEFAULT 0,
    "errors" INTEGER NOT NULL DEFAULT 0,
    "status" "SyncStatus" NOT NULL DEFAULT 'running',
    "errorDetail" TEXT,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawPncpRecord" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawPncpRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawComprasnetRecord" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawComprasnetRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_cnpj_key" ON "Organization"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");

-- CreateIndex
CREATE INDEX "Licitacao_orgaoUf_idx" ON "Licitacao"("orgaoUf");

-- CreateIndex
CREATE INDEX "Licitacao_status_idx" ON "Licitacao"("status");

-- CreateIndex
CREATE INDEX "Licitacao_dataAbertura_idx" ON "Licitacao"("dataAbertura");

-- CreateIndex
CREATE UNIQUE INDEX "Licitacao_source_sourceId_key" ON "Licitacao"("source", "sourceId");

-- CreateIndex
CREATE INDEX "LicitacaoItem_licitacaoId_idx" ON "LicitacaoItem"("licitacaoId");

-- CreateIndex
CREATE INDEX "Edital_licitacaoId_idx" ON "Edital"("licitacaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Contrato_licitacaoId_key" ON "Contrato"("licitacaoId");

-- CreateIndex
CREATE INDEX "Contrato_contratadoCnpj_idx" ON "Contrato"("contratadoCnpj");

-- CreateIndex
CREATE INDEX "Contrato_vigenciaFim_idx" ON "Contrato"("vigenciaFim");

-- CreateIndex
CREATE INDEX "Aditamento_contratoId_idx" ON "Aditamento"("contratoId");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_cnpj_key" ON "Fornecedor"("cnpj");

-- CreateIndex
CREATE INDEX "Certidao_fornecedorId_idx" ON "Certidao"("fornecedorId");

-- CreateIndex
CREATE INDEX "Certidao_dataValidade_idx" ON "Certidao"("dataValidade");

-- CreateIndex
CREATE INDEX "Sancao_fornecedorId_idx" ON "Sancao"("fornecedorId");

-- CreateIndex
CREATE INDEX "AlertSubscription_organizationId_idx" ON "AlertSubscription"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchedLicitacao_organizationId_licitacaoId_key" ON "WatchedLicitacao"("organizationId", "licitacaoId");

-- CreateIndex
CREATE INDEX "AlertMatch_licitacaoId_idx" ON "AlertMatch"("licitacaoId");

-- CreateIndex
CREATE INDEX "SyncLog_source_startedAt_idx" ON "SyncLog"("source", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RawPncpRecord_sourceId_key" ON "RawPncpRecord"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "RawComprasnetRecord_sourceId_key" ON "RawComprasnetRecord"("sourceId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicitacaoItem" ADD CONSTRAINT "LicitacaoItem_licitacaoId_fkey" FOREIGN KEY ("licitacaoId") REFERENCES "Licitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edital" ADD CONSTRAINT "Edital_licitacaoId_fkey" FOREIGN KEY ("licitacaoId") REFERENCES "Licitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_licitacaoId_fkey" FOREIGN KEY ("licitacaoId") REFERENCES "Licitacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aditamento" ADD CONSTRAINT "Aditamento_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certidao" ADD CONSTRAINT "Certidao_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sancao" ADD CONSTRAINT "Sancao_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertSubscription" ADD CONSTRAINT "AlertSubscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedLicitacao" ADD CONSTRAINT "WatchedLicitacao_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedLicitacao" ADD CONSTRAINT "WatchedLicitacao_licitacaoId_fkey" FOREIGN KEY ("licitacaoId") REFERENCES "Licitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertMatch" ADD CONSTRAINT "AlertMatch_licitacaoId_fkey" FOREIGN KEY ("licitacaoId") REFERENCES "Licitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
