# PLANO DE DEPLOY FINAL — Casa do Licitante

**Data:** 2026-04-15  
**Status:** Operacional

---

## Deploy padrão (via GitHub Actions — automático)

Qualquer push para `main` dispara o deploy automático:

```bash
# Na máquina local, após testar mudanças:
git push origin main
```

O workflow `.github/workflows/deploy.yml`:
1. Faz SSH na VPS
2. `git fetch origin main && git reset --hard origin/main`
3. `docker compose up -d --build --no-deps web worker`
4. Migrations rodam automaticamente no entrypoint da imagem web

---

## Deploy manual (direto na VPS)

Para deploys de emergência ou quando GitHub Actions não está disponível:

```bash
# Na VPS, via SSH
cd /docker/app-casa-do-licitante

# Atualizar código
git fetch origin main
git reset --hard origin/main

# Rebuildar e subir web + worker
docker compose up -d --build --no-deps web worker

# Verificar status
docker compose ps
docker logs casa-web --tail 20
docker logs casa-worker --tail 20
```

---

## Setup inicial (primeira vez numa VPS nova)

```bash
# 1. Criar estrutura
mkdir -p /docker/app-casa-do-licitante
cd /docker

# 2. Clonar repositório
git clone https://github.com/ROBERTOSYLAU/app-casa-do-licitante.git

# 3. Criar .env (NUNCA commitar este arquivo)
cd /docker/app-casa-do-licitante
cp .env.example .env  # se existir
# Editar com valores reais:
# POSTGRES_PASSWORD=...
# NEXTAUTH_URL=https://app.casadolicitante.com.br
# NEXTAUTH_SECRET=...  (gerar: openssl rand -base64 32)
# AUTH_SECRET=...  (mesmo valor ou diferente)
# AUTH_TRUST_HOST=true

# 4. Subir infraestrutura base
docker compose up -d postgres redis

# 5. Aguardar postgres ficar healthy
docker compose ps

# 6. Subir API
docker compose up -d api

# 7. Buildar e subir web (migrations rodam automaticamente)
docker compose up -d --build web

# 8. Subir worker
docker compose up -d --build worker

# 9. Criar usuário admin
docker exec casa-postgres psql -U casa -d casa_licitante -c "
INSERT INTO \"User\" (id, email, name, \"hashedPassword\", role)
VALUES (
  'usr_admin_001',
  'roberto@casadolicitante.com.br',
  'Roberto',
  '\$2b\$10\$HASH_BCRYPT_AQUI',  -- gerar: node -e \"require('bcryptjs').hash('SENHA', 10).then(console.log)\"
  'admin'
);"

# 10. Verificar
curl http://localhost:3010/api/health
```

---

## Variáveis de ambiente obrigatórias

Arquivo: `/docker/app-casa-do-licitante/.env`

```bash
# Banco de dados
POSTGRES_PASSWORD=SENHA_FORTE_AQUI

# Auth
NEXTAUTH_URL=https://app.casadolicitante.com.br
NEXTAUTH_SECRET=SEGREDO_BASE64_ALEATORIO
AUTH_SECRET=SEGREDO_BASE64_ALEATORIO  # pode ser igual ao NEXTAUTH_SECRET
AUTH_TRUST_HOST=true

# Interno
CASA_API_URL=http://api:3001  # automático via compose, mas pode ser explícito
```

### Variáveis opcionais (funcionalidades futuras)
```bash
COMPRASNET_API_KEY=   # chave API dadosabertos.compras.gov.br
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
EVOLUTION_API_URL=
EVOLUTION_API_KEY=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=casa-do-licitante
TRANSPARENCIA_API_KEY=
```

---

## Gestão de migrations

Migrations rodam automaticamente via `entrypoint-web.sh` **antes** do `next start`. Não precisa rodar manualmente.

Para criar nova migration (desenvolvimento):
```bash
# Na máquina local
cd packages/db
pnpm prisma migrate dev --name nome_da_migration
# Commitar os arquivos de migration gerados
```

Para rodar migration de emergência manualmente na VPS:
```bash
docker exec casa-web pnpm --filter @casa/db db:migrate
```

---

## Operações de manutenção

### Reiniciar apenas o web
```bash
docker compose restart web
```

### Reiniciar apenas o worker
```bash
docker compose restart worker
```

### Ver logs em tempo real
```bash
docker logs -f casa-web
docker logs -f casa-worker
```

### Ver logs do banco
```bash
docker exec casa-postgres psql -U casa -d casa_licitante -c "SELECT COUNT(*) FROM \"Licitacao\";"
```

### Rodar collector manualmente (coleta PNCP one-shot)
```bash
cd /docker/app-casa-do-licitante
docker compose run --rm collector
```

### Backup do banco
```bash
docker exec casa-postgres pg_dump -U casa casa_licitante > backup_$(date +%Y%m%d).sql
```

---

## Checklist de verificação pós-deploy

Ver `CHECKLIST_POS_DEPLOY.md`.

---

## Nginx — alterações no proxy

O nginx ativo é o `badgeone_nginx`. Config em `/root/app-badgeone-/nginx/default.conf`.

Para alterar o bloco de Casa do Licitante:
```bash
# 1. Editar /root/app-badgeone-/nginx/default.conf
# 2. Testar configuração
docker exec badgeone_nginx nginx -t
# 3. Recarregar
docker exec badgeone_nginx nginx -s reload
```

**Atenção:** Qualquer erro no nginx derruba BadgeOne E Casa do Licitante simultaneamente.
