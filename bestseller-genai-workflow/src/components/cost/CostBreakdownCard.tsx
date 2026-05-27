import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { CostScenario } from '../../types';
import { getToolById } from '../../data/tools';
import { cn } from '../../utils/cn';

interface CostBreakdownCardProps {
  scenario: CostScenario;
  isRecommended?: boolean;
}

const SCENARIO_CONFIG = {
  Low: { icon: TrendingDown, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  Medium: { icon: Minus, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  High: { icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
};

export default function CostBreakdownCard({ scenario, isRecommended }: CostBreakdownCardProps) {
  const config = SCENARIO_CONFIG[scenario.label];
  const Icon = config.icon;
  const maxCost = Math.max(...scenario.details.map(d => d.cost));

  return (
    <div className={cn('card p-5 relative', isRecommended ? 'ring-1 ring-gold shadow-gold' : '')}>
      {isRecommended && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          <span className="bg-gold text-charcoal text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full">
            Recommended
          </span>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', config.bg)}>
            <Icon size={14} className={config.color} />
          </div>
          <div>
            <p className="font-semibold text-text-primary text-sm">{scenario.label} Usage</p>
            <p className="text-[10px] text-muted">{scenario.volumeDescription}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-serif text-2xl font-bold text-text-primary">${scenario.totalCost.toFixed(2)}</p>
          <p className="text-[10px] text-muted">USD / run</p>
        </div>
      </div>
      <div className="space-y-2">
        {scenario.details.slice(0, 6).map((detail, i) => {
          const tool = getToolById(detail.tool);
          const pct = maxCost > 0 ? (detail.cost / maxCost) * 100 : 0;
          return (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-text-secondary w-28 truncate flex-shrink-0">{tool?.name ?? detail.tool}</span>
              <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full', config.bg.replace('bg-', 'bg-').replace('-50', '-400'))}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-mono text-text-secondary w-14 text-right flex-shrink-0">
                ${detail.cost.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
