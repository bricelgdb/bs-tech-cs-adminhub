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
      <div className="p-5 flex flex-col items-center text-center">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
        {product.logo && (
          <div className="mt-3 flex h-16 w-16 items-center justify-center">
            <img
              src={product.logo}
              alt={`${product.name} logo`}
              loading="lazy"
              className="object-contain"
              style={{
                maxHeight: `${4 * (product.logoScale ?? 1)}rem`,
                maxWidth: `${4 * (product.logoScale ?? 1)}rem`,
              }}
            />
          </div>
        )}
        <div className="mt-4 w-full border-t border-border pt-3">
          <div className="text-[10px] text-muted-foreground">Seats</div>
          <div className="text-sm font-semibold text-foreground">{product.seats}</div>
        </div>
      </div>
    </div>
  );
}
