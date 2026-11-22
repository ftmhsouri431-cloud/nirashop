import { Suspense } from "react";
import { CatalogFilters } from "@/components/catalog-filters";
import { LoadingGrid } from "@/components/loading-grid";
import { ProductGrid } from "@/components/product-grid";
import { listProducts } from "@/lib/products";

export const metadata = {
  title: "فروشگاه",
  description: "کاتالوگ پوشاک بوتیک با فیلتر دسته‌بندی و قیمت",
};

async function CatalogResults({
  category,
  min,
  max,
}: {
  category?: string;
  min?: string;
  max?: string;
}) {
  const products = await listProducts({
    publishedOnly: true,
    category,
    minPrice: min ? Number(min) : undefined,
    maxPrice: max ? Number(max) : undefined,
  });
  return (
    <ProductGrid
      products={products}
      emptyTitle="چیزی در این فیلتر نیست"
      emptyBody="دسته‌بندی یا بازه قیمت را عوض کنید."
    />
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; min?: string; max?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="container-shop py-14 md:py-20">
      <div className="mb-12 max-w-xl">
        <p className="text-xs tracking-[0.18em] text-[var(--ink-soft)]">کاتالوگ</p>
        <h1 className="font-display mt-3 text-4xl md:text-5xl">فروشگاه</h1>
        <p className="mt-4 text-sm leading-8 text-[var(--ink-soft)]">
          مجموعه زنانه را با دسته و بودجه فیلتر کنید.
        </p>
      </div>
      <Suspense fallback={<div className="skeleton mb-8 h-28 w-full" />}>
        <CatalogFilters />
      </Suspense>
      <div className="mt-10">
        <Suspense fallback={<LoadingGrid />}>
          <CatalogResults
            category={sp.category}
            min={sp.min}
            max={sp.max}
          />
        </Suspense>
      </div>
    </div>
  );
}
