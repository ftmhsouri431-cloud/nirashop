"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { formatToman } from "@/lib/format";

function PayInner() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("orderId") || "";
  const paymentId = params.get("paymentId") || "";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function complete(status: "ok" | "fail") {
    setBusy(true);
    setError("");
    const token =
      status === "ok"
        ? params.get("okToken") || ""
        : params.get("failToken") || "";
    const res = await fetch("/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        paymentId,
        returnParams: { outcome: status, token, provider: "mock" },
      }),
    });
    const data = await res.json();
    if (status === "ok" && data.ok) {
      router.push(`/checkout/success?orderId=${orderId}`);
      return;
    }
    if (status === "fail") {
      router.push(`/checkout/success?orderId=${orderId}&failed=1`);
      return;
    }
    setError(data.error || data.result?.message || "تأیید پرداخت ناموفق");
    setBusy(false);
  }

  return (
    <div className="container-shop py-16">
      <div className="mx-auto max-w-lg border border-[var(--line)] bg-white/50 p-8">
        <p className="text-sm text-[var(--ink-soft)]">درگاه آزمایشی</p>
        <h1 className="font-display mt-2 text-3xl">پرداخت امن شبیه‌سازی‌شده</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
          این صفحه جای درگاه واقعی (مثل زرین‌پال) است. برای ادامه، پرداخت را
          موفق یا ناموفق کنید.
        </p>
        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt>شماره سفارش</dt>
            <dd className="font-mono text-xs">{orderId}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>شناسه پرداخت</dt>
            <dd className="font-mono text-xs">{paymentId}</dd>
          </div>
        </dl>
        {error ? (
          <p className="mt-4 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-sage"
            disabled={busy || !orderId}
            onClick={() => complete("ok")}
          >
            پرداخت موفق
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={busy || !orderId}
            onClick={() => complete("fail")}
          >
            پرداخت ناموفق
          </button>
        </div>
        <p className="mt-6 text-xs text-[var(--ink-soft)]">
          مبلغ واقعی از سرور خوانده می‌شود؛ نمایش آزمایشی فقط برای جریان خرید است.
          {` `}
          <span className="opacity-0">{formatToman(0)}</span>
        </p>
        <Link href="/cart" className="mt-4 inline-block text-sm underline">
          بازگشت به سبد
        </Link>
      </div>
    </div>
  );
}

export default function MockPayPage() {
  return (
    <Suspense
      fallback={
        <div className="container-shop py-16">
          <div className="skeleton mx-auto h-64 max-w-lg" />
        </div>
      }
    >
      <PayInner />
    </Suspense>
  );
}
