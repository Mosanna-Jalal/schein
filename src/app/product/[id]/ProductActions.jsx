'use client';

import { useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

export default function ProductActions({ product }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const wishlisted = isWishlisted(product._id);

  const handleAdd = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    addItem(product);
    addToast(`${product.name} added to cart`);
    setLoading(false);
  };

  const handleWishlist = async () => {
    setWishlistLoading(true);
    await new Promise((r) => setTimeout(r, 350));
    toggle(product);
    addToast(wishlisted ? 'Removed from wishlist' : `${product.name} wishlisted`);
    setWishlistLoading(false);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAdd}
        disabled={loading}
        className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-60"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <ShoppingBag size={15} />
            Add to Cart
          </>
        )}
      </button>

      <button
        onClick={handleWishlist}
        disabled={wishlistLoading}
        className={`p-4 border transition-all active:scale-95 disabled:opacity-60 ${
          wishlisted
            ? 'bg-rose-50 border-rose-200 text-rose-500'
            : 'border-zinc-200 text-zinc-400 hover:border-rose-300 hover:text-rose-400'
        }`}
        aria-label="Toggle wishlist"
      >
        {wishlistLoading ? (
          <span className="w-5 h-5 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin block" />
        ) : (
          <Heart size={20} className={wishlisted ? 'fill-rose-500 text-rose-500' : ''} />
        )}
      </button>
    </div>
  );
}
