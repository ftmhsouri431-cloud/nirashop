import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { attachPayment, createOrder, listOrders } from "@/lib/orders";
import { getPaymentProvider } from "@/lib/payments";
import { getProduct } from "@/lib/products";
import {
  calcShippingCost,
  getShippingOption,
} from "@/lib/shipping";

export const runtime = "nodejs";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const customerName = String(body.customerName || "").trim();
  const customerPhone = String(body.customerPhone || "").trim();
  const customerAddress = String(body.customerAddress || "").trim();
  const shippingCity = String(body.shippingCity || "").trim();
  const shippingPostal = String(body.shippingPostal || "").trim();
  const shippingMethod = String(body.shippingMethod || "post").trim();
  const notes = String(body.notes || "").trim();
  const items = Array.isArray(body.items) ? body.items : [];

  if (!customerName || !customerPhone || !customerAddress || !shippingCity) {
    return NextResponse.json(
      { error: "نام، تلفن، آدرس و شهر الزامی است" },
      { status: 400 },
    );
  }
  if (!getShippingOption(shippingMethod)) {
    return NextResponse.json({ error: "روش ارسال نامعتبر است" }, { status: 400 });
  }
  if (items.length === 0) {
    return NextResponse.json({ error: "سبد خرید خالی است" }, { status: 400 });
  }

  let subtotal = 0;
  for (const item of items) {
    const product = await getProduct(String(item.productId));
    if (!product || !product.published) {
      return NextResponse.json(
        { error: `محصول نامعتبر: ${item.name || item.productId}` },
        { status: 400 },
      );
    }
    if (product.stock < Number(item.quantity || 0)) {
      return NextResponse.json(
        { error: `موجودی کافی نیست: ${product.name}` },
        { status: 400 },
      );
    }
    subtotal += product.price * Number(item.quantity || 0);
    item.price = product.price;
    item.name = product.name;
    item.image = product.images[0] || item.image;
  }

  const shippingCost = calcShippingCost(shippingMethod, subtotal);
  const total = subtotal + shippingCost;

  const order = await createOrder({
    customerName,
    customerPhone,
    customerAddress,
    shippingCity,
    shippingPostal,
    shippingMethod,
    notes,
    items,
    subtotal,
    shippingCost,
    total,
  });

  const origin =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    req.nextUrl.origin ||
    "http://127.0.0.1:3000";
  const callbackUrl = `${origin}/checkout/callback`;

  const provider = getPaymentProvider();
  try {
    const payment = await provider.createPayment({
      orderId: order.id,
      amount: order.total,
      description: `سفارش ${order.id} — ${customerName}`,
      customerName,
      customerPhone,
      callbackUrl,
    });
    await attachPayment(order.id, payment.paymentId);
    return NextResponse.json(
      {
        order: { ...order, paymentId: payment.paymentId },
        payment,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "خطا در ایجاد پرداخت",
        order,
      },
      { status: 502 },
    );
  }
}
