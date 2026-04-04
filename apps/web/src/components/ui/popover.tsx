import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export function PopoverContent({
  className,
  sideOffset = 8,
  align = 'start',
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
  sideOffset?: number;
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        align={align}
        collisionPadding={16}
        className={cn(
          'z-[120] w-auto max-w-[calc(100vw-2rem)] overflow-visible rounded-xl border border-slate-700 bg-slate-900 p-3 text-white shadow-2xl',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
