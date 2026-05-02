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

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
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
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/schein_store',
    Icon: InstagramIcon,
    hoverColor:
      'hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-amber-400 hover:border-transparent hover:text-white active:bg-gradient-to-br active:from-purple-600 active:via-pink-500 active:to-amber-400 active:border-transparent active:text-white',
  },
  {
    label: 'WhatsApp',
    href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917301580009'}`,
    Icon: WhatsAppIcon,
    hoverColor:
      'hover:bg-green-500 hover:border-green-500 hover:text-white active:bg-green-500 active:border-green-500 active:text-white',
  },
  {
    label: 'Facebook',
    href: '#',
    Icon: FacebookIcon,
    hoverColor:
      'hover:bg-blue-600 hover:border-blue-600 hover:text-white active:bg-blue-600 active:border-blue-600 active:text-white',
  },
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
                  target={href === '#' ? undefined : '_blank'}
                  rel={href === '#' ? undefined : 'noopener noreferrer'}
                  aria-label={label}
                  className={`w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center border border-white/15 text-zinc-400 transition-all duration-300 ${hoverColor}`}
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
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase border border-white/20 px-4 py-3 sm:py-2.5 hover:bg-white hover:text-black transition-all duration-200"
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
