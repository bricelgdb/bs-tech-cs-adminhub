interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusStyles: Record<string, string> = {
  active: "bg-semantic-green/15 text-semantic-green",
  expiring: "bg-semantic-amber/15 text-semantic-amber",
  inactive: "bg-muted text-muted-foreground",
  pending: "bg-semantic-blue/15 text-semantic-blue",
  connected: "bg-semantic-green/15 text-semantic-green",
  disconnected: "bg-muted text-muted-foreground",
  error: "bg-semantic-red/15 text-semantic-red",
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const style = statusStyles[status] ?? statusStyles.inactive;
  const sizeClass = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";
  return (
    <span className={`inline-flex items-center rounded-full font-medium capitalize ${style} ${sizeClass}`}>
      {status}
    </span>
  );
}
