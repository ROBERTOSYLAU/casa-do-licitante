# STATUS_ATUAL.md

## 1. Pasta raiz do projeto
`C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante`

## 2. Estrutura principal atual
### Pastas raiz identificadas
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

### Arquivos raiz principais
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

### Subpastas funcionais principais
#### `apps/`
- `apps/web` -> frontend Next.js + rotas server/api + auth
- `apps/worker` -> worker de ingestão e filas

#### `packages/`
- `packages/db` -> Prisma, schema, migrations, client
- `packages/domain` -> tipos e contratos de domínio
- `packages/gov-apis` -> integrações PNCP e ComprasNet

#### `docs/`
- `docs/ARCHITECTURE.md`
- `docs/CLAUDE_CODE.md`
- `docs/DATA-SOURCES.md`
- `docs/EXECUTION-LOG.md`
- `docs/NEXT-STEP-ENDTOEND.md`
- `docs/NEXT-STEPS.md`
- `docs/RUNBOOK.md`

#### `scripts/`
- `scripts/deploy.sh`
- `scripts/entrypoint-web.sh`
- `scripts/setup-vps.sh`
- `scripts/test-comprasnet.mjs`

#### `nginx/`
- pasta de config de proxy reverso para publicação do app

#### `api/`
- backend/API legada ainda existente no monorepo

## 3. Arquivos criados ou alterados no estado atual do projeto
### Alterados e rastreados pelo Git no momento
- `.env.example`
- `README.md`
- `apps/web/next.config.ts`
- `apps/web/src/app/(app)/dashboard/page.tsx`
- `apps/web/src/app/(app)/ferramentas/page.tsx`
- `apps/web/src/app/(app)/licitacoes/[id]/page.tsx`
- `apps/web/src/app/api/health/route.ts`
- `apps/web/src/app/api/licitacoes/[id]/route.ts`
- `apps/web/src/app/api/licitacoes/route.ts`
- `apps/web/src/components/empresa/MinhaEmpresaClient.tsx`
- `apps/web/src/components/search/SearchForm.tsx`
- `apps/web/src/components/search/SearchLicitacoesClient.tsx`
- `apps/web/src/components/tools/ToolsGrid.tsx`
- `apps/worker/src/index.ts`
- `apps/worker/src/jobs/ingest-pncp.ts`
- `docker-compose.yml`
- `packages/db/prisma/schema.prisma`
- `packages/domain/src/types.ts`
- `packages/gov-apis/src/comprasnet.ts`

### Criados e ainda não rastreados/novos no Git no momento
- `Dockerfile.web`
- `Dockerfile.worker`
- `apps/web/src/app/api/licitacoes/_lib/canonical.ts`
- `apps/web/src/components/tools/CurrencyConverter.tsx`
- `apps/web/src/components/tools/TrackingPlaceholder.tsx`
- `apps/web/src/lib/licitacoes.ts`
- `apps/worker/src/jobs/ingest-comprasnet.ts`
- `docs/ARCHITECTURE.md`
- `docs/DATA-SOURCES.md`
- `docs/EXECUTION-LOG.md`
- `docs/NEXT-STEP-ENDTOEND.md`
- `docs/RUNBOOK.md`
- `packages/db/prisma/migrations/20260413142000_bigint_money_fields/`
- `scripts/entrypoint-web.sh`
- `scripts/test-comprasnet.mjs`
- `STATUS_ATUAL.md`

### Arquivos de contexto/memória fora do repositório do app, mas ativos no workspace
- `C:\Users\Space Work\.openclaw\workspace\MEMORY.md`
- `C:\Users\Space Work\.openclaw\workspace\HEARTBEAT.md`
- `C:\Users\Space Work\.openclaw\workspace\memory\2026-04-14.md`
- `C:\Users\Space Work\.openclaw\workspace\memory\2026-04-15.md`
- `C:\Users\Space Work\.openclaw\workspace\memory\checkpoint-template.md`
- `C:\Users\Space Work\.openclaw\workspace\memory\heartbeat-state.json`

## 4. Partes já prontas
### Core de busca/detalhe
- busca e detalhe de licitações migrados para leitura da base canônica via Prisma
- bug de envio de `periodoTipo` corrigido
- defaults de busca ajustados

### Integração governamental
- integração real de ComprasNet preparada com autenticação por `COMPRASNET_API_KEY`
- teste real autenticado da API oficial executado com sucesso
- evidência registrada de retorno real (`33` registros em teste)

### Worker/infra parcial
- job `ingest-comprasnet.ts` criado
- worker passou a registrar ingestão ComprasNet
- healthcheck ampliado para validar banco, Redis e presença da chave da API
- `docker-compose.yml` ajustado para propagar `COMPRASNET_API_KEY`

### Frontend/UX já melhorados
- `Conversor de Moedas` virou funcionalidade real
- `Rastreamento de Encomendas` deixou de ser vazio e ganhou destino coerente
- `Minha Empresa` passou a exibir data em formato BR
- build já foi validado com sucesso após as rodadas principais

### Documentação
- arquitetura documentada
- runbook operacional documentado
- log contínuo de execução criado
- próximo passo end-to-end documentado
- catálogo de fontes estratégicas criado

## 5. Partes que ainda faltam
- validação end-to-end real do worker com Postgres + Redis + persistência canônica
- confirmar e corrigir deploy/infra do app online com 502
- localizar ou criar usuário válido para login funcional
- fazer deploy de fato na VPS
- sincronizar mudanças para GitHub
- continuar auditoria anti-fantasma em dashboard, contratos, fornecedores e áreas correlatas
- amadurecer dashboard para dados reais
- amadurecer contratos/fornecedores/jurídico para fluxo mais sério de produto
- fechar operação de produção sem drift entre Docker/PM2/serviços legados

## 6. Existência de banco, docker, env, scripts, configs, nginx, worker, frontend, backend e docs
### Banco
Existe.
- Prisma em `packages/db`
- schema em `packages/db/prisma/schema.prisma`
- migrations em `packages/db/prisma/migrations`

### Docker
Existe.
- `docker-compose.yml`
- `Dockerfile.web`
- `Dockerfile.worker`

### Env
Existe.
- `.env.example`
- `.env.local`
- variáveis citadas: `DATABASE_URL`, `REDIS_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `COMPRASNET_API_KEY`

### Scripts
Existe.
- `scripts/deploy.sh`
- `scripts/setup-vps.sh`
- `scripts/entrypoint-web.sh`
- `scripts/test-comprasnet.mjs`

### Configs
Existe.
- `ecosystem.config.cjs`
- `turbo.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `apps/web/next.config.ts`

### Nginx
Existe.
- pasta `nginx/`
- documentação de runbook cita publicação por subdomínios `app` e `api`

### Worker
Existe.
- `apps/worker`
- jobs de PNCP e ComprasNet

### Frontend
Existe.
- `apps/web`
- Next.js 15, App Router, auth, páginas e componentes

### Backend
Existe em duas camadas.
- backend acoplado ao web via rotas `/api/*`
- serviço legado em `api/`

### Docs
Existe.
- `docs/ARCHITECTURE.md`
- `docs/CLAUDE_CODE.md`
- `docs/DATA-SOURCES.md`
- `docs/EXECUTION-LOG.md`
- `docs/NEXT-STEP-ENDTOEND.md`
- `docs/NEXT-STEPS.md`
- `docs/RUNBOOK.md`

## 7. Comandos para rodar localmente
Na raiz do projeto:

```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Comandos úteis adicionais:

```bash
pnpm build
pnpm type-check
pnpm start:web
pnpm start:worker
node scripts/test-comprasnet.mjs
```

Se usar Docker local:

```bash
docker compose up -d postgres redis
docker compose up -d --build
```

## 8. Comandos para subir na VPS
Fluxo recomendado por documentação atual:

```bash
cd /root/app-casa-do-licitante
git pull origin main
pnpm install --frozen-lockfile
pnpm --filter @casa/db db:generate
pnpm --filter @casa/db db:migrate
pnpm --filter @casa/web build
pnpm --filter @casa/worker build
docker compose up -d --build
```

Comandos operacionais úteis na VPS:

```bash
docker compose ps
docker logs --tail 100 casa-web
docker logs --tail 100 casa-worker
docker logs --tail 100 casa-api
nginx -t
systemctl status nginx --no-pager
curl -I http://127.0.0.1:3010/api/health
curl -I https://app.casadolicitante.com.br/api/health
```

Se optar por PM2 legado:

```bash
pnpm pm2:start
pnpm pm2:reload
pnpm pm2:stop
```

## 9. O que ainda não foi enviado para o GitHub
Tudo que está em `git status` como modificado ou novo ainda não foi enviado.

### Modificados não enviados
- `.env.example`
- `README.md`
- `apps/web/next.config.ts`
- `apps/web/src/app/(app)/dashboard/page.tsx`
- `apps/web/src/app/(app)/ferramentas/page.tsx`
- `apps/web/src/app/(app)/licitacoes/[id]/page.tsx`
- `apps/web/src/app/api/health/route.ts`
- `apps/web/src/app/api/licitacoes/[id]/route.ts`
- `apps/web/src/app/api/licitacoes/route.ts`
- `apps/web/src/components/empresa/MinhaEmpresaClient.tsx`
- `apps/web/src/components/search/SearchForm.tsx`
- `apps/web/src/components/search/SearchLicitacoesClient.tsx`
- `apps/web/src/components/tools/ToolsGrid.tsx`
- `apps/worker/src/index.ts`
- `apps/worker/src/jobs/ingest-pncp.ts`
- `docker-compose.yml`
- `packages/db/prisma/schema.prisma`
- `packages/domain/src/types.ts`
- `packages/gov-apis/src/comprasnet.ts`

### Novos não enviados
- `Dockerfile.web`
- `Dockerfile.worker`
- `apps/web/src/app/api/licitacoes/_lib/canonical.ts`
- `apps/web/src/components/tools/CurrencyConverter.tsx`
- `apps/web/src/components/tools/TrackingPlaceholder.tsx`
- `apps/web/src/lib/licitacoes.ts`
- `apps/worker/src/jobs/ingest-comprasnet.ts`
- `docs/ARCHITECTURE.md`
- `docs/DATA-SOURCES.md`
- `docs/EXECUTION-LOG.md`
- `docs/NEXT-STEP-ENDTOEND.md`
- `docs/RUNBOOK.md`
- `packages/db/prisma/migrations/20260413142000_bigint_money_fields/`
- `scripts/entrypoint-web.sh`
- `scripts/test-comprasnet.mjs`
- `STATUS_ATUAL.md`

Observação importante:
- `.env.local` existe localmente, mas normalmente não deve ir para GitHub
- o repositório já tinha mudanças pré-existentes antes desta rodada, então nem tudo listado foi necessariamente criado por esta sessão específica

## 10. O que ainda não foi implantado na VPS
Até o estado conhecido atual, não foi implantado de forma concluída na VPS:
- correções do core canônico de busca/detalhe
- integração operacional de ComprasNet no worker
- ajuste de healthcheck com validação de chave
- melhorias anti-fantasma do frontend
- Dockerfiles novos
- script `entrypoint-web.sh`
- migration `20260413142000_bigint_money_fields`
- documentação nova (`ARCHITECTURE`, `RUNBOOK`, `EXECUTION-LOG`, `DATA-SOURCES`, `NEXT-STEP-ENDTOEND`, `STATUS_ATUAL`)
- eventual criação/validação de usuário de login ainda não concluída

## 11. Arquivos de contexto, memória, heartbeat, notas, plano, checklist ou log
### No workspace do OpenClaw
- `C:\Users\Space Work\.openclaw\workspace\MEMORY.md`
- `C:\Users\Space Work\.openclaw\workspace\HEARTBEAT.md`
- `C:\Users\Space Work\.openclaw\workspace\memory\2026-04-14.md`
- `C:\Users\Space Work\.openclaw\workspace\memory\2026-04-15.md`
- `C:\Users\Space Work\.openclaw\workspace\memory\checkpoint-template.md`
- `C:\Users\Space Work\.openclaw\workspace\memory\heartbeat-state.json`

### Dentro do projeto
- `C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante\docs\EXECUTION-LOG.md`
- `C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante\docs\NEXT-STEP-ENDTOEND.md`
- `C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante\docs\NEXT-STEPS.md`
- `C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante\docs\RUNBOOK.md`
- `C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante\docs\ARCHITECTURE.md`
- `C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante\docs\DATA-SOURCES.md`
- `C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante\STATUS_ATUAL.md`

## 12. Resumo executivo
O projeto existe como um monorepo funcional com frontend Next.js, worker de ingestão, banco via Prisma, integrações governamentais, Docker e documentação operacional. O core principal de busca e detalhe já foi melhorado para usar base canônica. A integração de ComprasNet foi elevada de teste/estrutura para fluxo real de ingestão parcial. A documentação técnica e de continuidade está bem mais madura. O que ainda falta é fechar deploy real, validar o worker ponta a ponta em ambiente completo, consertar o ambiente online com 502/login e sincronizar tudo para GitHub/VPS.

## Caminhos finais
### Pasta raiz do projeto
`C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante`

### Arquivos de documentação criados/ativos mais relevantes
- `C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante\STATUS_ATUAL.md`
- `C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante\docs\ARCHITECTURE.md`
- `C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante\docs\DATA-SOURCES.md`
- `C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante\docs\EXECUTION-LOG.md`
- `C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante\docs\NEXT-STEP-ENDTOEND.md`
- `C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante\docs\RUNBOOK.md`
- `C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante\docs\NEXT-STEPS.md`
