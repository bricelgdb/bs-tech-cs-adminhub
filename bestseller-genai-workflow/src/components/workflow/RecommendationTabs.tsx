import { useState } from 'react';
import { Star, Zap, TrendingDown, Clock, DollarSign, Award } from 'lucide-react';
import { AlternativeRoute } from '../../types';
import { getToolById } from '../../data/tools';
import { cn } from '../../utils/cn';

interface RecommendationTabsProps {
  routes: AlternativeRoute[];
}

const tabIcons = {
  'Best Quality': Star,
  'Fastest': Zap,
  'Lowest Cost': TrendingDown,
};

const tabColors = {
  'Best Quality': { active: 'border-gold text-gold bg-gold-pale', dot: 'bg-gold' },
  'Fastest': { active: 'border-blue-500 text-blue-600 bg-blue-50', dot: 'bg-blue-500' },
  'Lowest Cost': { active: 'border-emerald-500 text-emerald-600 bg-emerald-50', dot: 'bg-emerald-500' },
};

export default function RecommendationTabs({ routes }: RecommendationTabsProps) {
  const [active, setActive] = useState<AlternativeRoute['label']>('Best Quality');
  const current = routes.find(r => r.label === active) ?? routes[0];

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {routes.map(route => {
          const Icon = tabIcons[route.label];
          const colors = tabColors[route.label];
          const isActive = route.label === active;
          return (
            <button
              key={route.label}
              onClick={() => setActive(route.label)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150',
                isActive ? colors.active : 'border-border text-text-secondary bg-white hover:border-gold/40 hover:text-text-primary',
              )}
            >
              <Icon size={14} />
              {route.label}
            </button>
          );
        })}
      </div>
      {current && (
        <div className="card p-5 animate-fade-in">
          <div className="flex items-start justify-between gap-6 mb-4">
            <div>
              <h3 className="font-serif text-lg font-semibold">{current.name}</h3>
              <p className="text-sm text-text-secondary mt-1 leading-relaxed max-w-xl">{current.description}</p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <div className="text-center">
                <div className="flex items-center gap-1 text-text-secondary text-xs mb-0.5"><DollarSign size={11} /> Cost</div>
                <div className="font-serif text-xl font-bold text-text-primary">${current.estimatedCost.toFixed(2)}</div>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <div className="flex items-center gap-1 text-text-secondary text-xs mb-0.5"><Clock size={11} /> Time</div>
                <div className="font-serif text-xl font-bold text-text-primary">
                  {current.estimatedTimeMinutes >= 60
                    ? `${Math.round(current.estimatedTimeMinutes / 60)}h`
                    : `${current.estimatedTimeMinutes}m`}
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <p className="label-luxury mb-2">Tools in This Route</p>
            <div className="flex flex-wrap gap-2">
              {current.tools.map(toolId => {
                const tool = getToolById(toolId);
                return (
                  <span key={toolId} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-surface border border-border text-text-secondary">
                    <Award size={10} className="text-gold" />
                    {tool?.name ?? toolId}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="bg-surface rounded-lg p-3 border border-border">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-1">Trade-offs</p>
            <p className="text-xs text-text-secondary leading-relaxed">{current.tradeoffs}</p>
          </div>
        </div>
      )}
    </div>
  );
}
