# 🤖 CLAUDE CODE — LOG DE TRABALHO
**Última atualização:** 2026-04-04 às 18:30 (GMT-3)
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

## ✅ O QUE FOI FEITO — SESSÃO 2026-04-04

### 1. Auditoria e Correção Cirúrgica das Integrações de API

**Problemas encontrados e corrigidos:**

| Arquivo | Bug | Correção |
|---------|-----|----------|
| `packages/gov-apis/src/comprasnet.ts` | `DEFAULT_MODALIDADES_COMPRAS = [1,2,5,6]` — códigos 1 e 2 retornavam ZERO resultados | Substituído por `[3,5,6,7]` (Concorrência, Pregão, Dispensa, Inexigibilidade — validados empiricamente) |
| `packages/gov-apis/src/comprasnet.ts` | `filters.modalidade` completamente ignorado em `fetchComprasnetBids` | Adicionado `MODALIDADE_MAP_COMPRAS` e lógica de seleção por filtro |
| `packages/gov-apis/src/comprasnet.ts` + `pncp.ts` | Normalizer verificava `"pregão eletrônico"` mas API retorna `"Pregão - Eletrônico"` (com hífen) — todos normalizavam como `'outro'` | Reescrito para detectar palavras-chave independentes (`includes('pregão')`) |
| `packages/gov-apis/src/pncp.ts` | `DEFAULT_MODALIDADES = [6,7,8,9]` — não incluía concorrência (código 4) | Adicionado código 4 → `[4,6,7,8,9]` |
| `packages/gov-apis/src/pncp.ts` + `comprasnet.ts` | Janela de data padrão de 7 dias — muito restrita | Aumentado para 30 dias |
| `packages/gov-apis/src/pncp.ts` + `comprasnet.ts` | Erros HTTP silenciados (`return []` sem log) | Adicionado `console.error` em respostas não-ok |
| `apps/web/src/app/api/ferramentas/cnpj/route.ts` | BrasilAPI retorna `{ message }` mas código esperava `{ error }` — sempre mostrava "Erro desconhecido" | Extrai `data.message`, adiciona logging |

**Commit:** `3a7fc11` — `fix: corrige integração ComprasNet, normalizador de modalidade e CNPJ`

### 2. Análise do App de Referência — SIGA PREGÃO

Analisadas **26 screenshots** do app `app.sigapregao.com.br` (app que o cliente usa como benchmark).
Análise completa salva em `/root/.claude/projects/.../memory/reference_sigapregao.md`

**Features mapeadas no SIGA PREGÃO:**
- Busca com filtros como tags removíveis, contador de resultados, pesquisa avançada completa
- Cards com categorias por IA, modo de disputa, badges visuais
- Date range picker com atalhos (Hoje, 7d, 30d, Esse mês)
- Multi-keyword separado por `;`
- 20+ portais selecionáveis (Comprasnet, Licitações-e, COMPRAS RS, etc.)
- Funil de Licitações (Kanban) + Quadros + Agenda
- Análise de Mercado (mapa interativo, gráficos por esfera/poder/categoria)
- Contratações Futuras (PCA/PNCP com R$ 2,5 tri mapeados)
- Peças Jurídicas (modelos de impugnação, recurso, esclarecimento)
- Meus Documentos (gerenciador com validade)
- Minhas Empresas (vincular CNPJ para alertas automáticos)
- Jornal diário via WhatsApp

### 3. Implementação em Andamento — Melhorias do Produto

> **Iniciada em 2026-04-04 — ver seção "Em construção" abaixo**

---

## 🚧 EM CONSTRUÇÃO — SESSÃO 2026-04-04 (continuação)

### Roadmap de features a implementar (em ordem de execução):

#### FASE 1 — Busca mais rica (impacto imediato, sem banco novo)
- [ ] Cards de resultado com mais informações (modo de disputa, data/hora, badges coloridos, valor)
- [ ] Filtros ativos como tags removíveis abaixo da barra de busca
- [ ] Contador "X resultados encontrados"
- [ ] Date range picker com atalhos rápidos (Hoje, 7d, 30d, Esse mês)
- [ ] Campo dataFinal no filtro (hoje só tem dataInicial)
- [ ] Pesquisa avançada modal (multi-keyword, ME/EPP, excluir SRP)

#### FASE 2 — Funil de Licitações (Kanban)
- [ ] Página `/licitacoes/funil` com colunas: Prospecção → Analisando → Decidido Participar → Em Disputa → Ganho/Perdido
- [ ] Persistência no banco (tabela `FunilLicitacao`)
- [ ] Drag-and-drop entre colunas

#### FASE 3 — Minhas Empresas
- [ ] Vincular CNPJ ao perfil do usuário
- [ ] Busca automática de dados via BrasilAPI
- [ ] Base para alertas e automações futuras

#### FASE 4 — Análise de Mercado (básica)
- [ ] Página `/analise` com gráfico de licitações por mês
- [ ] Distribuição por modalidade
- [ ] Mapa do Brasil por UF (heatmap simples)

#### FASE 5 — Contratações Futuras (PCA)
- [ ] Integração com API PNCP de Planos de Contratação Anual
- [ ] Página `/analise/contratacoes-futuras`
- [ ] Filtro por ano, estado, categoria

#### FASE 6 — Peças Jurídicas
- [ ] Biblioteca de modelos de documentos (impugnação, recurso, esclarecimento)
- [ ] Página `/juridico/pecas`

---

## 🔲 O QUE AINDA PRECISA SER FEITO (infra/config)

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

**Stack de frontend:**
```
Next.js 15 App Router
Tailwind CSS + shadcn/ui
NextAuth v5 (autenticação)
Prisma ORM (PostgreSQL)
BullMQ (filas de trabalho)
```

---

## 📁 CAMINHOS IMPORTANTES NA VPS

| Path | O quê |
|------|-------|
| `/docker/app-casa-do-licitante/` | Raiz do Docker Manager (compose + source + .env) |
| `/docker/app-casa-do-licitante/.env` | Variáveis de ambiente — **NUNCA commitar** |
| `/root/app-casa-do-licitante/` | Clone do repositório Git |
| `/root/app-badgeone-/nginx/default.conf` | Config nginx compartilhado (BadgeOne + Casa do Licitante) |
| `/root/.claude/projects/.../memory/` | Memória persistente do Claude Code |
| `/root/app-casa-do-licitante/docs/CLAUDE_CODE.md` | Este arquivo — log de trabalho |
| `/root/app-casa-do-licitante/IMAGENS DE REFERENCIA/` | 26 screenshots do SIGA PREGÃO (benchmark) |

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
- **API ComprasNet** — endpoint `/modulo-contratacoes/1_consultarContratacoes_PNCP_14133`, códigos válidos: 3=Concorrência, 5=Pregão, 6=Dispensa, 7=Inexigibilidade
- **API PNCP** — endpoint `/contratacoes/publicacao`, datas no formato `yyyyMMdd` (sem hifens), `tamanhoPagina` mínimo 10
- **BrasilAPI CNPJ** — `https://brasilapi.com.br/api/cnpj/v1/{cnpj14digitos}`, retorna `{ message }` em erros (não `{ error }`)

---

## 🎯 VISÃO DO PRODUTO

**Objetivo:** Melhor app de licitações e mercados do terceiro setor e dados públicos do Brasil.

**Benchmark:** SIGA PREGÃO (`app.sigapregao.com.br`)

**Diferenciais a construir:**
1. Busca unificada PNCP + ComprasNet + outros portais com filtros avançados
2. Funil de gestão de licitações (Kanban)
3. Análise de mercado com mapa interativo e gráficos
4. Contratações futuras baseadas nos PCAs (Planos de Contratação Anual)
5. Peças jurídicas (modelos de impugnação, recurso, etc.)
6. Gestão de documentos com controle de validade
7. Alertas por WhatsApp/email (jornal diário)
8. Foco especial no **terceiro setor** (OSCs, entidades sem fins lucrativos)
