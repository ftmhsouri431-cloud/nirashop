"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("در حال تأیید پرداخت…");

  useEffect(() => {
    const orderId = params.get("orderId") || params.get("order_id") || "";
    const paymentId =
      params.get("paymentId") ||
      params.get("Authority") ||
      params.get("authority") ||
      "";
    const status =
      params.get("status") ||
      params.get("Status") ||
      (params.get("Authority") ? "ok" : "fail");

    (async () => {
      const res = await fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentId,
          returnParams: Object.fromEntries(params.entries()),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        router.replace(`/checkout/success?orderId=${orderId}`);
      } else {
        setMessage(data.result?.message || "پرداخت تأیید نشد");
        router.replace(
          `/checkout/success?orderId=${orderId}&failed=1&status=${status}`,
        );
      }
    })();
  }, [params, router]);

  return (
    <div className="container-shop py-24 text-center" aria-live="polite">
      <p className="font-display text-3xl">{message}</p>
      <div className="skeleton mx-auto mt-8 h-2 w-40" />
    </div>
  );
}

export default function CheckoutCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="container-shop py-24 text-center">در حال بارگذاری…</div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
