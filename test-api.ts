import { fetchComprasnetBids } from './packages/gov-apis/src/comprasnet';

async function main() {
  console.log("Testing ComprasNet filter: PI, pregao_eletronico, April 2026");
  try {
    const filters = { 
      source: 'comprasnet' as any,
      uf: 'PI', 
      modalidade: 'pregao_eletronico',
      // The user said 6 de abril, let's just search the whole month to see if there are any results.
      dataInicial: '2026-04-01',
      dataFinal: '2026-04-30'
    };
    const comprasnet = await fetchComprasnetBids(filters);
    console.log(`ComprasNet returned ${comprasnet.length} results.`);
    if (comprasnet.length > 0) {
      console.log('Sample result:', comprasnet[0].uf, comprasnet[0].modalidade);
    }
  } catch (e) {
    console.error("ComprasNet Error", e);
  }

  // Raw fetch to log the API response status and body
  const qs = new URLSearchParams({
    pagina: '1',
    tamanhoPagina: '10',
    dataPublicacaoPncpInicial: '2026-04-01',
    dataPublicacaoPncpFinal: '2026-04-30',
    codigoModalidade: '5',
    unidadeOrgaoUfSigla: 'PI'
  }).toString()

  const rawRes = await fetch(`https://dadosabertos.compras.gov.br/modulo-contratacoes/1_consultarContratacoes_PNCP_14133?${qs}`);
  console.log('HTTP STATUS:', rawRes.status);
  const text = await rawRes.text();
  console.log('Raw body length:', text.length);
  if (text.length > 0 && text.length < 500) console.log(text);
}

main();
