import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-shop py-24 text-center">
      <h1 className="font-display text-4xl">صفحه پیدا نشد</h1>
      <p className="mt-3 text-sm text-[var(--ink-soft)]">
        این مسیر وجود ندارد یا محصول حذف شده است.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        بازگشت به خانه
      </Link>
    </div>
  );
}
