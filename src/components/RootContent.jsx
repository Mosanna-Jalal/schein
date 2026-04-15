'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import NavigationLoader from './NavigationLoader';

// Admin pages handle their own layout
const ADMIN_PATHS = ['/admin'];

export default function RootContent({ children }) {
  const pathname = usePathname();
  const isAdmin = ADMIN_PATHS.some((p) => pathname.startsWith(p));

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <NavigationLoader />
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
