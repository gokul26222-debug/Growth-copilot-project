import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'amber' | 'red' | 'gray';
  className?: string;
}

const variants = {
  blue: 'bg-[#E6F1FB] text-[#185FA5]',
  green: 'bg-[#E1F5EE] text-[#0F6E56]',
  amber: 'bg-[#FAEEDA] text-[#BA7517]',
  red: 'bg-[#FCEBEB] text-[#A32D2D]',
  gray: 'bg-[#F1EFE8] text-[#5F5E5A]',
};

export function Badge({ children, variant = 'blue', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-lg',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
