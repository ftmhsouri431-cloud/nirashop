import { formatToman } from "@/lib/format";
import { listOrders } from "@/lib/orders";
import { OrderStatusSelect } from "@/components/order-status-select";

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div>
      <h2 className="font-display mb-6 text-3xl">سفارش‌ها</h2>
      {orders.length === 0 ? (
        <div className="empty-state">هنوز سفارشی ثبت نشده است.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <article
              key={o.id}
              className="border border-[var(--line)] bg-white/40 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-[var(--ink-soft)]">
                    {o.id}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">
                    {o.customerName}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">
                    {o.customerPhone} · {o.shippingCity}
                  </p>
                </div>
                <div className="text-left text-sm">
                  <p className="font-semibold">{formatToman(o.total)}</p>
                  <p className="mt-1 text-[var(--ink-soft)]">
                    پرداخت: {o.paymentStatus}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                {o.customerAddress}
                {o.shippingPostal ? ` — کدپستی ${o.shippingPostal}` : ""}
              </p>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                ارسال: {o.shippingMethod === "tehran_express" ? "فوری تهران" : "پست"}
                {" · "}
                {o.shippingCost === 0
                  ? "رایگان"
                  : `${o.shippingCost.toLocaleString("fa-IR")} تومان`}
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                {o.items.map((item, idx) => (
                  <li key={`${o.id}-${idx}`}>
                    {item.name} · {item.size}/{item.color} ×{" "}
                    {item.quantity.toLocaleString("fa-IR")}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <OrderStatusSelect orderId={o.id} status={o.status} />
                <span className="text-xs text-[var(--ink-soft)]">
                  {new Date(o.createdAt).toLocaleString("fa-IR")}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
