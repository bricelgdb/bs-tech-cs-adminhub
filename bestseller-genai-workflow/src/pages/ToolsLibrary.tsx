import { useState } from 'react';
import { Search, ExternalLink, CheckCircle, AlertTriangle, XCircle, Star, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/layout/Header';
import Badge from '../components/ui/Badge';
import ScoreBar from '../components/ui/ScoreBar';
import GoldDivider from '../components/ui/GoldDivider';
import { approvedTools } from '../data/tools';
import { benchmarkScores, getCompositeScore } from '../data/benchmarks';
import { Tool } from '../types';
import { cn } from '../utils/cn';

const CATEGORY_LABELS: Record<Tool['category'], string> = {
  'image-generation': 'Image Generation',
  'video-generation': 'Video Generation',
  'editing': 'Editing & Production',
  'collaboration': 'Collaboration',
  'asset-management': 'Asset Management',
  'text-ai': 'Text & Copy AI',
};

const APPROVAL_ICONS = {
  approved: CheckCircle,
  evaluation: AlertTriangle,
  restricted: XCircle,
};

const APPROVAL_COLORS: Record<Tool['approvalStatus'], 'green' | 'amber' | 'red'> = {
  approved: 'green',
  evaluation: 'amber',
  restricted: 'red',
};

export default function ToolsLibrary() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Tool['category'] | 'all'>('all');
  const [approvalFilter, setApprovalFilter] = useState<Tool['approvalStatus'] | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = approvedTools.filter(t => {
    const matchesSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.vendor.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.includes(search.toLowerCase()));
    const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesApproval = approvalFilter === 'all' || t.approvalStatus === approvalFilter;
    return matchesSearch && matchesCat && matchesApproval;
  });

  const categories = [...new Set(approvedTools.map(t => t.category))];

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <Header
        title="Approved Tools Library"
        subtitle="All BESTSELLER-approved GenAI Media tools with capabilities, pricing, and benchmark scores"
        breadcrumb={['BESTSELLER GenAI Media', 'Tools']}
      />

      <div className="flex-1 px-8 py-8">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Approved Tools', value: approvedTools.filter(t => t.approvalStatus === 'approved').length, color: 'text-emerald-600' },
            { label: 'Under Evaluation', value: approvedTools.filter(t => t.approvalStatus === 'evaluation').length, color: 'text-amber-600' },
            { label: 'Categories', value: categories.length, color: 'text-blue-600' },
            { label: 'Commercially Safe', value: approvedTools.filter(t => t.commercialSafe).length, color: 'text-gold' },
          ].map(stat => (
            <div key={stat.label} className="card p-4 text-center">
              <p className={cn('font-serif text-3xl font-bold', stat.color)}>{stat.value}</p>
              <p className="text-xs text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mb-6 flex-wrap items-center">
          <div className="relative flex-1 min-w-48 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search tools…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-luxury pl-9 py-2"
            />
          </div>

          <div className="flex gap-1 flex-wrap">
            {(['all', ...categories] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full border font-medium transition-all',
                  categoryFilter === cat
                    ? 'bg-charcoal text-white border-charcoal'
                    : 'bg-white text-text-secondary border-border hover:border-gold/40',
                )}
              >
                {cat === 'all' ? 'All' : CATEGORY_LABELS[cat as Tool['category']]}
              </button>
            ))}
          </div>

          <div className="flex gap-1">
            {(['all', 'approved', 'evaluation'] as const).map(status => (
              <button
                key={status}
                onClick={() => setApprovalFilter(status)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full border font-medium transition-all',
                  approvalFilter === status
                    ? 'bg-charcoal text-white border-charcoal'
                    : 'bg-white text-text-secondary border-border hover:border-gold/40',
                )}
              >
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map(tool => {
            const ApprovalIcon = APPROVAL_ICONS[tool.approvalStatus];
            const benchScore = benchmarkScores.find(b => b.toolId === tool.id);
            const composite = benchScore ? getCompositeScore(benchScore) : null;
            const isExpanded = expandedId === tool.id;

            return (
              <div key={tool.id} className={cn('card overflow-hidden transition-shadow', isExpanded ? 'shadow-luxury-md' : '')}>
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : tool.id)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                      style={{ backgroundColor: tool.logoColor }}
                    >
                      {tool.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-serif text-lg font-semibold">{tool.name}</h3>
                        <span className="text-xs text-muted">{tool.vendor}</span>
                        <Badge variant={APPROVAL_COLORS[tool.approvalStatus]} size="sm">
                          <ApprovalIcon size={9} className="mr-0.5" />
                          {tool.approvalStatus}
                        </Badge>
                        <Badge variant="neutral" size="sm">{CATEGORY_LABELS[tool.category]}</Badge>
                        {tool.commercialSafe && (
                          <Badge variant="green" size="sm">
                            <CheckCircle size={9} className="mr-0.5" />
                            IP Safe
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">{tool.description}</p>
                    </div>

                    <div className="flex items-center gap-5 flex-shrink-0">
                      {composite !== null && (
                        <div className="text-center">
                          <div className="flex items-center gap-1 mb-0.5">
                            <Star size={10} className="text-gold" />
                            <span className="text-[10px] text-muted">Overall</span>
                          </div>
                          <p className="font-serif text-xl font-bold text-text-primary">{composite.toFixed(1)}</p>
                        </div>
                      )}
                      <div className="text-center">
                        <p className="text-[10px] text-muted mb-0.5">Fashion</p>
                        <p className="font-serif text-xl font-bold text-gold">{tool.fashionScore}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted mb-0.5">Pricing</p>
                        <p className="text-xs font-semibold text-text-primary">
                          {tool.basePrice === 0 ? 'Free tier' : `$${tool.basePrice}`}
                        </p>
                        <p className="text-[10px] text-muted">{tool.priceUnit.split(' ').slice(0, 2).join(' ')}</p>
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border p-5 bg-ivory/50 animate-fade-in">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="label-luxury mb-2">Capabilities</p>
                        <ul className="space-y-1">
                          {tool.capabilities.map(cap => (
                            <li key={cap} className="text-xs text-text-secondary flex items-start gap-1.5">
                              <CheckCircle size={10} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                              {cap}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="label-luxury mb-2">Limitations</p>
                        <ul className="space-y-1">
                          {tool.limitations.map(lim => (
                            <li key={lim} className="text-xs text-text-secondary flex items-start gap-1.5">
                              <AlertTriangle size={10} className="text-amber-500 mt-0.5 flex-shrink-0" />
                              {lim}
                            </li>
                          ))}
                        </ul>
                        <GoldDivider className="my-3" />
                        <p className="label-luxury mb-2">Integrations</p>
                        <div className="flex flex-wrap gap-1">
                          {tool.integrations.map(int => (
                            <span key={int} className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-muted">{int}</span>
                          ))}
                        </div>
                      </div>

                      {benchScore && (
                        <div>
                          <p className="label-luxury mb-2">Benchmark Scores</p>
                          <div className="space-y-2">
                            {[
                              { label: 'Output Quality', value: benchScore.outputQuality },
                              { label: 'Fashion Realism', value: benchScore.fashionRealism },
                              { label: 'Brand Consistency', value: benchScore.brandConsistency },
                              { label: 'Ease of Use', value: benchScore.easeOfUse },
                              { label: 'Commercial Safety', value: benchScore.commercialSafety },
                              { label: 'BESTSELLER Fit', value: benchScore.bestsellerFit },
                            ].map(row => (
                              <div key={row.label} className="flex items-center gap-2">
                                <span className="text-[10px] text-muted w-28 flex-shrink-0">{row.label}</span>
                                <ScoreBar score={row.value} size="sm" className="flex-1" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {tool.approvalStatus === 'evaluation' && (
                      <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-700 flex items-start gap-2">
                        <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                        <span>This tool is currently under BESTSELLER evaluation. Do not use for production campaigns until full approval is granted. Contact TECH Creative Solutions for evaluation status.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
