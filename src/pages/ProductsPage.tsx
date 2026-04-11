import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useDataHooks";
import { ProductCard } from "@/components/ProductCard";
import { DomainChip } from "@/components/DomainChip";
import { SkeletonCard } from "@/components/Skeletons";
import { Search } from "lucide-react";
import type { Domain } from "@/data/products";

const allDomains: (Domain | "All")[] = ["All", "Photo", "Video", "Design", "GenAI", "3D", "Colour", "Collaboration"];

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const [activeDomain, setActiveDomain] = useState<Domain | "All">("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter(p => {
      if (activeDomain !== "All" && !p.domain.includes(activeDomain as Domain)) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, activeDomain, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-page">Products</h1>
        <p className="subtitle-page mt-1">8 creative tools · 5 domains</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {allDomains.map(d => (
          <DomainChip key={d} label={d} active={activeDomain === d} onClick={() => setActiveDomain(d)} />
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="rounded-md border border-border bg-background py-2 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary w-56"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 gap-4">{[1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onClick={() => navigate(`/products/${p.id}/overview`)} />
          ))}
        </div>
      )}
    </div>
  );
}
