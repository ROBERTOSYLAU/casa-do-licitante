# 🤖 CLAUDE CODE — LOG DE TRABALHO
**Última atualização:** 2026-03-30 às 16:20 (GMT-3)
**Assistente:** Claude Code (claude-sonnet-4-6) via VPS Hostinger

---

## ✅ O QUE FOI FEITO — SESSÃO 2026-03-30

### 1. MCPs Instalados na VPS
Conectados e funcionando no Claude Code:

| MCP | Status | Função |
|-----|--------|--------|
| `brave-search` | ✅ | Busca na web em tempo real |
| `github` | ✅ | Gerenciamento do repositório GitHub |
| `memory` | ✅ | Memória em grafo de conhecimento |
| `sequential-thinking` | ✅ | Raciocínio estruturado para tarefas complexas |
| `fetch` | ✅ | Acesso a APIs públicas (PNCP, IBGE, ComprasNet, etc.) |

### 2. Repositório Clonado e Estruturado na VPS
- Repositório: `https://github.com/ROBERTOSYLAU/app-casa-do-licitante`
- Clone Git: `/root/app-casa-do-licitante/`
- Docker Manager Hostinger: `/docker/app-casa-do-licitante/` (fonte + compose)

### 3. Infraestrutura Docker — Criada e RODANDO ✅

#### Arquivos criados em `/docker/app-casa-do-licitante/`:

| Arquivo | Função |
|---------|--------|
| `docker-compose.yml` | Orquestra 4 serviços (postgres, redis, web, worker) |
| `Dockerfile.web` | Build multi-stage Next.js (builder + runner) |
| `Dockerfile.worker` | Worker com tsx (executa TypeScript direto, sem compilar) |
| `scripts/entrypoint-web.sh` | Roda `prisma migrate deploy` antes de subir o app |
| `.env` | Variáveis de ambiente configuradas |
| `nginx/docker.conf` | Config nginx para proxy reverso |

#### Serviços em produção agora:

| Container | Status | Detalhe |
|-----------|--------|---------|
| `casa-web` | ✅ Up | Next.js 15, porta 3010 externa → 3000 interna |
| `casa-worker` | ✅ Up | BullMQ + tsx, crons registrados |
| `casa-postgres` | ✅ Healthy | PostgreSQL 16, migrations aplicadas |
| `casa-redis` | ✅ Healthy | Redis 7, appendonly ativo |

### 4. Nginx — Configuração Multi-Projeto

O VPS já tinha o **BadgeOne** rodando com nginx na porta 80.
Solução: configuramos o nginx do BadgeOne para também rotear `app.casadolicitante.com.br`:

- Arquivo modificado: `/root/app-badgeone-/nginx/default.conf`
- BadgeOne continua funcionando normalmente (server_name separado)
- `app.casadolicitante.com.br` → proxy para `casa-web:3000`
- Nginx do BadgeOne conectado à rede Docker `app-casa-do-licitante_app-network`

### 5. Bugs Corrigidos no Código (com push no GitHub)

| Commit | O que foi corrigido |
|--------|---------------------|
| `fix(worker): fix ioredis ESM import` | `import IORedis` → `import { Redis }` para ESM/NodeNext |
| `fix(gov-apis): remove fetch options` | Removeu `next: { revalidate }` e `cache:` incompatíveis com Node.js |
| `fix(packages): add build script` | Adicionou script `build` e `"type": "module"` em domain e gov-apis |
| `fix(worker): fix ESM/CJS interop` | Nomes de fila com `:` → `-` (BullMQ não aceita dois-pontos) |
| `fix(worker): local Prisma client` | Worker criou `src/db.ts` próprio, sem `server-only` do Next.js |
| `fix(worker): add @prisma/client` | `@prisma/client` adicionado como dep direta do worker |
| `fix(db): standard @prisma/client` | Removeu output customizado do schema.prisma → usa caminho padrão |

---

## 🔲 O QUE AINDA PRECISA SER FEITO

### Prioridade ALTA — Para o app ficar acessível online

- [ ] **DNS apontado** para o IP da VPS
  - `app.casadolicitante.com.br` → IP público da VPS
  - Configurar no painel do provedor do domínio

- [ ] **SSL/HTTPS** em `app.casadolicitante.com.br`
  - Opção recomendada: Certbot com renovação automática
  - Após SSL: nginx precisa escutar na 443 e redirecionar 80 → 443

- [ ] **Testar acesso** ao app após DNS propagado
  - Verificar login/cadastro
  - Verificar health check: `https://app.casadolicitante.com.br/api/health`

### Prioridade MÉDIA — Produto funcional

- [ ] **Google OAuth** — criar no Google Cloud Console:
  - `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` → preencher no `.env`

- [ ] **Stripe** — preencher chaves no `.env`:
  - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - Webhook: `https://app.casadolicitante.com.br/api/webhooks/stripe`

- [ ] **Resend** — `RESEND_API_KEY` para envio de e-mails transacionais

- [ ] **Cloudflare R2** — armazenamento de editais:
  - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`

- [ ] **Portal Transparência API** — `TRANSPARENCIA_API_KEY` (CEIS/CNEP)

### Prioridade MÉDIA — Features do produto

- [ ] **Worker de ingestão ativo** — PNCP + ComprasNet rodando em schedule real
- [ ] **Dashboard com dados reais** do banco
- [ ] **Sistema de alertas** — e-mail/WhatsApp quando licitação bate em filtros
- [ ] **Detalhe canônico de licitação** — página com itens, edital, contratos

### Prioridade BAIXA — Crescimento

- [ ] **Landing page** em `casadolicitante.com.br`
  - Apresentação do produto, preços, CTA para `app.casadolicitante.com.br`
- [ ] **Enriquecimento com IA** — análise de editais, scoring de oportunidades
- [ ] **Integração IBGE** — dados de capacidade de municípios, terceiro setor
- [ ] **Observabilidade** — logs estruturados, métricas do worker, alertas de falha

---

## 🏗️ ARQUITETURA ATUAL

```
Internet
   │
   ▼ porta 80
badgeone_nginx (nginx compartilhado)
   │                          │
   │ server_name badgeone     │ server_name app.casadolicitante.com.br
   ▼                          ▼
badgeone_frontend         casa-web:3000 (Next.js 15)
                               │              │
                               ▼              ▼
                          casa-postgres   casa-redis
                          (PostgreSQL 16) (Redis 7)
                                              ▲
                                              │
                                         casa-worker
                                         (BullMQ + tsx)
```

**Redes Docker:**
- `app-badgeone-_default` — rede interna do BadgeOne
- `app-casa-do-licitante_app-network` — rede interna do Casa do Licitante
- `badgeone_nginx` está conectado às **duas redes** para rotear ambos os apps

**Monorepo Turborepo:**
```
apps/web     → Next.js 15 + NextAuth + Prisma + Stripe + BullMQ
apps/worker  → BullMQ jobs com tsx (sem compilação prévia)
packages/db        → Prisma schema + client (output padrão @prisma/client)
packages/domain    → tipos e enums (type: module, ESM puro)
packages/gov-apis  → conectores PNCP, ComprasNet (type: module, ESM puro)
```

---

## 📁 CAMINHOS IMPORTANTES NA VPS

| Path | O quê |
|------|-------|
| `/docker/app-casa-do-licitante/` | Raiz do Docker Manager (compose + source + .env) |
| `/docker/app-casa-do-licitante/.env` | Variáveis de ambiente — **NUNCA commitar** |
| `/root/app-casa-do-licitante/` | Clone do repositório Git |
| `/root/app-badgeone-/nginx/default.conf` | Config nginx compartilhado (BadgeOne + Casa do Licitante) |

---

## 🔑 VARIÁVEIS JÁ CONFIGURADAS (no .env da VPS)

> ⚠️ Não commitar o `.env` — está no `.gitignore`

- `POSTGRES_PASSWORD` ✓
- `NEXTAUTH_URL=https://app.casadolicitante.com.br` ✓
- `NEXTAUTH_SECRET` ✓ (gerado com openssl rand -base64 32)

---

## 📝 NOTAS TÉCNICAS IMPORTANTES

- **Worker usa `tsx`** — executa TypeScript direto sem compilar. Entry point: `tsx apps/worker/src/index.ts`
- **Worker tem `src/db.ts` próprio** — não usa `@casa/db` (que tem `server-only` do Next.js)
- **Prisma output é o padrão** — `prisma generate` gera em `node_modules/.prisma/client`
- **BullMQ queue names sem `:`** — usar `-` como separador (ex: `ingest-pncp`)
- **packages/domain e gov-apis são ESM** — têm `"type": "module"` para compatibilidade com worker
- **nginx compartilhado** — qualquer alteração no arquivo `/root/app-badgeone-/nginx/default.conf` requer rebuild do `badgeone_nginx`
- **Migrations** — rodam automaticamente via `entrypoint-web.sh` quando o container `casa-web` sobe
- **Porta 3010** — `casa-web` exposta externamente na 3010 (3000 interna). Nginx roteia para porta interna.
