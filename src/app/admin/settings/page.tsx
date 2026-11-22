"use client";

import { FormEvent, useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [shopName, setShopName] = useState("");
  const [tagline, setTagline] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        setShopName(d.settings?.shopName || "");
        setTagline(d.settings?.tagline || "");
      });
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopName,
        tagline,
        adminPassword: adminPassword || undefined,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMessage(data.error || "ذخیره ناموفق");
      return;
    }
    setMessage("تنظیمات ذخیره شد.");
    setAdminPassword("");
  }

  return (
    <div className="max-w-xl">
      <h2 className="font-display mb-6 text-3xl">تنظیمات فروشگاه</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <label>
          <span className="label">نام فروشگاه</span>
          <input
            className="field"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />
        </label>
        <label>
          <span className="label">شعار کوتاه</span>
          <input
            className="field"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </label>
        <label>
          <span className="label">رمز جدید ادمین (اختیاری)</span>
          <input
            className="field"
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        {message ? (
          <p className="text-sm" role="status">
            {message}
          </p>
        ) : null}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "در حال ذخیره…" : "ذخیره تنظیمات"}
        </button>
      </form>
    </div>
  );
}
