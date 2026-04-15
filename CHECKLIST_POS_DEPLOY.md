# CHECKLIST PÓS-DEPLOY — Casa do Licitante

**Data de criação:** 2026-04-15  
**Usar após:** qualquer deploy (manual ou automático)

---

## Verificação imediata (primeiros 2 minutos)

### Containers

```bash
docker compose ps
```

Esperado:
- `casa-web`: Up (não Restarting)
- `casa-worker`: Up (não Restarting)
- `casa-postgres`: Up (healthy)
- `casa-redis`: Up (healthy)
- `casa-api`: Up

### Logs web (sem erro crítico)
```bash
docker logs casa-web --tail 20
```

Esperado:
```
→ Rodando migrations do banco...
No pending migrations to apply.
→ Iniciando app web...
✓ Ready in Xs
```

❌ Falha se aparece: `next: not found`, `Restarting`, `Prisma engine not found`

### Logs worker (cron registrado)
```bash
docker logs casa-worker --tail 10
```

Esperado:
```
[worker] Starting Casa do Licitante worker...
[worker] Cron schedulers registered.
```

❌ Falha se aparece: `ERR_MODULE_NOT_FOUND`, `Restarting`

---

## Verificação de saúde

### Healthcheck interno
```bash
curl http://localhost:3010/api/health
```

Esperado:
```json
{
  "status": "ok",        // ou "degraded" se COMPRASNET_API_KEY não configurada
  "checks": {
    "database": "ok",
    "redis": "ok",
    "comprasnetApiKey": "ok"  // "error" é aceitável se chave não configurada
  }
}
```

❌ Falha se: `database: error` ou `redis: error`

### Site público
```bash
curl -s -o /dev/null -w "%{http_code}" https://app.casadolicitante.com.br
```
Esperado: `200`

❌ Falha se: `502`, `503`, `000`

### Página de login
```bash
curl -s -o /dev/null -w "%{http_code}" https://app.casadolicitante.com.br/login
```
Esperado: `200`

---

## Verificação do banco

```bash
docker exec casa-postgres psql -U casa -d casa_licitante -c "
SELECT 'Licitacoes' as tabela, COUNT(*) as total FROM \"Licitacao\"
UNION ALL
SELECT 'Usuarios', COUNT(*) FROM \"User\"
UNION ALL
SELECT 'RawPNCP', COUNT(*) FROM \"RawPncpRecord\";
"
```

Esperado: números não-zero (exceto em setup inicial)

---

## Verificação do worker (ingestão)

```bash
docker exec casa-redis redis-cli KEYS "bull:*" | head -5
```

Esperado: chaves com pattern `bull:ingest-pncp:*` e/ou `bull:ingest-comprasnet:*`

Para forçar um job imediato e verificar:
```bash
# Aguardar próximo ciclo (15min PNCP) ou verificar logs
docker logs casa-worker -f
```

---

## Verificação do nginx

```bash
# Testar configuração
docker exec badgeone_nginx nginx -t

# Verificar que o proxy está funcionando
curl -s -o /dev/null -w "%{http_code}" http://localhost:3010/
```

---

## Verificação de migrations

```bash
docker exec casa-web pnpm --filter @casa/db db:migrate 2>&1 | tail -5
```

Esperado: `No pending migrations to apply.`

❌ Falha se: erros de conexão ou migration com erro

---

## Verificação de auth (login)

Via browser ou curl:
1. Acesse `https://app.casadolicitante.com.br/login`
2. Faça login com `roberto@casadolicitante.com.br`
3. Deve redirecionar para `/dashboard`

Via curl (verifica redirect):
```bash
curl -s -o /dev/null -w "%{http_code}" \
  -X POST "https://app.casadolicitante.com.br/api/auth/callback/credentials" \
  -d "email=roberto%40casadolicitante.com.br&password=CasaAdmin2026%21"
```
Esperado: `302` (redirect = processou)

---

## Rollback se necessário

```bash
cd /docker/app-casa-do-licitante

# Ver commits disponíveis
git log --oneline -5

# Voltar ao commit anterior
git checkout HASH_ANTERIOR

# Rebuildar com versão anterior
docker compose up -d --build --no-deps web worker
```

---

## Estado verificado em 2026-04-15 (referência)

| Verificação | Resultado |
|-------------|-----------|
| `docker compose ps` | Todos Up ✅ |
| `curl /api/health` | `database:ok, redis:ok` ✅ |
| Site público | 200 ✅ |
| Login page | 200 ✅ |
| Worker logs | Cron registrado ✅ |
| Licitacoes no banco | 574 registros ✅ |
| RawPncpRecord | 579 registros ✅ |
| Nginx | Funcional ✅ |
