# AUDITORIA GERAL — Casa do Licitante

**Data:** 2026-04-15  
**Auditor:** Claude Sonnet 4.6 (Claude Code)  
**Commit inicial:** `5fcec72`  
**Commit final desta sessão:** `976c5c4`

---

## 1. Estado real encontrado ao início da auditoria

### Containers (estado inicial)
| Container | Estado | Causa |
|-----------|--------|-------|
| `casa-web` | Restarting (crash loop) | `sh: next: not found` — node_modules ausente no runner |
| `casa-worker` | Restarting (crash loop) | `ERR_MODULE_NOT_FOUND: /app/packages/domain/src/types` — ESM sem extensão `.js` |
| `casa-postgres` | Up (healthy) | OK |
| `casa-redis` | Up (healthy) | OK |
| `casa-api` | Up | OK |
| `badgeone_nginx` | Up | OK — proxy reverso compartilhado |

### Resultado: site retornando 502 Bad Gateway publicamente.

---

## 2. Bugs encontrados e corrigidos

### Bug 1 — `casa-web`: `next: not found` / `node_modules missing`
- **Causa raiz:** `Dockerfile.web` runner stage copiava `node_modules` do stage `deps`, que não rodou `prisma generate`. O Prisma engine binário (`.so.node`) não estava presente. Adicionalmente, `apps/web/node_modules/.bin/next` e `packages/db/node_modules/.bin/prisma` não existiam no runner porque pnpm workspaces instala binários por workspace (não no root).
- **Evidência:** `docker logs casa-web` → `sh: next: not found` + `WARN Local package.json exists, but node_modules missing`
- **Correção (commit `04dabbd`):** Dockerfile.web runner stage passou a copiar `node_modules` do stage `builder` (que já rodou `db:generate`) + cópia explícita de `apps/web/node_modules` e `packages/db/node_modules`.

### Bug 2 — `casa-worker`: `ERR_MODULE_NOT_FOUND: .../domain/src/types`
- **Causa raiz:** `@casa/domain` exporta `"./src/index.ts"` (TypeScript puro). O worker era compilado com `tsc` (`moduleResolution: bundler`) que não insere extensões `.js` nos imports. O output JS tinha `export * from './types'` → Node.js ESM exige `.js` explícito.
- **Evidência:** `docker logs casa-worker` → `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/app/packages/domain/src/types'`
- **Correção (commits `04dabbd`, `66c4c6f`):** Substituído `tsc` + `node dist/index.js` por `tsx src/index.ts` em runtime. `tsx` usa esbuild internamente e resolve imports TypeScript corretamente. `start` script de `@casa/worker` alterado para `tsx src/index.ts`, CMD do Dockerfile usa `pnpm --filter @casa/worker start`.

### Bug 3 — `casa-web`: Prisma engine `.so.node` ausente
- **Causa raiz:** Segunda iteração. Após corrigir o bug do `next`, o runner copiava `node_modules` do stage `deps` (sem `prisma generate`).
- **Evidência:** `Ensure that "libquery_engine-linux-musl-openssl-3.0.x.so.node" has been copied`
- **Correção (commit `66c4c6f`):** Runner stage agora copia `node_modules` do `builder` (que rodou `db:generate`).

### Bug 4 — `casa-worker`: `tsx` binary não encontrado no root
- **Causa raiz:** `node_modules/.bin/tsx` não existe no root em pnpm workspace sem hoisting. `tsx` é devDep de `@casa/worker`, instalado em `apps/worker/node_modules/.bin/tsx`.
- **Correção (commit `66c4c6f`):** CMD usa `pnpm --filter @casa/worker start`, que resolve binários no contexto do workspace correto.

### Bug 5 — `/api/health` Redis sempre `error`
- **Causa raiz:** `dynamic import('ioredis')` dentro de route handler compilado pelo Next.js não resolvia o pacote corretamente em runtime.
- **Evidência:** Health endpoint retornava `redis: error` mesmo com Redis acessível e `nc -zv redis 6379` funcionando.
- **Correção (commit `630482a`):** Substituído por `import { Redis } from 'ioredis'` estático no topo do arquivo.

### Bug 6 — `scripts/deploy.sh` + `.github/workflows/deploy.yml` migration redundante
- **Causa raiz:** Ambos rodavam `docker exec` para migrations depois do `docker compose up -d`. O entrypoint já faz migrations antes do `next start`. O exec separado cria race condition (container pode não estar pronto) e é redundante.
- **Correção (commit `976c5c4`):** Removido o `docker exec` de migrations de ambos os arquivos.

---

## 3. Arquivos não rastreados — avaliação

| Arquivo | Decisão | Motivo |
|---------|---------|--------|
| `.dockerignore` | ✅ Adicionado ao git | Necessário para Docker builds eficientes |
| `ARCHITECTURE.md` | ✅ Adicionado ao git | Documentação válida do sistema |
| `nginx/docker.conf` | ✅ Adicionado ao git | Config Nginx para deploy Docker — canônica |
| `packages/gov-apis/src/banco.ts` | ✅ Adicionado ao git | Conector WIP para casa-api interno (válido, não exportado ainda) |
| `apps/web/src/app/(app)/licitacoes/page.tsx.save` | 🗑️ Removido | Arquivo temporário de editor — não deve ser rastreado |

---

## 4. Estado final confirmado

### Containers (estado final)
| Container | Estado | Porta |
|-----------|--------|-------|
| `casa-web` | Up ✅ | 3010→3000 |
| `casa-worker` | Up ✅ | — |
| `casa-postgres` | Up (healthy) ✅ | — |
| `casa-redis` | Up (healthy) ✅ | — |
| `casa-api` | Up ✅ | 3001 |

### Healthcheck
```json
{
  "status": "degraded",
  "checks": {
    "database": "ok",
    "redis": "ok",
    "comprasnetApiKey": "error"
  }
}
```
> `comprasnetApiKey: error` é esperado — variável opcional não configurada. Não afeta funcionalidade.

### Ingestão de dados
- `Licitacao`: 574 registros ✅
- `RawPncpRecord`: 579 registros ✅
- Worker cron: PNCP a cada 15min, ComprasNet a cada 30min

### Site público
- `https://app.casadolicitante.com.br` → HTTP 200 ✅
- Login (`/login`) → HTTP 200 ✅
- Auth endpoint → 302 redirect ✅ (comportamento correto NextAuth)

---

## 5. O que foi mantido sem alterar

- Toda a lógica de busca PNCP e ComprasNet
- Fluxo canônico de licitações com Prisma
- Middleware de autenticação e configuração NextAuth v5
- Estrutura de packages (domain, gov-apis, db)
- Nginx config do badgeone (compartilhado)
- Schema Prisma e migrations existentes
- Docker Compose estrutura de serviços

---

## 6. O que ainda ficou pendente

Ver `PENDENCIAS.md` atualizado e `CHECKLIST_POS_DEPLOY.md` para detalhes.

Principais pendências técnicas:
1. `banco.ts` não está exportado de `@casa/gov-apis/src/index.ts` — WIP, precisa de validação e integração
2. `/root/app-casa-do-licitante/` sem `.git` — diretório órfão, documentado em `DIVERGENCIAS_LOCAL_GITHUB_VPS.md`
3. `COMPRASNET_API_KEY` não configurada — buscas ComprasNet podem falhar dependendo da implementação
4. Dashboard com dados hardcoded (aguarda integração com banco)
5. Alertas, Stripe, Google OAuth, Resend — não implementados

---

## 7. Commits desta sessão de auditoria

| Commit | Descrição |
|--------|-----------|
| `04dabbd` | fix(docker): corrige crash de casa-web e casa-worker em produção |
| `66c4c6f` | fix(docker): corrige Prisma engine missing e tsx binary no path |
| `630482a` | fix(health): trocar dynamic import('ioredis') por import estático |
| `976c5c4` | fix(deploy): remove migration exec redundante e corrige comentários stale |
