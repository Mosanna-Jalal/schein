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
  const [razorpayLoading, setRazorpayLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

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

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleRazorpayCheckout = async () => {
    if (cart.length === 0) return;
    setRazorpayLoading(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      addToast('Failed to load payment gateway. Check your connection.', 'error');
      setRazorpayLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal, cartItems: cart }),
      });
      const { success, orderId, error } = await res.json();
      if (!success) throw new Error(error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: finalTotal * 100,
        currency: 'INR',
        name: 'Schein',
        description: `${count} item${count !== 1 ? 's' : ''}`,
        order_id: orderId,
        handler: async (response) => {
          const verify = await fetch('/api/orders/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const result = await verify.json();
          if (result.success) {
            setPaymentSuccess(result.paymentId);
            clearCart();
            addToast('Payment successful! Order confirmed.', 'success');
          } else {
            addToast('Payment verification failed. Contact us on WhatsApp.', 'error');
          }
        },
        modal: { ondismiss: () => setRazorpayLoading(false) },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#000000' },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      addToast(err.message || 'Payment failed. Try WhatsApp order.', 'error');
    }

    setRazorpayLoading(false);
  };

  if (paymentSuccess) {
    return (
      <main className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center px-4 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Payment Successful!</h2>
          <p className="text-zinc-400 mb-2">Your order has been confirmed.</p>
          <p className="text-[11px] tracking-widest uppercase text-zinc-400 mb-8">
            Payment ID: {paymentSuccess}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors"
          >
            Continue Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    );
  }

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

              {/* Pay via Razorpay */}
              <button
                onClick={handleRazorpayCheckout}
                disabled={razorpayLoading || checkoutLoading}
                className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 text-xs tracking-widest uppercase hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-60 mb-3"
              >
                {razorpayLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M4 4h16v2H4zm0 7h16v2H4zm0 7h16v2H4z"/></svg>
                    Pay Now · Rs. {finalTotal.toLocaleString()}
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-3">
                <span className="flex-1 h-px bg-zinc-200" />
                <span className="text-[10px] tracking-widest uppercase text-zinc-400">or</span>
                <span className="flex-1 h-px bg-zinc-200" />
              </div>

              {/* WhatsApp order */}
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading || razorpayLoading}
                className="w-full flex items-center justify-center gap-2 border border-zinc-200 text-zinc-700 py-3.5 text-xs tracking-widest uppercase hover:border-zinc-800 hover:text-black active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {checkoutLoading ? (
                  <span className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.532 5.857L.057 23.882a.5.5 0 0 0 .623.603l6.228-1.633A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 0 1-5.13-1.424l-.368-.22-3.813 1.001.978-3.702-.24-.38A9.95 9.95 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                    Order via WhatsApp
                  </>
                )}
              </button>

              <p className="text-[11px] text-zinc-400 text-center mt-3">
                Pay securely online or confirm via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
