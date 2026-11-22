"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { LoadingGrid } from "@/components/loading-grid";
import { useShop } from "@/context/shop-context";
import type { Product } from "@/lib/types";

export default function WishlistPage() {
  const { wishlist, ready } = useShop();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (cancelled) return;
      const all = (data.products || []) as Product[];
      setProducts(all.filter((p) => wishlist.includes(p.id)));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [wishlist, ready]);

  return (
    <div className="container-shop py-10 md:py-16">
      <h1 className="font-display text-4xl md:text-5xl">علاقه‌مندی‌ها</h1>
      <p className="mt-3 text-sm text-[var(--ink-soft)]">
        قطعاتی که برای بعد ذخیره کرده‌اید.
      </p>
      <div className="mt-10">
        {!ready || loading ? (
          <LoadingGrid count={4} />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p className="font-display text-2xl">هنوز چیزی ذخیره نشده</p>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              از صفحه محصول، قلب علاقه‌مندی را بزنید.
            </p>
            <Link href="/products" className="btn btn-primary mt-6">
              رفتن به فروشگاه
            </Link>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
