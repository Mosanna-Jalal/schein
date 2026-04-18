'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function FooterNewsletter() {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

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
      setStatus(data.success || res.status === 409 ? 'success' : 'error');
      if (data.success) setEmail('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <p className="text-xs text-green-400 flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
        You're subscribed!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-1">
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
        placeholder="your@email.com"
        required
        className="flex-1 min-w-0 bg-white/5 border border-white/10 text-white placeholder-zinc-600 px-3 py-2 text-xs focus:outline-none focus:border-white/30 transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-3 py-2 bg-white text-black text-xs hover:bg-zinc-200 transition-colors disabled:opacity-50 shrink-0"
        aria-label="Subscribe"
      >
        {status === 'loading'
          ? <span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin block" />
          : <ArrowRight size={13} />
        }
      </button>
      {status === 'error' && <span className="text-[10px] text-red-400 self-center">Try again</span>}
    </form>
  );
}
