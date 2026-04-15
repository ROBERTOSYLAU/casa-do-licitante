import Link from 'next/link';
import { PackageSearch, ArrowRight } from 'lucide-react';

export default function TrackingPlaceholder() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-white/60">
        O rastreamento ainda não está integrado a transportadoras, mas este espaço já aponta para o fluxo natural de uso dentro da operação.
      </p>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-start gap-3">
          <PackageSearch className="mt-0.5 h-5 w-5 text-blue-300" />
          <div>
            <h3 className="font-semibold text-white">Destino planejado para este módulo</h3>
            <p className="mt-1 text-sm text-white/55">
              Centralizar acompanhamento de remessas, documentos, amostras e entregas ligadas às oportunidades e contratos.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Link
            href="/contratos"
            className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20"
          >
            Ir para contratos, onde esse fluxo deve se conectar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
