# COMO_RODAR_LOCAL.md

## Pasta do projeto
`C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante`

## Estado real considerado
O projeto é um monorepo com:
- `apps/web` -> aplicação Next.js
- `apps/worker` -> worker de ingestão
- `packages/db` -> Prisma
- `packages/gov-apis` -> integrações públicas

Existe suporte a:
- Node.js + pnpm
- PostgreSQL
- Redis
- Docker Compose

## Pré-requisitos
- Node.js 20+
- pnpm 9+
- PostgreSQL
- Redis

## Arquivos de ambiente
Existem estes arquivos na raiz:
- `.env.example`
- `.env.local`

Variáveis citadas no projeto/documentação atual:
- `DATABASE_URL`
- `REDIS_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `COMPRASNET_API_KEY`

## Passo a passo local sem Docker
Na raiz do projeto:

```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:migrate
pnpm dev
```

## Comandos úteis
```bash
pnpm build
pnpm type-check
pnpm start:web
pnpm start:worker
node scripts/test-comprasnet.mjs
```

## Rodando infraestrutura via Docker
Se quiser subir dependências/stack com Docker:

```bash
docker compose up -d postgres redis
docker compose up -d --build
```

## Observações reais do estado atual
- já houve build validado com sucesso em rodadas anteriores
- a validação end-to-end do worker ficou bloqueada anteriormente por falta de Docker ativo e ausência de `DATABASE_URL` / `REDIS_URL` no shell da sessão
- `.env.local` existe localmente e contém configuração sensível, então não deve ser versionado
