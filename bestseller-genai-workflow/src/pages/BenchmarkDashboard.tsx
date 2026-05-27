import { useState } from 'react';
import { Trophy, Filter, Download } from 'lucide-react';
import Header from '../components/layout/Header';
import BenchmarkTable from '../components/benchmark/BenchmarkTable';
import BenchmarkRadarChart from '../components/benchmark/BenchmarkRadarChart';
import ScoreBar from '../components/ui/ScoreBar';
import Badge from '../components/ui/Badge';
import GoldDivider from '../components/ui/GoldDivider';
import { benchmarkScores, getCompositeScore, benchmarkCriteria } from '../data/benchmarks';
import { approvedTools, getToolById } from '../data/tools';
import { WorkflowCategory } from '../types';
import { rankToolsForCategory } from '../utils/benchmarkEngine';
import { cn } from '../utils/cn';

const CATEGORIES: { value: WorkflowCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Use Cases' },
  { value: 'editorial-campaign', label: 'Editorial Campaign' },
  { value: 'ecommerce-imagery', label: 'E-Commerce' },
  { value: 'social-campaign', label: 'Social Media' },
  { value: 'video-concept', label: 'Video' },
  { value: 'market-localization', label: 'Localisation' },
  { value: 'batch-variation', label: 'Batch Variation' },
  { value: 'product-storytelling', label: 'Storytelling' },
];

const APPROVAL_COLORS = {
  approved: 'green' as const,
  evaluation: 'amber' as const,
  restricted: 'red' as const,
};

export default function BenchmarkDashboard() {
  const [category, setCategory] = useState<WorkflowCategory | 'all'>('all');

  const displayScores = category === 'all'
    ? benchmarkScores.map(s => ({ ...s, weightedScore: getCompositeScore(s) })).sort((a, b) => b.weightedScore - a.weightedScore)
    : rankToolsForCategory(category);

  const topTool = displayScores[0];
  const topToolData = topTool ? getToolById(topTool.toolId) : null;

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <Header
        title="Benchmark Dashboard"
        subtitle="Compare all approved GenAI Media tools across fashion-specific quality criteria"
        breadcrumb={['BESTSELLER GenAI Media', 'Benchmark']}
      />

      <div className="flex-1 px-8 py-8">
        {topToolData && (
          <div className="bg-charcoal rounded-xl p-6 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
                <Trophy size={18} className="text-charcoal" />
              </div>
              <div>
                <p className="text-gold text-[10px] font-bold uppercase tracking-widest">Top Ranked — {CATEGORIES.find(c => c.value === category)?.label}</p>
                <h3 className="font-serif text-xl font-semibold text-white">{topToolData.name}</h3>
                <p className="text-white/50 text-xs">{topToolData.vendor} · Fashion Score: {topToolData.fashionScore}/10</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {benchmarkCriteria.slice(0, 4).map(c => {
                const val = topTool[c.key as keyof typeof topTool] as number;
                return (
                  <div key={c.key} className="text-center">
                    <p className="text-white/40 text-[10px] mb-1">{c.label}</p>
                    <p className="font-serif text-lg font-bold text-gold">{val.toFixed(1)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <Filter size={14} className="text-muted" />
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full border font-medium transition-all',
                category === cat.value
                  ? 'bg-charcoal text-white border-charcoal'
                  : 'bg-white text-text-secondary border-border hover:border-gold/40',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3 card overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="section-title">Full Comparison Table</h3>
                <p className="text-xs text-muted mt-0.5">Click column headers to sort · All scores out of 10</p>
              </div>
              <button className="btn-outline text-xs">
                <Download size={12} /> Export CSV
              </button>
            </div>
            <BenchmarkTable scores={displayScores} />
          </div>

          <div className="col-span-2 card p-5">
            <h3 className="section-title mb-1">Top 4 Tools — Radar Comparison</h3>
            <p className="text-xs text-muted mb-4">Multi-axis benchmark across all criteria</p>
            <BenchmarkRadarChart scores={displayScores.slice(0, 4)} />
          </div>

          <div className="card p-5">
            <h3 className="section-title mb-4">Tool Spotlight</h3>
            <div className="space-y-3">
              {displayScores.slice(0, 5).map((score, idx) => {
                const tool = getToolById(score.toolId);
                if (!tool) return null;
                const composite = getCompositeScore(score);
                return (
                  <div key={score.toolId} className="p-3 rounded-lg bg-surface border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted w-4">#{idx + 1}</span>
                        <span className="text-sm font-semibold text-text-primary">{tool.name}</span>
                        <Badge variant={APPROVAL_COLORS[tool.approvalStatus]} size="sm">
                          {tool.approvalStatus}
                        </Badge>
                      </div>
                      <span className="font-serif text-lg font-bold text-text-primary">{composite.toFixed(1)}</span>
                    </div>
                    <ScoreBar score={composite} size="sm" showLabel={false} />
                    <p className="text-[10px] text-muted mt-1.5 line-clamp-2">{tool.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-span-3 card p-5">
            <h3 className="section-title mb-4">Criterion-by-Criterion Breakdown</h3>
            <div className="grid grid-cols-3 gap-6">
              {benchmarkCriteria.map(criterion => {
                const sorted = [...displayScores]
                  .sort((a, b) => {
                    const av = a[criterion.key as keyof typeof a] as number;
                    const bv = b[criterion.key as keyof typeof b] as number;
                    return bv - av;
                  })
                  .slice(0, 4);

                const winner = sorted[0];
                const winnerTool = winner ? getToolById(winner.toolId) : null;

                return (
                  <div key={criterion.key} className="p-4 bg-surface rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{criterion.label}</p>
                        <p className="text-[10px] text-muted">{criterion.description}</p>
                      </div>
                      {winnerTool && (
                        <div className="text-right">
                          <p className="text-[10px] text-gold font-semibold">{winnerTool.name}</p>
                          <p className="font-bold text-text-primary">{(winner[criterion.key as keyof typeof winner] as number).toFixed(1)}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {sorted.map(s => {
                        const tool = getToolById(s.toolId);
                        const val = s[criterion.key as keyof typeof s] as number;
                        return (
                          <div key={s.toolId} className="flex items-center gap-2">
                            <span className="text-[10px] text-muted w-24 truncate">{tool?.name}</span>
                            <ScoreBar score={val} size="sm" className="flex-1" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
