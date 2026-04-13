'use strict';

const config = require('../config');

/*  helpers  */

function normalizeString(value) {
  return String(value || '').trim();
}

function normalizeUrl(value) {
  const url = normalizeString(value);
  return url === '' ? null : url;
}

function safeUpper(value) {
  return normalizeString(value).toUpperCase();
}

/*  PNCP detail URL  */

/**
 * Constri o link de detalhe no PNCP.
 * Formato numeroControlePNCP: {CNPJ}-{tipo}-{sequencial}/{ano}
 * Exemplo: 10806496000149-1-000030/2026
 * URL: https://pncp.gov.br/app/editais/{CNPJ}/{ano}/{sequencial}
 */
function buildPncpDetailUrl(numeroControlePNCP) {
  const raw = normalizeString(numeroControlePNCP);
  const match = raw.match(/^(\d+)-\d+-(\d+)\/(\d{4})$/);
  if (!match) return null;
  const cnpj = match[1];
  const sequencial = String(Number(match[2])); // remove zeros  esquerda
  const ano = match[3];
  return `https://pncp.gov.br/app/editais/${cnpj}/${ano}/${sequencial}`;
}

/*  ComprasNet link builder  */

/**
 * Extrai o parmetro "compra" de uma URL do ComprasNet.
 * Suporta:
 *   - ?compra=XXXX
 *   - &compra=XXXX
 * Retorna null se no encontrar.
 */
function extractCompraParam(url) {
  if (!url) return null;
  const match = url.match(/[?&]compra=(\d+)/i);
  return match ? match[1] : null;
}

/**
 * Monta o link do ComprasNet para "Acompanhar Contratao" (ver itens).
 * Destino: acompanhamento-compra
 */
function buildComprasnetAcompanharUrl(compraParam) {
  if (!compraParam) return config.portals.comprasnetBaseUrl;
  return `https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-web/public/landing?destino=acompanhamento-compra&compra=${compraParam}`;
}

/**
 * Monta o link do ComprasNet para "Quadro Informativo" (avisos/impugnaes).
 * Destino: quadro-informativo
 */
function buildComprasnetQuadroUrl(compraParam) {
  if (!compraParam) return null;
  return `https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-web/public/landing?destino=quadro-informativo&compra=${compraParam}`;
}

/**
 * Monta o link do ComprasNet para "Cadastrar Proposta".
 * Destino: acompanhamento-compra (a proposta  enviada dentro desta tela)
 * URL direta da pesquisa: /public/compras/acompanhamento-compra?compra=XXXX
 */
function buildComprasnetPropostaUrl(compraParam) {
  if (!compraParam) return null;
  return `https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-web/public/compras/acompanhamento-compra?compra=${compraParam}`;
}

/**
 * Tenta construir o parmetro "compra" a partir dos campos do item PNCP.
 * Frmula: UASG(6) + codigoModalidade(2) + sequencial(5 zeros) + ano(4)
 * Exemplo: 158146 + 05 + 90013 + 2026 = 15814605900132026
 *
 * codigoModalidade mapeado:
 *   5   Prego Eletrnico  05
 *   6   Prego Presencial  06
 *   8   Dispensa Eletrnica  08 (verifique)
 *   outros  tenta detectar
 */
const MODALIDADE_CODIGO_MAP = {
  '1': '01', // Leilo - Eletrnico
  '2': '02', // Dilogo Competitivo
  '3': '03', // Concurso
  '4': '04', // Concorrncia - Eletrnico
  '5': '05', // Concorrncia - Presencial
  '6': '06', // Prego - Eletrnico
  '7': '07', // Prego - Presencial
  '8': '08', // Dispensa de Licitao
  '9': '09', // Inexigibilidade
  '10': '10', // Manifestao de interesse
  '11': '11', // Pr-qualificao
  '12': '12', // Credenciamento
  '13': '13', // Leilo - Presencial
};

function buildCompraParamFromFields(item) {
  const uasg = normalizeString(
    item?.unidadeOrgao?.codigoUnidade ||
    item?.unidadeSubRogada?.codigoUnidade ||
    ''
  );

  if (!uasg || !/^\d{4,7}$/.test(uasg)) return null;

  const uasgPad = uasg.padStart(6, '0');

  const modalidadeId = String(item?.modalidadeId || '');
  const modalidadeCod = MODALIDADE_CODIGO_MAP[modalidadeId] || null;
  if (!modalidadeCod) return null;

  const sequencial = item?.sequencialCompra;
  const ano = item?.anoCompra;
  if (!sequencial || !ano) return null;

  const sequencialPad = String(sequencial).padStart(5, '0');
  const anoStr = String(ano);

  return `${uasgPad}${modalidadeCod}${sequencialPad}${anoStr}`;
}

/*  portal detection  */

function detectPortalByLink(link) {
  const url = safeUpper(link);
  if (!url) return null;
  if (url.includes('COMPRAS.GOV.BR') || url.includes('COMPRASNET') || url.includes('ESTALEIRO.SERPRO')) return 'comprasnet';
  if (url.includes('LICITACOES-E') || url.includes('LICITACOES-E.COM.BR')) return 'licitacoes-e';
  if (url.includes('BLL.ORG.BR') || url.includes('BLLCOMPRAS')) return 'bll';
  if (url.includes('LICITANET')) return 'licitanet';
  if (url.includes('CAIXA.GOV.BR')) return 'caixa';
  if (url.includes('PORTALDECOMPRASPUBLICAS') || url.includes('COMPRASPUBLICAS')) return 'portal-de-compras-publicas';
  return null;
}

function detectPortalByText(item) {
  const blob = safeUpper(
    [
      item?.objetoCompra,
      item?.informacaoComplementar,
      item?.justificativaPresencial,
      item?.modalidadeNome,
      item?.usuarioNome,
      item?.linkSistemaOrigem,
      item?.linkProcessoEletronico,
      item?.numeroControlePNCP
    ].join(' ')
  );

  if (
    blob.includes('COMPRAS.GOV') ||
    blob.includes('COMPRASNET') ||
    blob.includes('ESTALEIRO.SERPRO') ||
    blob.includes('PORTAL DE COMPRAS DO GOVERNO FEDERAL')
  ) return 'comprasnet';

  if (blob.includes('LICITAES-E') || blob.includes('LICITACOES-E')) return 'licitacoes-e';
  if (blob.includes('BLL')) return 'bll';
  if (blob.includes('LICITANET')) return 'licitanet';
  if (blob.includes('CAIXA')) return 'caixa';
  if (blob.includes('PORTAL DE COMPRAS PBLICAS') || blob.includes('PORTAL DE COMPRAS PUBLICAS')) return 'portal-de-compras-publicas';

  return 'outro';
}

/*  UASG extraction  */

function extractUasg(item) {
  // 1. Tenta direto do campo codigoUnidade
  const candidates = [
    item?.unidadeOrgao?.codigoUnidade,
    item?.unidadeSubRogada?.codigoUnidade,
  ];
  for (const value of candidates) {
    const text = normalizeString(value);
    if (/^\d{4,7}$/.test(text)) return text;
  }

  // 2. Tenta extrair do parmetro "compra" do link
  const compraParam =
    extractCompraParam(item?.linkSistemaOrigem) ||
    extractCompraParam(item?.informacaoComplementar) ||
    extractCompraParam(item?.linkProcessoEletronico);
  if (compraParam && compraParam.length >= 11) {
    // compra = UASG(6) + modalidade(2) + sequencial(5) + ano(4) = 17 dgitos
    // mas pode variar; extrai os primeiros 6 como UASG
    return compraParam.substring(0, 6);
  }

  // 3. Tenta extrair de texto livre
  const blob = [
    item?.objetoCompra,
    item?.informacaoComplementar,
    item?.justificativaPresencial,
    item?.linkSistemaOrigem,
    item?.linkProcessoEletronico,
  ].map(normalizeString).join(' ');
  const match = blob.match(/\bUASG[:\s-]*?(\d{4,7})\b/i);
  return match ? match[1] : null;
}

/*  numero pregao extraction  */

function extractNumeroPregao(item) {
  // Usa o numeroCompra direto do PNCP (ex: "90013")
  const raw = normalizeString(item?.numeroCompra) ||
              normalizeString(item?.sequencialCompra) ||
              normalizeString(item?.processo);
  return raw || null;
}

/*  resolvePortal  */

function resolvePortal(item) {
  const numeroControlePNCP = normalizeString(item?.numeroControlePNCP) || null;
  const linkSistemaOrigem = normalizeUrl(item?.linkSistemaOrigem);
  const linkProcessoEletronico = normalizeUrl(item?.linkProcessoEletronico);
  const informacaoComplementar = normalizeString(item?.informacaoComplementar);

  // Detecta a fonte real
  const fonteReal =
    detectPortalByLink(linkSistemaOrigem) ||
    detectPortalByLink(linkProcessoEletronico) ||
    detectPortalByText(item) ||
    'outro';

  const uasg = extractUasg(item);
  const numeroPregao = extractNumeroPregao(item);

  // Link de detalhe do PNCP
  const linkDetalhePncp = buildPncpDetailUrl(numeroControlePNCP);

  let linkPortal = linkSistemaOrigem || linkProcessoEletronico;
  let linkQuadroInformativo = null;
  let linkCadastrarProposta = null;

  if (fonteReal === 'comprasnet') {
    // 1. Tenta extrair o parmetro "compra" do linkSistemaOrigem
    let compraParam =
      extractCompraParam(linkSistemaOrigem) ||
      extractCompraParam(linkProcessoEletronico);

    // 2. Tenta extrair do campo informacaoComplementar (muitos editais colocam o link l)
    if (!compraParam) {
      compraParam = extractCompraParam(informacaoComplementar);
    }

    // 3. Fallback: tenta construir a partir dos campos do item
    if (!compraParam) {
      compraParam = buildCompraParamFromFields(item);
    }

    if (compraParam) {
      // Link principal: acompanhar contratao (mostra itens)
      linkPortal = buildComprasnetAcompanharUrl(compraParam);
      // Link quadro informativo (avisos, impugnaes)
      linkQuadroInformativo = buildComprasnetQuadroUrl(compraParam);
      // Link cadastrar proposta
      linkCadastrarProposta = buildComprasnetPropostaUrl(compraParam);
    } else {
      // Fallback genrico (sem parmetro)
      linkPortal = config.portals.comprasnetBaseUrl;
    }
  }

  return {
    numeroControlePNCP,
    fonteReal,
    uasg,
    numeroPregao,
    linkPortal,
    linkQuadroInformativo,
    linkCadastrarProposta,
    linkDetalhePncp,
    // linkArquivosPncp aponta para o mesmo detalhe do PNCP (aba Arquivos)
    linkArquivosPncp: linkDetalhePncp,
  };
}

module.exports = { resolvePortal };
