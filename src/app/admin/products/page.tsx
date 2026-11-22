import Image from "next/image";
import Link from "next/link";
import { formatToman } from "@/lib/format";
import { listProducts } from "@/lib/products";
import { DeleteProductButton } from "@/components/delete-product-button";

export default async function AdminProductsPage() {
  const products = await listProducts();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-3xl">محصولات</h2>
        <Link href="/admin/products/new" className="btn btn-primary">
          محصول جدید
        </Link>
      </div>
      {products.length === 0 ? (
        <div className="empty-state">
          <p>محصولی نیست. اولین قطعه را اضافه کنید.</p>
          <Link href="/admin/products/new" className="btn btn-primary mt-4">
            افزودن محصول
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[var(--line)] bg-white/35">
          <table className="min-w-full text-sm">
            <thead className="bg-black/5 text-right">
              <tr>
                <th className="px-3 py-3 font-medium">محصول</th>
                <th className="px-3 py-3 font-medium">قیمت</th>
                <th className="px-3 py-3 font-medium">موجودی</th>
                <th className="px-3 py-3 font-medium">وضعیت</th>
                <th className="px-3 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-[var(--line)]">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-11 overflow-hidden bg-[var(--stone-deep)]">
                        {p.images[0] ? (
                          <Image
                            src={p.images[0]}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-[var(--ink-soft)]">
                          {p.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">{formatToman(p.price)}</td>
                  <td className="px-3 py-3">
                    {p.stock.toLocaleString("fa-IR")}
                  </td>
                  <td className="px-3 py-3">
                    {p.published ? "منتشر" : "پیش‌نویس"}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="underline"
                      >
                        ویرایش
                      </Link>
                      <DeleteProductButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
