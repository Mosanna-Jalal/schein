'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const INVESTMENT_RANGES = [
  'Rs. 5L – 7L',
  'Rs. 7L – 10L',
  'Rs. 10L – 15L',
  'Rs. 15L+',
];

const EMPTY = {
  name: '', email: '', phone: '', city: '', state: '',
  investment: '', spaceArea: '', experience: '', message: '',
};

export default function FranchiseForm() {
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/franchise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm(EMPTY);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-white border border-zinc-200 p-12 text-center">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 className="text-xl font-bold text-black mb-3">Inquiry Received!</h3>
        <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mx-auto">
          Thank you for your interest in a Schein franchise. Our team will contact you within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 p-8 space-y-5">

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-2">Full Name *</label>
          <input required value={form.name} onChange={(e) => set('name', e.target.value)}
            placeholder="Your name"
            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
        </div>
        <div>
          <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-2">Email *</label>
          <input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
            placeholder="your@email.com"
            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
        </div>
      </div>

      {/* Phone + City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-2">Phone *</label>
          <input required value={form.phone} onChange={(e) => set('phone', e.target.value)}
            placeholder="+91 XXXXX XXXXX"
            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
        </div>
        <div>
          <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-2">City *</label>
          <input required value={form.city} onChange={(e) => set('city', e.target.value)}
            placeholder="Patna, Ranchi, Varanasi..."
            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
        </div>
      </div>

      {/* State + Investment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-2">State *</label>
          <input required value={form.state} onChange={(e) => set('state', e.target.value)}
            placeholder="Bihar, Jharkhand, UP..."
            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
        </div>
        <div>
          <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-2">Investment Capacity *</label>
          <select required value={form.investment} onChange={(e) => set('investment', e.target.value)}
            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white">
            <option value="">Select range</option>
            {INVESTMENT_RANGES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Space + Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-2">Available Space (sq ft)</label>
          <input value={form.spaceArea} onChange={(e) => set('spaceArea', e.target.value)}
            placeholder="e.g. 300 sq ft"
            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
        </div>
        <div>
          <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-2">Business Experience</label>
          <input value={form.experience} onChange={(e) => set('experience', e.target.value)}
            placeholder="e.g. 3 years retail"
            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-2">Additional Message</label>
        <textarea value={form.message} onChange={(e) => set('message', e.target.value)}
          placeholder="Tell us anything else about your plans..."
          rows={4}
          className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none" />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-60">
        {loading
          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <> Submit Inquiry <ArrowRight size={14} /> </>
        }
      </button>

      <p className="text-[10px] text-zinc-400 text-center">
        We'll respond within 48 hours · All information is kept confidential
      </p>
    </form>
  );
}
