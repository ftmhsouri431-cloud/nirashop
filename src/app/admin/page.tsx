import Link from "next/link";
import { listOrders } from "@/lib/orders";
import { listProducts } from "@/lib/products";
import { getPublicSettings } from "@/lib/settings";
import { formatToman } from "@/lib/format";

export default async function AdminHomePage() {
  const [settings, products, orders] = await Promise.all([
    getPublicSettings(),
    listProducts(),
    listOrders(),
  ]);
  const published = products.filter((p) => p.published).length;
  const paid = orders.filter((o) => o.paymentStatus === "paid");
  const revenue = paid.reduce((n, o) => n + o.total, 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border border-[var(--line)] bg-white/40 p-5">
          <p className="text-sm text-[var(--ink-soft)]">نام فروشگاه</p>
          <p className="mt-2 font-display text-3xl">{settings.shopName}</p>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">{settings.tagline}</p>
        </div>
        <div className="border border-[var(--line)] bg-white/40 p-5">
          <p className="text-sm text-[var(--ink-soft)]">محصولات</p>
          <p className="mt-2 font-display text-3xl">
            {published.toLocaleString("fa-IR")} /{" "}
            {products.length.toLocaleString("fa-IR")}
          </p>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">منتشر / کل</p>
        </div>
        <div className="border border-[var(--line)] bg-white/40 p-5">
          <p className="text-sm text-[var(--ink-soft)]">فروش پرداخت‌شده</p>
          <p className="mt-2 text-lg font-semibold">{formatToman(revenue)}</p>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            {orders.length.toLocaleString("fa-IR")} سفارش کل
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="btn btn-primary">
          افزودن محصول
        </Link>
        <Link href="/admin/orders" className="btn btn-ghost">
          مدیریت سفارش‌ها
        </Link>
        <Link href="/admin/settings" className="btn btn-ghost">
          تغییر نام فروشگاه
        </Link>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">آخرین سفارش‌ها</h2>
        {orders.length === 0 ? (
          <div className="empty-state">هنوز سفارشی ثبت نشده است.</div>
        ) : (
          <ul className="divide-y divide-[var(--line)] border border-[var(--line)] bg-white/35">
            {orders.slice(0, 5).map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <span className="font-mono text-xs">{o.id}</span>
                <span>{o.customerName}</span>
                <span>{o.status}</span>
                <span>{formatToman(o.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
