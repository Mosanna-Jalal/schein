'use client';

import { createContext, useContext, useEffect, useReducer } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((i) => i._id === action.item._id);
      if (existing) {
        return state.map((i) =>
          i._id === action.item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.item, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter((i) => i._id !== action.id);
    case 'UPDATE_QTY':
      return state.map((i) =>
        i._id === action.id ? { ...i, quantity: Math.max(1, action.qty) } : i
      );
    case 'CLEAR':
      return [];
    case 'INIT':
      return action.payload;
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

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id });
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty });
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
