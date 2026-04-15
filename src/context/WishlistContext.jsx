'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('schein_wishlist');
      if (stored) setWishlist(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('schein_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggle = (item) => {
    setWishlist((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      return exists ? prev.filter((i) => i._id !== item._id) : [...prev, item];
    });
  };

  const isWishlisted = (id) => wishlist.some((i) => i._id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
