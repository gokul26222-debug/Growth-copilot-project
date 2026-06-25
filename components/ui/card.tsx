import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ className, padding = 'md', children, ...props }: CardProps) {
  const paddings = { sm: 'p-3', md: 'p-5', lg: 'p-6' };

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-[#D3D1C7]',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
