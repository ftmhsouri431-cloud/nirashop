import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  emptyTitle = "محصولی یافت نشد",
  emptyBody = "فیلترها را تغییر دهید یا کمی بعد دوباره سر بزنید.",
}: {
  products: Product[];
  emptyTitle?: string;
  emptyBody?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="empty-state animate-fade" role="status">
        <p className="font-display text-2xl">{emptyTitle}</p>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">{emptyBody}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
