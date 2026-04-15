import { fetchComprasnetBids } from '../packages/gov-apis/dist/comprasnet.js';

async function main() {
  const filters = {
    source: 'comprasnet',
    uf: 'PI',
    modalidade: 'pregao_eletronico',
    dataInicial: '2026-04-01',
    dataFinal: '2026-04-30',
    periodoTipo: 'publicacao',
  };

  const results = await fetchComprasnetBids(filters);
  console.log(JSON.stringify({ count: results.length, sample: results[0] ?? null }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
