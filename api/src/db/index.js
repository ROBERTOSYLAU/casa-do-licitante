'use strict';

const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

async function query(text, params = []) {
  return pool.query(text, params);
}

async function migrate() {
  // Tabela principal
  await query(`
    CREATE TABLE IF NOT EXISTS licitacoes (
      id                    SERIAL PRIMARY KEY,
      numero_controle_pncp  TEXT,
      orgao                 TEXT,
      objeto                TEXT,
      valor                 NUMERIC(18,2),
      data                  TIMESTAMP,
      link                  TEXT,
      uf                    VARCHAR(2),
      municipio             TEXT,
      modalidade            TEXT,
      status                TEXT,
      fonte                 TEXT,
      fonte_real            TEXT,
      uasg                  TEXT,
      numero_pregao         TEXT,
      link_portal           TEXT,
      link_quadro_informativo TEXT,
      link_cadastrar_proposta TEXT,
      link_detalhe_pncp     TEXT,
      link_arquivos_pncp    TEXT,
      criado_em             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migraes incrementais  adicionam colunas se ainda no existirem
  const alterCols = [
    `ALTER TABLE licitacoes ADD COLUMN IF NOT EXISTS fonte_real TEXT`,
    `ALTER TABLE licitacoes ADD COLUMN IF NOT EXISTS uasg TEXT`,
    `ALTER TABLE licitacoes ADD COLUMN IF NOT EXISTS numero_pregao TEXT`,
    `ALTER TABLE licitacoes ADD COLUMN IF NOT EXISTS link_portal TEXT`,
    `ALTER TABLE licitacoes ADD COLUMN IF NOT EXISTS link_quadro_informativo TEXT`,
    `ALTER TABLE licitacoes ADD COLUMN IF NOT EXISTS link_cadastrar_proposta TEXT`,
    `ALTER TABLE licitacoes ADD COLUMN IF NOT EXISTS link_detalhe_pncp TEXT`,
    `ALTER TABLE licitacoes ADD COLUMN IF NOT EXISTS link_arquivos_pncp TEXT`,
  ];
  for (const sql of alterCols) {
    await query(sql);
  }

  // ndices
  const indexes = [
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_licitacoes_numero_controle_pncp ON licitacoes (numero_controle_pncp)`,
    `CREATE INDEX IF NOT EXISTS idx_licitacoes_orgao       ON licitacoes (orgao)`,
    `CREATE INDEX IF NOT EXISTS idx_licitacoes_valor       ON licitacoes (valor)`,
    `CREATE INDEX IF NOT EXISTS idx_licitacoes_data        ON licitacoes (data)`,
    `CREATE INDEX IF NOT EXISTS idx_licitacoes_uf          ON licitacoes (uf)`,
    `CREATE INDEX IF NOT EXISTS idx_licitacoes_municipio   ON licitacoes (municipio)`,
    `CREATE INDEX IF NOT EXISTS idx_licitacoes_modalidade  ON licitacoes (modalidade)`,
    `CREATE INDEX IF NOT EXISTS idx_licitacoes_fonte_real  ON licitacoes (fonte_real)`,
    `CREATE INDEX IF NOT EXISTS idx_licitacoes_status      ON licitacoes (status)`,
    `CREATE INDEX IF NOT EXISTS idx_licitacoes_numero_pregao ON licitacoes (numero_pregao)`,
    `CREATE INDEX IF NOT EXISTS idx_licitacoes_uasg        ON licitacoes (uasg)`,
    `CREATE INDEX IF NOT EXISTS idx_licitacoes_objeto_fts  ON licitacoes USING GIN (to_tsvector('portuguese', COALESCE(objeto, '')))`,
  ];
  for (const sql of indexes) {
    await query(sql);
  }
}

module.exports = { pool, query, migrate };
