"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: fd.get("password") }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "ورود ناموفق");
      setBusy(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="container-shop flex min-h-[70vh] items-center justify-center py-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border border-[var(--line)] bg-white/45 p-8"
      >
        <p className="text-sm text-[var(--ink-soft)]">دسترسی مدیریت</p>
        <h1 className="font-display mt-2 text-3xl">ورود به پنل</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
          رمز پیش‌فرض در راهنمای فروشگاه آمده و از تنظیمات قابل تغییر است.
        </p>
        <label className="mt-6 block">
          <span className="label">رمز عبور</span>
          <input
            type="password"
            name="password"
            className="field"
            required
            autoComplete="current-password"
          />
        </label>
        {error ? (
          <p className="mt-3 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className="btn btn-primary mt-6 w-full" disabled={busy}>
          {busy ? "در حال ورود…" : "ورود"}
        </button>
      </form>
    </div>
  );
}
