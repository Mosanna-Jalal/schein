import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const TILES = [
  {
    type: 'photo',
    name: 'Women',
    sub: 'Refined silhouettes for every occasion',
    href: '/shop?category=Women',
    img: '/categories/women.avif',
  },
  {
    type: 'typo',
    overline: 'Beyond Definition',
    name: 'Unisex',
    sub: 'Fluid pieces built for everyone — no rules, just presence.',
    href: '/shop?category=Unisex',
  },
  {
    type: 'photo',
    name: 'Men',
    sub: 'Sharp essentials, minimal edge',
    href: '/shop?category=Men',
    img: '/categories/men.avif',
  },
];

export default function CategoryShowcase() {
  return (
    <section className="w-full bg-white">
      {/* Header */}
      <div className="max-w-[1440px] mx-auto flex items-end justify-between px-5 sm:px-8 lg:px-12 pt-12 sm:pt-20 pb-8 sm:pb-10">
        <div>
          <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.4em] uppercase text-zinc-500">
            Shop by Category
          </p>
          <h2
            className="mt-2 sm:mt-3 font-black tracking-tight leading-none uppercase text-black"
            style={{ fontSize: 'clamp(26px, 4vw, 56px)' }}
          >
            Collections
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden sm:inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-zinc-400 hover:text-black transition-colors duration-200"
        >
          See all <ArrowRight size={12} />
        </Link>
      </div>

      {/* Tile grid */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {TILES.map((tile, i) =>
          tile.type === 'photo' ? (
            <PhotoTile key={tile.name} tile={tile} bordered={i > 0} />
          ) : (
            <TypoTile key={tile.name} tile={tile} />
          )
        )}
      </div>
    </section>
  );
}

function PhotoTile({ tile, bordered }) {
  return (
    <Link
      href={tile.href}
      className="group relative block overflow-hidden bg-zinc-900 h-[380px] sm:h-[520px] md:h-[640px]"
    >
      {/* Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={tile.img}
          alt={tile.name}
          fill
          className="object-cover grayscale contrast-[1.02] group-hover:scale-[1.04] transition-transform duration-700"
          style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
        />
      </div>

      {/* Bottom-up gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Left edge divider */}
      {bordered && (
        <span className="absolute top-0 bottom-0 left-0 w-px bg-white/10" />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-10 md:p-12">
        <span />
        <div>
          <h3
            className="font-black text-white uppercase leading-[0.9] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(36px, 6vw, 112px)' }}
          >
            {tile.name}
          </h3>
          <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-sm leading-relaxed text-zinc-400 max-w-[240px] sm:max-w-[280px]">
            {tile.sub}
          </p>
          <span className="inline-flex items-center gap-2 mt-3 sm:mt-4 text-[11px] font-semibold tracking-[0.18em] uppercase text-white">
            Shop
            <ArrowRight
              size={13}
              className="group-hover:translate-x-1.5 transition-transform duration-300"
              style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

function TypoTile({ tile }) {
  return (
    <Link
      href={tile.href}
      className="group relative block overflow-hidden bg-[#fafafa] h-[380px] sm:h-[520px] md:h-[640px]"
    >
      {/* Orange dot */}
      <span className="absolute top-6 right-6 sm:top-12 sm:right-12 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-orange-400 group-hover:scale-125 transition-transform duration-500 z-10" />

      {/* Side edge dividers */}
      <span className="absolute top-0 bottom-0 left-0 w-px bg-zinc-200" />
      <span className="absolute top-0 bottom-0 right-0 w-px bg-zinc-200" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-10 md:p-12 text-black">
        <span />
        <div>
          <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.4em] uppercase text-zinc-500">
            {tile.overline}
          </p>
          <h3
            className="mt-2.5 sm:mt-3 font-black text-black uppercase leading-[0.9] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(36px, 6vw, 112px)' }}
          >
            {tile.name}
          </h3>
          <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-sm leading-relaxed text-zinc-500 max-w-[240px] sm:max-w-[280px]">
            {tile.sub}
          </p>
          <span className="inline-flex items-center gap-2 mt-3 sm:mt-4 text-[11px] font-semibold tracking-[0.18em] uppercase text-black">
            Explore
            <ArrowRight
              size={13}
              className="group-hover:translate-x-1.5 transition-transform duration-300"
              style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
