# 🏛️ App Casa do Licitante

**Atualizado em:** sábado, 04/04/2026 às 16:01 (GMT-3)

Plataforma SaaS para **inteligência, triagem, análise e operação de licitações públicas no Brasil**.

## Proposta real do produto

O **Casa do Licitante** não deve ser tratado apenas como um buscador de editais.

A proposta oficial do produto é ser uma **central operacional de inteligência para licitantes**, reunindo em um único ambiente:
- descoberta de oportunidades
- análise de mercado e contratações futuras
- leitura territorial e institucional
- documentos e rotina operacional do cliente
- apoio jurídico e de disputa
- dados públicos empresariais, fiscais e municipais

Em termos práticos, o produto precisa cobrir o ciclo do licitante em quatro camadas:
1. **encontrar** oportunidades
2. **entender** o contexto comercial e institucional
3. **organizar** empresa, documentos e rotina
4. **agir** com apoio operacional e jurídico

---

## Modelo operacional da plataforma

O projeto deve evoluir com dois níveis de acesso principais:

### 1. ADM Master — Casa do Licitante
Camada interna da operação da plataforma, responsável por:
- cadastrar clientes
- gerenciar contas e empresas
- administrar planos, permissões e ambientes
- acompanhar uso da plataforma
- controlar integrações e saúde do sistema
- validar consistência das APIs e qualidade dos dados

### 2. Cliente / Empresa licitante
Camada de uso do cliente final, com foco em:
- busca e filtro de oportunidades
- análise de mercado e histórico
- gestão de documentos
- cadastro de empresas
- organização da rotina de licitação
- apoio jurídico e operacional

---

## Status atual

O projeto já tem base real de produto e já entrou em uma fase de **beta privado / operação assistida**, com a aplicação web buildando e rodando.

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
- landing, login, dashboard e busca já melhorados nas rodadas iniciais
- build do app web validado

### O que ainda está em evolução
- detalhe rico e canônico de licitação vindo do banco
- dashboard totalmente orientado a dados reais
- camada ADM Master para gestão dos clientes da plataforma
- watchlist, favoritos e organização operacional do cliente
- contratos e fornecedores em camada de produto completa
- observabilidade forte da ingestão
- worker pronto para produção com build/start fechados
- enriquecimento com IA, editais e automações comerciais

---

## Estrutura do projeto

```bash
app-casa-do-licitante/
├── apps/
│   ├── web/              # aplicação principal Next.js (frontend + server routes)
│   └── worker/           # ingestão e rotinas assíncronas
├── packages/
│   ├── db/               # Prisma schema + client
│   ├── domain/           # tipos e contratos de domínio
│   └── gov-apis/         # conectores das APIs públicas
├── api/                  # API legada Express ainda exposta em subdomínio próprio
├── docs/                 # documentação técnica e operacional
├── nginx/                # proxy reverso de referência
├── scripts/              # entrypoints e automação de deploy
├── Dockerfile.web        # imagem de produção da aplicação web
├── Dockerfile.worker     # imagem de produção do worker
├── docker-compose.yml    # stack local/VPS
├── ecosystem.config.cjs  # legado PM2 (manter só se necessário)
└── turbo.json            # orquestração do monorepo
```

## Como a arquitetura está organizada hoje

### Serviços principais
- **web**: app Next.js 15, autenticação, páginas, rotas `/api/*` e health check
- **worker**: BullMQ + Redis, ingestão recorrente de fontes públicas
- **api**: serviço Express legado, ainda publicado em `api.casadolicitante.com.br`
- **postgres**: persistência principal
- **redis**: filas, cache e agendamento

### Regras de organização
- tudo que for **domínio compartilhado** fica em `packages/`
- tudo que for **interface e rotas web** fica em `apps/web`
- tudo que for **processamento assíncrono** fica em `apps/worker`
- a pasta `api/` é um serviço **legado/compatível**, e deve ser mantida isolada até eventual absorção pela app web
- deploy oficial em produção deve priorizar **Docker Compose**, evitando drift entre PM2 e containers

---

## Fontes e APIs públicas estratégicas

A diretriz oficial do produto é:
- **fase 1:** usar APIs públicas
- **fase 2:** integrar APIs pagas onde fizer sentido

### Já integradas
- PNCP
- ComprasNet

### Fontes públicas estratégicas previstas
- CNPJ / CNAE
- IBGE / municípios / dados territoriais
- CAPAG
- NCM / classificação de produto
- IPTU / ITR / dados municipais e territoriais públicos
- bases públicas correlatas úteis para licitação, diligência e inteligência comercial

### Regra de qualidade de dados
Essas integrações só geram valor real se entregarem:
- dados válidos
- dados consistentes
- filtros confiáveis
- leitura comercial útil
- contexto institucional e territorial

Ou seja: não basta “puxar API”. É preciso transformar dados públicos em inteligência operacional utilizável pelo cliente.

---

## O que diferencia o produto

O Casa do Licitante deve evoluir para além de “mais uma base de edital”.

### Diferenciais esperados
- busca mais rica e precisa
- leitura comercial da oportunidade
- score de atratividade
- score de risco
- análise de mercado e contratações futuras
- inteligência territorial e institucional
- documentos e rotina da empresa licitante
- apoio jurídico e operacional
- contexto por empresa, município, órgão, categoria e produto

---

## Referência funcional absorvida

A plataforma de referência analisada mostrou uma direção madura de produto em quatro frentes:
- **Oportunidades**
- **Análise**
- **Negócios / Empresas / Documentos**
- **Jurídico / Disputa**

Isso reforça que o Casa do Licitante deve crescer como uma **mesa de operação do licitante**, e não apenas como uma tela de busca.

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
- variáveis da camada de autenticação
- saúde da conectividade com APIs públicas

---

## Deploy em VPS

O projeto já inclui base para deploy com:
- `scripts/setup-vps.sh`
- `scripts/deploy.sh`
- `nginx/casa-do-licitante.conf`
- `ecosystem.config.cjs`

### Fluxo típico

```bash
cd /root/app-casa-do-licitante
git pull origin main
pnpm install --frozen-lockfile
pnpm --filter @casa/db db:generate
pnpm --filter @casa/db db:migrate
pnpm --filter @casa/web build
pm2 reload ecosystem.config.cjs --env production
sudo systemctl reload nginx
```

---

## Prioridades práticas agora

### P0 — estabilização online
- garantir web estável em produção
- corrigir worker para produção
- validar autenticação
- validar rotas API
- validar busca real no navegador

### P1 — núcleo do produto
- fortalecer filtros e precisão da busca
- melhorar detalhe da licitação
- aproximar resultado de busca de uma triagem profissional
- melhorar dashboard com dados reais

### P2 — estrutura de negócio
- criar camada ADM Master
- cadastrar clientes e empresas
- preparar multi-tenant com mais clareza
- organizar permissões, perfis e rotinas

### P3 — inteligência pública
- CNPJ / CNAE
- IBGE / municípios
- CAPAG
- NCM
- IPTU / ITR / dados territoriais públicos

---

## Direção estratégica

Este projeto está mais próximo de:
- **produto SaaS em beta privado**, do que
- simples protótipo visual.

O próximo salto de valor está em fechar os pilares abaixo:
1. busca + detalhe consistente
2. persistência canônica no banco
3. rotina de ingestão observável
4. dashboard/alertas com utilidade comercial real
5. camada ADM Master
6. base pública forte e confiável para inteligência do licitante

---

## Licença

MIT
