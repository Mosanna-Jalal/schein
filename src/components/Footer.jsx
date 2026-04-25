import Link from 'next/link';
import FooterNewsletter from './FooterNewsletter';

// Inline SVG icons — no extra dependency needed
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.733-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

const SOCIALS = [
  { label: 'Instagram', href: '#', Icon: InstagramIcon, hoverColor: 'hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-amber-400 hover:border-transparent hover:text-white' },
  { label: 'X',         href: '#', Icon: XIcon,         hoverColor: 'hover:bg-white hover:border-white hover:text-black' },
  { label: 'Facebook',  href: '#', Icon: FacebookIcon,  hoverColor: 'hover:bg-blue-600 hover:border-blue-600 hover:text-white' },
];

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

            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              {SOCIALS.map(({ label, href, Icon, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 flex items-center justify-center border border-white/15 text-zinc-400 transition-all duration-300 ${hoverColor}`}
                >
                  <Icon />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-500 mb-2">Newsletter</p>
              <FooterNewsletter />
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 mb-5">Shop</h3>
            <ul className="space-y-3">
              {[
                { label: 'All Products', href: '/shop' },
                { label: 'Women',        href: '/shop?category=Women' },
                { label: 'Kid',          href: '/shop?category=Kid' },
                { label: 'Unisex',       href: '/shop?category=Unisex' },
                { label: 'Accessories',  href: '/shop?category=Accessories' },
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
              <li>
                <Link href="/franchise" className="text-sm text-amber-500 hover:text-amber-400 transition-colors font-medium">
                  Franchise Opportunity
                </Link>
              </li>
              {['About Us', 'Size Guide', 'Shipping & Returns', 'FAQ', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/admin" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Visit Us */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 mb-5">Visit Us</h3>
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">SCHÉIN STORE</p>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              Gate no-3, near M I Plaza,<br />
              opp. Gaya Club, White House Compound,<br />
              Judges Colony, Gaya, Bihar 823001
            </p>
            <p className="text-sm text-zinc-500 mb-5">Mon – Sun &nbsp;·&nbsp; 10 AM – 10 PM</p>
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
          <p>Designed &amp; Developed by Mosanna Jalal </p>
          <p>(MJX WEB STUDIO)</p>
        </div>
      </div>
    </footer>
  );
}
