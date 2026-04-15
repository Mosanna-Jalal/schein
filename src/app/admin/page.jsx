'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Plus, Edit2, Trash2, LogOut, Package, X, Check,
  Upload, Tag, DollarSign, AlignLeft, Star
} from 'lucide-react';

const EMPTY_FORM = {
  name: '', price: '', category: 'Men', description: '',
  image: '', featured: false, stock: 100,
};

export default function AdminDashboard() {
  const router = useRouter();
  const fileRef = useRef(null);

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
    if (auth) fetchProducts();
  }, [auth]);

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
      featured: p.featured, stock: p.stock,
    });
    setEditTarget(p._id);
    setFormError('');
    setModal('edit');
  };

  const handleUpload = async (file) => {
    setUploadLoading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) setForm((f) => ({ ...f, image: data.url }));
      else showToast(data.error || 'Upload failed', 'error');
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
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
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
                  Product Image *
                </label>
                <div
                  className="border-2 border-dashed border-zinc-200 p-4 text-center cursor-pointer hover:border-black transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  {form.image ? (
                    <div className="relative h-40">
                      <Image
                        src={form.image}
                        alt="Preview"
                        fill
                        className="object-contain"
                        sizes="400px"
                      />
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload size={24} className="text-zinc-300 mx-auto mb-2" />
                      <p className="text-xs text-zinc-400">Click to upload image</p>
                      <p className="text-[11px] text-zinc-300 mt-1">JPG, PNG, WebP — max 5 MB</p>
                    </div>
                  )}
                  {uploadLoading && (
                    <div className="mt-2 flex items-center justify-center gap-2 text-xs text-zinc-400">
                      <span className="w-3 h-3 border border-zinc-300 border-t-black rounded-full animate-spin" />
                      Uploading…
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])}
                />
                {/* Or paste URL */}
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="Or paste image URL…"
                  className="mt-2 w-full border border-zinc-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
                />
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
                    {['Men', 'Women', 'Unisex', 'Accessories'].map((c) => (
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
