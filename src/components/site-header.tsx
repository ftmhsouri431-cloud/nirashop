"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "@/context/shop-context";

export function SiteHeader({
  shopName,
}: {
  shopName: string;
}) {
  const pathname = usePathname();
  const { cartCount, wishlist } = useShop();
  const links = [
    { href: "/", label: "خانه" },
    { href: "/products", label: "فروشگاه" },
    { href: "/wishlist", label: "علاقه‌مندی" },
    { href: "/cart", label: "سبد" },
  ];

  return (
    <header className="nav-blur sticky top-0 z-40">
      <div className="container-shop flex items-center justify-between gap-4 py-5">
        <Link
          href="/"
          className="font-display text-[1.65rem] tracking-tight md:text-3xl"
          aria-label={`فروشگاه ${shopName}`}
        >
          {shopName}
        </Link>

        <nav
          className="hidden items-center gap-8 text-[0.8rem] tracking-[0.12em] md:flex"
          aria-label="منوی اصلی"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative pb-1 transition-opacity hover:opacity-60 ${
                pathname === l.href ? "opacity-100" : "opacity-70"
              }`}
              aria-current={pathname === l.href ? "page" : undefined}
            >
              {l.label}
              {pathname === l.href ? (
                <span className="absolute inset-x-0 -bottom-0.5 h-px bg-[var(--ink)]" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/wishlist"
            className="icon-btn relative inline-flex h-10 w-10 items-center justify-center border border-[var(--line)] text-sm"
            aria-label={`علاقه‌مندی‌ها، ${wishlist.length} مورد`}
          >
            ♡
            {wishlist.length > 0 ? (
              <span className="absolute -left-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-[var(--ink)] px-1 text-[9px] text-[var(--bone)]">
                {wishlist.length}
              </span>
            ) : null}
          </Link>
          <Link
            href="/cart"
            className="icon-btn relative inline-flex h-10 items-center gap-2 border border-[var(--line)] px-3 text-[0.78rem] tracking-[0.08em]"
            aria-label={`سبد خرید، ${cartCount} کالا`}
          >
            <span>سبد</span>
            <span className="text-[var(--ink-soft)]">
              {cartCount.toLocaleString("fa-IR")}
            </span>
          </Link>
        </div>
      </div>

      <nav
        className="container-shop flex gap-5 overflow-x-auto pb-4 text-[0.8rem] tracking-[0.08em] md:hidden"
        aria-label="منوی موبایل"
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`whitespace-nowrap ${
              pathname === l.href ? "opacity-100" : "opacity-60"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
