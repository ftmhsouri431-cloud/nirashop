import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deleteProduct, getProduct, updateProduct } from "@/lib/products";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const product = await getProduct(id);
  if (!product || !product.published) {
    const admin = await requireAdmin();
    if (!admin || !product) {
      return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
    }
  }
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json();
  const product = await updateProduct(id, {
    name: body.name != null ? String(body.name).trim() : undefined,
    description:
      body.description != null ? String(body.description).trim() : undefined,
    price: body.price != null ? Number(body.price) : undefined,
    compareAtPrice:
      body.compareAtPrice === undefined
        ? undefined
        : body.compareAtPrice == null || body.compareAtPrice === ""
          ? null
          : Number(body.compareAtPrice),
    category: body.category != null ? String(body.category) : undefined,
    sizes: Array.isArray(body.sizes) ? body.sizes.map(String) : undefined,
    colors: Array.isArray(body.colors) ? body.colors.map(String) : undefined,
    images: Array.isArray(body.images) ? body.images.map(String) : undefined,
    stock: body.stock != null ? Number(body.stock) : undefined,
    published:
      body.published != null ? Boolean(body.published) : undefined,
  });
  if (!product) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
