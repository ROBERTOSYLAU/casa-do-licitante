import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
};

export function Button({
  asChild,
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-60',
        variant === 'default' && 'bg-blue-600 text-white hover:bg-blue-500',
        variant === 'outline' && 'border border-white/20 bg-transparent text-white hover:bg-white/10',
        variant === 'ghost' && 'bg-transparent text-white hover:bg-white/10',
        variant === 'secondary' && 'bg-slate-800 text-white hover:bg-slate-700',
        size === 'default' && 'px-4 py-2 text-sm',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        size === 'icon' && 'h-10 w-10 p-0',
        className,
      )}
      {...props}
    />
  );
}
