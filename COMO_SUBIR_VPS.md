# COMO_SUBIR_VPS.md

## Pasta esperada na VPS
Pela documentação atual, o fluxo usa:

```bash
cd /root/app-casa-do-licitante
```

## Stack real prevista
- app web em `apps/web`
- worker em `apps/worker`
- banco via Prisma em `packages/db`
- Docker Compose
- Nginx
- serviço legado `api`

## Comandos documentados para deploy
```bash
cd /root/app-casa-do-licitante
git pull origin main
pnpm install --frozen-lockfile
pnpm --filter @casa/db db:generate
pnpm --filter @casa/db db:migrate
pnpm --filter @casa/web build
pnpm --filter @casa/worker build
docker compose up -d --build
```

## Comandos de verificação operacional
```bash
docker compose ps
docker logs --tail 100 casa-web
docker logs --tail 100 casa-worker
docker logs --tail 100 casa-api
nginx -t
systemctl status nginx --no-pager
curl -I http://127.0.0.1:3010/api/health
curl -I http://127.0.0.1:3001/
curl -I https://app.casadolicitante.com.br/api/health
curl -I https://api.casadolicitante.com.br/
```

## Opção legada com PM2
Ainda existe config PM2 no projeto:

```bash
pnpm pm2:start
pnpm pm2:reload
pnpm pm2:stop
```

## Estado real atual da VPS
Até o estado conhecido desta conversa:
- o deploy ainda não foi concluído
- o ambiente público apresentou `502 Bad Gateway`
- o login em produção ainda não foi validado
- o acesso SSH remoto ficou travado por autenticação/configuração e não chegou a entrar em fase de deploy efetivo

## O que precisa estar certo antes do deploy real
- código sincronizado na VPS
- variáveis de ambiente reais configuradas
- banco acessível
- Redis acessível
- `COMPRASNET_API_KEY` presente se o fluxo de ingestão real for usado
- Nginx apontando corretamente para os serviços ativos
