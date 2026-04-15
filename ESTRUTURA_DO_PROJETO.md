# ESTRUTURA_DO_PROJETO.md

## Raiz do projeto
`C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante`

## Pastas raiz identificadas
- `.github`
- `.turbo`
- `api`
- `apps`
- `docs`
- `IMAGENS DE REFERENCIA`
- `nginx`
- `node_modules`
- `packages`
- `scripts`

## Arquivos raiz principais
- `.env.example`
- `.env.local`
- `.gitignore`
- `docker-compose.yml`
- `Dockerfile.web`
- `Dockerfile.worker`
- `ecosystem.config.cjs`
- `manual-api-compras.pdf`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `README.md`
- `STATUS_ATUAL.md`
- `COMO_RODAR_LOCAL.md`
- `COMO_SUBIR_VPS.md`
- `ESTRUTURA_DO_PROJETO.md`
- `PENDENCIAS.md`
- `test-abertura.ts`
- `test-api.ts`
- `test-real.ts`
- `tsconfig.base.json`
- `turbo.json`

## Organização funcional
### `apps/web`
Responsável por:
- frontend Next.js
- autenticação
- páginas do produto
- rotas `/api/*`
- healthcheck

### `apps/worker`
Responsável por:
- jobs assíncronos
- ingestão PNCP
- ingestão ComprasNet
- integração com Redis/filas

### `packages/db`
Responsável por:
- Prisma Client
- schema do banco
- migrations

### `packages/domain`
Responsável por:
- tipos e contratos de domínio

### `packages/gov-apis`
Responsável por:
- conectores das APIs públicas
- PNCP
- ComprasNet

### `api`
- serviço legado ainda existente no monorepo

### `docs`
Documentação técnica e operacional existente:
- `ARCHITECTURE.md`
- `CLAUDE_CODE.md`
- `DATA-SOURCES.md`
- `EXECUTION-LOG.md`
- `NEXT-STEP-ENDTOEND.md`
- `NEXT-STEPS.md`
- `RUNBOOK.md`

### `scripts`
Scripts existentes:
- `deploy.sh`
- `entrypoint-web.sh`
- `setup-vps.sh`
- `test-comprasnet.mjs`

### `nginx`
- configs de publicação/proxy reverso

## Arquivos relevantes novos ou alterados no estado atual
- `apps/web/src/app/api/licitacoes/_lib/canonical.ts`
- `apps/web/src/lib/licitacoes.ts`
- `apps/worker/src/jobs/ingest-comprasnet.ts`
- `apps/web/src/components/tools/CurrencyConverter.tsx`
- `apps/web/src/components/tools/TrackingPlaceholder.tsx`
- `docs/ARCHITECTURE.md`
- `docs/DATA-SOURCES.md`
- `docs/EXECUTION-LOG.md`
- `docs/NEXT-STEP-ENDTOEND.md`
- `docs/RUNBOOK.md`
- `packages/db/prisma/migrations/20260413142000_bigint_money_fields/`
- `Dockerfile.web`
- `Dockerfile.worker`
