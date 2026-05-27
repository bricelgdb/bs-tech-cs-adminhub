import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'green' | 'amber' | 'red' | 'blue' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  gold: 'bg-gold-pale text-[#8B6914] border border-gold/30',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border border-amber-200',
  red: 'bg-red-50 text-red-600 border border-red-200',
  blue: 'bg-blue-50 text-blue-700 border border-blue-200',
  neutral: 'bg-surface text-text-secondary border border-border',
  outline: 'bg-transparent text-text-secondary border border-border',
};

const sizeStyles = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

export default function Badge({ children, variant = 'neutral', size = 'md', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center font-semibold uppercase tracking-wide rounded-full', variantStyles[variant], sizeStyles[size], className)}>
      {children}
    </span>
  );
}
