import { sql } from "./db";
import { ensureSeeded } from "./seed";
import type { Product } from "./types";

type ProductRow = {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category: string;
  sizes: string;
  colors: string;
  images: string;
  stock: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
};

function parseJsonArray(value: string | unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    compareAtPrice:
      row.compare_at_price == null ? null : Number(row.compare_at_price),
    category: row.category,
    sizes: parseJsonArray(row.sizes),
    colors: parseJsonArray(row.colors),
    images: parseJsonArray(row.images),
    stock: Number(row.stock),
    published: Boolean(row.published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listProducts(opts?: {
  publishedOnly?: boolean;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Product[]> {
  await ensureSeeded();
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (opts?.publishedOnly) {
    clauses.push("published = true");
  }
  if (opts?.category && opts.category !== "همه") {
    params.push(opts.category);
    clauses.push(`category = $${params.length}`);
  }
  if (opts?.minPrice != null && !Number.isNaN(opts.minPrice)) {
    params.push(opts.minPrice);
    clauses.push(`price >= $${params.length}`);
  }
  if (opts?.maxPrice != null && !Number.isNaN(opts.maxPrice)) {
    params.push(opts.maxPrice);
    clauses.push(`price <= $${params.length}`);
  }

  const where = clauses.length ? `where ${clauses.join(" and ")}` : "";
  const rows = await sql<ProductRow>(
    `select * from products ${where} order by created_at desc`,
    params,
  );
  return rows.map(mapProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  await ensureSeeded();
  const rows = await sql<ProductRow>(
    "select * from products where id = $1",
    [id],
  );
  return rows[0] ? mapProduct(rows[0]) : null;
}

export async function createProduct(
  input: Omit<Product, "createdAt" | "updatedAt">,
): Promise<Product> {
  await ensureSeeded();
  await sql(
    `insert into products
      (id, name, description, price, compare_at_price, category, sizes, colors, images, stock, published)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      input.id,
      input.name,
      input.description,
      input.price,
      input.compareAtPrice,
      input.category,
      JSON.stringify(input.sizes),
      JSON.stringify(input.colors),
      JSON.stringify(input.images),
      input.stock,
      input.published,
    ],
  );
  const created = await getProduct(input.id);
  if (!created) throw new Error("create failed");
  return created;
}

export async function updateProduct(
  id: string,
  input: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>,
): Promise<Product | null> {
  await ensureSeeded();
  const current = await getProduct(id);
  if (!current) return null;

  const next = { ...current, ...input };
  await sql(
    `update products set
      name = $2,
      description = $3,
      price = $4,
      compare_at_price = $5,
      category = $6,
      sizes = $7,
      colors = $8,
      images = $9,
      stock = $10,
      published = $11,
      updated_at = NOW()
     where id = $1`,
    [
      id,
      next.name,
      next.description,
      next.price,
      next.compareAtPrice,
      next.category,
      JSON.stringify(next.sizes),
      JSON.stringify(next.colors),
      JSON.stringify(next.images),
      next.stock,
      next.published,
    ],
  );
  return getProduct(id);
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensureSeeded();
  await sql("delete from products where id = $1", [id]);
  return true;
}
