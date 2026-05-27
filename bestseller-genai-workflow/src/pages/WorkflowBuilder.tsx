import { useState } from 'react';
import { GitBranch, Plus, Minus, Loader2, Download, Share2 } from 'lucide-react';
import Header from '../components/layout/Header';
import WorkflowStepCard from '../components/workflow/WorkflowStepCard';
import RecommendationTabs from '../components/workflow/RecommendationTabs';
import CostBreakdownCard from '../components/cost/CostBreakdownCard';
import GoldDivider from '../components/ui/GoldDivider';
import Badge from '../components/ui/Badge';
import { AnalysisRequest, AssetType, BrandName, MarketName, WorkflowComplexity, GeneratedWorkflow } from '../types';
import { analyzeWorkflow } from '../utils/workflowAnalyzer';
import { cn } from '../utils/cn';
import { format } from 'date-fns';

const BRANDS: BrandName[] = ['JACK & JONES', 'ONLY', 'VERO MODA', 'Selected Homme', 'Pieces', 'Name It', 'Mamalicious', 'Object', 'BESTSELLER (All Brands)'];
const MARKETS: MarketName[] = ['Global', 'Denmark', 'Germany', 'UK', 'Spain', 'France', 'Norway', 'Sweden', 'Netherlands', 'India', 'China', 'USA'];
const ASSET_TYPES: { value: AssetType; label: string }[] = [
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'social', label: 'Social' },
  { value: 'ecom', label: 'E-com' },
  { value: 'campaign', label: 'Campaign' },
  { value: 'localization', label: 'Localisation' },
];

export default function WorkflowBuilder() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedWorkflow | null>(null);

  const [input, setInput] = useState('');
  const [brand, setBrand] = useState<BrandName>('JACK & JONES');
  const [markets, setMarkets] = useState<MarketName[]>(['Global']);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>(['image']);
  const [complexity, setComplexity] = useState<WorkflowComplexity>('standard');
  const [budget, setBudget] = useState(500);
  const [assetVolume, setAssetVolume] = useState(50);
  const [deadline, setDeadline] = useState('5 days');

  function toggleMarket(m: MarketName) {
    setMarkets(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  }
  function toggleAssetType(a: AssetType) {
    setAssetTypes(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  }

  async function handleBuild() {
    if (!input.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    const workflow = analyzeWorkflow({ userInput: input, brand, markets: markets.length ? markets : ['Global'], assetTypes: assetTypes.length ? assetTypes : ['image'], complexity });
    setResult(workflow);
    setLoading(false);
    setStep(3);
  }

  const STEPS_CONFIG = [
    { n: 1 as const, label: 'Brief' },
    { n: 2 as const, label: 'Parameters' },
    { n: 3 as const, label: 'Workflow' },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <Header
        title="Workflow Builder"
        subtitle="Define your full production brief for a detailed, export-ready creative workflow"
        breadcrumb={['BESTSELLER GenAI Media', 'Workflow Builder']}
      />

      <div className="flex-1 px-8 py-8 max-w-4xl w-full mx-auto">
        <div className="flex items-center gap-3 mb-8">
          {STEPS_CONFIG.map(({ n, label }, i) => (
            <div key={n} className="flex items-center gap-3">
              <button
                onClick={() => !loading && setStep(n)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border',
                  step === n
                    ? 'bg-charcoal text-white border-charcoal'
                    : step > n
                    ? 'bg-gold-pale text-[#8B6914] border-gold/30'
                    : 'bg-white text-muted border-border',
                )}
              >
                <span className={cn('w-5 h-5 rounded-full flex items-center justify-center text-xs', step === n ? 'bg-white/20' : step > n ? 'bg-gold/30' : 'bg-surface')}>
                  {n}
                </span>
                {label}
              </button>
              {i < STEPS_CONFIG.length - 1 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="card p-6 animate-fade-in">
            <h3 className="section-title mb-4">Creative Brief</h3>

            <div className="space-y-4">
              <div>
                <label className="label-luxury">Campaign Description *</label>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Describe the creative challenge in detail…"
                  rows={4}
                  className="input-luxury resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-luxury">Brand</label>
                  <select value={brand} onChange={e => setBrand(e.target.value as BrandName)} className="input-luxury">
                    {BRANDS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-luxury">Complexity Level</label>
                  <div className="flex gap-2">
                    {(['quick', 'standard', 'advanced'] as WorkflowComplexity[]).map(opt => (
                      <button
                        key={opt}
                        onClick={() => setComplexity(opt)}
                        className={cn(
                          'flex-1 py-2.5 text-xs font-medium rounded border transition-all capitalize',
                          complexity === opt ? 'bg-charcoal text-white border-charcoal' : 'bg-white text-text-secondary border-border hover:border-gold/40',
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="label-luxury">Asset Types</label>
                <div className="flex flex-wrap gap-2">
                  {ASSET_TYPES.map(at => (
                    <button
                      key={at.value}
                      onClick={() => toggleAssetType(at.value)}
                      className={cn(
                        'px-3 py-1.5 text-sm rounded-lg border transition-all font-medium',
                        assetTypes.includes(at.value) ? 'bg-gold text-charcoal border-gold' : 'bg-white text-text-secondary border-border hover:border-gold/40',
                      )}
                    >
                      {at.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label-luxury">Target Markets</label>
                <div className="flex flex-wrap gap-2">
                  {MARKETS.map(m => (
                    <button
                      key={m}
                      onClick={() => toggleMarket(m)}
                      className={cn(
                        'px-3 py-1.5 text-sm rounded-lg border transition-all font-medium',
                        markets.includes(m) ? 'bg-charcoal text-white border-charcoal' : 'bg-white text-text-secondary border-border hover:border-gold/40',
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <GoldDivider className="mt-6 mb-4" />
            <button
              onClick={() => setStep(2)}
              disabled={!input.trim()}
              className="btn-gold w-full justify-center"
            >
              Continue to Parameters →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card p-6 animate-fade-in">
            <h3 className="section-title mb-4">Production Parameters</h3>

            <div className="space-y-5">
              {[
                { label: 'Budget (USD)', value: budget, setter: setBudget, min: 50, max: 10000, format: (v: number) => `$${v}` },
                { label: 'Asset Volume (final approved)', value: assetVolume, setter: setAssetVolume, min: 5, max: 500, format: (v: number) => `${v} assets` },
              ].map(({ label, value, setter, min, max, format: fmt }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="label-luxury">{label}</label>
                    <span className="text-sm font-bold text-text-primary">{fmt(value)}</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={e => setter(Number(e.target.value))}
                    className="w-full accent-gold"
                  />
                </div>
              ))}

              <div>
                <label className="label-luxury">Deadline</label>
                <div className="flex gap-2 flex-wrap">
                  {['24 hours', '3 days', '5 days', '1 week', '2 weeks', '1 month'].map(d => (
                    <button
                      key={d}
                      onClick={() => setDeadline(d)}
                      className={cn(
                        'px-3 py-1.5 text-sm rounded-lg border transition-all',
                        deadline === d ? 'bg-charcoal text-white border-charcoal' : 'bg-white text-text-secondary border-border hover:border-gold/40',
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <GoldDivider className="mt-6 mb-4" />

            <div className="bg-surface rounded-xl p-4 mb-5 border border-border">
              <p className="label-luxury mb-2">Brief Summary</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ['Brand', brand],
                  ['Markets', markets.join(', ')],
                  ['Asset Types', assetTypes.join(', ')],
                  ['Complexity', complexity],
                  ['Budget', `$${budget}`],
                  ['Volume', `${assetVolume} assets`],
                  ['Deadline', deadline],
                ].map(([k, v]) => (
                  <div key={k}>
                    <span className="text-muted">{k}: </span>
                    <span className="text-text-primary font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-outline flex-1 justify-center">← Back</button>
              <button
                onClick={handleBuild}
                disabled={loading}
                className="btn-gold flex-1 justify-center"
              >
                {loading ? (
                  <><Loader2 size={14} className="animate-spin" /> Building workflow…</>
                ) : (
                  <><GitBranch size={14} /> Generate Full Workflow</>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 3 && result && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="section-title">{result.brand} — {result.workflowCategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h3>
                <p className="text-sm text-muted mt-0.5">Generated {format(new Date(result.createdAt), 'PPp')}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-outline text-xs"><Download size={12} /> Export PDF</button>
                <button className="btn-outline text-xs"><Share2 size={12} /> Share</button>
                <button onClick={() => setStep(1)} className="btn-ghost text-xs">New Workflow</button>
              </div>
            </div>

            <div className="bg-charcoal rounded-xl p-6 flex items-center justify-between">
              <div className="max-w-xl">
                <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Creative Objective</p>
                <p className="text-white/80 text-sm leading-relaxed">{result.creativeObjective}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-6">
                <p className="text-white/40 text-xs">Estimated Cost</p>
                <p className="font-serif text-3xl font-bold text-gold">${result.costEstimate.scenarioMedium.totalCost.toFixed(2)}</p>
                <p className="text-white/40 text-xs">~{result.totalEstimatedTimeMinutes >= 60 ? Math.round(result.totalEstimatedTimeMinutes / 60) + 'h' : result.totalEstimatedTimeMinutes + 'm'} total time</p>
              </div>
            </div>

            {result.steps.map((s, i) => (
              <WorkflowStepCard key={s.id} step={s} isLast={i === result.steps.length - 1} />
            ))}

            <div className="grid grid-cols-3 gap-4">
              <CostBreakdownCard scenario={result.costEstimate.scenarioLow} />
              <CostBreakdownCard scenario={result.costEstimate.scenarioMedium} isRecommended />
              <CostBreakdownCard scenario={result.costEstimate.scenarioHigh} />
            </div>

            <RecommendationTabs routes={result.alternativeRoutes} />

            <div className="card p-6 border-gold/30 bg-gold-pale/20">
              <p className="label-luxury mb-2">Final Recommendation</p>
              <p className="text-sm text-text-primary leading-relaxed">{result.finalRecommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
