import { cn } from '../../utils/cn';

interface GoldDividerProps {
  label?: string;
  className?: string;
}

export default function GoldDivider({ label, className }: GoldDividerProps) {
  if (!label) {
    return <div className={cn('h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent my-6', className)} />;
  }
  return (
    <div className={cn('flex items-center gap-4 my-6', className)}>
      <div className="flex-1 h-px bg-border" />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
