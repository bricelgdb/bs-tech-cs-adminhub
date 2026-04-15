import { type LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiTileProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  subLabel?: string;
}

export function KpiTile({ label, value, delta, deltaType = "neutral", icon: Icon, subLabel }: KpiTileProps) {
  const DeltaIcon = deltaType === "up" ? TrendingUp : deltaType === "down" ? TrendingDown : Minus;
  const deltaColor = deltaType === "up" ? "text-semantic-green" : deltaType === "down" ? "text-semantic-red" : "text-muted-foreground";

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <div className="mt-2 text-2xl font-semibold text-foreground">{value}</div>
      {(delta || subLabel) && (
        <div className="mt-1 flex items-center gap-1.5">
          {delta && (
            <>
              <DeltaIcon className={`h-3 w-3 ${deltaColor}`} />
              <span className={`text-xs ${deltaColor}`}>{delta}</span>
            </>
          )}
          {subLabel && <span className="text-xs text-muted-foreground">{subLabel}</span>}
        </div>
      )}
    </div>
  );
}
