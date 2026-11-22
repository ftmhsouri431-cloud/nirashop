"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { formatToman } from "@/lib/format";
import type { Product } from "@/lib/types";
import { productToCartItem, useShop } from "@/context/shop-context";

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [size, setSize] = useState(product.sizes[0] || "");
  const [color, setColor] = useState(product.colors[0] || "");
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const wished = isWishlisted(product.id);
  const image = product.images[activeImage] || product.images[0];

  const canAdd = useMemo(
    () => Boolean(size && color && product.stock > 0),
    [size, color, product.stock],
  );

  function onAdd() {
    if (!canAdd) return;
    addToCart(productToCartItem(product, size, color));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="space-y-3">
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--stone-deep)]">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover animate-fade"
              key={image}
            />
          ) : null}
        </div>
        {product.images.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto" role="list">
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`relative h-20 w-16 shrink-0 overflow-hidden border ${
                  i === activeImage
                    ? "border-[var(--ink)]"
                    : "border-transparent opacity-70"
                }`}
                onClick={() => setActiveImage(i)}
                aria-label={`تصویر ${i + 1}`}
                aria-pressed={i === activeImage}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="animate-rise">
        <p className="text-sm text-[var(--ink-soft)]">{product.category}</p>
        <h1 className="font-display mt-2 text-4xl leading-tight md:text-5xl">
          {product.name}
        </h1>
        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <p className="text-xl font-semibold">{formatToman(product.price)}</p>
          {product.compareAtPrice && product.compareAtPrice > product.price ? (
            <p className="text-sm text-[var(--ink-soft)] line-through">
              {formatToman(product.compareAtPrice)}
            </p>
          ) : null}
        </div>
        <p className="mt-6 max-w-lg text-sm leading-8 text-[var(--ink-soft)] md:text-base">
          {product.description}
        </p>

        <fieldset className="mt-8">
          <legend className="label">سایز</legend>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                className={`chip ${size === s ? "is-active" : ""}`}
                aria-pressed={size === s}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="label">رنگ</legend>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                className={`chip ${color === c ? "is-active" : ""}`}
                aria-pressed={color === c}
                onClick={() => setColor(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <p className="mt-6 text-sm text-[var(--ink-soft)]" role="status">
          {product.stock > 0
            ? `${product.stock.toLocaleString("fa-IR")} عدد موجود`
            : "ناموجود"}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-primary min-w-[10rem]"
            disabled={!canAdd}
            onClick={onAdd}
            aria-live="polite"
          >
            {added ? "به سبد اضافه شد" : "افزودن به سبد"}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            aria-pressed={wished}
            onClick={() => toggleWishlist(product.id)}
          >
            {wished ? "در علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی"}
          </button>
        </div>
      </div>
    </div>
  );
}
