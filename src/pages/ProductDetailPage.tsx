import { NavLink, Outlet, useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useDataHooks";
import { DomainChip } from "@/components/DomainChip";
import { ExternalLink, FileText } from "lucide-react";
import { domainTwColor } from "@/data/products";

const tabs = [
  { label: "Overview", path: "overview" },
  { label: "Licences", path: "licences" },
  { label: "Usage", path: "usage" },
  { label: "Access", path: "access" },
  { label: "Integrations", path: "integrations" },
  { label: "Audit Log", path: "audit" },
  { label: "Docs", path: "docs" },
];

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, isLoading } = useProduct(productId!);

  if (isLoading) {
    return <div className="animate-pulse-subtle space-y-4"><div className="h-8 w-64 rounded bg-muted" /><div className="h-4 w-96 rounded bg-muted" /></div>;
  }

  if (!product) {
    return <div className="py-16 text-center text-muted-foreground">Product not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-lg text-lg font-bold ${domainTwColor[product.domain[0]] ?? ""}`}>
            {product.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
          </div>
          <div>
            <h1 className="heading-page">{product.name}</h1>
            <p className="subtitle-page mt-0.5">{product.description}</p>
            <div className="mt-2 flex gap-1.5">
              {product.domain.map(d => <DomainChip key={d} label={d} active />)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={product.adminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs text-foreground hover:bg-surface-elevated"
          >
            Open Admin Console <ExternalLink className="h-3 w-3" />
          </a>
          <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90">
            <FileText className="h-3 w-3" /> Export report
          </button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border">
        {tabs.map(tab => (
          <NavLink
            key={tab.path}
            to={`/products/${productId}/${tab.path}`}
            end
            className={({ isActive }) =>
              `px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "border-b-2 border-primary text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
}
