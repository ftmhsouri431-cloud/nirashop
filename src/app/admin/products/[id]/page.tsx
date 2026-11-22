import { notFound } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import { getProduct } from "@/lib/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  return (
    <div>
      <h2 className="font-display mb-6 text-3xl">ویرایش محصول</h2>
      <ProductForm product={product} />
    </div>
  );
}
