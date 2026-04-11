export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-pulse-subtle">
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-md bg-muted" />
        <div className="h-5 w-16 rounded-full bg-muted" />
      </div>
      <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
      <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-3">
        {[1,2,3].map(i => <div key={i} className="space-y-1"><div className="h-2 w-8 rounded bg-muted" /><div className="h-4 w-12 rounded bg-muted" /></div>)}
      </div>
    </div>
  );
}

export function SkeletonKpi() {
  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-pulse-subtle">
      <div className="h-3 w-20 rounded bg-muted" />
      <div className="mt-2 h-7 w-24 rounded bg-muted" />
      <div className="mt-2 h-3 w-16 rounded bg-muted" />
    </div>
  );
}

export function SkeletonChart({ height = 200 }: { height?: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-pulse-subtle" style={{ height }}>
      <div className="h-3 w-32 rounded bg-muted" />
      <div className="mt-4 h-full rounded bg-muted" style={{ height: height - 60 }} />
    </div>
  );
}
