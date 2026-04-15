'use client';

import { useMemo, useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatBRL } from '@/lib/utils';

const USD_BRL = 5.4;
const EUR_BRL = 5.95;

function formatForeign(value: number, currency: 'USD' | 'EUR') {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value);
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1000');
  const [mode, setMode] = useState<'BRL_TO_USD' | 'BRL_TO_EUR' | 'USD_TO_BRL' | 'EUR_TO_BRL'>('BRL_TO_USD');

  const numericAmount = Number(amount.replace(',', '.')) || 0;

  const result = useMemo(() => {
    switch (mode) {
      case 'BRL_TO_USD':
        return formatForeign(numericAmount / USD_BRL, 'USD');
      case 'BRL_TO_EUR':
        return formatForeign(numericAmount / EUR_BRL, 'EUR');
      case 'USD_TO_BRL':
        return formatBRL(Math.round(numericAmount * USD_BRL * 100));
      case 'EUR_TO_BRL':
        return formatBRL(Math.round(numericAmount * EUR_BRL * 100));
    }
  }, [mode, numericAmount]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/60">
        Conversão rápida para referência comercial. Use como apoio inicial, não como cotação oficial de fechamento.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label className="text-white/80">Valor</Label>
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="1000"
            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30"
          />
        </div>

        <div>
          <Label className="text-white/80">Conversão</Label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {[
              ['BRL_TO_USD', 'BRL → USD'],
              ['BRL_TO_EUR', 'BRL → EUR'],
              ['USD_TO_BRL', 'USD → BRL'],
              ['EUR_TO_BRL', 'EUR → BRL'],
            ].map(([value, label]) => (
              <Button
                key={value}
                type="button"
                variant={mode === value ? 'default' : 'outline'}
                onClick={() => setMode(value as typeof mode)}
                className={mode === value ? 'bg-emerald-500 hover:bg-emerald-400 text-white' : 'border-white/20 text-white/80 hover:bg-white/10'}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <ArrowRightLeft className="h-4 w-4 text-emerald-300" />
          Resultado estimado
        </div>
        <div className="mt-2 text-2xl font-bold text-white">{result}</div>
        <p className="mt-2 text-xs text-white/45">Referência usada nesta versão: USD {USD_BRL.toFixed(2)} e EUR {EUR_BRL.toFixed(2)} por BRL.</p>
      </div>
    </div>
  );
}
