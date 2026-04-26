'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Package, User, LogOut, ShoppingBag, ChevronRight, ArrowRight } from 'lucide-react';
import { useCustomer } from '@/context/CustomerContext';

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { customer, loading, logout } = useCustomer();
  const initialTab = searchParams.get('tab') === 'orders' ? 'orders' : 'overview';
  const [tab, setTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!loading && !customer) router.push('/account/login');
  }, [customer, loading, router]);

  useEffect(() => {
    if (customer && tab === 'orders' && orders.length === 0) {
      setOrdersLoading(true);
      fetch('/api/customer/orders')
        .then((r) => r.json())
        .then((d) => setOrders(d.orders || []))
        .catch(() => {})
        .finally(() => setOrdersLoading(false));
    }
  }, [customer, tab]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
  ];

  const initials = customer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <main className="min-h-screen pt-16 bg-zinc-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold tracking-wide shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400">Welcome back</p>
            <h1 className="text-xl font-black text-black tracking-tight truncate">{customer.name}</h1>
            <p className="text-xs text-zinc-400 truncate">{customer.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-zinc-400 hover:text-black border border-zinc-200 hover:border-black px-4 py-2.5 transition-all"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 mb-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-[11px] tracking-[0.2em] uppercase font-medium border-b-2 -mb-px transition-all ${
                tab === id
                  ? 'border-black text-black'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            {/* Account Info */}
            <div className="bg-white border border-zinc-100 p-6">
              <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-5">Account Info</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { label: 'Name', value: customer.name },
                  { label: 'Email', value: customer.email },
                  {
                    label: 'Member Since',
                    value: new Date(customer.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    }),
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-1">{label}</p>
                    <p className="text-sm font-medium text-black truncate">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white border border-zinc-100 p-6">
              <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-4">Quick Actions</p>
              <div className="divide-y divide-zinc-50">
                <button
                  onClick={() => setTab('orders')}
                  className="w-full flex items-center justify-between py-3.5 text-sm text-zinc-700 hover:text-black transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Package size={15} className="text-zinc-300 group-hover:text-black transition-colors" />
                    My Orders
                  </div>
                  <ChevronRight size={14} className="text-zinc-300 group-hover:translate-x-0.5 group-hover:text-black transition-all" />
                </button>
                <Link
                  href="/shop"
                  className="flex items-center justify-between py-3.5 text-sm text-zinc-700 hover:text-black transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={15} className="text-zinc-300 group-hover:text-black transition-colors" />
                    Browse Shop
                  </div>
                  <ChevronRight size={14} className="text-zinc-300 group-hover:translate-x-0.5 group-hover:text-black transition-all" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div className="animate-fade-in">
            {ordersLoading ? (
              <div className="flex justify-center py-20">
                <span className="w-6 h-6 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-white border border-zinc-100">
                <Package size={40} className="text-zinc-200 mx-auto mb-4" />
                <p className="text-zinc-400 text-sm mb-1">No orders yet</p>
                <p className="text-[11px] text-zinc-300">Your paid orders will appear here</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 mt-8 bg-black text-white px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase hover:bg-zinc-800 transition-colors"
                >
                  Shop Now <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white border border-zinc-100 p-6">
                    {/* Order header */}
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-1">Payment ID</p>
                        <p className="text-xs font-mono text-zinc-600">{order.razorpayPaymentId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-1">Total</p>
                        <p className="font-bold text-black">Rs. {order.amount?.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 mb-5">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-zinc-600">
                            {item.name}
                            {item.size ? <span className="text-zinc-400"> ({item.size})</span> : ''}
                            <span className="text-zinc-400"> × {item.quantity}</span>
                          </span>
                          <span className="text-zinc-700 font-medium">
                            Rs. {(item.price * item.quantity)?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                      <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.3em] uppercase bg-green-50 text-green-600 px-2.5 py-1 border border-green-100">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        Paid
                      </span>
                      <p className="text-[11px] text-zinc-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
