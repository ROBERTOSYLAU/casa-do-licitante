'use client';

import { useState } from 'react';
import { Search, Building, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

function formatCnpj(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 14);
  return d
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

interface CnpjData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  cnae_fiscal_descricao: string;
  capital_social: number;
}

export default function CnpjSearch() {
  const [cnpj, setCnpj] = useState('');
  const [result, setResult] = useState<CnpjData | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const raw = cnpj.replace(/\D/g, '');
    if (raw.length !== 14) {
      toast.error('CNPJ inválido', { description: 'Digite 14 dígitos.' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      // Route through our own API to avoid CORS and add caching
      const res = await fetch(`/api/ferramentas/cnpj?cnpj=${raw}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erro desconhecido');
      setResult(data as CnpjData);
    } catch (err) {
      toast.error('Erro ao consultar CNPJ', {
        description: err instanceof Error ? err.message : 'Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <Label htmlFor="cnpj-input" className="sr-only">CNPJ</Label>
          <Input
            id="cnpj-input"
            placeholder="00.000.000/0000-00"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            value={cnpj}
            onChange={(e) => setCnpj(formatCnpj(e.target.value))}
            maxLength={18}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          {loading ? 'Consultando...' : 'Consultar'}
        </Button>
      </form>

      {result && (
        <div className="space-y-2 text-white/90 p-4 rounded-lg bg-white/10 text-sm">
          <p><strong>CNPJ:</strong> {formatCnpj(result.cnpj)}</p>
          <p><strong>Razão Social:</strong> {result.razao_social}</p>
          <p><strong>Nome Fantasia:</strong> {result.nome_fantasia || '—'}</p>
          <p>
            <strong>Endereço:</strong>{' '}
            {`${result.logradouro}, ${result.numero}${result.complemento ? ` ${result.complemento}` : ''} — ${result.bairro}, ${result.municipio}/${result.uf}`}
          </p>
          <p><strong>Atividade Principal:</strong> {result.cnae_fiscal_descricao}</p>
          <p>
            <strong>Capital Social:</strong>{' '}
            {Number(result.capital_social).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </p>
        </div>
      )}
    </div>
  );
}
