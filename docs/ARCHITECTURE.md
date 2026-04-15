# Arquitetura — Casa do Licitante

## Visão geral

O projeto é um monorepo com separação explícita entre interface, processamento assíncrono, domínio compartilhado e integração legada.

```text
apps/web       -> Next.js 15 + App Router + NextAuth + rotas HTTP
apps/worker    -> BullMQ + Redis + jobs de ingestão
packages/db    -> Prisma schema, migrations e client
packages/domain-> tipos, enums e contratos de negócio
packages/gov-apis -> conectores PNCP / ComprasNet
api/           -> API Express legada mantida por compatibilidade
```

## Serviços de runtime

### web
Responsável por:
- páginas do produto
- autenticação
- endpoints `/api/*`
- health check
- consumo de `packages/db` e `packages/gov-apis`

### worker
Responsável por:
- ingestão PNCP / ComprasNet
- execução de jobs recorrentes
- persistência canônica no PostgreSQL
- trilha bruta de ingestão (`RawPncpRecord`, etc.)

### api
Serviço legado publicado em subdomínio separado.
Deve permanecer isolado até haver plano explícito de incorporação ou desligamento.

## Banco de dados

### Regra importante para dinheiro
Valores monetários são armazenados em **centavos**.
Como licitações e contratos públicos podem ultrapassar o limite de `INT4`, os campos monetários persistidos usam **BIGINT** no PostgreSQL.

Campos monetários principais:
- `Licitacao.valorEstimado`
- `LicitacaoItem.valorUnitarioEstimado`
- `Contrato.valorGlobal`
- `Aditamento.valorAcrescimo`
- `AlertSubscription.valorMin`
- `AlertSubscription.valorMax`

## Deploy recomendado

Padrão oficial:
- `docker-compose.yml`
- `Dockerfile.web`
- `Dockerfile.worker`
- `scripts/entrypoint-web.sh`

Evitar operar produção com dois orquestradores ao mesmo tempo (`pm2` + Docker) para o mesmo serviço.

## Convenções

- `packages/` nunca deve depender de `apps/`
- `apps/web` pode depender de `packages/*`
- `apps/worker` pode depender de `packages/*`
- tipos de transporte HTTP/UI podem usar `number`, mas persistência monetária no Prisma deve considerar `BIGINT`
- todo ajuste estrutural precisa refletir em:
  - schema Prisma
  - migration
  - README
  - documentação operacional relevante
