#!/usr/bin/env bash
# Deployment script — runs on the VPS via GitHub Actions SSH
# Called by: .github/workflows/deploy.yml
set -euo pipefail

APP_DIR="/var/www/casa-do-licitante"
LOG_DIR="$APP_DIR/logs"

echo "==> [$(date -u +%Y-%m-%dT%H:%M:%SZ)] Starting deployment"

cd "$APP_DIR"

# Pull latest code
echo "==> Pulling latest code..."
git fetch --tags origin main
git reset --hard origin/main

# Install dependencies
echo "==> Installing dependencies..."
pnpm install --frozen-lockfile

# Generate Prisma client
echo "==> Generating Prisma client..."
pnpm db:generate

# Run database migrations
echo "==> Running database migrations..."
pnpm db:migrate

# Build all apps
echo "==> Building apps..."
pnpm build

# Create logs directory
mkdir -p "$LOG_DIR"

# Reload web app (zero-downtime)
echo "==> Reloading web process..."
pm2 reload ecosystem.config.cjs --only web --update-env

# Restart worker (needs full restart to pick up code changes)
echo "==> Restarting worker process..."
pm2 restart ecosystem.config.cjs --only worker --update-env

# Save PM2 process list
pm2 save

echo "==> Deployment complete!"
pm2 status
