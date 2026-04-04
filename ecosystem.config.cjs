// PM2 process manager config
// Usage:
//   pm2 start ecosystem.config.cjs          # start all
//   pm2 reload ecosystem.config.cjs         # zero-downtime reload (web)
//   pm2 restart ecosystem.config.cjs        # full restart
//   pm2 save && pm2 startup                 # persist across reboots

module.exports = {
  apps: [
    {
      name: 'web',
      cwd: './apps/web',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '../../logs/web-error.log',
      out_file: '../../logs/web-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'worker',
      cwd: './apps/worker',
      script: 'dist/index.js',
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env_production: {
        NODE_ENV: 'production',
      },
      error_file: '../../logs/worker-error.log',
      out_file: '../../logs/worker-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Exponential backoff on crash restarts
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: '10s',
    },
  ],
};
