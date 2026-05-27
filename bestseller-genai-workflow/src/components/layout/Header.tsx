import { RefreshCw, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string[];
}

export default function Header({ title, subtitle, breadcrumb }: HeaderProps) {
  const [refreshed, setRefreshed] = useState(false);
  const [lastRefresh] = useState(new Date());

  function handleRefresh() {
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 1500);
  }

  return (
    <header className="bg-white border-b border-border px-8 py-5 flex items-center justify-between sticky top-0 z-10">
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="flex items-center gap-1.5 mb-1">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-border text-xs">/</span>}
                <span className="text-muted text-xs">{crumb}</span>
              </span>
            ))}
          </div>
        )}
        <h1 className="font-serif text-2xl font-semibold text-text-primary">{title}</h1>
        {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-muted bg-surface px-3 py-1.5 rounded-full border border-border">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Pricing: {format(lastRefresh, 'HH:mm')} UTC</span>
          <button
            onClick={handleRefresh}
            className="ml-1 hover:text-gold transition-colors"
            title="Refresh pricing"
          >
            <RefreshCw size={10} className={refreshed ? 'animate-spin text-gold' : ''} />
          </button>
        </div>
        <button className="btn-ghost p-2 rounded-full relative">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-gold rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-charcoal flex items-center justify-center text-white text-xs font-semibold">
          BS
        </div>
      </div>
    </header>
  );
}
