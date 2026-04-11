import { ExternalLink, type LucideIcon } from "lucide-react";

interface ResourceCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
  linkLabel: string;
  href: string;
}

export function ResourceCard({ icon: Icon, name, description, linkLabel, href }: ResourceCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 flex flex-col">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
          <Icon className="h-4 w-4 text-foreground" />
        </div>
        <h3 className="text-sm font-bold text-foreground">{name}</h3>
      </div>
      <p className="mt-2 flex-1 text-xs text-muted-foreground">{description}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        {linkLabel}
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
