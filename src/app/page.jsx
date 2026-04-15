import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';

async function getFeaturedProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003'}/api/products?featured=true&demo=true`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export const metadata = {
  title: 'Schein — Premium Clothing',
  description: 'Minimal, premium fashion for those who value simplicity and quality.',
};

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <main>
      {/* Hero — full viewport, transparent nav floats on top */}
      <section className="relative min-h-screen bg-black overflow-hidden">
        {/* Deep gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/60 to-black" />
        {/* Top veil — keeps transparent nav text readable at all times */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />

        {/* Ghost brand mark — fills upper void intentionally, hidden on very small screens */}
        <div className="absolute inset-0 items-center justify-center pointer-events-none select-none overflow-hidden hidden sm:flex">
          <span
            className="font-black text-white leading-none tracking-tighter"
            style={{ fontSize: 'clamp(100px, 20vw, 320px)', opacity: 0.04 }}
          >
            SCHEIN
          </span>
        </div>

        {/* Subtle vertical line accent */}
        <div className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-white/[0.06] to-transparent hidden sm:block" style={{ right: '22%' }} />

        {/* Content — flex column that fills full height, content anchored to bottom */}
        <div className="relative z-10 flex flex-col min-h-screen max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full pt-20 pb-12 sm:pb-20">
          {/* This flex-1 spacer pushes content to the bottom */}
          <div className="flex-1" />

          <div className="max-w-xl">
            <p className="text-[10px] tracking-[0.5em] uppercase text-amber-500 mb-4">
              New Collection — 2026
            </p>
            <h1
              className="font-black text-white leading-[0.92] tracking-tight mb-5"
              style={{ fontSize: 'clamp(40px, 8vw, 110px)' }}
            >
              Wear the<br />
              <span className="text-zinc-500">Silence.</span>
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-xs">
              Premium minimalist clothing crafted with intention.
              Less noise, more presence.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-zinc-100 active:scale-95 transition-all duration-200"
              >
                Shop Now
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/shop?category=Men"
                className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-6 py-3 text-[11px] tracking-[0.2em] uppercase hover:border-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                Men
              </Link>
              <Link
                href="/shop?category=Women"
                className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-6 py-3 text-[11px] tracking-[0.2em] uppercase hover:border-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                Women
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 right-6 sm:right-12 flex flex-col items-center gap-2 text-zinc-600 hidden sm:flex">
          <span className="text-[9px] tracking-[0.4em] uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
          <span className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent" />
        </div>
      </section>

      {/* Category strips */}
      <section className="grid grid-cols-1 sm:grid-cols-3 border-y border-zinc-100">
        {[
          { label: 'Men', desc: 'Sharp essentials', href: '/shop?category=Men' },
          { label: 'Women', desc: 'Refined silhouettes', href: '/shop?category=Women' },
          { label: 'Unisex', desc: 'Beyond definition', href: '/shop?category=Unisex' },
        ].map((cat, i) => (
          <Link
            key={cat.label}
            href={cat.href}
            className={`group flex flex-col justify-between px-10 py-12 hover:bg-zinc-50 transition-colors duration-300 ${
              i < 2 ? 'sm:border-r border-zinc-100' : ''
            } border-b sm:border-b-0 border-zinc-100`}
          >
            <div>
              <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-400 mb-3">{cat.desc}</p>
              <h2 className="text-4xl font-black text-black tracking-tight">{cat.label}</h2>
            </div>
            <div className="flex items-center gap-2 mt-8 text-zinc-300 group-hover:text-black transition-colors duration-200">
              <span className="text-[10px] tracking-[0.2em] uppercase">Explore</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>
        ))}
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-24">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-[9px] tracking-[0.5em] uppercase text-zinc-400 mb-3">Curated Selection</p>
            <h2 className="text-4xl font-black text-black tracking-tight">Featured Pieces</h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-zinc-400 hover:text-black transition-colors"
          >
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        <div className="sm:hidden mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase border border-black px-7 py-3.5 hover:bg-black hover:text-white transition-all duration-200"
          >
            View All <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* Brand statement */}
      <section className="bg-zinc-950 py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[9px] tracking-[0.5em] uppercase text-zinc-600 mb-8">Our Philosophy</p>
          <blockquote className="font-light text-white leading-snug tracking-tight"
            style={{ fontSize: 'clamp(24px, 4vw, 44px)' }}>
            "Schein is German for{' '}
            <em className="not-italic font-semibold text-amber-400">shine</em>{' '}
            — we believe every piece should let the wearer glow."
          </blockquote>
          <div className="mt-12 flex items-center justify-center gap-4">
            <span className="w-12 h-px bg-amber-800/40" />
            <span className="text-[9px] tracking-[0.4em] uppercase text-amber-700/60">Est. 2024</span>
            <span className="w-12 h-px bg-amber-800/40" />
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-black text-white py-20 text-center border-t border-white/5">
        <p className="text-[9px] tracking-[0.5em] uppercase text-zinc-600 mb-5">Personal Service</p>
        <h2 className="font-black text-white mb-5 tracking-tight" style={{ fontSize: 'clamp(28px, 5vw, 52px)' }}>
          Order via WhatsApp
        </h2>
        <p className="text-zinc-500 mb-10 max-w-sm mx-auto text-sm leading-relaxed">
          Build your cart, hit checkout, and we'll confirm your order directly. Fast and personal.
        </p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917301580009'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 bg-white text-black px-9 py-4 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-zinc-100 active:scale-95 transition-all duration-200"
        >
          Chat on WhatsApp
          <ArrowRight size={14} />
        </a>
      </section>
    </main>
  );
}
