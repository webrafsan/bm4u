import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Compass, ShoppingBag, BookOpen, KeyRound, UserCheck } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TelegramIcon } from '@/components/icons/TelegramIcon';
import { CATEGORY_PAGES } from '@/lib/categories';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist or has moved.',
  robots: { index: false, follow: true },
};

const QUICK_LINKS = [
  { href: '/shop', label: 'Browse the shop', desc: 'All Business Managers and accounts', icon: ShoppingBag },
  { href: '/tips', label: 'Read the guides', desc: 'Setup, security and scaling tips', icon: BookOpen },
  { href: '/fb-2fa', label: 'Free 2FA generator', desc: 'Get your login codes instantly', icon: KeyRound },
  { href: '/live-uid-checker', label: 'Live UID checker', desc: 'Check if a profile is active', icon: UserCheck },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#EDF0F2] flex flex-col text-[#0F172A]">
      <Navbar />

      <main className="flex-1 bg-cosmic relative px-4 sm:px-6 lg:px-8 py-14 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 badge-calon text-xs mb-5">
            <Compass className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Error 404</span>
          </div>

          <p className="font-heading text-7xl sm:text-8xl font-black text-gradient leading-none mb-4" aria-hidden="true">
            404
          </p>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            This page could not be found
          </h1>
          <p className="text-sm sm:text-base text-[#475569] max-w-xl mx-auto leading-relaxed">
            The link may be mistyped, or the product or guide may have moved or sold out. Use one of the shortcuts
            below to get back on track.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link href="/" className="btn-action btn-primary py-3.5 px-8 text-sm font-bold inline-flex items-center justify-center gap-2">
              <span>Back to home</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://t.me/bybm4u"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-action btn-ghost py-3.5 px-7 text-sm font-bold inline-flex items-center justify-center gap-2"
            >
              <TelegramIcon className="w-5 h-5" />
              <span>Ask on Telegram</span>
            </a>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {QUICK_LINKS.map(({ href, label, desc, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-4 rounded-2xl border border-[#CBD5E1] bg-white p-4 shadow-xs hover:border-[#FBAD18] transition-colors"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FBAD18]/15">
                  <Icon className="w-5 h-5 text-[#D97706]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold group-hover:text-[#D97706] transition-colors">{label}</span>
                  <span className="block text-xs text-[#64748B]">{desc}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#D97706] group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">Popular categories</p>
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {CATEGORY_PAGES.map(cat => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="inline-block rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-semibold text-[#475569] hover:border-[#FBAD18] hover:text-[#B45309] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
