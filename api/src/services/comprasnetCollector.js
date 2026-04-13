const db = require('../db');
const config = require('../config');
const { chromium } = require('playwright');

async function buscarNoComprasnet(page, uasg, numeroPregao) {
  try {
    await page.goto(config.portals.comprasnetBaseUrl, { timeout: 60000 });

    await page.waitForTimeout(3000);

    // Preenche UASG
    const uasgInput = await page.locator('input').first();
    await uasgInput.fill(uasg);

    // Preenche número
    const numeroInput = await page.locator('input').nth(1);
    await numeroInput.fill(numeroPregao);

    // Clica pesquisar
    await page.click('button:has-text("Pesquisar")');

    await page.waitForTimeout(5000);

    const html = await page.content();

    return {
      encontrado: html.includes('Pregão') || html.includes('Item'),
      html
    };

  } catch (err) {
    return {
      encontrado: false,
      erro: err.message
    };
  }
}

async function coletarComprasnet() {
  console.log('🚀 Iniciando coleta ComprasNet...');

  const result = await db.query(`
    SELECT id, uasg, numero_pregao
    FROM licitacoes
    WHERE fonte_real = 'comprasnet'
    AND uasg IS NOT NULL
    LIMIT 10
  `);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let sucessos = 0;
  let falhas = 0;

  for (const item of result.rows) {
    console.log(`🔎 Buscando UASG ${item.uasg} / ${item.numero_pregao}`);

    const busca = await buscarNoComprasnet(page, item.uasg, item.numero_pregao);

    if (busca.encontrado) {
      sucessos++;

      await db.query(`
        UPDATE licitacoes
        SET link_portal = $1
        WHERE id = $2
      `, [config.portals.comprasnetBaseUrl, item.id]);

    } else {
      falhas++;
    }
  }

  await browser.close();

  console.log(`✅ Finalizado: ${sucessos} encontrados | ${falhas} falhas`);
}

module.exports = {
  coletarComprasnet
};
