import { useState } from 'react';
import { Settings, Save, Plus, RefreshCw, Shield, Sliders, Database, Users } from 'lucide-react';
import Header from '../components/layout/Header';
import Badge from '../components/ui/Badge';
import GoldDivider from '../components/ui/GoldDivider';
import { approvedTools } from '../data/tools';
import { cn } from '../utils/cn';

type AdminSection = 'tools' | 'pricing' | 'benchmarks' | 'access';

export default function AdminSettings() {
  const [section, setSection] = useState<AdminSection>('tools');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const sections: { value: AdminSection; label: string; icon: typeof Settings }[] = [
    { value: 'tools', label: 'Approved Tools', icon: Settings },
    { value: 'pricing', label: 'Pricing Sources', icon: Database },
    { value: 'benchmarks', label: 'Benchmark Weights', icon: Sliders },
    { value: 'access', label: 'Access & Roles', icon: Users },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <Header
        title="Admin Settings"
        subtitle="Manage approved tools, pricing sources, benchmark weights, and access control"
        breadcrumb={['BESTSELLER GenAI Media', 'Admin']}
      />

      <div className="flex-1 px-8 py-8">
        <div className="flex gap-2 mb-6">
          {sections.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setSection(value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all',
                section === value ? 'bg-charcoal text-white border-charcoal' : 'bg-white text-text-secondary border-border hover:border-gold/40',
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {section === 'tools' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="section-title">Approved Tools Management</h3>
              <button className="btn-gold text-xs"><Plus size={12} /> Add Tool</button>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface/50">
                    {['Tool', 'Vendor', 'Category', 'Status', 'Commercial Safe', 'Fashion Score', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 label-luxury">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {approvedTools.map((tool, i) => (
                    <tr key={tool.id} className={cn('border-b border-border/50', i % 2 === 0 ? 'bg-white' : 'bg-ivory/40')}>
                      <td className="py-3 px-4 font-semibold text-sm">{tool.name}</td>
                      <td className="py-3 px-4 text-sm text-muted">{tool.vendor}</td>
                      <td className="py-3 px-4 text-xs text-muted capitalize">{tool.category.replace(/-/g, ' ')}</td>
                      <td className="py-3 px-4">
                        <select
                          defaultValue={tool.approvalStatus}
                          className="text-xs px-2 py-1 border border-border rounded bg-white"
                        >
                          <option value="approved">Approved</option>
                          <option value="evaluation">Evaluation</option>
                          <option value="restricted">Restricted</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <input type="checkbox" defaultChecked={tool.commercialSafe} className="accent-gold" />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          defaultValue={tool.fashionScore}
                          min={0}
                          max={10}
                          step={0.5}
                          className="w-16 text-xs px-2 py-1 border border-border rounded"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <button className="text-xs px-2 py-1 rounded bg-surface border border-border text-text-secondary hover:border-gold transition-colors">Edit</button>
                          <button className="text-xs px-2 py-1 rounded bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors">Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === 'pricing' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="section-title">Pricing Data Sources</h3>
              <button className="btn-outline text-xs"><RefreshCw size={12} /> Refresh All Prices</button>
            </div>
            <div className="card p-5">
              <div className="flex items-start gap-3 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <Shield size={14} className="text-blue-500 mt-0.5" />
                <p className="text-xs text-blue-700">Pricing data is currently served from cached values. Connect real API endpoints below to enable live pricing refresh. All timestamps are appended to each cost estimate.</p>
              </div>
              <div className="space-y-3">
                {[
                  { tool: 'Adobe Firefly / Express', source: 'Cached', endpoint: 'https://commerce.adobe.com/api/pricing', status: 'manual' },
                  { tool: 'Midjourney', source: 'Cached', endpoint: 'https://api.midjourney.com/pricing (not public)', status: 'manual' },
                  { tool: 'OpenAI (DALL-E / GPT-4o)', source: 'API', endpoint: 'https://api.openai.com/v1/pricing', status: 'connected' },
                  { tool: 'Runway', source: 'Cached', endpoint: 'https://api.runwayml.com/pricing (not public)', status: 'manual' },
                  { tool: 'Kling AI', source: 'Cached', endpoint: 'https://klingai.com/api/pricing (eval)', status: 'manual' },
                ].map(source => (
                  <div key={source.tool} className="flex items-center gap-4 p-3 bg-surface rounded-lg border border-border">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{source.tool}</p>
                      <p className="text-[10px] text-muted font-mono mt-0.5">{source.endpoint}</p>
                    </div>
                    <Badge variant={source.status === 'connected' ? 'green' : 'amber'} size="sm">
                      {source.status}
                    </Badge>
                    <input
                      type="text"
                      placeholder="API key…"
                      className="input-luxury py-1.5 w-48 text-xs"
                    />
                    <button className="btn-outline text-xs">Connect</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {section === 'benchmarks' && (
          <div className="space-y-4">
            <h3 className="section-title">Benchmark Weight Configuration</h3>
            <p className="text-sm text-text-secondary">Adjust how each criterion is weighted when calculating composite scores for different use case categories.</p>
            <div className="card p-5">
              {[
                { label: 'Output Quality', value: 15 },
                { label: 'Fashion Realism', value: 12 },
                { label: 'Brand Consistency', value: 10 },
                { label: 'Prompt Adherence', value: 10 },
                { label: 'Batch Efficiency', value: 8 },
                { label: 'Localisation Capability', value: 8 },
                { label: 'Commercial Safety', value: 12 },
                { label: 'Ease of Use', value: 10 },
                { label: 'BESTSELLER Fit', value: 15 },
              ].map(w => (
                <div key={w.label} className="flex items-center gap-4 py-3 border-b border-border/50">
                  <span className="text-sm text-text-primary w-48">{w.label}</span>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    defaultValue={w.value}
                    className="flex-1 accent-gold"
                  />
                  <span className="text-sm font-bold w-10 text-right">{w.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'access' && (
          <div className="space-y-4">
            <h3 className="section-title">Access & Role Management</h3>
            <div className="card p-5">
              <div className="space-y-3">
                {[
                  { role: 'Admin', description: 'Full access — tool management, pricing, all settings', users: 3 },
                  { role: 'Creative Lead', description: 'Workflow analysis, export, full benchmark access', users: 12 },
                  { role: 'Designer', description: 'Workflow analysis and history — no admin settings', users: 47 },
                  { role: 'Brand Manager', description: 'Read-only: view workflows and cost estimates', users: 28 },
                  { role: 'Viewer', description: 'Read-only access to approved tools library', users: 84 },
                ].map(role => (
                  <div key={role.role} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
                    <div>
                      <p className="text-sm font-semibold">{role.role}</p>
                      <p className="text-xs text-muted mt-0.5">{role.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold font-serif">{role.users}</p>
                        <p className="text-[10px] text-muted">users</p>
                      </div>
                      <button className="btn-outline text-xs">Manage</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <GoldDivider className="mt-6" />

        <button onClick={handleSave} className="btn-gold">
          <Save size={14} />
          {saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
