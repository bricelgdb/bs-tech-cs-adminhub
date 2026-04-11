import { useParams } from "react-router-dom";
import { useProductIntegrations } from "@/hooks/useDataHooks";
import { StatusBadge } from "@/components/StatusBadge";
import { RefreshCw, Copy, RotateCcw } from "lucide-react";

export default function ProductIntegrationsTab() {
  const { productId } = useParams<{ productId: string }>();
  const { data: integrations, isLoading } = useProductIntegrations(productId!);

  if (isLoading) return <div className="animate-pulse-subtle h-48 rounded-lg bg-muted" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {integrations?.map(int => (
          <div key={int.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground">{int.name}</h4>
              <StatusBadge status={int.status} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{int.method}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">Last sync: {new Date(int.lastSync).toLocaleString()}</div>
            <button className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline">
              <RefreshCw className="h-3 w-3" /> Sync now
            </button>
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">API keys</h3>
        <div className="space-y-2">
          {integrations?.filter(i => i.apiKey).map(int => (
            <div key={int.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
              <div>
                <div className="text-sm text-foreground">{int.name}</div>
                <code className="text-xs text-muted-foreground font-mono">{int.apiKey}</code>
              </div>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <RotateCcw className="h-3 w-3" /> Rotate
                </button>
                <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
