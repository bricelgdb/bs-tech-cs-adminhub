import { type LucideIcon } from "lucide-react";

interface ResourceCardProps {
  icon: LucideIcon;
  name: string;
  href: string;
}

export function ResourceCard({ icon: Icon, name, href }: ResourceCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg border border-border bg-card p-5 flex items-center gap-3 hover:bg-accent/50 transition-colors"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
        <Icon className="h-4 w-4 text-foreground" />
      </div>
      <h3 className="text-sm font-bold text-foreground">{name}</h3>
    </a>
  );
}
