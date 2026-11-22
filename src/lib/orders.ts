import { sql } from "./db";
import { ensureSeeded } from "./seed";
import { newId } from "./format";
import type {
  CartItem,
  OrderPayload,
  OrderRecord,
  OrderStatus,
  PaymentStatus,
} from "./types";

type OrderRow = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  shipping_city: string;
  shipping_postal: string;
  shipping_method: string;
  shipping_cost: number;
  notes: string;
  items: string;
  subtotal: number;
  total: number;
  status: string;
  payment_method: string;
  payment_id: string | null;
  payment_status: string;
  paid_at: string | null;
  created_at: string;
};

function parseItems(value: string | unknown): CartItem[] {
  if (Array.isArray(value)) return value as CartItem[];
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function mapOrder(row: OrderRow): OrderRecord {
  const subtotal = Number(row.subtotal || 0);
  const shippingCost = Number(row.shipping_cost || 0);
  return {
    id: row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerAddress: row.customer_address,
    shippingCity: row.shipping_city || "",
    shippingPostal: row.shipping_postal || "",
    shippingMethod: row.shipping_method || "post",
    shippingCost,
    notes: row.notes || "",
    items: parseItems(row.items),
    subtotal: subtotal || Number(row.total) - shippingCost,
    total: Number(row.total),
    status: row.status as OrderStatus,
    paymentMethod: row.payment_method || "mock",
    paymentId: row.payment_id,
    paymentStatus: (row.payment_status || "pending") as PaymentStatus,
    paidAt: row.paid_at,
    createdAt: row.created_at,
  };
}

async function decrementStock(items: CartItem[]): Promise<void> {
  for (const item of items) {
    await sql(
      `update products set stock = greatest(stock - $2, 0), updated_at = NOW()
       where id = $1`,
      [item.productId, item.quantity],
    );
  }
}

export async function createOrder(
  payload: OrderPayload,
): Promise<OrderRecord> {
  await ensureSeeded();
  const id = newId("o");
  await sql(
    `insert into orders (
      id, customer_name, customer_phone, customer_address,
      shipping_city, shipping_postal, shipping_method, shipping_cost,
      notes, items, subtotal, total, status,
      payment_method, payment_status
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
    [
      id,
      payload.customerName,
      payload.customerPhone,
      payload.customerAddress,
      payload.shippingCity || "",
      payload.shippingPostal || "",
      payload.shippingMethod || "post",
      payload.shippingCost || 0,
      payload.notes || "",
      JSON.stringify(payload.items),
      payload.subtotal,
      payload.total,
      "در انتظار پرداخت",
      payload.paymentMethod || process.env.PAYMENT_PROVIDER || "mock",
      "pending",
    ],
  );
  const order = await getOrder(id);
  if (!order) throw new Error("create order failed");
  return order;
}

export async function getOrder(id: string): Promise<OrderRecord | null> {
  await ensureSeeded();
  const rows = await sql<OrderRow>("select * from orders where id = $1", [id]);
  return rows[0] ? mapOrder(rows[0]) : null;
}

export async function listOrders(): Promise<OrderRecord[]> {
  await ensureSeeded();
  const rows = await sql<OrderRow>(
    "select * from orders order by created_at desc",
  );
  return rows.map(mapOrder);
}

export async function attachPayment(
  orderId: string,
  paymentId: string,
): Promise<OrderRecord | null> {
  await sql(
    `update orders set payment_id = $2, payment_status = 'redirected'
     where id = $1`,
    [orderId, paymentId],
  );
  return getOrder(orderId);
}

export async function markOrderPaid(
  orderId: string,
  paymentId: string,
): Promise<OrderRecord | null> {
  const order = await getOrder(orderId);
  if (!order) return null;
  if (order.paymentStatus === "paid") return order;

  await sql(
    `update orders set
      payment_id = $2,
      payment_status = 'paid',
      status = 'پرداخت‌شده',
      paid_at = NOW()
     where id = $1`,
    [orderId, paymentId],
  );
  await decrementStock(order.items);
  return getOrder(orderId);
}

export async function markOrderPaymentFailed(
  orderId: string,
): Promise<OrderRecord | null> {
  await sql(
    `update orders set payment_status = 'failed' where id = $1`,
    [orderId],
  );
  return getOrder(orderId);
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<OrderRecord | null> {
  await sql(`update orders set status = $2 where id = $1`, [orderId, status]);
  return getOrder(orderId);
}
