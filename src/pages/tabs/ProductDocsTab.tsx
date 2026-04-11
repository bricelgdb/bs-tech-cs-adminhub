import { useParams } from "react-router-dom";
import { useProductDocs } from "@/hooks/useDataHooks";
import { ExternalLink } from "lucide-react";

const domainChipStyles: Record<string, string> = {
  Vendor: "bg-semantic-blue/15 text-semantic-blue",
  Internal: "bg-semantic-purple/15 text-semantic-purple",
  Training: "bg-semantic-green/15 text-semantic-green",
};

export default function ProductDocsTab() {
  const { productId } = useParams<{ productId: string }>();
  const { data: docs, isLoading } = useProductDocs(productId!);

  if (isLoading) return <div className="animate-pulse-subtle h-48 rounded-lg bg-muted" />;

  const grouped = {
    Vendor: docs?.filter(d => d.domain === "Vendor") ?? [],
    Internal: docs?.filter(d => d.domain === "Internal") ?? [],
    Training: docs?.filter(d => d.domain === "Training") ?? [],
  };

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([domain, items]) => (
        items.length > 0 && (
          <div key={domain}>
            <h3 className="text-sm font-bold text-foreground mb-3">{domain === "Vendor" ? "Vendor documentation" : domain === "Internal" ? "Internal Confluence pages" : "Training resources"}</h3>
            <div className="space-y-2">
              {items.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${domainChipStyles[doc.domain]}`}>
                    {doc.domain}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{doc.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{doc.description}</div>
                  </div>
                  <a href={doc.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline shrink-0">
                    Open <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
}
