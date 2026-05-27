import { useState, useMemo } from 'react';
import { Calculator, RefreshCw, DollarSign, TrendingUp, Info } from 'lucide-react';
import Header from '../components/layout/Header';
import Badge from '../components/ui/Badge';
import GoldDivider from '../components/ui/GoldDivider';
import { pricingData, getPricingForTool } from '../data/pricing';
import { approvedTools } from '../data/tools';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '../utils/cn';

type ViewMode = 'monthly' | 'annual';

const TOOL_IDS = ['adobe-firefly', 'adobe-express', 'midjourney', 'dalle3', 'runway-gen3', 'chatgpt4o'];

interface ToolUsage {
  toolId: string;
  unitsPerDay: number;
  enabled: boolean;
}

interface CostRow {
  toolId: string;
  toolName: string;
  vendor: string;
  planName: string;
  subscriptionCost: number;
  unitCost: number;
  monthlyTotal: number;
  annualTotal: number;
  perUnit: number;
  enabled: boolean;
}

export default function CostEstimator() {
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [teamSize, setTeamSize] = useState(5);
  const [marketsCount, setMarketsCount] = useState(3);
  const [imagesPerCampaign, setImagesPerCampaign] = useState(50);
  const [videosPerCampaign, setVideosPerCampaign] = useState(10);
  const [campaignsPerMonth, setCampaignsPerMonth] = useState(2);
  const [lastRefreshed] = useState(new Date());

  const usages: ToolUsage[] = useMemo(() => [
    { toolId: 'adobe-express', unitsPerDay: 10, enabled: true },
    { toolId: 'adobe-firefly', unitsPerDay: imagesPerCampaign * campaignsPerMonth / 22, enabled: true },
    { toolId: 'midjourney', unitsPerDay: imagesPerCampaign * 0.3 * campaignsPerMonth / 22, enabled: true },
    { toolId: 'dalle3', unitsPerDay: 5, enabled: false },
    { toolId: 'runway-gen3', unitsPerDay: videosPerCampaign * campaignsPerMonth / 22, enabled: true },
    { toolId: 'chatgpt4o', unitsPerDay: 20, enabled: true },
  ], [imagesPerCampaign, videosPerCampaign, campaignsPerMonth]);

  const costs = useMemo(() => {
    return TOOL_IDS.map(toolId => {
      const pricing = getPricingForTool(toolId);
      const tool = approvedTools.find(t => t.id === toolId);
      const usage = usages.find(u => u.toolId === toolId);
      if (!pricing || !tool || !usage) return null;

      const bestPlan = pricing.plans.find(p => p.recommendedFor.includes('BESTSELLER') || p.name === 'Pro' || p.name === 'Enterprise') ?? pricing.plans[0];

      const subscriptionCost = bestPlan.monthly * (tool.category === 'collaboration' ? 1 : teamSize);
      const unitCost = (bestPlan.perUnitCost ?? 0) * usage.unitsPerDay * 22;
      const monthlyTotal = usage.enabled ? subscriptionCost + unitCost : 0;

      return {
        toolId,
        toolName: tool.name,
        vendor: tool.vendor,
        planName: bestPlan.name,
        subscriptionCost,
        unitCost,
        monthlyTotal,
        annualTotal: monthlyTotal * 12,
        perUnit: bestPlan.perUnitCost ?? 0,
        enabled: usage.enabled,
      };
    }).filter((c): c is CostRow => c !== null);
  }, [usages, teamSize]);

  const totalMonthly = costs.filter(c => c.enabled).reduce((sum, c) => sum + c.monthlyTotal, 0);
  const totalAnnual = totalMonthly * 12;

  const chartData = costs.filter(c => c.enabled && c.monthlyTotal > 0).map(c => ({
    name: c.toolName.split(' ')[0],
    cost: viewMode === 'monthly' ? c.monthlyTotal : c.annualTotal,
  }));

  const CHART_COLORS = ['#C9A96E', '#6C5CE7', '#10A37F', '#31A8FF', '#8B5CF6', '#FF6B35'];

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <Header
        title="Cost Estimator"
        subtitle="Live cost modelling for GenAI Media production at BESTSELLER scale"
        breadcrumb={['BESTSELLER GenAI Media', 'Cost Estimator']}
      />

      <div className="flex-1 px-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          <div className="card p-5 h-fit">
            <div className="flex items-center gap-2 mb-4">
              <Calculator size={16} className="text-gold" />
              <h3 className="section-title text-base">Production Parameters</h3>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Team Size (users)', value: teamSize, setter: setTeamSize, min: 1, max: 50 },
                { label: 'Target Markets', value: marketsCount, setter: setMarketsCount, min: 1, max: 12 },
                { label: 'Images per Campaign', value: imagesPerCampaign, setter: setImagesPerCampaign, min: 10, max: 500 },
                { label: 'Videos per Campaign', value: videosPerCampaign, setter: setVideosPerCampaign, min: 0, max: 100 },
                { label: 'Campaigns per Month', value: campaignsPerMonth, setter: setCampaignsPerMonth, min: 1, max: 20 },
              ].map(({ label, value, setter, min, max }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="label-luxury">{label}</label>
                    <span className="text-sm font-bold text-text-primary">{value}</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={e => setter(Number(e.target.value))}
                    className="w-full accent-gold h-1.5 rounded"
                  />
                  <div className="flex justify-between text-[10px] text-muted mt-0.5">
                    <span>{min}</span><span>{max}</span>
                  </div>
                </div>
              ))}
            </div>

            <GoldDivider />

            <div className="flex items-center gap-1 text-xs text-muted">
              <RefreshCw size={10} />
              <span>Pricing updated: {format(lastRefreshed, 'HH:mm')} UTC</span>
            </div>
          </div>

          <div className="col-span-2 space-y-5">
            <div className="bg-charcoal rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gold text-[10px] font-bold uppercase tracking-widest">Estimated Investment</p>
                  <p className="text-white/50 text-xs mt-0.5">{teamSize} users · {campaignsPerMonth} campaigns/month · {marketsCount} markets</p>
                </div>
                <div className="flex gap-1">
                  {(['monthly', 'annual'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setViewMode(m)}
                      className={cn(
                        'text-xs px-3 py-1.5 rounded font-medium transition-all',
                        viewMode === m ? 'bg-gold text-charcoal' : 'text-white/50 hover:text-white',
                      )}
                    >
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-white/40 text-xs mb-1">Total {viewMode === 'monthly' ? 'Monthly' : 'Annual'}</p>
                  <p className="font-serif text-3xl font-bold text-gold">
                    ${(viewMode === 'monthly' ? totalMonthly : totalAnnual).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-1">Per Campaign</p>
                  <p className="font-serif text-2xl font-bold text-white">
                    ${(totalMonthly / campaignsPerMonth).toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-1">Per Final Asset</p>
                  <p className="font-serif text-2xl font-bold text-white">
                    ${(totalMonthly / (imagesPerCampaign * campaignsPerMonth * 0.3)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="section-title mb-4">Tool-by-Tool Breakdown</h3>
              <div className="space-y-3">
                {costs.filter(c => c.enabled).map(c => (
                  <div key={c.toolId} className="flex items-center gap-4 p-3 bg-surface rounded-lg border border-border">
                    <div className="w-36 flex-shrink-0">
                      <p className="text-sm font-semibold text-text-primary">{c.toolName}</p>
                      <p className="text-[10px] text-muted">{c.planName}</p>
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[10px] text-muted">Subscription</p>
                        <p className="text-sm font-semibold">${c.subscriptionCost.toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted">Usage</p>
                        <p className="text-sm font-semibold">${c.unitCost.toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted">{viewMode === 'monthly' ? 'Monthly' : 'Annual'}</p>
                        <p className="text-sm font-bold text-text-primary">
                          ${(viewMode === 'monthly' ? c.monthlyTotal : c.annualTotal).toFixed(0)}
                        </p>
                      </div>
                    </div>
                    <div className="w-24 flex-shrink-0">
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold rounded-full"
                          style={{ width: `${Math.min(100, (c.monthlyTotal / totalMonthly) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted mt-0.5 text-right">
                        {((c.monthlyTotal / totalMonthly) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="section-title mb-4">Cost Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9B9187' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#9B9187' }} tickFormatter={v => `$${v}`} />
                  <Tooltip
                    formatter={(v: number) => [`$${v.toFixed(0)}`, 'Cost']}
                    contentStyle={{ fontSize: 11, fontFamily: 'Inter', borderRadius: 8, border: '1px solid #E8E4DF' }}
                  />
                  <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
              <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-blue-700 mb-1">Cost Model Assumptions</p>
                <ul className="space-y-0.5">
                  {[
                    'BESTSELLER assumed to hold Adobe Creative Cloud All Apps enterprise license — Express and Firefly costs may be $0 incremental.',
                    'Midjourney Pro plan at $60/user/month. Annual billing reduces this by ~20%.',
                    'Usage estimates based on stated campaign volume. Actual usage may vary with iteration cycles.',
                    'Weavy platform cost not included — enterprise pricing bespoke.',
                    'Does not include human creative time, photography, or campaign management costs.',
                  ].map((a, i) => (
                    <li key={i} className="text-xs text-blue-600 flex items-start gap-1.5">
                      <span className="mt-0.5">·</span>{a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
