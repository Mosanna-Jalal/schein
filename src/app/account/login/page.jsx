'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useCustomer } from '@/context/CustomerContext';

export default function AccountLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCustomer } = useCustomer();
  const initialTab = searchParams.get('tab') === 'signup' ? 'register' : 'login';
  const [tab, setTab] = useState(initialTab);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const switchTab = (t) => { setTab(t); setError(''); setForm({ name: '', email: '', password: '' }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const url = tab === 'login' ? '/api/customer/login' : '/api/customer/register';
    const body = tab === 'login'
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password };
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); return; }
      const me = await fetch('/api/customer/me').then((r) => r.json());
      if (me.authenticated) setCustomer(me.customer);
      router.push('/account');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-16 flex items-center justify-center px-4 bg-zinc-50">
      <div className="w-full max-w-sm animate-fade-in">

        {/* Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-black tracking-[0.3em] uppercase text-black">
            Schein
          </Link>
          <p className="text-[10px] text-zinc-400 tracking-[0.4em] uppercase mt-2">Member Area</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-zinc-100 shadow-sm">
          {/* Tab switcher */}
          <div className="flex border-b border-zinc-100">
            {[['login', 'Sign In'], ['register', 'Create Account']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => switchTab(key)}
                className={`flex-1 py-3.5 text-[11px] tracking-[0.2em] uppercase font-medium transition-all ${
                  tab === key
                    ? 'bg-black text-white'
                    : 'text-zinc-400 hover:text-black bg-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {tab === 'register' && (
              <div>
                <label className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Your full name"
                  className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 block mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="your@email.com"
                className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  placeholder={tab === 'register' ? 'Min. 6 characters' : '••••••••'}
                  className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>{tab === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={13} /></>
              )}
            </button>

            <p className="text-[11px] text-zinc-400 text-center pt-1">
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}
                className="text-black underline underline-offset-2 hover:no-underline transition-all"
              >
                {tab === 'login' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </form>
        </div>

        <p className="text-[10px] text-zinc-400 text-center mt-6">
          <Link href="/" className="hover:text-black transition-colors">← Back to shop</Link>
        </p>
      </div>
    </main>
  );
}
