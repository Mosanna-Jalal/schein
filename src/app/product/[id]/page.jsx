import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductActions from './ProductActions';
import SizeGuide from '@/components/SizeGuide';

async function getProduct(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003'}/api/products/${id}?demo=true`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.product || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: 'Product Not Found — Schein' };
  return {
    title: `${product.name} — Schein`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <main className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase text-zinc-400 hover:text-black transition-colors mb-10"
        >
          <ArrowLeft size={13} />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-zinc-50 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.featured && (
              <div className="absolute top-4 left-4">
                <span className="text-[10px] tracking-widest uppercase bg-black text-white px-3 py-1">
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold text-black leading-tight mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-black mb-6">
              Rs. {product.price.toLocaleString()}
            </p>

            <div className="h-px bg-zinc-100 mb-6" />

            <p className="text-zinc-600 leading-relaxed mb-8">{product.description}</p>

            {/* Product details */}
            <div className="space-y-3 mb-8">
              {[
                ['Category', product.category],
                ['Stock', product.stock > 0 ? 'In Stock' : 'Out of Stock'],
                ['SKU', product._id.slice(-8).toUpperCase()],
              ].map(([key, val]) => (
                <div key={key} className="flex gap-3 text-sm">
                  <span className="text-zinc-400 w-24 shrink-0">{key}</span>
                  <span className="text-black font-medium">{val}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-zinc-100 mb-6" />

            {/* Size guide + recommender */}
            <div className="mb-6">
              <SizeGuide category={product.category} />
            </div>

            {/* Client-side actions (Add to Cart, Wishlist) */}
            <ProductActions product={product} />

            {/* Shipping note */}
            <div className="mt-8 p-4 bg-zinc-50 text-sm text-zinc-500 leading-relaxed">
              <strong className="text-zinc-700">Order via WhatsApp</strong> — Add to cart and
              checkout directly on WhatsApp for a personal shopping experience.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
