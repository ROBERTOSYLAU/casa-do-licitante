'use strict';

const express = require('express');
const db = require('../db');

const router = express.Router();

/*  GET /  */

router.get('/', async (req, res) => {
  try {
    const {
      q,
      orgao,
      uf,
      municipio,
      modalidade,
      valorMin,
      valorMax,
      dataInicio,
      dataFim,
      fonteReal,
      portal,
      uasg,
      numeroPregao,
      page = 1,
      limit = 20,
    } = req.query;

    const safePage  = Math.max(Number(page)  || 1,  1);
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const offset    = (safePage - 1) * safeLimit;

    const where  = [];
    const params = [];

    if (q) {
      params.push(q);
      where.push(`to_tsvector('portuguese', COALESCE(objeto, '')) @@ plainto_tsquery('portuguese', $${params.length})`);
    }
    if (orgao) {
      params.push(`%${orgao}%`);
      where.push(`orgao ILIKE $${params.length}`);
    }
    if (uf) {
      params.push(String(uf).toUpperCase());
      where.push(`uf = $${params.length}`);
    }
    if (municipio) {
      params.push(`%${municipio}%`);
      where.push(`municipio ILIKE $${params.length}`);
    }
    if (modalidade) {
      params.push(`%${modalidade}%`);
      where.push(`modalidade ILIKE $${params.length}`);
    }
    if (valorMin) {
      params.push(Number(valorMin));
      where.push(`valor >= $${params.length}`);
    }
    if (valorMax) {
      params.push(Number(valorMax));
      where.push(`valor <= $${params.length}`);
    }
    if (dataInicio) {
      params.push(dataInicio);
      where.push(`data >= $${params.length}`);
    }
    if (dataFim) {
      params.push(dataFim);
      where.push(`data <= $${params.length}`);
    }
    if (fonteReal) {
      params.push(fonteReal);
      where.push(`fonte_real = $${params.length}`);
    }
    if (portal) {
      const portalMap = {
        comprasnet: 'comprasnet',
        'outros / pncp': 'pncp',
        pncp: 'pncp',
        'licitações-e': 'licitacoes-e',
        'licitacoes-e': 'licitacoes-e',
        bll: 'bll',
        'bll compras': 'bll',
        licitanet: 'licitanet',
      };
      const normalizedPortal = String(portal).trim().toLowerCase();
      const mappedPortal = portalMap[normalizedPortal] || normalizedPortal;
      params.push(mappedPortal);
      where.push(`LOWER(COALESCE(fonte_real, '')) = $${params.length}`);
    }
    if (uasg) {
      params.push(String(uasg));
      where.push(`uasg = $${params.length}`);
    }
    if (numeroPregao) {
      params.push(`%${numeroPregao}%`);
      where.push(`numero_pregao ILIKE $${params.length}`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total FROM licitacoes ${whereSql}`,
      params
    );
    const total = countResult.rows[0]?.total || 0;

    params.push(safeLimit);
    params.push(offset);

    const dataSql = `
      SELECT
        id,
        numero_controle_pncp,
        orgao,
        objeto,
        valor,
        data,
        link,
        uf,
        municipio,
        modalidade,
        status,
        fonte,
        fonte_real,
        uasg,
        numero_pregao,
        link_portal,
        link_quadro_informativo,
        link_cadastrar_proposta,
        link_detalhe_pncp,
        link_arquivos_pncp,
        criado_em
      FROM licitacoes
      ${whereSql}
      ORDER BY data DESC NULLS LAST, id DESC
      LIMIT $${params.length - 1}
      OFFSET $${params.length}
    `;

    const dataResult = await db.query(dataSql, params);

    res.json({
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
      data: dataResult.rows,
    });
  } catch (err) {
    res.status(500).json({
      error: 'Erro ao consultar licitaes',
      details: err.message,
    });
  }
});

/*  GET /:id  */

router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
        id,
        numero_controle_pncp,
        orgao,
        objeto,
        valor,
        data,
        link,
        uf,
        municipio,
        modalidade,
        status,
        fonte,
        fonte_real,
        uasg,
        numero_pregao,
        link_portal,
        link_quadro_informativo,
        link_cadastrar_proposta,
        link_detalhe_pncp,
        link_arquivos_pncp,
        criado_em
      FROM licitacoes
      WHERE id = $1`,
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Licitao no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: 'Erro ao consultar licitao',
      details: err.message,
    });
  }
});

module.exports = router;
