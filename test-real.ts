import { fetchComprasnetBids } from './packages/gov-apis/src/comprasnet';
import { fetchPncpBids } from './packages/gov-apis/src/pncp';

async function testar() {
  console.log("== ComprasNet: 2026-04-06, PI, modalidade pregão ==");
  const c1 = await fetchComprasnetBids({
    source: 'comprasnet' as any,
    dataInicial: '2026-04-06',
    dataFinal: '2026-04-06',
    uf: 'PI',
    modalidade: 'pregao_eletronico'
  });
  console.log(`C1 -> ${c1.length} resultados`);

  console.log("== ComprasNet: 2026-04-06, PI, modalidade TODOS ==");
  const c2 = await fetchComprasnetBids({
    source: 'comprasnet' as any,
    dataInicial: '2026-04-06',
    dataFinal: '2026-04-06',
    uf: 'PI',
  });
  console.log(`C2 -> ${c2.length} resultados`);

  console.log("== PNCP: 2026-04-06, PI, modalidade pregão ==");
  const p1 = await fetchPncpBids({
    source: 'pncp' as any,
    dataInicial: '2026-04-06',
    dataFinal: '2026-04-06',
    uf: 'PI',
    modalidade: 'pregao_eletronico'
  });
  console.log(`P1 -> ${p1.length} resultados`);
}

testar();
