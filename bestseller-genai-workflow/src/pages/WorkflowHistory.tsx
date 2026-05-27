import { useState } from 'react';
import { Search, Clock, DollarSign, ExternalLink } from 'lucide-react';
import Header from '../components/layout/Header';
import Badge from '../components/ui/Badge';
import { WorkflowHistoryEntry, BrandName, WorkflowCategory } from '../types';
import { format, subDays, subHours } from 'date-fns';
import { cn } from '../utils/cn';

const CATEGORY_LABELS: Record<WorkflowCategory, string> = {
  'social-campaign': 'Social Campaign',
  'ecommerce-imagery': 'E-Commerce',
  'video-concept': 'Video',
  'market-localization': 'Localisation',
  'editorial-campaign': 'Editorial',
  'batch-variation': 'Batch Variation',
  'product-storytelling': 'Storytelling',
};

const MOCK_HISTORY: WorkflowHistoryEntry[] = [
  {
    id: 'wf-001',
    userInput: 'Create localized social assets for a JACK & JONES denim campaign across Spain and France',
    brand: 'JACK & JONES',
    markets: ['Spain', 'France'],
    assetTypes: ['social', 'image'],
    createdAt: subHours(new Date(), 2).toISOString(),
    totalCost: 42.80,
    status: 'completed',
    category: 'social-campaign',
  },
  {
    id: 'wf-002',
    userInput: 'Generate e-commerce product images for ONLY SS25 collection — 80 SKUs',
    brand: 'ONLY',
    markets: ['Global'],
    assetTypes: ['ecom', 'image'],
    createdAt: subHours(new Date(), 6).toISOString(),
    totalCost: 118.50,
    status: 'completed',
    category: 'ecommerce-imagery',
  },
  {
    id: 'wf-003',
    userInput: 'Create short AI video concepts from VERO MODA campaign stills for TikTok',
    brand: 'VERO MODA',
    markets: ['Global'],
    assetTypes: ['video', 'social'],
    createdAt: subDays(new Date(), 1).toISOString(),
    totalCost: 87.20,
    status: 'completed',
    category: 'video-concept',
  },
  {
    id: 'wf-004',
    userInput: 'Adapt Selected Homme FW25 campaign for Norway, Sweden and Denmark',
    brand: 'Selected Homme',
    markets: ['Norway', 'Sweden', 'Denmark'],
    assetTypes: ['campaign', 'localization'],
    createdAt: subDays(new Date(), 2).toISOString(),
    totalCost: 156.40,
    status: 'completed',
    category: 'market-localization',
  },
  {
    id: 'wf-005',
    userInput: 'Build full editorial campaign for PIECES SS25 accessories launch',
    brand: 'Pieces',
    markets: ['Global'],
    assetTypes: ['campaign', 'image', 'social'],
    createdAt: subDays(new Date(), 3).toISOString(),
    totalCost: 234.00,
    status: 'draft',
    category: 'editorial-campaign',
  },
  {
    id: 'wf-006',
    userInput: 'Generate 200 product image variations for Name It kidswear catalogue',
    brand: 'Name It',
    markets: ['Denmark', 'Germany', 'UK'],
    assetTypes: ['ecom', 'image'],
    createdAt: subDays(new Date(), 5).toISOString(),
    totalCost: 89.60,
    status: 'completed',
    category: 'batch-variation',
  },
  {
    id: 'wf-007',
    userInput: 'Create product storytelling lookbook for JACK & JONES Premium denim',
    brand: 'JACK & JONES',
    markets: ['Global'],
    assetTypes: ['campaign', 'image'],
    createdAt: subDays(new Date(), 7).toISOString(),
    totalCost: 67.30,
    status: 'completed',
    category: 'product-storytelling',
  },
];

const ASSET_LABELS: Record<string, string> = {
  image: 'Image', video: 'Video', social: 'Social', ecom: 'E-com', campaign: 'Campaign', localization: 'Localisation',
};

export default function WorkflowHistory() {
  const [search, setSearch] = useState('');
  const [history] = useState<WorkflowHistoryEntry[]>(MOCK_HISTORY);

  const filtered = history.filter(entry => {
    if (!search) return true;
    return (
      entry.userInput.toLowerCase().includes(search.toLowerCase()) ||
      entry.brand.toLowerCase().includes(search.toLowerCase()) ||
      entry.markets.some(m => m.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const totalSpend = history.filter(h => h.status === 'completed').reduce((sum, h) => sum + h.totalCost, 0);
  const thisWeek = history.filter(h => new Date(h.createdAt) > subDays(new Date(), 7));

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <Header
        title="Workflow History"
        subtitle="All analysed and generated workflows for your team"
        breadcrumb={['BESTSELLER GenAI Media', 'History']}
      />

      <div className="flex-1 px-8 py-8">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Workflows', value: history.length, suffix: '' },
            { label: 'This Week', value: thisWeek.length, suffix: '' },
            { label: 'Completed', value: history.filter(h => h.status === 'completed').length, suffix: '' },
            { label: 'Total AI Spend', value: totalSpend, suffix: '$', prefix: true },
          ].map(stat => (
            <div key={stat.label} className="card p-4 text-center">
              <p className="font-serif text-3xl font-bold text-text-primary">
                {stat.prefix ? `$${stat.value.toFixed(0)}` : stat.value}
              </p>
              <p className="text-xs text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="relative mb-5 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search workflows…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-luxury pl-9 py-2"
          />
        </div>

        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                {['Date', 'Use Case', 'Brand', 'Markets', 'Asset Types', 'Category', 'Cost', 'Status', ''].map(col => (
                  <th key={col} className="text-left py-3 px-4 label-luxury">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => (
                <tr
                  key={entry.id}
                  className={cn(
                    'border-b border-border/50 hover:bg-gold-pale/10 transition-colors',
                    i % 2 === 0 ? 'bg-white' : 'bg-ivory/40',
                  )}
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <Clock size={10} />
                      {format(new Date(entry.createdAt), 'MMM d, HH:mm')}
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="text-sm text-text-primary leading-snug line-clamp-2">{entry.userInput}</p>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-xs font-semibold text-text-primary">{entry.brand}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {entry.markets.slice(0, 2).map(m => (
                        <span key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-muted">{m}</span>
                      ))}
                      {entry.markets.length > 2 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-muted">+{entry.markets.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {entry.assetTypes.map(at => (
                        <span key={at} className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold-pale text-[#8B6914] border border-gold/20">
                          {ASSET_LABELS[at]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-xs text-muted">{CATEGORY_LABELS[entry.category]}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm font-semibold text-text-primary">
                      <DollarSign size={11} className="text-muted" />
                      {entry.totalCost.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={entry.status === 'completed' ? 'green' : 'neutral'} size="sm">
                      {entry.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded hover:bg-surface text-muted hover:text-gold transition-colors">
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted text-sm">No workflows match your search.</div>
          )}
        </div>
      </div>
    </div>
  );
}
