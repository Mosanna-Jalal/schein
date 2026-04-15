import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {/* Brand — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-xl font-black tracking-[0.3em] uppercase mb-4">Schein</h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Premium clothing crafted for those who value simplicity, quality, and style.
            </p>
            <div className="flex gap-5 mt-6">
              {['Instagram', 'X', 'Facebook'].map((s) => (
                <a key={s} href="#" className="text-xs tracking-widest uppercase text-zinc-500 hover:text-amber-400 transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 mb-5">Shop</h3>
            <ul className="space-y-3">
              {[
                { label: 'All Products', href: '/shop' },
                { label: 'Men', href: '/shop?category=Men' },
                { label: 'Women', href: '/shop?category=Women' },
                { label: 'Unisex', href: '/shop?category=Unisex' },
                { label: 'Accessories', href: '/shop?category=Accessories' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-zinc-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 mb-5">Info</h3>
            <ul className="space-y-3">
              {['About Us', 'Size Guide', 'Shipping & Returns', 'FAQ', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 mb-5">Contact</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-5">
              Order via WhatsApp for fast, personal service.
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917301580009'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase border border-white/20 px-4 py-2.5 hover:bg-white hover:text-black transition-all duration-200"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-zinc-600">
          <p>© {new Date().getFullYear()} Schein. All rights reserved.</p>
          <p>Designed & Developed by Mosanna Jalal (MJX WEB STUDIO)</p>
        </div>
      </div>
    </footer>
  );
}
