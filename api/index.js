const express = require('express');
const config = require('./src/config');
const db = require('./src/db');
const licitacoesRouter = require('./src/routes/licitacoes');
const { collectPncp } = require('./src/services/collector');

async function start() {
  await db.migrate();

  if (config.mode === 'collect') {
    await collectPncp();
    process.exit(0);
  }

  const app = express();
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({
      service: 'casa-api',
      version: '2.0.0',
      status: 'running',
      endpoints: ['/health', '/licitacoes']
    });
  });

  app.get('/health', async (_req, res) => {
    try {
      await db.query('SELECT 1');
      res.json({ ok: true, service: 'casa-api' });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  app.use('/licitacoes', licitacoesRouter);

  app.listen(config.api.port, () => {
    console.log(
      JSON.stringify({
        level: 'info',
        msg: 'API iniciada',
        port: config.api.port,
        mode: config.mode
      })
    );
  });
}

start().catch((err) => {
  console.error(
    JSON.stringify({
      level: 'error',
      msg: 'Falha ao iniciar aplicao',
      error: err.message,
      stack: err.stack
    })
  );
  process.exit(1);
});
