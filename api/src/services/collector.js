'use strict';

const https = require('https');
const config = require('../config');
const db = require('../db');
const { resolvePortal } = require('./portalResolver');

/*  PNCP fetch  */

function fetchPncpPage(page) {
  return new Promise((resolve, reject) => {
    const path =
      `/api/consulta/v1/contratacoes/publicacao` +
      `?dataInicial=${config.pncp.dataInicial}` +
      `&dataFinal=${config.pncp.dataFinal}` +
      `&codigoModalidadeContratacao=${config.pncp.modalidade}` +
      `&pagina=${page}` +
      `&tamanhoPagina=${config.pncp.paginaSize}`;

    const options = {
      hostname: 'pncp.gov.br',
      path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          const data = json.data || json.content || [];
          resolve({ json, data });
        } catch (err) {
          reject(new Error(`Falha ao parsear resposta do PNCP: ${err.message}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/*  item mapping  */

function mapPncpItem(item) {
  const portal = resolvePortal(item);

  return {
    numero_controle_pncp:    portal.numeroControlePNCP,
    orgao:                   item?.orgaoEntidade?.razaoSocial || 'N/A',
    objeto:                  item?.objetoCompra || 'N/A',
    valor:                   item?.valorTotalEstimado || 0,
    data:                    item?.dataAberturaProposta || null,
    link:                    item?.linkSistemaOrigem || null,
    uf:
      item?.unidadeOrgao?.ufSigla ||
      item?.orgaoEntidade?.ufSigla ||
      item?.unidadeSubRogada?.ufSigla ||
      null,
    municipio:
      item?.unidadeOrgao?.municipioNome ||
      item?.orgaoEntidade?.municipioNome ||
      item?.unidadeSubRogada?.municipioNome ||
      null,
    modalidade:              item?.modalidadeNome || null,
    status:                  item?.situacaoCompraNome || null,
    fonte:                   'pncp',
    fonte_real:              portal.fonteReal,
    uasg:                    portal.uasg,
    numero_pregao:           portal.numeroPregao,
    link_portal:             portal.linkPortal,
    link_quadro_informativo: portal.linkQuadroInformativo,
    link_cadastrar_proposta: portal.linkCadastrarProposta,
    link_detalhe_pncp:       portal.linkDetalhePncp,
    link_arquivos_pncp:      portal.linkArquivosPncp,
  };
}

/*  upsert  */

async function upsertLicitacao(item) {
  // Tenta atualizar primeiro; se no achar, insere.
  // Usa numero_controle_pncp como chave primria de negcio.
  const updateSql = `
    UPDATE licitacoes SET
      orgao                   = $2,
      objeto                  = $3,
      valor                   = $4,
      data                    = $5,
      link                    = $6,
      uf                      = $7,
      municipio               = $8,
      modalidade              = $9,
      status                  = $10,
      fonte                   = $11,
      fonte_real              = $12,
      uasg                    = $13,
      numero_pregao           = $14,
      link_portal             = $15,
      link_quadro_informativo = $16,
      link_cadastrar_proposta = $17,
      link_detalhe_pncp       = $18,
      link_arquivos_pncp      = $19
    WHERE numero_controle_pncp = $1
    RETURNING id
  `;

  const params = [
    item.numero_controle_pncp,
    item.orgao,
    item.objeto,
    item.valor,
    item.data,
    item.link,
    item.uf,
    item.municipio,
    item.modalidade,
    item.status,
    item.fonte,
    item.fonte_real,
    item.uasg,
    item.numero_pregao,
    item.link_portal,
    item.link_quadro_informativo,
    item.link_cadastrar_proposta,
    item.link_detalhe_pncp,
    item.link_arquivos_pncp,
  ];

  const updateResult = await db.query(updateSql, params);

  if (updateResult.rowCount === 0) {
    // Registro novo  insere
    const insertSql = `
      INSERT INTO licitacoes (
        numero_controle_pncp,
        orgao, objeto, valor, data, link,
        uf, municipio, modalidade, status, fonte,
        fonte_real, uasg, numero_pregao,
        link_portal, link_quadro_informativo, link_cadastrar_proposta,
        link_detalhe_pncp, link_arquivos_pncp
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
      )
      ON CONFLICT DO NOTHING
    `;
    await db.query(insertSql, params);
  }
}

/*  collector  */

async function collectPncp() {
  let totalRecebido = 0;
  let paginasLidas = 0;

  for (let page = 1; page <= config.pncp.maxPaginas; page += 1) {
    console.log(
      JSON.stringify({ level: 'info', msg: 'Buscando pgina do PNCP', page })
    );

    const { data } = await fetchPncpPage(page);

    if (!data.length) break;

    paginasLidas += 1;
    totalRecebido += data.length;

    for (const rawItem of data) {
      const item = mapPncpItem(rawItem);
      await upsertLicitacao(item);
    }
  }

  console.log(
    JSON.stringify({
      level: 'info',
      msg: 'Coleta concluda',
      paginasLidas,
      totalRecebido,
    })
  );
}

module.exports = { collectPncp };
