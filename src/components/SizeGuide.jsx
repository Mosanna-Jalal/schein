'use client';

import { useState } from 'react';
import { X, Ruler, ChevronRight } from 'lucide-react';

// ─── Size chart data ────────────────────────────────────────────────────────
const SIZE_CHART = {
  Kid: [
    { size: 'XS', chest: [56, 60], waist: [52, 56], hips: [60, 64],  height: [104, 110] },
    { size: 'S',  chest: [60, 64], waist: [56, 60], hips: [64, 68],  height: [110, 116] },
    { size: 'M',  chest: [64, 68], waist: [60, 64], hips: [68, 72],  height: [116, 122] },
    { size: 'L',  chest: [68, 72], waist: [64, 68], hips: [72, 76],  height: [122, 128] },
    { size: 'XL', chest: [72, 76], waist: [68, 72], hips: [76, 80],  height: [128, 134] },
    { size: 'XXL',chest: [76, 80], waist: [72, 76], hips: [80, 84],  height: [134, 140] },
  ],
  Women: [
    { size: 'XS', chest: [76, 80], waist: [58, 62], hips: [84, 88],  height: [150, 160] },
    { size: 'S',  chest: [80, 84], waist: [62, 66], hips: [88, 92],  height: [158, 165] },
    { size: 'M',  chest: [84, 88], waist: [66, 70], hips: [92, 96],  height: [163, 170] },
    { size: 'L',  chest: [88, 94], waist: [70, 76], hips: [96, 102], height: [168, 175] },
    { size: 'XL', chest: [94,100], waist: [76, 82], hips: [102,108], height: [173, 180] },
    { size: 'XXL',chest: [100,106],waist: [82, 88], hips: [108,114], height: [178, 186] },
  ],
  Unisex: [
    { size: 'XS', chest: [76, 82], waist: [62, 68], hips: [82, 88],  height: [150, 163] },
    { size: 'S',  chest: [82, 88], waist: [68, 74], hips: [88, 94],  height: [160, 170] },
    { size: 'M',  chest: [88, 94], waist: [74, 80], hips: [94, 100], height: [167, 176] },
    { size: 'L',  chest: [94,100], waist: [80, 86], hips: [100,106], height: [173, 181] },
    { size: 'XL', chest: [100,106],waist: [86, 92], hips: [106,112], height: [179, 187] },
    { size: 'XXL',chest: [106,114],waist: [92, 99], hips: [112,119], height: [184, 194] },
  ],
};

// ─── Recommendation algorithm ────────────────────────────────────────────────
function scoreMeasurement(value, [min, max], weight) {
  if (!value) return { score: 0, weight: 0 };
  const mid = (min + max) / 2;
  const range = max - min;
  let score;
  if (value >= min && value <= max) {
    // Perfect fit — score proportional to how centered
    score = 1 - (Math.abs(value - mid) / (range / 2)) * 0.1;
  } else {
    // Penalise proportionally to how far outside the range
    const overshoot = value < min ? min - value : value - max;
    score = Math.max(0, 1 - overshoot / (range * 1.5));
  }
  return { score: score * weight, weight };
}

function recommendSize(gender, { chest, waist, hips, height }) {
  const chart = SIZE_CHART[gender] || SIZE_CHART.Unisex;

  const results = chart.map((entry) => {
    const scores = [
      scoreMeasurement(chest,  entry.chest,  4), // chest  — highest priority
      scoreMeasurement(waist,  entry.waist,  3), // waist
      scoreMeasurement(hips,   entry.hips,   2), // hips
      scoreMeasurement(height, entry.height, 1), // height — tiebreaker only
    ];
    const totalWeight = scores.reduce((s, r) => s + r.weight, 0);
    const totalScore  = scores.reduce((s, r) => s + r.score,  0);
    return { size: entry.size, score: totalWeight ? totalScore / totalWeight : 0 };
  });

  results.sort((a, b) => b.score - a.score);
  const best   = results[0];
  const second = results[1];
  const borderline = (best.score - second.score) < 0.12; // gap < 12% → borderline

  return {
    size:       best.size,
    altSize:    borderline ? second.size : null,
    confidence: best.score >= 0.85 ? 'high' : best.score >= 0.65 ? 'medium' : 'low',
  };
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function SizeGuide({ category }) {
  const [open,   setOpen]   = useState(false);
  const [tab,    setTab]    = useState('finder'); // 'finder' | 'chart'
  const [gender, setGender] = useState(
    category === 'Kid' ? 'Kid' : category === 'Women' ? 'Women' : 'Unisex'
  );
  const [unit,   setUnit]   = useState('cm'); // 'cm' | 'in'
  const [form,   setForm]   = useState({ chest: '', waist: '', hips: '', height: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toNum = (v) => {
    const n = parseFloat(v);
    return isNaN(n) ? null : unit === 'in' ? Math.round(n * 2.54) : n;
  };

  const handleFind = async () => {
    const measurements = {
      chest:  toNum(form.chest),
      waist:  toNum(form.waist),
      hips:   toNum(form.hips),
      height: toNum(form.height),
    };
    if (!measurements.chest && !measurements.waist) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // feel of computation
    setResult(recommendSize(gender, measurements));
    setLoading(false);
  };

  const reset = () => {
    setForm({ chest: '', waist: '', hips: '', height: '' });
    setResult(null);
  };

  const chart = SIZE_CHART[gender] || SIZE_CHART.Unisex;

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-zinc-500 hover:text-black transition-colors underline underline-offset-4 decoration-zinc-300 hover:decoration-black"
      >
        <Ruler size={13} />
        Size Guide &amp; Recommender
      </button>

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-white w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto sm:rounded-none">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-400">Schein</p>
                <h2 className="text-base font-black tracking-tight">Size Guide</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 text-zinc-400 hover:text-black transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-100">
              {[
                { key: 'finder', label: 'Find My Size' },
                { key: 'chart',  label: 'Size Chart' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold transition-colors ${
                    tab === t.key
                      ? 'text-black border-b-2 border-black -mb-px'
                      : 'text-zinc-400 hover:text-black'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* ── FINDER TAB ── */}
              {tab === 'finder' && (
                <div>
                  {/* Gender + unit row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-2">
                      {['Kid', 'Women', 'Unisex'].map((g) => (
                        <button
                          key={g}
                          onClick={() => { setGender(g); reset(); }}
                          className={`px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase border transition-colors ${
                            gender === g
                              ? 'bg-black text-white border-black'
                              : 'border-zinc-200 text-zinc-500 hover:border-black'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 border border-zinc-200 overflow-hidden">
                      {['cm', 'in'].map((u) => (
                        <button
                          key={u}
                          onClick={() => { setUnit(u); reset(); }}
                          className={`px-3 py-1.5 text-[10px] tracking-widest uppercase transition-colors ${
                            unit === u ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-50'
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { key: 'chest',  label: 'Chest / Bust', hint: 'fullest part of chest' },
                      { key: 'waist',  label: 'Waist',        hint: 'narrowest part' },
                      { key: 'hips',   label: 'Hips',         hint: 'fullest part' },
                      { key: 'height', label: 'Height',       hint: 'standing straight' },
                    ].map(({ key, label, hint }) => (
                      <div key={key}>
                        <label className="block text-[9px] tracking-[0.3em] uppercase text-zinc-400 mb-1.5">
                          {label} <span className="text-zinc-300 normal-case tracking-normal">({unit})</span>
                        </label>
                        <input
                          type="number"
                          value={form[key]}
                          onChange={(e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setResult(null); }}
                          placeholder={hint}
                          className="w-full border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors placeholder:text-zinc-300"
                        />
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-zinc-400 mb-4">
                    Chest measurement gives the most accurate result. Waist and hips improve precision. Height is used as a tiebreaker.
                  </p>

                  {/* Find button */}
                  <button
                    onClick={handleFind}
                    disabled={loading || (!form.chest && !form.waist)}
                    className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Find My Size <ChevronRight size={14} /></>
                    )}
                  </button>

                  {/* Result */}
                  {result && (
                    <div className="mt-6 border border-zinc-100 p-5 bg-zinc-50">
                      <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-400 mb-3">Recommended Size</p>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-5xl font-black text-black">{result.size}</span>
                        <div>
                          <span className={`inline-block text-[9px] tracking-widest uppercase px-2 py-1 font-semibold mb-1 ${
                            result.confidence === 'high'
                              ? 'bg-green-100 text-green-700'
                              : result.confidence === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-50 text-red-600'
                          }`}>
                            {result.confidence} confidence
                          </span>
                          {result.altSize && (
                            <p className="text-xs text-zinc-500">
                              Borderline — also consider <strong className="text-black">{result.altSize}</strong>
                            </p>
                          )}
                        </div>
                      </div>
                      {result.confidence === 'low' && (
                        <p className="text-xs text-zinc-500">
                          Your measurements are between sizes. We suggest ordering the larger size for comfort, or checking the size chart.
                        </p>
                      )}
                      <button
                        onClick={() => setTab('chart')}
                        className="mt-3 text-[10px] tracking-[0.2em] uppercase text-zinc-400 hover:text-black underline underline-offset-4 transition-colors"
                      >
                        View full size chart →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── CHART TAB ── */}
              {tab === 'chart' && (
                <div>
                  {/* Gender selector */}
                  <div className="flex gap-2 mb-6">
                    {['Kid', 'Women', 'Unisex'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase border transition-colors ${
                          gender === g
                            ? 'bg-black text-white border-black'
                            : 'border-zinc-200 text-zinc-500 hover:border-black'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b-2 border-black">
                          <th className="text-left py-2 pr-4 text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-medium">Size</th>
                          <th className="text-left py-2 px-4 text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-medium">Chest (cm)</th>
                          <th className="text-left py-2 px-4 text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-medium">Waist (cm)</th>
                          <th className="text-left py-2 px-4 text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-medium">Hips (cm)</th>
                          <th className="text-left py-2 pl-4 text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-medium">Height (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chart.map((row, i) => (
                          <tr key={row.size} className={`border-b border-zinc-100 ${i % 2 === 0 ? '' : 'bg-zinc-50/50'}`}>
                            <td className="py-3 pr-4 font-black text-black">{row.size}</td>
                            <td className="py-3 px-4 text-zinc-600">{row.chest[0]}–{row.chest[1]}</td>
                            <td className="py-3 px-4 text-zinc-600">{row.waist[0]}–{row.waist[1]}</td>
                            <td className="py-3 px-4 text-zinc-600">{row.hips[0]}–{row.hips[1]}</td>
                            <td className="py-3 pl-4 text-zinc-600">{row.height[0]}–{row.height[1]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* How to measure */}
                  <div className="mt-8 space-y-3">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 mb-3">How to Measure</p>
                    {[
                      ['Chest / Bust', 'Measure around the fullest part of your chest, keeping the tape horizontal.'],
                      ['Waist',        'Measure around your natural waistline — the narrowest part of your torso.'],
                      ['Hips',         'Measure around the fullest part of your hips, about 20cm below your waist.'],
                      ['Height',       'Stand straight against a wall without shoes. Measure from floor to top of head.'],
                    ].map(([label, desc]) => (
                      <div key={label} className="flex gap-3 text-sm">
                        <span className="text-zinc-400 w-28 shrink-0 font-medium">{label}</span>
                        <span className="text-zinc-500 leading-relaxed">{desc}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-zinc-50 text-xs text-zinc-500 leading-relaxed">
                    <strong className="text-zinc-700">Fit note:</strong> Schein cuts are minimal and tailored close to the body. If you're between sizes or prefer a relaxed fit, size up.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
