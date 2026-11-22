"use client";

import Image from "next/image";
import Link from "next/link";
import { cartKey, useShop } from "@/context/shop-context";
import { formatToman } from "@/lib/format";

export default function CartPage() {
  const { cart, ready, updateQty, removeFromCart, cartTotal } = useShop();

  if (!ready) {
    return (
      <div className="container-shop py-16" aria-busy="true">
        <div className="skeleton h-10 w-48" />
        <div className="skeleton mt-8 h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="container-shop py-10 md:py-16">
      <h1 className="font-display text-4xl md:text-5xl">سبد خرید</h1>
      {cart.length === 0 ? (
        <div className="empty-state mt-10">
          <p className="font-display text-2xl">سبد شما خالی است</p>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            از فروشگاه شروع کنید و قطعهٔ اول را اضافه کنید.
          </p>
          <Link href="/products" className="btn btn-primary mt-6">
            مشاهده محصولات
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
          <ul className="space-y-5" aria-label="اقلام سبد">
            {cart.map((item) => {
              const key = cartKey(item);
              return (
                <li
                  key={key}
                  className="flex gap-4 border-b border-[var(--line)] pb-5"
                >
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-[var(--stone-deep)]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-medium"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-xs text-[var(--ink-soft)]">
                          سایز {item.size} · رنگ {item.color}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        {formatToman(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm">
                        تعداد
                        <input
                          className="field w-20 min-h-10"
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateQty(key, Number(e.target.value) || 1)
                          }
                        />
                      </label>
                      <button
                        type="button"
                        className="text-sm text-[var(--ink-soft)] underline"
                        onClick={() => removeFromCart(key)}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit border border-[var(--line)] bg-white/40 p-6">
            <h2 className="text-lg font-semibold">خلاصه سفارش</h2>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>جمع کل</span>
              <strong>{formatToman(cartTotal)}</strong>
            </div>
            <p className="mt-3 text-xs leading-6 text-[var(--ink-soft)]">
              ارسال فقط داخل ایران: پست ۲۵۰٬۰۰۰ تومان (رایگان بالای ۲۰ میلیون) یا
              فوری تهران ۷۰۰٬۰۰۰ تومان. پرداخت فعلاً آزمایشی است.
            </p>
            <Link href="/checkout" className="btn btn-primary mt-6 w-full">
              ادامه خرید
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
