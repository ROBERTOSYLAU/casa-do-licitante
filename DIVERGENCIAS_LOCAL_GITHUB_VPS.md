# DIVERGÊNCIAS: Local × GitHub × VPS

**Data:** 2026-04-15  
**Referência de comparação:** commit `976c5c4` (HEAD)

---

## Visão geral dos 3 ambientes

| Ambiente | Localização | HEAD Git | Estado |
|----------|-------------|----------|--------|
| Máquina local (Roberto) | `C:\Users\Space Work\.openclaw\workspace\app-casa-do-licitante` | `5fcec72` (antes da auditoria) | ⚠️ Desatualizado — 4 commits atrás |
| GitHub | `github.com/ROBERTOSYLAU/app-casa-do-licitante` | `976c5c4` (após auditoria) | ✅ Canônico e atualizado |
| VPS — clone Docker | `/docker/app-casa-do-licitante/` | `976c5c4` (após auditoria) | ✅ Sincronizado com GitHub |
| VPS — diretório órfão | `/root/app-casa-do-licitante/` | **Sem `.git`** | ❌ Não é clone git |

---

## 1. Máquina local × GitHub

### Commits ausentes localmente (gerados nesta sessão)
```
04dabbd fix(docker): corrige crash de casa-web e casa-worker em produção
66c4c6f fix(docker): corrige Prisma engine missing e tsx binary no path
630482a fix(health): trocar dynamic import('ioredis') por import estático
976c5c4 fix(deploy): remove migration exec redundante e corrige comentários stale
```

**Ação necessária:** Rodar `git pull origin main` na máquina local para sincronizar.

### Arquivos novos no GitHub (não existiam antes)
- `.dockerignore`
- `ARCHITECTURE.md` (estava na VPS mas não rastreado)
- `nginx/docker.conf` (estava na VPS mas não rastreado)
- `packages/gov-apis/src/banco.ts` (estava na VPS mas não rastreado)
- `AUDITORIA_GERAL_CLAUDE.md` (este documento e similares)
- `DIVERGENCIAS_LOCAL_GITHUB_VPS.md`
- `ARQUITETURA_FINAL_RECOMENDADA.md`
- `PLANO_DE_DEPLOY_FINAL.md`
- `CHECKLIST_POS_DEPLOY.md`

---

## 2. GitHub × VPS clone Docker

### Estado atual: SINCRONIZADOS ✅
- `/docker/app-casa-do-licitante/` HEAD = `976c5c4` = GitHub HEAD
- `git remote -v` aponta para `https://github.com/ROBERTOSYLAU/app-casa-do-licitante.git`
- Deploy automático via GitHub Actions (push → SSH → git reset --hard → docker compose up --build)

### Arquivos que existem na VPS mas NÃO no GitHub (`.env`)
```
/docker/app-casa-do-licitante/.env
```
**Isso é correto.** `.env` está no `.gitignore` e nunca deve ir para o GitHub. Contém senhas e segredos. A VPS precisa manter seu próprio `.env` manualmente ou via secrets management.

---

## 3. VPS — Diretório órfão `/root/app-casa-do-licitante/`

### Problema identificado
O diretório `/root/app-casa-do-licitante/` **NÃO é um repositório git** (sem `.git`). A memória do projeto documentava este caminho como "Clone Git de trabalho", mas isso está errado — commits e pushes vêm de `/docker/app-casa-do-licitante/`.

### Conteúdo comparado
| Item | `/root/app-casa-do-licitante/` | `/docker/app-casa-do-licitante/` |
|------|------|------|
| `.git/` | ❌ Ausente | ✅ Presente |
| `ARCHITECTURE.md` | ❌ Ausente | ✅ Presente |
| `STATUS_ATUAL.md` | ❌ Ausente | ✅ Presente |
| `apps/web/` | ✅ Presente (versão antiga?) | ✅ Presente (atual) |
| `packages/` | ✅ Presente | ✅ Presente |

### Causa provável
Este diretório é provavelmente um **residual do período PM2** — quando a aplicação era gerenciada por PM2 e ficava em `/root/`. Após a migração para Docker em `/docker/`, o diretório em `/root/` ficou como resíduo sem `.git`.

### Recomendação
**Não remover ainda** sem backup confirmado por Roberto. Verificar se algum processo ainda usa este caminho. Para confirmar o abandono:
```bash
# Checar se algum serviço/cron usa /root/app-casa-do-licitante
grep -r "/root/app-casa-do-licitante" /etc/cron* /etc/systemd /root/.bashrc 2>/dev/null
```

---

## 4. Nginx — Dois configs concorrentes

| Config | Localização | Em uso? |
|--------|-------------|---------|
| `nginx/docker.conf` (rastreado) | `apps/casa-do-licitante/nginx/docker.conf` | ❌ Não — arquivo no repo, não montado |
| Config no `badgeone_nginx` | `/root/app-badgeone-/nginx/default.conf` | ✅ Sim — container ativo, proxia casa |

### Situação
O `nginx/docker.conf` no repositório é idêntico ao bloco Casa do Licitante em `default.conf` do badgeone. Está rastreado como referência mas **não é o nginx ativo**.

O nginx ativo é o `badgeone_nginx` container, que tem dois blocos: BadgeOne e Casa do Licitante. O bloco Casa do Licitante proxia para `web:3000` (hostname do service no Docker network `app-casa-do-licitante_app-network`).

### Validação de rede Docker
- `badgeone_nginx` está na rede `app-casa-do-licitante_app-network` (definido como external network no compose do BadgeOne)
- `casa-web` também está na mesma rede
- Portanto nginx pode alcançar `web:3000` ✅

---

## 5. Casa-api × Worker × Collector — Clarificação de papéis

Havia confusão sobre o papel de `casa-api`, `casa-collector` e `casa-worker`. Estado clarificado:

| Serviço | Papel | Estado |
|---------|-------|--------|
| `casa-api` | API REST Node.js — serve licitações do banco via HTTP (porta 3001) | Up ✅ |
| `casa-worker` | Worker BullMQ — ingere dados do PNCP e ComprasNet via crons | Up ✅ |
| `casa-collector` | Job one-shot legado — coleta PNCP e para (restart: "no") | Exited (normal) |

`casa-collector` tem `restart: "no"` — status "Exited" é NORMAL, não é falha.

---

## Resumo de ações necessárias

| Ação | Onde | Urgência |
|------|------|---------|
| `git pull origin main` | Máquina local do Roberto | Alta |
| Investigar e possivelmente remover `/root/app-casa-do-licitante/` | VPS | Baixa |
| Configurar `COMPRASNET_API_KEY` no `.env` | VPS `/docker/app-casa-do-licitante/.env` | Média |
