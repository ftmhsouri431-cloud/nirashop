"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("این محصول حذف شود؟")) return;
    setBusy(true);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  return (
    <button
      type="button"
      className="text-red-800 underline disabled:opacity-50"
      disabled={busy}
      onClick={onDelete}
    >
      حذف
    </button>
  );
}
