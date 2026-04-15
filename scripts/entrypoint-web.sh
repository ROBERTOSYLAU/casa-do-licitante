#!/bin/sh
set -eu

cd /app

echo "→ Rodando migrations do banco..."
pnpm --filter @casa/db db:migrate

echo "→ Iniciando app web..."
exec pnpm --filter @casa/web start
