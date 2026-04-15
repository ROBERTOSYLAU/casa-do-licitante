# Runbook operacional

## Subdomínios esperados
- `app.casadolicitante.com.br` -> serviço `web`
- `api.casadolicitante.com.br` -> serviço `api`

## Endpoints mínimos de verificação

### App web
- `GET /api/health`
- `GET /api/licitacoes`

### API legada
- `GET /` ou endpoint raiz exposto pelo serviço

## Checklist de deploy
1. Atualizar código
2. Aplicar migrations
3. Rebuild de `web` e `worker`
4. Validar health checks
5. Validar busca PNCP/ComprasNet
6. Validar proxy do Nginx
7. Validar subdomínios externos

## Comandos úteis

### Subir stack
```bash
docker compose up -d --build
```

### Ver status
```bash
docker compose ps
docker logs --tail 100 casa-web
docker logs --tail 100 casa-worker
docker logs --tail 100 casa-api
```

### Validar Nginx
```bash
nginx -t
systemctl status nginx --no-pager
ss -tulpn | grep -E ':80|:443|:3010|:3001'
```

### Validar endpoints
```bash
curl -I http://127.0.0.1:3010/api/health
curl -I http://127.0.0.1:3001/
curl -I https://app.casadolicitante.com.br/api/health
curl -I https://api.casadolicitante.com.br/
```

## Incidentes conhecidos

### Worker falhando com overflow
Sintoma:
- `Unable to fit integer value ... into an INT4`

Causa:
- valor monetário em centavos excedendo `INTEGER`

Correção:
- migration para `BIGINT`
- rebuild do worker
- reprocessamento do job

### Nginx failed no systemd
Sintoma:
- `nginx.service` aparece como failed

Ações:
- validar `nginx -t`
- corrigir config ativa
- reiniciar com `systemctl restart nginx`
- confirmar portas e subdomínios
