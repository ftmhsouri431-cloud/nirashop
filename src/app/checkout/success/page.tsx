"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatToman } from "@/lib/format";
import type { OrderRecord } from "@/lib/types";

function SuccessInner() {
  const params = useSearchParams();
  const orderId = params.get("orderId") || "";
  const failed = params.get("failed") === "1";
  const [order, setOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order || null))
      .catch(() => setOrder(null));
  }, [orderId]);

  return (
    <div className="container-shop py-16">
      <div className="mx-auto max-w-xl border border-[var(--line)] bg-white/45 p-8 text-center">
        <p className="text-sm text-[var(--ink-soft)]">
          {failed ? "نتیجه پرداخت" : "سفارش ثبت شد"}
        </p>
        <h1 className="font-display mt-2 text-4xl">
          {failed ? "پرداخت کامل نشد" : "از خرید شما سپاسگزاریم"}
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
          {failed
            ? "سفارش شما ذخیره شده اما پرداخت تأیید نشده است. می‌توانید دوباره تلاش کنید یا با فروشگاه تماس بگیرید."
            : "رسید سفارش آماده است. تیم فروشگاه به‌زودی برای هماهنگی ارسال پیام می‌دهد."}
        </p>
        {orderId ? (
          <p className="mt-6 font-mono text-xs">شماره سفارش: {orderId}</p>
        ) : null}
        {order ? (
          <div className="mt-6 space-y-2 text-sm">
            <p>وضعیت: {order.status}</p>
            <p>مبلغ: {formatToman(order.total)}</p>
            <p>
              پرداخت:{" "}
              {order.paymentStatus === "paid" ? "موفق" : order.paymentStatus}
            </p>
          </div>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn btn-primary">
            ادامه خرید
          </Link>
          <Link href="/" className="btn btn-ghost">
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container-shop py-16">
          <div className="skeleton mx-auto h-64 max-w-xl" />
        </div>
      }
    >
      <SuccessInner />
    </Suspense>
  );
}
