import type { Metadata } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Suspense } from 'react';
import { CartDrawer } from '@/components/CartDrawer';
import { TelegramChat } from '@/components/TelegramChat';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, ogImage } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--nf-inter' });
const interTight = Inter_Tight({ subsets: ['latin'], display: 'swap', variable: '--nf-inter-tight' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BM 4 U | Premium Meta Business Manager & Advertising Assets',
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    title: 'BM 4 U | Premium Meta Business Manager & Advertising Assets',
    description: SITE_DESCRIPTION,
    images: [{ url: ogImage(), width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BM 4 U | Premium Meta Business Manager & Advertising Assets',
    description: SITE_DESCRIPTION,
    images: [ogImage()],
  },
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
          <Suspense fallback={null}>
            <TelegramChat />
          </Suspense>
        </CartProvider>
      </body>
    </html>
  );
}
