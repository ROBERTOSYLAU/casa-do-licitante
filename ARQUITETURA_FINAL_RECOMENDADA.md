# ARQUITETURA FINAL RECOMENDADA — Casa do Licitante

**Data:** 2026-04-15  
**Status:** Implementada e operacional

---

## Decisão de arquitetura: Docker + Nginx Compartilhado

### Trilha oficial de produção

```
Internet
  │
  ▼
Cloudflare (CDN + SSL termination)
  │ HTTP/HTTPS → VPS 191.101.71.42
  ▼
badgeone_nginx (container)
  ├── app.badgeone.com.br → badgeone_frontend:3001
  │
  └── app.casadolicitante.com.br → web:3000 (rede app-casa-do-licitante_app-network)
        │
        ▼
    casa-web (Next.js 15)
        │
        ├── PostgreSQL (casa-postgres)
        ├── Redis (casa-redis)
        └── casa-api:3001 (CASA_API_URL interno)

casa-worker (BullMQ)
  ├── Cron PNCP: */15 * * * *  → ingere licitações PNCP
  ├── Cron ComprasNet: */30 * * * *  → ingere licitações ComprasNet
  └── Persiste em casa-postgres

casa-api (Node.js REST)
  ├── GET /licitacoes — busca no banco com filtros
  └── GET / — health check
```

---

## Por que Docker (e não PM2)

| Critério | Docker | PM2 (legado descartado) |
|----------|--------|------------------------|
| Isolamento | ✅ Completo (filesystem, rede, deps) | ❌ Compartilha node do host |
| Reproducibilidade | ✅ Build idêntico em qualquer máquina | ❌ Depende de estado do host |
| Dependências de sistema | ✅ Incluídas na imagem | ❌ Devem ser instaladas no host |
| Gestão de secrets | ✅ Via `docker compose` env | ❌ Via `.env` no processo |
| Deploy automatizado | ✅ `docker compose up --build` | ❌ Processo manual complexo |
| Rollback | ✅ Imagem anterior disponível | ❌ Rollback de código manualmente |

PM2 (`ecosystem.config.cjs`) permanece no repo como legado documentado mas **não é usado em produção**.

---

## Por que Nginx compartilhado (BadgeOne) e não Nginx próprio

**Decisão:** Manter Nginx compartilhado com BadgeOne.

**Justificativa:**
1. A VPS já tem SSL configurado (certs compartilhados, Cloudflare proxy)
2. Adicionar um segundo container Nginx criaria conflito de porta 80/443
3. A rede Docker `app-casa-do-licitante_app-network` já é declarada como external no BadgeOne compose, e `badgeone_nginx` já está nessa rede
4. Menor overhead de infraestrutura — uma responsabilidade, uma instância

**Consequência:** Qualquer mudança no bloco de config de nginx do Casa do Licitante requer rebuild do `badgeone_nginx`:
```bash
cd /root/app-badgeone-
docker compose restart nginx
# ou se mudou o config:
docker compose up -d --build --no-deps nginx
```

---

## Fluxo de deploy oficial

```
git push origin main (máquina local)
  │
  ▼
GitHub Actions (deploy.yml)
  │ SSH para VPS
  ▼
/docker/app-casa-do-licitante/
  ├── git fetch origin main
  ├── git reset --hard origin/main
  └── docker compose up -d --build --no-deps web worker
        │
        ▼
      entrypoint-web.sh
        ├── prisma migrate deploy (automático)
        └── next start
```

---

## Estrutura de packages (decisão ESM)

```
packages/
├── db/          → Prisma client — usa server-only, não importar no worker
├── domain/      → Tipos e constantes compartilhados — ESM puro, exporta .ts source
└── gov-apis/    → Conectores PNCP, ComprasNet, banco (WIP) — ESM puro, exporta .ts source

apps/
├── web/         → Next.js 15 — usa todos os packages via workspace
└── worker/      → BullMQ — usa domain e gov-apis via tsx (não via tsc)
```

### Decisão sobre domain e gov-apis exportando TypeScript source

**Mantido como está.** `packages/domain` e `packages/gov-apis` exportam `"./src/index.ts"` diretamente. Isso funciona porque:
- No worker: `tsx` resolve imports `.ts` diretamente (esbuild under the hood)
- No web: Next.js tem seu próprio bundler que processa `.ts` dos packages
- Não existe um `dist/` separado para compilar — reduz complexidade

**Alternativa mais robusta (futura):** Adicionar build step para domain e gov-apis, exportar `./dist/index.js`. Recomendado se o projeto escalar para mais consumers.

---

## O que está fora desta arquitetura (futuro)

| Feature | Status | Quando |
|---------|--------|--------|
| Google OAuth | Variáveis reservadas, não implementado | Próximo sprint |
| Stripe pagamentos | Variáveis reservadas, não implementado | Beta público |
| Resend emails | Variáveis reservadas, não implementado | Com alertas |
| Evolution API (WhatsApp) | Variáveis reservadas, não implementado | Com alertas |
| Cloudflare R2 (editais) | Variáveis reservadas, não implementado | Módulo Editais |

---

## Notas de segurança

- `.env` nunca vai para git — `.gitignore` e `.dockerignore` garantem
- `AUTH_TRUST_HOST=true` é obrigatório porque Cloudflare faz SSL termination antes da VPS
- Token GitHub em `/root/.git-credentials` — permite `git push` sem prompt
- Nginx tem headers de segurança (`X-Frame-Options`, `X-Content-Type-Options`, CSP)
- Rate limiting ativo: `/api/` e `/api/auth/`
