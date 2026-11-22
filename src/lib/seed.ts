import { sql } from "./db";

const DEFAULT_PASSWORD =
  process.env.ADMIN_PASSWORD?.trim() || "nira1403";

export const DEFAULT_SETTINGS = {
  shopName: "نیرا شاپ",
  tagline: "مینیمال لوکس برای کمد زنانه",
};

type SeedProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
};

/** Women’s boutique sample catalog — 8 pieces. */
const SEED_PRODUCTS: SeedProduct[] = [
  {
    id: "p-wool-coat",
    name: "کت بلند پشمی",
    description:
      "کت بلند زنانه با پشم نرم و یقهٔ کلاسیک؛ انتخاب فصل سرد برای استایل شهری شیک.",
    price: 5890000,
    compareAtPrice: 6500000,
    category: "کت و ژاکت",
    sizes: ["S", "M", "L"],
    colors: ["زغال", "شتری"],
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 10,
  },
  {
    id: "p-linen-dress",
    name: "پیراهن لینن تابستانی",
    description:
      "پیراهن لینن سبک با برش آزاد و آستین کوتاه؛ خنک، راحت و مناسب روزهای گرم.",
    price: 2450000,
    compareAtPrice: null,
    category: "پیراهن",
    sizes: ["S", "M", "L"],
    colors: ["عاجی", "زیتونی روشن"],
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 18,
  },
  {
    id: "p-wide-pants",
    name: "شلوار گشاد کتان",
    description:
      "شلوار گشاد زنانه از کتان نرم با کمر راحت؛ پایهٔ عالی برای استایل مینیمال.",
    price: 1890000,
    compareAtPrice: 2100000,
    category: "شلوار و دامن",
    sizes: ["36", "38", "40", "42"],
    colors: ["شن", "مشکی"],
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 16,
  },
  {
    id: "p-silk-blouse",
    name: "بلوز ابریشمی نرم",
    description:
      "بلوز ابریشمی با یقهٔ ملایم و آستین بالونی؛ حس لوکس برای قرار و محیط کار.",
    price: 2750000,
    compareAtPrice: 3190000,
    category: "تاپ و بلوز",
    sizes: ["S", "M", "L"],
    colors: ["شامپاینی", "زغال"],
    images: [
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 14,
  },
  {
    id: "p-pleated-skirt",
    name: "دامن پلیسه میدی",
    description:
      "دامن میدی با پلیسه ظریف و افت طبیعی؛ کامل‌کنندهٔ بلوز ساده یا کت کوتاه.",
    price: 1590000,
    compareAtPrice: null,
    category: "شلوار و دامن",
    sizes: ["S", "M", "L"],
    colors: ["کرم", "سورمه‌ای"],
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 15,
  },
  {
    id: "p-knit-cardigan",
    name: "کاردیگان بافت ظریف",
    description:
      "کاردیگان سبک با بافت نرم و دکمهٔ صدفی؛ لایه‌ای شیک روی تاپ و پیراهن.",
    price: 1980000,
    compareAtPrice: null,
    category: "کت و ژاکت",
    sizes: ["S", "M", "L"],
    colors: ["کرم", "خاکستری مرواریدی"],
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 20,
  },
  {
    id: "p-satin-set",
    name: "ست تاپ و شلوار ساتن",
    description:
      "ست دو تکه ساتن با درخشش ملایم؛ مناسب مهمانی و استایل شب زنانه.",
    price: 4250000,
    compareAtPrice: 4800000,
    category: "پیراهن",
    sizes: ["S", "M", "L"],
    colors: ["مشکی", "زرشکی"],
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 8,
  },
  {
    id: "p-leather-bag",
    name: "کیف دوشی چرمی",
    description:
      "کیف دوشی چرم با بند قابل تنظیم؛ اکسسوری روزمره با دوخت تمیز بوتیک.",
    price: 3120000,
    compareAtPrice: null,
    category: "اکسسوری",
    sizes: ["یک سایز"],
    colors: ["قهوه‌ای گرم", "مشکی"],
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
    ],
    stock: 12,
  },
];

let seeded = false;

export async function ensureSeeded(): Promise<void> {
  if (seeded) return;

  const existing = await sql<{ c: string }>(
    "select count(*)::text as c from products",
  );
  const count = Number(existing[0]?.c ?? 0);

  if (count === 0) {
    for (const p of SEED_PRODUCTS) {
      await sql(
        `insert into products
          (id, name, description, price, compare_at_price, category, sizes, colors, images, stock, published)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true)`,
        [
          p.id,
          p.name,
          p.description,
          p.price,
          p.compareAtPrice,
          p.category,
          JSON.stringify(p.sizes),
          JSON.stringify(p.colors),
          JSON.stringify(p.images),
          p.stock,
        ],
      );
    }
  }

  const name = await sql<{ value: string }>(
    "select value from settings where key = $1",
    ["shop_name"],
  );
  if (!name[0]) {
    await sql("insert into settings (key, value) values ($1, $2)", [
      "shop_name",
      DEFAULT_SETTINGS.shopName,
    ]);
    await sql("insert into settings (key, value) values ($1, $2)", [
      "tagline",
      DEFAULT_SETTINGS.tagline,
    ]);
    await sql("insert into settings (key, value) values ($1, $2)", [
      "admin_password",
      DEFAULT_PASSWORD,
    ]);
  } else if (
    name[0].value === "آتلیه" ||
    name[0].value === "نیرا"
  ) {
    // Migrate prior temporary brand names to current default
    await sql(
      `insert into settings (key, value) values ('shop_name', $1)
       on conflict (key) do update set value = excluded.value`,
      [DEFAULT_SETTINGS.shopName],
    );
    const tag = await sql<{ value: string }>(
      "select value from settings where key = $1",
      ["tagline"],
    );
    if (
      !tag[0] ||
      tag[0].value === "بوتیک زنانه با حس لوکس و مینیمال" ||
      tag[0].value === "لباس‌هایی با حس بوتیک مدرن"
    ) {
      await sql(
        `insert into settings (key, value) values ('tagline', $1)
         on conflict (key) do update set value = excluded.value`,
        [DEFAULT_SETTINGS.tagline],
      );
    }
  }

  seeded = true;
}
