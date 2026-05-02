'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Menu, X, User, ArrowRight, LogOut, Package, UserPlus, LogIn } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCustomer } from '@/context/CustomerContext';
import { useToast } from '@/context/ToastContext';

// Brand wordmark — orange acute accent over E, orange dot over I
function ScheinLogo() {
  const accent = 'bg-orange-400';
  return (
    <span className="text-xl font-black tracking-[0.3em] uppercase inline-flex items-center" aria-label="Schein">
      <span>SCH</span>
      <span className="relative inline-block">
        E
        <span
          aria-hidden="true"
          className={`absolute -top-[0.3em] left-[calc(50%_-_0.15em)] -translate-x-1/2 w-[0.55em] h-[0.16em] ${accent} -rotate-[50deg]`}
          style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%)' }}
        />
      </span>
      <span className="relative inline-block">
        I
        <span
          aria-hidden="true"
          className={`absolute -top-[0.18em] left-[calc(50%_-_0.15em)] -translate-x-1/2 w-[0.32em] h-[0.32em] ${accent} rounded-full`}
        />
      </span>
      <span>N</span>
    </span>
  );
}

export default function Navbar() {
  const { count } = useCart();
  const { wishlist } = useWishlist();
  const { customer, logout } = useCustomer();
  const { addToast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  // Close account dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!accountOpen) return;
    const onDocClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    const onEsc = (e) => { if (e.key === 'Escape') setAccountOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [accountOpen]);

  // Close dropdown on route change
  useEffect(() => { setAccountOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
    router.push('/');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isTransparent = isHome && !scrolled && !menuOpen;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Sale' },
    { href: '/shop?category=Men', label: 'Men' },
    { href: '/shop?category=Women', label: 'Women' },
    { href: '/shop?category=Kid', label: 'Kid', soon: true },
    { href: '/shop?category=Accessories', label: 'Accessories', soon: true },
    { href: '/franchise', label: 'Franchise' },
    { href: '/cart', label: 'Cart' },
  ];

  const desktopLinks = navLinks.slice(0, 6);

  const handleSoonClick = (e, label) => {
    e.preventDefault();
    addToast(`${label} — coming soon`, 'success');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isTransparent
            ? 'bg-transparent'
            : 'bg-white/90 backdrop-blur-md border-b border-zinc-200/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className={`transition-colors duration-500 ${
                isTransparent ? 'text-white' : 'text-black'
              }`}
            >
              <ScheinLogo />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-9">
              {desktopLinks.map((l) => {
                const baseCls = `relative text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                  isTransparent
                    ? 'text-white/60 hover:text-white'
                    : 'text-zinc-500 hover:text-black'
                }`;
                if (l.soon) {
                  return (
                    <button
                      key={l.href}
                      onClick={(e) => handleSoonClick(e, l.label)}
                      className={baseCls}
                    >
                      {l.label}
                      <span className="ml-1 text-[8px] tracking-[0.15em] text-orange-400 align-super">soon</span>
                    </button>
                  );
                }
                return (
                  <Link key={l.href} href={l.href} className={baseCls}>
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-5">
              <Link href="/shop?wishlist=true" className="relative p-1 group hidden sm:block">
                <Heart
                  size={18}
                  className={`transition-colors duration-300 group-hover:scale-110 ${
                    isTransparent ? 'text-white/70 hover:text-white' : 'text-zinc-700 hover:text-black'
                  }`}
                />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-semibold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative p-1 group">
                <ShoppingBag
                  size={18}
                  className={`transition-colors duration-300 group-hover:scale-110 ${
                    isTransparent ? 'text-white/70 hover:text-white' : 'text-zinc-700 hover:text-black'
                  }`}
                />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-semibold">
                    {count}
                  </span>
                )}
              </Link>

              <div ref={accountRef} className="relative">
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="relative p-1 group"
                  aria-label="Account menu"
                  aria-expanded={accountOpen}
                >
                  <User
                    size={18}
                    className={`transition-colors duration-300 ${
                      isTransparent ? 'text-white/70 hover:text-white' : 'text-zinc-700 hover:text-black'
                    }`}
                  />
                  {customer && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white" />
                  )}
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white border border-zinc-100 shadow-2xl py-2 origin-top-right animate-fade-in">
                    {customer ? (
                      <>
                        <div className="px-4 py-3 border-b border-zinc-100">
                          <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-0.5">Signed in as</p>
                          <p className="text-sm font-semibold text-black truncate">{customer.name}</p>
                          <p className="text-[11px] text-zinc-500 truncate">{customer.email}</p>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-black transition-colors"
                        >
                          <User size={14} className="text-zinc-400" /> My Account
                        </Link>
                        <Link
                          href="/account?tab=orders"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-black transition-colors"
                        >
                          <Package size={14} className="text-zinc-400" /> My Orders
                        </Link>
                        <Link
                          href="/shop?wishlist=true"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-black transition-colors"
                        >
                          <Heart size={14} className="text-zinc-400" /> Wishlist
                          {wishlist.length > 0 && (
                            <span className="ml-auto text-[10px] text-zinc-400">{wishlist.length}</span>
                          )}
                        </Link>
                        <div className="border-t border-zinc-100 mt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <LogOut size={14} /> Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b border-zinc-100">
                          <p className="text-sm font-semibold text-black mb-0.5">Welcome</p>
                          <p className="text-[11px] text-zinc-500">Sign in or create an account</p>
                        </div>
                        <Link
                          href="/account/login"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-black transition-colors"
                        >
                          <LogIn size={14} className="text-zinc-400" /> Sign In
                        </Link>
                        <Link
                          href="/account/login?tab=signup"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-black transition-colors"
                        >
                          <UserPlus size={14} className="text-zinc-400" /> Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-1"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X size={22} className="text-black" />
                ) : (
                  <Menu size={22} className={isTransparent ? 'text-white' : 'text-black'} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-menu-overlay md:hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 h-16 shrink-0 border-b border-white/10">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-white"
            >
              <ScheinLogo />
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1 text-white/60 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Nav links — fills all remaining space */}
          <nav className="flex-1 flex flex-col justify-center px-8 overflow-y-auto">
            {navLinks.map((l, i) => {
              const inner = (
                <>
                  <span className="text-2xl sm:text-3xl font-black text-white/60 group-hover:text-white transition-colors duration-200 tracking-tight flex items-center gap-2">
                    {l.label}
                    {l.soon && (
                      <span className="text-[9px] tracking-[0.2em] text-orange-400 font-semibold">SOON</span>
                    )}
                  </span>
                  <ArrowRight
                    size={18}
                    className="text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all duration-200"
                  />
                </>
              );
              if (l.soon) {
                return (
                  <button
                    key={l.href}
                    onClick={() => addToast(`${l.label} — coming soon`, 'success')}
                    className="animate-menu-item group flex items-center justify-between py-5 border-b border-white/[0.07] text-left w-full"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    {inner}
                  </button>
                );
              }
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="animate-menu-item group flex items-center justify-between py-5 border-b border-white/[0.07]"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  {inner}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-8 py-8 shrink-0 border-t border-white/10">
            <p className="text-[9px] tracking-[0.5em] uppercase text-zinc-600 mb-4">Connect</p>
            <div className="flex gap-8 mb-6">
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/schein_store' },
                { label: 'WhatsApp', href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917301580009'}` },
                { label: 'Facebook', href: '#' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href === '#' ? undefined : '_blank'}
                  rel={s.href === '#' ? undefined : 'noopener noreferrer'}
                  className="text-sm text-zinc-500 hover:text-white transition-colors tracking-wide"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/shop?wishlist=true"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-zinc-500 hover:text-white transition-colors"
              >
                <Heart size={14} />
                Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
              </Link>
              <span className="text-zinc-700">·</span>
              <Link
                href={customer ? '/account' : '/account/login'}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-zinc-500 hover:text-white transition-colors"
              >
                <User size={14} />
                {customer ? customer.name.split(' ')[0] : 'Sign In'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
