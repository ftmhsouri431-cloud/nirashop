import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { ProductGrid } from "@/components/product-grid";
import { getProduct, listProducts } from "@/lib/products";
import { getPublicSettings } from "@/lib/settings";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [product, settings] = await Promise.all([
    getProduct(id),
    getPublicSettings(),
  ]);
  if (!product || !product.published) {
    return { title: "محصول یافت نشد" };
  }
  return {
    title: product.name,
    description: product.description.slice(0, 140),
    openGraph: {
      title: `${product.name} | ${settings.shopName}`,
      description: product.description.slice(0, 140),
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
      type: "website",
      locale: "fa_IR",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product || !product.published) notFound();

  const related = (
    await listProducts({
      publishedOnly: true,
      category: product.category,
    })
  )
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "IRR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container-shop py-10 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-display mb-8 text-3xl">ممکن است بپسندید</h2>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </div>
  );
}
