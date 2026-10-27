import type { Metadata } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/CartDrawer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BM 4 U | Premium Meta Business Manager & Advertising Assets',
  description: 'Buy high-limit Facebook Business Managers, BM2500, Reinstated 2-line & 3-line accounts, TikTok manual payment accounts with 24H guarantee and instant delivery.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
      { url: '/logo-100.webp', type: 'image/webp', sizes: '100x100' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body className="min-h-screen bg-[#EDF0F2] text-[#0F172A] antialiased selection:bg-[#FBAD18]/30 selection:text-[#0F172A]">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
