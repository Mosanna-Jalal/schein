'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Inner component — needs Suspense because useSearchParams() requires it
function LoaderCore() {
  const pathname      = usePathname();
  const searchParams  = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const hideTimer = useRef(null);

  // Build a full URL key — changes on BOTH pathname and query-string changes
  const urlKey = pathname + '?' + searchParams.toString();

  // When the URL key changes → new page mounted → fade out
  useEffect(() => {
    if (!visible) return;
    setLeaving(true);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      setLeaving(false);
    }, 380);
    return () => clearTimeout(hideTimer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey]);

  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Skip: external, hash-only, mailto/tel, new-tab
      if (
        href.startsWith('http') ||
        href.startsWith('//') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.target === '_blank'
      ) return;

      // Skip if href resolves to the exact same URL currently shown
      try {
        const next = new URL(href, window.location.href);
        if (next.pathname === window.location.pathname &&
            next.search   === window.location.search) return;
      } catch { return; }

      clearTimeout(hideTimer.current);
      setLeaving(false);
      setVisible(true);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white pointer-events-none"
      style={{
        opacity:    leaving ? 0 : 1,
        transition: leaving ? 'opacity 0.38s ease' : 'opacity 0.15s ease',
      }}
    >
      <p
        className="font-black tracking-[0.35em] uppercase text-black"
        style={{ fontSize: 'clamp(18px, 4vw, 28px)' }}
      >
        Schein
      </p>
      <span
        className="block mt-3 h-px bg-amber-500"
        style={{ animation: 'schein-loader-line 1.4s cubic-bezier(0.4,0,0.2,1) infinite' }}
      />
    </div>
  );
}

// Suspense wrapper required by Next.js for useSearchParams in client components
export default function NavigationLoader() {
  return (
    <Suspense fallback={null}>
      <LoaderCore />
    </Suspense>
  );
}
