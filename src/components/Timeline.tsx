import type { ActivityEvent } from "@/data/activity";

const dotColors: Record<string, string> = {
  green: "bg-semantic-green",
  amber: "bg-semantic-amber",
  blue: "bg-semantic-blue",
  red: "bg-semantic-red",
};

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}

interface TimelineProps {
  events: ActivityEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, i) => (
        <div key={event.id} className={`flex gap-3 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
          <div className="mt-1.5 flex flex-col items-center">
            <div className={`h-2 w-2 rounded-full ${dotColors[event.dotColour]}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground">{event.action}</p>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{event.actor}</span>
              <span>·</span>
              <span>{formatTimestamp(event.timestamp)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
