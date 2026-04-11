import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AlertStripProps {
  severity: "amber" | "red" | "blue";
  message: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}

const styles: Record<string, { bg: string; border: string; text: string; icon: typeof AlertTriangle }> = {
  amber: { bg: "bg-semantic-amber/10", border: "border-semantic-amber/30", text: "text-semantic-amber", icon: AlertTriangle },
  red: { bg: "bg-semantic-red/10", border: "border-semantic-red/30", text: "text-semantic-red", icon: AlertCircle },
  blue: { bg: "bg-semantic-blue/10", border: "border-semantic-blue/30", text: "text-semantic-blue", icon: Info },
};

export function AlertStrip({ severity, message, actionLabel = "Review →", actionTo, onAction }: AlertStripProps) {
  const navigate = useNavigate();
  const s = styles[severity];
  const Icon = s.icon;

  return (
    <div className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 ${s.bg} ${s.border}`}>
      <Icon className={`h-4 w-4 shrink-0 ${s.text}`} />
      <span className="flex-1 text-sm text-foreground">{message}</span>
      <button
        onClick={() => { onAction?.(); if (actionTo) navigate(actionTo); }}
        className={`text-xs font-medium ${s.text} hover:underline`}
      >
        {actionLabel}
      </button>
    </div>
  );
}
