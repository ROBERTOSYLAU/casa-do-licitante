import * as React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'secondary' }) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold',
        variant === 'default' && 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200',
        variant === 'secondary' && 'border-white/15 bg-white/8 text-white/75',
        className,
      )}
      {...props}
    />
  );
}
