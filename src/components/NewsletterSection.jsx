'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | duplicate
  const [msg, setMsg]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');

    try {
      const res  = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setEmail('');
      } else if (res.status === 409) {
        setStatus('duplicate');
        setMsg("You're already on the list.");
      } else {
        setStatus('error');
        setMsg(data.error || 'Something went wrong. Try again.');
      }
    } catch {
      setStatus('error');
      setMsg('Network error. Try again.');
    }
  };

  return (
    <section className="bg-zinc-950 py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-[9px] tracking-[0.5em] uppercase text-zinc-600 mb-4">Stay in the loop</p>
        <h2 className="font-black text-white tracking-tight mb-3" style={{ fontSize: 'clamp(24px, 4vw, 40px)' }}>
          New drops. First.
        </h2>
        <p className="text-zinc-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
          Subscribe for exclusive access to new collections, restocks, and member-only offers.
        </p>

        {status === 'success' ? (
          <div className="flex items-center justify-center gap-2 text-green-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-sm tracking-wide">You're subscribed — welcome to Schein.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
              placeholder="your@email.com"
              required
              className="flex-1 bg-white/5 border border-white/10 text-white placeholder-zinc-600 px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-zinc-100 active:scale-95 transition-all disabled:opacity-60"
            >
              {status === 'loading' ? (
                <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>Subscribe <ArrowRight size={13} /></>
              )}
            </button>
          </form>
        )}

        {(status === 'error' || status === 'duplicate') && (
          <p className="mt-3 text-xs text-red-400">{msg}</p>
        )}
      </div>
    </section>
  );
}
