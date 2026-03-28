'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

function formatCep(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 8);
  return d.replace(/(\d{5})(\d)/, '$1-$2');
}

interface CepData {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export default function CepSearch() {
  const [cep, setCep] = useState('');
  const [result, setResult] = useState<CepData | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const raw = cep.replace(/\D/g, '');
    if (raw.length !== 8) {
      toast.error('CEP inválido', { description: 'Digite 8 dígitos.' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/ferramentas/cep?cep=${raw}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erro desconhecido');
      setResult(data as CepData);
    } catch (err) {
      toast.error('Erro ao consultar CEP', {
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
          <Label htmlFor="cep-input" className="sr-only">CEP</Label>
          <Input
            id="cep-input"
            placeholder="00000-000"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            value={cep}
            onChange={(e) => setCep(formatCep(e.target.value))}
            maxLength={9}
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
          <p><strong>CEP:</strong> {formatCep(result.cep)}</p>
          <p><strong>Logradouro:</strong> {result.street}</p>
          <p><strong>Bairro:</strong> {result.neighborhood}</p>
          <p><strong>Cidade:</strong> {result.city}</p>
          <p><strong>Estado:</strong> {result.state}</p>
        </div>
      )}
    </div>
  );
}
