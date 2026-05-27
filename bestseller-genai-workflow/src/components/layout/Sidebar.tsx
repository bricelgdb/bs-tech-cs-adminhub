import { NavLink } from 'react-router-dom';
import {
  Sparkles, GitBranch, BarChart2, Calculator, Library, Clock, Settings,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = [
  { to: '/', icon: Sparkles, label: 'Use Case Analyser', end: true },
  { to: '/workflow-builder', icon: GitBranch, label: 'Workflow Builder' },
  { to: '/benchmark', icon: BarChart2, label: 'Benchmark Dashboard' },
  { to: '/cost-estimator', icon: Calculator, label: 'Cost Estimator' },
  { to: '/tools', icon: Library, label: 'Approved Tools' },
  { to: '/history', icon: Clock, label: 'Workflow History' },
  { to: '/admin', icon: Settings, label: 'Admin Settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-charcoal flex flex-col flex-shrink-0">
      <div className="px-6 py-7 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold rounded flex items-center justify-center flex-shrink-0">
            <span className="text-charcoal font-serif font-bold text-sm tracking-tight">BS</span>
          </div>
          <div>
            <p className="text-white text-xs font-semibold tracking-widest uppercase leading-none">BESTSELLER</p>
            <p className="text-white/50 text-[10px] tracking-wider mt-0.5">TECH Creative Solutions</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-gold text-[10px] font-semibold uppercase tracking-widest">GenAI Media Workflow</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-white/10 text-white border-l-2 border-gold pl-[10px]'
                  : 'text-white/55 hover:text-white hover:bg-white/5 border-l-2 border-transparent pl-[10px]',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={15} className={cn('flex-shrink-0', isActive ? 'text-gold' : 'text-white/40 group-hover:text-white/70')} />
                <span className="truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-5 border-t border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/40 text-[10px] tracking-wide">Live Pricing Active</span>
        </div>
        <p className="text-white/25 text-[10px]">v1.0.0 — May 2025</p>
      </div>
    </aside>
  );
}
