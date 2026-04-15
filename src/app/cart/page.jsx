'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

// Dummy coupon codes
const COUPONS = {
  SCHEIN10: 0.10,
  SCHEIN20: 0.20,
  WELCOME: 0.15,
};

export default function CartPage() {
  const { cart, removeItem, updateQty, clearCart, total, count } = useCart();
  const { addToast } = useToast();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const applyCoupon = async () => {
    setCouponLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const pct = COUPONS[coupon.trim().toUpperCase()];
    if (pct) {
      setDiscount(pct);
      setCouponApplied(coupon.trim().toUpperCase());
      addToast(`Coupon applied — ${(pct * 100).toFixed(0)}% off!`);
    } else {
      addToast('Invalid coupon code', 'error');
    }
    setCouponLoading(false);
  };

  const discountAmt = total * discount;
  const finalTotal = total - discountAmt;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const lines = cart.map(
      (item) => `• ${item.name}${item.size ? ` (${item.size})` : ''} x${item.quantity} — Rs. ${(item.price * item.quantity).toLocaleString()}`
    );
    if (couponApplied) lines.push(`\nCoupon: ${couponApplied} (${(discount * 100).toFixed(0)}% off)`);
    lines.push(`\n*Total: Rs. ${finalTotal.toLocaleString()}*`);

    const message = encodeURIComponent(
      `Hello Schein! I'd like to place an order:\n\n${lines.join('\n')}\n\nPlease confirm availability.`
    );

    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917301580009';
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
    setCheckoutLoading(false);
  };

  if (cart.length === 0) {
    return (
      <main className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag size={64} className="text-zinc-200 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-black mb-2">Your cart is empty</h2>
          <p className="text-zinc-400 mb-8">Add some pieces to get started.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors"
          >
            Shop Now <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-1">Your</p>
            <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
            <p className="text-sm text-zinc-400 mt-1">{count} item{count !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => {
              clearCart();
              addToast('Cart cleared');
            }}
            className="text-xs tracking-widest uppercase text-zinc-400 hover:text-red-500 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={item.cartId} className="flex gap-4 pb-6 border-b border-zinc-100">
                {/* Image */}
                <Link href={`/product/${item._id}`} className="relative w-24 h-32 shrink-0 bg-zinc-50 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="96px"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-1">
                    {item.category}
                  </p>
                  <Link
                    href={`/product/${item._id}`}
                    className="text-sm font-medium text-black hover:underline line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  {item.size && (
                    <span className="inline-block mt-1 text-[10px] tracking-widest uppercase bg-zinc-100 text-zinc-500 px-2 py-0.5">
                      Size: {item.size}
                    </span>
                  )}
                  <p className="text-sm font-semibold text-black mt-2">
                    Rs. {item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    {/* Qty control */}
                    <div className="flex items-center border border-zinc-200">
                      <button
                        onClick={() =>
                          item.quantity === 1
                            ? (removeItem(item.cartId), addToast(`${item.name} removed`))
                            : updateQty(item.cartId, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.cartId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Line total + remove */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-black">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => {
                          removeItem(item.cartId);
                          addToast(`${item.name} removed`);
                        }}
                        className="text-zinc-300 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-50 p-6 sticky top-20">
              <h2 className="text-sm tracking-widest uppercase font-semibold text-black mb-6">
                Order Summary
              </h2>

              {/* Coupon */}
              <div className="mb-6">
                <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-2">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="SCHEIN10"
                      disabled={!!couponApplied}
                      className="w-full bg-white border border-zinc-200 pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-black disabled:opacity-50"
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading || !!couponApplied || !coupon.trim()}
                    className="px-3 py-2 bg-black text-white text-xs tracking-widest uppercase disabled:opacity-50 hover:bg-zinc-800 transition-colors"
                  >
                    {couponLoading ? (
                      <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin inline-block" />
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {couponApplied} — {(discount * 100).toFixed(0)}% discount applied
                  </p>
                )}
                <p className="text-[10px] text-zinc-400 mt-1">Try: SCHEIN10, SCHEIN20, WELCOME</p>
              </div>

              <div className="h-px bg-zinc-200 mb-4" />

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-zinc-600">
                  <span>Subtotal ({count} items)</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                    <span>− Rs. {discountAmt.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-zinc-600">
                  <span>Delivery</span>
                  <span className="text-zinc-400">Discussed on WhatsApp</span>
                </div>
              </div>

              <div className="h-px bg-zinc-200 mb-4" />

              <div className="flex justify-between font-bold text-black mb-6">
                <span>Total</span>
                <span>Rs. {finalTotal.toLocaleString()}</span>
              </div>

              {/* Checkout */}
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 text-xs tracking-widest uppercase hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {checkoutLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Checkout via WhatsApp
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <p className="text-[11px] text-zinc-400 text-center mt-3">
                You'll be redirected to WhatsApp to confirm your order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
