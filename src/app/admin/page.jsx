'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Plus, Edit2, Trash2, LogOut, Package, X, Check,
  Upload, Tag, DollarSign, Star
} from 'lucide-react';

const EMPTY_FORM = {
  name: '', price: '', category: 'Kid', description: '',
  image: '', images: ['', '', '', ''], featured: false, stock: 100,
};

export default function AdminDashboard() {
  const router = useRouter();
  const fileRef = useRef(null);
  const uploadSlotRef = useRef(null);
  const [uploadSlot, setUploadSlot] = useState(null); // 'main' | 0-3 — for loading indicator only

  const [auth, setAuth] = useState(null); // null=loading, false=not authed, true=authed
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false); // 'add' | 'edit' | false
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [formError, setFormError] = useState('');
  const [newsletter, setNewsletter] = useState({ subject: '', message: '' });
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [franchiseInquiries, setFranchiseInquiries] = useState([]);
  const [franchiseLoading, setFranchiseLoading] = useState(false);
  const [franchiseLoaded, setFranchiseLoaded] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [health, setHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthLog, setHealthLog] = useState([]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Check auth on mount
  useEffect(() => {
    fetch('/api/auth')
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) setAuth(true);
        else router.push('/admin/login');
      })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  // Fetch products when authed
  useEffect(() => {
    if (auth) {
      fetchProducts();
      fetchOrders();
    }
  }, [auth]);

  const runHealthCheck = async () => {
    setHealthLoading(true);
    setHealth(null);
    const log = [];
    const pushLog = (line) => {
      log.push(line);
      setHealthLog([...log]);
    };

    const ts = () => new Date().toLocaleTimeString('en-IN', { hour12: false });
    pushLog(`[${ts()}] $ schein-doctor --verbose`);
    pushLog(`[${ts()}] initializing diagnostic suite...`);
    await new Promise((r) => setTimeout(r, 200));
    pushLog(`[${ts()}] target: production (schein.in)`);
    pushLog(`[${ts()}] ─────────────────────────────────`);

    const checks = [
      { key: 'mongo',    label: 'MongoDB Atlas',     emoji: '🗄️' },
      { key: 'resend',   label: 'Resend (email)',    emoji: '✉️' },
      { key: 'razorpay', label: 'Razorpay (payments)', emoji: '💳' },
      { key: 'site',     label: 'schein.in (HTTP)',  emoji: '🌐' },
    ];

    const results = {};
    let deploy = null;

    for (const c of checks) {
      pushLog(`[${ts()}] ▸ probing ${c.label}...`);
      try {
        const res = await fetch(`/api/admin/health?only=${c.key}`);
        const data = await res.json();
        results[c.key] = data.result;
        deploy = data.deploy;
        const r = data.result;
        if (r.ok) {
          pushLog(`[${ts()}]   ✓ OK (${r.latencyMs}ms)`);
          if (r.info) {
            Object.entries(r.info).forEach(([k, v]) => {
              const val = Array.isArray(v) ? (v.join(', ') || '—') : v;
              pushLog(`[${ts()}]     · ${k}: ${val}`);
            });
          }
        } else {
          pushLog(`[${ts()}]   ✗ FAIL (${r.latencyMs}ms): ${r.error}`);
        }
      } catch (err) {
        results[c.key] = { ok: false, latencyMs: 0, error: err.message };
        pushLog(`[${ts()}]   ✗ FAIL: ${err.message}`);
      }
    }

    pushLog(`[${ts()}] ─────────────────────────────────`);
    const allOk = Object.values(results).every((r) => r.ok);
    pushLog(`[${ts()}] result: ${allOk ? 'HEALTHY ✓' : 'DEGRADED ✗'}`);
    pushLog(`[${ts()}] $ _`);

    setHealth({
      success: true,
      overall: allOk ? 'healthy' : 'degraded',
      checkedAt: new Date().toISOString(),
      deploy,
      checks: results,
    });
    setHealthLoading(false);
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      // silent
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setFormError('');
    setModal('add');
  };

  const openEdit = (p) => {
    setForm({
      name: p.name, price: String(p.price), category: p.category,
      description: p.description, image: p.image,
      images: p.images?.length ? [...p.images, ...Array(4).fill('')].slice(0, 4) : ['', '', '', ''],
      featured: p.featured, stock: p.stock,
    });
    setEditTarget(p._id);
    setFormError('');
    setModal('edit');
  };

  const triggerUpload = (slot) => {
    uploadSlotRef.current = slot; // sync ref — no stale closure
    setUploadSlot(slot);          // state — only for loading indicator
    fileRef.current?.click();
  };

  const handleUpload = async (file, slot) => {
    setUploadLoading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        if (slot === 'main') {
          setForm((f) => ({ ...f, image: data.url }));
        } else {
          setForm((f) => {
            const imgs = [...(f.images || ['', '', '', ''])];
            imgs[slot] = data.url;
            return { ...f, images: imgs };
          });
        }
      } else {
        showToast(data.error || 'Upload failed', 'error');
      }
    } catch {
      showToast('Upload failed', 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.image) { setFormError('Please upload a product image.'); return; }
    if (!form.name.trim()) { setFormError('Product name is required.'); return; }
    if (!form.price || isNaN(form.price)) { setFormError('Valid price is required.'); return; }

    setFormLoading(true);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: (form.images || []).filter(Boolean),
    };
    const url = editTarget ? `/api/products/${editTarget}` : '/api/products';
    const method = editTarget ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast(editTarget ? 'Product updated' : 'Product added');
        setModal(false);
        fetchProducts();
      } else {
        setFormError(data.error || 'Something went wrong');
      }
    } catch {
      setFormError('Network error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Product deleted');
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        showToast(data.error || 'Delete failed', 'error');
      }
    } catch {
      showToast('Delete failed', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  if (auth === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 text-sm font-medium shadow-lg animate-slide-up ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-black text-white'
        }`}>
          {toast.type === 'error' ? <X size={15} /> : <Check size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-xl font-bold tracking-[0.2em] uppercase text-black">
              Schein
            </a>
            <span className="text-zinc-300">|</span>
            <span className="text-xs tracking-widest uppercase text-zinc-400">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 hidden sm:block">{products.length} products</span>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors"
            >
              <Plus size={14} />
              Add Product
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-xs tracking-widest uppercase text-zinc-500 hover:text-black border border-zinc-200 hover:border-black transition-colors"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Products', val: products.length, icon: Package },
            { label: 'Featured', val: products.filter((p) => p.featured).length, icon: Star },
            { label: 'Categories', val: new Set(products.map((p) => p.category)).size, icon: Tag },
            {
              label: 'Avg Price',
              val: products.length
                ? `Rs. ${Math.round(products.reduce((s, p) => s + p.price, 0) / products.length).toLocaleString()}`
                : '—',
              icon: DollarSign,
            },
          ].map(({ label, val, icon: Icon }) => (
            <div key={label} className="bg-white border border-zinc-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={15} className="text-zinc-400" />
                <p className="text-[10px] tracking-widest uppercase text-zinc-400">{label}</p>
              </div>
              <p className="text-2xl font-bold text-black">{val}</p>
            </div>
          ))}
        </div>

        {/* Products table */}
        <div className="bg-white border border-zinc-100">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-700">
              Products
            </h2>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <span className="w-6 h-6 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <Package size={40} className="text-zinc-200 mx-auto mb-3" />
              <p className="text-sm text-zinc-400">No products yet. Add your first one!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 text-left">
                    {['Image', 'Name', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-[10px] tracking-widest uppercase text-zinc-400 font-medium"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="relative w-12 h-16 bg-zinc-100 overflow-hidden">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-black max-w-[180px] truncate">
                        {p.name}
                      </td>
                      <td className="px-6 py-4 text-zinc-500">{p.category}</td>
                      <td className="px-6 py-4 font-medium text-black">
                        Rs. {p.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-zinc-500">{p.stock}</td>
                      <td className="px-6 py-4">
                        {p.featured ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-black text-white px-2 py-0.5 uppercase tracking-widest">
                            <Star size={10} /> Yes
                          </span>
                        ) : (
                          <span className="text-zinc-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-1.5 hover:bg-zinc-100 rounded transition-colors text-zinc-600 hover:text-black"
                            aria-label="Edit"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            disabled={deleteId === p._id}
                            className="p-1.5 hover:bg-red-50 rounded transition-colors text-zinc-400 hover:text-red-500 disabled:opacity-50"
                            aria-label="Delete"
                          >
                            {deleteId === p._id ? (
                              <span className="w-3.5 h-3.5 border border-zinc-300 border-t-red-500 rounded-full animate-spin inline-block" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white border border-zinc-100 mt-8">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-700">Recent Orders</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {ordersLoading ? 'Loading…' : `${orders.length} order${orders.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <button
              onClick={fetchOrders}
              className="text-[10px] tracking-widest uppercase text-zinc-400 hover:text-black transition-colors"
            >
              Refresh
            </button>
          </div>
          {ordersLoading ? (
            <div className="py-16 flex justify-center">
              <span className="w-6 h-6 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center">
              <Package size={36} className="text-zinc-200 mx-auto mb-3" />
              <p className="text-sm text-zinc-400">No orders yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 text-left">
                    {['Date', 'Payment ID', 'Items', 'Amount', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-3 text-[10px] tracking-widest uppercase text-zinc-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-zinc-50">
                      <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-zinc-600">{o.razorpayPaymentId}</td>
                      <td className="px-6 py-4 text-zinc-700 max-w-[280px]">
                        {(o.items || []).map((it) => `${it.name}${it.size ? ` (${it.size})` : ''} x${it.quantity}`).join(', ')}
                      </td>
                      <td className="px-6 py-4 font-semibold text-black whitespace-nowrap">Rs. {o.amount?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block text-[9px] tracking-widest uppercase px-2 py-1 bg-green-50 text-green-700">
                          {o.status || 'paid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* System Health */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white border border-zinc-100 mt-8">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-700">System Health</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {health
                  ? `Last checked ${new Date(health.checkedAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}`
                  : 'Verify all integrations are operational'}
              </p>
            </div>
            <button
              onClick={runHealthCheck}
              disabled={healthLoading}
              className="text-[10px] tracking-widest uppercase px-4 py-2 bg-black text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              {healthLoading ? 'Running…' : health ? 'Run Again' : 'Run Check'}
            </button>
          </div>
          {(healthLoading || healthLog.length > 0) && (
            <div className="px-6 pt-6">
              <div className="bg-zinc-950 text-green-400 font-mono text-[11px] leading-relaxed p-4 max-h-72 overflow-y-auto rounded-sm">
                {healthLog.map((line, i) => {
                  let cls = 'text-zinc-400';
                  if (line.includes('✓')) cls = 'text-green-400';
                  else if (line.includes('✗')) cls = 'text-red-400';
                  else if (line.includes('▸')) cls = 'text-amber-400';
                  else if (line.includes('$')) cls = 'text-cyan-400';
                  return <div key={i} className={cls}>{line}</div>;
                })}
                {healthLoading && (
                  <span className="inline-block w-2 h-3 bg-green-400 animate-pulse ml-1" />
                )}
              </div>
            </div>
          )}
          {health && !healthLoading && (
            <div className="p-6">
              {/* Overall status */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100">
                <span className={`w-3 h-3 rounded-full ${health.overall === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-semibold uppercase tracking-widest ${health.overall === 'healthy' ? 'text-green-700' : 'text-red-600'}`}>
                  {health.overall || 'Error'}
                </span>
                {health.deploy && (
                  <span className="ml-auto text-[10px] text-zinc-400 font-mono">
                    {health.deploy.commit?.slice(0, 7) || 'local'} · {health.deploy.region}
                  </span>
                )}
              </div>
              {/* Individual checks */}
              {health.checks ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(health.checks).map(([name, check]) => (
                    <div key={name} className={`border p-4 ${check.ok ? 'border-zinc-100 bg-zinc-50/50' : 'border-red-200 bg-red-50/40'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${check.ok ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-700">{name}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400">{check.latencyMs}ms</span>
                      </div>
                      {check.ok ? (
                        check.info && (
                          <pre className="text-[11px] text-zinc-500 whitespace-pre-wrap break-words font-mono">
                            {Object.entries(check.info).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') || '—' : v}`).join('\n')}
                          </pre>
                        )
                      ) : (
                        <p className="text-[11px] text-red-600 font-mono break-words">{check.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-red-600">{health.error || 'Health check failed'}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Broadcast */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white border border-zinc-100 mt-8">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-700">Newsletter Broadcast</h2>
              {subscriberCount !== null && (
                <p className="text-xs text-zinc-400 mt-0.5">{subscriberCount} subscriber{subscriberCount !== 1 ? 's' : ''}</p>
              )}
            </div>
            <button
              onClick={async () => {
                const res = await fetch('/api/newsletter/subscribers');
                const data = await res.json();
                setSubscriberCount(data.count ?? 0);
              }}
              className="text-[10px] tracking-widest uppercase text-zinc-400 hover:text-black transition-colors"
            >
              Check Count
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-2">Subject</label>
              <input
                type="text"
                value={newsletter.subject}
                onChange={(e) => setNewsletter({ ...newsletter, subject: e.target.value })}
                placeholder="New Collection — Summer 2026"
                className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-2">Message</label>
              <textarea
                value={newsletter.message}
                onChange={(e) => setNewsletter({ ...newsletter, message: e.target.value })}
                placeholder="Write your message to subscribers here..."
                rows={6}
                className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-black resize-none"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-zinc-400">Email will be sent to all subscribers instantly.</p>
              <button
                onClick={async () => {
                  if (!newsletter.subject.trim() || !newsletter.message.trim()) {
                    showToast('Subject and message are required', 'error');
                    return;
                  }
                  setNewsletterLoading(true);
                  try {
                    const res = await fetch('/api/newsletter/broadcast', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newsletter),
                    });
                    const data = await res.json();
                    if (data.success) {
                      showToast(`Sent to ${data.sent} subscriber${data.sent !== 1 ? 's' : ''}`);
                      setNewsletter({ subject: '', message: '' });
                    } else {
                      showToast(data.error || 'Failed to send', 'error');
                    }
                  } catch {
                    showToast('Network error', 'error');
                  }
                  setNewsletterLoading(false);
                }}
                disabled={newsletterLoading}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors disabled:opacity-60"
              >
                {newsletterLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Send to All Subscribers'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Franchise Inquiries */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white border border-zinc-100 mt-8">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-700">Franchise Inquiries</h2>
            <button
              onClick={async () => {
                setFranchiseLoading(true);
                const res = await fetch('/api/franchise');
                const data = await res.json();
                if (data.success) { setFranchiseInquiries(data.inquiries); setFranchiseLoaded(true); }
                setFranchiseLoading(false);
              }}
              className="flex items-center gap-2 text-xs tracking-widest uppercase text-zinc-400 hover:text-black transition-colors"
            >
              {franchiseLoading
                ? <span className="w-3 h-3 border border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
                : franchiseLoaded ? 'Refresh' : 'Load Inquiries'}
            </button>
          </div>

          {!franchiseLoaded ? (
            <div className="px-6 py-10 text-center text-zinc-400 text-sm">Click "Load Inquiries" to view submissions.</div>
          ) : franchiseInquiries.length === 0 ? (
            <div className="px-6 py-10 text-center text-zinc-400 text-sm">No franchise inquiries yet.</div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {franchiseInquiries.map((inq) => (
                <div key={inq._id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <p className="font-semibold text-black text-sm">{inq.name}</p>
                      <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 ${
                        inq.status === 'approved' ? 'bg-green-100 text-green-700' :
                        inq.status === 'rejected' ? 'bg-red-100 text-red-600' :
                        inq.status === 'contacted' ? 'bg-blue-100 text-blue-600' :
                        'bg-amber-100 text-amber-700'
                      }`}>{inq.status}</span>
                    </div>
                    <p className="text-xs text-zinc-500">{inq.email} · {inq.phone}</p>
                    <p className="text-xs text-zinc-500">{inq.city}, {inq.state} · {inq.investment}</p>
                    {inq.spaceArea && <p className="text-xs text-zinc-400 mt-0.5">Space: {inq.spaceArea}</p>}
                    {inq.experience && <p className="text-xs text-zinc-400">Experience: {inq.experience}</p>}
                    {inq.message && <p className="text-xs text-zinc-400 mt-1 italic">"{inq.message}"</p>}
                    <p className="text-[10px] text-zinc-300 mt-1">{new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {['new','contacted','approved','rejected'].map((s) => (
                      <button
                        key={s}
                        onClick={async () => {
                          await fetch('/api/franchise', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: inq._id, status: s }),
                          });
                          setFranchiseInquiries((prev) =>
                            prev.map((i) => i._id === inq._id ? { ...i, status: s } : i)
                          );
                        }}
                        className={`text-[9px] tracking-widest uppercase px-2 py-1 border transition-colors ${
                          inq.status === s ? 'bg-black text-white border-black' : 'border-zinc-200 text-zinc-400 hover:border-zinc-500 hover:text-black'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 sticky top-0 bg-white z-10">
              <h3 className="text-sm tracking-widest uppercase font-semibold text-zinc-700">
                {modal === 'edit' ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={() => setModal(false)} className="text-zinc-400 hover:text-black">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
              {formError && (
                <div className="px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded">
                  {formError}
                </div>
              )}

              {/* Image upload */}
              <div>
                <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-2">
                  Product Images * (1 main + up to 4 gallery)
                </label>

                {/* Hidden file input shared across all slots */}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleUpload(e.target.files[0], uploadSlotRef.current);
                      e.target.value = '';
                    }
                  }}
                />

                {/* Main image */}
                <div
                  className="border-2 border-dashed border-zinc-200 p-4 text-center cursor-pointer hover:border-black transition-colors"
                  onClick={() => triggerUpload('main')}
                >
                  {form.image ? (
                    <div className="relative h-40">
                      <Image src={form.image} alt="Main" fill className="object-contain" sizes="400px" />
                    </div>
                  ) : (
                    <div className="py-6">
                      <Upload size={22} className="text-zinc-300 mx-auto mb-2" />
                      <p className="text-xs text-zinc-400">Main image (cover)</p>
                      <p className="text-[11px] text-zinc-300 mt-1">JPG, PNG, WebP — max 5 MB</p>
                    </div>
                  )}
                  {uploadLoading && uploadSlot === 'main' && (
                    <div className="mt-2 flex items-center justify-center gap-2 text-xs text-zinc-400">
                      <span className="w-3 h-3 border border-zinc-300 border-t-black rounded-full animate-spin" />
                      Uploading…
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="Or paste main image URL…"
                    className="flex-1 border border-zinc-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                  {form.image && (
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, image: '' }))}
                      className="px-3 py-2 text-[10px] tracking-widest uppercase text-zinc-400 hover:text-red-500 border border-zinc-200 hover:border-red-300 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Gallery images (4 slots) */}
                <p className="text-[10px] tracking-widest uppercase text-zinc-400 mt-4 mb-2">Gallery Images</p>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx}>
                      <div
                        className="border border-dashed border-zinc-200 cursor-pointer hover:border-black transition-colors aspect-square flex items-center justify-center overflow-hidden"
                        onClick={() => triggerUpload(idx)}
                      >
                        {form.images?.[idx] ? (
                          <div className="relative w-full h-full">
                            <Image src={form.images[idx]} alt={`Gallery ${idx + 1}`} fill className="object-cover" sizes="100px" />
                          </div>
                        ) : uploadLoading && uploadSlot === idx ? (
                          <span className="w-4 h-4 border border-zinc-300 border-t-black rounded-full animate-spin" />
                        ) : (
                          <Upload size={16} className="text-zinc-300" />
                        )}
                      </div>
                      {form.images?.[idx] && (
                        <button
                          type="button"
                          onClick={() => {
                            const imgs = [...(form.images || ['', '', '', ''])];
                            imgs[idx] = '';
                            setForm((f) => ({ ...f, images: imgs }));
                          }}
                          className="w-full text-[9px] text-zinc-400 hover:text-red-500 mt-0.5 text-center"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                  placeholder="Product name"
                />
              </div>

              {/* Price + Category row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                    Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    min={0}
                    className="w-full border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                    placeholder="2500"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black bg-white"
                  >
                    {['Kid', 'Women', 'Unisex', 'Accessories'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black resize-none"
                  placeholder="Short product description…"
                />
              </div>

              {/* Stock + Featured row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    min={0}
                    className="w-full border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div className="flex items-end pb-2.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setForm({ ...form, featured: !form.featured })}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        form.featured ? 'bg-black' : 'bg-zinc-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          form.featured ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </div>
                    <span className="text-sm text-zinc-600">Featured</span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={formLoading || uploadLoading}
                className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors disabled:opacity-60"
              >
                {formLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {modal === 'edit' ? <Check size={15} /> : <Plus size={15} />}
                    {modal === 'edit' ? 'Save Changes' : 'Add Product'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
