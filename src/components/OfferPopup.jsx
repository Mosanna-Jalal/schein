'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, Copy, Check } from 'lucide-react';

const POPUP_KEY    = 'schein_offer_seen';
const HIDE_HOURS   = 24;
const OFFER_CODE   = 'SCHEIN12';
const OFFER_PCT    = '12%';

export default function OfferPopup() {
  const [visible, setVisible]   = useState(false);
  const [mounted, setMounted]   = useState(false);
  const [copied,  setCopied]    = useState(false);
  const [email,   setEmail]     = useState('');
  const [subbed,  setSubbed]    = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(POPUP_KEY);
    const expired = !seen || Date.now() - Number(seen) > HIDE_HOURS * 60 * 60 * 1000;
    if (expired) {
      const t = setTimeout(() => { setMounted(true); setVisible(true); }, 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = (permanent = false) => {
    setVisible(false);
    if (permanent) localStorage.setItem(POPUP_KEY, Date.now().toString());
    setTimeout(() => setMounted(false), 400);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(OFFER_CODE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubLoading(true);
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubbed(true);
    } catch {}
    setSubLoading(false);
  };

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 overflow-y-auto transition-all duration-400 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => dismiss(false)}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-3xl bg-white shadow-2xl my-auto transition-all duration-500 ${
          visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Close — always visible, fixed to modal top-right */}
        <button
          onClick={() => dismiss(true)}
          className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center bg-white text-black shadow-lg hover:bg-zinc-100 active:scale-95 transition-all duration-200 rounded-full"
          aria-label="Close"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-[45%_55%]">

          {/* Left — dark brand panel */}
          <div className="relative bg-zinc-950 px-8 py-12 flex flex-col justify-between min-h-[260px] sm:min-h-[420px] overflow-hidden">
            {/* Ghost watermark */}
            <div className="absolute -bottom-4 -left-2 font-black text-white/[0.05] leading-none select-none pointer-events-none"
              style={{ fontSize: 'clamp(60px, 12vw, 110px)', letterSpacing: '-0.05em' }}>
              SCHEIN
            </div>

            {/* Badge */}
            <div>
              <span className="inline-block text-[9px] tracking-[0.4em] uppercase text-amber-500 border border-amber-500/40 px-3 py-1 mb-6">
                Limited Offer
              </span>
              <p className="text-white/50 text-xs tracking-widest uppercase mb-2">Get</p>
              <h2 className="font-black text-white leading-none mb-3"
                style={{ fontSize: 'clamp(48px, 8vw, 80px)' }}>
                {OFFER_PCT}<br />
                <span className="text-amber-400">Off</span>
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                On your first order. Use the code at checkout.
              </p>
            </div>

            {/* Code box */}
            <button
              onClick={copyCode}
              className="mt-8 flex items-center justify-between gap-3 border border-white/15 px-4 py-3 hover:border-amber-500/50 transition-colors group w-full"
            >
              <div className="text-left">
                <p className="text-[9px] tracking-[0.3em] uppercase text-zinc-600 mb-0.5">Promo Code</p>
                <p className="text-white font-bold tracking-[0.2em] text-sm">{OFFER_CODE}</p>
              </div>
              <div className={`shrink-0 transition-colors ${copied ? 'text-green-400' : 'text-zinc-600 group-hover:text-white'}`}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </div>
            </button>
            {copied && (
              <p className="text-[10px] text-green-400 mt-2 text-center animate-fade-in">Copied to clipboard!</p>
            )}
          </div>

          {/* Right — white CTA panel */}
          <div className="px-8 py-12 flex flex-col justify-center">
            <p className="text-[9px] tracking-[0.5em] uppercase text-zinc-400 mb-3">Schein — 2026 Collection</p>
            <h3 className="text-2xl font-black text-black tracking-tight leading-tight mb-3">
              New drops.<br />Premium pieces.
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
              Subscribe to be the first to know about new collections, restocks, and exclusive member offers — plus unlock your discount code right now.
            </p>

            {subbed ? (
              <div className="flex items-center gap-2 text-green-600 mb-6">
                <Check size={16} />
                <span className="text-sm font-medium">You're subscribed! Use <strong>{OFFER_CODE}</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3 mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
                <button
                  type="submit"
                  disabled={subLoading}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-60"
                >
                  {subLoading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <> Unlock My {OFFER_PCT} Off <ArrowRight size={13} /> </>
                  }
                </button>
              </form>
            )}

            <button
              onClick={() => { dismiss(true); window.location.href = '/shop'; }}
              className="flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-zinc-400 hover:text-black transition-colors"
            >
              Browse without discount <ArrowRight size={12} />
            </button>

            <p className="text-[10px] text-zinc-300 mt-6">
              Valid on first order only · Cannot be combined with other offers
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
