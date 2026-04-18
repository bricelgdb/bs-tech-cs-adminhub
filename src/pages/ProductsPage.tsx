import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useDataHooks";
import { ProductCard } from "@/components/ProductCard";
import { SkeletonCard } from "@/components/Skeletons";

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-page">Products</h1>
        <p className="subtitle-page mt-1">{products?.length ?? 0} creative tools</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 gap-4">{[1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {products?.map(p => (
            <ProductCard key={p.id} product={p} onClick={() => navigate(`/products/${p.id}/overview`)} />
          ))}
        </div>
      )}
    </div>
  );
}
