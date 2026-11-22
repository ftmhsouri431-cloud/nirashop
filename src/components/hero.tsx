import Image from "next/image";
import Link from "next/link";
import { HERO_IMAGE } from "@/lib/types";

export function Hero({
  shopName,
  tagline,
}: {
  shopName: string;
  tagline: string;
}) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[var(--ink)] text-[var(--bone)]">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="فضای مد زنانه بوتیک نیرا شاپ"
          fill
          priority
          sizes="100vw"
          className="hero-media object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/15" />
      </div>

      <div className="container-shop relative z-10 flex min-h-[100svh] flex-col justify-end pb-20 pt-32 md:pb-28">
        <p className="animate-rise font-display text-6xl leading-none tracking-tight md:text-8xl lg:text-[7.5rem]">
          {shopName}
        </p>
        <h1 className="animate-rise-delay mt-7 max-w-md text-lg font-normal leading-9 text-white/90 md:text-xl md:leading-10">
          پوشاک زنانه — مینیمال، لوکس، بی‌صدا شیک
        </h1>
        <p className="animate-rise-delay-2 mt-4 max-w-sm text-sm leading-8 text-white/65">
          {tagline}
        </p>
        <div className="animate-rise-delay-2 mt-10 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="btn btn-primary bg-[var(--bone)] text-[var(--ink)] border-[var(--bone)]"
          >
            ورود به مجموعه
          </Link>
          <Link
            href="/products?category=پیراهن"
            className="btn btn-ghost border-white/35 text-white hover:border-white"
          >
            پیراهن‌ها
          </Link>
        </div>
      </div>
    </section>
  );
}
