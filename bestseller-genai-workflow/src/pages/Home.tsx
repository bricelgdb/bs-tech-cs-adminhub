import { useState } from 'react';
import { Sparkles, ChevronDown, AlertTriangle, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { AnalysisRequest, AssetType, BrandName, MarketName, WorkflowComplexity, GeneratedWorkflow } from '../types';
import { analyzeWorkflow } from '../utils/workflowAnalyzer';
import { rankToolsForCategory } from '../utils/benchmarkEngine';
import Header from '../components/layout/Header';
import WorkflowStepCard from '../components/workflow/WorkflowStepCard';
import RecommendationTabs from '../components/workflow/RecommendationTabs';
import BenchmarkTable from '../components/benchmark/BenchmarkTable';
import CostBreakdownCard from '../components/cost/CostBreakdownCard';
import GoldDivider from '../components/ui/GoldDivider';
import Badge from '../components/ui/Badge';
import { format } from 'date-fns';
import { cn } from '../utils/cn';

const BRANDS: BrandName[] = [
  'JACK & JONES', 'ONLY', 'VERO MODA', 'Selected Homme', 'Pieces',
  'Name It', 'Mamalicious', 'Object', 'BESTSELLER (All Brands)',
];

const MARKETS: MarketName[] = [
  'Global', 'Denmark', 'Germany', 'UK', 'Spain', 'France',
  'Norway', 'Sweden', 'Netherlands', 'India', 'China', 'USA',
];

const ASSET_TYPES: { value: AssetType; label: string }[] = [
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'social', label: 'Social' },
  { value: 'ecom', label: 'E-com' },
  { value: 'campaign', label: 'Campaign' },
  { value: 'localization', label: 'Localisation' },
];

const COMPLEXITY_OPTIONS: { value: WorkflowComplexity; label: string; desc: string }[] = [
  { value: 'quick', label: 'Quick', desc: '< 2 hours' },
  { value: 'standard', label: 'Standard', desc: '½ day' },
  { value: 'advanced', label: 'Advanced', desc: 'Full production' },
];

const EXAMPLE_INPUTS = [
  'Create localized social assets for a JACK & JONES denim campaign across Spain, France and Norway',
  'Generate image variations for ONLY product storytelling on e-commerce PDP',
  'Adapt a VERO MODA summer campaign for Spain, France, and Norway',
  'Create short AI video concepts from still campaign images for TikTok and Reels',
  'Generate e-commerce product images for PIECES accessories at scale',
  'Build a full editorial campaign workflow for Selected Homme SS25 collection launch',
];

const WORKFLOW_CATEGORY_LABELS: Record<string, string> = {
  'social-campaign': 'Social Media Campaign',
  'ecommerce-imagery': 'E-Commerce Imagery',
  'video-concept': 'AI Video Production',
  'market-localization': 'Market Localisation',
  'editorial-campaign': 'Editorial Campaign',
  'batch-variation': 'Batch Variation',
  'product-storytelling': 'Product Storytelling',
};

export default function Home() {
  const [input, setInput] = useState('');
  const [brand, setBrand] = useState<BrandName>('JACK & JONES');
  const [markets, setMarkets] = useState<MarketName[]>(['Global']);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>(['image', 'social']);
  const [complexity, setComplexity] = useState<WorkflowComplexity>('standard');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedWorkflow | null>(null);
  const [marketOpen, setMarketOpen] = useState(false);

  function toggleMarket(m: MarketName) {
    setMarkets(prev =>
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m],
    );
  }

  function toggleAssetType(a: AssetType) {
    setAssetTypes(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a],
    );
  }

  async function handleAnalyze() {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1400));
    const req: AnalysisRequest = {
      userInput: input,
      brand,
      markets: markets.length > 0 ? markets : ['Global'],
      assetTypes: assetTypes.length > 0 ? assetTypes : ['image'],
      complexity,
    };
    const workflow = analyzeWorkflow(req);
    setResult(workflow);
    setLoading(false);
  }

  const rankedTools = result
    ? rankToolsForCategory(result.workflowCategory, undefined)
    : [];

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <Header
        title="Use Case Analyser"
        subtitle="Describe your creative need and get a complete GenAI Media workflow instantly"
        breadcrumb={['BESTSELLER GenAI Media', 'Analyser']}
      />

      <div className="flex-1 px-8 py-8 max-w-5xl w-full mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-px h-6 bg-gold" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">BESTSELLER TECH Creative Solutions</span>
          </div>
          <h2 className="font-serif text-3xl font-semibold text-text-primary leading-tight">
            GenAI Media Workflow Engine
          </h2>
          <p className="text-text-secondary mt-2 max-w-2xl">
            Enter any fashion creative challenge. Get a structured production workflow using approved tools, live cost estimates, and benchmark-backed model recommendations — in seconds.
          </p>
        </div>

        <div className="card p-6 mb-6">
          <div className="mb-4">
            <label className="label-luxury">Describe Your Creative Need</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. Create localized social assets for a JACK & JONES denim campaign targeting Spain and France..."
              rows={3}
              className="input-luxury resize-none text-base leading-relaxed"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {EXAMPLE_INPUTS.map(ex => (
              <button
                key={ex}
                onClick={() => setInput(ex)}
                className="text-xs px-3 py-1.5 rounded-full bg-surface border border-border text-text-secondary hover:border-gold hover:text-gold transition-colors leading-tight text-left"
              >
                {ex.length > 60 ? ex.slice(0, 60) + '…' : ex}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="label-luxury">Brand</label>
              <select
                value={brand}
                onChange={e => setBrand(e.target.value as BrandName)}
                className="input-luxury cursor-pointer appearance-none"
              >
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="relative">
              <label className="label-luxury">Markets</label>
              <button
                onClick={() => setMarketOpen(!marketOpen)}
                className="input-luxury flex items-center justify-between text-left"
              >
                <span className="truncate text-text-primary text-sm">
                  {markets.length === 0 ? 'Select markets…' : markets.slice(0, 2).join(', ') + (markets.length > 2 ? ` +${markets.length - 2}` : '')}
                </span>
                <ChevronDown size={14} className="text-muted flex-shrink-0 ml-2" />
              </button>
              {marketOpen && (
                <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-border rounded-lg shadow-luxury-md p-2 max-h-48 overflow-y-auto">
                  {MARKETS.map(m => (
                    <label key={m} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface cursor-pointer">
                      <input
                        type="checkbox"
                        checked={markets.includes(m)}
                        onChange={() => toggleMarket(m)}
                        className="accent-gold"
                      />
                      <span className="text-sm text-text-primary">{m}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="label-luxury">Complexity</label>
              <div className="flex gap-1">
                {COMPLEXITY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setComplexity(opt.value)}
                    className={cn(
                      'flex-1 py-2.5 text-xs font-medium rounded border transition-all',
                      complexity === opt.value
                        ? 'bg-charcoal text-white border-charcoal'
                        : 'bg-white text-text-secondary border-border hover:border-gold/40',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label-luxury">Asset Types</label>
              <div className="flex flex-wrap gap-1">
                {ASSET_TYPES.map(at => (
                  <button
                    key={at.value}
                    onClick={() => toggleAssetType(at.value)}
                    className={cn(
                      'px-2 py-1 text-xs font-medium rounded border transition-all',
                      assetTypes.includes(at.value)
                        ? 'bg-gold text-charcoal border-gold'
                        : 'bg-white text-text-secondary border-border hover:border-gold/40',
                    )}
                  >
                    {at.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!input.trim() || loading}
            className="btn-gold w-full justify-center py-3 text-base"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analysing workflow…
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Analyse Workflow
              </>
            )}
          </button>

          {loading && (
            <div className="mt-3 h-1 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-charcoal text-white rounded-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #C9A96E 0%, transparent 60%)' }} />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gold text-[10px] font-bold uppercase tracking-widest">
                        {WORKFLOW_CATEGORY_LABELS[result.workflowCategory]}
                      </span>
                      <span className="text-white/30">·</span>
                      <span className="text-white/50 text-xs">{format(new Date(result.createdAt), 'PPp')}</span>
                    </div>
                    <h2 className="font-serif text-xl font-semibold mb-2">{result.brand}</h2>
                    <p className="text-white/70 text-sm leading-relaxed max-w-2xl">{result.useCaseSummary}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white/50 text-xs mb-1">Est. Cost (Medium)</p>
                    <p className="font-serif text-3xl font-bold text-gold">${result.costEstimate.scenarioMedium.totalCost.toFixed(2)}</p>
                    <p className="text-white/40 text-xs mt-0.5">USD per campaign run</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    `${result.steps.length} workflow steps`,
                    `${result.markets.length} market(s)`,
                    `~${result.totalEstimatedTimeMinutes >= 60 ? Math.round(result.totalEstimatedTimeMinutes / 60) + 'h' : result.totalEstimatedTimeMinutes + 'm'} total`,
                    result.complexity,
                  ].map(tag => (
                    <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 text-white/70 border border-white/15">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="section-title mb-1">Creative Objective</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{result.creativeObjective}</p>
              <GoldDivider />
              <p className="label-luxury mb-1">Recommended Route</p>
              <p className="text-sm text-text-primary">{result.recommendedRoute}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title">Step-by-Step Workflow</h3>
                <span className="text-xs text-muted">{result.steps.length} steps · click any step to expand</span>
              </div>
              <div>
                {result.steps.map((step, i) => (
                  <WorkflowStepCard key={step.id} step={step} isLast={i === result.steps.length - 1} />
                ))}
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="p-5 border-b border-border">
                <h3 className="section-title">Model Benchmark — This Use Case</h3>
                <p className="text-sm text-text-secondary mt-0.5">Weighted for {WORKFLOW_CATEGORY_LABELS[result.workflowCategory]} priorities</p>
              </div>
              <BenchmarkTable scores={rankedTools.slice(0, 6)} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="section-title">Cost Estimate</h3>
                  <p className="text-xs text-muted mt-0.5">Live pricing · {format(new Date(result.costEstimate.timestamp), 'PPp')}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <CostBreakdownCard scenario={result.costEstimate.scenarioLow} />
                <CostBreakdownCard scenario={result.costEstimate.scenarioMedium} isRecommended />
                <CostBreakdownCard scenario={result.costEstimate.scenarioHigh} />
              </div>

              <div className="card p-5 mt-4">
                <p className="label-luxury mb-3">Per-Asset Cost Reference</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: 'Per Image', value: result.costEstimate.perImage },
                    { label: 'Per Video', value: result.costEstimate.perVideo },
                    { label: 'Per Market Adapt.', value: result.costEstimate.perMarketAdaptation },
                    { label: 'Campaign Batch', value: result.costEstimate.perCampaignBatch },
                    { label: 'Per Final Asset', value: result.costEstimate.perFinalApprovedAsset },
                  ].map(item => (
                    <div key={item.label} className="text-center p-3 bg-surface rounded-lg border border-border">
                      <p className="text-[10px] text-muted uppercase tracking-wide mb-1">{item.label}</p>
                      <p className="font-serif text-lg font-bold text-text-primary">${item.value.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 p-4 bg-surface rounded-xl border border-border">
                <p className="label-luxury mb-2">Pricing Assumptions</p>
                <ul className="space-y-1">
                  {result.costEstimate.assumptions.map((a, i) => (
                    <li key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
                      <span className="text-muted mt-0.5">·</span>{a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="section-title mb-4">Recommended Routes</h3>
              <RecommendationTabs routes={result.alternativeRoutes} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={15} className="text-amber-500" />
                  <h3 className="section-title text-base">Quality Risks</h3>
                </div>
                <ul className="space-y-2">
                  {result.qualityRisks.map((risk, i) => (
                    <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={15} className="text-blue-500" />
                  <h3 className="section-title text-base">Governance Notes</h3>
                </div>
                <ul className="space-y-2">
                  {result.governanceNotes.map((note, i) => (
                    <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                      <CheckCircle size={10} className="text-blue-400 mt-0.5 flex-shrink-0" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card p-6 border-gold/30 bg-gold-pale/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
                  <Sparkles size={10} className="text-charcoal" />
                </div>
                <h3 className="section-title">Final Recommendation</h3>
              </div>
              <p className="text-sm text-text-primary leading-relaxed">{result.finalRecommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
