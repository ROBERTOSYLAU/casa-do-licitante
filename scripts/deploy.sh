#!/usr/bin/env bash
# Deployment script — runs on the VPS via GitHub Actions SSH
# Called by: .github/workflows/deploy.yml
set -euo pipefail

APP_DIR="/docker/app-casa-do-licitante"
REPO_URL="https://github.com/ROBERTOSYLAU/app-casa-do-licitante.git"

echo "==> [$(date -u +%Y-%m-%dT%H:%M:%SZ)] Starting deployment"

# ── First-time setup: clone repo if directory doesn't exist ──────────────────
if [ ! -d "$APP_DIR/.git" ]; then
  echo "==> First-time setup: cloning repository..."
  mkdir -p "$(dirname "$APP_DIR")"
  git clone "$REPO_URL" "$APP_DIR"
  echo "==> Clone complete."
fi

cd "$APP_DIR"

# Pull latest code
echo "==> Pulling latest code..."
git fetch origin main
git reset --hard origin/main

# Rebuild and restart web + worker containers (zero-downtime: postgres/redis untouched)
echo "==> Rebuilding containers..."
docker compose up -d --build --no-deps web worker

# Run migrations inside the new web container
echo "==> Running database migrations..."
docker exec casa-web sh -c 'cd /app && node_modules/.bin/prisma migrate deploy --schema packages/db/prisma/schema.prisma'

echo "==> Deployment complete!"
docker compose ps
