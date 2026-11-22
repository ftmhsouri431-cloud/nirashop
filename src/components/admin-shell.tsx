"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

const links = [
  { href: "/admin", label: "خلاصه" },
  { href: "/admin/products", label: "محصولات" },
  { href: "/admin/orders", label: "سفارش‌ها" },
  { href: "/admin/settings", label: "تنظیمات فروشگاه" },
];

export function AdminShell({
  children,
  authenticated,
}: {
  children: ReactNode;
  authenticated: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
    router.push("/admin");
  }

  if (!authenticated) return <>{children}</>;

  return (
    <div className="container-shop py-8 md:py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--ink-soft)]">پنل مدیریت</p>
          <h1 className="font-display text-3xl md:text-4xl">پنل نیرا شاپ</h1>
        </div>
        <button type="button" className="btn btn-ghost" onClick={logout}>
          خروج
        </button>
      </div>
      <nav
        className="mb-8 flex flex-wrap gap-2"
        aria-label="منوی مدیریت"
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`chip ${pathname === l.href ? "is-active" : ""}`}
            aria-current={pathname === l.href ? "page" : undefined}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
