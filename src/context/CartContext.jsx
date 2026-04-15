'use client';

import { createContext, useContext, useEffect, useReducer } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((i) => i.cartId === action.item.cartId);
      if (existing) {
        return state.map((i) =>
          i.cartId === action.item.cartId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.item, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter((i) => i.cartId !== action.cartId);
    case 'UPDATE_QTY':
      return state.map((i) =>
        i.cartId === action.cartId ? { ...i, quantity: Math.max(1, action.qty) } : i
      );
    case 'CLEAR':
      return [];
    case 'INIT':
      // Backfill cartId for items saved before this field existed
      return action.payload.map((i) => ({
        ...i,
        cartId: i.cartId || `${i._id}_${i.size || 'one-size'}`,
      }));
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('schein_cart');
      if (stored) dispatch({ type: 'INIT', payload: JSON.parse(stored) });
    } catch {}
  }, []);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem('schein_cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (item) => {
    const cartId = `${item._id}_${item.size || 'one-size'}`;
    dispatch({ type: 'ADD_ITEM', item: { ...item, cartId } });
  };
  const removeItem = (cartId) => dispatch({ type: 'REMOVE_ITEM', cartId });
  const updateQty = (cartId, qty) => dispatch({ type: 'UPDATE_QTY', cartId, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
