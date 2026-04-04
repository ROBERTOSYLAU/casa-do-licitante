import { fetchComprasnetBids } from './packages/gov-apis/src/comprasnet';

async function testarAbertura() {
  const qs = new URLSearchParams({
    pagina: '1',
    tamanhoPagina: '10',
    dataAberturaPropostaPncpInicial: '2026-04-06',
    dataAberturaPropostaPncpFinal: '2026-04-10',
  }).toString();
  
  const res = await fetch(`https://dadosabertos.compras.gov.br/modulo-contratacoes/1_consultarContratacoes_PNCP_14133?${qs}`);
  console.log('HTTP', res.status);
  const text = await res.text();
  console.log(text.substring(0, 500));
}
testarAbertura();
