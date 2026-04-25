'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Heart } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';
import { useWishlist } from '@/context/WishlistContext';

const CATEGORIES = ['All', 'Women', 'Kid', 'Unisex', 'Accessories'];
const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'views_desc', label: 'Most Popular' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { wishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('createdAt_desc');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showWishlist, setShowWishlist] = useState(searchParams.get('wishlist') === 'true');

  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'All';
    const match = CATEGORIES.find((c) => c.toLowerCase() === urlCategory.toLowerCase()) || 'All';
    setCategory(match);
    setShowWishlist(searchParams.get('wishlist') === 'true');
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [sortField, sortOrder] = sort.split('_');
      const params = new URLSearchParams();
      if (category !== 'All') params.set('category', category);
      params.set('sort', sortField);
      params.set('order', sortOrder);
      params.set('minPrice', priceRange[0]);
      params.set('maxPrice', priceRange[1]);
      params.set('merged', 'true');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, sort, priceRange]);

  useEffect(() => {
    if (!showWishlist) fetchProducts();
    else setLoading(false);
  }, [fetchProducts, showWishlist]);

  const displayProducts = showWishlist ? wishlist : products;

  return (
    <div className="min-h-screen pt-16">
      {/* Page header */}
      <div className="border-b border-zinc-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-1">Schein</p>
              <h1 className="text-3xl font-bold text-black">
                {showWishlist ? 'Wishlist' : category === 'All' ? 'All Products' : category}
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                {loading ? '…' : `${displayProducts.length} item${displayProducts.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Wishlist toggle */}
              <button
                onClick={() => setShowWishlist((v) => !v)}
                className={`flex items-center gap-2 text-xs tracking-widest uppercase px-3 py-2 border transition-colors ${
                  showWishlist
                    ? 'bg-black text-white border-black'
                    : 'border-zinc-200 text-zinc-600 hover:border-black'
                }`}
              >
                <Heart size={13} />
                Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
              </button>
              {/* Filter toggle */}
              {!showWishlist && (
                <button
                  onClick={() => setFilterOpen((v) => !v)}
                  className="flex items-center gap-2 text-xs tracking-widest uppercase px-3 py-2 border border-zinc-200 hover:border-black transition-colors"
                >
                  <SlidersHorizontal size={13} />
                  Filter
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showWishlist && (
          <>
            {/* Category pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCategory(c);
                    const params = new URLSearchParams(searchParams.toString());
                    if (c === 'All') params.delete('category');
                    else params.set('category', c);
                    const qs = params.toString();
                    router.replace(qs ? `/shop?${qs}` : '/shop', { scroll: false });
                  }}
                  className={`text-[11px] tracking-widest uppercase px-4 py-2 transition-colors ${
                    category === c
                      ? 'bg-amber-500 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Filter + Sort bar */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                filterOpen ? 'max-h-96 mb-8' : 'max-h-0'
              }`}
            >
              <div className="bg-zinc-50 p-6 border border-zinc-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs tracking-widest uppercase text-zinc-600">Filters</h3>
                  <button onClick={() => setFilterOpen(false)}>
                    <X size={16} className="text-zinc-400" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Sort */}
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-2">
                      Sort By
                    </label>
                    <div className="relative">
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full appearance-none bg-white border border-zinc-200 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:border-black"
                      >
                        {SORT_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                  {/* Price range */}
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-2">
                      Max Price: Rs. {priceRange[1].toLocaleString()}
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={50000}
                      step={500}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                      className="w-full accent-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sort bar (always visible) */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-zinc-400">
                {loading ? 'Loading…' : `${products.length} products`}
              </p>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-transparent border-b border-zinc-300 pb-1 pr-6 text-xs tracking-widest uppercase text-zinc-600 focus:outline-none focus:border-black cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </>
        )}

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-zinc-300 text-5xl mb-4">{showWishlist ? '♡' : '○'}</p>
            <p className="text-zinc-500 text-sm tracking-widest uppercase">
              {showWishlist ? 'Your wishlist is empty' : 'No products found'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
