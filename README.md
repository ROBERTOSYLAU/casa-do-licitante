# 🏛️ App Casa do Licitante

**Atualizado em:** domingo, 29/03/2026 às 01:28 (GMT-3)

Plataforma SaaS para monitoramento, triagem e operação comercial de licitações públicas no Brasil.

## Status atual

O projeto já tem base real de produto e pode ser colocado online em VPS com foco em **beta privado / operação assistida**.

### O que já existe
- monorepo com **Next.js 15 + TypeScript + Turborepo + pnpm**
- app web separado de worker de ingestão
- autenticação com **NextAuth + Prisma**
- schema de banco estruturado para:
  - organizações
  - usuários
  - licitações
  - itens
  - editais
  - contratos
  - alertas
  - logs de sincronização
- conectores governamentais iniciais:
  - PNCP
  - ComprasNet
- infraestrutura preparada para:
  - PostgreSQL
  - Redis
  - PM2
  - Nginx
  - VPS Hostinger / Ubuntu

### O que ainda está em evolução
- detalhe rico e canônico de licitação vindo do banco
- dashboard totalmente orientado a dados reais
- contratos e fornecedores em camada de produto completa
- observabilidade forte da ingestão
- enriquecimento com IA, editais e automações comerciais

---

## Estrutura do projeto

```bash
app-casa-do-licitante/
├── apps/
│   ├── web/              # aplicação principal Next.js
│   └── worker/           # ingestão e rotinas assíncronas
├── packages/
│   ├── db/               # Prisma schema + client
│   ├── domain/           # tipos e contratos de domínio
│   └── gov-apis/         # conectores das APIs públicas
├── nginx/                # proxy reverso
├── scripts/              # setup e deploy VPS
├── ecosystem.config.cjs  # PM2
└── turbo.json            # orquestração do monorepo
```

---

## Rodando localmente

### Pré-requisitos
- Node.js 20+
- pnpm 9+
- PostgreSQL
- Redis

### Instalação

```bash
git clone https://github.com/ROBERTOSYLAU/app-casa-do-licitante.git
cd app-casa-do-licitante
pnpm install
cp .env.example .env
```

Depois configure o `.env` com os valores reais.

### Banco e Prisma

```bash
pnpm db:generate
pnpm db:migrate
```

### Desenvolvimento

```bash
pnpm dev
```

---

## Variáveis importantes

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
REDIS_URL=
```

Se for usar deploy em produção, valide também:
- domínio final
- configuração do Nginx
- PM2
- estratégia de build/deploy do worker

---

## Deploy em VPS

O projeto já inclui base para deploy com:
- `scripts/setup-vps.sh`
- `scripts/deploy.sh`
- `nginx/casa-do-licitante.conf`
- `ecosystem.config.cjs`

### Fluxo típico

```bash
cd /var/www/app-casa-do-licitante
git pull origin main
pnpm install --frozen-lockfile
pnpm db:generate
pnpm db:migrate
pnpm build
pm2 reload ecosystem.config.cjs --env production
sudo systemctl reload nginx
```

---

## Direção estratégica

Este projeto está mais próximo de:
- **produto SaaS em beta privado**, do que
- simples protótipo visual.

O próximo salto de valor está em fechar 4 pilares:
1. busca + detalhe consistente
2. persistência canônica no banco
3. rotina de ingestão observável
4. dashboard/alertas com utilidade comercial real

---

## Licença

MIT
