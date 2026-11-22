import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getOrder, updateOrderStatus } from "@/lib/orders";
import type { OrderStatus } from "@/lib/types";
import { ORDER_STATUSES } from "@/lib/types";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }
  // Public confirmation needs the order id; strip nothing sensitive beyond what's needed
  return NextResponse.json({ order });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json();
  const status = String(body.status || "") as OrderStatus;
  if (!ORDER_STATUSES.includes(status)) {
    return NextResponse.json({ error: "وضعیت نامعتبر" }, { status: 400 });
  }
  const order = await updateOrderStatus(id, status);
  if (!order) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ order });
}
