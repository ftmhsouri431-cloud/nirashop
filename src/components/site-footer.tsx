import Link from "next/link";

export function SiteFooter({
  shopName,
  tagline,
}: {
  shopName: string;
  tagline: string;
}) {
  return (
    <footer className="mt-24 border-t border-[var(--line)]">
      <div className="container-shop grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl">{shopName}</p>
          <p className="mt-4 max-w-xs text-sm leading-8 text-[var(--ink-soft)]">
            {tagline}
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs tracking-[0.14em] text-[var(--ink-soft)]">
            خرید
          </p>
          <ul className="space-y-3 text-sm text-[var(--ink-soft)]">
            <li>
              <Link href="/products">همه محصولات</Link>
            </li>
            <li>
              <Link href="/products?category=پیراهن">پیراهن</Link>
            </li>
            <li>
              <Link href="/products?category=شلوار و دامن">شلوار و دامن</Link>
            </li>
            <li>
              <Link href="/wishlist">علاقه‌مندی‌ها</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-xs tracking-[0.14em] text-[var(--ink-soft)]">
            ارسال
          </p>
          <ul className="space-y-3 text-sm text-[var(--ink-soft)]">
            <li>فقط داخل ایران</li>
            <li>پست ۲۵۰٬۰۰۰ تومان</li>
            <li>فوری تهران ۷۰۰٬۰۰۰</li>
            <li>پست رایگان بالای ۲۰ میلیون</li>
          </ul>
        </div>
      </div>
      <div className="container-shop divider mb-8" />
      <p className="container-shop pb-10 text-xs tracking-[0.06em] text-[var(--ink-soft)]">
        © {new Date().getFullYear()} {shopName}
      </p>
    </footer>
  );
}
