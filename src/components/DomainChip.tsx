import { domainTwColor } from "@/data/products";

interface DomainChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function DomainChip({ label, active = false, onClick }: DomainChipProps) {
  const colors = domainTwColor[label] ?? "text-muted-foreground border-border bg-muted/10";
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-opacity ${colors} ${active ? "opacity-100" : "opacity-60 hover:opacity-80"}`}
    >
      {label}
    </button>
  );
}
