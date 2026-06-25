'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium transition-opacity rounded-lg disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-[#185FA5] text-white hover:opacity-90',
      secondary: 'bg-transparent border border-[#D3D1C7] text-[#5F5E5A] hover:bg-[#F1EFE8]',
      danger: 'bg-[#A32D2D] text-white hover:opacity-90',
    };

    const sizes = {
      sm: 'text-[12px] px-3 py-1.5',
      md: 'text-[13px] px-6 py-2.5',
      lg: 'text-[14px] px-8 py-3',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
