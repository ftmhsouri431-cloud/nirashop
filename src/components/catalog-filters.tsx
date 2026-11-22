"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { CATEGORIES } from "@/lib/types";

export function CatalogFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const category = params.get("category") || "همه";
  const min = params.get("min") || "";
  const max = params.get("max") || "";

  function update(next: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (!v || v === "همه") sp.delete(k);
      else sp.set(k, v);
    });
    startTransition(() => {
      router.push(`/products?${sp.toString()}`);
    });
  }

  return (
    <div
      className={`space-y-5 ${pending ? "opacity-60" : ""}`}
      aria-busy={pending}
    >
      <div>
        <p className="label">دسته‌بندی</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${category === c ? "is-active" : ""}`}
              aria-pressed={category === c}
              onClick={() => update({ category: c })}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:max-w-md">
        <label>
          <span className="label">حداقل قیمت</span>
          <input
            className="field"
            inputMode="numeric"
            placeholder="مثلاً ۱۰۰۰۰۰۰"
            defaultValue={min}
            onBlur={(e) => update({ min: e.target.value.trim() })}
          />
        </label>
        <label>
          <span className="label">حداکثر قیمت</span>
          <input
            className="field"
            inputMode="numeric"
            placeholder="مثلاً ۵۰۰۰۰۰۰"
            defaultValue={max}
            onBlur={(e) => update({ max: e.target.value.trim() })}
          />
        </label>
      </div>
    </div>
  );
}
