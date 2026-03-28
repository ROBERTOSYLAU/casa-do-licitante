import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format centavos (integer) to BRL string. */
export function formatBRL(centavos: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(centavos / 100);
}

/** Parse a BRL currency string into centavos integer. */
export function parseBRL(value: string): number {
  const clean = value.replace(/[^\d,]/g, '').replace(',', '.');
  return Math.round(parseFloat(clean) * 100);
}
