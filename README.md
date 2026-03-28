[README.md](https://github.com/user-attachments/files/26325665/README.md)
# 🏛️ Casa do Licitante

> Plataforma SaaS completa para licitações públicas brasileiras — agregando editais, automatizando buscas e acelerando propostas.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)
![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-EF4444?style=flat-square&logo=turborepo)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## 📌 Sobre o Projeto

O **Casa do Licitante** é uma plataforma inteligente que centraliza licitações públicas de múltiplas fontes governamentais, permitindo que empresas encontrem oportunidades, analisem editais e gerenciem propostas em um único lugar.

### ✨ Funcionalidades

- 🔍 **Busca unificada** de licitações em tempo real (PNCP, ComprasNet, Portal de Compras Públicas)
- 📢 **Alertas personalizados** por palavra-chave, UF e modalidade
- 📄 **Análise de editais** com IA
- 🏢 **Consulta de CNPJ** e dados de fornecedores
- 📰 **Integração com Diário Oficial** da União
- 📊 **Dashboard** com métricas e histórico de participações
- 🔐 **Autenticação e multi-tenant** por empresa

---

## 🗂️ Estrutura do Monorepo

```
casa-do-licitante/
├── apps/
│   └── web/              # Next.js — interface principal
├── packages/
│   ├── gov-apis/         # Conectores das APIs governamentais
│   ├── domain/           # Tipos TypeScript compartilhados
│   ├── db/               # Schema e cliente de banco de dados
│   └── ui/               # Componentes de UI compartilhados
├── scripts/              # Scripts de deploy e utilitários
├── nginx/                # Configuração do proxy reverso
├── turbo.json            # Configuração do Turborepo
└── pnpm-workspace.yaml   # Workspaces do pnpm
```

---

## 🌐 APIs Governamentais Integradas

| Fonte | Status | Descrição |
|-------|--------|-----------|
| [PNCP](https://pncp.gov.br/api/v1) | ✅ Ativo | Portal Nacional de Contratações Públicas |
| [ComprasNet](https://compras.dados.gov.br) | ✅ Ativo | Sistema federal legado (UASG) |
| [BrasilAPI](https://brasilapi.com.br) | 🔜 Em breve | CNPJ, CEP, bancos, feriados |
| [Portal de Compras Públicas](https://portaldecompraspublicas.com.br) | 🔜 Em breve | Plataforma estadual/municipal |
| [Diário Oficial (DOU)](https://www.in.gov.br) | 🔜 Em breve | Publicações oficiais da União |
| [TCU](https://portal.tcu.gov.br) | 🔜 Em breve | Tribunal de Contas da União |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 20+
- pnpm 9+
- Docker (para banco de dados)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/ROBERTOSYLAU/casa-do-licitante.git
cd casa-do-licitante

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas chaves

# Suba o banco de dados
docker compose up -d

# Rode em modo desenvolvimento
pnpm turbo dev
```

### Comandos Úteis

```bash
pnpm turbo build       # Build completo
pnpm turbo dev         # Modo desenvolvimento
pnpm turbo test        # Rodar testes
pnpm turbo lint        # Lint em todos os pacotes
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
# Banco de dados
DATABASE_URL=

# Autenticação
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# APIs (quando exigir chave)
PORTAL_COMPRAS_API_KEY=
```

> ⚠️ Nunca commite o arquivo `.env` — ele está no `.gitignore`.

---

## 🏗️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15, React, Tailwind CSS |
| Backend | Node.js, TypeScript |
| Banco de dados | PostgreSQL |
| ORM | Prisma / Drizzle |
| Monorepo | Turborepo + pnpm workspaces |
| Infra | Docker, nginx, PM2 |
| Deploy | VPS Hostinger (Ubuntu 24.04) |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja como:

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: minha feature'`
4. Push para a branch: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <p>Feito com ❤️ para facilitar a vida de quem lida com licitações públicas no Brasil</p>
  <p><strong>Casa do Licitante</strong> — Sua vantagem nas contratações públicas</p>
</div>
