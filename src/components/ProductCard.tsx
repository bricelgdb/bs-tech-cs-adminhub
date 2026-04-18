import { type Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-lg border border-border bg-card shadow-card transition-all hover:shadow-card-hover"
    >
      <div className="p-5">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
        <div className="mt-4 border-t border-border pt-3">
          <div className="text-[10px] text-muted-foreground">Seats</div>
          <div className="text-sm font-semibold text-foreground">{product.seats}</div>
        </div>
      </div>
    </div>
  );
}
