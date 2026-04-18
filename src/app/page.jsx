import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';
import NewsletterSection from '@/components/NewsletterSection';
import { getBaseUrl } from '@/lib/baseUrl';

async function getFeaturedProducts() {
  try {
    const res = await fetch(
      `${getBaseUrl()}/api/products?featured=true&demo=true`,
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

        {/* Ghost brand mark — fades in slowly */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          style={{ animation: 'hero-fade 2s ease-out 0.6s both' }}
        >
          <span
            className="font-black text-white leading-none tracking-tighter"
            style={{ fontSize: 'clamp(80px, 38vw, 320px)', opacity: 0.04 }}
          >
            SCHEIN
          </span>
        </div>

        {/* Subtle vertical line accent */}
        <div className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-white/[0.06] to-transparent hidden sm:block" style={{ right: '22%' }} />

        {/* Content — flex column that fills full height, content anchored to bottom */}
        <div className="relative z-10 flex flex-col min-h-screen max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full pt-20 pb-12 sm:pb-20">
          <div className="flex-1" />

          <div className="max-w-xl">
            {/* Label — fade up */}
            <p
              className="text-[10px] tracking-[0.5em] uppercase text-amber-500 mb-4"
              style={{ animation: 'hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s both' }}
            >
              New Collection — 2026
            </p>

            {/* Heading — each line clip-reveals from beneath */}
            <h1
              className="font-black text-white leading-[0.92] tracking-tight mb-5"
              style={{ fontSize: 'clamp(40px, 8vw, 110px)' }}
            >
              {/* Line 1 */}
              <span className="block overflow-hidden">
                <span
                  className="block"
                  style={{ animation: 'hero-reveal 0.9s cubic-bezier(0.22,1,0.36,1) 0.35s both' }}
                >
                  Wear the
                </span>
              </span>
              {/* Line 2 */}
              <span className="block overflow-hidden">
                <span
                  className="block text-zinc-500"
                  style={{ animation: 'hero-reveal 0.9s cubic-bezier(0.22,1,0.36,1) 0.5s both' }}
                >
                  Silence.
                </span>
              </span>
            </h1>

            {/* Description — fade up */}
            <p
              className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-xs"
              style={{ animation: 'hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.75s both' }}
            >
              Premium minimalist clothing crafted with intention.
              Less noise, more presence.
            </p>

            {/* Buttons — fade up last */}
            <div
              className="flex flex-wrap gap-3"
              style={{ animation: 'hero-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.95s both' }}
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-zinc-100 active:scale-95 transition-all duration-200"
              >
                Shop Now
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/shop?category=Women"
                className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-6 py-3 text-[11px] tracking-[0.2em] uppercase hover:border-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                Women
              </Link>
              <Link
                href="/shop?category=Kid"
                className="inline-flex items-center gap-2 border border-white/20 text-white/70 px-6 py-3 text-[11px] tracking-[0.2em] uppercase hover:border-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                Kid
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
          { label: 'Women', desc: 'Refined silhouettes', href: '/shop?category=Women' },
          { label: 'Kid', desc: 'Young essentials', href: '/shop?category=Kid' },
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

      {/* Newsletter */}
      <NewsletterSection />

      {/* Map + WhatsApp — split section */}
      <section className="grid grid-cols-1 lg:grid-cols-[41%_59%] min-h-[390px]">

        {/* Left — Google Maps */}
        <div className="bg-zinc-950 flex items-center justify-center p-6 lg:p-10 h-[300px] lg:h-auto">
          <div className="relative w-full h-full overflow-hidden shadow-2xl ring-1 ring-white/10">
            <iframe
              title="SCHÉIN STORE location"
              src="https://maps.google.com/maps?q=Gate+no-3+near+MI+Plaza+opposite+Gaya+Club+White+House+Compound+Judges+Colony+Gaya+Bihar+823001&output=embed&z=16"
              width="100%"
              height="100%"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0, filter: 'grayscale(20%) contrast(1.05) brightness(0.97)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Address chip over map */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-sm px-4 py-3 shadow-lg max-w-xs">
              <p className="text-[9px] tracking-[0.3em] uppercase text-amber-500 mb-0.5">SCHÉIN STORE</p>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Gate no-3, near M I Plaza, opp. Gaya Club,<br />
                Judges Colony, Gaya, Bihar 823001
              </p>
              <a
                href="https://maps.google.com/?q=Gate+no-3+SCHEIN+STORE+near+MI+Plaza+opposite+Gaya+Club+White+House+Compound+Judges+Colony+Gaya+Bihar+823001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] tracking-widest uppercase text-black font-semibold mt-2 hover:text-amber-600 transition-colors"
              >
                Get Directions <ArrowRight size={11} />
              </a>
            </div>
          </div>
        </div>

        {/* Right — WhatsApp CTA */}
        <div className="bg-black text-white flex flex-col items-center justify-center text-center px-8 py-20">
          <p className="text-[9px] tracking-[0.5em] uppercase text-zinc-600 mb-5">Personal Service</p>
          <h2 className="font-black text-white mb-5 tracking-tight" style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}>
            Order via WhatsApp
          </h2>
          <p className="text-zinc-500 mb-4 max-w-xs text-sm leading-relaxed">
            Build your cart, hit checkout, and we'll confirm your order directly. Fast and personal.
          </p>
          <div className="flex items-center gap-2 mb-10">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-zinc-500">Mon – Sun · 10 AM – 10 PM</span>
          </div>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917301580009'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-white text-black px-9 py-4 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-zinc-100 active:scale-95 transition-all duration-200"
          >
            Chat on WhatsApp
            <ArrowRight size={14} />
          </a>
        </div>

      </section>
    </main>
  );
}
