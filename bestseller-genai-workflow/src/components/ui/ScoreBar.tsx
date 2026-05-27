import { cn } from '../../utils/cn';

interface ScoreBarProps {
  score: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

function getBarColor(score: number, max: number): string {
  const pct = score / max;
  if (pct >= 0.85) return 'bg-emerald-500';
  if (pct >= 0.70) return 'bg-blue-500';
  if (pct >= 0.55) return 'bg-amber-500';
  return 'bg-red-400';
}

function getTextColor(score: number, max: number): string {
  const pct = score / max;
  if (pct >= 0.85) return 'text-emerald-600';
  if (pct >= 0.70) return 'text-blue-600';
  if (pct >= 0.55) return 'text-amber-600';
  return 'text-red-500';
}

export default function ScoreBar({ score, max = 10, showLabel = true, size = 'md', className }: ScoreBarProps) {
  const pct = Math.min(100, (score / max) * 100);
  const barColor = getBarColor(score, max);
  const textColor = getTextColor(score, max);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 bg-surface rounded-full overflow-hidden', size === 'sm' ? 'h-1' : 'h-1.5')}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn('font-semibold tabular-nums flex-shrink-0', textColor, size === 'sm' ? 'text-xs w-6' : 'text-sm w-7')}>
          {score.toFixed(1)}
        </span>
      )}
    </div>
  );
}
