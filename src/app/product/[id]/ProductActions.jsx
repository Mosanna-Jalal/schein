'use client';

import { useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.532 5.857L.057 23.882a.5.5 0 0 0 .623.603l6.228-1.633A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 0 1-5.13-1.424l-.368-.22-3.813 1.001.978-3.702-.24-.38A9.95 9.95 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
  );
}

export default function ProductActions({ product }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [size, setSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const wishlisted = isWishlisted(product._id);

  const handleAdd = async () => {
    if (!size) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    addItem({ ...product, size });
    addToast(`${product.name} (${size}) added to cart`);
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
    <div>
      {/* Size picker */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">Select Size</p>
          {sizeError && (
            <p className="text-[10px] text-red-500 tracking-wide animate-fade-in">
              Please select a size
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => { setSize(s); setSizeError(false); }}
              className={`min-w-[44px] h-10 px-3 text-xs font-medium border transition-all duration-150 ${
                size === s
                  ? 'bg-black text-white border-black'
                  : sizeError
                  ? 'border-red-300 text-zinc-500 hover:border-zinc-400'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-800 hover:text-black'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
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
              Add to Cart {size ? `· ${size}` : ''}
            </>
          )}
        </button>

        {/* WhatsApp enquiry */}
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917301580009'}?text=${encodeURIComponent(
            `Hi Schein! I'm interested in this item:\n\n*${product.name}*\nCategory: ${product.category}${size ? `\nSize: ${size}` : ''}\nPrice: Rs. ${product.price.toLocaleString()}\n\nCould you confirm availability?`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 border border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-200 active:scale-95 flex items-center justify-center"
          aria-label="Enquire on WhatsApp"
        >
          <WhatsAppIcon />
        </a>

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
    </div>
  );
}
