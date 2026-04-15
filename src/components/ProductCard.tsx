import { type Product, domainBorderColor, domainTwColor } from "@/data/products";
import { StatusBadge } from "./StatusBadge";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const borderClass = domainBorderColor[product.domain[0]] ?? "border-t-border";

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-lg border border-border bg-card shadow-card transition-all hover:shadow-card-hover ${borderClass} border-t-2`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-bold ${domainTwColor[product.domain[0]] ?? ""}`}>
            {product.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
          </div>
          <StatusBadge status={product.status} />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {product.domain.map(d => (
            <span key={d} className={`text-[10px] font-medium ${domainTwColor[d]?.split(" ")[0] ?? "text-muted-foreground"}`}>{d}</span>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-3">
          <div>
            <div className="text-[10px] text-muted-foreground">Seats</div>
            <div className="text-sm font-semibold text-foreground">{product.seats}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">Utilisation</div>
            <div className="text-sm font-semibold text-foreground">{product.utilisation}%</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">Cost/mo</div>
            <div className="text-sm font-semibold text-foreground">{product.costMonthly > 0 ? `€${product.costMonthly.toLocaleString()}` : "Internal"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
