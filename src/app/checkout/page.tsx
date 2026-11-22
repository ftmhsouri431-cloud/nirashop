"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { useShop } from "@/context/shop-context";
import { formatToman } from "@/lib/format";
import {
  FREE_POST_THRESHOLD,
  SHIPPING_OPTIONS,
  calcShippingCost,
  type ShippingMethodId,
} from "@/lib/shipping";

export default function CheckoutPage() {
  const { cart, cartTotal, ready, clearCart } = useShop();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethodId>("post");

  const shippingCost = useMemo(
    () => calcShippingCost(shippingMethod, cartTotal),
    [shippingMethod, cartTotal],
  );
  const payable = cartTotal + shippingCost;
  const freePostEligible = cartTotal > FREE_POST_THRESHOLD;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: fd.get("customerName"),
          customerPhone: fd.get("customerPhone"),
          customerAddress: fd.get("customerAddress"),
          shippingCity: fd.get("shippingCity"),
          shippingPostal: fd.get("shippingPostal"),
          shippingMethod,
          notes: fd.get("notes"),
          items: cart,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "ثبت سفارش ناموفق بود");
      }
      if (data.payment?.redirectUrl) {
        clearCart();
        router.push(data.payment.redirectUrl);
        return;
      }
      clearCart();
      router.push(`/checkout/success?orderId=${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
      setBusy(false);
    }
  }

  if (!ready) {
    return (
      <div className="container-shop py-16" aria-busy="true">
        <div className="skeleton h-10 w-56" />
        <div className="skeleton mt-8 h-64 w-full" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container-shop py-16">
        <div className="empty-state">
          <p className="font-display text-2xl">سبدی برای تسویه نیست</p>
          <Link href="/products" className="btn btn-primary mt-6">
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-shop py-10 md:py-16">
      <h1 className="font-display text-4xl md:text-5xl">تسویه حساب</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--ink-soft)]">
        ارسال فقط داخل ایران. آدرس و روش ارسال را انتخاب کنید. پرداخت فعلی
        آزمایشی است؛ درگاه ایرانی (زرین‌پال) از طریق تنظیمات محیطی قابل اتصال
        است.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="space-y-4">
          <label>
            <span className="label">نام و نام خانوادگی</span>
            <input
              name="customerName"
              className="field"
              required
              autoComplete="name"
            />
          </label>
          <label>
            <span className="label">شماره موبایل</span>
            <input
              name="customerPhone"
              className="field"
              required
              inputMode="tel"
              autoComplete="tel"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="label">شهر</span>
              <input name="shippingCity" className="field" required />
            </label>
            <label>
              <span className="label">کد پستی</span>
              <input
                name="shippingPostal"
                className="field"
                inputMode="numeric"
              />
            </label>
          </div>
          <label>
            <span className="label">آدرس کامل ارسال (ایران)</span>
            <textarea
              name="customerAddress"
              className="field min-h-28"
              required
            />
          </label>

          <fieldset>
            <legend className="label">روش ارسال</legend>
            <div className="space-y-3">
              {SHIPPING_OPTIONS.map((opt) => {
                const cost = calcShippingCost(opt.id, cartTotal);
                return (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-start gap-3 border p-4 transition ${
                      shippingMethod === opt.id
                        ? "border-[var(--ink)] bg-white/55"
                        : "border-[var(--line)] bg-white/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      className="mt-1"
                      checked={shippingMethod === opt.id}
                      onChange={() => setShippingMethod(opt.id)}
                    />
                    <span className="flex-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-medium">{opt.label}</span>
                        <span className="text-sm font-semibold">
                          {cost === 0 ? "رایگان" : formatToman(cost)}
                        </span>
                      </span>
                      <span className="mt-1 block text-xs leading-6 text-[var(--ink-soft)]">
                        {opt.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            {freePostEligible ? (
              <p className="mt-3 text-xs text-[var(--sage-deep)]" role="status">
                سفارش شما مشمول ارسال رایگان با پست است.
              </p>
            ) : (
              <p className="mt-3 text-xs text-[var(--ink-soft)]">
                ارسال رایگان با پست برای سفارش‌های بالای{" "}
                {formatToman(FREE_POST_THRESHOLD)}.
              </p>
            )}
          </fieldset>

          <label>
            <span className="label">توضیحات سفارش (اختیاری)</span>
            <textarea name="notes" className="field min-h-20" />
          </label>
        </div>

        <aside className="h-fit border border-[var(--line)] bg-white/40 p-6">
          <h2 className="text-lg font-semibold">پرداخت و ثبت</h2>
          <ul className="mt-4 space-y-2 text-sm text-[var(--ink-soft)]">
            {cart.map((item) => (
              <li key={`${item.productId}-${item.size}-${item.color}`}>
                {item.name} × {item.quantity.toLocaleString("fa-IR")}
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-4 text-sm">
            <div className="flex justify-between gap-3">
              <span>جمع کالا</span>
              <span>{formatToman(cartTotal)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>ارسال</span>
              <span>
                {shippingCost === 0 ? "رایگان" : formatToman(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between gap-3 font-semibold">
              <span>مبلغ قابل پرداخت</span>
              <span>{formatToman(payable)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs leading-6 text-[var(--ink-soft)]">
            درگاه فعلی: آزمایشی (Mock). برای زرین‌پال،
            `PAYMENT_PROVIDER=zarinpal` و `ZARINPAL_MERCHANT_ID` را ست کنید.
          </p>
          {error ? (
            <p className="mt-3 text-sm text-red-800" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="btn btn-primary mt-6 w-full"
            disabled={busy}
          >
            {busy ? "در حال انتقال به پرداخت…" : "ثبت سفارش و پرداخت"}
          </button>
        </aside>
      </form>
    </div>
  );
}
