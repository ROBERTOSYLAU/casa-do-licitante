# 🤖 CLAUDE CODE — LOG DE TRABALHO
**Última atualização:** 2026-03-30 às 14:45 (GMT-3)
**Assistente:** Claude Code (claude-sonnet-4-6) via VPS Hostinger

---

## ✅ O QUE FOI FEITO HOJE

### 1. MCPs Instalados na VPS
Os seguintes servidores MCP foram instalados e estão conectados no Claude Code:

| MCP | Função |
|-----|--------|
| `brave-search` | Busca na web em tempo real |
| `github` | Gerenciamento do repositório GitHub |
| `memory` | Memória em grafo de conhecimento |
| `sequential-thinking` | Raciocínio estruturado para tarefas complexas |
| `fetch` | Acesso a APIs públicas (PNCP, IBGE, ComprasNet, etc.) |

### 2. Repositório Clonado na VPS
- Repositório: `https://github.com/ROBERTOSYLAU/app-casa-do-licitante`
- Clonado em: `/root/app-casa-do-licitante/`
- Copiado também para: `/docker/app-casa-do-licitante/` (caminho padrão do Docker Manager da Hostinger)

### 3. Infraestrutura Docker Criada
Todos os arquivos abaixo foram criados em `/docker/app-casa-do-licitante/`:

#### `docker-compose.yml`
Orquestra 5 serviços:
- **postgres** — PostgreSQL 16 com healthcheck e volume persistente
- **redis** — Redis 7 com persistência appendonly
- **web** — Next.js 15 (build multi-stage, porta 3000 interna)
- **worker** — BullMQ worker (build multi-stage)
- **nginx** — Proxy reverso na porta 80 → web:3000

#### `Dockerfile.web`
- Build multi-stage (deps → builder → runner)
- Node 20 Alpine
- pnpm 9.15.4 via corepack
- Gera Prisma client no build
- Roda migrations automaticamente ao iniciar (`scripts/entrypoint-web.sh`)

#### `Dockerfile.worker`
- Build multi-stage (deps → builder → runner)
- Compila TypeScript com `tsc`
- Roda `node apps/worker/dist/index.js`

#### `nginx/docker.conf`
- Proxy reverso para `app.casadolicitante.com.br`
- Rate limiting: `/api/` (30r/m) e `/api/auth/` (10r/m)
- Cache de assets estáticos (`/_next/static/`)
- Sem rate limit no webhook do Stripe
- **Ainda sem HTTPS** — SSL é o próximo passo

#### `.env`
Variáveis configuradas:
- `POSTGRES_PASSWORD` — senha gerada
- `NEXTAUTH_URL=https://app.casadolicitante.com.br`
- `NEXTAUTH_SECRET` — gerado com `openssl rand -base64 32`
- Demais chaves (Stripe, R2, Resend, Evolution, Google OAuth) — em branco, preencher conforme necessário

#### `scripts/entrypoint-web.sh`
- Roda `prisma migrate deploy` antes de iniciar o Next.js
- Garante que o banco sempre está atualizado ao subir o container

---

## 🔲 O QUE AINDA PRECISA SER FEITO

### Prioridade ALTA (para o app ir ao ar)

- [ ] **Deploy/Update no Docker Manager** da Hostinger
  - Acessar painel → Docker Manager → projeto `app-casa-do-licitante` → Deploy/Update
  - O build demora ~5-10 min na primeira vez
  - Verificar logs de cada container após subir

- [ ] **DNS apontado** para a VPS
  - `app.casadolicitante.com.br` → IP da VPS
  - Verificar no painel de DNS do domínio

- [ ] **SSL/HTTPS** em `app.casadolicitante.com.br`
  - Opção A: Certbot dentro de container (adicionar ao compose)
  - Opção B: Proxy SSL da Hostinger (mais simples, verificar se disponível)
  - Após SSL: nginx precisa escutar na 443 também

- [ ] **Verificar migrations** rodam corretamente no primeiro boot
  - Checar logs do container `casa-web`

### Prioridade MÉDIA (produto funcional)

- [ ] **Google OAuth** — criar credenciais no Google Cloud Console e preencher:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`

- [ ] **Stripe** — preencher chaves para pagamentos:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - Configurar webhook no Stripe apontando para `https://app.casadolicitante.com.br/api/webhooks/stripe`

- [ ] **Resend** — preencher `RESEND_API_KEY` para envio de e-mails

- [ ] **Cloudflare R2** — preencher credenciais para armazenamento de editais:
  - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`

- [ ] **Portal Transparência API** — `TRANSPARENCIA_API_KEY` (CEIS/CNEP)

### Prioridade MÉDIA (produto — features)

- [ ] **Dashboard com dados reais** do banco (licitações vindas do worker)
- [ ] **Worker de ingestão ativo** — PNCP + ComprasNet rodando em schedule
- [ ] **Sistema de alertas** — e-mail/WhatsApp quando nova licitação bater nos filtros do usuário
- [ ] **Detalhe canônico de licitação** — página com todas as informações, itens, edital

### Prioridade BAIXA (crescimento)

- [ ] **Landing page** em `casadolicitante.com.br`
  - Apresentação do produto, preços, CTA para `app.casadolicitante.com.br`
  - Pode ser um segundo serviço no compose ou app separado

- [ ] **Enriquecimento com IA** — análise de editais, scoring de oportunidades
- [ ] **Integração IBGE** — dados de capacidade de municípios, terceiro setor
- [ ] **Observabilidade** — logs estruturados, métricas do worker, alertas de falha

---

## 🏗️ ARQUITETURA ATUAL

```
Internet
   │
   ▼
nginx (porta 80) ──── [SSL pendente] ────► 443
   │
   ▼
web (Next.js 15 — porta 3000)
   │                    │
   ▼                    ▼
postgres            redis
(PostgreSQL 16)     (Redis 7)
                        ▲
                        │
                   worker (BullMQ)
```

**Monorepo Turborepo:**
```
apps/web     → Next.js 15 + NextAuth + Prisma + Stripe + BullMQ
apps/worker  → BullMQ jobs: ingestão PNCP, ComprasNet, alertas
packages/db        → Prisma schema + client
packages/domain    → tipos e enums compartilhados
packages/gov-apis  → conectores PNCP, ComprasNet
```

---

## 📁 CAMINHOS IMPORTANTES NA VPS

| Path | O quê |
|------|-------|
| `/docker/app-casa-do-licitante/` | Raiz do Docker Manager (docker-compose + source) |
| `/docker/app-casa-do-licitante/.env` | Variáveis de ambiente (NUNCA commitar) |
| `/root/app-casa-do-licitante/` | Clone do repositório Git |

---

## 🔑 VARIÁVEIS JÁ CONFIGURADAS (no .env da VPS)

> ⚠️ Não commitar o `.env` — está no `.gitignore`

- `POSTGRES_PASSWORD` ✓
- `NEXTAUTH_URL=https://app.casadolicitante.com.br` ✓
- `NEXTAUTH_SECRET` ✓

---

## 📝 NOTAS TÉCNICAS

- O `.env` do Docker Manager **não vai para o Git** (está no .gitignore)
- As APIs opcionais (Stripe, R2, etc.) têm fallback `:-` no compose — não quebram o build se estiverem em branco
- O Prisma usa `migrate deploy` (modo produção) no entrypoint — nunca `migrate dev`
- O worker usa ESM (`"type": "module"`) — entry point é `node apps/worker/dist/index.js`
