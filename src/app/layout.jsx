import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import { CustomerProvider } from '@/context/CustomerContext';
import RootContent from '@/components/RootContent';
import OfferPopup from '@/components/OfferPopup';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Schein — Premium Clothing',
  description: 'Minimal, premium fashion for those who value simplicity and quality.',
  keywords: ['fashion', 'clothing', 'premium', 'minimalist', 'schein'],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <CustomerProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <OfferPopup />
                <RootContent>{children}</RootContent>
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </CustomerProvider>
      </body>
    </html>
  );
}
