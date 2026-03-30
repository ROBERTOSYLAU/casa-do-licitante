#!/usr/bin/env bash
# First-time VPS setup for Casa do Licitante on Hostinger/Ubuntu
# Run once as root or with sudo: bash setup-vps.sh
set -euo pipefail

APP_DIR="/var/www/app-casa-do-licitante"
APP_USER="deploy"
DOMAIN="yourdomain.com"   # <-- change this

echo "==> Setting up Casa do Licitante on VPS"

# --- System packages ---
apt-get update -y
apt-get install -y curl git nginx certbot python3-certbot-nginx ufw

# --- Node.js 20 via nvm (for deploy user) ---
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm install 20
nvm alias default 20

# --- pnpm ---
npm install -g pnpm@9.15.4

# --- PM2 ---
npm install -g pm2

# --- Redis ---
apt-get install -y redis-server
systemctl enable redis-server
systemctl start redis-server

# --- PostgreSQL ---
apt-get install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql

# --- Create database and user ---
DB_PASS=$(openssl rand -base64 32 | tr -d '=+/' | cut -c1-24)
sudo -u postgres psql <<SQL
CREATE USER casa_licitante WITH PASSWORD '$DB_PASS';
CREATE DATABASE casa_do_licitante OWNER casa_licitante;
GRANT ALL PRIVILEGES ON DATABASE casa_do_licitante TO casa_licitante;
SQL
echo ""
echo "==> Database password: $DB_PASS"
echo "==> DATABASE_URL=postgresql://casa_licitante:${DB_PASS}@localhost:5432/casa_do_licitante"
echo ""

# --- Deploy user ---
if ! id "$APP_USER" &>/dev/null; then
  useradd -m -s /bin/bash "$APP_USER"
  echo "==> Created user: $APP_USER"
fi

# --- App directory ---
mkdir -p "$APP_DIR"
chown -R "$APP_USER:$APP_USER" "$APP_DIR"
mkdir -p "$APP_DIR/logs"

# --- Clone repo ---
# (Run as deploy user after adding deploy key to GitHub)
# sudo -u "$APP_USER" git clone https://github.com/ROBERTOSYLAU/casa-do-licitante.git "$APP_DIR"

# --- Nginx ---
cp /dev/stdin /etc/nginx/sites-available/casa-do-licitante <<NGINX
# Placeholder — replace with nginx/casa-do-licitante.conf after setting domain
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    location / { proxy_pass http://127.0.0.1:3000; }
}
NGINX
ln -sf /etc/nginx/sites-available/casa-do-licitante /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# --- Firewall ---
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# --- SSL ---
echo "==> After DNS is pointed, run:"
echo "    certbot --nginx -d $DOMAIN -d www.$DOMAIN"

# --- PM2 startup ---
pm2 startup systemd -u "$APP_USER" --hp "/home/$APP_USER"

echo ""
echo "==> VPS setup complete!"
echo ""
echo "Next steps:"
echo "  1. Copy .env.production to $APP_DIR/.env"
echo "  2. Clone repo: sudo -u $APP_USER git clone https://github.com/ROBERTOSYLAU/casa-do-licitante.git $APP_DIR"
echo "  3. Run: pnpm install && pnpm db:generate && pnpm db:migrate && pnpm build"
echo "  4. Start: pm2 start $APP_DIR/ecosystem.config.cjs --env production && pm2 save"
echo "  5. Point DNS to this server IP, then run certbot for SSL"
