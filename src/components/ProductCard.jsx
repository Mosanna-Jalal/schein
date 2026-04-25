'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const wishlisted = isWishlisted(product._id);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    addItem(product);
    addToast(`${product.name} added to cart`);
    setLoading(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    toggle(product);
    addToast(
      isWishlisted(product._id) ? 'Removed from wishlist' : `${product.name} wishlisted`,
      'success'
    );
    setWishlistLoading(false);
  };

  return (
    <div className="group">
      {/* Clickable area — image + info only */}
      <Link href={`/product/${product._id}`} className="block">
        {/* Image container */}
        <div className="relative overflow-hidden bg-zinc-50 aspect-[3/4]">
          {!imgLoaded && <div className="absolute inset-0 bg-zinc-100 animate-pulse" />}

          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImgLoaded(true)}
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-60"
            aria-label="Toggle wishlist"
          >
            {wishlistLoading ? (
              <span className="w-4 h-4 border-2 border-zinc-300 border-t-rose-500 rounded-full animate-spin block" />
            ) : (
              <Heart size={16} className={wishlisted ? 'fill-rose-500 text-rose-500' : 'text-zinc-600'} />
            )}
          </button>

          {/* Quick view */}
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="flex items-center gap-1 text-[10px] tracking-widest uppercase bg-white/90 backdrop-blur-sm px-2 py-1 text-zinc-700">
              <Eye size={11} />
              Quick View
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          <p className="text-[10px] tracking-widest uppercase text-zinc-400">{product.category}</p>
          <h3 className="text-sm font-medium text-black leading-snug line-clamp-1">{product.name}</h3>
          <p className="text-sm text-zinc-500 line-clamp-1">{product.description}</p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-semibold text-black">
              Rs. {product.price.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to cart — outside Link so it never triggers navigation */}
      <button
        onClick={handleAddToCart}
        disabled={loading || added || isOutOfStock}
        className={`mt-3 w-full flex items-center justify-center gap-2 text-xs tracking-widest uppercase py-3 active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed ${
          isOutOfStock
            ? 'bg-zinc-200 text-zinc-500'
            : added
            ? 'bg-zinc-800 text-white'
            : 'bg-black text-white hover:bg-zinc-800'
        }`}
      >
        {isOutOfStock ? (
          'Out of Stock'
        ) : loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : added ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-green-400"><polyline points="20 6 9 17 4 12"/></svg>
            Added
          </>
        ) : (
          <>
            <ShoppingBag size={14} />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
