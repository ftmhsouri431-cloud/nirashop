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

  const provider = getPaymentProvider(order.paymentMethod);
  const result = await provider.verifyPayment({
    paymentId: paymentId || order.paymentId || "",
    orderId,
    returnParams: {
      ...returnParams,
      amount: String(order.total),
    },
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
