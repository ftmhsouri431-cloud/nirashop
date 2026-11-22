import { NextRequest, NextResponse } from "next/server";
import {
  getOrder,
  markOrderPaid,
  markOrderPaymentFailed,
} from "@/lib/orders";
import { getPaymentProvider } from "@/lib/payments";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const orderId = String(body.orderId || "");
  const paymentId = String(body.paymentId || "");
  const returnParams =
    body.returnParams && typeof body.returnParams === "object"
      ? (body.returnParams as Record<string, string>)
      : {};

  const order = await getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
  }

  if (!paymentId || !order.paymentId || paymentId !== order.paymentId) {
    return NextResponse.json(
      { error: "شناسه پرداخت با سفارش هم‌خوانی ندارد" },
      { status: 400 },
    );
  }

  if (order.paymentStatus === "paid") {
    return NextResponse.json({ ok: true, order, result: { success: true } });
  }

  const provider = getPaymentProvider(order.paymentMethod);

  // Only pass provider-needed params; never let clients invent mock success.
  const safeParams: Record<string, string> = {
    amount: String(order.total),
  };
  if (order.paymentMethod === "mock") {
    if (returnParams.outcome) safeParams.outcome = String(returnParams.outcome);
    if (returnParams.token) safeParams.token = String(returnParams.token);
  } else {
    for (const [key, value] of Object.entries(returnParams)) {
      if (key === "amount") continue;
      safeParams[key] = String(value);
    }
  }

  const result = await provider.verifyPayment({
    paymentId,
    orderId,
    returnParams: safeParams,
  });

  if (result.success) {
    const paid = await markOrderPaid(orderId, result.paymentId);
    return NextResponse.json({ ok: true, order: paid, result });
  }

  await markOrderPaymentFailed(orderId);
  return NextResponse.json(
    { ok: false, order, result },
    { status: 402 },
  );
}
