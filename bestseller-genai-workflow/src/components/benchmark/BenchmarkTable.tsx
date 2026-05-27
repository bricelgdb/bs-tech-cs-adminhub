import { useState } from 'react';
import { ArrowUp, ArrowDown, Trophy } from 'lucide-react';
import { BenchmarkScore } from '../../types';
import { benchmarkCriteria, getCompositeScore } from '../../data/benchmarks';
import { getToolById } from '../../data/tools';
import ScoreBar from '../ui/ScoreBar';
import { cn } from '../../utils/cn';

interface BenchmarkTableProps {
  scores: BenchmarkScore[];
  highlightToolId?: string;
}

type SortKey = 'composite' | keyof BenchmarkScore;

function getScoreBg(score: number): string {
  if (score >= 8.5) return 'bg-emerald-50 text-emerald-700';
  if (score >= 7.0) return 'bg-blue-50 text-blue-700';
  if (score >= 5.5) return 'bg-amber-50 text-amber-700';
  return 'bg-red-50 text-red-600';
}

export default function BenchmarkTable({ scores, highlightToolId }: BenchmarkTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('composite');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  const withComposite = scores.map(s => ({ ...s, composite: getCompositeScore(s) }));

  const sorted = [...withComposite].sort((a, b) => {
    const av = a[sortKey as keyof typeof a] as number ?? 0;
    const bv = b[sortKey as keyof typeof b] as number ?? 0;
    return sortDir === 'desc' ? bv - av : av - bv;
  });

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const topToolId = sorted[0]?.toolId;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 label-luxury font-semibold whitespace-nowrap w-40">Tool</th>
            <th
              className="text-center py-3 px-3 label-luxury font-semibold cursor-pointer hover:text-gold whitespace-nowrap"
              onClick={() => handleSort('composite')}
            >
              <span className="flex items-center justify-center gap-1">
                Overall
                {sortKey === 'composite' && (sortDir === 'desc' ? <ArrowDown size={10} /> : <ArrowUp size={10} />)}
              </span>
            </th>
            {benchmarkCriteria.map(c => (
              <th
                key={c.key}
                className="text-center py-3 px-3 label-luxury font-semibold cursor-pointer hover:text-gold whitespace-nowrap"
                onClick={() => handleSort(c.key as SortKey)}
                title={c.description}
              >
                <span className="flex items-center justify-center gap-1">
                  {c.label.split(' ').map((w, i) => i === 0 ? w : <br key={i} />)}
                  {sortKey === c.key && (sortDir === 'desc' ? <ArrowDown size={10} /> : <ArrowUp size={10} />)}
                </span>
              </th>
            ))}
            <th className="text-center py-3 px-3 label-luxury font-semibold whitespace-nowrap">$/Gen</th>
            <th className="text-center py-3 px-3 label-luxury font-semibold whitespace-nowrap">Speed</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((score, idx) => {
            const tool = getToolById(score.toolId);
            const isTop = score.toolId === topToolId;
            const isHighlighted = score.toolId === highlightToolId;
            return (
              <tr
                key={score.toolId}
                className={cn(
                  'border-b border-border/50 transition-colors',
                  isHighlighted ? 'bg-gold-pale/50' : idx % 2 === 0 ? 'bg-white' : 'bg-ivory/60',
                  'hover:bg-gold-pale/20',
                )}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {isTop && <Trophy size={12} className="text-gold flex-shrink-0" />}
                    <span className="font-semibold text-text-primary text-xs truncate">{tool?.name ?? score.toolId}</span>
                  </div>
                  <span className="text-[10px] text-muted">{tool?.vendor}</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={cn('text-sm font-bold px-2 py-0.5 rounded', getScoreBg(score.composite))}>
                    {score.composite.toFixed(1)}
                  </span>
                </td>
                {benchmarkCriteria.map(c => {
                  const val = score[c.key as keyof BenchmarkScore] as number;
                  return (
                    <td key={c.key} className="py-3 px-3 text-center">
                      <span className={cn('text-xs font-semibold px-1.5 py-0.5 rounded tabular-nums', getScoreBg(val))}>
                        {val.toFixed(1)}
                      </span>
                    </td>
                  );
                })}
                <td className="py-3 px-3 text-center text-xs font-mono text-text-secondary">
                  ${score.costPerGeneration.toFixed(3)}
                </td>
                <td className="py-3 px-3 text-center text-xs text-text-secondary">
                  {score.generationSpeedSeconds >= 60
                    ? `${Math.round(score.generationSpeedSeconds / 60)}m`
                    : `${score.generationSpeedSeconds}s`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex gap-4 mt-3 px-4 pb-2">
        {[
          { label: 'Excellent (8.5+)', color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Good (7.0–8.4)', color: 'bg-blue-50 text-blue-700' },
          { label: 'Fair (5.5–6.9)', color: 'bg-amber-50 text-amber-700' },
          { label: 'Poor (<5.5)', color: 'bg-red-50 text-red-600' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded', l.color)}>9.0</span>
            <span className="text-[10px] text-muted">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
