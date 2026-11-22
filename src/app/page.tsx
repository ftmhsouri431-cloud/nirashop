import Link from "next/link";
import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-grid";
import { listProducts } from "@/lib/products";
import { getPublicSettings } from "@/lib/settings";

export default async function HomePage() {
  const [settings, products] = await Promise.all([
    getPublicSettings(),
    listProducts({ publishedOnly: true }),
  ]);
  const featured = products.slice(0, 4);

  return (
    <>
      <Hero shopName={settings.shopName} tagline={settings.tagline} />
      <section className="container-shop py-20 md:py-28">
        <div className="mb-14 flex items-end justify-between gap-6">
          <div className="max-w-md">
            <p className="text-xs tracking-[0.18em] text-[var(--ink-soft)]">
              مجموعه
            </p>
            <h2 className="font-display mt-3 text-4xl md:text-5xl">
              انتخاب‌های زنانه
            </h2>
          </div>
          <Link href="/products" className="btn btn-ghost text-sm">
            همه
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="container-shop pb-24 md:pb-32">
        <div className="border border-[var(--line)] bg-[var(--ink)] px-8 py-16 text-[var(--bone)] md:px-16 md:py-24">
          <p className="text-xs tracking-[0.18em] text-white/50">نیرا شاپ</p>
          <h2 className="font-display mt-5 max-w-xl text-3xl leading-tight md:text-5xl">
            فضای خالی، جزئیات دقیق، حس لوکس آرام
          </h2>
          <p className="mt-6 max-w-md text-sm leading-8 text-white/65">
            هر قطعه برای کمد زنانهٔ مینیمال طراحی شده؛ پارچه‌های نرم، برش تمیز، و
            استایلی که فریاد نمی‌زند.
          </p>
          <Link
            href="/products?category=کت و ژاکت"
            className="btn mt-10 border border-[var(--bone)] bg-transparent text-[var(--bone)] hover:bg-[var(--bone)] hover:text-[var(--ink)]"
          >
            کت و ژاکت
          </Link>
        </div>
      </section>
    </>
  );
}
