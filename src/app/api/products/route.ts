import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { newId } from "@/lib/format";
import { createProduct, listProducts } from "@/lib/products";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const admin = searchParams.get("admin") === "1";
  if (admin && !(await requireAdmin())) {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }

  const products = await listProducts({
    publishedOnly: !admin,
    category: searchParams.get("category") || undefined,
    minPrice: searchParams.get("min")
      ? Number(searchParams.get("min"))
      : undefined,
    maxPrice: searchParams.get("max")
      ? Number(searchParams.get("max"))
      : undefined,
  });
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }
  const body = await req.json();
  const product = await createProduct({
    id: body.id || newId("p"),
    name: String(body.name || "").trim(),
    description: String(body.description || "").trim(),
    price: Number(body.price) || 0,
    compareAtPrice:
      body.compareAtPrice == null || body.compareAtPrice === ""
        ? null
        : Number(body.compareAtPrice),
    category: String(body.category || "عمومی"),
    sizes: Array.isArray(body.sizes) ? body.sizes.map(String) : [],
    colors: Array.isArray(body.colors) ? body.colors.map(String) : [],
    images: Array.isArray(body.images) ? body.images.map(String) : [],
    stock: Number(body.stock) || 0,
    published: Boolean(body.published ?? true),
  });
  return NextResponse.json({ product }, { status: 201 });
}
