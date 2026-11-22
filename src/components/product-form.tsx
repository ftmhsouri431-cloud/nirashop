"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { splitList } from "@/lib/format";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      description: String(fd.get("description") || ""),
      price: Number(fd.get("price") || 0),
      compareAtPrice: fd.get("compareAtPrice")
        ? Number(fd.get("compareAtPrice"))
        : null,
      category: String(fd.get("category") || "عمومی"),
      sizes: splitList(String(fd.get("sizes") || "")),
      colors: splitList(String(fd.get("colors") || "")),
      images: splitList(String(fd.get("images") || "")),
      stock: Number(fd.get("stock") || 0),
      published: fd.get("published") === "on",
    };

    const res = await fetch(
      product ? `/api/products/${product.id}` : "/api/products",
      {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "ذخیره ناموفق بود");
      setBusy(false);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4">
      <label>
        <span className="label">نام محصول</span>
        <input
          name="name"
          className="field"
          required
          defaultValue={product?.name}
        />
      </label>
      <label>
        <span className="label">توضیحات</span>
        <textarea
          name="description"
          className="field min-h-28"
          defaultValue={product?.description}
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="label">قیمت (تومان)</span>
          <input
            name="price"
            className="field"
            type="number"
            min={0}
            required
            defaultValue={product?.price ?? ""}
          />
        </label>
        <label>
          <span className="label">قیمت قبلی (اختیاری)</span>
          <input
            name="compareAtPrice"
            className="field"
            type="number"
            min={0}
            defaultValue={product?.compareAtPrice ?? ""}
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="label">دسته‌بندی</span>
          <select
            name="category"
            className="field"
            defaultValue={product?.category || "پیراهن"}
          >
            <option>پیراهن</option>
            <option>کت و ژاکت</option>
            <option>شلوار و دامن</option>
            <option>تاپ و بلوز</option>
            <option>اکسسوری</option>
          </select>
        </label>
        <label>
          <span className="label">موجودی</span>
          <input
            name="stock"
            className="field"
            type="number"
            min={0}
            defaultValue={product?.stock ?? 0}
          />
        </label>
      </div>
      <label>
        <span className="label">سایزها (با ویرگول)</span>
        <input
          name="sizes"
          className="field"
          placeholder="S, M, L"
          defaultValue={product?.sizes.join(", ")}
        />
      </label>
      <label>
        <span className="label">رنگ‌ها (با ویرگول)</span>
        <input
          name="colors"
          className="field"
          placeholder="مشکی، کرم"
          defaultValue={product?.colors.join(", ")}
        />
      </label>
      <label>
        <span className="label">آدرس تصویر(ها) — هر خط یا با ویرگول</span>
        <textarea
          name="images"
          className="field min-h-24"
          placeholder="https://..."
          defaultValue={product?.images.join("\n")}
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={product?.published ?? true}
        />
        انتشار در فروشگاه
      </label>
      {error ? (
        <p className="text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "در حال ذخیره…" : product ? "بروزرسانی محصول" : "ایجاد محصول"}
      </button>
    </form>
  );
}
