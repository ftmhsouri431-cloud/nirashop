"use client";

import Image from "next/image";
import Link from "next/link";
import { formatToman } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useShop } from "@/context/shop-context";

export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted } = useShop();
  const wished = isWishlisted(product.id);
  const image = product.images[0];

  return (
    <article className="product-tile group">
      <div className="relative overflow-hidden bg-[var(--stone-deep)]">
        <Link href={`/products/${product.id}`} className="block aspect-[3/4]">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm opacity-50">
              بدون تصویر
            </div>
          )}
        </Link>
        <button
          type="button"
          className="icon-btn absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center border border-white/40 bg-white/70 text-sm backdrop-blur transition hover:bg-white"
          aria-label={wished ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
          aria-pressed={wished}
          onClick={() => toggleWishlist(product.id)}
        >
          {wished ? "♥" : "♡"}
        </button>
        {product.compareAtPrice && product.compareAtPrice > product.price ? (
          <span className="absolute bottom-3 right-3 bg-[var(--ink)] px-2.5 py-1 text-[10px] tracking-[0.12em] text-[var(--bone)]">
            حراج
          </span>
        ) : null}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs tracking-wide text-[var(--ink-soft)]">
          {product.category}
        </p>
        <Link
          href={`/products/${product.id}`}
          className="block text-base font-medium leading-7 transition-opacity hover:opacity-70"
        >
          {product.name}
        </Link>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-semibold">
            {formatToman(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price ? (
            <span className="text-xs text-[var(--ink-soft)] line-through">
              {formatToman(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
